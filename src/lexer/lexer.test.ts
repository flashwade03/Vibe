// ============================================================
// Vibe Language — Lexer Tests (22 cases)
// ============================================================

import { describe, it, expect } from "vitest";
import { lex } from "./lexer.js";
import { TokenType } from "./tokens.js";
import { VibeError } from "../errors.js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** Helper: extract just the token types from a token array. */
function types(src: string): TokenType[] {
  return lex(src).map((t) => t.type);
}

/** Helper: extract [type, value] pairs. */
function pairs(src: string): [TokenType, string][] {
  return lex(src).map((t) => [t.type, t.value]);
}

describe("Lexer", () => {
  // ── 1. Empty input ────────────────────────────────────────
  it("1. empty input → [EOF]", () => {
    const tokens = lex("");
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe(TokenType.EOF);
  });

  // ── 2. Integer literal ────────────────────────────────────
  it("2. integer literal", () => {
    const tokens = lex("42");
    expect(types("42")).toEqual([
      TokenType.INT_LIT,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
    expect(tokens[0].value).toBe("42");
  });

  // ── 3. Float literal ──────────────────────────────────────
  it("3. float literal", () => {
    const tokens = lex("3.14");
    expect(types("3.14")).toEqual([
      TokenType.FLOAT_LIT,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
    expect(tokens[0].value).toBe("3.14");
  });

  // ── 4. String literal ─────────────────────────────────────
  it("4. string literal", () => {
    const tokens = lex('"hello"');
    expect(types('"hello"')).toEqual([
      TokenType.STRING_LIT,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
    expect(tokens[0].value).toBe("hello");
  });

  // ── 5. Escape sequences ───────────────────────────────────
  it("5. escape sequences in strings", () => {
    const tokens = lex('"a\\nb"');
    expect(tokens[0].type).toBe(TokenType.STRING_LIT);
    expect(tokens[0].value).toBe("a\nb");
  });

  // ── 6. Unterminated string error ──────────────────────────
  it("6. unterminated string → VibeError", () => {
    expect(() => lex('"hello')).toThrow(VibeError);
  });

  // ── 7. Identifier ─────────────────────────────────────────
  it("7. identifier", () => {
    expect(pairs("foo")).toEqual([
      [TokenType.IDENT, "foo"],
      [TokenType.NEWLINE, ""],
      [TokenType.EOF, ""],
    ]);
  });

  // ── 8. Keyword recognition ────────────────────────────────
  it("8. keyword recognition", () => {
    const src = "fn let const if else return for and or not true false in";
    const toks = lex(src);
    const kwTypes = toks.slice(0, 13).map((t) => t.type);
    expect(kwTypes).toEqual([
      TokenType.KW_FN,
      TokenType.KW_LET,
      TokenType.KW_CONST,
      TokenType.KW_IF,
      TokenType.KW_ELSE,
      TokenType.KW_RETURN,
      TokenType.KW_FOR,
      TokenType.KW_AND,
      TokenType.KW_OR,
      TokenType.KW_NOT,
      TokenType.KW_TRUE,
      TokenType.KW_FALSE,
      TokenType.KW_IN,
    ]);
  });

  // ── 9. Keyword boundary ───────────────────────────────────
  it("9. keyword boundary — 'letter' is IDENT, not KW_LET", () => {
    const tokens = lex("letter");
    expect(tokens[0].type).toBe(TokenType.IDENT);
    expect(tokens[0].value).toBe("letter");
  });

  // ── 10. Operators ─────────────────────────────────────────
  it("10. operators", () => {
    const src = "+ - * / % = == != < > <= >=";
    const toks = lex(src);
    const opTypes = toks.slice(0, 12).map((t) => t.type);
    expect(opTypes).toEqual([
      TokenType.PLUS,
      TokenType.MINUS,
      TokenType.STAR,
      TokenType.SLASH,
      TokenType.PERCENT,
      TokenType.EQ,
      TokenType.EQEQ,
      TokenType.NEQ,
      TokenType.LT,
      TokenType.GT,
      TokenType.LTEQ,
      TokenType.GTEQ,
    ]);
  });

  // ── 11. Arrow ─────────────────────────────────────────────
  it("11. arrow operator", () => {
    expect(types("->")).toEqual([
      TokenType.ARROW,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
  });

  // ── 12. Comment stripping ─────────────────────────────────
  it("12. comment stripping", () => {
    expect(types("x -- comment")).toEqual([
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
  });

  // ── 13. Comment-only line ─────────────────────────────────
  it("13. comment-only line → [EOF]", () => {
    expect(types("-- just a comment")).toEqual([TokenType.EOF]);
  });

  // ── 14. INDENT/DEDENT basic ───────────────────────────────
  it("14. INDENT/DEDENT basic", () => {
    const src = "if true\n  x";
    expect(types(src)).toEqual([
      TokenType.KW_IF,
      TokenType.KW_TRUE,
      TokenType.NEWLINE,
      TokenType.INDENT,
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.DEDENT,
      TokenType.EOF,
    ]);
  });

  // ── 15. Multiple DEDENTs ──────────────────────────────────
  it("15. multiple DEDENTs", () => {
    const src = "if true\n  if true\n    x\ny";
    const toks = types(src);
    // After "x\n", going from indent 4 → 0 should emit 2 DEDENTs
    // Expected: KW_IF KW_TRUE NL INDENT KW_IF KW_TRUE NL INDENT IDENT NL DEDENT DEDENT IDENT NL EOF
    expect(toks).toEqual([
      TokenType.KW_IF,
      TokenType.KW_TRUE,
      TokenType.NEWLINE,
      TokenType.INDENT,
      TokenType.KW_IF,
      TokenType.KW_TRUE,
      TokenType.NEWLINE,
      TokenType.INDENT,
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.DEDENT,
      TokenType.DEDENT,
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
  });

  // ── 16. Blank line skipping ───────────────────────────────
  it("16. blank line skipping", () => {
    const src = "x\n\ny";
    expect(types(src)).toEqual([
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
  });

  // ── 17. Paren suppression ─────────────────────────────────
  it("17. paren suppression", () => {
    const src = "foo(\n  1,\n  2\n)";
    expect(types(src)).toEqual([
      TokenType.IDENT,
      TokenType.LPAREN,
      TokenType.INT_LIT,
      TokenType.COMMA,
      TokenType.INT_LIT,
      TokenType.RPAREN,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
  });

  // ── 18. Comment at indented position ──────────────────────
  it("18. comment at indented position does not affect indentation", () => {
    const src = "x\n  -- indented comment\ny";
    expect(types(src)).toEqual([
      TokenType.IDENT,
      TokenType.NEWLINE,
      // The indented comment line is blank → skipped entirely
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
  });

  // ── 19. DEDENT before else ────────────────────────────────
  it("19. DEDENT emitted before else", () => {
    const src = "if true\n  x\nelse\n  y";
    const toks = types(src);
    // Expected: KW_IF KW_TRUE NL INDENT IDENT NL DEDENT KW_ELSE NL INDENT IDENT NL DEDENT EOF
    expect(toks).toEqual([
      TokenType.KW_IF,
      TokenType.KW_TRUE,
      TokenType.NEWLINE,
      TokenType.INDENT,
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.DEDENT,
      TokenType.KW_ELSE,
      TokenType.NEWLINE,
      TokenType.INDENT,
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.DEDENT,
      TokenType.EOF,
    ]);
  });

  // ── 20. Inconsistent indentation error ────────────────────
  it("20. inconsistent indentation → VibeError", () => {
    // indent 0 → indent 4 → dedent to 1 (doesn't match 0 or 4)
    const src = "if true\n    x\n y";
    expect(() => lex(src)).toThrow(VibeError);
  });

  // ── 21. Dot operator ──────────────────────────────────────
  it("21. dot operator", () => {
    expect(types("a.b")).toEqual([
      TokenType.IDENT,
      TokenType.DOT,
      TokenType.IDENT,
      TokenType.NEWLINE,
      TokenType.EOF,
    ]);
  });

  // ── 22. Full v0 tokenization of moving_rect.vibe ─────────
  it("22. full tokenization of moving_rect.vibe", () => {
    const fixturePath = resolve(
      dirname(fileURLToPath(import.meta.url)),
      "../e2e/fixtures/moving_rect.vibe",
    );
    const source = readFileSync(fixturePath, "utf-8");
    const tokens = lex(source, "moving_rect.vibe");

    const tt = tokens.map((t) => t.type);

    // Verify it starts with: let x : IDENT = FLOAT_LIT NEWLINE
    expect(tt[0]).toBe(TokenType.KW_LET);
    expect(tokens[0].value).toBe("let");

    // Check structural tokens appear
    expect(tt).toContain(TokenType.KW_LET);
    expect(tt).toContain(TokenType.KW_FN);
    expect(tt).toContain(TokenType.KW_IF);
    expect(tt).toContain(TokenType.INDENT);
    expect(tt).toContain(TokenType.DEDENT);
    expect(tt).toContain(TokenType.FLOAT_LIT);
    expect(tt).toContain(TokenType.INT_LIT);
    expect(tt).toContain(TokenType.STRING_LIT);
    expect(tt).toContain(TokenType.COLON);

    // Must end with EOF
    expect(tt[tt.length - 1]).toBe(TokenType.EOF);

    // Count some key tokens
    const fnCount = tt.filter((t) => t === TokenType.KW_FN).length;
    expect(fnCount).toBe(2); // update and draw

    const letCount = tt.filter((t) => t === TokenType.KW_LET).length;
    expect(letCount).toBe(3); // x, y, speed

    const ifCount = tt.filter((t) => t === TokenType.KW_IF).length;
    expect(ifCount).toBe(4); // four key_down checks
  });
});
