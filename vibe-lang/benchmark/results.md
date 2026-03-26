# LLM Code Generation Benchmark Results

**Generated**: 2026-03-26

> Note: "Syntax Pass Rate" measures whether generated code is syntactically valid and transpiles to valid Lua. Runtime behavioral correctness is not yet measured.

## Summary

### Official Generator (Claude Code with project context)

| Language | Claude |
|----------|--------|
| **Vibe** | **100% (38/38)** |

### Third-party LLMs (API with system prompt only)

| Language | LLM | Syntax Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|------------------|------------|-------------|
| vibe | gemini | 100% (38/38) | 159 | 3634ms |
| vibe | openai | 82% (31/38) | 174 | 8947ms |
| python-pygame | gemini | 100% (38/38) | 209 | 3896ms |
| python-pygame | openai | 100% (38/38) | 202 | 6338ms |
| lua-love | gemini | 100% (38/38) | 201 | 3527ms |
| lua-love | openai | 100% (38/38) | 208 | 6271ms |

## Analysis

### v0.2 어노테이션 런타임 영향
- v0.2 변경은 기존 38개 태스크에 영향 없음 (`hasGameAnnotations: false` 경로)
- OpenAI 87%→82%는 비결정적 변동 (±2-3건은 실행마다 달라짐)
- 구조적 실패 5건은 동일: waypoint_patrol, tower_defense_path, pathfinding_viz, enum_with_data, trait_updatable

