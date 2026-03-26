// ============================================================
// Vibe Language — Annotation Analyzer Tests (10 cases)
// ============================================================

import { describe, it, expect } from "vitest";
import { analyzeAnnotations } from "./annotation-analyzer.js";
import type {
  Program,
  FnDecl,
  StructDecl,
  StructField,
  LetDecl,
  Annotation,
  Param,
  Expr,
  Stmt,
} from "../parser/ast.js";

// ── Helpers ─────────────────────────────────────────────────

const loc = { line: 1, col: 1 };

function mkProgram(...body: Program["body"]): Program {
  return { kind: "Program", body, loc };
}

function mkAnnotation(name: string, args: Expr[] = []): Annotation {
  return { name, args, loc };
}

function mkStr(value: string): Expr {
  return { kind: "StringLiteral", value, loc };
}

function mkParam(name: string, typeAnnotation?: string): Param {
  return typeAnnotation ? { name, typeAnnotation, loc } : { name, loc };
}

function mkStruct(
  name: string,
  opts: {
    fields?: StructField[];
    annotations?: Annotation[];
    methods?: FnDecl[];
    traits?: string[];
  } = {},
): StructDecl {
  return {
    kind: "StructDecl",
    name,
    traits: opts.traits ?? [],
    fields: opts.fields ?? [],
    methods: opts.methods ?? [],
    annotations: opts.annotations ?? [],
    loc,
  };
}

function mkField(name: string, typeAnnotation: string): StructField {
  return { name, typeAnnotation, loc };
}

function mkFn(
  name: string,
  opts: {
    params?: Param[];
    annotations?: Annotation[];
    body?: Stmt[];
  } = {},
): FnDecl {
  return {
    kind: "FnDecl",
    name,
    params: opts.params ?? [],
    body: opts.body ?? [],
    annotations: opts.annotations ?? [],
    loc,
  };
}

// ── Tests ───────────────────────────────────────────────────

describe("annotation-analyzer", () => {
  // 1. @entity struct → entities에 추가
  it("1. @entity struct → added to entities", () => {
    const ast = mkProgram(
      mkStruct("Player", {
        annotations: [mkAnnotation("entity")],
        fields: [mkField("x", "Float"), mkField("y", "Float")],
      }),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.entities.has("Player")).toBe(true);
    expect(meta.entities.get("Player")!.dataFields).toEqual(["x", "y"]);
    expect(meta.hasGameAnnotations).toBe(true);
  });

  // 2. @component struct → components에 추가
  it("2. @component struct → added to components", () => {
    const ast = mkProgram(
      mkStruct("Velocity", {
        annotations: [mkAnnotation("component")],
        fields: [mkField("dx", "Float"), mkField("dy", "Float")],
      }),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.components.has("Velocity")).toBe(true);
    expect(meta.hasGameAnnotations).toBe(true);
  });

  // 3. @scene struct → scenes에 추가
  it("3. @scene struct → added to scenes", () => {
    const ast = mkProgram(
      mkStruct("MainMenu", {
        annotations: [mkAnnotation("scene")],
        fields: [mkField("title", "String")],
      }),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.scenes.has("MainMenu")).toBe(true);
    expect(meta.scenes.get("MainMenu")!.structDecl.name).toBe("MainMenu");
    expect(meta.hasGameAnnotations).toBe(true);
  });

  // 4. @on("update") fn foo(p: Player) → EventHandler with targetType "Player"
  it("4. @on with typed entity param → EventHandler with targetType", () => {
    const ast = mkProgram(
      mkStruct("Player", {
        annotations: [mkAnnotation("entity")],
      }),
      mkFn("update_player", {
        annotations: [mkAnnotation("on", [mkStr("update")])],
        params: [mkParam("p", "Player")],
      }),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.eventHandlers).toHaveLength(1);
    expect(meta.eventHandlers[0].eventName).toBe("update");
    expect(meta.eventHandlers[0].targetType).toBe("Player");
  });

  // 5. @on("draw") fn bar(s: MainMenu) → EventHandler with targetType "MainMenu" (scene)
  it("5. @on with typed scene param → EventHandler with scene targetType", () => {
    const ast = mkProgram(
      mkStruct("MainMenu", {
        annotations: [mkAnnotation("scene")],
      }),
      mkFn("draw_menu", {
        annotations: [mkAnnotation("on", [mkStr("draw")])],
        params: [mkParam("s", "MainMenu")],
      }),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.eventHandlers).toHaveLength(1);
    expect(meta.eventHandlers[0].eventName).toBe("draw");
    expect(meta.eventHandlers[0].targetType).toBe("MainMenu");
  });

  // 6. @on("enter") fn start() → global (targetType null)
  it("6. @on with no params → global handler (targetType null)", () => {
    const ast = mkProgram(
      mkFn("start", {
        annotations: [mkAnnotation("on", [mkStr("enter")])],
      }),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.eventHandlers).toHaveLength(1);
    expect(meta.eventHandlers[0].eventName).toBe("enter");
    expect(meta.eventHandlers[0].targetType).toBeNull();
  });

  // 7. @on("update") @on("draw") fn dual() → 2 EventHandlers (stacking)
  it("7. @on stacking → multiple EventHandlers from one FnDecl", () => {
    const ast = mkProgram(
      mkFn("dual", {
        annotations: [
          mkAnnotation("on", [mkStr("update")]),
          mkAnnotation("on", [mkStr("draw")]),
        ],
      }),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.eventHandlers).toHaveLength(2);
    expect(meta.eventHandlers[0].eventName).toBe("update");
    expect(meta.eventHandlers[1].eventName).toBe("draw");
    // Both point to the same FnDecl
    expect(meta.eventHandlers[0].fnDecl).toBe(meta.eventHandlers[1].fnDecl);
  });

  // 8. @on("update") fn foo(p) → param without typeAnnotation → global
  it("8. @on with param without typeAnnotation → global", () => {
    const ast = mkProgram(
      mkFn("foo", {
        annotations: [mkAnnotation("on", [mkStr("update")])],
        params: [mkParam("p")],
      }),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.eventHandlers).toHaveLength(1);
    expect(meta.eventHandlers[0].targetType).toBeNull();
  });

  // 9. mixed program → plainDecls correctly separated
  it("9. mixed program → plainDecls correctly separated", () => {
    const ast = mkProgram(
      mkStruct("Player", {
        annotations: [mkAnnotation("entity")],
      }),
      mkFn("helper", {}),  // no annotations → plain
      {
        kind: "LetDecl",
        name: "speed",
        value: { kind: "IntLiteral", value: 200, loc },
        loc,
      } as LetDecl,
      mkFn("update_player", {
        annotations: [mkAnnotation("on", [mkStr("update")])],
        params: [mkParam("p", "Player")],
      }),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.entities.has("Player")).toBe(true);
    expect(meta.eventHandlers).toHaveLength(1);
    expect(meta.plainDecls).toHaveLength(2); // helper fn + let speed
    expect(meta.plainDecls[0].kind).toBe("FnDecl");
    expect(meta.plainDecls[1].kind).toBe("LetDecl");
  });

  // 10. no annotations → hasGameAnnotations = false
  it("10. no annotations → hasGameAnnotations false", () => {
    const ast = mkProgram(
      mkFn("update", {}),
      mkFn("draw", {}),
    );
    const meta = analyzeAnnotations(ast);
    expect(meta.hasGameAnnotations).toBe(false);
    expect(meta.entities.size).toBe(0);
    expect(meta.scenes.size).toBe(0);
    expect(meta.eventHandlers).toHaveLength(0);
    expect(meta.plainDecls).toHaveLength(2);
  });
});
