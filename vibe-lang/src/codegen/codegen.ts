// ============================================================
// Vibe Language — Code Generator (AST → Lua)
// Transforms a Vibe AST into Lua source code targeting LOVE2D.
// ============================================================

import type {
  Program,
  TopLevelDecl,
  FnDecl,
  LetDecl,
  ConstDecl,
  Stmt,
  IfStmt,
  ForStmt,
  ReturnStmt,
  Assignment,
  ExprStmt,
  Expr,
  IntLiteral,
  FloatLiteral,
  StringLiteral,
  BoolLiteral,
  Identifier,
  BinaryExpr,
  UnaryExpr,
  CallExpr,
  FieldAccess,
  IndexAccess,
  GroupExpr,
  ListLiteral,
} from "../parser/ast.js";

// ── Constants ───────────────────────────────────────────────

const INDENT = "  "; // 2-space indentation

/** LOVE2D game-loop function names that get `love.` prefix. */
const LOVE_FUNCTIONS = new Set([
  "update", "draw", "load",
  "keypressed", "keyreleased",
  "mousepressed", "mousereleased", "mousemoved",
]);

/** Lua reserved words that are NOT Vibe keywords — must be escaped. */
const LUA_RESERVED = new Set([
  "do", "end", "then", "elseif", "function", "goto",
  "local", "nil", "repeat", "until", "while",
]);

/** Built-in Vibe function → Lua mapping. */
const BUILTIN_MAP: Record<string, { lua: string; prependArgs?: string[] }> = {
  key_down:    { lua: "love.keyboard.isDown" },
  draw_rect:   { lua: "love.graphics.rectangle", prependArgs: ['"fill"'] },
  draw_text:   { lua: "love.graphics.print" },
  draw_circle: { lua: "love.graphics.circle", prependArgs: ['"fill"'] },
  str:         { lua: "tostring" },
  int:         { lua: "math.floor" },
  float:       { lua: "tonumber" },
  sqrt:        { lua: "math.sqrt" },
  cos:         { lua: "math.cos" },
  sin:         { lua: "math.sin" },
  rand_float:  { lua: "love.math.random" },
};

// ── Public API ──────────────────────────────────────────────

/**
 * Generate Lua source code from a Vibe Program AST.
 */
export function generate(program: Program): string {
  const parts: string[] = [];

  for (let i = 0; i < program.body.length; i++) {
    const decl = program.body[i];

    // Add blank line before function declarations (unless first item)
    if (decl.kind === "FnDecl" && i > 0) {
      parts.push("");
    }

    parts.push(emitTopLevel(decl));
  }

  return parts.join("\n");
}

/**
 * Generate the static conf.lua content for LOVE2D.
 */
export function generateConfLua(): string {
  return [
    "function love.conf(t)",
    `${INDENT}t.window.title = "Vibe Game"`,
    `${INDENT}t.window.width = 800`,
    `${INDENT}t.window.height = 600`,
    "end",
  ].join("\n");
}

// ── Top-level declarations ──────────────────────────────────

function emitTopLevel(decl: TopLevelDecl): string {
  switch (decl.kind) {
    case "FnDecl":
      return emitFnDecl(decl, 0);
    case "LetDecl":
      return emitLetDecl(decl, 0);
    case "ConstDecl":
      return emitConstDecl(decl, 0);
    case "ExprStmt":
      return emitExprStmt(decl, 0);
    case "Assignment":
      return emitAssignment(decl, 0);
  }
}

// ── Declarations ────────────────────────────────────────────

function emitFnDecl(node: FnDecl, depth: number): string {
  const prefix = indent(depth);
  const name = LOVE_FUNCTIONS.has(node.name)
    ? `love.${node.name}`
    : escapeLuaReserved(node.name);
  const params = node.params.map((p) => escapeLuaReserved(p.name)).join(", ");
  const lines: string[] = [];

  lines.push(`${prefix}function ${name}(${params})`);
  for (const stmt of node.body) {
    lines.push(emitStmt(stmt, depth + 1));
  }
  lines.push(`${prefix}end`);

  return lines.join("\n");
}

