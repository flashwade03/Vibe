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

  const get = (key: string, envKey?: string, required = true): string => {
    const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    if (m) return m[1].trim();
    if (envKey && process.env[envKey]) return process.env[envKey]!;
    if (required) throw new Error(`Missing config key: ${key} (or env ${envKey})`);
    return "";
  };

  return {
    geminiApiKey: get("gemini_api_key", "GEMINI_API_KEY", false),
    geminiModel: get("gemini_model", "GEMINI_MODEL", false) || "gemini-2.0-flash",
    openaiApiKey: get("openai_api_key", "OPENAI_API_KEY", false),
    openaiModel: get("openai_model", "OPENAI_MODEL", false) || "gpt-4o",
  };
}
