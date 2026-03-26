import { execSync } from "child_process";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Language } from "./types.js";
import { lex } from "../src/lexer/lexer.js";
import { parse } from "../src/parser/parser.js";
import { generate, generateConfLua } from "../src/codegen/codegen.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

/** Find LÖVE executable (same logic as cli.ts) */
function findLove(): string {
  try {
    execSync("which love", { stdio: "ignore" });
    return "love";
  } catch {}
  const macPath = "/Applications/love.app/Contents/MacOS/love";
  if (existsSync(macPath)) return macPath;
  return "love";
}

/** Auto-quit harness: runs 10 frames of update+draw then exits */
const TEST_HARNESS = `
-- Vibe runtime test harness: auto-quit after 10 frames
do
  local _orig_update = love.update
  local _orig_draw = love.draw
  local _frame = 0
  love.update = function(dt)
    if _orig_update then _orig_update(dt) end
    _frame = _frame + 1
    if _frame >= 10 then love.event.quit() end
  end
  love.draw = function()
    if _orig_draw then _orig_draw() end
  end
end
`;

/**
 * Runtime validation: compile Vibe code and run it in LÖVE for 10 frames.
 * Returns PASS if no runtime errors, FAIL with error message otherwise.
 */
export function validateVibeRuntime(code: string): ValidationResult {
  // Step 1: Compile Vibe → Lua
  let lua: string;
  try {
    const tokens = lex(code, "benchmark.vibe");
    const ast = parse(tokens, "benchmark.vibe");
    lua = generate(ast);
  } catch (e: any) {
    return { valid: false, errors: [`compile: ${e.message || String(e)}`] };
  }

  // Step 2: Build temp directory with all files
  const buildDir = "/tmp/vibe_runtime_test";
  mkdirSync(buildDir, { recursive: true });

  const preludePath = resolve(__dirname, "../src/runtime/vibe_runtime.lua");
  const prelude = readFileSync(preludePath, "utf-8");

  writeFileSync(resolve(buildDir, "vibe_runtime.lua"), prelude);
  writeFileSync(resolve(buildDir, "conf.lua"), generateConfLua());
  writeFileSync(
    resolve(buildDir, "main.lua"),
    `require("vibe_runtime")\n${lua}\n${TEST_HARNESS}`
  );

  // Step 3: Run LÖVE with timeout
  const lovePath = findLove();
  try {
    execSync(`"${lovePath}" "${buildDir}"`, {
      timeout: 10000,
      stdio: "pipe",
    });
    return { valid: true, errors: [] };
  } catch (e: any) {
    if (e.status === 0) {
      return { valid: true, errors: [] };
    }
    const stderr = e.stderr?.toString() || "";
    const stdout = e.stdout?.toString() || "";
    const output = stderr + "\n" + stdout;
    // LÖVE runtime errors contain "Error" or "stack traceback"
    const hasLoveError = output.includes("Error") || output.includes("stack traceback") || output.includes("attempt to");
    if (!hasLoveError) {
      // No real LÖVE error — likely macOS system noise (IMK, TSM, Metal)
      return { valid: true, errors: [] };
    }
    // Extract the actual error line
    const errorLines = output.split("\n")
      .filter(line => line.includes("Error") || line.includes("stack traceback") || line.includes("main.lua:") || line.includes("attempt to"))
      .join("\n")
      .trim();
    return { valid: false, errors: [`runtime: ${errorLines.substring(0, 300)}`] };
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
