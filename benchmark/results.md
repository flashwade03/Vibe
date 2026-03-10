# LLM Code Generation Benchmark Results

**Generated**: 2026-03-10T05:38:14.927Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 34% (17/50) | 45 | 7216ms |
| lua-love | openai | 100% (50/50) | 220 | 6945ms |
| python-pygame | gemini | 28% (14/50) | 54 | 8561ms |
| python-pygame | openai | 98% (49/50) | 234 | 5182ms |
| vibe | claude | **100% (50/50)** | 201 | - |
| vibe | gemini | 36% (18/50)* | 45 | 0ms |
| vibe | openai | 96% (48/50) | 191 | 0ms |

*Gemini 429 rate limit: ~18 tasks 완료 후 쿼타 소진. 완료된 18개 중 Vibe 100%. 재실행 필요.

### Claude Vibe Benchmark (Sub-agent, 50 tasks)

Claude Opus 4.6 서브에이전트로 실행. Vibe 시스템 프롬프트만 제공, API 레이턴시 미측정. 재시도 0건.

| Task | Pass | Tokens |
|------|------|--------|
| move_rectangle | YES | 60 |
| bouncing_ball | YES | 64 |
| score_counter | YES | 25 |
| color_changing_rect | YES | 72 |
| enemy_follow | YES | 130 |
| shooting | YES | 92 |
| circle_collision | YES | 135 |
| gravity_jump | YES | 94 |
| countdown_timer | YES | 41 |
| particle_burst | YES | 120 |
| state_machine_game | YES | 176 |
| snake_movement | YES | 195 |
| multi_wave_spawner | YES | 371 |
| orbital_mechanics | YES | 106 |
| breakout_game | YES | 219 |
| twin_stick_dodge | YES | 335 |
| flocking_simulation | YES | 262 |
| platformer_level | YES | 212 |
| minimap_radar | YES | 204 |
| chain_reaction | YES | 227 |
| fading_text | YES | 36 |
| mouse_follower | YES | 71 |
| keyboard_display | YES | 44 |
| simple_animation | YES | 79 |
| health_bar | YES | 99 |
| screen_shake | YES | 126 |
| waypoint_patrol | YES | 132 |
| expanding_rings | YES | 93 |
| typewriter_text | YES | 113 |
| asteroid_field | YES | 183 |
| color_pulse | YES | 76 |
| grid_highlight | YES | 153 |
| pong_game | YES | 267 |
| space_invaders | YES | 345 |
| bezier_curves | YES | 262 |
| verlet_rope | YES | 349 |
| cellular_automata | YES | 370 |
| bullet_hell_pattern | YES | 242 |
| aabb_physics | YES | 272 |
| inventory_grid | YES | 265 |
| procedural_terrain | YES | 180 |
| heat_diffusion | YES | 304 |
| asteroids_game | YES | 506 |
| rhythm_game | YES | 285 |
| fractal_tree | YES | 305 |
| tower_defense_path | YES | 561 |
| spring_physics | YES | 313 |
| pathfinding_viz | YES | 507 |
| pendulum_simulation | YES | 140 |
| particle_gravity_well | YES | 213 |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 60 | 0ms | - |
| vibe | openai | YES | 52 | 0ms | - |
| python-pygame | gemini | YES | 88 | 14221ms | - |
| python-pygame | openai | YES | 95 | 2577ms | - |
| lua-love | gemini | YES | 77 | 13235ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 74 | 2678ms | Warning: luac/luajit not found, syntax not verified |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 73 | 0ms | - |
| vibe | openai | YES | 64 | 0ms | - |
| python-pygame | gemini | YES | 122 | 11868ms | - |
| python-pygame | openai | YES | 116 | 4924ms | - |
| lua-love | gemini | YES | 109 | 10638ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 85 | 2199ms | Warning: luac/luajit not found, syntax not verified |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 0ms | - |
| vibe | openai | YES | 25 | 0ms | - |
| python-pygame | gemini | YES | 75 | 11457ms | - |
| python-pygame | openai | YES | 81 | 1854ms | - |
| lua-love | gemini | YES | 46 | 9196ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 40 | 1544ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_changing_rect

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 72 | 0ms | - |
| vibe | openai | YES | 72 | 0ms | - |
| python-pygame | gemini | YES | 133 | 21101ms | - |
| python-pygame | openai | YES | 120 | 3307ms | - |
| lua-love | gemini | YES | 94 | 22392ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 86 | 1919ms | Warning: luac/luajit not found, syntax not verified |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 0ms | - |
| vibe | openai | YES | 137 | 0ms | - |
| python-pygame | gemini | YES | 154 | 17586ms | - |
| python-pygame | openai | YES | 172 | 2384ms | - |
| lua-love | gemini | YES | 179 | 20424ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 177 | 3169ms | Warning: luac/luajit not found, syntax not verified |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 92 | 0ms | - |
| vibe | openai | YES | 97 | 0ms | - |
| python-pygame | gemini | YES | 119 | 21680ms | - |
| python-pygame | openai | YES | 140 | 5372ms | - |
| lua-love | gemini | YES | 138 | 19558ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 2444ms | Warning: luac/luajit not found, syntax not verified |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 145 | 0ms | - |
| vibe | openai | YES | 136 | 0ms | - |
| python-pygame | gemini | YES | 176 | 22989ms | - |
| python-pygame | openai | YES | 194 | 3197ms | - |
| lua-love | gemini | YES | 179 | 15164ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 169 | 4282ms | Warning: luac/luajit not found, syntax not verified |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 99 | 0ms | - |
| vibe | openai | YES | 86 | 0ms | - |
| python-pygame | gemini | YES | 123 | 20303ms | - |
| python-pygame | openai | YES | 116 | 1832ms | - |
| lua-love | gemini | YES | 104 | 12376ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 118 | 2116ms | Warning: luac/luajit not found, syntax not verified |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 34 | 0ms | - |
| vibe | openai | YES | 41 | 0ms | - |
| python-pygame | gemini | YES | 84 | 15326ms | - |
| python-pygame | openai | YES | 94 | 2039ms | - |
| lua-love | gemini | YES | 45 | 14552ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 54 | 1478ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_burst

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 0ms | - |
| vibe | openai | YES | 132 | 0ms | - |
| python-pygame | gemini | YES | 137 | 32995ms | - |
| python-pygame | openai | YES | 147 | 4337ms | - |
| lua-love | gemini | YES | 131 | 23278ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 148 | 3611ms | Warning: luac/luajit not found, syntax not verified |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 180 | 0ms | - |
| vibe | openai | YES | 172 | 0ms | - |
| python-pygame | gemini | YES | 235 | 23525ms | - |
| python-pygame | openai | YES | 226 | 5476ms | - |
| lua-love | gemini | YES | 208 | 18958ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 192 | 2994ms | Warning: luac/luajit not found, syntax not verified |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 192 | 0ms | - |
| vibe | openai | YES | 187 | 0ms | - |
| python-pygame | gemini | YES | 204 | 31523ms | - |
| python-pygame | openai | YES | 206 | 4799ms | - |
| lua-love | gemini | YES | 196 | 22190ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 199 | 5418ms | Warning: luac/luajit not found, syntax not verified |

