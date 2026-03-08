// Shared types for the LLM benchmark

export interface Task {
  id: string;
  name: string;
  description: string; // Natural language game task for LLM
  difficulty: "easy" | "medium" | "hard";
  expectedBehaviors: string[]; // What the code should do
}

export type Language = "vibe" | "python-pygame" | "lua-love";
export type LLMProvider = "gemini" | "openai";

export interface LanguageContext {
  language: Language;
  systemPrompt: string; // Full system prompt including grammar/docs
}

export interface GenerationResult {
  taskId: string;
  language: Language;
  llm: LLMProvider;
  code: string;
  compilesOk: boolean;
  errors: string[];
  tokenCount: number; // approximate token count of generated code
  latencyMs: number;
}

export interface BenchmarkReport {
  timestamp: string;
  results: GenerationResult[];
  summary: LanguageSummary[];
}

export interface LanguageSummary {
  language: Language;
  llm: LLMProvider;
  totalTasks: number;
  compilePassCount: number;
  compilePassRate: number; // 0-100
  avgTokenCount: number;
  avgLatencyMs: number;
}
