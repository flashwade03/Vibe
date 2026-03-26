// ============================================================
// Vibe Language — Game Code Generator
// Generates Lua for game mode (annotations present).
// Bypasses LOVE_FUNCTIONS rewriting — runtime owns love.* callbacks.
// ============================================================

import type {
  Program,
  TopLevelDecl,
  FnDecl,
  StructDecl,
  Expr,
} from "../parser/ast.js";
import type { GameMetadata } from "./annotation-analyzer.js";
import { generatePlainMode, type GenerateOptions } from "./codegen.js";

// ── Game-specific call names that need Identifier → string ──
const ENTITY_REF_CALLS = new Set(["spawn", "find_all", "go_to"]);

// ── Public API ──────────────────────────────────────────────

export function generateGameMode(
  program: Program,
  metadata: GameMetadata,
  options?: GenerateOptions,
): string {
  const parts: string[] = [];

  // 1. Entity constructors (with _type field)
  for (const [name, info] of metadata.entities) {
    parts.push(emitGameStruct(info.structDecl, true));
  }

  // 2. Scene constructors (with _type field)
  for (const [name, info] of metadata.scenes) {
    parts.push(emitGameStruct(info.structDecl, true));
  }

  // 3. Entity defaults table
  parts.push(emitEntityDefaults(metadata));

  // 4. Scene defaults table
  parts.push(emitSceneDefaults(metadata));

  // 5. Plain declarations (non-annotated) — bypass LOVE_FUNCTIONS
  for (const decl of metadata.plainDecls) {
    if (decl.kind === "FnDecl") {
      parts.push(emitPlainFn(decl));
    } else {
      // Let/const/struct/enum/trait — use existing codegen
      const miniProg: Program = { kind: "Program", body: [decl], loc: program.loc };
      parts.push(generatePlainMode(miniProg, options));
    }
  }

  // 6. Event handler functions (named, no love. prefix)
  const emittedHandlerFns = new Set<string>();
  for (const handler of metadata.eventHandlers) {
    if (!emittedHandlerFns.has(handler.fnDecl.name)) {
      emittedHandlerFns.add(handler.fnDecl.name);
      parts.push(emitPlainFn(handler.fnDecl));
    }
  }

  // 7. Handler registry
  parts.push(emitHandlerRegistry(metadata));

  // 8. First scene
  parts.push(emitFirstScene(metadata));

  return parts.filter((p) => p.length > 0).join("\n\n");
}

// ── Struct Constructor with _type ───────────────────────────

function emitGameStruct(node: StructDecl, addType: boolean): string {
  const lines: string[] = [];
  const name = node.name;
  const params = node.fields.map((f) => f.name).join(", ");

  lines.push(`function ${name}(${params})`);

  // Initialize fields with defaults
  for (const field of node.fields) {
    if (field.defaultValue) {
      lines.push(`  local _${field.name} = ${field.name}`);
      lines.push(`  if _${field.name} == nil then _${field.name} = ${emitExprSimple(field.defaultValue)} end`);
    }
  }

  // Build self table
  const fieldInits: string[] = [];
  if (addType) {
    fieldInits.push(`_type = "${name}"`);
  }
  for (const field of node.fields) {
    const n = field.name;
    fieldInits.push(field.defaultValue ? `${n} = _${n}` : `${n} = ${n}`);
  }

  if (fieldInits.length > 0) {
    lines.push(`  local self = {${fieldInits.join(", ")}}`);
  } else {
    lines.push(`  local self = {_type = "${name}"}`);
  }

  lines.push("  return self");
  lines.push("end");

  return lines.join("\n");
}

// ── Plain Function (no love. prefix) ────────────────────────

function emitPlainFn(node: FnDecl): string {
  // Emit function using codegen but with a safe name that won't match LOVE_FUNCTIONS
  // Strategy: prefix with _vibe_safe_, generate, then replace back
  const safeName = `_vibe_safe_${node.name}`;
  const safeFn: FnDecl = { ...node, name: safeName };
  const miniProg: Program = { kind: "Program", body: [safeFn], loc: node.loc };
  const lua = generatePlainMode(miniProg);
  // Replace the safe prefix back to original name
  return lua.replace(`function ${safeName}(`, `function ${node.name}(`);
}

// ── Entity Defaults Table ───────────────────────────────────

function emitEntityDefaults(metadata: GameMetadata): string {
  const entries: string[] = [];
  for (const [name, info] of metadata.entities) {
    const defaults = info.structDecl.fields.map((f) => {
      if (f.defaultValue) return emitExprSimple(f.defaultValue);
      return "nil";
    });
    entries.push(`  ${name} = function() return ${name}(${defaults.join(", ")}) end`);
  }
  if (entries.length === 0) {
    return "_vibe_entity_defaults = {}";
  }
  return `_vibe_entity_defaults = {\n${entries.join(",\n")}\n}`;
}

// ── Scene Defaults Table ────────────────────────────────────

function emitSceneDefaults(metadata: GameMetadata): string {
  const entries: string[] = [];
  for (const [name, info] of metadata.scenes) {
    const defaults = info.structDecl.fields.map((f) => {
      if (f.defaultValue) return emitExprSimple(f.defaultValue);
      return "nil";
    });
    entries.push(`  ${name} = function(params) return ${name}(${defaults.join(", ")}) end`);
  }
  if (entries.length === 0) {
    return "_vibe_scene_defaults = {}";
  }
  return `_vibe_scene_defaults = {\n${entries.join(",\n")}\n}`;
}

// ── Handler Registry ────────────────────────────────────────

function emitHandlerRegistry(metadata: GameMetadata): string {
  if (metadata.eventHandlers.length === 0) {
    return "_vibe_handlers = {}";
  }

  // Group handlers by event name
  const groups = new Map<string, typeof metadata.eventHandlers>();
  for (const h of metadata.eventHandlers) {
    if (!groups.has(h.eventName)) {
      groups.set(h.eventName, []);
    }
    groups.get(h.eventName)!.push(h);
  }

  const lines: string[] = [];
  lines.push("_vibe_handlers = {");

  const eventEntries: string[] = [];
  for (const [eventName, handlers] of groups) {
    const handlerEntries: string[] = [];
    for (const h of handlers) {
      const entityType = h.targetType && metadata.entities.has(h.targetType)
        ? `"${h.targetType}"` : "nil";
      const sceneType = h.targetType && metadata.scenes.has(h.targetType)
        ? `"${h.targetType}"` : "nil";
      handlerEntries.push(`{entity_type = ${entityType}, scene_type = ${sceneType}, handler = ${h.fnDecl.name}}`);
    }
    eventEntries.push(`  ${eventName} = {${handlerEntries.join(", ")}}`);
  }

  lines.push(eventEntries.join(",\n"));
  lines.push("}");

  return lines.join("\n");
}

// ── First Scene ─────────────────────────────────────────────

function emitFirstScene(metadata: GameMetadata): string {
  const firstScene = metadata.scenes.keys().next().value;
  if (firstScene) {
    return `_vibe_first_scene = "${firstScene}"`;
  }
  return "_vibe_first_scene = nil";
}

// ── Simple Expression Emitter ───────────────────────────────
// Minimal expr emitter for default values in constructors.
// Full expression emission is handled by codegen.ts via generate().

function emitExprSimple(expr: Expr): string {
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
      return expr.name;
    case "ListLiteral":
      return `{${expr.elements.map(emitExprSimple).join(", ")}}`;
    default:
      return "nil";
  }
}