### Task: multi_wave_spawner

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 73 | 0ms | - |
| vibe | openai | NO | 350 | 0ms | expected EQ, got NEWLINE ("") |
| python-pygame | gemini | NO | 61 | 36300ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 361 | 7567ms | - |
| lua-love | gemini | YES | 71 | 37272ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 392 | 6472ms | Warning: luac/luajit not found, syntax not verified |

### Task: orbital_mechanics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 106 | 0ms | - |
| vibe | openai | YES | 101 | 0ms | - |
| python-pygame | gemini | YES | 148 | 17871ms | - |
| python-pygame | openai | YES | 146 | 6563ms | - |
| lua-love | gemini | YES | 142 | 17349ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 163 | 3501ms | Warning: luac/luajit not found, syntax not verified |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 185 | 0ms | - |
| vibe | openai | YES | 207 | 0ms | - |
| python-pygame | gemini | NO | 261 | 31882ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 299 | 10879ms | - |
| lua-love | gemini | YES | 265 | 33858ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 325 | 5171ms | Warning: luac/luajit not found, syntax not verified |

### Task: twin_stick_dodge

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 72 | 0ms | - |
| vibe | openai | YES | 304 | 0ms | - |
| python-pygame | gemini | NO | 200 | 36805ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 349 | 7951ms | - |
| lua-love | gemini | YES | 159 | 35115ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 342 | 6188ms | Warning: luac/luajit not found, syntax not verified |

### Task: flocking_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 298 | 0ms | - |
| vibe | openai | YES | 263 | 0ms | - |
| python-pygame | gemini | YES | 196 | 27453ms | - |
| python-pygame | openai | YES | 250 | 5207ms | - |
| lua-love | gemini | YES | 103 | 35266ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 298 | 5415ms | Warning: luac/luajit not found, syntax not verified |

