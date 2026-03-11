# LLM Code Generation Benchmark Results

**Generated**: 2026-03-11T07:30:50.619Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 100% (38/38) | 206 | 2997ms |
| lua-love | openai | 89% (34/38) | 216 | 5535ms |
| python-pygame | gemini | 100% (38/38) | 205 | 3254ms |
| python-pygame | openai | 100% (38/38) | 206 | 5988ms |
| vibe | gemini | 92% (35/38) | 165 | 3347ms |
| vibe | openai | 76% (29/38) | 174 | 7584ms |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 52 | 1762ms | - |
| vibe | openai | YES | 60 | 1130ms | - |
| python-pygame | gemini | YES | 110 | 2179ms | - |
| python-pygame | openai | YES | 97 | 1777ms | - |
| lua-love | gemini | YES | 78 | 2146ms | - |
| lua-love | openai | NO | 78 | 1790ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'vibe'  |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 60 | 1635ms | - |
| vibe | openai | YES | 64 | 1182ms | - |
| python-pygame | gemini | YES | 128 | 1980ms | - |
| python-pygame | openai | YES | 109 | 3427ms | - |
| lua-love | gemini | YES | 119 | 2189ms | - |
| lua-love | openai | YES | 81 | 1769ms | - |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 1956ms | - |
| vibe | openai | YES | 25 | 1385ms | - |
| python-pygame | gemini | YES | 94 | 2075ms | - |
| python-pygame | openai | YES | 70 | 2195ms | - |
| lua-love | gemini | YES | 51 | 2096ms | - |
| lua-love | openai | YES | 42 | 1925ms | - |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 76 | 1848ms | - |
| vibe | openai | YES | 90 | 1951ms | - |
| python-pygame | gemini | YES | 156 | 2468ms | - |
| python-pygame | openai | YES | 128 | 4514ms | - |
| lua-love | gemini | YES | 120 | 2169ms | - |
| lua-love | openai | YES | 145 | 3353ms | - |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 73 | 1957ms | - |
| vibe | openai | YES | 81 | 2059ms | - |
| python-pygame | gemini | YES | 134 | 2133ms | - |
| python-pygame | openai | YES | 119 | 4390ms | - |
| lua-love | gemini | YES | 92 | 2000ms | - |
| lua-love | openai | YES | 86 | 2346ms | - |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 118 | 2248ms | - |
| vibe | openai | YES | 134 | 2407ms | - |
| python-pygame | gemini | YES | 173 | 2837ms | - |
| python-pygame | openai | YES | 162 | 3021ms | - |
| lua-love | gemini | YES | 176 | 2123ms | - |
| lua-love | openai | YES | 155 | 2657ms | - |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 160 | 2409ms | - |
| vibe | openai | YES | 142 | 4489ms | - |
| python-pygame | gemini | YES | 174 | 2956ms | - |
| python-pygame | openai | YES | 139 | 5862ms | - |
| lua-love | gemini | YES | 147 | 3206ms | - |
| lua-love | openai | YES | 159 | 5193ms | - |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 124 | 2559ms | - |
| vibe | openai | YES | 137 | 3533ms | - |
| python-pygame | gemini | YES | 184 | 2370ms | - |
| python-pygame | openai | YES | 164 | 4543ms | - |
| lua-love | gemini | YES | 200 | 2984ms | - |
| lua-love | openai | YES | 207 | 4186ms | - |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 111 | 2520ms | - |
| vibe | openai | YES | 127 | 4994ms | - |
| python-pygame | gemini | YES | 153 | 2636ms | - |
| python-pygame | openai | YES | 143 | 2554ms | - |
| lua-love | gemini | YES | 185 | 2659ms | - |
| lua-love | openai | YES | 131 | 3246ms | - |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 39 | 1716ms | - |
| vibe | openai | YES | 42 | 1675ms | - |
| python-pygame | gemini | YES | 94 | 2158ms | - |
| python-pygame | openai | YES | 84 | 2024ms | - |
| lua-love | gemini | YES | 79 | 1723ms | - |
| lua-love | openai | YES | 82 | 3167ms | - |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 99 | 2262ms | - |
| vibe | openai | YES | 102 | 2747ms | - |
| python-pygame | gemini | YES | 197 | 3307ms | - |
| python-pygame | openai | YES | 167 | 5240ms | - |
| lua-love | gemini | YES | 150 | 2899ms | - |
| lua-love | openai | YES | 172 | 5678ms | - |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 144 | 2615ms | - |
| vibe | openai | YES | 127 | 3243ms | - |
| python-pygame | gemini | YES | 184 | 3543ms | - |
| python-pygame | openai | YES | 178 | 4671ms | - |
| lua-love | gemini | YES | 184 | 2412ms | - |
| lua-love | openai | YES | 176 | 3722ms | - |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 191 | 2770ms | - |
| vibe | openai | YES | 206 | 10540ms | - |
| python-pygame | gemini | YES | 214 | 3299ms | - |
| python-pygame | openai | YES | 232 | 8355ms | - |
| lua-love | gemini | YES | 241 | 3509ms | - |
| lua-love | openai | YES | 268 | 7598ms | - |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 153 | 2247ms | - |
| vibe | openai | YES | 181 | 4926ms | - |
| python-pygame | gemini | YES | 177 | 2671ms | - |
| python-pygame | openai | YES | 189 | 5196ms | - |
| lua-love | gemini | YES | 193 | 3096ms | - |
| lua-love | openai | YES | 184 | 3415ms | - |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 174 | 2235ms | - |
| vibe | openai | YES | 176 | 5355ms | - |
| python-pygame | gemini | YES | 224 | 3624ms | - |
| python-pygame | openai | YES | 256 | 8939ms | - |
| lua-love | gemini | YES | 200 | 3943ms | - |
| lua-love | openai | YES | 210 | 7005ms | - |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 177 | 2339ms | - |
| vibe | openai | YES | 158 | 5021ms | - |
| python-pygame | gemini | YES | 192 | 2878ms | - |
| python-pygame | openai | YES | 185 | 4741ms | - |
| lua-love | gemini | YES | 192 | 2816ms | - |
| lua-love | openai | YES | 211 | 4809ms | - |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 206 | 2987ms | - |
| vibe | openai | YES | 261 | 6295ms | - |
| python-pygame | gemini | YES | 228 | 3184ms | - |
| python-pygame | openai | YES | 223 | 4691ms | - |
| lua-love | gemini | YES | 271 | 3152ms | - |
| lua-love | openai | YES | 333 | 7965ms | - |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 321 | 4629ms | - |
| vibe | openai | YES | 332 | 10704ms | - |
| python-pygame | gemini | YES | 277 | 4032ms | - |
| python-pygame | openai | YES | 265 | 19272ms | - |
| lua-love | gemini | YES | 359 | 4670ms | - |
| lua-love | openai | YES | 380 | 9913ms | - |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 309 | 3525ms | - |
| vibe | openai | YES | 243 | 8091ms | - |
| python-pygame | gemini | YES | 284 | 3244ms | - |
| python-pygame | openai | YES | 246 | 5478ms | - |
| lua-love | gemini | YES | 309 | 3663ms | - |
| lua-love | openai | YES | 329 | 12834ms | - |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 199 | 3410ms | - |
| vibe | openai | YES | 347 | 10937ms | - |
| python-pygame | gemini | YES | 310 | 4894ms | - |
| python-pygame | openai | YES | 424 | 12224ms | - |
| lua-love | gemini | YES | 436 | 4591ms | - |
| lua-love | openai | YES | 450 | 11481ms | - |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 197 | 6230ms | - |
| vibe | openai | NO | 243 | 12542ms | expected RBRACKET, got KW_FOR ("for") |
| python-pygame | gemini | YES | 270 | 4356ms | - |
| python-pygame | openai | YES | 222 | 10369ms | - |
| lua-love | gemini | YES | 293 | 3494ms | - |
| lua-love | openai | YES | 296 | 7348ms | - |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 451 | 4649ms | - |
| vibe | openai | NO | 436 | 27972ms | unexpected token RBRACKET ("]") |
| python-pygame | gemini | YES | 374 | 4555ms | - |
| python-pygame | openai | YES | 438 | 9848ms | - |
| lua-love | gemini | YES | 386 | 3580ms | - |
| lua-love | openai | YES | 467 | 13781ms | - |

