// ============================================================
// Vibe Language — Layer 0: Output Preprocessor
// Cleans up raw LLM output before pipeline validation.
// ============================================================

/**
 * Clean raw LLM output: strip markdown fences, fix whitespace, remove preamble.
 */
export function preprocess(code: string): string {
  let cleaned = code;

  // 1. Strip markdown code fences
  cleaned = stripCodeFences(cleaned);

  // 2. Remove preamble text before actual code
  const lines = cleaned.split("\n");
  const firstCodeLine = lines.findIndex((line) =>
    /^(fn |let |const |--|$)/.test(line.trimStart())
  );
  if (firstCodeLine > 0) {
    cleaned = lines.slice(firstCodeLine).join("\n");
  }

  // 3. Tab → 4 spaces
  cleaned = cleaned.replace(/\t/g, "    ");

  // 4. Trim trailing whitespace per line
  cleaned = cleaned
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n");

  // 5. Trim trailing blank lines, ensure final newline
  cleaned = cleaned.trimEnd() + "\n";

  return cleaned;
}

/**
 * Strip markdown code fences from LLM responses.
 * Handles ```vibe, ```python, ```lua, ``` etc.
 */
function stripCodeFences(text: string): string {
  let t = text.trim();

  // Full wrap: ```lang\n...\n```
  const fullWrap = /^```[a-zA-Z]*\s*\n([\s\S]*?)\n```\s*$/;
  const m1 = t.match(fullWrap);
  if (m1) return m1[1].trim();

  // First code block in mixed output
  const firstBlock = /```[a-zA-Z]*\s*\n([\s\S]*?)\n```/;
  const m2 = t.match(firstBlock);
  if (m2) return m2[1].trim();

  // Stray backticks at start/end (incomplete fences)
  t = t.replace(/^`{1,3}[a-zA-Z]*\s*\n?/, "");
  t = t.replace(/\n?`{1,3}\s*$/, "");

  return t.trim();
}
