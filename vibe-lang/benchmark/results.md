# LLM Code Generation Benchmark Results

**Generated**: 2026-03-11T08:06:13.368Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 100% (38/38) | 201 | 2825ms |
| lua-love | openai | 89% (34/38) | 215 | 5960ms |
| python-pygame | gemini | 100% (38/38) | 209 | 3191ms |
| python-pygame | openai | 100% (38/38) | 202 | 7165ms |
| vibe | gemini | 100% (38/38) | 161 | 2887ms |
| vibe | openai | 84% (32/38) | 178 | 8378ms |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 52 | 2007ms | - |
| vibe | openai | YES | 60 | 2241ms | - |
| python-pygame | gemini | YES | 110 | 2234ms | - |
| python-pygame | openai | YES | 97 | 2847ms | - |
| lua-love | gemini | YES | 81 | 1807ms | - |
| lua-love | openai | NO | 98 | 2267ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'vibe'  |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 60 | 1589ms | - |
| vibe | openai | YES | 64 | 1556ms | - |
| python-pygame | gemini | YES | 128 | 1737ms | - |
| python-pygame | openai | YES | 114 | 2785ms | - |
| lua-love | gemini | YES | 95 | 1859ms | - |
| lua-love | openai | YES | 81 | 2665ms | - |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 1344ms | - |
| vibe | openai | YES | 25 | 1191ms | - |
| python-pygame | gemini | YES | 93 | 1967ms | - |
| python-pygame | openai | YES | 70 | 1819ms | - |
| lua-love | gemini | YES | 48 | 1191ms | - |
| lua-love | openai | YES | 42 | 1559ms | - |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 76 | 1976ms | - |
| vibe | openai | YES | 90 | 1922ms | - |
| python-pygame | gemini | YES | 147 | 2399ms | - |
| python-pygame | openai | YES | 114 | 4023ms | - |
| lua-love | gemini | YES | 120 | 2343ms | - |
| lua-love | openai | YES | 100 | 2445ms | - |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 73 | 1400ms | - |
| vibe | openai | YES | 78 | 2448ms | - |
| python-pygame | gemini | YES | 131 | 2224ms | - |
| python-pygame | openai | YES | 147 | 3071ms | - |
| lua-love | gemini | YES | 93 | 1909ms | - |
| lua-love | openai | YES | 92 | 2225ms | - |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 118 | 2593ms | - |
| vibe | openai | YES | 146 | 9326ms | - |
| python-pygame | gemini | YES | 170 | 2741ms | - |
| python-pygame | openai | YES | 162 | 3387ms | - |
| lua-love | gemini | YES | 178 | 1945ms | - |
| lua-love | openai | YES | 162 | 3187ms | - |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 138 | 2196ms | - |
| vibe | openai | YES | 142 | 3949ms | - |
| python-pygame | gemini | YES | 176 | 3135ms | - |
| python-pygame | openai | YES | 135 | 3065ms | - |
| lua-love | gemini | YES | 147 | 2781ms | - |
| lua-love | openai | YES | 159 | 3329ms | - |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 124 | 2239ms | - |
| vibe | openai | YES | 140 | 3231ms | - |
| python-pygame | gemini | YES | 185 | 2935ms | - |
| python-pygame | openai | YES | 164 | 4599ms | - |
| lua-love | gemini | YES | 200 | 2565ms | - |
| lua-love | openai | YES | 207 | 3456ms | - |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 108 | 1860ms | - |
| vibe | openai | YES | 124 | 3390ms | - |
| python-pygame | gemini | YES | 166 | 2474ms | - |
| python-pygame | openai | YES | 135 | 3774ms | - |
| lua-love | gemini | YES | 186 | 3126ms | - |
| lua-love | openai | YES | 128 | 2551ms | - |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 39 | 1589ms | - |
| vibe | openai | YES | 42 | 1429ms | - |
| python-pygame | gemini | YES | 93 | 1723ms | - |
| python-pygame | openai | YES | 84 | 1772ms | - |
| lua-love | gemini | YES | 79 | 1869ms | - |
| lua-love | openai | YES | 80 | 2358ms | - |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 101 | 2144ms | - |
| vibe | openai | YES | 122 | 4456ms | - |
| python-pygame | gemini | YES | 187 | 3036ms | - |
| python-pygame | openai | YES | 165 | 10416ms | - |
| lua-love | gemini | YES | 171 | 2674ms | - |
| lua-love | openai | YES | 151 | 3349ms | - |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 140 | 2365ms | - |
| vibe | openai | YES | 132 | 3897ms | - |
| python-pygame | gemini | YES | 177 | 3144ms | - |
| python-pygame | openai | YES | 177 | 3682ms | - |
| lua-love | gemini | YES | 184 | 2607ms | - |
| lua-love | openai | YES | 177 | 3646ms | - |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 195 | 3269ms | - |
| vibe | openai | YES | 284 | 8716ms | - |
| python-pygame | gemini | YES | 224 | 4262ms | - |
| python-pygame | openai | YES | 236 | 5006ms | - |
| lua-love | gemini | YES | 243 | 3267ms | - |
| lua-love | openai | YES | 271 | 8637ms | - |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 147 | 2278ms | - |
| vibe | openai | YES | 146 | 5155ms | - |
| python-pygame | gemini | YES | 178 | 3164ms | - |
| python-pygame | openai | YES | 190 | 3444ms | - |
| lua-love | gemini | YES | 193 | 2962ms | - |
| lua-love | openai | YES | 187 | 3729ms | - |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 174 | 3024ms | - |
| vibe | openai | YES | 173 | 3798ms | - |
| python-pygame | gemini | YES | 221 | 3618ms | - |
| python-pygame | openai | YES | 234 | 7284ms | - |
| lua-love | gemini | YES | 200 | 3537ms | - |
| lua-love | openai | YES | 224 | 5293ms | - |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 179 | 3074ms | - |
| vibe | openai | YES | 193 | 5085ms | - |
| python-pygame | gemini | YES | 184 | 3725ms | - |
| python-pygame | openai | YES | 194 | 5517ms | - |
| lua-love | gemini | YES | 182 | 2555ms | - |
| lua-love | openai | YES | 219 | 5601ms | - |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 212 | 3445ms | - |
| vibe | openai | YES | 330 | 9159ms | - |
| python-pygame | gemini | YES | 228 | 3229ms | - |
| python-pygame | openai | YES | 224 | 4784ms | - |
| lua-love | gemini | YES | 289 | 3524ms | - |
| lua-love | openai | YES | 346 | 6129ms | - |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 288 | 4512ms | - |
| vibe | openai | NO | 301 | 17750ms | expected RBRACKET, got KW_FOR ("for") |
| python-pygame | gemini | YES | 277 | 4043ms | - |
| python-pygame | openai | YES | 271 | 8532ms | - |
| lua-love | gemini | YES | 348 | 4032ms | - |
| lua-love | openai | YES | 428 | 8351ms | - |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 309 | 3824ms | - |
| vibe | openai | YES | 252 | 4798ms | - |
| python-pygame | gemini | YES | 280 | 3308ms | - |
| python-pygame | openai | YES | 250 | 8338ms | - |
| lua-love | gemini | YES | 317 | 3226ms | - |
| lua-love | openai | YES | 330 | 6219ms | - |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 270 | 3218ms | - |
| vibe | openai | YES | 370 | 10388ms | - |
| python-pygame | gemini | YES | 315 | 4736ms | - |
| python-pygame | openai | YES | 430 | 11894ms | - |
| lua-love | gemini | YES | 385 | 4685ms | - |
| lua-love | openai | YES | 452 | 26205ms | - |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 197 | 2857ms | - |
| vibe | openai | NO | 223 | 15572ms | expected RBRACKET, got KW_FOR ("for") |
| python-pygame | gemini | YES | 280 | 4173ms | - |
| python-pygame | openai | YES | 235 | 6708ms | - |
| lua-love | gemini | YES | 284 | 3342ms | - |
| lua-love | openai | YES | 301 | 5859ms | - |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 383 | 4687ms | - |
| vibe | openai | NO | 420 | 23746ms | expected IDENT, got LPAREN ("(") |
| python-pygame | gemini | YES | 365 | 4831ms | - |
| python-pygame | openai | YES | 461 | 13249ms | - |
| lua-love | gemini | YES | 382 | 4578ms | - |
| lua-love | openai | YES | 495 | 9504ms | - |

