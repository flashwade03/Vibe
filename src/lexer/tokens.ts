// ============================================================
// Vibe Language — Token Definitions
// Shared contract used by lexer, parser, and codegen.
// ============================================================

/** Every distinct token the lexer can emit. */
export enum TokenType {
  // ── Literals ──────────────────────────────────────────────
  INT_LIT = "INT_LIT",
  FLOAT_LIT = "FLOAT_LIT",
  STRING_LIT = "STRING_LIT",

  // ── Identifiers ──────────────────────────────────────────
  IDENT = "IDENT",

  // ── Keywords (v0 core) ───────────────────────────────────
  KW_FN = "KW_FN",
  KW_LET = "KW_LET",
  KW_CONST = "KW_CONST",
  KW_IF = "KW_IF",
  KW_ELSE = "KW_ELSE",
  KW_RETURN = "KW_RETURN",
  KW_FOR = "KW_FOR",

  // ── Boolean keywords ─────────────────────────────────────
  KW_AND = "KW_AND",
  KW_OR = "KW_OR",
  KW_NOT = "KW_NOT",

  // ── Boolean literals ─────────────────────────────────────
  KW_TRUE = "KW_TRUE",
  KW_FALSE = "KW_FALSE",

  // ── Other keywords (parsed, minimal use in v0) ───────────
  KW_IN = "KW_IN",

  // ── Operators ────────────────────────────────────────────
  PLUS = "PLUS",       // +
  MINUS = "MINUS",     // -
  STAR = "STAR",       // *
  SLASH = "SLASH",     // /
  PERCENT = "PERCENT", // %

  EQ = "EQ",           // =
  EQEQ = "EQEQ",      // ==
  NEQ = "NEQ",         // !=
  LT = "LT",           // <
  GT = "GT",           // >
  LTEQ = "LTEQ",       // <=
  GTEQ = "GTEQ",       // >=

  DOT = "DOT",         // .

  // ── Delimiters ───────────────────────────────────────────
  LPAREN = "LPAREN",     // (
  RPAREN = "RPAREN",     // )
  LBRACKET = "LBRACKET", // [
  RBRACKET = "RBRACKET", // ]
  COMMA = "COMMA",       // ,
  COLON = "COLON",       // :
  ARROW = "ARROW",       // ->

  // ── Indentation ──────────────────────────────────────────
  INDENT = "INDENT",
  DEDENT = "DEDENT",
  NEWLINE = "NEWLINE",

  // ── Special ──────────────────────────────────────────────
  EOF = "EOF",
}

/** A single token emitted by the lexer. */
export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

/** Source location — shared across AST nodes and diagnostics. */
export interface Loc {
  line: number;
  col: number;
}
