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
  MatchStmt,
  MatchExpr,
  MapLiteral,
  BreakStmt,
  ContinueStmt,
  StringLiteral,
  StructDecl,
  EnumDecl,
  TraitDecl,
  TraitImplDecl,
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
    expect(decl.value!.kind).toBe("IntLiteral");
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
    expect(decl.value!.kind).toBe("FloatLiteral");
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

  // ── Empty body support ──────────────────────────────────

  it("should parse empty function body", () => {
    const src = `fn keypressed(key: String)\n\nfn load()\n  let x = 1\n`;
    const tokens = lex(src);
    const ast = parse(tokens);
    expect(ast.body).toHaveLength(2);

    const fn1 = ast.body[0] as FnDecl;
    expect(fn1.name).toBe("keypressed");
    expect(fn1.body).toHaveLength(0);

    const fn2 = ast.body[1] as FnDecl;
    expect(fn2.name).toBe("load");
    expect(fn2.body).toHaveLength(1);
  });

  it("should parse empty function body at end of file", () => {
    const src = `fn update(dt: Float)\n  let x = 1\n\nfn draw()\n`;
    const tokens = lex(src);
    const ast = parse(tokens);
    expect(ast.body).toHaveLength(2);

    const fn2 = ast.body[1] as FnDecl;
    expect(fn2.name).toBe("draw");
    expect(fn2.body).toHaveLength(0);
  });

  // 25. Let without initializer
  it("parses let without initializer", () => {
    const prog = p("let x: Float");
    expect(prog.body).toHaveLength(1);
    const decl = prog.body[0] as LetDecl;
    expect(decl.kind).toBe("LetDecl");
    expect(decl.name).toBe("x");
    expect(decl.typeAnnotation).toBe("Float");
    expect(decl.value).toBeUndefined();
  });

  // 26. Top-level expression statement (function call)
  it("parses top-level expression statement", () => {
    const prog = p("load()");
    expect(prog.body).toHaveLength(1);
    const stmt = prog.body[0] as ExprStmt;
    expect(stmt.kind).toBe("ExprStmt");
    expect(stmt.expr.kind).toBe("CallExpr");
  });

  // 27. Top-level assignment
  it("parses top-level assignment", () => {
    const prog = p("x = 42");
    expect(prog.body).toHaveLength(1);
    const stmt = prog.body[0] as Assignment;
    expect(stmt.kind).toBe("Assignment");
    expect(stmt.op).toBe("=");
  });

  // ── Match statement tests ─────────────────────────────────

  // 28. Match statement with literal patterns
  it("parses match statement with literal patterns", () => {
    const prog = p("fn f()\n  match x\n    1 -> foo()\n    2 -> bar()\n    _ -> baz()");
    const fn = prog.body[0] as FnDecl;
    expect(fn.body).toHaveLength(1);
    const matchStmt = fn.body[0] as MatchStmt;
    expect(matchStmt.kind).toBe("MatchStmt");
    expect((matchStmt.subject as Identifier).name).toBe("x");
    expect(matchStmt.arms).toHaveLength(3);
    expect(matchStmt.arms[0].pattern.kind).toBe("LiteralPattern");
    expect(matchStmt.arms[1].pattern.kind).toBe("LiteralPattern");
    expect(matchStmt.arms[2].pattern.kind).toBe("WildcardPattern");
  });

  // 29. Match statement with multi-line arms
  it("parses match statement with multi-line arms", () => {
    const prog = p("fn f()\n  match state\n    \"idle\"\n      x = 1\n      y = 2\n    \"run\"\n      x = 3");
    const fn = prog.body[0] as FnDecl;
    const matchStmt = fn.body[0] as MatchStmt;
    expect(matchStmt.kind).toBe("MatchStmt");
    expect(matchStmt.arms).toHaveLength(2);
    expect(matchStmt.arms[0].body).toHaveLength(2);
    expect(matchStmt.arms[1].body).toHaveLength(1);
  });

  // 30. Match statement with else wildcard
  it("parses match statement with else as wildcard", () => {
    const prog = p("fn f()\n  match x\n    1 -> foo()\n    else -> bar()");
    const fn = prog.body[0] as FnDecl;
    const matchStmt = fn.body[0] as MatchStmt;
    expect(matchStmt.arms).toHaveLength(2);
    expect(matchStmt.arms[1].pattern.kind).toBe("WildcardPattern");
  });

  // ── Match expression tests ────────────────────────────────

  // 31. Match expression as value
  it("parses match expression in let", () => {
    const prog = p("let result = match x\n  1 -> 10\n  2 -> 20\n  _ -> 0");
    expect(prog.body).toHaveLength(1);
    const decl = prog.body[0] as LetDecl;
    expect(decl.kind).toBe("LetDecl");
    expect(decl.name).toBe("result");
    const matchExpr = decl.value as MatchExpr;
    expect(matchExpr.kind).toBe("MatchExpr");
    expect(matchExpr.arms).toHaveLength(3);
  });

  // 32. Match expression with string patterns
  it("parses match expression with string patterns", () => {
    const prog = p('let label = match dir\n  "up" -> 1\n  "down" -> 2\n  _ -> 0');
    const decl = prog.body[0] as LetDecl;
    const matchExpr = decl.value as MatchExpr;
    expect(matchExpr.kind).toBe("MatchExpr");
    expect(matchExpr.arms).toHaveLength(3);
    const firstPattern = matchExpr.arms[0].pattern;
    expect(firstPattern.kind).toBe("LiteralPattern");
    if (firstPattern.kind === "LiteralPattern") {
      expect((firstPattern.value as StringLiteral).value).toBe("up");
    }
  });

  // ── MapLiteral tests ──────────────────────────────────────

  // 33. Empty map literal
  it("parses empty map literal", () => {
    const prog = p("let m = {}");
    const decl = prog.body[0] as LetDecl;
    const map = decl.value as MapLiteral;
    expect(map.kind).toBe("MapLiteral");
    expect(map.entries).toHaveLength(0);
  });

  // 34. Map literal with entries
  it("parses map literal with entries", () => {
    const prog = p('let m = {"a": 1, "b": 2}');
    const decl = prog.body[0] as LetDecl;
    const map = decl.value as MapLiteral;
    expect(map.kind).toBe("MapLiteral");
    expect(map.entries).toHaveLength(2);
    expect((map.entries[0].key as StringLiteral).value).toBe("a");
    expect((map.entries[0].value as IntLiteral).value).toBe(1);
    expect((map.entries[1].key as StringLiteral).value).toBe("b");
    expect((map.entries[1].value as IntLiteral).value).toBe(2);
  });

  // 35. Map literal with trailing comma
  it("parses map literal with trailing comma", () => {
    const prog = p('let m = {"x": 10,}');
    const decl = prog.body[0] as LetDecl;
    const map = decl.value as MapLiteral;
    expect(map.kind).toBe("MapLiteral");
    expect(map.entries).toHaveLength(1);
  });

  // ── Break / Continue tests ────────────────────────────────

  // 36. Break statement
  it("parses break statement", () => {
    const prog = p("fn f()\n  for true\n    break");
    const fn = prog.body[0] as FnDecl;
    const forStmt = fn.body[0] as ForStmt;
    expect(forStmt.body).toHaveLength(1);
    expect(forStmt.body[0].kind).toBe("BreakStmt");
  });

  // 37. Continue statement
  it("parses continue statement", () => {
    const prog = p("fn f()\n  for true\n    continue");
    const fn = prog.body[0] as FnDecl;
    const forStmt = fn.body[0] as ForStmt;
    expect(forStmt.body).toHaveLength(1);
    expect(forStmt.body[0].kind).toBe("ContinueStmt");
  });

  // ── Struct tests ──────────────────────────────────────────

  // 38. Simple struct with fields
  it("parses simple struct with fields", () => {
    const prog = p("struct Player\n  x: Float\n  y: Float\n  health: Int");
    expect(prog.body).toHaveLength(1);
    const decl = prog.body[0] as StructDecl;
    expect(decl.kind).toBe("StructDecl");
    expect(decl.name).toBe("Player");
    expect(decl.fields).toHaveLength(3);
    expect(decl.fields[0].name).toBe("x");
    expect(decl.fields[0].typeAnnotation).toBe("Float");
    expect(decl.fields[1].name).toBe("y");
    expect(decl.fields[2].name).toBe("health");
    expect(decl.fields[2].typeAnnotation).toBe("Int");
    expect(decl.traits).toHaveLength(0);
    expect(decl.methods).toHaveLength(0);
  });

  // 39. Struct with default values
  it("parses struct with default field values", () => {
    const prog = p("struct Player\n  x: Float = 0.0\n  health: Int = 100");
    const decl = prog.body[0] as StructDecl;
    expect(decl.kind).toBe("StructDecl");
    expect(decl.fields).toHaveLength(2);
    expect(decl.fields[0].defaultValue).toBeDefined();
    expect(decl.fields[0].defaultValue!.kind).toBe("FloatLiteral");
    expect(decl.fields[1].defaultValue).toBeDefined();
    expect((decl.fields[1].defaultValue as IntLiteral).value).toBe(100);
  });

  // 40. Struct with has clause (traits)
  it("parses struct with has clause", () => {
    const prog = p("struct Player has Damageable, Renderable\n  health: Int");
    const decl = prog.body[0] as StructDecl;
    expect(decl.kind).toBe("StructDecl");
    expect(decl.name).toBe("Player");
    expect(decl.traits).toHaveLength(2);
    expect(decl.traits[0]).toBe("Damageable");
    expect(decl.traits[1]).toBe("Renderable");
    expect(decl.fields).toHaveLength(1);
  });

  // 41. Struct with methods
  it("parses struct with methods", () => {
    const prog = p("struct Player\n  x: Float\n  fn move(dx: Float)\n    x = x + dx");
    const decl = prog.body[0] as StructDecl;
    expect(decl.kind).toBe("StructDecl");
    expect(decl.fields).toHaveLength(1);
    expect(decl.methods).toHaveLength(1);
    expect(decl.methods[0].kind).toBe("FnDecl");
    expect(decl.methods[0].name).toBe("move");
    expect(decl.methods[0].params).toHaveLength(1);
  });

  // 42. Struct with annotation
  it("parses struct with annotation", () => {
    const prog = p("@entity\nstruct Player\n  x: Float");
    const decl = prog.body[0] as StructDecl;
    expect(decl.kind).toBe("StructDecl");
    expect(decl.annotations).toHaveLength(1);
    expect(decl.annotations[0].name).toBe("entity");
  });

  // ── Enum tests ────────────────────────────────────────────

  // 43. Simple enum with variants
  it("parses simple enum", () => {
    const prog = p("enum Direction\n  Up\n  Down\n  Left\n  Right");
    expect(prog.body).toHaveLength(1);
    const decl = prog.body[0] as EnumDecl;
    expect(decl.kind).toBe("EnumDecl");
    expect(decl.name).toBe("Direction");
    expect(decl.variants).toHaveLength(4);
    expect(decl.variants[0].name).toBe("Up");
    expect(decl.variants[1].name).toBe("Down");
    expect(decl.variants[2].name).toBe("Left");
    expect(decl.variants[3].name).toBe("Right");
    expect(decl.variants[0].fields).toHaveLength(0);
  });

  // 44. Enum with data variants
  it("parses enum with data variants", () => {
    const prog = p("enum Shape\n  Circle(radius: Float)\n  Rect(w: Float, h: Float)");
    const decl = prog.body[0] as EnumDecl;
    expect(decl.kind).toBe("EnumDecl");
    expect(decl.name).toBe("Shape");
    expect(decl.variants).toHaveLength(2);
    expect(decl.variants[0].name).toBe("Circle");
    expect(decl.variants[0].fields).toHaveLength(1);
    expect(decl.variants[0].fields[0].name).toBe("radius");
    expect(decl.variants[0].fields[0].typeAnnotation).toBe("Float");
    expect(decl.variants[1].name).toBe("Rect");
    expect(decl.variants[1].fields).toHaveLength(2);
  });

  // 45. Enum with positional fields
  it("parses enum with positional fields", () => {
    const prog = p("enum Result\n  Ok(Int)\n  Err(String)");
    const decl = prog.body[0] as EnumDecl;
    expect(decl.variants).toHaveLength(2);
    expect(decl.variants[0].fields).toHaveLength(1);
    expect(decl.variants[0].fields[0].name).toBeUndefined();
    expect(decl.variants[0].fields[0].typeAnnotation).toBe("Int");
  });

  // ── Trait tests ───────────────────────────────────────────

  // 46. Simple trait with method signatures
  it("parses trait with method signatures", () => {
    const prog = p("trait Drawable\n  fn draw()\n  fn get_bounds() -> Rect");
    expect(prog.body).toHaveLength(1);
    const decl = prog.body[0] as TraitDecl;
    expect(decl.kind).toBe("TraitDecl");
    expect(decl.name).toBe("Drawable");
    expect(decl.methods).toHaveLength(2);
    expect(decl.methods[0].name).toBe("draw");
    expect(decl.methods[0].body).toHaveLength(0);
    expect(decl.methods[1].name).toBe("get_bounds");
  });

  // 47. Trait impl
  it("parses trait impl declaration", () => {
    const prog = p("trait Drawable has Player\n  fn draw()\n    draw_rect(0, 0, 32, 32)");
    expect(prog.body).toHaveLength(1);
    const decl = prog.body[0] as TraitImplDecl;
    expect(decl.kind).toBe("TraitImplDecl");
    expect(decl.traitName).toBe("Drawable");
    expect(decl.targetType).toBe("Player");
    expect(decl.methods).toHaveLength(1);
    expect(decl.methods[0].name).toBe("draw");
    expect(decl.methods[0].body).toHaveLength(1);
  });

  // 48. Empty struct (no body)
  it("parses empty struct", () => {
    const prog = p("struct Marker\n\nlet x = 1");
    expect(prog.body).toHaveLength(2);
    const decl = prog.body[0] as StructDecl;
    expect(decl.kind).toBe("StructDecl");
    expect(decl.name).toBe("Marker");
    expect(decl.fields).toHaveLength(0);
    expect(decl.methods).toHaveLength(0);
  });

  // 49. Annotation with args
  it("parses annotation with arguments", () => {
    const prog = p('@on("collision", "enemy")\nstruct Handler\n  x: Int');
    const decl = prog.body[0] as StructDecl;
    expect(decl.annotations).toHaveLength(1);
    expect(decl.annotations[0].name).toBe("on");
    expect(decl.annotations[0].args).toHaveLength(2);
    expect((decl.annotations[0].args[0] as StringLiteral).value).toBe("collision");
    expect((decl.annotations[0].args[1] as StringLiteral).value).toBe("enemy");
  });

  // 50. Match with qualified enum patterns (Enum.Variant)
  it("parses match with qualified enum patterns", () => {
    const prog = p("match state\n  GameState.Menu\n    draw_text(\"menu\", 0.0, 0.0)\n  GameState.Playing\n    draw_text(\"play\", 0.0, 0.0)");
    const matchStmt = prog.body[0] as MatchStmt;
    expect(matchStmt.kind).toBe("MatchStmt");
    expect(matchStmt.arms).toHaveLength(2);
    expect(matchStmt.arms[0].pattern.kind).toBe("QualifiedPattern");
    if (matchStmt.arms[0].pattern.kind === "QualifiedPattern") {
      expect(matchStmt.arms[0].pattern.qualifier).toBe("GameState");
      expect(matchStmt.arms[0].pattern.name).toBe("Menu");
    }
    if (matchStmt.arms[1].pattern.kind === "QualifiedPattern") {
      expect(matchStmt.arms[1].pattern.qualifier).toBe("GameState");
      expect(matchStmt.arms[1].pattern.name).toBe("Playing");
    }
  });

  // 51. Struct fields with `let` prefix (LLM-generated pattern)
  it("parses struct fields with let prefix", () => {
    const prog = p("struct Player\n  let x: Float\n  let y: Float = 0.0");
    const decl = prog.body[0] as StructDecl;
    expect(decl.kind).toBe("StructDecl");
    expect(decl.fields).toHaveLength(2);
    expect(decl.fields[0].name).toBe("x");
    expect(decl.fields[0].typeAnnotation).toBe("Float");
    expect(decl.fields[1].name).toBe("y");
    expect(decl.fields[1].defaultValue).toBeDefined();
  });

  // ── Optional colon tolerance (LLM noise) ──────────────────

  it("tolerates trailing colon after fn signature", () => {
    const prog = p("fn foo(x: Int):\n  return x");
    const fn = prog.body[0] as FnDecl;
    expect(fn.kind).toBe("FnDecl");
    expect(fn.name).toBe("foo");
    expect(fn.body).toHaveLength(1);
  });

  it("tolerates trailing colon after if condition", () => {
    const prog = p("fn test()\n  if x > 0:\n    return x");
    const fn = prog.body[0] as FnDecl;
    const ifStmt = fn.body[0] as IfStmt;
    expect(ifStmt.kind).toBe("IfStmt");
  });

  it("tolerates trailing colon after for loop", () => {
    const prog = p("fn test()\n  for i in range(10):\n    let x = i");
    const fn = prog.body[0] as FnDecl;
    const forStmt = fn.body[0] as ForStmt;
    expect(forStmt.kind).toBe("ForStmt");
  });

  it("tolerates trailing colon after struct/enum", () => {
    const prog = p("struct Player:\n  x: Float\n  y: Float");
    const decl = prog.body[0] as StructDecl;
    expect(decl.kind).toBe("StructDecl");
    expect(decl.fields).toHaveLength(2);

    const prog2 = p("enum State:\n  Idle\n  Running");
    const enumDecl = prog2.body[0] as EnumDecl;
    expect(enumDecl.kind).toBe("EnumDecl");
    expect(enumDecl.variants).toHaveLength(2);
  });
});
