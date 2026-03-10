import { readdirSync, readFileSync } from "fs";
import { join, basename } from "path";
import { lex } from "../src/lexer/lexer.js";
import { parse } from "../src/parser/parser.js";
import { generate } from "../src/codegen/codegen.js";

const dir = join(process.cwd(), "benchmark", "output", "vibe", "claude");
const files = readdirSync(dir).filter(f => f.endsWith(".vibe")).sort();

let pass = 0;
let fail = 0;

for (const file of files) {
  const task = basename(file, ".vibe");
  const code = readFileSync(join(dir, file), "utf-8");
  const tokens_count = code.split(/[\s\n]+/).filter(Boolean).length;

  try {
    const tokens = lex(code, file);
    const ast = parse(tokens, file);
    generate(ast);
    console.log(`  ${task}: PASS (${tokens_count} tokens)`);
    pass++;
  } catch (e: any) {
    console.log(`  ${task}: FAIL (${tokens_count} tokens) — ${e.message}`);
    fail++;
  }
}

console.log(`\n=== Claude Vibe Benchmark ===`);
console.log(`Pass: ${pass}/${files.length} (${Math.round(pass / files.length * 100)}%)`);
console.log(`Fail: ${fail}/${files.length}`);
