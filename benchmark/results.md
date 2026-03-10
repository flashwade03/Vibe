# LLM Code Generation Benchmark Results

**Generated**: 2026-03-10T08:19:11.326Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 100% (50/50) | 220 | 3245ms |
| lua-love | openai | 100% (50/50) | 221 | 5761ms |
| python-pygame | gemini | 100% (50/50) | 230 | 3389ms |
| python-pygame | openai | 100% (50/50) | 237 | 6942ms |
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | 100% (50/50) | 191 | 2954ms |
| vibe | openai | 96% (48/50) | 195 | 5014ms |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 52 | 2106ms | - |
| vibe | openai | YES | 60 | 1901ms | - |
| vibe | claude | YES | 60 | 0ms | - |
| python-pygame | gemini | YES | 125 | 2566ms | - |
| python-pygame | openai | YES | 96 | 1909ms | - |
| lua-love | gemini | YES | 81 | 2376ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 74 | 2204ms | Warning: luac/luajit not found, syntax not verified |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 73 | 1857ms | - |
| vibe | openai | YES | 64 | 1373ms | - |
| vibe | claude | YES | 64 | 0ms | - |
| python-pygame | gemini | YES | 138 | 2115ms | - |
| python-pygame | openai | YES | 115 | 3337ms | - |
| lua-love | gemini | YES | 119 | 2152ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 85 | 1913ms | Warning: luac/luajit not found, syntax not verified |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 1463ms | - |
| vibe | openai | YES | 25 | 787ms | - |
| vibe | claude | YES | 25 | 0ms | - |
| python-pygame | gemini | YES | 84 | 2337ms | - |
| python-pygame | openai | YES | 81 | 2444ms | - |
| lua-love | gemini | YES | 40 | 1772ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 40 | 2248ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_changing_rect

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 64 | 1933ms | - |
| vibe | openai | YES | 72 | 1839ms | - |
| vibe | claude | YES | 72 | 0ms | - |
| python-pygame | gemini | YES | 142 | 2594ms | - |
| python-pygame | openai | YES | 117 | 3371ms | - |
| lua-love | gemini | YES | 94 | 6979ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 86 | 1629ms | Warning: luac/luajit not found, syntax not verified |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 128 | 1826ms | - |
| vibe | openai | YES | 137 | 2377ms | - |
| vibe | claude | YES | 130 | 0ms | - |
| python-pygame | gemini | YES | 177 | 2689ms | - |
| python-pygame | openai | YES | 179 | 4281ms | - |
| lua-love | gemini | YES | 176 | 3269ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 178 | 3026ms | Warning: luac/luajit not found, syntax not verified |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 95 | 6874ms | - |
| vibe | openai | YES | 97 | 3187ms | - |
| vibe | claude | YES | 92 | 0ms | - |
| python-pygame | gemini | YES | 171 | 3420ms | - |
| python-pygame | openai | YES | 149 | 4517ms | - |
| lua-love | gemini | YES | 143 | 2211ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 2998ms | Warning: luac/luajit not found, syntax not verified |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 132 | 2173ms | - |
| vibe | openai | YES | 128 | 3612ms | - |
| vibe | claude | YES | 130 | 0ms | - |
| python-pygame | gemini | YES | 190 | 3496ms | - |
| python-pygame | openai | YES | 200 | 4978ms | - |
| lua-love | gemini | YES | 159 | 2730ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 169 | 3369ms | Warning: luac/luajit not found, syntax not verified |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 94 | 2400ms | - |
| vibe | openai | YES | 94 | 2857ms | - |
| vibe | claude | YES | 94 | 0ms | - |
| python-pygame | gemini | YES | 148 | 2811ms | - |
| python-pygame | openai | YES | 116 | 1856ms | - |
| lua-love | gemini | YES | 133 | 2445ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 1807ms | Warning: luac/luajit not found, syntax not verified |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 39 | 3615ms | - |
| vibe | openai | YES | 41 | 1325ms | - |
| vibe | claude | YES | 41 | 0ms | - |
| python-pygame | gemini | YES | 98 | 1863ms | - |
| python-pygame | openai | YES | 94 | 1898ms | - |
| lua-love | gemini | YES | 51 | 1402ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 54 | 1908ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_burst

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 122 | 2319ms | - |
| vibe | openai | YES | 142 | 3208ms | - |
| vibe | claude | YES | 120 | 0ms | - |
| python-pygame | gemini | YES | 168 | 2668ms | - |
| python-pygame | openai | YES | 169 | 6856ms | - |
| lua-love | gemini | YES | 138 | 2775ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 145 | 4208ms | Warning: luac/luajit not found, syntax not verified |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 164 | 2760ms | - |
| vibe | openai | YES | 172 | 3337ms | - |
| vibe | claude | YES | 176 | 0ms | - |
| python-pygame | gemini | YES | 234 | 3034ms | - |
| python-pygame | openai | YES | 227 | 6294ms | - |
| lua-love | gemini | YES | 197 | 3169ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 195 | 4121ms | Warning: luac/luajit not found, syntax not verified |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 194 | 3011ms | - |
| vibe | openai | YES | 187 | 6201ms | - |
| vibe | claude | YES | 195 | 0ms | - |
| python-pygame | gemini | YES | 224 | 3237ms | - |
| python-pygame | openai | YES | 200 | 5327ms | - |
| lua-love | gemini | YES | 211 | 3258ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 203 | 4292ms | Warning: luac/luajit not found, syntax not verified |

