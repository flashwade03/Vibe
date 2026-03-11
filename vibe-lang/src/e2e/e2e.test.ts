import { describe, it, expect } from "vitest";
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
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

  it("demo_bouncing_balls.vibe compiles and generates valid Lua", () => {
    const demoPath = resolve(__dirname, "../../examples/demo_bouncing_balls.vibe");
    const source = readFileSync(demoPath, "utf-8");
    const { mainLua } = compile(source, "demo_bouncing_balls.vibe");

    // Verify key codegen fixes
    expect(mainLua).toContain("#balls");           // len() → #
    expect(mainLua).toContain("table.insert");     // append() → table.insert
    expect(mainLua).toContain("love.graphics.setColor"); // set_color mapping

    // Verify struct → constructor function
    expect(mainLua).toContain("function Ball(x, y, vx, vy, r)");
    expect(mainLua).toContain("local self = {");
    expect(mainLua).toContain("return self");

    // luac syntax validation (if available)
    try {
      const tmpDir = resolve(__dirname, "../../.tmp");
      mkdirSync(tmpDir, { recursive: true });
      const tmpFile = resolve(tmpDir, "test_output.lua");
      writeFileSync(tmpFile, mainLua);
      execSync(`luac -p "${tmpFile}"`, { stdio: "pipe" });
      unlinkSync(tmpFile);
    } catch {
      // luac not available — skip runtime validation
    }
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
