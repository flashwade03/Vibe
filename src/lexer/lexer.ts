// ============================================================
// Vibe Language — Lexer
// Converts source code into a flat token stream with
// Python-style INDENT / DEDENT / NEWLINE tokens.
// ============================================================

import { TokenType, Token } from "./tokens.js";
import { VibeError } from "../errors.js";

// ── Keyword map ─────────────────────────────────────────────
const KEYWORDS: Record<string, TokenType> = {
  fn: TokenType.KW_FN,
  let: TokenType.KW_LET,
  const: TokenType.KW_CONST,
  if: TokenType.KW_IF,
  else: TokenType.KW_ELSE,
  return: TokenType.KW_RETURN,
  for: TokenType.KW_FOR,
  and: TokenType.KW_AND,
  or: TokenType.KW_OR,
  not: TokenType.KW_NOT,
  true: TokenType.KW_TRUE,
  false: TokenType.KW_FALSE,
  in: TokenType.KW_IN,
};

// ── Public API ──────────────────────────────────────────────

export function lex(source: string, filename: string = "<stdin>"): Token[] {
  const lexer = new Lexer(source, filename);
  return lexer.tokenize();
}

// ── Internal Lexer ──────────────────────────────────────────

class Lexer {
  private src: string;
  private filename: string;
  private pos: number = 0;
  private line: number = 1;
  private col: number = 1;
  private tokens: Token[] = [];
  private indentStack: number[] = [0];
  private parenDepth: number = 0;
  /** Whether we are at the beginning of a logical line (need to handle indentation). */
  private atLineStart: boolean = true;

  constructor(source: string, filename: string) {
    this.src = source;
    this.filename = filename;
  }

  // ── Main loop ───────────────────────────────────────────

  tokenize(): Token[] {
    while (this.pos < this.src.length) {
      if (this.atLineStart) {
        this.handleLineStart();
      } else {
        this.scanToken();
      }
    }

    // Emit final NEWLINE if last line had tokens
    if (this.tokens.length > 0) {
      const last = this.tokens[this.tokens.length - 1];
      if (last.type !== TokenType.NEWLINE && last.type !== TokenType.DEDENT && last.type !== TokenType.INDENT) {
        if (this.parenDepth === 0) {
          this.emit(TokenType.NEWLINE, "", this.line, this.col);
        }
      }
    }

    // Emit remaining DEDENTs at EOF
    while (this.indentStack.length > 1) {
      this.indentStack.pop();
      this.emit(TokenType.DEDENT, "", this.line, this.col);
    }

    this.emit(TokenType.EOF, "", this.line, this.col);
    return this.tokens;
  }

  // ── Line-start handling (indentation) ────────────────────

  private handleLineStart(): void {
    // Count leading spaces
    const lineStartPos = this.pos;
    let spaces = 0;
    while (this.pos < this.src.length && this.src[this.pos] === " ") {
      spaces++;
      this.advance();
    }

    // Check if this is a blank line or comment-only line
    if (this.pos >= this.src.length || this.src[this.pos] === "\n") {
      // Blank line — skip entirely
      if (this.pos < this.src.length) {
        this.advance(); // consume the \n
      }
      // Stay at atLineStart = true for next line
      return;
    }

    // Check for comment-only line
    if (
      this.pos + 1 < this.src.length &&
      this.src[this.pos] === "-" &&
      this.src[this.pos + 1] === "-"
    ) {
      // Skip to end of line
      this.skipToEndOfLine();
      // If there's a newline, consume it
      if (this.pos < this.src.length && this.src[this.pos] === "\n") {
        this.advance();
      }
      // Stay at atLineStart = true
      return;
    }

    // This line has content — process indentation if not inside parens
    if (this.parenDepth === 0) {
      const currentIndent = this.indentStack[this.indentStack.length - 1];

      if (spaces > currentIndent) {
        this.indentStack.push(spaces);
        this.emit(TokenType.INDENT, "", this.line, this.col);
      } else if (spaces < currentIndent) {
        // Pop levels and count how many DEDENTs to emit
        let dedentCount = 0;
        while (
          this.indentStack.length > 1 &&
          this.indentStack[this.indentStack.length - 1] > spaces
        ) {
          this.indentStack.pop();
          dedentCount++;
        }
        if (this.indentStack[this.indentStack.length - 1] !== spaces) {
          throw new VibeError(
            this.filename,
            this.line,
            this.col,
            "lexer",
            "inconsistent indentation",
          );
        }
        for (let i = 0; i < dedentCount; i++) {
          this.emit(TokenType.DEDENT, "", this.line, this.col);
        }
      }
    }

    this.atLineStart = false;
  }

