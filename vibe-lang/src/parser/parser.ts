// ============================================================
// Vibe Language — Recursive Descent Parser
// Converts a token stream into a Program AST.
// ============================================================

import { Token, TokenType, Loc } from "../lexer/tokens.js";
import { VibeError } from "../errors.js";
import {
  Program,
  TopLevelDecl,
  FnDecl,
  Param,
  LetDecl,
  ConstDecl,
  StructDecl,
  StructField,
  EnumDecl,
  EnumVariant,
  VariantField,
  TraitDecl,
  TraitImplDecl,
  Annotation,
  Stmt,
  IfStmt,
  ForStmt,
  ForInVariant,
  ForCondVariant,
  MatchStmt,
  MatchArm,
  MatchPattern,
  ReturnStmt,
  BreakStmt,
  ContinueStmt,
  Assignment,
  ExprStmt,
  Expr,
  IntLiteral,
  FloatLiteral,
  StringLiteral,
  BoolLiteral,
  Identifier,
  BinaryExpr,
  UnaryExpr,
  CallExpr,
  FieldAccess,
  IndexAccess,
  GroupExpr,
  ListLiteral,
  MapLiteral,
  MatchExpr,
} from "./ast.js";

// ── Public API ──────────────────────────────────────────────

export function parse(tokens: Token[], filename: string = "<stdin>"): Program {
  const parser = new Parser(tokens, filename);
  return parser.parseProgram();
}

// ── Internal Parser ─────────────────────────────────────────

class Parser {
  private tokens: Token[];
  private pos: number = 0;
  private filename: string;

  constructor(tokens: Token[], filename: string) {
    this.tokens = tokens;
    this.filename = filename;
  }

  // ── Helpers ─────────────────────────────────────────────

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private at(type: TokenType): boolean {
    return this.peek().type === type;
  }

  private advance(): Token {
    const tok = this.tokens[this.pos];
    this.pos++;
    return tok;
  }

  private expect(type: TokenType): Token {
    const tok = this.peek();
    if (tok.type !== type) {
      throw new VibeError(
        this.filename,
        tok.line,
        tok.col,
        "parser",
        `expected ${type}, got ${tok.type} ("${tok.value}")`,
      );
    }
    return this.advance();
  }

  /**
   * Expect NEWLINE, but tolerate an optional `:` before it.
   * This handles LLM-generated code with Python-style trailing colons
   * (e.g., `fn foo():` or `if x > 0:`) without changing the language spec.
   * The `:` is silently consumed as noise — it carries zero semantic information
   * in block-header position.
   */
  private expectNewlineTolerateColon(): void {
    if (this.at(TokenType.COLON)) {
      this.advance(); // silently consume trailing ':'
    }
    this.expect(TokenType.NEWLINE);
  }

  private loc(token: Token): Loc {
    return { line: token.line, col: token.col };
  }

  /**
   * Expect an identifier or a keyword usable as a field/method name (e.g., `obj.has()`).
   * Keywords like `has`, `in`, `not` etc. may appear after `.` as method names.
   */
  private expectIdentOrKeyword(): Token {
    const tok = this.peek();
    if (tok.type === TokenType.IDENT) {
      return this.advance();
    }
    // Allow keywords as field/method names after `.`
    if (tok.type.startsWith("KW_")) {
      return this.advance();
    }
    throw new VibeError(
      this.filename,
      tok.line,
      tok.col,
      "parser",
      `expected identifier, got ${tok.type} ("${tok.value}")`,
    );
  }

  /** Skip any NEWLINE tokens (blank lines between statements). */
  private skipNewlines(): void {
    while (this.peek().type === TokenType.NEWLINE) {
      this.advance();
    }
  }

  // ── Program ─────────────────────────────────────────────

  parseProgram(): Program {
    const firstTok = this.peek();
    const body: TopLevelDecl[] = [];

    this.skipNewlines();
    while (!this.at(TokenType.EOF)) {
      body.push(this.parseTopLevelDecl());
      this.skipNewlines();
    }

    return { kind: "Program", body, loc: this.loc(firstTok) };
  }

  // ── Top-level declarations ──────────────────────────────