### Task: multi_wave_spawner

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 348 | 3856ms | - |
| vibe | openai | NO | 352 | 19030ms | expected EQ, got NEWLINE ("") |
| vibe | claude | YES | 364 | 0ms | - |
| python-pygame | gemini | YES | 301 | 3518ms | - |
| python-pygame | openai | YES | 358 | 10716ms | - |
| lua-love | gemini | YES | 313 | 4413ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 422 | 7980ms | Warning: luac/luajit not found, syntax not verified |

### Task: orbital_mechanics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 124 | 2515ms | - |
| vibe | openai | YES | 103 | 2770ms | - |
| vibe | claude | YES | 106 | 0ms | - |
| python-pygame | gemini | YES | 166 | 3653ms | - |
| python-pygame | openai | YES | 167 | 4550ms | - |
| lua-love | gemini | YES | 153 | 2593ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 165 | 3934ms | Warning: luac/luajit not found, syntax not verified |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 216 | 3144ms | - |
| vibe | openai | YES | 268 | 6530ms | - |
| vibe | claude | YES | 226 | 0ms | - |
| python-pygame | gemini | YES | 286 | 4367ms | - |
| python-pygame | openai | YES | 301 | 7404ms | - |
| lua-love | gemini | YES | 301 | 3020ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 264 | 3766ms | Warning: luac/luajit not found, syntax not verified |

### Task: twin_stick_dodge

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 298 | 3267ms | - |
| vibe | openai | YES | 303 | 8743ms | - |
| vibe | claude | YES | 322 | 0ms | - |
| python-pygame | gemini | YES | 305 | 3928ms | - |
| python-pygame | openai | YES | 322 | 9170ms | - |
| lua-love | gemini | YES | 312 | 3154ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 354 | 13243ms | Warning: luac/luajit not found, syntax not verified |

### Task: flocking_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 263 | 3920ms | - |
| vibe | openai | YES | 267 | 7012ms | - |
| vibe | claude | YES | 266 | 0ms | - |
| python-pygame | gemini | YES | 223 | 3249ms | - |
| python-pygame | openai | YES | 269 | 7230ms | - |
| lua-love | gemini | YES | 286 | 3273ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 311 | 5392ms | Warning: luac/luajit not found, syntax not verified |

### Task: platformer_level

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 210 | 2868ms | - |
| vibe | openai | YES | 216 | 6529ms | - |
| vibe | claude | YES | 208 | 0ms | - |
| python-pygame | gemini | YES | 290 | 4003ms | - |
| python-pygame | openai | YES | 266 | 7347ms | - |
| lua-love | gemini | YES | 264 | 3421ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 266 | 6227ms | Warning: luac/luajit not found, syntax not verified |

### Task: minimap_radar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 223 | 3019ms | - |
| vibe | openai | YES | 201 | 3944ms | - |
| vibe | claude | YES | 204 | 0ms | - |
| python-pygame | gemini | YES | 272 | 4282ms | - |
| python-pygame | openai | YES | 279 | 16467ms | - |
| lua-love | gemini | YES | 266 | 4140ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 256 | 5932ms | Warning: luac/luajit not found, syntax not verified |

