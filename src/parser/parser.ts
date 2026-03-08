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
  Stmt,
  IfStmt,
  ForStmt,
  ForInVariant,
  ForCondVariant,
  ReturnStmt,
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

  private loc(token: Token): Loc {
    return { line: token.line, col: token.col };
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
    const tok = this.peek();
    switch (tok.type) {
      case TokenType.KW_FN:
        return this.parseFnDecl();
      case TokenType.KW_LET:
        return this.parseLetDecl();
      case TokenType.KW_CONST:
        return this.parseConstDecl();
      default:
        throw new VibeError(
          this.filename,
          tok.line,
          tok.col,
          "parser",
          `expected top-level declaration (fn, let, const), got ${tok.type} ("${tok.value}")`,
        );
    }
  }

  // ── FnDecl ──────────────────────────────────────────────

  private parseFnDecl(): FnDecl {
    const kwTok = this.expect(TokenType.KW_FN);
    const nameTok = this.expect(TokenType.IDENT);
    this.expect(TokenType.LPAREN);
    const params = this.parseParamList();
    this.expect(TokenType.RPAREN);

    // Optional return type annotation: -> Type
    if (this.at(TokenType.ARROW)) {
      this.advance(); // consume ->
      this.expect(TokenType.IDENT); // consume type name (discarded)
    }

    this.expect(TokenType.NEWLINE);
    this.expect(TokenType.INDENT);
    const body = this.parseBlock();
    this.expect(TokenType.DEDENT);

    return {
      kind: "FnDecl",
      name: nameTok.value,
      params,
      body,
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

  /** Consume a type annotation like `Float`, `List[Float]`, `Map[String, Int]`. */
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
    return annotation;
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
    this.expect(TokenType.EQ);
    const value = this.parseExpr();
    this.expectNewlineOrEOF();
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
      case TokenType.KW_RETURN:
        return this.parseReturnStmt();
      default:
        return this.parseAssignOrExprStmt();
    }
  }

  // ── IfStmt ──────────────────────────────────────────────

  private parseIfStmt(): IfStmt {
    const kwTok = this.expect(TokenType.KW_IF);
    const condition = this.parseExpr();
    this.expect(TokenType.NEWLINE);
    this.expect(TokenType.INDENT);
    const body = this.parseBlock();
    this.expect(TokenType.DEDENT);

    let elseBody: Stmt[] | undefined;

    if (this.at(TokenType.KW_ELSE)) {
      this.advance(); // consume else

      if (this.at(TokenType.KW_IF)) {
        // else if chain — the else body is a single IfStmt
        elseBody = [this.parseIfStmt()];
      } else {
        // else block
        this.expect(TokenType.NEWLINE);
        this.expect(TokenType.INDENT);
        elseBody = this.parseBlock();
        this.expect(TokenType.DEDENT);
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

    this.expect(TokenType.NEWLINE);
    this.expect(TokenType.INDENT);
    const body = this.parseBlock();
    this.expect(TokenType.DEDENT);

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

    if (this.at(TokenType.EQ)) {
      // Assignment
      this.advance(); // consume =
      const value = this.parseExpr();
      this.expectNewlineOrEOF();
      return {
        kind: "Assignment",
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
    let left = this.parseAddition();
    while (
      this.at(TokenType.EQEQ) ||
      this.at(TokenType.NEQ) ||
      this.at(TokenType.LT) ||
      this.at(TokenType.GT) ||
      this.at(TokenType.LTEQ) ||
      this.at(TokenType.GTEQ)
    ) {
      const opTok = this.advance();
      const right = this.parseAddition();
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

  // Precedence 5: +, -
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
        const fieldTok = this.expect(TokenType.IDENT);
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

    args.push(this.parseExpr());
    while (this.at(TokenType.COMMA)) {
      this.advance();
      args.push(this.parseExpr());
    }

    return args;
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