function emitLetDecl(node: LetDecl, depth: number): string {
  const prefix = indent(depth);
  const name = escapeLuaReserved(node.name);
  if (node.value) {
    return `${prefix}local ${name} = ${emitExpr(node.value)}`;
  }
  return `${prefix}local ${name}`;
}

function emitConstDecl(node: ConstDecl, depth: number): string {
  const prefix = indent(depth);
  const name = escapeLuaReserved(node.name);
  return `${prefix}local ${name} = ${emitExpr(node.value)}`;
}

// ── Statements ──────────────────────────────────────────────

function emitStmt(stmt: Stmt, depth: number): string {
  switch (stmt.kind) {
    case "LetDecl":
      return emitLetDecl(stmt, depth);
    case "ConstDecl":
      return emitConstDecl(stmt, depth);
    case "IfStmt":
      return emitIfStmt(stmt, depth);
    case "ForStmt":
      return emitForStmt(stmt, depth);
    case "ReturnStmt":
      return emitReturnStmt(stmt, depth);
    case "Assignment":
      return emitAssignment(stmt, depth);
    case "ExprStmt":
      return emitExprStmt(stmt, depth);
  }
}

function emitIfStmt(node: IfStmt, depth: number, isElseIf = false): string {
  const prefix = indent(depth);
  const lines: string[] = [];
  const keyword = isElseIf ? "elseif" : "if";

  lines.push(`${prefix}${keyword} ${emitExpr(node.condition)} then`);
  for (const stmt of node.body) {
    lines.push(emitStmt(stmt, depth + 1));
  }

  if (node.elseBody && node.elseBody.length > 0) {
    // Check for else-if chain: elseBody is a single IfStmt
    if (node.elseBody.length === 1 && node.elseBody[0].kind === "IfStmt") {
      lines.push(emitIfStmt(node.elseBody[0] as IfStmt, depth, true));
    } else {
      lines.push(`${prefix}else`);
      for (const stmt of node.elseBody) {
        lines.push(emitStmt(stmt, depth + 1));
      }
      lines.push(`${prefix}end`);
    }
  } else {
    lines.push(`${prefix}end`);
  }

  return lines.join("\n");
}

function emitForStmt(node: ForStmt, depth: number): string {
  const prefix = indent(depth);
  const lines: string[] = [];
  const variant = node.variant;

  if (variant.kind === "ForIn") {
    const varName = escapeLuaReserved(variant.variable);
    const iterable = variant.iterable;

    // Check for range() pattern
    if (
      iterable.kind === "CallExpr" &&
      iterable.callee.kind === "Identifier" &&
      iterable.callee.name === "range"
    ) {
      const args = iterable.args;
      if (args.length === 1) {
        // range(n) → for i = 0, n-1
        const n = emitExpr(args[0]);
        const upper = args[0].kind === "IntLiteral" ? String(args[0].value - 1) : `${n} - 1`;
        lines.push(`${prefix}for ${varName} = 0, ${upper} do`);
      } else if (args.length === 2) {
        // range(start, end) → for i = start, end-1
        const start = emitExpr(args[0]);
        const end = args[1];
        const upper = end.kind === "IntLiteral" ? String(end.value - 1) : `${emitExpr(end)} - 1`;
        lines.push(`${prefix}for ${varName} = ${start}, ${upper} do`);
      }
    } else {
      // Regular for-in → ipairs
      lines.push(`${prefix}for _, ${varName} in ipairs(${emitExpr(iterable)}) do`);
    }
  } else {
    // ForCond → while
    lines.push(`${prefix}while ${emitExpr(variant.condition)} do`);
  }

  for (const stmt of node.body) {
    lines.push(emitStmt(stmt, depth + 1));
  }
  lines.push(`${prefix}end`);

  return lines.join("\n");
}