### Task: chain_reaction

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 209 | 2689ms | - |
| vibe | openai | YES | 245 | 9001ms | - |
| vibe | claude | YES | 222 | 0ms | - |
| python-pygame | gemini | YES | 241 | 3550ms | - |
| python-pygame | openai | YES | 227 | 6641ms | - |
| lua-love | gemini | YES | 242 | 3309ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 215 | 3527ms | Warning: luac/luajit not found, syntax not verified |

### Task: fading_text

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 36 | 1490ms | - |
| vibe | openai | YES | 34 | 979ms | - |
| vibe | claude | YES | 36 | 0ms | - |
| python-pygame | gemini | YES | 100 | 2249ms | - |
| python-pygame | openai | YES | 86 | 2310ms | - |
| lua-love | gemini | YES | 44 | 1404ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 67 | 1903ms | Warning: luac/luajit not found, syntax not verified |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 71 | 1816ms | - |
| vibe | openai | YES | 71 | 1476ms | - |
| vibe | claude | YES | 71 | 0ms | - |
| python-pygame | gemini | YES | 144 | 2750ms | - |
| python-pygame | openai | YES | 134 | 3311ms | - |
| lua-love | gemini | YES | 84 | 2039ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 85 | 2517ms | Warning: luac/luajit not found, syntax not verified |

### Task: keyboard_display

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 44 | 1589ms | - |
| vibe | openai | YES | 42 | 1594ms | - |
| vibe | claude | YES | 44 | 0ms | - |
| python-pygame | gemini | YES | 123 | 2293ms | - |
| python-pygame | openai | YES | 115 | 3920ms | - |
| lua-love | gemini | YES | 54 | 1833ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 78 | 2160ms | Warning: luac/luajit not found, syntax not verified |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 76 | 2010ms | - |
| vibe | openai | YES | 76 | 1840ms | - |
| vibe | claude | YES | 82 | 0ms | - |
| python-pygame | gemini | YES | 140 | 2423ms | - |
| python-pygame | openai | YES | 136 | 4568ms | - |
| lua-love | gemini | YES | 98 | 2285ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 99 | 2854ms | Warning: luac/luajit not found, syntax not verified |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 99 | 1678ms | - |
| vibe | openai | YES | 124 | 5868ms | - |
| vibe | claude | YES | 99 | 0ms | - |
| python-pygame | gemini | YES | 179 | 3277ms | - |
| python-pygame | openai | YES | 185 | 5376ms | - |
| lua-love | gemini | YES | 144 | 2791ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 152 | 4351ms | Warning: luac/luajit not found, syntax not verified |

### Task: screen_shake

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 115 | 3191ms | - |
| vibe | openai | YES | 119 | 2876ms | - |
| vibe | claude | YES | 122 | 0ms | - |
| python-pygame | gemini | YES | 199 | 2974ms | - |
| python-pygame | openai | YES | 177 | 4384ms | - |
| lua-love | gemini | YES | 140 | 2535ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 133 | 3030ms | Warning: luac/luajit not found, syntax not verified |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 132 | 2215ms | - |
| vibe | openai | YES | 132 | 3137ms | - |
| vibe | claude | YES | 132 | 0ms | - |
| python-pygame | gemini | YES | 179 | 2616ms | - |
| python-pygame | openai | YES | 175 | 3891ms | - |
| lua-love | gemini | YES | 165 | 2644ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 142 | 7176ms | Warning: luac/luajit not found, syntax not verified |

### Task: expanding_rings

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 93 | 2062ms | - |
| vibe | openai | YES | 93 | 2274ms | - |
| vibe | claude | YES | 93 | 0ms | - |
| python-pygame | gemini | YES | 131 | 2607ms | - |
| python-pygame | openai | YES | 135 | 3672ms | - |
| lua-love | gemini | YES | 111 | 1968ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 111 | 2768ms | Warning: luac/luajit not found, syntax not verified |

