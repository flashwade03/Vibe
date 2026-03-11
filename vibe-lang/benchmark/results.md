# LLM Code Generation Benchmark Results

**Generated**: 2026-03-12

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| **vibe** | **claude** | **100% (38/38)** | - | - |
| vibe | gemini | 97% (37/38) | 168 | 3519ms |
| vibe | openai | 66% (25/38) | 165 | 10643ms |
| python-pygame | gemini | 100% (38/38) | 208 | 3341ms |
| python-pygame | openai | 100% (38/38) | 209 | 6315ms |
| lua-love | gemini | 100% (38/38) | 203 | 2969ms |
| lua-love | openai | 92% (35/38) | 218 | 6507ms |

## Analysis

### Vibe Pass Rate by LLM
- **Claude**: 100% — 공식 코드 생성기, Training Data Gravity 없음
- **Gemini**: 97% — `tower_defense_path` 1개 실패 (복잡한 태스크에서 Python `:` 혼입, 비결정적)
- **OpenAI**: 66% — Training Data Gravity 심각 (Python 패턴 13건 혼입)

### OpenAI 실패 패턴 분류
| 패턴 | 건수 | 원인 |
|------|------|------|
| COLON `:` (블록 구분자) | 4 | Python `def f():` 스타일 |
| RBRACKET/COMMA (list comprehension) | 3 | Python `[x for x in ...]` |
| LPAREN `(` (잘못된 구문) | 2 | 괄호식 표현 또는 default params |
| EQ `=` (default params) | 1 | Python `fn foo(x=5)` |
| DEDENT/INDENT (들여쓰기) | 2 | struct/enum 본문 들여쓰기 오류 |
| IDENT (키워드 누락) | 1 | `let` 누락 |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 55 | 1533ms | - |
| vibe | openai | YES | 63 | 2754ms | - |
| python-pygame | gemini | YES | 110 | 2311ms | - |
| python-pygame | openai | YES | 97 | 2952ms | - |
| lua-love | gemini | YES | 81 | 2333ms | - |
| lua-love | openai | NO | 76 | 3475ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'vibe'  |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 71 | 2411ms | - |
| vibe | openai | YES | 64 | 1494ms | - |
| python-pygame | gemini | YES | 140 | 2064ms | - |
| python-pygame | openai | YES | 109 | 3634ms | - |
| lua-love | gemini | YES | 95 | 1856ms | - |
| lua-love | openai | YES | 81 | 5210ms | - |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 28 | 1433ms | - |
| vibe | openai | YES | 25 | 2390ms | - |
| python-pygame | gemini | YES | 93 | 2022ms | - |
| python-pygame | openai | YES | 70 | 2854ms | - |
| lua-love | gemini | YES | 51 | 1619ms | - |
| lua-love | openai | YES | 38 | 1300ms | - |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 114 | 4370ms | - |
| vibe | openai | NO | 61 | 10203ms | expected NEWLINE, got COLON (":") |
| python-pygame | gemini | YES | 156 | 3403ms | - |
| python-pygame | openai | YES | 114 | 4326ms | - |
| lua-love | gemini | YES | 117 | 2739ms | - |
| lua-love | openai | YES | 155 | 7928ms | - |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 82 | 1739ms | - |
| vibe | openai | YES | 84 | 3096ms | - |
| python-pygame | gemini | YES | 134 | 2459ms | - |
| python-pygame | openai | YES | 116 | 3320ms | - |
| lua-love | gemini | YES | 92 | 2052ms | - |
| lua-love | openai | YES | 86 | 3224ms | - |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 126 | 2070ms | - |
| vibe | openai | YES | 143 | 3479ms | - |
| python-pygame | gemini | YES | 170 | 2771ms | - |
| python-pygame | openai | YES | 158 | 3819ms | - |
| lua-love | gemini | YES | 176 | 2562ms | - |
| lua-love | openai | YES | 159 | 2301ms | - |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 115 | 1947ms | - |
| vibe | openai | YES | 124 | 4752ms | - |
| python-pygame | gemini | YES | 180 | 3681ms | - |
| python-pygame | openai | YES | 133 | 3632ms | - |
| lua-love | gemini | YES | 147 | 3148ms | - |
| lua-love | openai | YES | 153 | 5032ms | - |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 114 | 2545ms | - |
| vibe | openai | YES | 133 | 8965ms | - |
| python-pygame | gemini | YES | 185 | 3145ms | - |
| python-pygame | openai | YES | 168 | 5907ms | - |
| lua-love | gemini | YES | 200 | 3572ms | - |
| lua-love | openai | YES | 207 | 5422ms | - |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 142 | 3131ms | - |
| vibe | openai | YES | 133 | 3731ms | - |
| python-pygame | gemini | YES | 161 | 3041ms | - |
| python-pygame | openai | YES | 140 | 4220ms | - |
| lua-love | gemini | YES | 146 | 2978ms | - |
| lua-love | openai | YES | 114 | 4468ms | - |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 47 | 1644ms | - |
| vibe | openai | YES | 41 | 1438ms | - |
| python-pygame | gemini | YES | 93 | 2454ms | - |
| python-pygame | openai | YES | 98 | 4088ms | - |
| lua-love | gemini | YES | 79 | 1903ms | - |
| lua-love | openai | YES | 82 | 3396ms | - |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 120 | 2840ms | - |
| vibe | openai | YES | 94 | 3638ms | - |
| python-pygame | gemini | YES | 201 | 3884ms | - |
| python-pygame | openai | YES | 171 | 8171ms | - |
| lua-love | gemini | YES | 152 | 2327ms | - |
| lua-love | openai | YES | 138 | 5821ms | - |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 142 | 4716ms | - |
| vibe | openai | NO | 86 | 8308ms | expected NEWLINE, got COLON (":") |
| python-pygame | gemini | YES | 185 | 2695ms | - |
| python-pygame | openai | YES | 178 | 7308ms | - |
| lua-love | gemini | YES | 184 | 2807ms | - |
| lua-love | openai | YES | 191 | 7518ms | - |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 175 | 2861ms | - |
| vibe | openai | NO | 186 | 21671ms | expected RBRACKET, got KW_FOR ("for") |
| python-pygame | gemini | YES | 212 | 3949ms | - |
| python-pygame | openai | YES | 189 | 5901ms | - |
| lua-love | gemini | YES | 240 | 3425ms | - |
| lua-love | openai | YES | 277 | 7593ms | - |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 151 | 2820ms | - |
| vibe | openai | YES | 152 | 6006ms | - |
| python-pygame | gemini | YES | 177 | 2082ms | - |
| python-pygame | openai | YES | 185 | 5477ms | - |
| lua-love | gemini | YES | 196 | 3180ms | - |
| lua-love | openai | YES | 189 | 5603ms | - |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 174 | 2862ms | - |
| vibe | openai | YES | 156 | 6112ms | - |
| python-pygame | gemini | YES | 220 | 3780ms | - |
| python-pygame | openai | YES | 242 | 8353ms | - |
| lua-love | gemini | YES | 188 | 2726ms | - |
| lua-love | openai | YES | 223 | 8168ms | - |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 185 | 3358ms | - |
| vibe | openai | YES | 166 | 5303ms | - |
| python-pygame | gemini | YES | 220 | 4075ms | - |
| python-pygame | openai | YES | 200 | 6202ms | - |
| lua-love | gemini | YES | 192 | 2455ms | - |
| lua-love | openai | YES | 240 | 7132ms | - |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 198 | 3999ms | - |
| vibe | openai | YES | 283 | 7653ms | - |
| python-pygame | gemini | YES | 228 | 4827ms | - |
| python-pygame | openai | YES | 227 | 5241ms | - |
| lua-love | gemini | YES | 289 | 3044ms | - |
| lua-love | openai | YES | 349 | 4884ms | - |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 290 | 4913ms | - |
| vibe | openai | NO | 264 | 22836ms | expected RBRACKET, got KW_FOR ("for") |
| python-pygame | gemini | YES | 288 | 3497ms | - |
| python-pygame | openai | YES | 304 | 8884ms | - |
| lua-love | gemini | YES | 339 | 3167ms | - |
| lua-love | openai | YES | 422 | 9311ms | - |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 266 | 3731ms | - |
| vibe | openai | YES | 231 | 9369ms | - |
| python-pygame | gemini | YES | 284 | 3836ms | - |
| python-pygame | openai | YES | 237 | 7778ms | - |
| lua-love | gemini | YES | 317 | 3479ms | - |
| lua-love | openai | YES | 322 | 7677ms | - |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 373 | 14366ms | expected NEWLINE, got COLON (":") |
| vibe | openai | NO | 355 | 35438ms | expected RBRACKET, got COMMA (",") |
| python-pygame | gemini | YES | 283 | 3346ms | - |
| python-pygame | openai | YES | 490 | 12385ms | - |
| lua-love | gemini | YES | 422 | 4277ms | - |
| lua-love | openai | YES | 444 | 29896ms | - |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 205 | 3490ms | - |
| vibe | openai | YES | 227 | 21088ms | - |
| python-pygame | gemini | YES | 280 | 3703ms | - |
| python-pygame | openai | YES | 251 | 9227ms | - |
| lua-love | gemini | YES | 287 | 3376ms | - |
| lua-love | openai | YES | 313 | 8982ms | - |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 451 | 3548ms | - |
| vibe | openai | NO | 436 | 40141ms | expected IDENT, got LPAREN ("(") |
| python-pygame | gemini | YES | 367 | 4591ms | - |
| python-pygame | openai | YES | 407 | 11091ms | - |
| lua-love | gemini | YES | 424 | 4132ms | - |
| lua-love | openai | YES | 540 | 11363ms | - |