function emitReturnStmt(node: ReturnStmt, depth: number): string {
  const prefix = indent(depth);
  if (node.value) {
    return `${prefix}return ${emitExpr(node.value)}`;
  }
  return `${prefix}return`;
}

function emitAssignment(node: Assignment, depth: number): string {
  const prefix = indent(depth);
  const target = emitExpr(node.target);
  if (node.op && node.op !== "=") {
    // Desugar compound assignment: x += 5 → x = x + 5
    const arithmeticOp = node.op.slice(0, -1); // "+=" → "+"
    return `${prefix}${target} = ${target} ${arithmeticOp} ${emitExpr(node.value)}`;
  }
  return `${prefix}${target} = ${emitExpr(node.value)}`;
}

function emitExprStmt(node: ExprStmt, depth: number): string {
  const prefix = indent(depth);
  return `${prefix}${emitExpr(node.expr)}`;
}

// ── Expressions ─────────────────────────────────────────────

function emitExpr(expr: Expr): string {
  switch (expr.kind) {
    case "IntLiteral":
      return String(expr.value);
    case "FloatLiteral": {
      const s = String(expr.value);
      return s.includes(".") ? s : s + ".0";
    }
    case "StringLiteral":
      return `"${expr.value}"`;
    case "BoolLiteral":
      return expr.value ? "true" : "false";
    case "Identifier":
      return escapeLuaReserved(expr.name);
    case "BinaryExpr":
      return emitBinaryExpr(expr);
    case "UnaryExpr":
      return emitUnaryExpr(expr);
    case "CallExpr":
      return emitCallExpr(expr);
    case "FieldAccess":
      return `${emitExpr(expr.object)}.${escapeLuaReserved(expr.field)}`;
    case "IndexAccess":
      return `${emitExpr(expr.object)}[${emitExpr(expr.index)}]`;
    case "GroupExpr":
      return `(${emitExpr(expr.expr)})`;
    case "ListLiteral":
      return `{${expr.elements.map(emitExpr).join(", ")}}`;
  }
}

function emitBinaryExpr(node: BinaryExpr): string {
  const left = emitExpr(node.left);
  const right = emitExpr(node.right);
  let op = node.op === "!=" ? "~=" : node.op;
  // Vibe uses + for string concatenation; Lua uses ..
  if (op === "+" && (isStringy(node.left) || isStringy(node.right))) {
    op = "..";
  }
  return `${left} ${op} ${right}`;
}

/** Check if an expression is likely a string (StringLiteral or str() call). */
function isStringy(expr: Expr): boolean {
  if (expr.kind === "StringLiteral") return true;
  if (
    expr.kind === "CallExpr" &&
    expr.callee.kind === "Identifier" &&
    expr.callee.name === "str"
  ) return true;
  // Recursive: "a" + "b" + "c" — the left side is a BinaryExpr with +
  if (expr.kind === "BinaryExpr" && expr.op === "+") {
    return isStringy(expr.left) || isStringy(expr.right);
  }
  return false;
}

function emitUnaryExpr(node: UnaryExpr): string {
  const operand = emitExpr(node.operand);
  if (node.op === "not") {
    return `not ${operand}`;
  }
  return `${node.op}${operand}`;
}

function emitCallExpr(node: CallExpr): string {
  // Check for built-in function mapping
  if (node.callee.kind === "Identifier") {
    const mapping = BUILTIN_MAP[node.callee.name];
    if (mapping) {
      const args = node.args.map(emitExpr);
      const allArgs = mapping.prependArgs
        ? [...mapping.prependArgs, ...args]
        : args;
      return `${mapping.lua}(${allArgs.join(", ")})`;
    }
  }

  const callee = emitExpr(node.callee);
  const args = node.args.map(emitExpr).join(", ");
  return `${callee}(${args})`;
}

// ── Utilities ───────────────────────────────────────────────

function indent(depth: number): string {
  return INDENT.repeat(depth);
}

function escapeLuaReserved(name: string): string {
  return LUA_RESERVED.has(name) ? `_v_${name}` : name;
}
