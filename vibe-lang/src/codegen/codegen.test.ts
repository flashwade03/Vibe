// ============================================================
// Vibe Language — Code Generator Tests (20 cases)
// TDD: tests written first, then implementation.
// ============================================================

import { describe, it, expect } from "vitest";
import { generate, generateConfLua } from "./codegen.js";
import type {
  Program,
  FnDecl,
  LetDecl,
  ConstDecl,
  IfStmt,
  ForStmt,
  MatchStmt,
  MatchArm,
  MatchExpr,
  MapLiteral,
  StructDecl,
  StructField,
  EnumDecl,
  EnumVariant,
  TraitDecl,
  TraitImplDecl,
  Assignment,
  ExprStmt,
  Stmt,
  Expr,
  Identifier,
  IntLiteral,
  FloatLiteral,
  StringLiteral,
  BoolLiteral,
  BinaryExpr,
  CallExpr,
  Param,
} from "../parser/ast.js";

// ── Helper ──────────────────────────────────────────────────

const loc = { line: 1, col: 1 };

function mkProgram(...body: Program["body"]): Program {
  return { kind: "Program", body, loc };
}

function mkId(name: string): Identifier {
  return { kind: "Identifier", name, loc };
}

function mkInt(value: number): IntLiteral {
  return { kind: "IntLiteral", value, loc };
}

function mkFloat(value: number): FloatLiteral {
  return { kind: "FloatLiteral", value, loc };
}

function mkStr(value: string): StringLiteral {
  return { kind: "StringLiteral", value, loc };
}

function mkBool(value: boolean): BoolLiteral {
  return { kind: "BoolLiteral", value, loc };
}

function mkParam(name: string): Param {
  return { name, loc };
}

function mkCall(callee: string, args: Expr[]): CallExpr {
  return { kind: "CallExpr", callee: mkId(callee), args, loc };
}

function mkBinary(op: string, left: Expr, right: Expr): BinaryExpr {
  return { kind: "BinaryExpr", op, left, right, loc };
}

function mkExprStmt(expr: Expr): ExprStmt {
  return { kind: "ExprStmt", expr, loc };
}

// ── Tests ───────────────────────────────────────────────────