  // ── Token scanning (mid-line) ────────────────────────────

  private scanToken(): void {
    this.skipSpaces();

    if (this.pos >= this.src.length) {
      return;
    }

    const ch = this.src[this.pos];

    // Newline
    if (ch === "\n") {
      if (this.parenDepth === 0) {
        // Only emit NEWLINE if we produced tokens on this line
        const lastToken = this.tokens.length > 0 ? this.tokens[this.tokens.length - 1] : null;
        if (lastToken && lastToken.type !== TokenType.NEWLINE && lastToken.type !== TokenType.INDENT) {
          this.emit(TokenType.NEWLINE, "", this.line, this.col);
        }
      }
      this.advance(); // consume \n
      this.atLineStart = true;
      return;
    }

    // Comment
    if (ch === "-" && this.pos + 1 < this.src.length && this.src[this.pos + 1] === "-") {
      this.skipToEndOfLine();
      return;
    }

    // String literal
    if (ch === '"') {
      this.readString();
      return;
    }

    // Number literal
    if (this.isDigit(ch)) {
      this.readNumber();
      return;
    }

    // Identifier / keyword
    if (this.isIdentStart(ch)) {
      this.readIdentifier();
      return;
    }

    // Operators and delimiters
    this.readOperatorOrDelimiter();
  }

  // ── Readers ──────────────────────────────────────────────

  private readString(): void {
    const startLine = this.line;
    const startCol = this.col;
    this.advance(); // skip opening "

    let value = "";
    while (this.pos < this.src.length) {
      const ch = this.src[this.pos];
      if (ch === "\n") {
        throw new VibeError(
          this.filename,
          startLine,
          startCol,
          "lexer",
          "unterminated string",
        );
      }
      if (ch === '"') {
        this.advance(); // skip closing "
        this.emit(TokenType.STRING_LIT, value, startLine, startCol);
        return;
      }
      if (ch === "\\") {
        this.advance(); // skip backslash
        if (this.pos >= this.src.length) {
          throw new VibeError(
            this.filename,
            startLine,
            startCol,
            "lexer",
            "unterminated string",
          );
        }
        const esc = this.src[this.pos];
        switch (esc) {
          case "n":
            value += "\n";
            break;
          case "t":
            value += "\t";
            break;
          case "\\":
            value += "\\";
            break;
          case '"':
            value += '"';
            break;
          default:
            value += esc;
            break;
        }
        this.advance();
      } else {
        value += ch;
        this.advance();
      }
    }

    // Reached end of input without closing "
    throw new VibeError(
      this.filename,
      startLine,
      startCol,
      "lexer",
      "unterminated string",
    );
  }

  private readNumber(): void {
    const startCol = this.col;
    let num = "";
    while (this.pos < this.src.length && this.isDigit(this.src[this.pos])) {
      num += this.src[this.pos];
      this.advance();
    }

    // Check for float
    if (
      this.pos < this.src.length &&
      this.src[this.pos] === "." &&
      this.pos + 1 < this.src.length &&
      this.isDigit(this.src[this.pos + 1])
    ) {
      num += ".";
      this.advance(); // consume .
      while (this.pos < this.src.length && this.isDigit(this.src[this.pos])) {
        num += this.src[this.pos];
        this.advance();
      }
      this.emit(TokenType.FLOAT_LIT, num, this.line, startCol);
    } else {
      this.emit(TokenType.INT_LIT, num, this.line, startCol);
    }
  }

  private readIdentifier(): void {
    const startCol = this.col;
    let name = "";
    while (this.pos < this.src.length && this.isIdentPart(this.src[this.pos])) {
      name += this.src[this.pos];
      this.advance();
    }

    const kwType = KEYWORDS[name];
    if (kwType !== undefined) {
      this.emit(kwType, name, this.line, startCol);
    } else {
      this.emit(TokenType.IDENT, name, this.line, startCol);
    }
  }

