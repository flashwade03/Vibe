// ============================================================
// Vibe Language — Feedback Generator
// Builds LLM-friendly correction prompts from classified errors.
// ============================================================

import type { ClassifiedError, ErrorCategory } from "./error-classifier.js";

/**
 * Generate a structured correction prompt for an LLM retry.
 */
export function generateFeedback(
  classified: ClassifiedError,
  attempt: number,
): string {
  const explanation = CATEGORY_FEEDBACK[classified.category];
  const escalation =
    attempt >= 2
      ? "\n\n⚠️ This is the same type of error as your previous attempt. Pay extra attention to the rule above."
      : "";

  return `## Compile Error

${classified.originalError}

## Error Location
${classified.codeContext}

## Explanation
${explanation.reason}

## Correct Pattern
${explanation.pattern}
${escalation}`;
}

/**
 * Build the full retry user prompt.
 */
export function buildRetryPrompt(
  taskDescription: string,
  previousCode: string,
  feedback: string,
): string {
  return `Your previous Vibe code had a compile error. Rewrite the COMPLETE program from scratch.

## Original Task
${taskDescription}

## Previous Code (with error)
${previousCode}

${feedback}

## Instructions
- Rewrite the ENTIRE program from scratch (do not patch)
- Output ONLY Vibe code, no explanations or markdown
- Make sure all brackets, parentheses, and blocks are properly closed
- Keep the code concise`;
}

// ── Category-specific feedback ──────────────────────────────

interface CategoryFeedback {
  reason: string;
  pattern: string;
}

const CATEGORY_FEEDBACK: Record<ErrorCategory, CategoryFeedback> = {
  UNSUPPORTED_KEYWORD: {
    reason:
      'Vibe does not have `while`, `do`, `then`, `end`, `var`, `def`, or `function` keywords.\n' +
      'Use `for <condition>` instead of `while <condition>`.\n' +
      'Use `fn` instead of `function` or `def`.\n' +
      'Use `let` instead of `var`.',
    pattern:
      '-- Condition loop (replaces while):\n' +
      'for x > 0\n' +
      '    x = x - 1\n\n' +
      '-- Function:\n' +
      'fn my_func(a: Float) -> Float\n' +
      '    return a + 1',
  },

  MISSING_INITIALIZER: {
    reason:
      'In Vibe, `let` and `const` declarations MUST have an initial value.\n' +
      '`let x: Float` is NOT valid. Always write `let x: Float = 0.0`.',
    pattern:
      '-- ❌ Invalid:\n' +
      'let x: Float\n' +
      'let name: String\n\n' +
      '-- ✅ Valid:\n' +
      'let x: Float = 0.0\n' +
      'let name: String = ""',
  },

  MARKDOWN_FENCE: {
    reason:
      'The output contains markdown backticks (```) which are not valid Vibe syntax.\n' +
      'Output raw Vibe code only, with no markdown formatting.',
    pattern:
      '-- Just output code directly, no ``` fences:\n' +
      'let x: Float = 0.0\n' +
      'fn update(dt: Float)\n' +
      '    x = x + dt',
  },

  TRUNCATED_OUTPUT: {
    reason:
      'The code is incomplete — it was cut off before all brackets, lists, or function bodies were closed.\n' +
      'Write more concise code so it fits within the output limit.',
    pattern:
      '-- Make sure ALL brackets and blocks are closed:\n' +
      'let xs: List[Float] = [1.0, 2.0, 3.0]\n\n' +
      'fn update(dt: Float)\n' +
      '    for i in range(0, len(xs))\n' +
      '        xs[i] = xs[i] + dt',
  },

  UNEXPECTED_CHAR: {
    reason:
      'An unexpected character was found. Common causes:\n' +
      '- Using `!` instead of `not` (Vibe uses `not` for negation)\n' +
      '- Using `#` or `//` for comments (Vibe uses `--`)\n' +
      '- Using `{` or `}` for blocks (Vibe uses indentation)',
    pattern:
      '-- Comments use --\n' +
      '-- Boolean negation uses "not":\n' +
      'if not done\n' +
      '    do_something()',
  },

  INDENTATION_ERROR: {
    reason:
      'Indentation is inconsistent. Vibe uses spaces (not tabs) for indentation.\n' +
      'Use exactly 4 spaces per indent level. Do not mix tabs and spaces.',
    pattern:
      'fn update(dt: Float)\n' +
      '    if key_down("right")        -- 4 spaces\n' +
      '        x = x + speed * dt      -- 8 spaces',
  },

  UNKNOWN: {
    reason: 'A compile error occurred. Review the error message and fix the code.',
    pattern:
      '-- Follow Vibe syntax rules:\n' +
      '-- Use fn, let, const, if/else, for, return\n' +
      '-- Use 4-space indentation, no braces or colons before blocks\n' +
      '-- Use and/or/not for boolean logic',
  },
};
