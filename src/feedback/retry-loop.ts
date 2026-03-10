// ============================================================
// Vibe Language — Error-Feedback Retry Loop
// Validates LLM output and retries with targeted feedback.
// ============================================================

import { lex } from "../lexer/lexer.js";
import { parse } from "../parser/parser.js";
import { generate } from "../codegen/codegen.js";
import { preprocess } from "./preprocessor.js";
import { classifyError } from "./error-classifier.js";
import { generateFeedback, buildRetryPrompt } from "./feedback-generator.js";

// ── Types ───────────────────────────────────────────────────

export interface RetryConfig {
  maxRetries: number;
  temperatures: number[];
}

export interface RetryResult {
  code: string;
  luaCode?: string;
  valid: boolean;
  attempts: number;
  errors: string[];
  retryPrompts: string[];
  totalLatencyMs: number;
}

export interface LLMCaller {
  (systemPrompt: string, userPrompt: string, temperature: number): Promise<string>;
}

// ── Main Entry Point ────────────────────────────────────────

/**
 * Generate code with automatic retry on compile errors.
 *
 * @param callLLM - Function to call the LLM
 * @param systemPrompt - Vibe system prompt
 * @param taskDescription - The game task to implement
 * @param config - Retry configuration
 * @returns RetryResult with final code, validity, and attempt count
 */
export async function generateWithRetry(
  callLLM: LLMCaller,
  systemPrompt: string,
  taskDescription: string,
  config: RetryConfig = { maxRetries: 2, temperatures: [0.2, 0.1, 0.3] },
): Promise<RetryResult> {
  const errors: string[] = [];
  const retryPrompts: string[] = [];
  let totalLatencyMs = 0;

  // Initial generation
  let temperature = config.temperatures[0] ?? 0.2;
  let start = Date.now();
  let rawCode = await callLLM(systemPrompt, taskDescription, temperature);
  totalLatencyMs += Date.now() - start;
  let code = preprocess(rawCode);

  let validation = validateVibeCode(code);

  if (validation.valid) {
    return {
      code,
      luaCode: validation.luaCode,
      valid: true,
      attempts: 1,
      errors: [],
      retryPrompts: [],
      totalLatencyMs,
    };
  }

  // Retry loop
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    const errorMsg = validation.error!;
    errors.push(errorMsg);

    const classified = classifyError(errorMsg, code);
    const feedback = generateFeedback(classified, attempt);
    const retryPrompt = buildRetryPrompt(taskDescription, code, feedback);
    retryPrompts.push(retryPrompt);

    temperature = config.temperatures[attempt] ?? 0.2;
    start = Date.now();
    rawCode = await callLLM(systemPrompt, retryPrompt, temperature);
    totalLatencyMs += Date.now() - start;
    code = preprocess(rawCode);

    validation = validateVibeCode(code);

    if (validation.valid) {
      return {
        code,
        luaCode: validation.luaCode,
        valid: true,
        attempts: attempt + 1,
        errors,
        retryPrompts,
        totalLatencyMs,
      };
    }
  }

  // All retries exhausted
  errors.push(validation.error!);
  return {
    code,
    valid: false,
    attempts: config.maxRetries + 1,
    errors,
    retryPrompts,
    totalLatencyMs,
  };
}

// ── Validation ──────────────────────────────────────────────

interface ValidationResult {
  valid: boolean;
  luaCode?: string;
  error?: string;
}

function validateVibeCode(code: string): ValidationResult {
  try {
    const tokens = lex(code);
    const ast = parse(tokens);
    const luaCode = generate(ast);
    return { valid: true, luaCode };
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    return { valid: false, error };
  }
}