### Task: debug_hud

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 141 | 2504ms | - |
| vibe | openai | YES | 131 | 7446ms | - |
| python-pygame | gemini | YES | 180 | 2598ms | - |
| python-pygame | openai | YES | 167 | 11950ms | - |
| lua-love | gemini | YES | 174 | 2816ms | - |
| lua-love | openai | YES | 162 | 4639ms | - |

### Task: game_state_manager

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 200 | 2674ms | - |
| vibe | openai | NO | 250 | 20811ms | unexpected token NEWLINE ("") |
| python-pygame | gemini | YES | 278 | 3883ms | - |
| python-pygame | openai | YES | 286 | 8713ms | - |
| lua-love | gemini | YES | 229 | 3020ms | - |
| lua-love | openai | YES | 274 | 8920ms | - |

### Task: combat_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 151 | 2635ms | - |
| vibe | openai | YES | 120 | 2523ms | - |
| python-pygame | gemini | YES | 248 | 3112ms | - |
| python-pygame | openai | YES | 184 | 6126ms | - |
| lua-love | gemini | YES | 160 | 2814ms | - |
| lua-love | openai | YES | 142 | 3018ms | - |

### Task: enemy_wave_loop

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 311 | 3505ms | - |
| vibe | openai | YES | 336 | 10643ms | - |
| python-pygame | gemini | YES | 368 | 4788ms | - |
| python-pygame | openai | YES | 275 | 9428ms | - |
| lua-love | gemini | YES | 366 | 3982ms | - |
| lua-love | openai | YES | 365 | 11852ms | - |

