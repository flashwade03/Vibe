import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { compile } from "../pipeline.js";
import { VibeError } from "../errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = resolve(__dirname, "fixtures");

function readFixture(name: string): string {
  return readFileSync(resolve(fixturesDir, name), "utf-8");
}

/** Normalize for comparison: trim trailing whitespace from each line, trim trailing newlines. */
function normalize(s: string): string {
  return s
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trimEnd();
}

describe("E2E pipeline", () => {
  it("compiles moving_rect.vibe to expected Lua output", () => {
    const source = readFixture("moving_rect.vibe");
    const expected = readFixture("moving_rect.lua");
    const { mainLua } = compile(source, "moving_rect.vibe");

    expect(normalize(mainLua)).toBe(normalize(expected));
  });

  it("generates conf.lua with LOVE2D configuration", () => {
    const source = readFixture("moving_rect.vibe");
    const { confLua } = compile(source, "moving_rect.vibe");

    expect(confLua).toContain("love.conf");
    expect(confLua).toContain("t.window.title");
    expect(confLua).toContain("800");
    expect(confLua).toContain("600");
  });

  it("throws VibeError with location for invalid source", () => {
    const source = readFixture("error_missing_eq.vibe");

    try {
      compile(source, "error_missing_eq.vibe");
      expect.fail("Expected VibeError to be thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(VibeError);
      const vibeErr = err as VibeError;
      expect(vibeErr.phase === "parser" || vibeErr.phase === "lexer").toBe(true);
      const formatted = vibeErr.format();
      expect(formatted).toContain("error_missing_eq.vibe");
      expect(formatted).toMatch(/\d+:\d+/);
    }
  });
});