### OpenAI 비결정적 변동 범위
| 실행 | Pass Rate | 구조적 실패 | 비결정적 실패 |
|------|-----------|-----------|-------------|
| v0.1 | 66% (25/38) | 13건 | — |
| v0.2 프롬프트 개선 | 71% (27/38) | 11건 | — |
| v0.3 `:` 메서드 제거 | 87% (33/38) | 5건 | 0건 |
| v0.2 런타임 추가 후 | 82% (31/38) | 5건 | 2건 |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 63 | 2312ms | - |
| vibe | openai | YES | 63 | 2970ms | - |
| python-pygame | gemini | YES | 101 | 2668ms | - |
| python-pygame | openai | YES | 97 | 3669ms | - |
| lua-love | gemini | YES | 78 | 2221ms | - |
| lua-love | openai | YES | 74 | 2921ms | - |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 67 | 1816ms | - |
| vibe | openai | YES | 64 | 2432ms | - |
| python-pygame | gemini | YES | 136 | 2570ms | - |
| python-pygame | openai | YES | 113 | 3185ms | - |
| lua-love | gemini | YES | 95 | 2147ms | - |
| lua-love | openai | YES | 81 | 1666ms | - |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 28 | 2290ms | - |
| vibe | openai | YES | 25 | 1164ms | - |
| python-pygame | gemini | YES | 99 | 2682ms | - |
| python-pygame | openai | YES | 70 | 2815ms | - |
| lua-love | gemini | YES | 48 | 2072ms | - |
| lua-love | openai | YES | 38 | 1756ms | - |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 78 | 2579ms | - |
| vibe | openai | YES | 71 | 4435ms | - |
| python-pygame | gemini | YES | 155 | 3387ms | - |
| python-pygame | openai | YES | 114 | 5106ms | - |
| lua-love | gemini | YES | 117 | 2866ms | - |
| lua-love | openai | YES | 98 | 3107ms | - |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 82 | 2320ms | - |
| vibe | openai | YES | 91 | 3317ms | - |
| python-pygame | gemini | YES | 137 | 3322ms | - |
| python-pygame | openai | YES | 134 | 3451ms | - |
| lua-love | gemini | YES | 85 | 2273ms | - |
| lua-love | openai | YES | 95 | 2415ms | - |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 131 | 2864ms | - |
| vibe | openai | YES | 168 | 4342ms | - |
| python-pygame | gemini | YES | 172 | 3429ms | - |
| python-pygame | openai | YES | 159 | 4153ms | - |
| lua-love | gemini | YES | 172 | 2870ms | - |
| lua-love | openai | YES | 160 | 4586ms | - |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 117 | 2593ms | - |
| vibe | openai | YES | 130 | 3749ms | - |
| python-pygame | gemini | YES | 180 | 3387ms | - |
| python-pygame | openai | YES | 155 | 4855ms | - |
| lua-love | gemini | YES | 143 | 3122ms | - |
| lua-love | openai | YES | 149 | 3266ms | - |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 114 | 3403ms | - |
| vibe | openai | YES | 143 | 12254ms | - |
| python-pygame | gemini | YES | 186 | 3898ms | - |
| python-pygame | openai | YES | 164 | 6241ms | - |
| lua-love | gemini | YES | 200 | 3635ms | - |
| lua-love | openai | YES | 207 | 5708ms | - |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 152 | 3146ms | - |
| vibe | openai | YES | 113 | 3078ms | - |
| python-pygame | gemini | YES | 171 | 3962ms | - |
| python-pygame | openai | YES | 148 | 5284ms | - |
| lua-love | gemini | YES | 152 | 3264ms | - |
| lua-love | openai | YES | 114 | 3392ms | - |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 46 | 2092ms | - |
| vibe | openai | YES | 41 | 1893ms | - |
| python-pygame | gemini | YES | 83 | 2332ms | - |
| python-pygame | openai | YES | 84 | 4540ms | - |
| lua-love | gemini | YES | 79 | 2497ms | - |
| lua-love | openai | YES | 75 | 2949ms | - |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 116 | 3130ms | - |
| vibe | openai | YES | 157 | 6496ms | - |
| python-pygame | gemini | YES | 191 | 4028ms | - |
| python-pygame | openai | YES | 179 | 10795ms | - |
| lua-love | gemini | YES | 150 | 3428ms | - |
| lua-love | openai | YES | 154 | 5140ms | - |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 153 | 4807ms | - |
| vibe | openai | NO | 112 | 19565ms | expected NEWLINE, got COMMA (",") |
| python-pygame | gemini | YES | 172 | 4186ms | - |
| python-pygame | openai | YES | 165 | 6748ms | - |
| lua-love | gemini | YES | 184 | 3026ms | - |
| lua-love | openai | YES | 171 | 5245ms | - |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 174 | 3494ms | - |
| vibe | openai | YES | 249 | 14959ms | - |
| python-pygame | gemini | YES | 212 | 4328ms | - |
| python-pygame | openai | YES | 193 | 6781ms | - |
| lua-love | gemini | YES | 242 | 4154ms | - |
| lua-love | openai | YES | 270 | 8799ms | - |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 133 | 2802ms | - |
| vibe | openai | YES | 153 | 4580ms | - |
| python-pygame | gemini | YES | 197 | 3721ms | - |
| python-pygame | openai | YES | 185 | 7095ms | - |
| lua-love | gemini | YES | 193 | 3558ms | - |
| lua-love | openai | YES | 187 | 4600ms | - |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 160 | 3755ms | - |
| vibe | openai | YES | 157 | 4753ms | - |
| python-pygame | gemini | YES | 216 | 4420ms | - |
| python-pygame | openai | YES | 243 | 7385ms | - |
| lua-love | gemini | YES | 199 | 3785ms | - |
| lua-love | openai | YES | 213 | 9627ms | - |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 190 | 2655ms | - |
| vibe | openai | YES | 166 | 4867ms | - |
| python-pygame | gemini | YES | 226 | 3584ms | - |
| python-pygame | openai | YES | 198 | 6069ms | - |
| lua-love | gemini | YES | 190 | 3187ms | - |
| lua-love | openai | YES | 214 | 10706ms | - |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 210 | 4443ms | - |
| vibe | openai | YES | 332 | 10718ms | - |
| python-pygame | gemini | YES | 233 | 3951ms | - |
| python-pygame | openai | YES | 225 | 6673ms | - |
| lua-love | gemini | YES | 271 | 4621ms | - |
| lua-love | openai | YES | 334 | 9370ms | - |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 272 | 3182ms | - |
| vibe | openai | YES | 293 | 9397ms | - |
| python-pygame | gemini | YES | 277 | 4517ms | - |
| python-pygame | openai | YES | 297 | 8833ms | - |
| lua-love | gemini | YES | 352 | 4734ms | - |
| lua-love | openai | YES | 359 | 10941ms | - |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 269 | 4301ms | - |
| vibe | openai | YES | 252 | 8396ms | - |
| python-pygame | gemini | YES | 272 | 4208ms | - |
| python-pygame | openai | YES | 259 | 7484ms | - |
| lua-love | gemini | YES | 318 | 4126ms | - |
| lua-love | openai | YES | 321 | 10245ms | - |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 316 | 5742ms | - |
| vibe | openai | NO | 333 | 29572ms | expected NEWLINE, got COMMA (",") |
| python-pygame | gemini | YES | 329 | 5438ms | - |
| python-pygame | openai | YES | 445 | 11825ms | - |
| lua-love | gemini | YES | 444 | 5907ms | - |
| lua-love | openai | YES | 485 | 17197ms | - |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 173 | 3578ms | - |
| vibe | openai | YES | 245 | 14472ms | - |
| python-pygame | gemini | YES | 264 | 4788ms | - |
| python-pygame | openai | YES | 234 | 6586ms | - |
| lua-love | gemini | YES | 290 | 4059ms | - |
| lua-love | openai | YES | 291 | 11571ms | - |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 446 | 6035ms | - |
| vibe | openai | NO | 457 | 35847ms | unexpected token KW_IF ("if") |
| python-pygame | gemini | YES | 365 | 4719ms | - |
| python-pygame | openai | YES | 400 | 10401ms | - |
| lua-love | gemini | YES | 411 | 4799ms | - |
| lua-love | openai | YES | 481 | 12692ms | - |