  private readOperatorOrDelimiter(): void {
    const ch = this.src[this.pos];
    const startCol = this.col;
    const next = this.pos + 1 < this.src.length ? this.src[this.pos + 1] : "";

    switch (ch) {
      case "+":
        if (next === "=") {
          this.advance();
          this.advance();
          this.emit(TokenType.PLUSEQ, "+=", this.line, startCol);
        } else {
          this.advance();
          this.emit(TokenType.PLUS, "+", this.line, startCol);
        }
        return;
      case "*":
        if (next === "=") {
          this.advance();
          this.advance();
          this.emit(TokenType.STAREQ, "*=", this.line, startCol);
        } else {
          this.advance();
          this.emit(TokenType.STAR, "*", this.line, startCol);
        }
        return;
      case "/":
        if (next === "=") {
          this.advance();
          this.advance();
          this.emit(TokenType.SLASHEQ, "/=", this.line, startCol);
        } else {
          this.advance();
          this.emit(TokenType.SLASH, "/", this.line, startCol);
        }
        return;
      case "%":
        if (next === "=") {
          this.advance();
          this.advance();
          this.emit(TokenType.PERCENTEQ, "%=", this.line, startCol);
        } else {
          this.advance();
          this.emit(TokenType.PERCENT, "%", this.line, startCol);
        }
        return;
      case ".":
        this.advance();
        this.emit(TokenType.DOT, ".", this.line, startCol);
        return;
      case ",":
        this.advance();
        this.emit(TokenType.COMMA, ",", this.line, startCol);
        return;
      case ":":
        this.advance();
        this.emit(TokenType.COLON, ":", this.line, startCol);
        return;
      case "(":
        this.parenDepth++;
        this.advance();
        this.emit(TokenType.LPAREN, "(", this.line, startCol);
        return;
      case ")":
        this.parenDepth = Math.max(0, this.parenDepth - 1);
        this.advance();
        this.emit(TokenType.RPAREN, ")", this.line, startCol);
        return;
      case "[":
        this.parenDepth++;
        this.advance();
        this.emit(TokenType.LBRACKET, "[", this.line, startCol);
        return;
      case "]":
        this.parenDepth = Math.max(0, this.parenDepth - 1);
        this.advance();
        this.emit(TokenType.RBRACKET, "]", this.line, startCol);
        return;
      case "-":
        if (next === ">") {
          this.advance();
          this.advance();
          this.emit(TokenType.ARROW, "->", this.line, startCol);
        } else if (next === "=") {
          this.advance();
          this.advance();
          this.emit(TokenType.MINUSEQ, "-=", this.line, startCol);
        } else {
          this.advance();
          this.emit(TokenType.MINUS, "-", this.line, startCol);
        }
        return;
      case "=":
        if (next === "=") {
          this.advance();
          this.advance();
          this.emit(TokenType.EQEQ, "==", this.line, startCol);
        } else {
          this.advance();
          this.emit(TokenType.EQ, "=", this.line, startCol);
        }
        return;
      case "!":
        if (next === "=") {
          this.advance();
          this.advance();
          this.emit(TokenType.NEQ, "!=", this.line, startCol);
        } else {
          throw new VibeError(
            this.filename,
            this.line,
            this.col,
            "lexer",
            `unexpected character: '${ch}'`,
          );
        }
        return;
      case "<":
        if (next === "=") {
          this.advance();
          this.advance();
          this.emit(TokenType.LTEQ, "<=", this.line, startCol);
        } else {
          this.advance();
          this.emit(TokenType.LT, "<", this.line, startCol);
        }
        return;
      case ">":
        if (next === "=") {
          this.advance();
          this.advance();
          this.emit(TokenType.GTEQ, ">=", this.line, startCol);
        } else {
          this.advance();
          this.emit(TokenType.GT, ">", this.line, startCol);
        }
        return;
      default:
        throw new VibeError(
          this.filename,
          this.line,
          this.col,
          "lexer",
          `unexpected character: '${ch}'`,
        );
    }
  }

  // ── Helpers ──────────────────────────────────────────────

  private advance(): void {
    if (this.pos < this.src.length) {
      if (this.src[this.pos] === "\n") {
        this.line++;
        this.col = 1;
      } else {
        this.col++;
      }
      this.pos++;
    }
  }

  private skipSpaces(): void {
    while (this.pos < this.src.length && this.src[this.pos] === " ") {
      this.advance();
    }
  }

  private skipToEndOfLine(): void {
    while (this.pos < this.src.length && this.src[this.pos] !== "\n") {
      this.advance();
    }
  }

  private emit(type: TokenType, value: string, line: number, col: number): void {
    this.tokens.push({ type, value, line, col });
  }

  private isDigit(ch: string): boolean {
    return ch >= "0" && ch <= "9";
  }

  private isIdentStart(ch: string): boolean {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_";
  }

  private isIdentPart(ch: string): boolean {
    return this.isIdentStart(ch) || this.isDigit(ch);
  }
}
