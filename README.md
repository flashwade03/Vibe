# Vibe

**A programming language designed for 100% accurate LLM code generation**, paired with a lightweight game engine.

[한국어](README.ko.md) | [日本語](README.ja.md)

## What is Vibe?

Vibe is a new programming language built so that LLMs can understand and generate its code with perfect accuracy. It transpiles to Lua and runs on [LOVE 2D](https://love2d.org/), with plans for a custom engine in the future.

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

## Features

- **Pure indentation** — No `:`, `do`, `then`, or `end`. Blocks are defined by indentation alone.
- **20 keywords** — `fn let const if else for in match return break continue enum struct and or not use yield trait has`
- **LLM-first design** — Minimal syntax ambiguity, consistent patterns, zero edge cases that trip up code generation.
- **Game-ready** — Built-in functions for input, drawing, and game loops. `fn update(dt)` and `fn draw()` map directly to the engine.
- **Transpiles to Lua** — Generated code runs unmodified on LOVE 2D.

## LLM Benchmark

Vibe is benchmarked against Python-Pygame and Lua-LOVE across 50 game tasks with 3 LLMs.

| Language | Claude | Gemini | OpenAI |
|----------|--------|--------|--------|
| **Vibe** | **100% (50/50)** | **100% (50/50)** | 96% (48/50) |
| Python-Pygame | - | 100% (50/50) | 100% (50/50) |
| Lua-LOVE | - | 100% (50/50) | 100% (50/50) |

Vibe generates the most concise code (avg 191-200 tokens vs 220-237) with the fastest latency.

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
npx tsx vibe-lang/src/cli/cli.ts run vibe-lang/examples/02_moving_player.vibe

# Or if LOVE isn't in PATH (macOS)
npx tsx vibe-lang/src/cli/cli.ts run vibe-lang/examples/02_moving_player.vibe
open -a love build
```

### Run Tests

```bash
npx vitest run
```

76 tests across 4 suites: Lexer (22), Parser (24), CodeGen (27), E2E (3).

## Language Overview

### Variables

```
let x: Int = 42
const PI: Float = 3.14
```

### Functions

```
fn greet(name: String)
  draw_text("Hello " + name, 100, 100)
```

### Control Flow

```
if health > 0
  draw_text("Alive", 10, 10)
else
  draw_text("Game Over", 10, 10)

for enemy in enemies
  draw_rect(enemy.x, enemy.y, 32, 32)

for i in range(10)
  draw_circle(i * 50, 100, 10)
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

## Examples

The `vibe-lang/examples/` directory contains 10 progressively complex programs:

| # | File | Description |
|---|------|-------------|
| 01 | `hello_vibe.vibe` | Text display |
| 02 | `moving_player.vibe` | Arrow key movement |
| 03 | `coin_collector.vibe` | Collision and scoring |
| 04 | `enemy_ai.vibe` | State machine AI |
| 05 | `scene_transition.vibe` | Scene management |
| 06 | `shooting_game.vibe` | Projectiles |
| 07 | `platformer.vibe` | Gravity and jumping |
| 08 | `inventory_system.vibe` | Data structures |
| 09 | `particle_tween_effects.vibe` | Particles and tweens |
| 10 | `coroutine_cutscene.vibe` | Coroutine cutscenes |

## Architecture

```
.vibe file → Lexer → Parser → CodeGen → Lua → LOVE 2D
```

The transpiler is written in TypeScript with three independent modules:

- **Lexer** — Tokenizes source with Python-style INDENT/DEDENT
- **Parser** — Hand-written recursive descent, produces AST
- **CodeGen** — Walks AST, emits Lua with LOVE 2D API mappings

## Project Structure

```
vibe-lang/               — Vibe language (all language-related files)
  src/                   — Transpiler (lexer, parser, codegen, feedback, cli)
  grammar/               — PEG grammar definitions
  examples/              — Vibe example programs (.vibe)
  benchmark/             — LLM benchmark (50 tasks × 3 languages × 3 LLMs)
design/                  — Design documents
research/                — Language design research
build/                   — Generated Lua output (gitignored)
```

## Roadmap

Vibe is currently at **Phase 1 v0** — a minimal transpiler pipeline. Future directions include:

- Type checker
- `enum` / `match` / `struct` / `trait` / `has`
- Annotation system (`@entity`, `@scene`, `@on`)
- Module system (`use`)
- Hot reload
- Source maps (Lua errors → Vibe line numbers)
- LSP server
- Custom game engine (Rust)

## License

ISC