  private parseTopLevelDecl(): TopLevelDecl {
    // Collect annotations before the declaration
    const annotations: Annotation[] = [];
    while (this.at(TokenType.AT)) {
      annotations.push(this.parseAnnotation());
      this.skipNewlines();
    }

    const tok = this.peek();

    // Skip orphaned INDENT blocks at top level (e.g. LLM generates trait body without header)
    if (tok.type === TokenType.INDENT) {
      this.advance(); // consume INDENT
      this.skipNewlines();
      while (!this.at(TokenType.DEDENT) && !this.at(TokenType.EOF)) {
        this.advance();
        this.skipNewlines();
      }
      if (this.at(TokenType.DEDENT)) {
        this.advance();
      }
      this.skipNewlines();
      return this.parseTopLevelDecl();
    }

    switch (tok.type) {
      case TokenType.KW_FN:
        return this.parseFnDecl(annotations);
      case TokenType.KW_LET:
        return this.parseLetDecl();
      case TokenType.KW_CONST:
        return this.parseConstDecl();
      case TokenType.KW_STRUCT:
        return this.parseStructDecl(annotations);
      case TokenType.KW_ENUM:
        return this.parseEnumDecl(annotations);
      case TokenType.KW_TRAIT:
        return this.parseTraitDecl(annotations);
      case TokenType.KW_IF:
        return this.parseIfStmt();
      case TokenType.KW_FOR:
        return this.parseForStmt();
      case TokenType.KW_MATCH:
        return this.parseMatchStmt();
      default:
        // Allow top-level expression statements (e.g. function calls like load())
        return this.parseAssignOrExprStmt() as ExprStmt | Assignment;
    }
  }

  // ── FnDecl ──────────────────────────────────────────────

  private parseFnDecl(annotations: Annotation[] = []): FnDecl {
    const kwTok = this.expect(TokenType.KW_FN);
    const nameTok = this.expect(TokenType.IDENT);
    this.expect(TokenType.LPAREN);
    const params = this.parseParamList();
    this.expect(TokenType.RPAREN);

    // Optional return type annotation: -> Type
    if (this.at(TokenType.ARROW)) {
      this.advance(); // consume ->
      this.consumeTypeAnnotation(); // consume full type (e.g., Map[String, Float])
    }

    this.expectNewlineTolerateColon();
    const body = this.parseIndentedBlock();

    return {
      kind: "FnDecl",
      name: nameTok.value,
      params,
      body,
      annotations,
      loc: this.loc(kwTok),
    };
  }

  private parseParamList(): Param[] {
    const params: Param[] = [];
    if (this.at(TokenType.RPAREN)) {
      return params;
    }

    params.push(this.parseParam());
    while (this.at(TokenType.COMMA)) {
      this.advance(); // consume comma
      params.push(this.parseParam());
    }

    return params;
  }

  private parseParam(): Param {
    const nameTok = this.expect(TokenType.IDENT);
    let typeAnnotation: string | undefined;
    if (this.at(TokenType.COLON)) {
      this.advance(); // consume :
      typeAnnotation = this.consumeTypeAnnotation();
    }
    return { name: nameTok.value, typeAnnotation, loc: this.loc(nameTok) };
  }

  /** Consume a type annotation like `Float`, `List[Float]`, `Map[String, Int]`, `Int?`. */
  private consumeTypeAnnotation(): string {
    const typeTok = this.expect(TokenType.IDENT);
    let annotation = typeTok.value;
    // Handle generic type: List[Float], Map[String, Int]
    if (this.at(TokenType.LBRACKET)) {
      this.advance(); // consume [
      annotation += "[";
      annotation += this.consumeTypeAnnotation();
      while (this.at(TokenType.COMMA)) {
        this.advance();
        annotation += ", ";
        annotation += this.consumeTypeAnnotation();
      }
      this.expect(TokenType.RBRACKET);
      annotation += "]";
    }
    // Handle Optional type suffix: Int?, Vec2?, List[String]?
    if (this.at(TokenType.QUESTION)) {
      this.advance();
      annotation += "?";
    }
    return annotation;
  }

  // ── Annotation ─────────────────────────────────────────

  private parseAnnotation(): Annotation {
    const atTok = this.expect(TokenType.AT);
    const nameTok = this.expect(TokenType.IDENT);
    const args: Expr[] = [];

    // Optional args: @on("collision", "enemy")
    if (this.at(TokenType.LPAREN)) {
      this.advance(); // consume (
      if (!this.at(TokenType.RPAREN)) {
        args.push(this.parseExpr());
        while (this.at(TokenType.COMMA)) {
          this.advance();
          args.push(this.parseExpr());
        }
      }
      this.expect(TokenType.RPAREN);
    }

    this.expectNewlineOrEOF();
    return { name: nameTok.value, args, loc: this.loc(atTok) };
  }

  // ── StructDecl ────────────────────────────────────────

