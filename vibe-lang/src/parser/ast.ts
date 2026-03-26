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

/** Top-level declarations. */
export type TopLevelDecl =
  | FnDecl
  | LetDecl
  | ConstDecl
  | StructDecl
  | EnumDecl
  | TraitDecl
  | TraitImplDecl
  | ExprStmt
  | Assignment;

// ── Declarations ─────────────────────────────────────────────

export interface FnDecl {
  kind: "FnDecl";
  name: string;
  params: Param[];
  body: Stmt[];
  annotations: Annotation[];
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
  value?: Expr;
  loc: Loc;
}

export interface ConstDecl {
  kind: "ConstDecl";
  name: string;
  typeAnnotation?: string;
  value: Expr;
  loc: Loc;
}

// ── Struct / Enum / Trait ────────────────────────────────────

export interface StructDecl {
  kind: "StructDecl";
  name: string;
  traits: string[];           // has Trait1, Trait2
  fields: StructField[];
  methods: FnDecl[];
  annotations: Annotation[];  // @entity, @component, etc.
  loc: Loc;
}

export interface StructField {
  name: string;
  typeAnnotation: string;
  defaultValue?: Expr;
  loc: Loc;
}

export interface EnumDecl {
  kind: "EnumDecl";
  name: string;
  variants: EnumVariant[];
  annotations: Annotation[];
  loc: Loc;
}

export interface EnumVariant {
  name: string;
  fields: VariantField[];     // empty if no data
  loc: Loc;
}

export interface VariantField {
  name?: string;              // optional: positional if no name
  typeAnnotation: string;
}

export interface TraitDecl {
  kind: "TraitDecl";
  name: string;
  supertraits: string[];      // has Trait1, Trait2
  methods: FnDecl[];          // methods with or without body
  annotations: Annotation[];
  loc: Loc;
}

export interface TraitImplDecl {
  kind: "TraitImplDecl";
  traitName: string;
  targetType: string;         // trait Drawable has Player
  methods: FnDecl[];
  loc: Loc;
}

export interface Annotation {
  name: string;
  args: Expr[];               // @on("collision", "enemy") → args = ["collision", "enemy"]
  loc: Loc;
}

// ── Statements ───────────────────────────────────────────────

export type Stmt =
  | LetDecl
  | ConstDecl
  | IfStmt
  | ForStmt
  | MatchStmt
  | ReturnStmt
  | BreakStmt
  | ContinueStmt
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

export interface MatchStmt {
  kind: "MatchStmt";
  subject: Expr;
  arms: MatchArm[];
  loc: Loc;
}

export interface MatchArm {
  pattern: MatchPattern;
  body: Stmt[];
  loc: Loc;
}

export type MatchPattern =
  | { kind: "LiteralPattern"; value: Expr }
  | { kind: "WildcardPattern" }
  | { kind: "IdentifierPattern"; name: string }
  | { kind: "QualifiedPattern"; qualifier: string; name: string };

export interface BreakStmt {
  kind: "BreakStmt";
  loc: Loc;
}

export interface ContinueStmt {
  kind: "ContinueStmt";
  loc: Loc;
}

export interface Assignment {
  kind: "Assignment";
  op: "=" | "+=" | "-=" | "*=" | "/=" | "%=";
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
  | ListLiteral
  | MapLiteral
  | MatchExpr;

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

export interface MapLiteral {
  kind: "MapLiteral";
  entries: { key: Expr; value: Expr }[];
  loc: Loc;
}

export interface MatchExpr {
  kind: "MatchExpr";
  subject: Expr;
  arms: MatchArm[];
  loc: Loc;
}
