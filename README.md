# Vibe

**A programming language designed for 100% syntax-accurate LLM code generation** — an LLM-first game programming language.

[한국어](README.ko.md) | [日本語](README.ja.md)

## What is Vibe?

Vibe is a new programming language built so that LLMs can generate syntactically valid code on the first try. It transpiles to Lua and runs on [LOVE 2D](https://love2d.org/), with plans for a custom engine in the future.

```
struct Ball
    x: Float
    y: Float
    vx: Float
    vy: Float
    r: Float

let balls: List[Ball] = []

fn update(dt: Float)
    for b in balls
        b.x = b.x + b.vx * dt
        b.y = b.y + b.vy * dt
        if b.x < b.r or b.x > 800.0 - b.r
            b.vx = -b.vx
        if b.y < b.r or b.y > 600.0 - b.r
            b.vy = -b.vy

fn draw()
    set_color(0.2, 0.8, 1.0)
    for b in balls
        draw_circle(b.x, b.y, b.r)
    set_color(1.0, 1.0, 1.0)
    draw_text("Balls: " + str(len(balls)), 10.0, 10.0)
```

## Features

- **Pure indentation** — No `:`, `do`, `then`, or `end`. Blocks are defined by indentation alone.
- **20 keywords** — `fn let const if else for in match return break continue enum struct and or not use yield trait has`
- **LLM-first design** — Minimal syntax ambiguity, consistent patterns, zero edge cases that trip up code generation.
- **Structs, enums, traits** — `struct Player has Drawable`, `enum GameState`, `match state` with `Enum.Variant` patterns.
- **Game-ready** — Built-in functions for input, drawing, and game loops. `fn update(dt)` and `fn draw()` map directly to the engine.
- **Transpiles to Lua** — Generated code runs unmodified on LOVE 2D.

## LLM Benchmark (Syntax Pass Rate)

38 game tasks across 4 difficulty levels (Easy/Medium/Hard/Trap), validated by full pipeline (lexer → parser → codegen → luac).

**Official Generator (Claude Code with project context):**

| Language | Claude |
|----------|--------|
| **Vibe** | **100% (38/38)** |

**Third-party LLMs (API with system prompt only):**

| Language | Gemini | OpenAI |
|----------|--------|--------|
| **Vibe** | **97% (37/38)** | 66% (25/38) |
| Python-Pygame | 100% (38/38) | 100% (38/38) |
| Lua-LOVE | 100% (38/38) | 92% (35/38) |

**Token efficiency** (Gemini avg): Vibe **166** vs Python 209 vs Lua 210. Vibe generates the most concise code.

> Note: "Syntax pass rate" measures whether generated code is syntactically valid and transpiles to valid Lua. Runtime behavioral correctness is not yet measured.

[Full benchmark results](vibe-lang/benchmark/results.md)

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [LOVE 2D](https://love2d.org/) installed (`brew install love` on macOS)

### Install & Run

```bash
git clone https://github.com/flashwade03/Vibe.git
cd Vibe
npm install

# Transpile and run a .vibe file
npx tsx vibe-lang/src/cli/cli.ts run vibe-lang/examples/demo_bouncing_balls.vibe
```

### Run Tests

```bash
npx vitest run
```

129 tests across 4 suites: Lexer (22), Parser (51), CodeGen (52), E2E (4).

## Language Overview

### Variables

```
let x: Int = 42
const PI: Float = 3.14
```

### Functions

```
fn greet(name: String)
    draw_text("Hello " + name, 100.0, 100.0)
```

### Control Flow

```
if health > 0
    draw_text("Alive", 10.0, 10.0)
else
    draw_text("Game Over", 10.0, 10.0)

for enemy in enemies
    draw_rect(enemy.x, enemy.y, 32.0, 32.0)

match state
    GameState.Menu
        draw_text("Press SPACE", 300.0, 300.0)
    GameState.Playing
        draw_text("Playing!", 300.0, 300.0)
```

### Structs & Traits

```
struct Player has Drawable
    x: Float
    y: Float
    size: Float

    fn draw(self_x: Float, self_y: Float)
        draw_rect(self_x, self_y, 32.0, 32.0)
```

### Enums & Match

```
enum GameState
    Menu
    Playing
    GameOver

let state: GameState = GameState.Menu

match state
    GameState.Menu
        draw_text("Menu", 300.0, 300.0)
    GameState.Playing
        draw_text("Play", 300.0, 300.0)
    GameState.GameOver
        draw_text("Over", 300.0, 300.0)
```

### Boolean Operators

```
if alive and not invincible
    take_damage()
```

### Built-in Functions (v0)

| Vibe | Description |
|------|-------------|
| `key_down(key)` | Check if a key is pressed |
| `draw_rect(x, y, w, h)` | Draw a filled rectangle |
| `draw_circle(x, y, r)` | Draw a filled circle |
| `draw_text(text, x, y)` | Draw text on screen |
| `set_color(r, g, b)` | Set drawing color |
| `len(list)` | Get list length |
| `append(list, item)` | Add item to list |
| `abs(x)` / `min(a,b)` / `max(a,b)` | Math functions |
| `rand_int(a, b)` / `rand_float(a, b)` | Random numbers |
| `print(value)` | Print to console |

## Architecture

```
.vibe file → Lexer → Parser → CodeGen → Lua → LOVE 2D
```

The transpiler is written in TypeScript (~3,500 lines) with three independent modules:

- **Lexer** (648 lines) — Tokenizes source with Python-style INDENT/DEDENT
- **Parser** (1,551 lines) — Hand-written recursive descent, produces AST
- **CodeGen** (686 lines) — Walks AST, emits Lua with LOVE 2D API mappings
- **Feedback** (492 lines) — Error-Feedback Loop for LLM retry (Layer 3 defense)

## Project Structure

```
vibe-lang/               — Vibe language (all language-related files)
  src/                   — Transpiler (lexer, parser, codegen, feedback, cli)
  grammar/               — PEG grammar definitions
  examples/              — Vibe example programs (.vibe)
  benchmark/             — LLM benchmark (38 tasks × 3 languages × 2 LLMs)
design/                  — Design documents
research/                — Language design research
build/                   — Generated Lua output (gitignored)
```

## Roadmap

Vibe v0 is complete — the transpiler pipeline handles structs, enums, traits, match, and game loops end-to-end. Next steps:

- Type checker (annotations are parsed but currently ignored)
- Annotation runtime (`@entity`, `@scene`, `@on`)
- Module system (`use`)
- Runtime benchmark validation (currently parser-only)
- Hot reload
- Source maps (Lua errors → Vibe line numbers)
- LSP server
- Custom game engine (Rust)

## License

ISC