  private parseStructDecl(annotations: Annotation[]): StructDecl {
    const kwTok = this.expect(TokenType.KW_STRUCT);
    const nameTok = this.expect(TokenType.IDENT);

    // Optional: has Trait1, Trait2
    const traits = this.parseHasClause();

    this.expectNewlineTolerateColon();

    // Parse struct body: fields and methods
    const fields: StructField[] = [];
    const methods: FnDecl[] = [];

    if (this.at(TokenType.INDENT)) {
      this.advance(); // consume INDENT
      this.skipNewlines();

      while (!this.at(TokenType.DEDENT) && !this.at(TokenType.EOF)) {
        if (this.at(TokenType.KW_FN)) {
          methods.push(this.parseFnDecl([]));
        } else {
          fields.push(this.parseStructField());
        }
        this.skipNewlines();
      }

      this.expect(TokenType.DEDENT);
    }

    return {
      kind: "StructDecl",
      name: nameTok.value,
      traits,
      fields,
      methods,
      annotations,
      loc: this.loc(kwTok),
    };
  }

  private parseStructField(): StructField {
    // Allow optional `let` prefix (LLMs often generate `let x: Float` in struct bodies)
    if (this.at(TokenType.KW_LET) || this.at(TokenType.KW_CONST)) {
      this.advance();
    }
    const nameTok = this.expect(TokenType.IDENT);
    this.expect(TokenType.COLON);
    const typeAnnotation = this.consumeTypeAnnotation();

    let defaultValue: Expr | undefined;
    if (this.at(TokenType.EQ)) {
      this.advance(); // consume =
      defaultValue = this.parseExpr();
    }

    this.expectNewlineOrEOF();
    return {
      name: nameTok.value,
      typeAnnotation,
      defaultValue,
      loc: this.loc(nameTok),
    };
  }

  /** Parse optional `has Trait1, Trait2` clause. */
  private parseHasClause(): string[] {
    const traits: string[] = [];
    if (this.at(TokenType.KW_HAS)) {
      this.advance(); // consume has
      traits.push(this.expect(TokenType.IDENT).value);
      while (this.at(TokenType.COMMA)) {
        this.advance();
        traits.push(this.expect(TokenType.IDENT).value);
      }
    }
    return traits;
  }

  // ── EnumDecl ──────────────────────────────────────────

  private parseEnumDecl(annotations: Annotation[]): EnumDecl {
    const kwTok = this.expect(TokenType.KW_ENUM);
    const nameTok = this.expect(TokenType.IDENT);
    this.expectNewlineTolerateColon();

    const variants: EnumVariant[] = [];

    if (this.at(TokenType.INDENT)) {
      this.advance(); // consume INDENT
      this.skipNewlines();

      while (!this.at(TokenType.DEDENT) && !this.at(TokenType.EOF)) {
        variants.push(this.parseEnumVariant());
        this.skipNewlines();
      }

      this.expect(TokenType.DEDENT);
    }

    return {
      kind: "EnumDecl",
      name: nameTok.value,
      variants,
      annotations,
      loc: this.loc(kwTok),
    };
  }

  private parseEnumVariant(): EnumVariant {
    const nameTok = this.expect(TokenType.IDENT);
    const fields: VariantField[] = [];

    // Optional: Variant(field1: Type1, field2: Type2)
    if (this.at(TokenType.LPAREN)) {
      this.advance(); // consume (
      if (!this.at(TokenType.RPAREN)) {
        fields.push(this.parseVariantField());
        while (this.at(TokenType.COMMA)) {
          this.advance();
          fields.push(this.parseVariantField());
        }
      }
      this.expect(TokenType.RPAREN);
    }

    this.expectNewlineOrEOF();
    return { name: nameTok.value, fields, loc: this.loc(nameTok) };
  }

  private parseVariantField(): VariantField {
    // Could be `name: Type` or just `Type`
    const tok = this.expect(TokenType.IDENT);
    if (this.at(TokenType.COLON)) {
      // Named field: name: Type
      this.advance(); // consume :
      const typeAnnotation = this.consumeTypeAnnotation();
      return { name: tok.value, typeAnnotation };
    }
    // Positional: just a type name
    return { typeAnnotation: tok.value };
  }

  // ── TraitDecl / TraitImplDecl ─────────────────────────

