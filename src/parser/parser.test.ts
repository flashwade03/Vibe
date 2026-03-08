// ============================================================
// Vibe Language — Parser Tests (22 cases)
// ============================================================

import { describe, it, expect } from "vitest";
import { lex } from "../lexer/lexer.js";
import { parse } from "./parser.js";
import { VibeError } from "../errors.js";
import type {
  Program,
  LetDecl,
  ConstDecl,
  FnDecl,
  BinaryExpr,
  CallExpr,
  FieldAccess,
  IfStmt,
  Assignment,
  ForStmt,
  ForInVariant,
  ForCondVariant,
  UnaryExpr,
  GroupExpr,
  ReturnStmt,
  IntLiteral,
  FloatLiteral,
  Identifier,
  BoolLiteral,
  ExprStmt,
} from "./ast.js";

function p(source: string): Program {
  const tokens = lex(source);
  return parse(tokens);
}

describe("Parser", () => {
  // 1. Let declaration
  it("parses let declaration", () => {
    const prog = p("let x = 42");
    expect(prog.body).toHaveLength(1);
    const decl = prog.body[0] as LetDecl;
    expect(decl.kind).toBe("LetDecl");
    expect(decl.name).toBe("x");
    expect(decl.value.kind).toBe("IntLiteral");
    expect((decl.value as IntLiteral).value).toBe(42);
  });

  // 2. Const declaration
  it("parses const declaration", () => {
    const prog = p("const y = 3.14");
    expect(prog.body).toHaveLength(1);
    const decl = prog.body[0] as ConstDecl;
    expect(decl.kind).toBe("ConstDecl");
    expect(decl.name).toBe("y");
    expect(decl.value.kind).toBe("FloatLiteral");
    expect((decl.value as FloatLiteral).value).toBe(3.14);
  });

  // 3. Let with type annotation
  it("parses let with type annotation", () => {
    const prog = p("let x: Float = 1.0");
    expect(prog.body).toHaveLength(1);
    const decl = prog.body[0] as LetDecl;
    expect(decl.kind).toBe("LetDecl");
    expect(decl.name).toBe("x");
    expect(decl.typeAnnotation).toBe("Float");
    expect(decl.value.kind).toBe("FloatLiteral");
    expect((decl.value as FloatLiteral).value).toBe(1.0);
  });

  // 4. Function with params
  it("parses function with params", () => {
    const prog = p("fn add(a: Int, b: Int)\n  return a + b");
    expect(prog.body).toHaveLength(1);
    const fn = prog.body[0] as FnDecl;
    expect(fn.kind).toBe("FnDecl");
    expect(fn.name).toBe("add");
    expect(fn.params).toHaveLength(2);
    expect(fn.params[0].name).toBe("a");
    expect(fn.params[0].typeAnnotation).toBe("Int");
    expect(fn.params[1].name).toBe("b");
    expect(fn.params[1].typeAnnotation).toBe("Int");
    expect(fn.body).toHaveLength(1);
    expect(fn.body[0].kind).toBe("ReturnStmt");
  });

  // 5. Arithmetic precedence
  it("parses arithmetic with correct precedence", () => {
    const prog = p("let r = 1 + 2 * 3");
    const decl = prog.body[0] as LetDecl;
    const expr = decl.value as BinaryExpr;
    expect(expr.kind).toBe("BinaryExpr");
    expect(expr.op).toBe("+");
    expect((expr.left as IntLiteral).value).toBe(1);
    const right = expr.right as BinaryExpr;
    expect(right.kind).toBe("BinaryExpr");
    expect(right.op).toBe("*");
    expect((right.left as IntLiteral).value).toBe(2);
    expect((right.right as IntLiteral).value).toBe(3);
  });

  // 6. Comparison
  it("parses comparison", () => {
    const prog = p("let r = x > 5");
    const decl = prog.body[0] as LetDecl;
    const expr = decl.value as BinaryExpr;
    expect(expr.kind).toBe("BinaryExpr");
    expect(expr.op).toBe(">");
    expect(expr.left.kind).toBe("Identifier");
    expect((expr.left as Identifier).name).toBe("x");
    expect(expr.right.kind).toBe("IntLiteral");
    expect((expr.right as IntLiteral).value).toBe(5);
  });

  // 7. Function call
  it("parses function call", () => {
    const prog = p("let r = foo(1, 2)");
    const decl = prog.body[0] as LetDecl;
    const expr = decl.value as CallExpr;
    expect(expr.kind).toBe("CallExpr");
    expect((expr.callee as Identifier).name).toBe("foo");
    expect(expr.args).toHaveLength(2);
    expect((expr.args[0] as IntLiteral).value).toBe(1);
    expect((expr.args[1] as IntLiteral).value).toBe(2);
  });

  // 8. Field access
  it("parses field access chain", () => {
    const prog = p("let r = a.b.c");
    const decl = prog.body[0] as LetDecl;
    const outer = decl.value as FieldAccess;
    expect(outer.kind).toBe("FieldAccess");
    expect(outer.field).toBe("c");
    const inner = outer.object as FieldAccess;
    expect(inner.kind).toBe("FieldAccess");
    expect(inner.field).toBe("b");
    expect((inner.object as Identifier).name).toBe("a");
  });

  // 9. Simple if
  it("parses simple if", () => {
    const prog = p("fn f()\n  if true\n    x");
    const fn = prog.body[0] as FnDecl;
    expect(fn.body).toHaveLength(1);
    const ifStmt = fn.body[0] as IfStmt;
    expect(ifStmt.kind).toBe("IfStmt");
    expect((ifStmt.condition as BoolLiteral).value).toBe(true);
    expect(ifStmt.body).toHaveLength(1);
    expect(ifStmt.elseBody).toBeUndefined();
  });

  // 10. If-else
  it("parses if-else", () => {
    const prog = p("fn f()\n  if true\n    x\n  else\n    y");
    const fn = prog.body[0] as FnDecl;
    const ifStmt = fn.body[0] as IfStmt;
    expect(ifStmt.kind).toBe("IfStmt");
    expect(ifStmt.body).toHaveLength(1);
    expect(ifStmt.elseBody).toBeDefined();
    expect(ifStmt.elseBody).toHaveLength(1);
  });

  // 11. Else-if chain
  it("parses else-if chain", () => {
    const prog = p("fn f()\n  if a\n    x\n  else if b\n    y\n  else\n    z");
    const fn = prog.body[0] as FnDecl;
    expect(fn.body).toHaveLength(1);
    const ifStmt = fn.body[0] as IfStmt;
    expect(ifStmt.kind).toBe("IfStmt");
    expect(ifStmt.elseBody).toBeDefined();
    expect(ifStmt.elseBody).toHaveLength(1);
    const elseIf = ifStmt.elseBody![0] as IfStmt;
    expect(elseIf.kind).toBe("IfStmt");
    expect(elseIf.elseBody).toBeDefined();
    expect(elseIf.elseBody).toHaveLength(1);
  });

  // 12. Multiple sequential ifs
  it("parses multiple sequential ifs as separate statements", () => {
    const prog = p("fn f()\n  if a\n    x\n  if b\n    y");
    const fn = prog.body[0] as FnDecl;
    expect(fn.body).toHaveLength(2);
    expect(fn.body[0].kind).toBe("IfStmt");
    expect(fn.body[1].kind).toBe("IfStmt");
  });

  // 13. Assignment
  it("parses assignment", () => {
    const prog = p("fn f()\n  x = 5");
    const fn = prog.body[0] as FnDecl;
    expect(fn.body).toHaveLength(1);
    const assign = fn.body[0] as Assignment;
    expect(assign.kind).toBe("Assignment");
    expect((assign.target as Identifier).name).toBe("x");
    expect((assign.value as IntLiteral).value).toBe(5);
  });

  // 14. For-in
  it("parses for-in loop", () => {
    const prog = p("fn f()\n  for enemy in enemies\n    x");
    const fn = prog.body[0] as FnDecl;
    expect(fn.body).toHaveLength(1);
    const forStmt = fn.body[0] as ForStmt;
    expect(forStmt.kind).toBe("ForStmt");
    const variant = forStmt.variant as ForInVariant;
    expect(variant.kind).toBe("ForIn");
    expect(variant.variable).toBe("enemy");
    expect((variant.iterable as Identifier).name).toBe("enemies");
  });

  // 15. For-cond
  it("parses for-cond loop", () => {
    const prog = p("fn f()\n  for x > 0\n    x");
    const fn = prog.body[0] as FnDecl;
    expect(fn.body).toHaveLength(1);
    const forStmt = fn.body[0] as ForStmt;
    expect(forStmt.kind).toBe("ForStmt");
    const variant = forStmt.variant as ForCondVariant;
    expect(variant.kind).toBe("ForCond");
    expect(variant.condition.kind).toBe("BinaryExpr");
  });

  // 16. Unary negation
  it("parses unary negation", () => {
    const prog = p("let r = -x");
    const decl = prog.body[0] as LetDecl;
    const expr = decl.value as UnaryExpr;
    expect(expr.kind).toBe("UnaryExpr");
    expect(expr.op).toBe("-");
    expect((expr.operand as Identifier).name).toBe("x");
  });

  // 17. Boolean operators
  it("parses boolean operators with correct precedence", () => {
    const prog = p("let r = a and b or c");
    const decl = prog.body[0] as LetDecl;
    const expr = decl.value as BinaryExpr;
    // or is lower precedence, so it's the root
    expect(expr.kind).toBe("BinaryExpr");
    expect(expr.op).toBe("or");
    const left = expr.left as BinaryExpr;
    expect(left.kind).toBe("BinaryExpr");
    expect(left.op).toBe("and");
    expect((left.left as Identifier).name).toBe("a");
    expect((left.right as Identifier).name).toBe("b");
    expect((expr.right as Identifier).name).toBe("c");
  });

  // 18. Grouped expression
  it("parses grouped expression", () => {
    const prog = p("let r = (1 + 2) * 3");
    const decl = prog.body[0] as LetDecl;
    const expr = decl.value as BinaryExpr;
    expect(expr.kind).toBe("BinaryExpr");
    expect(expr.op).toBe("*");
    const group = expr.left as GroupExpr;
    expect(group.kind).toBe("GroupExpr");
    const inner = group.expr as BinaryExpr;
    expect(inner.op).toBe("+");
    expect((expr.right as IntLiteral).value).toBe(3);
  });

  // 19. Not operator
  it("parses not operator", () => {
    const prog = p("let r = not x");
    const decl = prog.body[0] as LetDecl;
    const expr = decl.value as UnaryExpr;
    expect(expr.kind).toBe("UnaryExpr");
    expect(expr.op).toBe("not");
    expect((expr.operand as Identifier).name).toBe("x");
  });

  // 20. Return statement
  it("parses return statement", () => {
    const prog = p("fn f()\n  return 42");
    const fn = prog.body[0] as FnDecl;
    expect(fn.body).toHaveLength(1);
    const ret = fn.body[0] as ReturnStmt;
    expect(ret.kind).toBe("ReturnStmt");
    expect(ret.value).toBeDefined();
    expect(ret.value!.kind).toBe("IntLiteral");
    expect((ret.value as IntLiteral).value).toBe(42);
  });

  // 21. Error with location
  it("throws VibeError with correct location", () => {
    try {
      p("let = 5");
      expect.unreachable("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(VibeError);
      const err = e as VibeError;
      expect(err.phase).toBe("parser");
      expect(err.line).toBeGreaterThan(0);
      expect(err.col).toBeGreaterThan(0);
    }
  });

  // 22. Full v0 parse — moving_rect.vibe
  it("parses moving_rect.vibe fixture", () => {
    const source = `let x: Float = 400.0
let y: Float = 300.0
let speed: Float = 200.0

fn update(dt: Float)
  if key_down("right")
    x = x + speed * dt
  if key_down("left")
    x = x - speed * dt
  if key_down("down")
    y = y + speed * dt
  if key_down("up")
    y = y - speed * dt

fn draw()
  draw_rect(x, y, 32, 32)`;

    const prog = p(source);
    expect(prog.kind).toBe("Program");

    // 3 top-level lets
    const lets = prog.body.filter((d) => d.kind === "LetDecl");
    expect(lets).toHaveLength(3);

    // 2 functions
    const fns = prog.body.filter((d) => d.kind === "FnDecl");
    expect(fns).toHaveLength(2);

    // update function has 4 if statements
    const updateFn = fns[0] as FnDecl;
    expect(updateFn.name).toBe("update");
    expect(updateFn.body).toHaveLength(4);
    for (const stmt of updateFn.body) {
      expect(stmt.kind).toBe("IfStmt");
    }

    // draw function has 1 expression statement (function call)
    const drawFn = fns[1] as FnDecl;
    expect(drawFn.name).toBe("draw");
    expect(drawFn.body).toHaveLength(1);
    expect(drawFn.body[0].kind).toBe("ExprStmt");
    const callExpr = (drawFn.body[0] as ExprStmt).expr as CallExpr;
    expect(callExpr.kind).toBe("CallExpr");
    expect((callExpr.callee as Identifier).name).toBe("draw_rect");
    expect(callExpr.args).toHaveLength(4);
  });
});