### Task: typewriter_text

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 113 | 2142ms | - |
| vibe | openai | YES | 113 | 1594ms | - |
| vibe | claude | YES | 113 | 0ms | - |
| python-pygame | gemini | YES | 193 | 2879ms | - |
| python-pygame | openai | YES | 184 | 10405ms | - |
| lua-love | gemini | YES | 169 | 2857ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 128 | 2521ms | Warning: luac/luajit not found, syntax not verified |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 173 | 2629ms | - |
| vibe | openai | YES | 164 | 4643ms | - |
| vibe | claude | YES | 183 | 0ms | - |
| python-pygame | gemini | YES | 222 | 3525ms | - |
| python-pygame | openai | YES | 216 | 6667ms | - |
| lua-love | gemini | YES | 241 | 3336ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 236 | 3215ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_pulse

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 74 | 1320ms | - |
| vibe | openai | YES | 74 | 1073ms | - |
| vibe | claude | YES | 76 | 0ms | - |
| python-pygame | gemini | YES | 123 | 2368ms | - |
| python-pygame | openai | YES | 118 | 4189ms | - |
| lua-love | gemini | YES | 84 | 1759ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 85 | 1358ms | Warning: luac/luajit not found, syntax not verified |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 153 | 2194ms | - |
| vibe | openai | YES | 144 | 1686ms | - |
| vibe | claude | YES | 153 | 0ms | - |
| python-pygame | gemini | YES | 199 | 2988ms | - |
| python-pygame | openai | YES | 190 | 5022ms | - |
| lua-love | gemini | YES | 205 | 2868ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 152 | 3163ms | Warning: luac/luajit not found, syntax not verified |

### Task: pong_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 248 | 3364ms | - |
| vibe | openai | YES | 322 | 10267ms | - |
| vibe | claude | YES | 265 | 0ms | - |
| python-pygame | gemini | YES | 299 | 4193ms | - |
| python-pygame | openai | YES | 326 | 7737ms | - |
| lua-love | gemini | YES | 285 | 4060ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 317 | 5202ms | Warning: luac/luajit not found, syntax not verified |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 332 | 3660ms | - |
| vibe | openai | NO | 321 | 24232ms | expected top-level declaration (fn, let, const), got IDENT ("load") |
| vibe | claude | YES | 343 | 0ms | - |
| python-pygame | gemini | YES | 340 | 3982ms | - |
| python-pygame | openai | YES | 330 | 11656ms | - |
| lua-love | gemini | YES | 349 | 4864ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 351 | 7813ms | Warning: luac/luajit not found, syntax not verified |

### Task: bezier_curves

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 254 | 2976ms | - |
| vibe | openai | YES | 257 | 5084ms | - |
| vibe | claude | YES | 262 | 0ms | - |
| python-pygame | gemini | YES | 303 | 3818ms | - |
| python-pygame | openai | YES | 315 | 7606ms | - |
| lua-love | gemini | YES | 345 | 3205ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 322 | 5603ms | Warning: luac/luajit not found, syntax not verified |

### Task: verlet_rope

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 307 | 4037ms | - |
| vibe | openai | YES | 316 | 5832ms | - |
| vibe | claude | YES | 339 | 0ms | - |
| python-pygame | gemini | YES | 348 | 4247ms | - |
| python-pygame | openai | YES | 356 | 8416ms | - |
| lua-love | gemini | YES | 364 | 3367ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 351 | 4515ms | Warning: luac/luajit not found, syntax not verified |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 350 | 3224ms | - |
| vibe | openai | YES | 350 | 4756ms | - |
| vibe | claude | YES | 370 | 0ms | - |
| python-pygame | gemini | YES | 392 | 3779ms | - |
| python-pygame | openai | YES | 438 | 13945ms | - |
| lua-love | gemini | YES | 426 | 4406ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 403 | 8061ms | Warning: luac/luajit not found, syntax not verified |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 226 | 3402ms | - |
| vibe | openai | YES | 226 | 4959ms | - |
| vibe | claude | YES | 242 | 0ms | - |
| python-pygame | gemini | YES | 274 | 4495ms | - |
| python-pygame | openai | YES | 258 | 7183ms | - |
| lua-love | gemini | YES | 266 | 3648ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 259 | 6183ms | Warning: luac/luajit not found, syntax not verified |

### Task: aabb_physics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 264 | 3803ms | - |
| vibe | openai | YES | 264 | 5286ms | - |
| vibe | claude | YES | 272 | 0ms | - |
| python-pygame | gemini | YES | 284 | 4439ms | - |
| python-pygame | openai | YES | 310 | 6961ms | - |
| lua-love | gemini | YES | 284 | 3898ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 282 | 7511ms | Warning: luac/luajit not found, syntax not verified |

### Task: inventory_grid

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 288 | 3041ms | - |
| vibe | openai | YES | 273 | 5374ms | - |
| vibe | claude | YES | 275 | 0ms | - |
| python-pygame | gemini | YES | 305 | 3942ms | - |
| python-pygame | openai | YES | 321 | 9476ms | - |
| lua-love | gemini | YES | 310 | 4115ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 289 | 7012ms | Warning: luac/luajit not found, syntax not verified |

