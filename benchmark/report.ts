import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import {
  GenerationResult,
  LanguageSummary,
  Language,
  LLMProvider,
} from "./types.js";

const LANGUAGE_EXTENSIONS: Record<Language, string> = {
  vibe: ".vibe",
  "python-pygame": ".py",
  "lua-love": ".lua",
};

function computeSummaries(results: GenerationResult[]): LanguageSummary[] {
  const groups = new Map<string, GenerationResult[]>();

  for (const r of results) {
    const key = `${r.language}|${r.llm}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  const summaries: LanguageSummary[] = [];

  for (const [key, group] of Array.from(groups)) {
    const [language, llm] = key.split("|") as [Language, LLMProvider];
    const compilePassCount = group.filter((r) => r.compilesOk).length;
    const totalTasks = group.length;
    const avgTokenCount = Math.round(
      group.reduce((s, r) => s + r.tokenCount, 0) / totalTasks
    );
    const avgLatencyMs = Math.round(
      group.reduce((s, r) => s + r.latencyMs, 0) / totalTasks
    );

    summaries.push({
      language,
      llm,
      totalTasks,
      compilePassCount,
      compilePassRate: Math.round((compilePassCount / totalTasks) * 100),
      avgTokenCount,
      avgLatencyMs,
    });
  }

  // Sort: by language then by llm
  summaries.sort((a, b) => {
    if (a.language !== b.language) return a.language.localeCompare(b.language);
    return a.llm.localeCompare(b.llm);
  });

  return summaries;
}

function buildSummaryTable(summaries: LanguageSummary[]): string {
  const lines: string[] = [];
  lines.push(
    "| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |"
  );
  lines.push(
    "|----------|-----|-----------|------------|-------------|"
  );

  for (const s of summaries) {
    const passRate = `${s.compilePassRate}% (${s.compilePassCount}/${s.totalTasks})`;
    lines.push(
      `| ${s.language} | ${s.llm} | ${passRate} | ${s.avgTokenCount} | ${s.avgLatencyMs}ms |`
    );
  }

  return lines.join("\n");
}

function buildDetailedResults(results: GenerationResult[]): string {
  // Group by taskId
  const taskGroups = new Map<string, GenerationResult[]>();
  for (const r of results) {
    if (!taskGroups.has(r.taskId)) taskGroups.set(r.taskId, []);
    taskGroups.get(r.taskId)!.push(r);
  }

  const sections: string[] = [];

  for (const [taskId, group] of Array.from(taskGroups)) {
    const lines: string[] = [];
    lines.push(`### Task: ${taskId}`);
    lines.push("");
    lines.push("| Language | LLM | Pass | Tokens | Latency | Errors |");
    lines.push("|----------|-----|------|--------|---------|--------|");

    for (const r of group) {
      const pass = r.compilesOk ? "YES" : "NO";
      const errors = r.errors.length > 0
        ? r.errors[0].substring(0, 80).replace(/\|/g, "\\|").replace(/\n/g, " ")
        : "-";
      lines.push(
        `| ${r.language} | ${r.llm} | ${pass} | ${r.tokenCount} | ${r.latencyMs}ms | ${errors} |`
      );
    }

    sections.push(lines.join("\n"));
  }

  return sections.join("\n\n");
}

function saveGeneratedCode(results: GenerationResult[]): void {
  const outputDir = join(process.cwd(), "benchmark", "output");

  for (const r of results) {
    if (!r.code) continue;

    const ext = LANGUAGE_EXTENSIONS[r.language] || ".txt";
    const filePath = join(outputDir, r.language, r.llm, `${r.taskId}${ext}`);
    const dir = dirname(filePath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, r.code, "utf-8");
  }
}

export function generateReport(results: GenerationResult[]): string {
  const summaries = computeSummaries(results);
  const timestamp = new Date().toISOString();

  const report = `# LLM Code Generation Benchmark Results

**Generated**: ${timestamp}

## Summary

${buildSummaryTable(summaries)}

## Detailed Results

${buildDetailedResults(results)}
`;

  // Save report to file
  const reportPath = join(process.cwd(), "benchmark", "results.md");
  writeFileSync(reportPath, report, "utf-8");
  console.log(`\nReport saved to: ${reportPath}`);

  // Save all generated code files
  saveGeneratedCode(results);
  console.log(`Generated code saved to: benchmark/output/`);

  return report;
}
