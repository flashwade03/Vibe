# LLM Code Generation Benchmark Results

**Generated**: 2026-03-10T18:27:26.456Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 100% (30/30) | 216 | 3032ms |
| lua-love | openai | 100% (30/30) | 221 | 6629ms |
| python-pygame | gemini | 100% (30/30) | 213 | 3329ms |
| python-pygame | openai | 100% (30/30) | 207 | 7766ms |
| vibe | gemini | 100% (30/30) | 171 | 2816ms |
| vibe | openai | 80% (24/30) | 194 | 9592ms |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 52 | 1843ms | - |
| vibe | openai | YES | 60 | 2320ms | - |
| python-pygame | gemini | YES | 110 | 2491ms | - |
| python-pygame | openai | YES | 97 | 2422ms | - |
| lua-love | gemini | YES | 81 | 1925ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 98 | 4421ms | Warning: luac/luajit not found, syntax not verified |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 60 | 1497ms | - |
| vibe | openai | YES | 64 | 4066ms | - |
| python-pygame | gemini | YES | 128 | 2226ms | - |
| python-pygame | openai | YES | 113 | 2065ms | - |
| lua-love | gemini | YES | 95 | 1744ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 81 | 2730ms | Warning: luac/luajit not found, syntax not verified |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 1586ms | - |
| vibe | openai | YES | 25 | 1978ms | - |
| python-pygame | gemini | YES | 92 | 1783ms | - |
| python-pygame | openai | YES | 70 | 2705ms | - |
| lua-love | gemini | YES | 51 | 1731ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 38 | 3221ms | Warning: luac/luajit not found, syntax not verified |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 76 | 1730ms | - |
| vibe | openai | YES | 86 | 2836ms | - |
| python-pygame | gemini | YES | 148 | 2147ms | - |
| python-pygame | openai | YES | 114 | 4551ms | - |
| lua-love | gemini | YES | 113 | 2436ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 94 | 1853ms | Warning: luac/luajit not found, syntax not verified |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 73 | 1922ms | - |
| vibe | openai | YES | 89 | 2219ms | - |
| python-pygame | gemini | YES | 138 | 2208ms | - |
| python-pygame | openai | YES | 119 | 4329ms | - |
| lua-love | gemini | YES | 92 | 2058ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 88 | 4065ms | Warning: luac/luajit not found, syntax not verified |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 118 | 2033ms | - |
| vibe | openai | YES | 140 | 4162ms | - |
| python-pygame | gemini | YES | 170 | 2498ms | - |
| python-pygame | openai | YES | 162 | 3697ms | - |
| lua-love | gemini | YES | 178 | 2245ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 162 | 2643ms | Warning: luac/luajit not found, syntax not verified |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 138 | 2450ms | - |
| vibe | openai | YES | 145 | 3951ms | - |
| python-pygame | gemini | YES | 180 | 2903ms | - |
| python-pygame | openai | YES | 139 | 6215ms | - |
| lua-love | gemini | YES | 142 | 2291ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 155 | 3212ms | Warning: luac/luajit not found, syntax not verified |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 124 | 2331ms | - |
| vibe | openai | YES | 140 | 4106ms | - |
| python-pygame | gemini | YES | 184 | 3063ms | - |
| python-pygame | openai | YES | 168 | 3866ms | - |
| lua-love | gemini | YES | 200 | 2911ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 207 | 3668ms | Warning: luac/luajit not found, syntax not verified |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 138 | 2486ms | - |
| vibe | openai | YES | 132 | 3753ms | - |
| python-pygame | gemini | YES | 159 | 2714ms | - |
| python-pygame | openai | YES | 144 | 3376ms | - |
| lua-love | gemini | YES | 152 | 2304ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 128 | 3620ms | Warning: luac/luajit not found, syntax not verified |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 39 | 1718ms | - |
| vibe | openai | YES | 42 | 1285ms | - |
| python-pygame | gemini | YES | 94 | 2247ms | - |
| python-pygame | openai | YES | 84 | 2258ms | - |
| lua-love | gemini | YES | 79 | 1746ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 81 | 3347ms | Warning: luac/luajit not found, syntax not verified |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 95 | 2364ms | - |
| vibe | openai | YES | 102 | 2582ms | - |
| python-pygame | gemini | YES | 211 | 4467ms | - |
| python-pygame | openai | YES | 170 | 14507ms | - |
| lua-love | gemini | YES | 150 | 2919ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 150 | 7070ms | Warning: luac/luajit not found, syntax not verified |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 150 | 2786ms | - |
| vibe | openai | YES | 132 | 5453ms | - |
| python-pygame | gemini | YES | 186 | 3405ms | - |
| python-pygame | openai | YES | 160 | 5977ms | - |
| lua-love | gemini | YES | 184 | 2859ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 192 | 9162ms | Warning: luac/luajit not found, syntax not verified |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 182 | 3189ms | - |
| vibe | openai | NO | 227 | 14546ms | unexpected token NEWLINE ("") |
| python-pygame | gemini | YES | 222 | 3593ms | - |
| python-pygame | openai | YES | 198 | 6318ms | - |
| lua-love | gemini | YES | 237 | 3043ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 253 | 6401ms | Warning: luac/luajit not found, syntax not verified |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 168 | 4944ms | - |
| vibe | openai | YES | 183 | 4314ms | - |
| python-pygame | gemini | YES | 180 | 2876ms | - |
| python-pygame | openai | YES | 184 | 6621ms | - |
| lua-love | gemini | YES | 193 | 2633ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 187 | 4253ms | Warning: luac/luajit not found, syntax not verified |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 174 | 2591ms | - |
| vibe | openai | YES | 177 | 4474ms | - |
| python-pygame | gemini | YES | 211 | 3148ms | - |
| python-pygame | openai | YES | 273 | 6917ms | - |
| lua-love | gemini | YES | 196 | 2519ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 228 | 8186ms | Warning: luac/luajit not found, syntax not verified |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 177 | 2652ms | - |
| vibe | openai | YES | 166 | 7235ms | - |
| python-pygame | gemini | YES | 257 | 3376ms | - |
| python-pygame | openai | YES | 192 | 23617ms | - |
| lua-love | gemini | YES | 197 | 2697ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 224 | 5638ms | Warning: luac/luajit not found, syntax not verified |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 206 | 3044ms | - |
| vibe | openai | YES | 282 | 6935ms | - |
| python-pygame | gemini | YES | 233 | 3591ms | - |
| python-pygame | openai | YES | 222 | 8201ms | - |
| lua-love | gemini | YES | 289 | 4077ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 344 | 9134ms | Warning: luac/luajit not found, syntax not verified |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 313 | 4452ms | - |
| vibe | openai | YES | 366 | 15076ms | - |
| python-pygame | gemini | YES | 288 | 4219ms | - |
| python-pygame | openai | YES | 255 | 8423ms | - |
| lua-love | gemini | YES | 355 | 3886ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 363 | 9265ms | Warning: luac/luajit not found, syntax not verified |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 286 | 3373ms | - |
| vibe | openai | YES | 249 | 6288ms | - |
| python-pygame | gemini | YES | 272 | 3103ms | - |
| python-pygame | openai | YES | 252 | 6707ms | - |
| lua-love | gemini | YES | 319 | 3050ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 319 | 7259ms | Warning: luac/luajit not found, syntax not verified |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 248 | 3273ms | - |
| vibe | openai | NO | 548 | 33873ms | expected IDENT, got LPAREN ("(") |
| python-pygame | gemini | YES | 298 | 4036ms | - |
| python-pygame | openai | YES | 428 | 9086ms | - |
| lua-love | gemini | YES | 419 | 4474ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 500 | 15751ms | Warning: luac/luajit not found, syntax not verified |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 199 | 2761ms | - |
| vibe | openai | YES | 231 | 11623ms | - |
| python-pygame | gemini | YES | 280 | 4376ms | - |
| python-pygame | openai | YES | 258 | 15497ms | - |
| lua-love | gemini | YES | 285 | 3747ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 285 | 7813ms | Warning: luac/luajit not found, syntax not verified |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 453 | 4088ms | - |
| vibe | openai | NO | 434 | 40285ms | expected IDENT, got LPAREN ("(") |
| python-pygame | gemini | YES | 346 | 4068ms | - |
| python-pygame | openai | YES | 381 | 9799ms | - |
| lua-love | gemini | YES | 368 | 3353ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 494 | 10936ms | Warning: luac/luajit not found, syntax not verified |