describe("codegen", () => {
  // 1. let → local
  it("1. let → local", () => {
    const ast = mkProgram({
      kind: "LetDecl",
      name: "x",
      value: mkInt(42),
      loc,
    });
    expect(generate(ast)).toBe("local x = 42");
  });

  // 2. const → local
  it("2. const → local", () => {
    const ast = mkProgram({
      kind: "ConstDecl",
      name: "y",
      value: mkFloat(3.14),
      loc,
    });
    expect(generate(ast)).toBe("local y = 3.14");
  });

  // 3. Regular function
  it("3. regular function", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "foo",
      params: [mkParam("a"), mkParam("b")],
      body: [
        {
          kind: "ReturnStmt",
          value: mkBinary("+", mkId("a"), mkId("b")),
          loc,
        },
      ],
      loc,
    });
    expect(generate(ast)).toBe(
      "function foo(a, b)\n  return a + b\nend"
    );
  });

  // 4. update → love.update
  it("4. update function → love.update", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "update",
      params: [mkParam("dt")],
      body: [],
      loc,
    });
    expect(generate(ast)).toBe("function love.update(dt)\nend");
  });

  // 5. draw → love.draw
  it("5. draw function → love.draw", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "draw",
      params: [],
      body: [],
      loc,
    });
    expect(generate(ast)).toBe("function love.draw()\nend");
  });

  // 6. Simple if
  it("6. simple if", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [
        {
          kind: "IfStmt",
          condition: mkBool(true),
          body: [mkExprStmt(mkCall("print", [mkStr("yes")]))],
          loc,
        } as IfStmt,
      ],
      loc,
    });
    expect(generate(ast)).toBe(
      'function test()\n  if true then\n    print("yes")\n  end\nend'
    );
  });

  // 7. If-else
  it("7. if-else", () => {
    const ifStmt: IfStmt = {
      kind: "IfStmt",
      condition: mkId("x"),
      body: [mkExprStmt(mkInt(1))],
      elseBody: [mkExprStmt(mkInt(2))],
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [ifStmt],
      loc,
    });
    expect(generate(ast)).toBe(
      "function test()\n  if x then\n    1\n  else\n    2\n  end\nend"
    );
  });

  // 8. Else-if chain
  it("8. else-if chain", () => {
    const ifStmt: IfStmt = {
      kind: "IfStmt",
      condition: mkId("a"),
      body: [mkExprStmt(mkInt(1))],
      elseBody: [
        {
          kind: "IfStmt",
          condition: mkId("b"),
          body: [mkExprStmt(mkInt(2))],
          loc,
        } as IfStmt,
      ],
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [ifStmt],
      loc,
    });
    expect(generate(ast)).toBe(
      "function test()\n  if a then\n    1\n  elseif b then\n    2\n  end\nend"
    );
  });

  // 9. Assignment
  it("9. assignment", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [
        {
          kind: "Assignment",
          op: "=",
          target: mkId("x"),
          value: mkInt(5),
          loc,
        } as Assignment,
      ],
      loc,
    });
    expect(generate(ast)).toBe("function test()\n  x = 5\nend");
  });

  // 10. != → ~=
  it("10. != → ~=", () => {
    const expr = mkBinary("!=", mkId("a"), mkId("b"));
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(expr)],
      loc,
    });
    expect(generate(ast)).toBe("function test()\n  a ~= b\nend");
  });

  // 11. key_down mapping
  it("11. key_down → love.keyboard.isDown", () => {
    const call = mkCall("key_down", [mkStr("right")]);
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(call)],
      loc,
    });
    expect(generate(ast)).toBe(
      'function test()\n  love.keyboard.isDown("right")\nend'
    );
  });

  // 12. draw_rect mapping
  it("12. draw_rect → love.graphics.rectangle", () => {
    const call = mkCall("draw_rect", [mkInt(0), mkInt(0), mkInt(100), mkInt(50)]);
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(call)],
      loc,
    });
    expect(generate(ast)).toBe(
      'function test()\n  love.graphics.rectangle("fill", 0, 0, 100, 50)\nend'
    );
  });

  // 13. draw_text mapping
  it("13. draw_text → love.graphics.print", () => {
    const call = mkCall("draw_text", [mkStr("hello"), mkInt(10), mkInt(20)]);
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(call)],
      loc,
    });
    expect(generate(ast)).toBe(
      'function test()\n  love.graphics.print("hello", 10, 20)\nend'
    );
  });

  // 14. draw_circle mapping
  it("14. draw_circle → love.graphics.circle", () => {
    const call = mkCall("draw_circle", [mkInt(50), mkInt(50), mkInt(25)]);
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(call)],
      loc,
    });
    expect(generate(ast)).toBe(
      'function test()\n  love.graphics.circle("fill", 50, 50, 25)\nend'
    );
  });

  // 15. for-in with range(10)
  it("15. for-in range(10) → for i = 0, 9", () => {
    const forStmt: ForStmt = {
      kind: "ForStmt",
      variant: {
        kind: "ForIn",
        variable: "i",
        iterable: mkCall("range", [mkInt(10)]),
      },
      body: [mkExprStmt(mkId("i"))],
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [forStmt],
      loc,
    });
    expect(generate(ast)).toBe(
      "function test()\n  for i = 0, 9 do\n    i\n  end\nend"
    );
  });

  // 16. for-in with list
  it("16. for-in list → for _, var in ipairs", () => {
    const forStmt: ForStmt = {
      kind: "ForStmt",
      variant: {
        kind: "ForIn",
        variable: "enemy",
        iterable: mkId("enemies"),
      },
      body: [mkExprStmt(mkId("enemy"))],
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [forStmt],
      loc,
    });
    expect(generate(ast)).toBe(
      "function test()\n  for _, enemy in ipairs(enemies) do\n    enemy\n  end\nend"
    );
  });

  // 17. for-cond → while
  it("17. for-cond → while", () => {
    const forStmt: ForStmt = {
      kind: "ForStmt",
      variant: {
        kind: "ForCond",
        condition: mkBool(true),
      },
      body: [mkExprStmt(mkInt(1))],
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [forStmt],
      loc,
    });
    expect(generate(ast)).toBe(
      "function test()\n  while true do\n    1\n  end\nend"
    );
  });

  // 18. Lua reserved word escaping
  it("18. Lua reserved word escaping", () => {
    const ast = mkProgram({
      kind: "LetDecl",
      name: "end",
      value: mkInt(1),
      loc,
    });
    expect(generate(ast)).toBe("local _v_end = 1");
  });

  // 19. conf.lua generation
  it("19. generateConfLua() returns conf.lua string", () => {
    const result = generateConfLua();
    expect(result).toContain("function love.conf(t)");
    expect(result).toContain('t.window.title = "Vibe Game"');
    expect(result).toContain("t.window.width = 800");
    expect(result).toContain("t.window.height = 600");
    expect(result).toContain("end");
  });

  // 20. Full v0 program (moving_rect)
  it("20. full v0 program — moving rect", () => {
    // Vibe source (conceptual):
    //   let x = 100
    //   let speed = 200
    //   fn update(dt)
    //     if key_down("right")
    //       x = x + speed * dt
    //     if key_down("left")
    //       x = x - speed * dt
    //   fn draw()
    //     draw_rect(x, 200, 40, 40)

    const ast: Program = {
      kind: "Program",
      body: [
        { kind: "LetDecl", name: "x", value: mkInt(100), loc },
        { kind: "LetDecl", name: "speed", value: mkInt(200), loc },
        {
          kind: "FnDecl",
          name: "update",
          params: [mkParam("dt")],
          body: [
            {
              kind: "IfStmt",
              condition: mkCall("key_down", [mkStr("right")]),
              body: [
                {
                  kind: "Assignment",
                  op: "=",
                  target: mkId("x"),
                  value: mkBinary(
                    "+",
                    mkId("x"),
                    mkBinary("*", mkId("speed"), mkId("dt"))
                  ),
                  loc,
                },
              ],
              loc,
            } as IfStmt,
            {
              kind: "IfStmt",
              condition: mkCall("key_down", [mkStr("left")]),
              body: [
                {
                  kind: "Assignment",
                  op: "=",
                  target: mkId("x"),
                  value: mkBinary(
                    "-",
                    mkId("x"),
                    mkBinary("*", mkId("speed"), mkId("dt"))
                  ),
                  loc,
                },
              ],
              loc,
            } as IfStmt,
          ],
          loc,
        },
        {
          kind: "FnDecl",
          name: "draw",
          params: [],
          body: [
            mkExprStmt(
              mkCall("draw_rect", [mkId("x"), mkInt(200), mkInt(40), mkInt(40)])
            ),
          ],
          loc,
        },
      ],
      loc,
    };

    const expected = [
      "local x = 100",
      "local speed = 200",
      "",
      "function love.update(dt)",
      '  if love.keyboard.isDown("right") then',
      "    x = x + speed * dt",
      "  end",
      '  if love.keyboard.isDown("left") then',
      "    x = x - speed * dt",
      "  end",
      "end",
      "",
      "function love.draw()",
      '  love.graphics.rectangle("fill", x, 200, 40, 40)',
      "end",
    ].join("\n");

    expect(generate(ast)).toBe(expected);
  });

  // 21. Empty function body
  it("21. empty function body → function name() end", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "keypressed",
      params: [mkParam("key")],
      body: [],
      loc,
    });
    expect(generate(ast)).toBe("function love.keypressed(key)\nend");
  });

  // 22. str() → tostring()
  it("22. str() → tostring()", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(mkCall("str", [mkId("x")]))],
      loc,
    });
    expect(generate(ast)).toBe("function test()\n  tostring(x)\nend");
  });

  // 23. int() → math.floor()
  it("23. int() → math.floor()", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(mkCall("int", [mkId("timer")]))],
      loc,
    });
    expect(generate(ast)).toBe("function test()\n  math.floor(timer)\nend");
  });

  // 24. sqrt() → math.sqrt()
  it("24. sqrt() → math.sqrt()", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(mkCall("sqrt", [mkId("x")]))],
      loc,
    });
    expect(generate(ast)).toBe("function test()\n  math.sqrt(x)\nend");
  });

  // 25. String + String → Lua ..
  it("25. string concatenation: \"a\" + \"b\" → .. ", () => {
    const expr: BinaryExpr = {
      kind: "BinaryExpr",
      op: "+",
      left: mkStr("hello "),
      right: mkStr("world"),
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(expr)],
      loc,
    });
    expect(generate(ast)).toBe('function test()\n  "hello " .. "world"\nend');
  });

  // 26. str(x) + " text" → tostring(x) .. " text"
  it("26. str() + string → .. ", () => {
    const expr: BinaryExpr = {
      kind: "BinaryExpr",
      op: "+",
      left: mkStr("Score: "),
      right: mkCall("str", [mkId("score")]),
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(expr)],
      loc,
    });
    expect(generate(ast)).toBe('function test()\n  "Score: " .. tostring(score)\nend');
  });

  // 27. Numeric + stays as +
  it("27. numeric addition stays as +", () => {
    const expr: BinaryExpr = {
      kind: "BinaryExpr",
      op: "+",
      left: mkId("x"),
      right: mkId("speed"),
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [mkExprStmt(expr)],
      loc,
    });
    expect(generate(ast)).toBe("function test()\n  x + speed\nend");
  });

  // 28. Let without initializer → local x
  it("28. let without initializer → local x", () => {
    const ast = mkProgram({
      kind: "LetDecl",
      name: "x",
      typeAnnotation: "Float",
      loc,
    });
    expect(generate(ast)).toBe("local x");
  });

  // 29. Top-level expression statement
  it("29. top-level expression statement", () => {
    const ast: Program = {
      kind: "Program",
      body: [mkExprStmt(mkCall("load", []))],
      loc,
    };
    expect(generate(ast)).toBe("load()");
  });

  // ── Match codegen tests ────────────────────────────────────

  // 30. Match statement → if/elseif chain
  it("30. match statement → if/elseif chain", () => {
    const matchStmt: MatchStmt = {
      kind: "MatchStmt",
      subject: mkId("state"),
      arms: [
        {
          pattern: { kind: "LiteralPattern", value: mkInt(1) },
          body: [mkExprStmt(mkCall("foo", []))],
          loc,
        },
        {
          pattern: { kind: "LiteralPattern", value: mkInt(2) },
          body: [mkExprStmt(mkCall("bar", []))],
          loc,
        },
        {
          pattern: { kind: "WildcardPattern" },
          body: [mkExprStmt(mkCall("baz", []))],
          loc,
        },
      ],
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [matchStmt],
      loc,
    });
    expect(generate(ast)).toBe(
      "function test()\n  if state == 1 then\n    foo()\n  elseif state == 2 then\n    bar()\n  else\n    baz()\n  end\nend"
    );
  });

  // 31. Match statement with string patterns
  it("31. match statement with string patterns", () => {
    const matchStmt: MatchStmt = {
      kind: "MatchStmt",
      subject: mkId("dir"),
      arms: [
        {
          pattern: { kind: "LiteralPattern", value: mkStr("up") },
          body: [mkExprStmt(mkInt(1))],
          loc,
        },
        {
          pattern: { kind: "WildcardPattern" },
          body: [mkExprStmt(mkInt(0))],
          loc,
        },
      ],
      loc,
    };
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [matchStmt],
      loc,
    });
    expect(generate(ast)).toBe(
      'function test()\n  if dir == "up" then\n    1\n  else\n    0\n  end\nend'
    );
  });

  // 32. Match expression → local + if/elseif
  it("32. match expression as let value", () => {
    const matchExpr: MatchExpr = {
      kind: "MatchExpr",
      subject: mkId("x"),
      arms: [
        {
          pattern: { kind: "LiteralPattern", value: mkInt(1) },
          body: [mkExprStmt(mkInt(10))],
          loc,
        },
        {
          pattern: { kind: "WildcardPattern" },
          body: [mkExprStmt(mkInt(0))],
          loc,
        },
      ],
      loc,
    };
    const ast = mkProgram({
      kind: "LetDecl",
      name: "result",
      value: matchExpr,
      loc,
    });
    expect(generate(ast)).toBe(
      "local result\nif x == 1 then\n  result = 10\nelse\n  result = 0\nend"
    );
  });

  // ── MapLiteral codegen tests ──────────────────────────────

  // 33. Empty map literal → {}
  it("33. empty map literal → {}", () => {
    const ast = mkProgram({
      kind: "LetDecl",
      name: "m",
      value: { kind: "MapLiteral", entries: [], loc } as MapLiteral,
      loc,
    });
    expect(generate(ast)).toBe("local m = {}");
  });

  // 34. Map literal with entries → Lua table
  it("34. map literal with entries → Lua table", () => {
    const map: MapLiteral = {
      kind: "MapLiteral",
      entries: [
        { key: mkStr("a"), value: mkInt(1) },
        { key: mkStr("b"), value: mkInt(2) },
      ],
      loc,
    };
    const ast = mkProgram({
      kind: "LetDecl",
      name: "m",
      value: map,
      loc,
    });
    expect(generate(ast)).toBe('local m = {["a"] = 1, ["b"] = 2}');
  });

  // ── Break / Continue codegen tests ─────────────────────────

  // 35. Break → break
  it("35. break → break", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [{ kind: "BreakStmt", loc } as Stmt],
      loc,
    });
    expect(generate(ast)).toBe("function test()\n  break\nend");
  });

  // 36. Continue → -- continue (Lua workaround)
  it("36. continue → -- continue", () => {
    const ast = mkProgram({
      kind: "FnDecl",
      name: "test",
      params: [],
      body: [{ kind: "ContinueStmt", loc } as Stmt],
      loc,
    });
    expect(generate(ast)).toBe("function test()\n  -- continue\nend");
  });

  // ── Struct codegen tests ──────────────────────────────────

  // 37. Simple struct → constructor function
  it("37. struct → constructor function", () => {
    const ast = mkProgram({
      kind: "StructDecl",
      name: "Position",
      traits: [],
      fields: [
        { name: "x", typeAnnotation: "Float", loc } as StructField,
        { name: "y", typeAnnotation: "Float", loc } as StructField,
      ],
      methods: [],
      annotations: [],
      loc,
    } as StructDecl);
    expect(generate(ast)).toBe(
      "function Position(x, y)\n  local self = {x = x, y = y}\n  return self\nend"
    );
  });

  // 38. Struct with default values → nil-check
  it("38. struct with defaults → nil-check pattern", () => {
    const ast = mkProgram({
      kind: "StructDecl",
      name: "Player",
      traits: [],
      fields: [
        { name: "health", typeAnnotation: "Int", defaultValue: mkInt(100), loc } as StructField,
      ],
      methods: [],
      annotations: [],
      loc,
    } as StructDecl);
    const result = generate(ast);
    expect(result).toContain("function Player(health)");
    expect(result).toContain("local _health = health");
    expect(result).toContain("if _health == nil then _health = 100 end");
    expect(result).toContain("local self = {health = _health}");
    expect(result).toContain("return self");
  });

  // 39. Empty struct → empty self table
  it("39. empty struct → empty self table", () => {
    const ast = mkProgram({
      kind: "StructDecl",
      name: "Marker",
      traits: [],
      fields: [],
      methods: [],
      annotations: [],
      loc,
    } as StructDecl);
    expect(generate(ast)).toBe(
      "function Marker()\n  local self = {}\n  return self\nend"
    );
  });

  // 40. Struct with method → Name_method standalone function
  it("40. struct method → Name_method function", () => {
    const ast = mkProgram({
      kind: "StructDecl",
      name: "Player",
      traits: [],
      fields: [
        { name: "x", typeAnnotation: "Float", loc } as StructField,
      ],
      methods: [
        {
          kind: "FnDecl",
          name: "move",
          params: [mkParam("dx")],
          body: [mkExprStmt(mkId("dx"))],
          loc,
        },
      ],
      annotations: [],
      loc,
    } as StructDecl);
    const result = generate(ast);
    expect(result).toContain("function Player(x)");
    expect(result).toContain("function Player_move(dx)");
  });

  // ── Enum codegen tests ────────────────────────────────────

  // 41. Simple enum → string constants
  it("41. simple enum → string constants", () => {
    const ast = mkProgram({
      kind: "EnumDecl",
      name: "Direction",
      variants: [
        { name: "Up", fields: [], loc } as EnumVariant,
        { name: "Down", fields: [], loc } as EnumVariant,
      ],
      annotations: [],
      loc,
    } as EnumDecl);
    expect(generate(ast)).toBe(
      'Direction = {}\nDirection.Up = "Up"\nDirection.Down = "Down"'
    );
  });

  // 42. Enum with data variant → constructor function
  it("42. enum data variant → constructor function", () => {
    const ast = mkProgram({
      kind: "EnumDecl",
      name: "State",
      variants: [
        { name: "Idle", fields: [], loc } as EnumVariant,
        { name: "Walking", fields: [{ name: "speed", typeAnnotation: "Float" }], loc } as EnumVariant,
      ],
      annotations: [],
      loc,
    } as EnumDecl);
    const result = generate(ast);
    expect(result).toContain("State = {}");
    expect(result).toContain('State.Idle = "Idle"');
    expect(result).toContain("function State.Walking(speed)");
    expect(result).toContain('{_type = "Walking", speed = speed}');
  });

  // ── Trait codegen tests ───────────────────────────────────

  // 43. TraitDecl → comment only
  it("43. trait decl → comment", () => {
    const ast = mkProgram({
      kind: "TraitDecl",
      name: "Drawable",
      supertraits: [],
      methods: [],
      annotations: [],
      loc,
    } as TraitDecl);
    expect(generate(ast)).toBe("-- trait Drawable");
  });

  // 44. TraitImplDecl → Target_method standalone functions
  it("44. trait impl → Target_method functions", () => {
    const ast = mkProgram({
      kind: "TraitImplDecl",
      traitName: "Drawable",
      targetType: "Player",
      methods: [
        {
          kind: "FnDecl",
          name: "draw",
          params: [mkParam("p")],
          body: [mkExprStmt(mkCall("draw_rect", [mkInt(0), mkInt(0), mkInt(32), mkInt(32)]))],
          loc,
        },
      ],
      loc,
    } as TraitImplDecl);
    const result = generate(ast);
    expect(result).toContain("function Player_draw(p)");
    expect(result).toContain('love.graphics.rectangle("fill", 0, 0, 32, 32)');
  });
});
