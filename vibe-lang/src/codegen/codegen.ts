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
  StructDecl,
  EnumDecl,
  TraitDecl,
  TraitImplDecl,
  Stmt,
  IfStmt,
  ForStmt,
  MatchStmt,
  MatchArm,
  MatchPattern,
  ReturnStmt,
  BreakStmt,
  ContinueStmt,
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
  MapLiteral,
  MatchExpr,
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
  append:      { lua: "table.insert" },
  remove:      { lua: "table.remove" },
  abs:         { lua: "math.abs" },
  min:         { lua: "math.min" },
  max:         { lua: "math.max" },
  rand_int:    { lua: "math.random" },
  print:       { lua: "print" },
  set_color:   { lua: "love.graphics.setColor" },
  draw_line:   { lua: "love.graphics.line" },
  get_width:   { lua: "love.graphics.getWidth" },
  get_height:  { lua: "love.graphics.getHeight" },
  set_bg_color: { lua: "love.graphics.setBackgroundColor" },
};

// ── Continue label state (reset per generate() call) ────────
let _continueCounter = 0;
const _continueLabelStack: string[] = [];

// ── Public API ──────────────────────────────────────────────

/**
 * Generate Lua source code from a Vibe Program AST.
 */
export function generate(program: Program): string {
  _continueCounter = 0;
  _continueLabelStack.length = 0;
  const parts: string[] = [];

  for (let i = 0; i < program.body.length; i++) {
    const decl = program.body[i];

    // Add blank line before function/struct/enum declarations (unless first item)
    if ((decl.kind === "FnDecl" || decl.kind === "StructDecl" || decl.kind === "EnumDecl" || decl.kind === "TraitImplDecl") && i > 0) {
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
    case "StructDecl":
      return emitStructDecl(decl);
    case "EnumDecl":
      return emitEnumDecl(decl);
    case "TraitDecl":
      return emitTraitDecl(decl);
    case "TraitImplDecl":
      return emitTraitImplDecl(decl);
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
    // Special case: match expression as value
    if (node.value.kind === "MatchExpr") {
      return emitMatchExprAsDecl(name, node.value, depth);
    }
    return `${prefix}local ${name} = ${emitExpr(node.value)}`;
  }
  return `${prefix}local ${name}`;
}

function emitConstDecl(node: ConstDecl, depth: number): string {
  const prefix = indent(depth);
  const name = escapeLuaReserved(node.name);
  return `${prefix}local ${name} = ${emitExpr(node.value)}`;
}

// ── Struct / Enum / Trait ────────────────────────────────────

/**
 * struct Position
 *   x: Float = 0.0
 *   y: Float = 0.0
 * →
 * function Position(x, y)
 *   local self = {}
 *   self.x = x or 0.0
 *   self.y = y or 0.0
 *   return self
 * end
 */
function emitStructDecl(node: StructDecl): string {
  const lines: string[] = [];
  const name = node.name;
  const params = node.fields.map((f) => escapeLuaReserved(f.name)).join(", ");

  lines.push(`function ${name}(${params})`);

  // Initialize fields
  for (const field of node.fields) {
    const fieldName = escapeLuaReserved(field.name);
    if (field.defaultValue) {
      lines.push(`${INDENT}local _${fieldName} = ${fieldName}`);
      lines.push(`${INDENT}if _${fieldName} == nil then _${fieldName} = ${emitExpr(field.defaultValue)} end`);
    }
  }

  // Build self table
  if (node.fields.length > 0) {
    const fieldInits = node.fields.map((f) => {
      const n = escapeLuaReserved(f.name);
      return f.defaultValue ? `${n} = _${n}` : `${n} = ${n}`;
    });
    lines.push(`${INDENT}local self = {${fieldInits.join(", ")}}`);
  } else {
    lines.push(`${INDENT}local self = {}`);
  }

  lines.push(`${INDENT}return self`);
  lines.push("end");

  // Emit methods as Name_methodName functions
  for (const method of node.methods) {
    lines.push("");
    lines.push(emitFnDecl({ ...method, name: `${name}_${method.name}` }, 0));
  }

  return lines.join("\n");
}

/**
 * enum Direction
 *   Up
 *   Down
 * →
 * Direction = {}
 * Direction.Up = "Up"
 * Direction.Down = "Down"
 *
 * enum State
 *   Idle
 *   Walking(speed: Float)
 * →
 * State = {}
 * State.Idle = "Idle"
 * function State.Walking(speed)
 *   return {_type = "Walking", speed = speed}
 * end
 */
function emitEnumDecl(node: EnumDecl): string {
  const lines: string[] = [];
  const name = node.name;

  lines.push(`${name} = {}`);

  for (const variant of node.variants) {
    if (variant.fields.length === 0) {
      // Simple variant: string constant
      lines.push(`${name}.${variant.name} = "${variant.name}"`);
    } else {
      // Data variant: constructor function
      const params = variant.fields.map((f) => escapeLuaReserved(f.name || `_${variant.fields.indexOf(f)}`)).join(", ");
      const fieldInits = variant.fields.map((f) => {
        const fieldName = escapeLuaReserved(f.name || `_${variant.fields.indexOf(f)}`);
        return `${fieldName} = ${fieldName}`;
      });
      lines.push(`function ${name}.${variant.name}(${params})`);
      lines.push(`${INDENT}return {_type = "${variant.name}", ${fieldInits.join(", ")}}`);
      lines.push("end");
    }
  }

  return lines.join("\n");
}

/**
 * TraitDecl: skip in v0 (no runtime representation needed).
 * Emit as a comment for documentation.
 */
function emitTraitDecl(node: TraitDecl): string {
  return `-- trait ${node.name}`;
}

/**
 * TraitImplDecl: emit methods as standalone functions.
 * trait Drawable has Player
 *   fn draw(p: Player)
 *     ...
 * →
 * function Player_draw(p)
 *   ...
 * end
 */
function emitTraitImplDecl(node: TraitImplDecl): string {
  const lines: string[] = [];

  for (let i = 0; i < node.methods.length; i++) {
    const method = node.methods[i];
    if (i > 0) lines.push("");
    lines.push(emitFnDecl({ ...method, name: `${node.targetType}_${method.name}` }, 0));
  }

  return lines.join("\n");
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
    case "MatchStmt":
      return emitMatchStmt(stmt, depth);
    case "ReturnStmt":
      return emitReturnStmt(stmt, depth);
    case "BreakStmt":
      return `${indent(depth)}break`;
    case "ContinueStmt": {
      // LuaJIT (used by LÖVE) supports goto for continue emulation
      const label = _continueLabelStack.length > 0
        ? _continueLabelStack[_continueLabelStack.length - 1]
        : null;
      if (label) {
        return `${indent(depth)}goto ${label}`;
      }
      return `${indent(depth)}-- continue`;
    }
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

  // Continue label support (LuaJIT goto)
  const hasContinue = bodyContainsContinue(node.body);
  let continueLabel: string | null = null;
  if (hasContinue) {
    continueLabel = `__continue_${++_continueCounter}__`;
    _continueLabelStack.push(continueLabel);
  }

  if (variant.kind === "ForIn") {
    const varName = escapeLuaReserved(variant.variable);
    const iterable = variant.iterable;

    // Check for range operator: for i in 0..10
    if (iterable.kind === "BinaryExpr" && iterable.op === "..") {
      const start = emitExpr(iterable.left);
      const end = iterable.right;
      const upper = end.kind === "IntLiteral" ? String(end.value - 1) : `${emitExpr(end)} - 1`;
      lines.push(`${prefix}for ${varName} = ${start}, ${upper} do`);
    }
    // Check for range() pattern
    else if (
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

  // Emit continue label before loop end
  if (continueLabel) {
    lines.push(`${indent(depth + 1)}::${continueLabel}::`);
    _continueLabelStack.pop();
  }

  lines.push(`${prefix}end`);

  return lines.join("\n");
}

/** Check if a statement list contains a ContinueStmt (non-recursive into nested loops). */
function bodyContainsContinue(stmts: Stmt[]): boolean {
  for (const stmt of stmts) {
    if (stmt.kind === "ContinueStmt") return true;
    if (stmt.kind === "IfStmt") {
      if (bodyContainsContinue(stmt.body)) return true;
      if (stmt.elseBody && bodyContainsContinue(stmt.elseBody)) return true;
    }
    if (stmt.kind === "MatchStmt") {
      for (const arm of stmt.arms) {
        if (bodyContainsContinue(arm.body)) return true;
      }
    }
    // Don't descend into nested ForStmt — they get their own labels
  }
  return false;
}

function emitMatchStmt(node: MatchStmt, depth: number): string {
  const prefix = indent(depth);
  const lines: string[] = [];
  const subject = emitExpr(node.subject);

  let first = true;
  let hasWildcard = false;

  for (const arm of node.arms) {
    if (arm.pattern.kind === "WildcardPattern") {
      hasWildcard = true;
      lines.push(`${prefix}else`);
    } else {
      const condition = emitPatternCondition(subject, arm.pattern);
      const keyword = first ? "if" : "elseif";
      lines.push(`${prefix}${keyword} ${condition} then`);
      first = false;
    }

    for (const stmt of arm.body) {
      lines.push(emitStmt(stmt, depth + 1));
    }
  }

  lines.push(`${prefix}end`);
  return lines.join("\n");
}

/** Emit `local name; if ... then name = ... elseif ... end` for match expressions. */
function emitMatchExprAsDecl(name: string, node: MatchExpr, depth: number): string {
  const prefix = indent(depth);
  const lines: string[] = [];
  const subject = emitExpr(node.subject);

  lines.push(`${prefix}local ${name}`);

  let first = true;
  for (const arm of node.arms) {
    if (arm.pattern.kind === "WildcardPattern") {
      lines.push(`${prefix}else`);
    } else {
      const condition = emitPatternCondition(subject, arm.pattern);
      const keyword = first ? "if" : "elseif";
      lines.push(`${prefix}${keyword} ${condition} then`);
      first = false;
    }
    // Each arm body should be a single ExprStmt — extract the value
    if (arm.body.length === 1 && arm.body[0].kind === "ExprStmt") {
      lines.push(`${indent(depth + 1)}${name} = ${emitExpr(arm.body[0].expr)}`);
    } else {
      for (const stmt of arm.body) {
        lines.push(emitStmt(stmt, depth + 1));
      }
    }
  }
  lines.push(`${prefix}end`);

  return lines.join("\n");
}

function emitPatternCondition(subject: string, pattern: MatchPattern): string {
  switch (pattern.kind) {
    case "LiteralPattern":
      return `${subject} == ${emitExpr(pattern.value)}`;
    case "IdentifierPattern":
      return `${subject} == "${pattern.name}"`;
    case "QualifiedPattern":
      return `${subject} == "${pattern.qualifier}.${pattern.name}"`;
    case "WildcardPattern":
      return "true";
  }
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
      if (expr.name === "none") return "nil";
      return escapeLuaReserved(expr.name);
    case "BinaryExpr":
      return emitBinaryExpr(expr);
    case "UnaryExpr":
      return emitUnaryExpr(expr);
    case "CallExpr":
      return emitCallExpr(expr);
    case "FieldAccess":
      return `${emitExpr(expr.object)}.${escapeLuaReserved(expr.field)}`;
    case "IndexAccess": {
      // Vibe is 0-indexed, Lua is 1-indexed. Adjust numeric indices.
      const idx = expr.index;
      if (idx.kind === "StringLiteral") {
        // Map access with string key — no adjustment
        return `${emitExpr(expr.object)}[${emitExpr(idx)}]`;
      }
      if (idx.kind === "IntLiteral") {
        // Literal index — adjust at compile time
        return `${emitExpr(expr.object)}[${idx.value + 1}]`;
      }
      // Variable/expression index — add + 1 at runtime
      return `${emitExpr(expr.object)}[${emitExpr(idx)} + 1]`;
    }
    case "GroupExpr":
      return `(${emitExpr(expr.expr)})`;
    case "ListLiteral":
      return `{${expr.elements.map(emitExpr).join(", ")}}`;
    case "MapLiteral":
      if (expr.entries.length === 0) return "{}";
      return `{${expr.entries.map((e) => `[${emitExpr(e.key)}] = ${emitExpr(e.value)}`).join(", ")}}`;
    case "MatchExpr":
      // Fallback: shouldn't normally reach here (handled in emitLetDecl)
      return `--[[ match expr ]]`;
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
  // Special case: len() → Lua # prefix operator
  if (
    node.callee.kind === "Identifier" &&
    node.callee.name === "len" &&
    node.args.length === 1
  ) {
    return `#${emitExpr(node.args[0])}`;
  }

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