### Task: debug_hud

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 165 | 3470ms | - |
| vibe | openai | YES | 152 | 4612ms | - |
| python-pygame | gemini | YES | 180 | 3498ms | - |
| python-pygame | openai | YES | 164 | 4520ms | - |
| lua-love | gemini | YES | 189 | 2165ms | - |
| lua-love | openai | YES | 157 | 4297ms | - |

### Task: game_state_manager

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 183 | 3788ms | - |
| vibe | openai | YES | 238 | 7991ms | - |
| python-pygame | gemini | YES | 225 | 3755ms | - |
| python-pygame | openai | YES | 293 | 8584ms | - |
| lua-love | gemini | YES | 232 | 3568ms | - |
| lua-love | openai | YES | 271 | 6544ms | - |

### Task: combat_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 161 | 3668ms | - |
| vibe | openai | YES | 102 | 4017ms | - |
| python-pygame | gemini | YES | 220 | 3995ms | - |
| python-pygame | openai | YES | 243 | 6525ms | - |
| lua-love | gemini | YES | 182 | 4244ms | - |
| lua-love | openai | YES | 174 | 4414ms | - |

### Task: enemy_wave_loop

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 241 | 4535ms | - |
| vibe | openai | YES | 330 | 8683ms | - |
| python-pygame | gemini | YES | 356 | 5838ms | - |
| python-pygame | openai | YES | 250 | 8571ms | - |
| lua-love | gemini | YES | 342 | 4775ms | - |
| lua-love | openai | YES | 359 | 10027ms | - |

### Task: tic_tac_toe

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 303 | 5221ms | - |
| vibe | openai | YES | 331 | 13054ms | - |
| python-pygame | gemini | YES | 342 | 4757ms | - |
| python-pygame | openai | YES | 355 | 10529ms | - |
| lua-love | gemini | YES | 309 | 4037ms | - |
| lua-love | openai | YES | 359 | 8509ms | - |

### Task: rpg_battle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 247 | 5408ms | - |
| vibe | openai | YES | 227 | 12833ms | - |
| python-pygame | gemini | YES | 277 | 4780ms | - |
| python-pygame | openai | YES | 232 | 6866ms | - |
| lua-love | gemini | YES | 290 | 4263ms | - |
| lua-love | openai | YES | 240 | 8797ms | - |

