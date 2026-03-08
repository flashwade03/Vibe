---
created: 2026-03-08 12:09
modified: 2026-03-08 12:25
session_id: 5c4189d4
---

# Phase 1 v0 Implementation Plan: Vibe Transpiler

## 1. What We Are Building

A minimal transpiler pipeline that converts a single `.vibe` file into Lua code runnable by LOVE 2D. The pipeline has three stages -- Lexer, Parser, CodeGen -- plus a CLI wrapper. When complete, the v0 validation code (a moving rectangle controlled by arrow keys) will run in LOVE 2D via `vibe run game.vibe`.

### v0 Input (Vibe)
```
let x: Float = 400.0
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
  draw_rect(x, y, 32, 32)
```

### v0 Output (`build/main.lua`)
```lua
local x = 400.0
local y = 300.0
local speed = 200.0

function love.update(dt)
  if love.keyboard.isDown("right") then
    x = x + speed * dt
  end
  if love.keyboard.isDown("left") then
    x = x - speed * dt
  end
  if love.keyboard.isDown("down") then
    y = y + speed * dt
  end
  if love.keyboard.isDown("up") then
    y = y - speed * dt
  end
end

function love.draw()
  love.graphics.rectangle("fill", x, y, 32, 32)
end
```

### v0 Output (`build/conf.lua`)
A static constant string, identical for every project:
```lua
function love.conf(t)
  t.window.title = "Vibe Game"
  t.window.width = 800
  t.window.height = 600
end
```

## 2. Authoritative Design Documents

| Document | Status | Notes |
|----------|--------|-------|
| `design/phase1-minimal-pipeline.md` | **Authoritative** | v0 scope, constraints, validation code |
| `design/vibe-core-grammar.peg` | **Authoritative** (with one v0 override) | Grammar rules. See 2.1 for override. |
| `design/transpile-to-love2d.md` | **Authoritative** for v0 codegen mappings only | Vibe→Lua mapping patterns. Full-runtime architecture sections (ECS, scene manager, etc.) are NOT in v0 scope. |
| `design/core-keywords.md` | **Superseded in parts** | Contains removed features: `mut`, `self`, `while`, `elif`, `impl`. Agents must NOT reference for keyword decisions. |
| `design/game-annotations.md` | **Not applicable to v0** | Annotations out of scope |
| `CLAUDE.md` | **Authoritative** | Master project rules |

### 2.1 PEG Grammar Override for v0: Top-Level `let`

The PEG grammar forbids top-level `let`. The v0 validation code uses top-level `let`. **v0 rule**: `TopLevelDecl` includes `LetDecl`. Add `// v0 override` comment when implementing.

### 2.2 Compound Assignment: Out of v0

`+=`, `-=`, `*=`, `/=`, `%=` are defined in the PEG grammar but explicitly listed as "v0 이후". Parser must not recognize them. Lexer does not emit them.

## 3. Design Decisions

**Grammar source of truth**: `design/vibe-core-grammar.peg` (with v0 override in 2.1).

**Indentation**: Lexer converts to INDENT/DEDENT/NEWLINE tokens (Python style). Suppressed inside parens/brackets.

**Comments**: `--` (double dash). NOT `#`.

**Type annotations**: Parsed but discarded by codegen.

**Game loop mapping**: `fn update(dt)` → `love.update(dt)`, `fn draw()` → `love.draw()`.

**Built-in function mapping**:
| Vibe | Lua/LOVE |
|------|----------|
| `key_down(key)` | `love.keyboard.isDown(key)` |
| `draw_rect(x, y, w, h)` | `love.graphics.rectangle("fill", x, y, w, h)` |
| `draw_text(text, x, y)` | `love.graphics.print(text, x, y)` |
| `draw_circle(x, y, r)` | `love.graphics.circle("fill", x, y, r)` |

**`for` loop codegen**:
| Vibe | Lua |
|------|-----|
| `for enemy in enemies` | `for _, enemy in ipairs(enemies) do ... end` |
| `for i in range(10)` | `for i = 0, 9 do ... end` |
| `for condition` | `while condition do ... end` |

`range()` is a compile-time pattern, not a runtime function.

**Operator precedence**: or → and → not → comparison → +/- → */% → unary - → postfix (.  [] ())

### 3.1 Lua Reserved Word Collision

11 Lua reserved words that are NOT Vibe keywords: `do`, `end`, `then`, `elseif`, `function`, `goto`, `local`, `nil`, `repeat`, `until`, `while`. Vibe identifiers matching these get `_v_` prefix in codegen (e.g., `end` → `_v_end`).

## 4. Error Handling Architecture

### 4.1 `VibeError` Class (`src/errors.ts`)

Unified error with `filename`, `line`, `col`, `phase` ("lexer"|"parser"|"codegen"), `message`. Method `format()` → `"filename:line:col: phase error: message"`.

### 4.2 Error Propagation

Lexer/Parser/CodeGen throw `VibeError`. CLI catches and formats. Exit code 1 for VibeError, 2 for internal errors.

### 4.3 Source Location on AST Nodes

Every AST node carries `loc: { line: number; col: number }`. Parser populates from the token that begins the node.

## 5. Project Setup

### 5.1 File Structure