  private parseTraitDecl(annotations: Annotation[]): TraitDecl | TraitImplDecl {
    const kwTok = this.expect(TokenType.KW_TRAIT);
    const nameTok = this.expect(TokenType.IDENT);

    // Check for trait impl: `trait Drawable has Player`
    // Per PEG: TraitImplDecl <- 'trait' IDENT 'has' IDENT NEWLINE TraitImplBody
    if (this.at(TokenType.KW_HAS)) {
      this.advance(); // consume has
      const targetTok = this.expect(TokenType.IDENT);

      this.expectNewlineTolerateColon();
      const methods: FnDecl[] = [];

      if (this.at(TokenType.INDENT)) {
        this.advance();
        this.skipNewlines();
        while (!this.at(TokenType.DEDENT) && !this.at(TokenType.EOF)) {
          methods.push(this.parseFnDecl([]));
          this.skipNewlines();
        }
        this.expect(TokenType.DEDENT);
      }

      return {
        kind: "TraitImplDecl",
        traitName: nameTok.value,
        targetType: targetTok.value,
        methods,
        loc: this.loc(kwTok),
      };
    }

    // Regular trait declaration
    this.expectNewlineTolerateColon();
    const methods: FnDecl[] = [];

    if (this.at(TokenType.INDENT)) {
      this.advance();
      this.skipNewlines();
      while (!this.at(TokenType.DEDENT) && !this.at(TokenType.EOF)) {
        methods.push(this.parseTraitMethod());
        this.skipNewlines();
      }
      this.expect(TokenType.DEDENT);
    }

    return {
      kind: "TraitDecl",
      name: nameTok.value,
      supertraits: [],
      methods,
      annotations,
      loc: this.loc(kwTok),
    };
  }

  /** Parse a trait method: either signature-only or with a default body. */
  private parseTraitMethod(): FnDecl {
    const kwTok = this.expect(TokenType.KW_FN);
    const nameTok = this.expect(TokenType.IDENT);
    this.expect(TokenType.LPAREN);
    const params = this.parseParamList();
    this.expect(TokenType.RPAREN);

    // Optional return type: -> Type
    if (this.at(TokenType.ARROW)) {
      this.advance();
      this.consumeTypeAnnotation();
    }

    // Check if there's a body (default implementation) or just a signature
    let body: Stmt[] = [];
    if (this.at(TokenType.NEWLINE)) {
      this.advance(); // consume NEWLINE
      if (this.at(TokenType.INDENT)) {
        body = this.parseIndentedBlock();
      }
      // else: signature-only, body stays empty
    }

    return {
      kind: "FnDecl",
      name: nameTok.value,
      params,
      body,
      annotations: [],
      loc: this.loc(kwTok),
    };
  }

  // ── LetDecl / ConstDecl ─────────────────────────────────

  private parseLetDecl(): LetDecl {
    const kwTok = this.expect(TokenType.KW_LET);
    const nameTok = this.expect(TokenType.IDENT);
    let typeAnnotation: string | undefined;
    if (this.at(TokenType.COLON)) {
      this.advance();
      typeAnnotation = this.consumeTypeAnnotation();
    }
    let value: Expr | undefined;
    if (this.at(TokenType.EQ)) {
      this.advance();
      value = this.parseExpr();
    }
    // Block expressions (match) already consumed their DEDENT; don't require NEWLINE
    if (!value || value.kind !== "MatchExpr") {
      this.expectNewlineOrEOF();
    }
    return {
      kind: "LetDecl",
      name: nameTok.value,
      typeAnnotation,
      value,
      loc: this.loc(kwTok),
    };
  }

  private parseConstDecl(): ConstDecl {
    const kwTok = this.expect(TokenType.KW_CONST);
    const nameTok = this.expect(TokenType.IDENT);
    let typeAnnotation: string | undefined;
    if (this.at(TokenType.COLON)) {
      this.advance();
      typeAnnotation = this.consumeTypeAnnotation();
    }
    this.expect(TokenType.EQ);
    const value = this.parseExpr();
    this.expectNewlineOrEOF();
    return {
      kind: "ConstDecl",
      name: nameTok.value,
      typeAnnotation,
      value,
      loc: this.loc(kwTok),
    };
  }

  /** Expect a NEWLINE or EOF (for statements that end with a newline). */
  private expectNewlineOrEOF(): void {
    if (this.at(TokenType.EOF)) return;
    this.expect(TokenType.NEWLINE);
  }

  // ── Block (INDENT...DEDENT) ─────────────────────────────

  /** Parse an indented block, allowing empty bodies (INDENT immediately followed by DEDENT). */
  private parseIndentedBlock(): Stmt[] {
    if (this.at(TokenType.INDENT)) {
      this.advance();
      const stmts = this.parseBlock();
      this.expect(TokenType.DEDENT);
      return stmts;
    }
    // No INDENT → empty body (e.g., fn foo()\n followed by next top-level decl)
    return [];
  }

  private parseBlock(): Stmt[] {
    const stmts: Stmt[] = [];
    this.skipNewlines();
    while (!this.at(TokenType.DEDENT) && !this.at(TokenType.EOF)) {
      stmts.push(this.parseStmt());
      this.skipNewlines();
    }
    return stmts;
  }