### Task: debug_hud

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 141 | 2644ms | - |
| vibe | openai | YES | 131 | 3885ms | - |
| python-pygame | gemini | YES | 172 | 3214ms | - |
| python-pygame | openai | YES | 162 | 11209ms | - |
| lua-love | gemini | YES | 174 | 2700ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 159 | 4287ms | Warning: luac/luajit not found, syntax not verified |

### Task: game_state_manager

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 200 | 2829ms | - |
| vibe | openai | YES | 232 | 7277ms | - |
| python-pygame | gemini | YES | 232 | 3239ms | - |
| python-pygame | openai | YES | 291 | 11739ms | - |
| lua-love | gemini | YES | 255 | 3428ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 263 | 7678ms | Warning: luac/luajit not found, syntax not verified |

### Task: combat_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 151 | 2935ms | - |
| vibe | openai | YES | 137 | 4354ms | - |
| python-pygame | gemini | YES | 234 | 3951ms | - |
| python-pygame | openai | YES | 213 | 5122ms | - |
| lua-love | gemini | YES | 175 | 2883ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 149 | 5118ms | Warning: luac/luajit not found, syntax not verified |

### Task: enemy_wave_loop

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 326 | 3696ms | - |
| vibe | openai | NO | 344 | 24482ms | expected RBRACKET, got KW_FOR ("for") |
| python-pygame | gemini | YES | 358 | 4133ms | - |
| python-pygame | openai | YES | 243 | 11026ms | - |
| lua-love | gemini | YES | 351 | 3943ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 351 | 9921ms | Warning: luac/luajit not found, syntax not verified |

