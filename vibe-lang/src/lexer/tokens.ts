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

  // ── Type keywords ────────────────────────────────────────
  KW_STRUCT = "KW_STRUCT",
  KW_ENUM = "KW_ENUM",
  KW_TRAIT = "KW_TRAIT",
  KW_HAS = "KW_HAS",

  // ── Other keywords (parsed, minimal use in v0) ───────────
  KW_IN = "KW_IN",
  KW_MATCH = "KW_MATCH",
  KW_BREAK = "KW_BREAK",
  KW_CONTINUE = "KW_CONTINUE",

  // ── Operators ────────────────────────────────────────────
  PLUS = "PLUS",       // +
  MINUS = "MINUS",     // -
  STAR = "STAR",       // *
  SLASH = "SLASH",     // /
  PERCENT = "PERCENT", // %

  EQ = "EQ",           // =
  PLUSEQ = "PLUSEQ",   // +=
  MINUSEQ = "MINUSEQ", // -=
  STAREQ = "STAREQ",   // *=
  SLASHEQ = "SLASHEQ", // /=
  PERCENTEQ = "PERCENTEQ", // %=
  EQEQ = "EQEQ",      // ==
  NEQ = "NEQ",         // !=
  LT = "LT",           // <
  GT = "GT",           // >
  LTEQ = "LTEQ",       // <=
  GTEQ = "GTEQ",       // >=

  DOT = "DOT",         // .
  DOTDOT = "DOTDOT",   // ..

  // ── Annotation & Optional ────────────────────────────────
  AT = "AT",             // @
  QUESTION = "QUESTION", // ?

  // ── Delimiters ───────────────────────────────────────────
  LPAREN = "LPAREN",     // (
  RPAREN = "RPAREN",     // )
  LBRACKET = "LBRACKET", // [
  RBRACKET = "RBRACKET", // ]
  LBRACE = "LBRACE",     // {
  RBRACE = "RBRACE",     // }
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
