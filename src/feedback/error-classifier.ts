// ============================================================
// Vibe Language — Error Classifier
// Categorizes parse/lex errors for targeted LLM feedback.
// ============================================================

export type ErrorCategory =
  | "UNSUPPORTED_KEYWORD"
  | "MISSING_INITIALIZER"
  | "MARKDOWN_FENCE"
  | "TRUNCATED_OUTPUT"
  | "UNEXPECTED_CHAR"
  | "INDENTATION_ERROR"
  | "UNKNOWN";

export interface ClassifiedError {
  category: ErrorCategory;
  originalError: string;
  line: number;
  col: number;
  codeContext: string;
}

/**
 * Classify a Vibe pipeline error into a known category.
 */
export function classifyError(
  errorMessage: string,
  code: string,
): ClassifiedError {
  const { line, col } = parseLocation(errorMessage);
  const codeContext = extractContext(code, line);

  const category = detectCategory(errorMessage, code, line);

  return {
    category,
    originalError: errorMessage,
    line,
    col,
    codeContext,
  };
}

function detectCategory(
  error: string,
  code: string,
  line: number,
): ErrorCategory {
  // Markdown backtick in source
  if (error.includes("unexpected character: '`'")) {
    return "MARKDOWN_FENCE";
  }

  // Indentation error
  if (error.includes("inconsistent indentation")) {
    return "INDENTATION_ERROR";
  }

  // Truncated output: EOF where content was expected
  if (
    error.includes("got EOF") ||
    (error.includes("got DEDENT") && error.includes("expected RBRACKET"))
  ) {
    return "TRUNCATED_OUTPUT";
  }

  // Missing initializer: `let x: Type` without `= value`
  if (error.includes("expected EQ, got NEWLINE")) {
    const codeLine = getLine(code, line);
    if (codeLine && /^\s*(let|const)\s+\w+/.test(codeLine) && !codeLine.includes("=")) {
      return "MISSING_INITIALIZER";
    }
    // Could also be unsupported keyword on previous line
    const prevLine = getLine(code, line - 1);
    if (prevLine && /\b(while|do|then|end|var|def|function)\b/.test(prevLine)) {
      return "UNSUPPORTED_KEYWORD";
    }
  }

  // Unexpected character (!, @, # etc.)
  if (error.includes("unexpected character")) {
    return "UNEXPECTED_CHAR";
  }

  // Generic unexpected token — check for unsupported keywords
  if (error.includes("unexpected token")) {
    const codeLine = getLine(code, line);
    if (codeLine && /\b(while|do|then|end|var|def|function)\b/.test(codeLine)) {
      return "UNSUPPORTED_KEYWORD";
    }
  }

  return "UNKNOWN";
}

function parseLocation(error: string): { line: number; col: number } {
  // Format: filename:line:col: stage error: message
  const m = error.match(/:(\d+):(\d+):/);
  if (m) return { line: parseInt(m[1]), col: parseInt(m[2]) };
  return { line: 1, col: 1 };
}

function getLine(code: string, lineNum: number): string | undefined {
  const lines = code.split("\n");
  return lines[lineNum - 1];
}

/**
 * Extract code context around error line (±3 lines).
 */
export function extractContext(
  code: string,
  errorLine: number,
  window: number = 3,
): string {
  const lines = code.split("\n");
  const start = Math.max(0, errorLine - window - 1);
  const end = Math.min(lines.length, errorLine + window);
  return lines
    .slice(start, end)
    .map((line, i) => {
      const lineNum = start + i + 1;
      const marker = lineNum === errorLine ? ">>>" : "   ";
      return `${marker} ${lineNum} | ${line}`;
    })
    .join("\n");
}
