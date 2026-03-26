// ============================================================
// Vibe Language — Game CodeGen Tests (8 cases)
// ============================================================

import { describe, it, expect } from "vitest";
import { generateGameMode } from "./game-codegen.js";
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
  ExprStmt,
  CallExpr,
} from "../parser/ast.js";
import { execSync } from "child_process";
import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";

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

function mkInt(value: number): Expr {
  return { kind: "IntLiteral", value, loc };
}

function mkFloat(value: number): Expr {
  return { kind: "FloatLiteral", value, loc };
}

function mkId(name: string): Expr {
  return { kind: "Identifier", name, loc };
}

function mkParam(name: string, typeAnnotation?: string): Param {
  return typeAnnotation ? { name, typeAnnotation, loc } : { name, loc };
}

function mkField(name: string, typeAnnotation: string, defaultValue?: Expr): StructField {
  return defaultValue
    ? { name, typeAnnotation, defaultValue, loc }
    : { name, typeAnnotation, loc };
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

function mkExprStmt(expr: Expr): ExprStmt {
  return { kind: "ExprStmt", expr, loc };
}

function mkCall(callee: string, args: Expr[]): CallExpr {
  return { kind: "CallExpr", callee: mkId(callee), args, loc };
}

function generateGame(program: Program): string {
  const metadata = analyzeAnnotations(program);
  return generateGameMode(program, metadata);
}

// ── Tests ───────────────────────────────────────────────────

describe("game-codegen", () => {
  // 1. @entity struct → constructor with _type field
  it("1. @entity struct → constructor with _type field", () => {
    const ast = mkProgram(
      mkStruct("Player", {
        annotations: [mkAnnotation("entity")],
        fields: [
          mkField("x", "Float", mkFloat(0.0)),
          mkField("y", "Float", mkFloat(0.0)),
        ],
      }),
    );
    const lua = generateGame(ast);
    expect(lua).toContain("function Player(x, y)");
    expect(lua).toContain('_type = "Player"');
    expect(lua).toContain("return self");
  });

  // 2. Entity defaults table generated
  it("2. entity defaults table generated", () => {
    const ast = mkProgram(
      mkStruct("Player", {
        annotations: [mkAnnotation("entity")],
        fields: [
          mkField("x", "Float", mkFloat(100.0)),
          mkField("y", "Float", mkFloat(200.0)),
        ],
      }),
    );
    const lua = generateGame(ast);
    expect(lua).toContain("_vibe_entity_defaults");
    expect(lua).toContain("Player = function()");
    expect(lua).toContain("return Player(100.0, 200.0)");
  });

  // 3. @scene struct → constructor with _type field
  it("3. @scene struct → constructor with _type field", () => {
    const ast = mkProgram(
      mkStruct("MainMenu", {
        annotations: [mkAnnotation("scene")],
        fields: [mkField("title", "String", mkStr("My Game"))],
      }),
    );
    const lua = generateGame(ast);
    expect(lua).toContain("function MainMenu(title)");
    expect(lua).toContain('_type = "MainMenu"');
  });

  // 4. @on("update") → handler function + registry entry
  it("4. @on handler → function + registry entry", () => {
    const ast = mkProgram(
      mkStruct("Player", {
        annotations: [mkAnnotation("entity")],
        fields: [mkField("x", "Float", mkFloat(0.0))],
      }),
      mkFn("move_player", {
        annotations: [mkAnnotation("on", [mkStr("update")])],
        params: [mkParam("p", "Player"), mkParam("dt")],
        body: [
          {
            kind: "Assignment",
            op: "+=",
            target: { kind: "FieldAccess", object: mkId("p"), field: "x", loc },
            value: mkInt(1),
            loc,
          },
        ],
      }),
    );
    const lua = generateGame(ast);
    expect(lua).toContain("function move_player(p, dt)");
    expect(lua).toContain("_vibe_handlers");
    expect(lua).toContain('update = {');
    expect(lua).toContain('entity_type = "Player"');
    expect(lua).toContain("handler = move_player");
  });

  // 5. @on("draw") with scene target → correct registry
  it("5. @on with scene target → scene_type in registry", () => {
    const ast = mkProgram(
      mkStruct("MainMenu", {
        annotations: [mkAnnotation("scene")],
      }),
      mkFn("draw_menu", {
        annotations: [mkAnnotation("on", [mkStr("draw")])],
        params: [mkParam("s", "MainMenu")],
        body: [
          mkExprStmt(mkCall("draw_text", [mkStr("Menu"), mkInt(100), mkInt(100)])),
        ],
      }),
    );
    const lua = generateGame(ast);
    expect(lua).toContain("function draw_menu(s)");
    expect(lua).toContain('scene_type = "MainMenu"');
    expect(lua).toContain("handler = draw_menu");
  });

  // 6. Plain functions → emitted WITHOUT love. prefix
  it("6. plain functions emitted without love. prefix", () => {
    const ast = mkProgram(
      mkStruct("Player", {
        annotations: [mkAnnotation("entity")],
      }),
      mkFn("update", {
        params: [mkParam("dt")],
        body: [mkExprStmt(mkInt(1))],
      }),
      mkFn("draw", {
        body: [mkExprStmt(mkInt(2))],
      }),
    );
    const lua = generateGame(ast);
    // Must NOT have love.update or love.draw
    expect(lua).not.toContain("love.update");
    expect(lua).not.toContain("love.draw");
    expect(lua).toContain("function update(dt)");
    expect(lua).toContain("function draw()");
  });

  // 7. _vibe_first_scene set correctly
  it("7. _vibe_first_scene set to first scene", () => {
    const ast = mkProgram(
      mkStruct("MainMenu", {
        annotations: [mkAnnotation("scene")],
      }),
      mkStruct("GamePlay", {
        annotations: [mkAnnotation("scene")],
      }),
    );
    const lua = generateGame(ast);
    expect(lua).toContain('_vibe_first_scene = "MainMenu"');
  });

  // 8. Full program → valid Lua (luac -p verification)
  it("8. full program → valid Lua (luac -p)", () => {
    const ast = mkProgram(
      mkStruct("Player", {
        annotations: [mkAnnotation("entity")],
        fields: [
          mkField("x", "Float", mkFloat(100.0)),
          mkField("y", "Float", mkFloat(200.0)),
          mkField("speed", "Float", mkFloat(300.0)),
        ],
      }),
      mkStruct("GamePlay", {
        annotations: [mkAnnotation("scene")],
        fields: [mkField("score", "Int", mkInt(0))],
      }),
      mkFn("move_player", {
        annotations: [mkAnnotation("on", [mkStr("update")])],
        params: [mkParam("p", "Player"), mkParam("dt")],
        body: [
          {
            kind: "Assignment",
            op: "+=",
            target: { kind: "FieldAccess", object: mkId("p"), field: "x", loc },
            value: mkInt(1),
            loc,
          },
        ],
      }),
      mkFn("draw_player", {
        annotations: [mkAnnotation("on", [mkStr("draw")])],
        params: [mkParam("p", "Player")],
        body: [
          mkExprStmt(mkCall("draw_rect", [
            { kind: "FieldAccess", object: mkId("p"), field: "x", loc },
            { kind: "FieldAccess", object: mkId("p"), field: "y", loc },
            mkInt(32),
            mkInt(32),
          ])),
        ],
      }),
      mkFn("helper", {
        params: [],
        body: [{ kind: "ReturnStmt", value: mkInt(42), loc }],
      }),
    );

    const lua = generateGame(ast);

    // Verify with luac -p
    const tmpDir = join("/tmp", "_vibe_test_game_codegen");
    try {
      mkdirSync(tmpDir, { recursive: true });
      const tmpFile = join(tmpDir, "test.lua");
      writeFileSync(tmpFile, lua);
      execSync(`luac -p "${tmpFile}"`, { stdio: "pipe" });
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }

    // Also verify content
    expect(lua).toContain("function Player(x, y, speed)");
    expect(lua).toContain("function GamePlay(score)");
    expect(lua).toContain("_vibe_entity_defaults");
    expect(lua).toContain("_vibe_scene_defaults");
    expect(lua).toContain("_vibe_handlers");
    expect(lua).toContain('_vibe_first_scene = "GamePlay"');
    expect(lua).toContain("function helper()");
  });
});