### Task: debug_hud

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 141 | 2451ms | - |
| vibe | openai | YES | 129 | 4259ms | - |
| python-pygame | gemini | YES | 179 | 3227ms | - |
| python-pygame | openai | YES | 168 | 4625ms | - |
| lua-love | gemini | YES | 174 | 2771ms | - |
| lua-love | openai | YES | 162 | 5217ms | - |

### Task: game_state_manager

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 200 | 2955ms | - |
| vibe | openai | YES | 230 | 5790ms | - |
| python-pygame | gemini | YES | 228 | 4036ms | - |
| python-pygame | openai | YES | 312 | 7311ms | - |
| lua-love | gemini | YES | 255 | 3273ms | - |
| lua-love | openai | YES | 260 | 6824ms | - |

### Task: combat_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 170 | 2913ms | - |
| vibe | openai | YES | 143 | 3889ms | - |
| python-pygame | gemini | YES | 197 | 4096ms | - |
| python-pygame | openai | YES | 213 | 5405ms | - |
| lua-love | gemini | YES | 213 | 3321ms | - |
| lua-love | openai | YES | 153 | 3237ms | - |

### Task: enemy_wave_loop

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 357 | 4531ms | - |
| vibe | openai | NO | 379 | 19691ms | expected RBRACKET, got KW_FOR ("for") |
| python-pygame | gemini | YES | 355 | 4957ms | - |
| python-pygame | openai | YES | 271 | 9706ms | - |
| lua-love | gemini | YES | 378 | 4193ms | - |
| lua-love | openai | YES | 392 | 7401ms | - |

