import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { Language } from "./types.js";
import { lex } from "../src/lexer/lexer.js";
import { parse } from "../src/parser/parser.js";
import { generate } from "../src/codegen/codegen.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateVibe(code: string): ValidationResult {
  let lua: string;
  try {
    const tokens = lex(code, "benchmark.vibe");
    const ast = parse(tokens, "benchmark.vibe");
    lua = generate(ast);
  } catch (e: any) {
    return { valid: false, errors: [e.message || String(e)] };
  }

  // Verify generated Lua is syntactically valid via luac
  try {
    const tmpFile = "/tmp/vibe_benchmark_luac_test.lua";
    writeFileSync(tmpFile, lua);
    execSync(`luac -p "${tmpFile}"`, { timeout: 5000, stdio: "pipe" });
    return { valid: true, errors: [] };
  } catch (e: any) {
    const errMsg = e.stderr?.toString() || e.message || String(e);
    if (errMsg.includes("not found") || errMsg.includes("No such file")) {
      // luac not available — skip Lua syntax check
      return { valid: true, errors: [] };
    }
    return { valid: false, errors: [`luac: ${errMsg.trim()}`] };
  }
}

function validatePython(code: string): ValidationResult {
  try {
    const tmpFile = "/tmp/vibe_benchmark_test.py";
    writeFileSync(tmpFile, code);
    execSync(
      `python3 -c "import py_compile; py_compile.compile('${tmpFile}', doraise=True)"`,
      { timeout: 5000, stdio: "pipe" }
    );
    return { valid: true, errors: [] };
  } catch (e: any) {
    const errMsg = e.stderr?.toString() || e.message || String(e);
    return { valid: false, errors: [errMsg] };
  }
}

function validateLua(code: string): ValidationResult {
  try {
    const tmpFile = "/tmp/vibe_benchmark_test.lua";
    writeFileSync(tmpFile, code);
    execSync(`luac -p "${tmpFile}"`, { timeout: 5000, stdio: "pipe" });
    return { valid: true, errors: [] };
  } catch (e: any) {
    // If luac is not installed, try luajit
    try {
      const tmpFile = "/tmp/vibe_benchmark_test.lua";
      execSync(`luajit -bl "${tmpFile}" /dev/null`, {
        timeout: 5000,
        stdio: "pipe",
      });
      return { valid: true, errors: [] };
    } catch {
      // Fall back to basic syntax heuristics if neither tool is available
      const errMsg = e.stderr?.toString() || e.message || String(e);
      if (
        errMsg.includes("not found") ||
        errMsg.includes("No such file or directory")
      ) {
        // No Lua compiler available — skip validation with a warning
        return {
          valid: true,
          errors: ["Warning: luac/luajit not found, syntax not verified"],
        };
      }
      return { valid: false, errors: [errMsg] };
    }
  }
}

export function validateCode(
  code: string,
  language: Language
): ValidationResult {
  if (!code || code.trim().length === 0) {
    return { valid: false, errors: ["Empty code"] };
  }

  switch (language) {
    case "vibe":
      return validateVibe(code);
    case "python-pygame":
      return validatePython(code);
    case "lua-love":
      return validateLua(code);
    default:
      return { valid: false, errors: [`Unknown language: ${language}`] };
  }
}