  // ── Statements ──────────────────────────────────────────

  private parseStmt(): Stmt {
    const tok = this.peek();

    switch (tok.type) {
      case TokenType.KW_LET:
        return this.parseLetDecl();
      case TokenType.KW_CONST:
        return this.parseConstDecl();
      case TokenType.KW_IF:
        return this.parseIfStmt();
      case TokenType.KW_FOR:
        return this.parseForStmt();
      case TokenType.KW_MATCH:
        return this.parseMatchStmt();
      case TokenType.KW_RETURN:
        return this.parseReturnStmt();
      case TokenType.KW_BREAK: {
        const brkTok = this.advance();
        this.expectNewlineOrEOF();
        return { kind: "BreakStmt", loc: this.loc(brkTok) } as BreakStmt;
      }
      case TokenType.KW_CONTINUE: {
        const contTok = this.advance();
        this.expectNewlineOrEOF();
        return { kind: "ContinueStmt", loc: this.loc(contTok) } as ContinueStmt;
      }
      default:
        return this.parseAssignOrExprStmt();
    }
  }

  // ── IfStmt ──────────────────────────────────────────────

  private parseIfStmt(): IfStmt {
    const kwTok = this.expect(TokenType.KW_IF);
    const condition = this.parseExpr();
    this.expectNewlineTolerateColon();
    const body = this.parseIndentedBlock();

    let elseBody: Stmt[] | undefined;

    if (this.at(TokenType.KW_ELSE)) {
      this.advance(); // consume else

      if (this.at(TokenType.KW_IF)) {
        // else if chain — the else body is a single IfStmt
        elseBody = [this.parseIfStmt()];
      } else {
        // else block
        this.expectNewlineTolerateColon();
        elseBody = this.parseIndentedBlock();
      }
    }

    return {
      kind: "IfStmt",
      condition,
      body,
      elseBody,
      loc: this.loc(kwTok),
    };
  }

  // ── ForStmt ─────────────────────────────────────────────

  private parseForStmt(): ForStmt {
    const kwTok = this.expect(TokenType.KW_FOR);

    let variant: ForInVariant | ForCondVariant;

    // Check for for-in: IDENT KW_IN Expr
    // We need to look ahead: if we see IDENT followed by KW_IN, it's for-in.
    if (
      this.at(TokenType.IDENT) &&
      this.pos + 1 < this.tokens.length &&
      this.tokens[this.pos + 1].type === TokenType.KW_IN
    ) {
      const varTok = this.advance(); // IDENT
      this.advance(); // KW_IN
      const iterable = this.parseExpr();
      variant = { kind: "ForIn", variable: varTok.value, iterable };
    } else {
      // for-cond
      const condition = this.parseExpr();
      variant = { kind: "ForCond", condition };
    }

    this.expectNewlineTolerateColon();
    const body = this.parseIndentedBlock();

    return { kind: "ForStmt", variant, body, loc: this.loc(kwTok) };
  }

  // ── ReturnStmt ──────────────────────────────────────────

  private parseReturnStmt(): ReturnStmt {
    const kwTok = this.expect(TokenType.KW_RETURN);

    let value: Expr | undefined;
    // If not followed by NEWLINE or EOF, parse expr
    if (!this.at(TokenType.NEWLINE) && !this.at(TokenType.EOF)) {
      value = this.parseExpr();
    }

    this.expectNewlineOrEOF();
    return { kind: "ReturnStmt", value, loc: this.loc(kwTok) };
  }

  // ── Assignment or ExprStmt ──────────────────────────────

  private parseAssignOrExprStmt(): Stmt {
    const startTok = this.peek();
    const expr = this.parseExpr();

    // Check for simple or compound assignment
    const assignOps: Record<string, Assignment["op"]> = {
      [TokenType.EQ]: "=",
      [TokenType.PLUSEQ]: "+=",
      [TokenType.MINUSEQ]: "-=",
      [TokenType.STAREQ]: "*=",
      [TokenType.SLASHEQ]: "/=",
      [TokenType.PERCENTEQ]: "%=",
    };

    const op = assignOps[this.peek().type];
    if (op) {
      this.advance(); // consume assignment operator
      const value = this.parseExpr();
      this.expectNewlineOrEOF();
      return {
        kind: "Assignment",
        op,
        target: expr,
        value,
        loc: this.loc(startTok),
      } as Assignment;
    }

    // ExprStmt
    this.expectNewlineOrEOF();
    return { kind: "ExprStmt", expr, loc: this.loc(startTok) } as ExprStmt;
  }

  // ── Expressions (precedence climbing) ───────────────────

  private parseExpr(): Expr {
    return this.parseOr();
  }