### Task: tic_tac_toe

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 295 | 3629ms | - |
| vibe | openai | YES | 306 | 14215ms | - |
| python-pygame | gemini | YES | 345 | 3866ms | - |
| python-pygame | openai | YES | 350 | 9524ms | - |
| lua-love | gemini | YES | 338 | 3664ms | - |
| lua-love | openai | YES | 327 | 6437ms | - |

### Task: rpg_battle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 192 | 3188ms | - |
| vibe | openai | YES | 271 | 14345ms | - |
| python-pygame | gemini | YES | 269 | 3481ms | - |
| python-pygame | openai | YES | 233 | 6580ms | - |
| lua-love | gemini | YES | 299 | 3436ms | - |
| lua-love | openai | YES | 272 | 5049ms | - |

### Task: particle_emitter_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 136 | 2830ms | - |
| vibe | openai | YES | 198 | 5870ms | - |
| python-pygame | gemini | YES | 194 | 2809ms | - |
| python-pygame | openai | YES | 197 | 8248ms | - |
| lua-love | gemini | YES | 207 | 2965ms | - |
| lua-love | openai | YES | 191 | 4798ms | - |

### Task: highscore_table

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 231 | 3502ms | - |
| vibe | openai | NO | 209 | 25648ms | expected RBRACKET, got COLON (":") |
| python-pygame | gemini | YES | 197 | 3655ms | - |
| python-pygame | openai | YES | 239 | 9756ms | - |
| lua-love | gemini | YES | 214 | 2659ms | - |
| lua-love | openai | YES | 220 | 6317ms | - |

### Task: struct_basic

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 48 | 1729ms | - |
| vibe | openai | YES | 51 | 1526ms | - |
| python-pygame | gemini | YES | 183 | 2646ms | - |
| python-pygame | openai | YES | 123 | 4665ms | - |
| lua-love | gemini | YES | 99 | 1929ms | - |
| lua-love | openai | YES | 133 | 11952ms | - |

### Task: struct_methods

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 120 | 4198ms | - |
| vibe | openai | YES | 107 | 4005ms | - |
| python-pygame | gemini | YES | 214 | 3225ms | - |
| python-pygame | openai | YES | 161 | 6851ms | - |
| lua-love | gemini | YES | 159 | 2224ms | - |
| lua-love | openai | YES | 135 | 3955ms | - |

### Task: enum_state_machine

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 67 | 1904ms | - |
| vibe | openai | YES | 69 | 2222ms | - |
| python-pygame | gemini | YES | 163 | 2447ms | - |
| python-pygame | openai | YES | 159 | 8807ms | - |
| lua-love | gemini | YES | 113 | 1990ms | - |
| lua-love | openai | NO | 157 | 3844ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'vibe'  |

### Task: enum_with_data

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 166 | 5188ms | - |
| vibe | openai | NO | 198 | 23571ms | expected NEWLINE, got LPAREN ("(") |
| python-pygame | gemini | YES | 227 | 3446ms | - |
| python-pygame | openai | YES | 218 | 11036ms | - |
| lua-love | gemini | YES | 203 | 3044ms | - |
| lua-love | openai | NO | 226 | 8148ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'std'  |

### Task: struct_composition

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 130 | 2357ms | - |
| vibe | openai | YES | 150 | 4729ms | - |
| python-pygame | gemini | YES | 226 | 3151ms | - |
| python-pygame | openai | YES | 187 | 22157ms | - |
| lua-love | gemini | YES | 193 | 3092ms | - |
| lua-love | openai | YES | 184 | 8563ms | - |

### Task: trait_drawable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 135 | 2413ms | - |
| vibe | openai | YES | 110 | 2959ms | - |
| python-pygame | gemini | YES | 176 | 3345ms | - |
| python-pygame | openai | YES | 179 | 6786ms | - |
| lua-love | gemini | YES | 154 | 2556ms | - |
| lua-love | openai | YES | 129 | 4261ms | - |

### Task: trait_updatable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 273 | 7911ms | - |
| vibe | openai | YES | 276 | 16681ms | - |
| python-pygame | gemini | YES | 207 | 3344ms | - |
| python-pygame | openai | YES | 239 | 15302ms | - |
| lua-love | gemini | YES | 196 | 2380ms | - |
| lua-love | openai | NO | 352 | 10239ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'Updatable'  |

### Task: struct_list_management

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 99 | 2046ms | - |
| vibe | openai | YES | 115 | 17976ms | - |
| python-pygame | gemini | YES | 168 | 2609ms | - |
| python-pygame | openai | YES | 184 | 6347ms | - |
| lua-love | gemini | YES | 145 | 2394ms | - |
| lua-love | openai | YES | 164 | 5936ms | - |