### Task: tic_tac_toe

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 295 | 4220ms | - |
| vibe | openai | YES | 298 | 15785ms | - |
| python-pygame | gemini | YES | 286 | 4056ms | - |
| python-pygame | openai | YES | 418 | 10278ms | - |
| lua-love | gemini | YES | 370 | 4542ms | - |
| lua-love | openai | YES | 363 | 9701ms | - |

### Task: rpg_battle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 207 | 3722ms | - |
| vibe | openai | YES | 268 | 14025ms | - |
| python-pygame | gemini | YES | 265 | 3805ms | - |
| python-pygame | openai | YES | 269 | 9867ms | - |
| lua-love | gemini | YES | 292 | 3589ms | - |
| lua-love | openai | YES | 257 | 5021ms | - |

### Task: particle_emitter_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 136 | 2373ms | - |
| vibe | openai | YES | 188 | 6667ms | - |
| python-pygame | gemini | YES | 190 | 2858ms | - |
| python-pygame | openai | YES | 202 | 5377ms | - |
| lua-love | gemini | YES | 205 | 2897ms | - |
| lua-love | openai | YES | 204 | 4155ms | - |

### Task: highscore_table

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 213 | 3211ms | - |
| vibe | openai | NO | 221 | 21110ms | expected RBRACKET, got COLON (":") |
| python-pygame | gemini | YES | 198 | 3535ms | - |
| python-pygame | openai | YES | 255 | 5895ms | - |
| lua-love | gemini | YES | 214 | 3855ms | - |
| lua-love | openai | YES | 225 | 7737ms | - |

### Task: struct_basic

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 48 | 1739ms | - |
| vibe | openai | YES | 51 | 1857ms | - |
| python-pygame | gemini | YES | 183 | 3046ms | - |
| python-pygame | openai | YES | 123 | 2190ms | - |
| lua-love | gemini | YES | 99 | 2096ms | - |
| lua-love | openai | YES | 109 | 2442ms | - |

### Task: struct_methods

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 96 | 4147ms | - |
| vibe | openai | NO | 135 | 8229ms | unexpected token INDENT ("") |
| python-pygame | gemini | YES | 214 | 3344ms | - |
| python-pygame | openai | YES | 161 | 4076ms | - |
| lua-love | gemini | YES | 150 | 2595ms | - |
| lua-love | openai | YES | 135 | 4891ms | - |

### Task: enum_state_machine

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 67 | 1733ms | - |
| vibe | openai | YES | 69 | 1763ms | - |
| python-pygame | gemini | YES | 163 | 2654ms | - |
| python-pygame | openai | YES | 163 | 3655ms | - |
| lua-love | gemini | YES | 121 | 2121ms | - |
| lua-love | openai | NO | 149 | 3511ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'vibe'  |

### Task: enum_with_data

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 212 | 8419ms | expected NEWLINE, got IDENT ("ParticleType") |
| vibe | openai | NO | 170 | 13239ms | expected NEWLINE, got LPAREN ("(") |
| python-pygame | gemini | YES | 241 | 3573ms | - |
| python-pygame | openai | YES | 229 | 6668ms | - |
| lua-love | gemini | YES | 203 | 2762ms | - |
| lua-love | openai | NO | 215 | 6369ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'vibe'  |

### Task: struct_composition

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 130 | 2560ms | - |
| vibe | openai | YES | 108 | 3714ms | - |
| python-pygame | gemini | YES | 221 | 3414ms | - |
| python-pygame | openai | YES | 184 | 3982ms | - |
| lua-love | gemini | YES | 177 | 2561ms | - |
| lua-love | openai | YES | 184 | 3537ms | - |

### Task: trait_drawable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 158 | 7141ms | unexpected token INDENT ("") |
| vibe | openai | NO | 110 | 7691ms | unexpected token INDENT ("") |
| python-pygame | gemini | YES | 176 | 3392ms | - |
| python-pygame | openai | YES | 183 | 3977ms | - |
| lua-love | gemini | YES | 154 | 2638ms | - |
| lua-love | openai | YES | 238 | 3557ms | - |

### Task: trait_updatable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 267 | 12453ms | unexpected token INDENT ("") |
| vibe | openai | NO | 276 | 18185ms | unexpected token INDENT ("") |
| python-pygame | gemini | YES | 209 | 3379ms | - |
| python-pygame | openai | YES | 238 | 6071ms | - |
| lua-love | gemini | YES | 220 | 3007ms | - |
| lua-love | openai | NO | 358 | 6725ms | luac: /tmp/vibe_benchmark_test.lua:1: syntax error near 'Updatable'  |

### Task: struct_list_management

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 103 | 2118ms | - |
| vibe | openai | NO | 121 | 9136ms | expected RPAREN, got EQ ("=") |
| python-pygame | gemini | YES | 168 | 2892ms | - |
| python-pygame | openai | YES | 183 | 5142ms | - |
| lua-love | gemini | YES | 145 | 2559ms | - |
| lua-love | openai | YES | 164 | 4837ms | - |