### Task: debug_hud

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 140 | 2130ms | - |
| vibe | openai | YES | 132 | 3173ms | - |
| python-pygame | gemini | YES | 183 | 2765ms | - |
| python-pygame | openai | YES | 167 | 5113ms | - |
| lua-love | gemini | YES | 201 | 3278ms | - |
| lua-love | openai | YES | 161 | 3467ms | - |

### Task: game_state_manager

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 233 | 3210ms | - |
| vibe | openai | YES | 234 | 7001ms | - |
| python-pygame | gemini | YES | 215 | 2598ms | - |
| python-pygame | openai | YES | 304 | 8376ms | - |
| lua-love | gemini | YES | 229 | 3754ms | - |
| lua-love | openai | YES | 274 | 5886ms | - |

### Task: combat_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 158 | 2679ms | - |
| vibe | openai | YES | 130 | 5049ms | - |
| python-pygame | gemini | YES | 216 | 2946ms | - |
| python-pygame | openai | YES | 219 | 7274ms | - |
| lua-love | gemini | YES | 162 | 3076ms | - |
| lua-love | openai | YES | 144 | 4318ms | - |

### Task: enemy_wave_loop

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 266 | 4373ms | - |
| vibe | openai | NO | 299 | 25912ms | expected NEWLINE, got COLON (":") |
| python-pygame | gemini | YES | 370 | 5273ms | - |
| python-pygame | openai | YES | 346 | 10582ms | - |
| lua-love | gemini | YES | 370 | 4050ms | - |
| lua-love | openai | YES | 406 | 9436ms | - |