```
src/
  errors.ts              -- VibeError class
  lexer/
    tokens.ts            -- TokenType enum, Token interface
    lexer.ts             -- Lexer (source → token stream)
    lexer.test.ts        -- 22 tests
  parser/
    ast.ts               -- AST node types (all carry loc)
    parser.ts            -- Recursive descent parser
    parser.test.ts       -- 22 tests
  codegen/
    codegen.ts           -- AST → Lua generator
    codegen.test.ts      -- 20 tests
  cli/
    cli.ts               -- CLI entry point (ensures build/ exists via mkdirSync)
  pipeline.ts            -- Glue: lex | parse | generate
  e2e/
    e2e.test.ts          -- 3 E2E tests
    fixtures/
      moving_rect.vibe   -- v0 validation code
      moving_rect.lua    -- Expected Lua output
      error_missing_eq.vibe  -- Error test: "let x 42"
build/                   -- Generated output (gitignored)
```

### 5.2 Dependencies

Agent S installs `vitest` (^3.0.0) via `npm install -D vitest`. Config: `tsconfig.json` (strict, ES2022, NodeNext), `vitest.config.ts`. Gate: `npx vitest run` must exit 0 (no tests yet = pass) before other agents start.

## 6. Agent-Teams Structure

### 6.1 Agent Assignment

| Agent | Files (exclusive) |
|-------|-------------------|
| **S: Setup** | `package.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `src/errors.ts`, `src/e2e/fixtures/*` |
| **A: Lexer** | `src/lexer/tokens.ts`, `src/lexer/lexer.ts`, `src/lexer/lexer.test.ts` |
| **B: Parser** | `src/parser/ast.ts`, `src/parser/parser.ts`, `src/parser/parser.test.ts` |
| **C: CodeGen+CLI** | `src/codegen/*`, `src/cli/*`, `src/pipeline.ts`, `src/e2e/e2e.test.ts` |

### 6.2 Execution Phases

```
Phase 0: Agent S (HARD GATE — must complete before anything else)
             |
Phase 1: Agent A (tokens.ts + lexer)  |||  Agent B (ast.ts only)
             |                                  |
Phase 2: Agent B (parser — needs tokens.ts) ||| Agent C (codegen — needs ast.ts)
             |                                  |
Phase 3: Agent C (pipeline + CLI + E2E — needs all modules)
```

**Dependency graph**:
```
errors.ts ──────────────────────────────────────────────┐
                                                        v
tokens.ts ──→ lexer.ts ──→ parser.ts ──→ pipeline.ts ──→ cli.ts
                              ^                ^
ast.ts ───────────────────────┘                |
    └──────→ codegen.ts ───────────────────────┘
```

### 6.3 Inter-Agent Contracts

`tokens.ts`, `ast.ts`, `errors.ts` are frozen once committed. Owner agent makes changes if needed.

## 7. TDD Strategy

**Framework**: Vitest. Tests written BEFORE implementation.

### Lexer Tests (22 cases)
Empty input, int/float/string literals, escape sequences, unterminated string error, identifier, keyword recognition, keyword boundary ("letter"≠KW_LET), operators, arrow `->`, comment stripping, comment-only lines, INDENT/DEDENT, multiple DEDENTs, blank line skipping, paren suppression, comment at indented position, DEDENT before else, inconsistent indentation error, full v0 tokenization.

### Parser Tests (22 cases)
Let/const declarations, type annotations, functions with params, arithmetic precedence, comparison, function calls, field access, if/if-else/else-if chain, multiple sequential ifs, assignment, for-in/for-cond, unary negation, boolean operators, grouped expressions, error with location, full v0 parse.

### CodeGen Tests (20 cases)
Let/const→local, regular/update/draw functions, if/if-else/elseif, assignment, `!=`→`~=`, 4 built-in mappings, for-in with range(), for-in with list, for-cond→while, Lua reserved word escaping, conf.lua generation, full v0 program.

### E2E Tests (3 cases)
Full pipeline (vibe→lua comparison), conf.lua, error case with location.

## 8. Implementation Order

| Step | Agent | Work | Gate |
|------|-------|------|------|
| 0 | S | Project setup, errors.ts, fixtures | `npx vitest run` works |
| 1 | A+B parallel | tokens.ts, ast.ts (interfaces) | Files compile |
| 2 | A | lexer.ts + 22 tests | All lexer tests pass |
| 2' | C parallel | codegen.ts + 20 tests (hand-crafted AST) | All codegen tests pass |
| 3 | B | parser.ts + 22 tests | All parser tests pass |
| 4 | C | pipeline.ts + cli.ts + 3 E2E tests | All tests pass |
| 5 | Manual | `love build/` verification | Rectangle moves |

## 9. Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| INDENT/DEDENT edge cases | 22 lexer tests covering blank lines, comments, EOF, deep nesting |
| DEDENT before `else` | Dedicated test #20. Lexer emits DEDENT then continues line. |
| Paren suppression | Test #18. Track parenDepth, suppress when > 0. |
| Assignment vs expression | Parse expr first, check for `=`. Validate target type. |
| `range()` outside `for` | Passes through as-is (Lua runtime error). Acceptable for v0. |
| Lua reserved word collision | CodeGen test #18. `_v_` prefix escaping. |

## 10. Success Criteria

1. `npx vitest run` — all 67 tests pass
2. `vibe run moving_rect.vibe` — generates `build/main.lua` + `build/conf.lua`
3. `love build/` — rectangle at (400,300) moves with arrow keys
4. Error cases — `filename:line:col: phase error: message` format
