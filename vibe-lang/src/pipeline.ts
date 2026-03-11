import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { lex } from "./lexer/lexer.js";
import { parse } from "./parser/parser.js";
import { generate, generateConfLua } from "./codegen/codegen.js";
import type { GenerateOptions } from "./codegen/codegen.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Read the vibe_runtime.lua prelude (Vec2, Color, math utils, collision). */
function loadPrelude(): string {
  return readFileSync(resolve(__dirname, "runtime/vibe_runtime.lua"), "utf-8");
}

export interface CompileOptions {
  sourceMap?: boolean;
}

export interface CompileResult {
  mainLua: string;
  confLua: string;
  preludeLua: string;
}

export function compile(source: string, filename: string = "<stdin>", options?: CompileOptions): CompileResult {
  const tokens = lex(source, filename);
  const ast = parse(tokens, filename);
  const genOpts: GenerateOptions = {
    sourceMap: options?.sourceMap ?? false,
    sourceFile: filename,
  };
  const mainLua = generate(ast, genOpts);
  const confLua = generateConfLua();
  const preludeLua = loadPrelude();
  return { mainLua, confLua, preludeLua };
}