### Task: platformer_level

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 216 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 267 | 6057ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 269 | 128365ms | Warning: luac/luajit not found, syntax not verified |

### Task: minimap_radar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 215 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 260 | 8796ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 256 | 6012ms | Warning: luac/luajit not found, syntax not verified |

### Task: chain_reaction

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 263 | 0ms | - |
| vibe | openai | YES | 245 | 0ms | - |
| python-pygame | gemini | NO | 195 | 33170ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | NO | 255 | 4605ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 220 | 4645ms | Warning: luac/luajit not found, syntax not verified |

### Task: fading_text

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 36 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 87 | 1931ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 75 | 1954ms | Warning: luac/luajit not found, syntax not verified |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 71 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 133 | 3254ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 85 | 2167ms | Warning: luac/luajit not found, syntax not verified |

### Task: keyboard_display

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 42 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 121 | 2321ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 52 | 2252ms | Warning: luac/luajit not found, syntax not verified |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 76 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 138 | 2818ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 99 | 1980ms | Warning: luac/luajit not found, syntax not verified |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 99 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 170 | 3311ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 151 | 2569ms | Warning: luac/luajit not found, syntax not verified |

### Task: screen_shake

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 115 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 190 | 4270ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 129 | 3421ms | Warning: luac/luajit not found, syntax not verified |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 132 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 190 | 8279ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 149 | 2466ms | Warning: luac/luajit not found, syntax not verified |

### Task: expanding_rings

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 93 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 122 | 4291ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 111 | 3084ms | Warning: luac/luajit not found, syntax not verified |

### Task: typewriter_text

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 113 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 175 | 4131ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 127 | 3970ms | Warning: luac/luajit not found, syntax not verified |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 164 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 207 | 4729ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 238 | 6368ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_pulse

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 74 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 116 | 3820ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 85 | 1790ms | Warning: luac/luajit not found, syntax not verified |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 144 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 196 | 3806ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 152 | 3837ms | Warning: luac/luajit not found, syntax not verified |

### Task: pong_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 286 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 293 | 7106ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 306 | 16821ms | Warning: luac/luajit not found, syntax not verified |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | NO | 321 | 0ms | expected top-level declaration (fn, let, const), got IDENT ("load") |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 338 | 7488ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 351 | 6355ms | Warning: luac/luajit not found, syntax not verified |

### Task: bezier_curves

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 257 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 319 | 3928ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 321 | 5077ms | Warning: luac/luajit not found, syntax not verified |

### Task: verlet_rope

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 312 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 336 | 5328ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 351 | 8823ms | Warning: luac/luajit not found, syntax not verified |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 350 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 426 | 6448ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 403 | 5678ms | Warning: luac/luajit not found, syntax not verified |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 226 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 260 | 4041ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 256 | 5623ms | Warning: luac/luajit not found, syntax not verified |

### Task: aabb_physics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 264 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 310 | 6276ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 282 | 9334ms | Warning: luac/luajit not found, syntax not verified |

### Task: inventory_grid

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 275 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 321 | 4960ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 283 | 3604ms | Warning: luac/luajit not found, syntax not verified |

### Task: procedural_terrain

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 172 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 232 | 3921ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 210 | 3882ms | Warning: luac/luajit not found, syntax not verified |

### Task: heat_diffusion

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 288 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 317 | 7634ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 331 | 3663ms | Warning: luac/luajit not found, syntax not verified |

### Task: asteroids_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 456 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 498 | 9596ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 525 | 7520ms | Warning: luac/luajit not found, syntax not verified |

### Task: rhythm_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 273 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 328 | 7000ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 302 | 4308ms | Warning: luac/luajit not found, syntax not verified |

### Task: fractal_tree

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 303 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 256 | 4916ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 244 | 3904ms | Warning: luac/luajit not found, syntax not verified |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 521 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 458 | 11424ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 512 | 10225ms | Warning: luac/luajit not found, syntax not verified |

### Task: spring_physics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 273 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 311 | 5080ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 314 | 5070ms | Warning: luac/luajit not found, syntax not verified |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 397 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 471 | 10444ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 451 | 5841ms | Warning: luac/luajit not found, syntax not verified |

### Task: pendulum_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 134 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 227 | 3420ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 151 | 2395ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_gravity_well

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| vibe | openai | YES | 205 | 0ms | - |
| python-pygame | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| python-pygame | openai | YES | 249 | 3389ms | - |
| lua-love | gemini | NO | 0 | 0ms | API error: Gemini API error (429): {   "error": {     "code": 429,     "message" |
| lua-love | openai | YES | 227 | 3648ms | Warning: luac/luajit not found, syntax not verified |
