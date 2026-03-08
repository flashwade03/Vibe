import { tasks } from "./tasks.js";
import { vibeContext } from "./contexts/vibe-context.js";
import { pythonPygameContext } from "./contexts/python-pygame-context.js";
import { luaLoveContext } from "./contexts/lua-love-context.js";
import { loadConfig } from "./config.js";
import { callLLM } from "./llm-client.js";
import { validateCode } from "./validators.js";
import { generateReport } from "./report.js";
import type {
  GenerationResult,
  LanguageContext,
} from "./types.js";
import type { LLMProvider } from "./types.js";

const languages: LanguageContext[] = [
  vibeContext,
  pythonPygameContext,
  luaLoveContext,
];
const llms: LLMProvider[] = ["gemini", "openai"];

async function main() {
  const config = loadConfig();
  const results: GenerationResult[] = [];

  console.log("=== Vibe LLM Benchmark Runner ===");
  console.log(`Tasks: ${tasks.length}`);
  console.log(`Languages: ${languages.map((l) => l.language).join(", ")}`);
  console.log(`LLMs: ${llms.join(", ")}`);
  console.log(
    `Total runs: ${tasks.length * languages.length * llms.length}`
  );
  console.log("");

  for (const task of tasks) {
    console.log(`\n--- Task: ${task.name} (${task.difficulty}) ---`);

    for (const langCtx of languages) {
      for (const llm of llms) {
        console.log(`  [${llm}] ${langCtx.language} — ${task.name}...`);

        try {
          const { code, latencyMs } = await callLLM(
            llm,
            langCtx.systemPrompt,
            task.description,
            config
          );

          const validation = validateCode(code, langCtx.language);

          // Rough token count: split by whitespace
          const tokenCount = code
            .split(/[\s\n]+/)
            .filter(Boolean).length;

          results.push({
            taskId: task.id,
            language: langCtx.language,
            llm,
            code,
            compilesOk: validation.valid,
            errors: validation.errors,
            tokenCount,
            latencyMs,
          });

          const status = validation.valid ? "PASS" : "FAIL";
          console.log(
            `    -> ${status} (${tokenCount} tokens, ${latencyMs}ms)`
          );
          if (!validation.valid) {
            console.log(
              `    -> Error: ${validation.errors[0]?.substring(0, 100)}`
            );
          }
        } catch (e: any) {
          console.log(`    -> ERROR: ${e.message}`);
          results.push({
            taskId: task.id,
            language: langCtx.language,
            llm,
            code: "",
            compilesOk: false,
            errors: [`API error: ${e.message}`],
            tokenCount: 0,
            latencyMs: 0,
          });
        }

        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  console.log("\n=== Generating Report ===");
  const report = generateReport(results);
  console.log("\n" + report);
}

main().catch(console.error);
