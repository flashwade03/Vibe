export type VibePhase = "lexer" | "parser" | "codegen";

export class VibeError extends Error {
  filename: string;
  line: number;
  col: number;
  phase: VibePhase;

  constructor(filename: string, line: number, col: number, phase: VibePhase, message: string) {
    super(message);
    this.name = "VibeError";
    this.filename = filename;
    this.line = line;
    this.col = col;
    this.phase = phase;
  }

  format(): string {
    return `${this.filename}:${this.line}:${this.col}: ${this.phase} error: ${this.message}`;
  }
}