### Task: tic_tac_toe

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 294 | 3902ms | - |
| vibe | openai | NO | 297 | 24974ms | expected NEWLINE, got KW_IF ("if") |
| python-pygame | gemini | YES | 353 | 4630ms | - |
| python-pygame | openai | YES | 419 | 11068ms | - |
| lua-love | gemini | YES | 407 | 3432ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 359 | 10431ms | Warning: luac/luajit not found, syntax not verified |

### Task: rpg_battle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 192 | 3983ms | - |
| vibe | openai | YES | 280 | 14243ms | - |
| python-pygame | gemini | YES | 264 | 5326ms | - |
| python-pygame | openai | YES | 250 | 7897ms | - |
| lua-love | gemini | YES | 310 | 7510ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 267 | 9570ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_emitter_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 136 | 2136ms | - |
| vibe | openai | YES | 192 | 8563ms | - |
| python-pygame | gemini | YES | 192 | 3899ms | - |
| python-pygame | openai | YES | 202 | 8569ms | - |
| lua-love | gemini | YES | 203 | 2772ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 202 | 7645ms | Warning: luac/luajit not found, syntax not verified |

### Task: highscore_table

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 206 | 3248ms | - |
| vibe | openai | NO | 183 | 16629ms | expected RBRACKET, got COLON (":") |
| python-pygame | gemini | YES | 197 | 2947ms | - |
| python-pygame | openai | YES | 246 | 9199ms | - |
| lua-love | gemini | YES | 219 | 3629ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 217 | 10574ms | Warning: luac/luajit not found, syntax not verified |

## Analysis

### Comparison with Previous Run (2026-03-10T16:54)