### Task: tic_tac_toe

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 318 | 4835ms | - |
| vibe | openai | YES | 317 | 16774ms | - |
| python-pygame | gemini | YES | 347 | 5178ms | - |
| python-pygame | openai | YES | 423 | 14550ms | - |
| lua-love | gemini | YES | 354 | 3567ms | - |
| lua-love | openai | YES | 358 | 8518ms | - |

### Task: rpg_battle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 244 | 2853ms | - |
| vibe | openai | YES | 267 | 8702ms | - |
| python-pygame | gemini | YES | 274 | 4188ms | - |
| python-pygame | openai | YES | 320 | 10342ms | - |
| lua-love | gemini | YES | 305 | 3704ms | - |
| lua-love | openai | YES | 252 | 9704ms | - |

### Task: particle_emitter_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 122 | 2071ms | - |
| vibe | openai | NO | 154 | 14789ms | expected RPAREN, got EQ ("=") |
| python-pygame | gemini | YES | 194 | 3280ms | - |
| python-pygame | openai | YES | 202 | 5794ms | - |
| lua-love | gemini | YES | 205 | 3843ms | - |
| lua-love | openai | YES | 205 | 6964ms | - |

### Task: highscore_table

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 205 | 3383ms | - |
| vibe | openai | YES | 224 | 23384ms | - |
| python-pygame | gemini | YES | 197 | 3074ms | - |
| python-pygame | openai | YES | 255 | 6833ms | - |
| lua-love | gemini | YES | 229 | 3200ms | - |
| lua-love | openai | YES | 209 | 7097ms | - |