### Task: procedural_terrain

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 172 | 2758ms | - |
| vibe | openai | YES | 172 | 4382ms | - |
| vibe | claude | YES | 180 | 0ms | - |
| python-pygame | gemini | YES | 199 | 3525ms | - |
| python-pygame | openai | YES | 233 | 4561ms | - |
| lua-love | gemini | YES | 213 | 2995ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 208 | 5365ms | Warning: luac/luajit not found, syntax not verified |

### Task: heat_diffusion

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 288 | 2795ms | - |
| vibe | openai | YES | 288 | 4450ms | - |
| vibe | claude | YES | 304 | 0ms | - |
| python-pygame | gemini | YES | 316 | 3257ms | - |
| python-pygame | openai | YES | 313 | 6646ms | - |
| lua-love | gemini | YES | 340 | 3509ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 333 | 5720ms | Warning: luac/luajit not found, syntax not verified |

### Task: asteroids_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 458 | 4480ms | - |
| vibe | openai | YES | 474 | 8526ms | - |
| vibe | claude | YES | 506 | 0ms | - |
| python-pygame | gemini | YES | 408 | 5108ms | - |
| python-pygame | openai | YES | 503 | 10725ms | - |
| lua-love | gemini | YES | 393 | 4615ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 509 | 12388ms | Warning: luac/luajit not found, syntax not verified |

### Task: rhythm_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 273 | 3918ms | - |
| vibe | openai | YES | 277 | 4518ms | - |
| vibe | claude | YES | 295 | 0ms | - |
| python-pygame | gemini | YES | 304 | 3796ms | - |
| python-pygame | openai | YES | 334 | 14299ms | - |
| lua-love | gemini | YES | 301 | 3503ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 302 | 12919ms | Warning: luac/luajit not found, syntax not verified |

### Task: fractal_tree

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 303 | 3100ms | - |
| vibe | openai | YES | 303 | 6861ms | - |
| vibe | claude | YES | 304 | 0ms | - |
| python-pygame | gemini | YES | 224 | 3486ms | - |
| python-pygame | openai | YES | 250 | 5485ms | - |
| lua-love | gemini | YES | 230 | 3614ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 301 | 32778ms | Warning: luac/luajit not found, syntax not verified |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 490 | 5724ms | - |
| vibe | openai | YES | 521 | 12050ms | - |
| vibe | claude | YES | 565 | 0ms | - |
| python-pygame | gemini | YES | 390 | 5693ms | - |
| python-pygame | openai | YES | 489 | 14987ms | - |
| lua-love | gemini | YES | 483 | 6177ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 561 | 22580ms | Warning: luac/luajit not found, syntax not verified |

### Task: spring_physics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 273 | 3606ms | - |
| vibe | openai | YES | 273 | 4663ms | - |
| vibe | claude | YES | 303 | 0ms | - |
| python-pygame | gemini | YES | 305 | 3780ms | - |
| python-pygame | openai | YES | 307 | 13427ms | - |
| lua-love | gemini | YES | 317 | 4048ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 313 | 6651ms | Warning: luac/luajit not found, syntax not verified |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 441 | 5117ms | - |
| vibe | openai | YES | 397 | 7566ms | - |
| vibe | claude | YES | 505 | 0ms | - |
| python-pygame | gemini | YES | 446 | 5500ms | - |
| python-pygame | openai | YES | 491 | 16874ms | - |
| lua-love | gemini | YES | 477 | 4550ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 433 | 10293ms | Warning: luac/luajit not found, syntax not verified |

### Task: pendulum_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 2856ms | - |
| vibe | openai | YES | 134 | 3257ms | - |
| vibe | claude | YES | 140 | 0ms | - |
| python-pygame | gemini | YES | 205 | 2877ms | - |
| python-pygame | openai | YES | 214 | 7258ms | - |
| lua-love | gemini | YES | 167 | 4411ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 151 | 2941ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_gravity_well

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 219 | 3863ms | - |
| vibe | openai | YES | 205 | 4050ms | - |
| vibe | claude | YES | 213 | 0ms | - |
| python-pygame | gemini | YES | 259 | 3228ms | - |
| python-pygame | openai | YES | 260 | 5555ms | - |
| lua-love | gemini | YES | 232 | 3093ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 227 | 3767ms | Warning: luac/luajit not found, syntax not verified |
