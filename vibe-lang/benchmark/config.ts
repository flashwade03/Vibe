import { readFileSync } from "fs";
import { join } from "path";

export interface BenchmarkConfig {
  geminiApiKey: string;
  geminiModel: string;
  openaiApiKey: string;
  openaiModel: string;
}

export function loadConfig(): BenchmarkConfig {
  const configPath = join(process.cwd(), ".claude", "damascus.local.md");
  const content = readFileSync(configPath, "utf-8");

  // Parse YAML frontmatter between --- markers
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("No YAML frontmatter found in damascus.local.md");
  const frontmatter = match[1];

  const get = (key: string): string => {
    const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    if (!m) throw new Error(`Missing config key: ${key}`);
    return m[1].trim();
  };

  return {
    geminiApiKey: get("gemini_api_key"),
    geminiModel: get("gemini_model"),
    openaiApiKey: get("openai_api_key"),
    openaiModel: get("openai_model"),
  };
}
