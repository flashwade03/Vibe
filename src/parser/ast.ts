// ============================================================
// Vibe Language — AST Node Definitions
// Shared contract used by parser and codegen.
// ============================================================

import { Loc } from "../lexer/tokens.js";

// ── Top-level ────────────────────────────────────────────────

export interface Program {
  kind: "Program";
  body: TopLevelDecl[];
  loc: Loc;
}

/** v0: top-level declarations include fn, let, and const. */
export type TopLevelDecl = FnDecl | LetDecl | ConstDecl;

// ── Declarations ─────────────────────────────────────────────

export interface FnDecl {
  kind: "FnDecl";
  name: string;
  params: Param[];
  body: Stmt[];
  loc: Loc;
}

export interface Param {
  name: string;
  typeAnnotation?: string; // parsed but discarded by codegen
  loc: Loc;
}

export interface LetDecl {
  kind: "LetDecl";
  name: string;
  typeAnnotation?: string;
  value: Expr;
  loc: Loc;
}

export interface ConstDecl {
  kind: "ConstDecl";
  name: string;
  typeAnnotation?: string;
  value: Expr;
  loc: Loc;
}

// ── Statements ───────────────────────────────────────────────

export type Stmt =
  | LetDecl
  | ConstDecl
  | IfStmt
  | ForStmt
  | ReturnStmt
  | Assignment
  | ExprStmt;

export interface IfStmt {
  kind: "IfStmt";
  condition: Expr;
  body: Stmt[];
  elseBody?: Stmt[]; // can contain another IfStmt for else-if chains
  loc: Loc;
}

export interface ForStmt {
  kind: "ForStmt";
  variant: ForInVariant | ForCondVariant;
  body: Stmt[];
  loc: Loc;
}

export interface ForInVariant {
  kind: "ForIn";
  variable: string;
  iterable: Expr;
}

export interface ForCondVariant {
  kind: "ForCond";
  condition: Expr;
}

export interface ReturnStmt {
  kind: "ReturnStmt";
  value?: Expr;
  loc: Loc;
}

export interface Assignment {
  kind: "Assignment";
  target: Expr; // must be Identifier or FieldAccess
  value: Expr;
  loc: Loc;
}

export interface ExprStmt {
  kind: "ExprStmt";
  expr: Expr;
  loc: Loc;
}

// ── Expressions ──────────────────────────────────────────────

export type Expr =
  | IntLiteral
  | FloatLiteral
  | StringLiteral
  | BoolLiteral
  | Identifier
  | BinaryExpr
  | UnaryExpr
  | CallExpr
  | FieldAccess
  | IndexAccess
  | GroupExpr
  | ListLiteral;

export interface IntLiteral {
  kind: "IntLiteral";
  value: number;
  loc: Loc;
}

export interface FloatLiteral {
  kind: "FloatLiteral";
  value: number;
  loc: Loc;
}

export interface StringLiteral {
  kind: "StringLiteral";
  value: string;
  loc: Loc;
}

export interface BoolLiteral {
  kind: "BoolLiteral";
  value: boolean;
  loc: Loc;
}

export interface Identifier {
  kind: "Identifier";
  name: string;
  loc: Loc;
}

export interface BinaryExpr {
  kind: "BinaryExpr";
  op: string; // "+", "-", "*", "/", "%", "==", "!=", "<", ">", "<=", ">=", "and", "or"
  left: Expr;
  right: Expr;
  loc: Loc;
}

export interface UnaryExpr {
  kind: "UnaryExpr";
  op: string; // "-", "not"
  operand: Expr;
  loc: Loc;
}

export interface CallExpr {
  kind: "CallExpr";
  callee: Expr;
  args: Expr[];
  loc: Loc;
}

export interface FieldAccess {
  kind: "FieldAccess";
  object: Expr;
  field: string;
  loc: Loc;
}

export interface IndexAccess {
  kind: "IndexAccess";
  object: Expr;
  index: Expr;
  loc: Loc;
}

export interface GroupExpr {
  kind: "GroupExpr";
  expr: Expr;
  loc: Loc;
}

export interface ListLiteral {
  kind: "ListLiteral";
  elements: Expr[];
  loc: Loc;
}
