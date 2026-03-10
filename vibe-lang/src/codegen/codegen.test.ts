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
});