| Language | LLM | Previous | Current | Change |
|----------|-----|----------|---------|--------|
| vibe | gemini | 97% (29/30) | **100% (30/30)** | +3% |
| vibe | openai | 87% (26/30) | **80% (24/30)** | **-7%** |
| python-pygame | gemini | 100% (30/30) | 100% (30/30) | 0% |
| python-pygame | openai | 100% (30/30) | 100% (30/30) | 0% |
| lua-love | gemini | 100% (30/30) | 100% (30/30) | 0% |
| lua-love | openai | 100% (30/30) | 100% (30/30) | 0% |

### Gemini Improvement

- `particle_emitter_system` (trap): Previously FAIL (`expected NEWLINE, got IDENT ("Emitter")`), now PASS
- Gemini now achieves **100% pass rate** across all 30 tasks

### OpenAI Vibe Failures (6 tasks, down from 26/30 to 24/30)

| Task | Difficulty | Error | Status vs Previous |
|------|-----------|-------|--------------------|
| asteroid_field | medium | `unexpected token NEWLINE ("")` | **NEW FAILURE** |
| tower_defense_path | hard | `expected IDENT, got LPAREN ("(")` | Persistent |
| pathfinding_viz | hard | `expected IDENT, got LPAREN ("(")` | Persistent |
| enemy_wave_loop | trap | `expected RBRACKET, got KW_FOR ("for")` | **NEW FAILURE** |
| tic_tac_toe | trap | `expected NEWLINE, got KW_IF ("if")` | **NEW FAILURE** |
| highscore_table | trap | `expected RBRACKET, got COLON (":")` | Persistent |

Previously failing tasks that now PASS:
- `snake_movement` (hard): Was `expected IDENT, got DOT (".")`, now passes
- `space_invaders` (hard): Was `expected RBRACKET, got KW_FOR ("for")`, now passes

### Difficulty Breakdown (Vibe Only)

| Difficulty | Gemini | OpenAI | Tasks |
|------------|--------|--------|-------|
| Easy (5) | 5/5 (100%) | 5/5 (100%) | move_rectangle, bouncing_ball, score_counter, mouse_follower, simple_animation |
| Medium (9) | 9/9 (100%) | 8/9 (89%) | asteroid_field FAIL |
| Hard (8) | 8/8 (100%) | 6/8 (75%) | tower_defense_path, pathfinding_viz FAIL |
| Trap (8) | 8/8 (100%) | 5/8 (63%) | enemy_wave_loop, tic_tac_toe, highscore_table FAIL |

### Error Pattern Analysis (OpenAI Vibe)

OpenAI failures are caused by **Training Data Gravity** -- the model falls back to Python/Lua/JS patterns:

1. **`LPAREN` errors** (tower_defense_path, pathfinding_viz): OpenAI generates tuple-like `(x, y)` syntax or function call patterns not supported by Vibe parser
2. **`RBRACKET + COLON` error** (highscore_table): Python dict literal `{"key": value}` or slice `list[0:i]` syntax leaking into Vibe code
3. **`RBRACKET + KW_FOR` error** (enemy_wave_loop): List comprehension `[x for x in ...]` from Python
4. **`NEWLINE + KW_IF` error** (tic_tac_toe): Inline if expression or ternary from Python (`x if cond else y`)
5. **`unexpected NEWLINE` error** (asteroid_field): Likely incomplete expression or dangling operator

Key observation: OpenAI's failures are **nondeterministic** -- `snake_movement` and `space_invaders` that failed last run now pass, while `asteroid_field`, `enemy_wave_loop`, and `tic_tac_toe` that passed last run now fail. This confirms that OpenAI's instruction adherence is inconsistent for longer/complex code generation, especially under **Training Data Gravity** pressure from Trap tasks.

### Conclusion

- **Gemini**: Achieved perfect 100% (30/30), up from 97%. Robust and consistent.
- **OpenAI**: Dropped to 80% (24/30) from 87%. Failures are nondeterministic and concentrated in Hard/Trap categories (5 of 6 failures). The core issue remains "instruction adherence in longer generation" -- OpenAI's training data gravity pulls it toward Python/JS patterns as code length increases.
- **No parser regression**: All failures are LLM-side syntax errors, not parser bugs. The parser correctly rejects invalid Vibe code.