  // Precedence 1: or
  private parseOr(): Expr {
    let left = this.parseAnd();
    while (this.at(TokenType.KW_OR)) {
      const opTok = this.advance();
      const right = this.parseAnd();
      left = {
        kind: "BinaryExpr",
        op: "or",
        left,
        right,
        loc: this.loc(opTok),
      };
    }
    return left;
  }

  // Precedence 2: and
  private parseAnd(): Expr {
    let left = this.parseNot();
    while (this.at(TokenType.KW_AND)) {
      const opTok = this.advance();
      const right = this.parseNot();
      left = {
        kind: "BinaryExpr",
        op: "and",
        left,
        right,
        loc: this.loc(opTok),
      };
    }
    return left;
  }

  // Precedence 3: not (unary prefix)
  private parseNot(): Expr {
    if (this.at(TokenType.KW_NOT)) {
      const opTok = this.advance();
      const operand = this.parseNot(); // right-associative
      return {
        kind: "UnaryExpr",
        op: "not",
        operand,
        loc: this.loc(opTok),
      };
    }
    return this.parseComparison();
  }

  // Precedence 4: ==, !=, <, >, <=, >=
  private parseComparison(): Expr {
    let left = this.parseRange();
    while (
      this.at(TokenType.EQEQ) ||
      this.at(TokenType.NEQ) ||
      this.at(TokenType.LT) ||
      this.at(TokenType.GT) ||
      this.at(TokenType.LTEQ) ||
      this.at(TokenType.GTEQ)
    ) {
      const opTok = this.advance();
      const right = this.parseRange();
      left = {
        kind: "BinaryExpr",
        op: opTok.value,
        left,
        right,
        loc: this.loc(opTok),
      };
    }
    return left;
  }

  // Precedence 5: .. (range)
  private parseRange(): Expr {
    let left = this.parseAddition();
    if (this.at(TokenType.DOTDOT)) {
      const opTok = this.advance();
      const right = this.parseAddition();
      left = {
        kind: "BinaryExpr",
        op: "..",
        left,
        right,
        loc: this.loc(opTok),
      };
    }
    return left;
  }

  // Precedence 6: +, -
  private parseAddition(): Expr {
    let left = this.parseMultiplication();
    while (this.at(TokenType.PLUS) || this.at(TokenType.MINUS)) {
      const opTok = this.advance();
      const right = this.parseMultiplication();
      left = {
        kind: "BinaryExpr",
        op: opTok.value,
        left,
        right,
        loc: this.loc(opTok),
      };
    }
    return left;
  }

  // Precedence 6: *, /, %
  private parseMultiplication(): Expr {
    let left = this.parseUnary();
    while (
      this.at(TokenType.STAR) ||
      this.at(TokenType.SLASH) ||
      this.at(TokenType.PERCENT)
    ) {
      const opTok = this.advance();
      const right = this.parseUnary();
      left = {
        kind: "BinaryExpr",
        op: opTok.value,
        left,
        right,
        loc: this.loc(opTok),
      };
    }
    return left;
  }

  // Precedence 7: unary - (negation)
  private parseUnary(): Expr {
    if (this.at(TokenType.MINUS)) {
      const opTok = this.advance();
      const operand = this.parseUnary(); // right-associative
      return {
        kind: "UnaryExpr",
        op: "-",
        operand,
        loc: this.loc(opTok),
      };
    }
    return this.parsePostfix();
  }