### Task: struct_basic

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 54 | 2044ms | - |
| vibe | openai | YES | 51 | 1618ms | - |
| python-pygame | gemini | YES | 181 | 3298ms | - |
| python-pygame | openai | YES | 118 | 3517ms | - |
| lua-love | gemini | YES | 98 | 2617ms | - |
| lua-love | openai | YES | 109 | 2744ms | - |

### Task: struct_methods

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 110 | 5392ms | - |
| vibe | openai | NO | 117 | 12530ms | unexpected token DEDENT ("") |
| python-pygame | gemini | YES | 206 | 3655ms | - |
| python-pygame | openai | YES | 161 | 4163ms | - |
| lua-love | gemini | YES | 159 | 2391ms | - |
| lua-love | openai | YES | 135 | 3471ms | - |

### Task: enum_state_machine

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 85 | 1383ms | - |
| vibe | openai | YES | 67 | 3537ms | - |
| python-pygame | gemini | YES | 163 | 3257ms | - |
| python-pygame | openai | YES | 167 | 4039ms | - |
| lua-love | gemini | YES | 113 | 1869ms | - |
| lua-love | openai | NO | 162 | 5106ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'vibe'  |

### Task: enum_with_data

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 150 | 5160ms | - |
| vibe | openai | NO | 172 | 12351ms | expected IDENT, got INDENT ("") |
| python-pygame | gemini | YES | 225 | 3081ms | - |
| python-pygame | openai | YES | 213 | 5375ms | - |
| lua-love | gemini | YES | 203 | 2617ms | - |
| lua-love | openai | NO | 239 | 5925ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'vibe'  |

### Task: struct_composition

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 118 | 2522ms | - |
| vibe | openai | YES | 129 | 3392ms | - |
| python-pygame | gemini | YES | 228 | 3151ms | - |
| python-pygame | openai | YES | 181 | 4382ms | - |
| lua-love | gemini | YES | 162 | 3121ms | - |
| lua-love | openai | YES | 184 | 3749ms | - |

### Task: trait_drawable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 132 | 4864ms | - |
| vibe | openai | NO | 115 | 7491ms | expected NEWLINE, got COLON (":") |
| python-pygame | gemini | YES | 182 | 3712ms | - |
| python-pygame | openai | YES | 166 | 4185ms | - |
| lua-love | gemini | YES | 153 | 2274ms | - |
| lua-love | openai | YES | 232 | 4544ms | - |

### Task: trait_updatable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 319 | 8058ms | - |
| vibe | openai | NO | 253 | 17929ms | expected IDENT, got LPAREN ("(") |
| python-pygame | gemini | YES | 207 | 2910ms | - |
| python-pygame | openai | YES | 239 | 5740ms | - |
| lua-love | gemini | YES | 218 | 4107ms | - |
| lua-love | openai | YES | 238 | 6174ms | - |

### Task: struct_list_management

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 122 | 2421ms | - |
| vibe | openai | NO | 118 | 10952ms | expected NEWLINE, got IDENT ("spawn_timer") |
| python-pygame | gemini | YES | 167 | 2991ms | - |
| python-pygame | openai | YES | 181 | 4928ms | - |
| lua-love | gemini | YES | 145 | 2211ms | - |
| lua-love | openai | YES | 163 | 4445ms | - |
