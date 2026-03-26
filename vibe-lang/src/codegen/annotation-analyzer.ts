// ============================================================
// Vibe Language — Annotation Analyzer
// Walks the AST to extract game metadata from annotations.
// ============================================================

import type {
  Program,
  TopLevelDecl,
  FnDecl,
  StructDecl,
  Annotation,
} from "../parser/ast.js";

// ── Interfaces ──────────────────────────────────────────────

export interface EntityInfo {
  structDecl: StructDecl;
  componentFields: string[];  // @component type fields
  dataFields: string[];       // regular fields
}

export interface SceneInfo {
  structDecl: StructDecl;
}

export interface EventHandler {
  eventName: string;           // "update", "draw", etc.
  targetType: string | null;   // first param's typeAnnotation
  fnDecl: FnDecl;
}

export interface GameMetadata {
  entities: Map<string, EntityInfo>;
  components: Set<string>;
  scenes: Map<string, SceneInfo>;
  eventHandlers: EventHandler[];  // 1 FnDecl with N @on → N entries
  plainDecls: TopLevelDecl[];     // declarations without game annotations
  hasGameAnnotations: boolean;
}

// ── Public API ──────────────────────────────────────────────

export function analyzeAnnotations(program: Program): GameMetadata {
  const entities = new Map<string, EntityInfo>();
  const components = new Set<string>();
  const scenes = new Map<string, SceneInfo>();
  const eventHandlers: EventHandler[] = [];
  const plainDecls: TopLevelDecl[] = [];
  let hasGameAnnotations = false;

  // First pass: collect entity, component, scene names
  for (const decl of program.body) {
    if (decl.kind === "StructDecl") {
      const annNames = decl.annotations.map((a) => a.name);

      if (annNames.includes("entity")) {
        hasGameAnnotations = true;
        const componentFields: string[] = [];
        const dataFields: string[] = [];
        for (const field of decl.fields) {
          if (components.has(field.typeAnnotation)) {
            componentFields.push(field.name);
          } else {
            dataFields.push(field.name);
          }
        }
        entities.set(decl.name, { structDecl: decl, componentFields, dataFields });
      } else if (annNames.includes("component")) {
        hasGameAnnotations = true;
        components.add(decl.name);
      } else if (annNames.includes("scene")) {
        hasGameAnnotations = true;
        scenes.set(decl.name, { structDecl: decl });
      } else {
        plainDecls.push(decl);
      }
    } else if (decl.kind === "FnDecl") {
      const onAnnotations = decl.annotations.filter((a) => a.name === "on");
      if (onAnnotations.length > 0) {
        hasGameAnnotations = true;
        for (const ann of onAnnotations) {
          const eventName = extractEventName(ann);
          if (eventName) {
            const targetType = resolveTargetType(decl, entities, scenes);
            eventHandlers.push({ eventName, targetType, fnDecl: decl });
          }
        }
      } else {
        plainDecls.push(decl);
      }
    } else {
      plainDecls.push(decl);
    }
  }

  // Second pass: re-classify entity fields now that all components are known
  // (handles case where @component is declared after @entity)
  for (const [name, info] of entities) {
    const componentFields: string[] = [];
    const dataFields: string[] = [];
    for (const field of info.structDecl.fields) {
      if (components.has(field.typeAnnotation)) {
        componentFields.push(field.name);
      } else {
        dataFields.push(field.name);
      }
    }
    entities.set(name, { structDecl: info.structDecl, componentFields, dataFields });
  }

  return {
    entities,
    components,
    scenes,
    eventHandlers,
    plainDecls,
    hasGameAnnotations,
  };
}

// ── Helpers ─────────────────────────────────────────────────

function extractEventName(ann: Annotation): string | null {
  if (ann.args.length > 0 && ann.args[0].kind === "StringLiteral") {
    return ann.args[0].value;
  }
  return null;
}

function resolveTargetType(
  fnDecl: FnDecl,
  entities: Map<string, EntityInfo>,
  scenes: Map<string, SceneInfo>,
): string | null {
  if (fnDecl.params.length === 0) return null;
  const firstParam = fnDecl.params[0];
  if (!firstParam.typeAnnotation) return null;
  const typeName = firstParam.typeAnnotation;
  if (entities.has(typeName) || scenes.has(typeName)) {
    return typeName;
  }
  return null;
}