  // Precedence 8: postfix .field, [index], (args)
  private parsePostfix(): Expr {
    let expr = this.parsePrimary();

    while (true) {
      if (this.at(TokenType.DOT)) {
        const dotTok = this.advance();
        const fieldTok = this.expectIdentOrKeyword();
        expr = {
          kind: "FieldAccess",
          object: expr,
          field: fieldTok.value,
          loc: this.loc(dotTok),
        };
      } else if (this.at(TokenType.LBRACKET)) {
        const bracketTok = this.advance();
        const index = this.parseExpr();
        this.expect(TokenType.RBRACKET);
        expr = {
          kind: "IndexAccess",
          object: expr,
          index,
          loc: this.loc(bracketTok),
        };
      } else if (this.at(TokenType.LPAREN)) {
        const parenTok = this.advance();
        const args = this.parseArgList();
        this.expect(TokenType.RPAREN);
        expr = {
          kind: "CallExpr",
          callee: expr,
          args,
          loc: this.loc(parenTok),
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private parseArgList(): Expr[] {
    const args: Expr[] = [];
    if (this.at(TokenType.RPAREN)) {
      return args;
    }

    args.push(this.parseArgExpr());
    while (this.at(TokenType.COMMA)) {
      this.advance();
      args.push(this.parseArgExpr());
    }

    return args;
  }

  /**
   * Parse a single argument: either a named arg `name: expr` or a positional expr.
   * Named args like `Player(health: 100)` — the `name: value` is parsed as a regular
   * expression since the colon creates ambiguity. We skip the name and colon and just
   * return the value expression.
   */
  private parseArgExpr(): Expr {
    // Look ahead for named argument pattern: IDENT COLON
    if (
      this.at(TokenType.IDENT) &&
      this.pos + 1 < this.tokens.length &&
      this.tokens[this.pos + 1].type === TokenType.COLON
    ) {
      // Named argument: consume name and colon, then parse value
      this.advance(); // consume name
      this.advance(); // consume :
      return this.parseExpr();
    }
    return this.parseExpr();
  }

  // ── MatchExpr (match as expression in PrimaryExpr) ────────

  private parseMatchExpr(): Expr {
    const kwTok = this.expect(TokenType.KW_MATCH);
    const subject = this.parseExpr();
    this.expect(TokenType.NEWLINE);

    // Parse indented match body (same structure as MatchStmt)
    this.expect(TokenType.INDENT);
    const arms: MatchArm[] = [];
    this.skipNewlines();
    while (!this.at(TokenType.DEDENT) && !this.at(TokenType.EOF)) {
      arms.push(this.parseMatchArm());
      this.skipNewlines();
    }
    this.expect(TokenType.DEDENT);

    return { kind: "MatchExpr", subject, arms, loc: this.loc(kwTok) };
  }

  // ── MapLiteral ────────────────────────────────────────────

  private parseMapLiteral(): MapLiteral {
    const tok = this.expect(TokenType.LBRACE);
    const entries: { key: Expr; value: Expr }[] = [];

    if (!this.at(TokenType.RBRACE)) {
      const key = this.parseExpr();
      this.expect(TokenType.COLON);
      const value = this.parseExpr();
      entries.push({ key, value });

      while (this.at(TokenType.COMMA)) {
        this.advance();
        if (this.at(TokenType.RBRACE)) break; // trailing comma
        const k = this.parseExpr();
        this.expect(TokenType.COLON);
        const v = this.parseExpr();
        entries.push({ key: k, value: v });
      }
    }

    this.expect(TokenType.RBRACE);
    return { kind: "MapLiteral", entries, loc: this.loc(tok) };
  }

  // ── MatchStmt ─────────────────────────────────────────────

  private parseMatchStmt(): MatchStmt {
    const kwTok = this.expect(TokenType.KW_MATCH);
    const subject = this.parseExpr();
    this.expect(TokenType.NEWLINE);

    // Parse indented match body
    this.expect(TokenType.INDENT);
    const arms: MatchArm[] = [];
    this.skipNewlines();
    while (!this.at(TokenType.DEDENT) && !this.at(TokenType.EOF)) {
      arms.push(this.parseMatchArm());
      this.skipNewlines();
    }
    this.expect(TokenType.DEDENT);

    return { kind: "MatchStmt", subject, arms, loc: this.loc(kwTok) };
  }

  private parseMatchArm(): MatchArm {
    // Skip optional `case` keyword (LLMs often generate `case Pattern` in match arms)
    if (this.at(TokenType.IDENT) && this.peek().value === "case") {
      this.advance();
    }
    const patternTok = this.peek();
    const pattern = this.parseMatchPattern();

    if (this.at(TokenType.ARROW)) {
      // One-line arm: Pattern -> Stmt
      this.advance(); // consume ->
      const body = this.parseInlineStmt();
      return { pattern, body, loc: this.loc(patternTok) };
    } else {
      // Multi-line arm: Pattern NEWLINE Block
      this.expect(TokenType.NEWLINE);
      const body = this.parseIndentedBlock();
      return { pattern, body, loc: this.loc(patternTok) };
    }
  }

  /** Parse a single inline statement (for one-line match arms). */
  private parseInlineStmt(): Stmt[] {
    const startTok = this.peek();
    const expr = this.parseExpr();

    // Check for assignment after expression
    const assignOps: Record<string, Assignment["op"]> = {
      [TokenType.EQ]: "=",
      [TokenType.PLUSEQ]: "+=",
      [TokenType.MINUSEQ]: "-=",
      [TokenType.STAREQ]: "*=",
      [TokenType.SLASHEQ]: "/=",
      [TokenType.PERCENTEQ]: "%=",
    };

    const op = assignOps[this.peek().type];
    if (op) {
      this.advance();
      const value = this.parseExpr();
      this.expectNewlineOrEOF();
      return [{ kind: "Assignment", op, target: expr, value, loc: this.loc(startTok) } as Assignment];
    }

    this.expectNewlineOrEOF();
    return [{ kind: "ExprStmt", expr, loc: this.loc(startTok) } as ExprStmt];
  }

  private parseMatchPattern(): MatchPattern {
    const tok = this.peek();

    // Wildcard: _ or else
    if (tok.type === TokenType.IDENT && tok.value === "_") {
      this.advance();
      return { kind: "WildcardPattern" };
    }
    if (tok.type === TokenType.KW_ELSE) {
      this.advance();
      return { kind: "WildcardPattern" };
    }

    // Literal patterns: int, float, string, true, false
    if (tok.type === TokenType.INT_LIT) {
      this.advance();
      return { kind: "LiteralPattern", value: { kind: "IntLiteral", value: parseInt(tok.value, 10), loc: this.loc(tok) } };
    }
    if (tok.type === TokenType.FLOAT_LIT) {
      this.advance();
      return { kind: "LiteralPattern", value: { kind: "FloatLiteral", value: parseFloat(tok.value), loc: this.loc(tok) } };
    }
    if (tok.type === TokenType.STRING_LIT) {
      this.advance();
      return { kind: "LiteralPattern", value: { kind: "StringLiteral", value: tok.value, loc: this.loc(tok) } };
    }
    if (tok.type === TokenType.KW_TRUE) {
      this.advance();
      return { kind: "LiteralPattern", value: { kind: "BoolLiteral", value: true, loc: this.loc(tok) } };
    }
    if (tok.type === TokenType.KW_FALSE) {
      this.advance();
      return { kind: "LiteralPattern", value: { kind: "BoolLiteral", value: false, loc: this.loc(tok) } };
    }

    // Identifier pattern (variant name or binding), or qualified pattern (Enum.Variant)
    if (tok.type === TokenType.IDENT) {
      this.advance();
      if (this.at(TokenType.DOT)) {
        this.advance(); // consume .
        const variant = this.expect(TokenType.IDENT);
        return { kind: "QualifiedPattern", qualifier: tok.value, name: variant.value };
      }
      return { kind: "IdentifierPattern", name: tok.value };
    }

    throw new VibeError(
      this.filename,
      tok.line,
      tok.col,
      "parser",
      `unexpected token in match pattern: ${tok.type} ("${tok.value}")`,
    );
  }

  // Precedence 9: primary
  private parsePrimary(): Expr {
    const tok = this.peek();

    switch (tok.type) {
      case TokenType.INT_LIT: {
        this.advance();
        return {
          kind: "IntLiteral",
          value: parseInt(tok.value, 10),
          loc: this.loc(tok),
        };
      }
      case TokenType.FLOAT_LIT: {
        this.advance();
        return {
          kind: "FloatLiteral",
          value: parseFloat(tok.value),
          loc: this.loc(tok),
        };
      }
      case TokenType.STRING_LIT: {
        this.advance();
        return {
          kind: "StringLiteral",
          value: tok.value,
          loc: this.loc(tok),
        };
      }
      case TokenType.KW_TRUE: {
        this.advance();
        return { kind: "BoolLiteral", value: true, loc: this.loc(tok) };
      }
      case TokenType.KW_FALSE: {
        this.advance();
        return { kind: "BoolLiteral", value: false, loc: this.loc(tok) };
      }
      case TokenType.IDENT: {
        this.advance();
        return { kind: "Identifier", name: tok.value, loc: this.loc(tok) };
      }
      case TokenType.LPAREN: {
        this.advance(); // consume (
        const expr = this.parseExpr();
        this.expect(TokenType.RPAREN);
        return { kind: "GroupExpr", expr, loc: this.loc(tok) };
      }
      case TokenType.LBRACKET: {
        this.advance(); // consume [
        const elements: Expr[] = [];
        if (!this.at(TokenType.RBRACKET)) {
          elements.push(this.parseExpr());
          while (this.at(TokenType.COMMA)) {
            this.advance();
            if (this.at(TokenType.RBRACKET)) break; // trailing comma
            elements.push(this.parseExpr());
          }
        }
        this.expect(TokenType.RBRACKET);
        return { kind: "ListLiteral", elements, loc: this.loc(tok) } as ListLiteral;
      }
      case TokenType.LBRACE: {
        return this.parseMapLiteral();
      }
      case TokenType.KW_MATCH: {
        return this.parseMatchExpr();
      }
      default:
        throw new VibeError(
          this.filename,
          tok.line,
          tok.col,
          "parser",
          `unexpected token ${tok.type} ("${tok.value}")`,
        );
    }
  }
}