### Task: particle_emitter_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 144 | 3237ms | - |
| vibe | openai | YES | 183 | 6389ms | - |
| python-pygame | gemini | YES | 194 | 3502ms | - |
| python-pygame | openai | YES | 202 | 5779ms | - |
| lua-love | gemini | YES | 207 | 3748ms | - |
| lua-love | openai | YES | 205 | 4890ms | - |

### Task: highscore_table

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 237 | 5158ms | - |
| vibe | openai | NO | 184 | 17108ms | expected RBRACKET, got COLON (":") |
| python-pygame | gemini | YES | 206 | 4400ms | - |
| python-pygame | openai | YES | 239 | 6224ms | - |
| lua-love | gemini | YES | 219 | 3853ms | - |
| lua-love | openai | YES | 215 | 6138ms | - |

### Task: struct_basic

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 50 | 2349ms | - |
| vibe | openai | NO | 62 | 7280ms | unexpected token DEDENT ("") |
| python-pygame | gemini | YES | 159 | 3150ms | - |
| python-pygame | openai | YES | 123 | 2968ms | - |
| lua-love | gemini | YES | 99 | 2572ms | - |
| lua-love | openai | YES | 109 | 2502ms | - |

### Task: struct_methods

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 123 | 5587ms | - |
| vibe | openai | YES | 127 | 3325ms | - |
| python-pygame | gemini | YES | 215 | 3995ms | - |
| python-pygame | openai | YES | 156 | 4786ms | - |
| lua-love | gemini | YES | 156 | 3958ms | - |
| lua-love | openai | YES | 137 | 3787ms | - |

### Task: enum_state_machine

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 77 | 2656ms | - |
| vibe | openai | YES | 78 | 2924ms | - |
| python-pygame | gemini | YES | 164 | 2190ms | - |
| python-pygame | openai | YES | 176 | 5307ms | - |
| lua-love | gemini | YES | 129 | 2625ms | - |
| lua-love | openai | YES | 116 | 4707ms | - |

### Task: enum_with_data

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 137 | 3381ms | - |
| vibe | openai | NO | 171 | 16188ms | expected NEWLINE, got LPAREN ("(") |
| python-pygame | gemini | YES | 215 | 4271ms | - |
| python-pygame | openai | YES | 219 | 8138ms | - |
| lua-love | gemini | YES | 199 | 4389ms | - |
| lua-love | openai | YES | 210 | 6256ms | - |

### Task: struct_composition

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 115 | 3059ms | - |
| vibe | openai | YES | 117 | 3343ms | - |
| python-pygame | gemini | YES | 210 | 4127ms | - |
| python-pygame | openai | YES | 158 | 5046ms | - |
| lua-love | gemini | YES | 177 | 3327ms | - |
| lua-love | openai | YES | 202 | 5023ms | - |

### Task: trait_drawable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 116 | 2953ms | - |
| vibe | openai | YES | 106 | 3201ms | - |
| python-pygame | gemini | YES | 180 | 3472ms | - |
| python-pygame | openai | YES | 169 | 4658ms | - |
| lua-love | gemini | YES | 165 | 3575ms | - |
| lua-love | openai | YES | 188 | 5102ms | - |

### Task: trait_updatable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 163 | 7549ms | - |
| vibe | openai | NO | 236 | 21538ms | expected IDENT, got LPAREN ("(") |
| python-pygame | gemini | YES | 251 | 4514ms | - |
| python-pygame | openai | YES | 261 | 6642ms | - |
| lua-love | gemini | YES | 219 | 4150ms | - |
| lua-love | openai | YES | 239 | 5825ms | - |

### Task: struct_list_management

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 97 | 2717ms | - |
| vibe | openai | YES | 142 | 4253ms | - |
| python-pygame | gemini | YES | 162 | 4270ms | - |
| python-pygame | openai | YES | 184 | 5727ms | - |
| lua-love | gemini | YES | 127 | 2422ms | - |
| lua-love | openai | YES | 167 | 3565ms | - |
