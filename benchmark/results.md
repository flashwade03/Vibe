# LLM Code Generation Benchmark Results

**Generated**: 2026-03-10T07:21:04.077Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 100% (50/50) | 221 | 3161ms |
| lua-love | openai | 100% (50/50) | 222 | 5061ms |
| python-pygame | gemini | 100% (50/50) | 231 | 3477ms |
| python-pygame | openai | 100% (50/50) | 233 | 5598ms |
| vibe | gemini | 100% (50/50) | 192 | 0ms |
| vibe | claude | 100% (50/50) | 200 | 0ms |
| vibe | openai | 96% (48/50) | 194 | 0ms |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 52 | 0ms | - |
| vibe | openai | YES | 60 | 0ms | - |
| vibe | claude | YES | 60 | 0ms | - |
| python-pygame | gemini | YES | 112 | 2411ms | - |
| python-pygame | openai | YES | 96 | 2449ms | - |
| lua-love | gemini | YES | 81 | 1751ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 74 | 2532ms | Warning: luac/luajit not found, syntax not verified |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 68 | 0ms | - |
| vibe | openai | YES | 64 | 0ms | - |
| vibe | claude | YES | 64 | 0ms | - |
| python-pygame | gemini | YES | 136 | 1911ms | - |
| python-pygame | openai | YES | 113 | 2328ms | - |
| lua-love | gemini | YES | 119 | 1605ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 109 | 2319ms | Warning: luac/luajit not found, syntax not verified |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 0ms | - |
| vibe | openai | YES | 25 | 0ms | - |
| vibe | claude | YES | 25 | 0ms | - |
| python-pygame | gemini | YES | 83 | 1984ms | - |
| python-pygame | openai | YES | 81 | 2816ms | - |
| lua-love | gemini | YES | 40 | 1495ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 40 | 1245ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_changing_rect

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 64 | 0ms | - |
| vibe | openai | YES | 72 | 0ms | - |
| vibe | claude | YES | 72 | 0ms | - |
| python-pygame | gemini | YES | 136 | 2148ms | - |
| python-pygame | openai | YES | 117 | 2873ms | - |
| lua-love | gemini | YES | 94 | 2146ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 86 | 1931ms | Warning: luac/luajit not found, syntax not verified |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 128 | 0ms | - |
| vibe | openai | YES | 137 | 0ms | - |
| vibe | claude | YES | 130 | 0ms | - |
| python-pygame | gemini | YES | 177 | 2534ms | - |
| python-pygame | openai | YES | 167 | 3386ms | - |
| lua-love | gemini | YES | 176 | 2875ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 178 | 4626ms | Warning: luac/luajit not found, syntax not verified |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 95 | 0ms | - |
| vibe | openai | YES | 97 | 0ms | - |
| vibe | claude | YES | 92 | 0ms | - |
| python-pygame | gemini | YES | 171 | 2652ms | - |
| python-pygame | openai | YES | 137 | 3991ms | - |
| lua-love | gemini | YES | 142 | 2418ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 2955ms | Warning: luac/luajit not found, syntax not verified |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 132 | 0ms | - |
| vibe | openai | YES | 132 | 0ms | - |
| vibe | claude | YES | 130 | 0ms | - |
| python-pygame | gemini | YES | 190 | 2763ms | - |
| python-pygame | openai | YES | 203 | 4926ms | - |
| lua-love | gemini | YES | 155 | 2466ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 169 | 3192ms | Warning: luac/luajit not found, syntax not verified |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 94 | 0ms | - |
| vibe | openai | YES | 86 | 0ms | - |
| vibe | claude | YES | 94 | 0ms | - |
| python-pygame | gemini | YES | 148 | 2263ms | - |
| python-pygame | openai | YES | 125 | 3205ms | - |
| lua-love | gemini | YES | 133 | 2096ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 1965ms | Warning: luac/luajit not found, syntax not verified |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 41 | 0ms | - |
| vibe | openai | YES | 41 | 0ms | - |
| vibe | claude | YES | 41 | 0ms | - |
| python-pygame | gemini | YES | 98 | 2373ms | - |
| python-pygame | openai | YES | 98 | 3152ms | - |
| lua-love | gemini | YES | 51 | 1511ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 54 | 1532ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_burst

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 122 | 0ms | - |
| vibe | openai | YES | 132 | 0ms | - |
| vibe | claude | YES | 120 | 0ms | - |
| python-pygame | gemini | YES | 165 | 3658ms | - |
| python-pygame | openai | YES | 147 | 4132ms | - |
| lua-love | gemini | YES | 150 | 2602ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 148 | 3277ms | Warning: luac/luajit not found, syntax not verified |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 164 | 0ms | - |
| vibe | openai | YES | 172 | 0ms | - |
| vibe | claude | YES | 176 | 0ms | - |
| python-pygame | gemini | YES | 244 | 3385ms | - |
| python-pygame | openai | YES | 218 | 5049ms | - |
| lua-love | gemini | YES | 197 | 2720ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 205 | 11818ms | Warning: luac/luajit not found, syntax not verified |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 190 | 0ms | - |
| vibe | openai | YES | 187 | 0ms | - |
| vibe | claude | YES | 195 | 0ms | - |
| python-pygame | gemini | YES | 218 | 3019ms | - |
| python-pygame | openai | YES | 196 | 5592ms | - |
| lua-love | gemini | YES | 214 | 2820ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 223 | 8078ms | Warning: luac/luajit not found, syntax not verified |

### Task: multi_wave_spawner

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 348 | 0ms | - |
| vibe | openai | NO | 350 | 0ms | expected EQ, got NEWLINE ("") |
| vibe | claude | YES | 364 | 0ms | - |
| python-pygame | gemini | YES | 335 | 5138ms | - |
| python-pygame | openai | YES | 353 | 14999ms | - |
| lua-love | gemini | YES | 315 | 3599ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 411 | 9845ms | Warning: luac/luajit not found, syntax not verified |

### Task: orbital_mechanics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 124 | 0ms | - |
| vibe | openai | YES | 112 | 0ms | - |
| vibe | claude | YES | 106 | 0ms | - |
| python-pygame | gemini | YES | 169 | 2642ms | - |
| python-pygame | openai | YES | 167 | 3628ms | - |
| lua-love | gemini | YES | 153 | 2625ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 158 | 5148ms | Warning: luac/luajit not found, syntax not verified |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 216 | 0ms | - |
| vibe | openai | YES | 217 | 0ms | - |
| vibe | claude | YES | 226 | 0ms | - |
| python-pygame | gemini | YES | 286 | 3499ms | - |
| python-pygame | openai | YES | 298 | 9906ms | - |
| lua-love | gemini | YES | 301 | 3118ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 318 | 7167ms | Warning: luac/luajit not found, syntax not verified |

### Task: twin_stick_dodge

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 290 | 0ms | - |
| vibe | openai | YES | 332 | 0ms | - |
| vibe | claude | YES | 322 | 0ms | - |
| python-pygame | gemini | YES | 334 | 4793ms | - |
| python-pygame | openai | YES | 319 | 6873ms | - |
| lua-love | gemini | YES | 312 | 4423ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 352 | 8383ms | Warning: luac/luajit not found, syntax not verified |

### Task: flocking_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 263 | 0ms | - |
| vibe | openai | YES | 266 | 0ms | - |
| vibe | claude | YES | 266 | 0ms | - |
| python-pygame | gemini | YES | 223 | 3554ms | - |
| python-pygame | openai | YES | 235 | 6531ms | - |
| lua-love | gemini | YES | 286 | 4457ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 296 | 7006ms | Warning: luac/luajit not found, syntax not verified |

### Task: platformer_level

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 215 | 0ms | - |
| vibe | openai | YES | 222 | 0ms | - |
| vibe | claude | YES | 208 | 0ms | - |
| python-pygame | gemini | YES | 299 | 3901ms | - |
| python-pygame | openai | YES | 267 | 6998ms | - |
| lua-love | gemini | YES | 265 | 4146ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 269 | 12861ms | Warning: luac/luajit not found, syntax not verified |

### Task: minimap_radar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 226 | 0ms | - |
| vibe | openai | YES | 201 | 0ms | - |
| vibe | claude | YES | 204 | 0ms | - |
| python-pygame | gemini | YES | 273 | 3778ms | - |
| python-pygame | openai | YES | 254 | 6507ms | - |
| lua-love | gemini | YES | 266 | 3220ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 250 | 4851ms | Warning: luac/luajit not found, syntax not verified |

### Task: chain_reaction

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 209 | 0ms | - |
| vibe | openai | YES | 248 | 0ms | - |
| vibe | claude | YES | 222 | 0ms | - |
| python-pygame | gemini | YES | 242 | 3643ms | - |
| python-pygame | openai | YES | 240 | 6252ms | - |
| lua-love | gemini | YES | 236 | 3123ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 241 | 5930ms | Warning: luac/luajit not found, syntax not verified |

### Task: fading_text

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 36 | 0ms | - |
| vibe | openai | YES | 36 | 0ms | - |
| vibe | claude | YES | 36 | 0ms | - |
| python-pygame | gemini | YES | 104 | 2487ms | - |
| python-pygame | openai | YES | 87 | 2352ms | - |
| lua-love | gemini | YES | 44 | 1272ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 68 | 1973ms | Warning: luac/luajit not found, syntax not verified |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 71 | 0ms | - |
| vibe | openai | YES | 71 | 0ms | - |
| vibe | claude | YES | 71 | 0ms | - |
| python-pygame | gemini | YES | 144 | 3381ms | - |
| python-pygame | openai | YES | 134 | 3326ms | - |
| lua-love | gemini | YES | 84 | 1977ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 84 | 2282ms | Warning: luac/luajit not found, syntax not verified |

### Task: keyboard_display

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 44 | 0ms | - |
| vibe | openai | YES | 42 | 0ms | - |
| vibe | claude | YES | 44 | 0ms | - |
| python-pygame | gemini | YES | 130 | 2179ms | - |
| python-pygame | openai | YES | 115 | 2524ms | - |
| lua-love | gemini | YES | 60 | 1573ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 78 | 2211ms | Warning: luac/luajit not found, syntax not verified |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 76 | 0ms | - |
| vibe | openai | YES | 76 | 0ms | - |
| vibe | claude | YES | 82 | 0ms | - |
| python-pygame | gemini | YES | 140 | 2373ms | - |
| python-pygame | openai | YES | 130 | 3468ms | - |
| lua-love | gemini | YES | 98 | 2061ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 99 | 2127ms | Warning: luac/luajit not found, syntax not verified |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 115 | 0ms | - |
| vibe | openai | YES | 122 | 0ms | - |
| vibe | claude | YES | 99 | 0ms | - |
| python-pygame | gemini | YES | 180 | 2409ms | - |
| python-pygame | openai | YES | 174 | 4202ms | - |
| lua-love | gemini | YES | 144 | 2732ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 151 | 4504ms | Warning: luac/luajit not found, syntax not verified |

### Task: screen_shake

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 115 | 0ms | - |
| vibe | openai | YES | 115 | 0ms | - |
| vibe | claude | YES | 122 | 0ms | - |
| python-pygame | gemini | YES | 203 | 2816ms | - |
| python-pygame | openai | YES | 191 | 4274ms | - |
| lua-love | gemini | YES | 141 | 3679ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 133 | 3758ms | Warning: luac/luajit not found, syntax not verified |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 132 | 0ms | - |
| vibe | openai | YES | 132 | 0ms | - |
| vibe | claude | YES | 132 | 0ms | - |
| python-pygame | gemini | YES | 184 | 2505ms | - |
| python-pygame | openai | YES | 186 | 5346ms | - |
| lua-love | gemini | YES | 169 | 2541ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 152 | 2966ms | Warning: luac/luajit not found, syntax not verified |

### Task: expanding_rings

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 93 | 0ms | - |
| vibe | openai | YES | 93 | 0ms | - |
| vibe | claude | YES | 93 | 0ms | - |
| python-pygame | gemini | YES | 131 | 3277ms | - |
| python-pygame | openai | YES | 122 | 3393ms | - |
| lua-love | gemini | YES | 99 | 2335ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 111 | 2766ms | Warning: luac/luajit not found, syntax not verified |

### Task: typewriter_text

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 113 | 0ms | - |
| vibe | openai | YES | 113 | 0ms | - |
| vibe | claude | YES | 113 | 0ms | - |
| python-pygame | gemini | YES | 184 | 6063ms | - |
| python-pygame | openai | YES | 183 | 8082ms | - |
| lua-love | gemini | YES | 168 | 2820ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 128 | 2843ms | Warning: luac/luajit not found, syntax not verified |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 173 | 0ms | - |
| vibe | openai | YES | 164 | 0ms | - |
| vibe | claude | YES | 183 | 0ms | - |
| python-pygame | gemini | YES | 205 | 5543ms | - |
| python-pygame | openai | YES | 208 | 4887ms | - |
| lua-love | gemini | YES | 241 | 6299ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 229 | 7030ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_pulse

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 74 | 0ms | - |
| vibe | openai | YES | 74 | 0ms | - |
| vibe | claude | YES | 76 | 0ms | - |
| python-pygame | gemini | YES | 123 | 2258ms | - |
| python-pygame | openai | YES | 118 | 3159ms | - |
| lua-love | gemini | YES | 84 | 1492ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 85 | 3591ms | Warning: luac/luajit not found, syntax not verified |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 153 | 0ms | - |
| vibe | openai | YES | 153 | 0ms | - |
| vibe | claude | YES | 153 | 0ms | - |
| python-pygame | gemini | YES | 197 | 2713ms | - |
| python-pygame | openai | YES | 194 | 4446ms | - |
| lua-love | gemini | YES | 197 | 2725ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 158 | 3623ms | Warning: luac/luajit not found, syntax not verified |

### Task: pong_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 245 | 0ms | - |
| vibe | openai | YES | 322 | 0ms | - |
| vibe | claude | YES | 265 | 0ms | - |
| python-pygame | gemini | YES | 291 | 3722ms | - |
| python-pygame | openai | YES | 289 | 6467ms | - |
| lua-love | gemini | YES | 285 | 3455ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 323 | 5870ms | Warning: luac/luajit not found, syntax not verified |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 332 | 0ms | - |
| vibe | openai | NO | 324 | 0ms | expected top-level declaration (fn, let, const), got IDENT ("main") |
| vibe | claude | YES | 343 | 0ms | - |
| python-pygame | gemini | YES | 339 | 4404ms | - |
| python-pygame | openai | YES | 338 | 12142ms | - |
| lua-love | gemini | YES | 349 | 3674ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 354 | 5587ms | Warning: luac/luajit not found, syntax not verified |

### Task: bezier_curves

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 254 | 0ms | - |
| vibe | openai | YES | 257 | 0ms | - |
| vibe | claude | YES | 262 | 0ms | - |
| python-pygame | gemini | YES | 300 | 3533ms | - |
| python-pygame | openai | YES | 315 | 5204ms | - |
| lua-love | gemini | YES | 345 | 3309ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 321 | 4877ms | Warning: luac/luajit not found, syntax not verified |

### Task: verlet_rope

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 319 | 0ms | - |
| vibe | openai | YES | 312 | 0ms | - |
| vibe | claude | YES | 339 | 0ms | - |
| python-pygame | gemini | YES | 348 | 3914ms | - |
| python-pygame | openai | YES | 335 | 8513ms | - |
| lua-love | gemini | YES | 368 | 3556ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 351 | 6872ms | Warning: luac/luajit not found, syntax not verified |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 350 | 0ms | - |
| vibe | openai | YES | 350 | 0ms | - |
| vibe | claude | YES | 370 | 0ms | - |
| python-pygame | gemini | YES | 392 | 3783ms | - |
| python-pygame | openai | YES | 397 | 6417ms | - |
| lua-love | gemini | YES | 426 | 3953ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 403 | 5855ms | Warning: luac/luajit not found, syntax not verified |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 226 | 0ms | - |
| vibe | openai | YES | 226 | 0ms | - |
| vibe | claude | YES | 242 | 0ms | - |
| python-pygame | gemini | YES | 285 | 4204ms | - |
| python-pygame | openai | YES | 259 | 6117ms | - |
| lua-love | gemini | YES | 260 | 3323ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 256 | 4860ms | Warning: luac/luajit not found, syntax not verified |

### Task: aabb_physics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 264 | 0ms | - |
| vibe | openai | YES | 264 | 0ms | - |
| vibe | claude | YES | 272 | 0ms | - |
| python-pygame | gemini | YES | 284 | 3797ms | - |
| python-pygame | openai | YES | 312 | 5862ms | - |
| lua-love | gemini | YES | 284 | 3721ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 282 | 10232ms | Warning: luac/luajit not found, syntax not verified |

### Task: inventory_grid

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 288 | 0ms | - |
| vibe | openai | YES | 273 | 0ms | - |
| vibe | claude | YES | 275 | 0ms | - |
| python-pygame | gemini | YES | 305 | 6038ms | - |
| python-pygame | openai | YES | 327 | 5247ms | - |
| lua-love | gemini | YES | 298 | 3737ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 283 | 5129ms | Warning: luac/luajit not found, syntax not verified |

### Task: procedural_terrain

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 172 | 0ms | - |
| vibe | openai | YES | 172 | 0ms | - |
| vibe | claude | YES | 180 | 0ms | - |
| python-pygame | gemini | YES | 199 | 4028ms | - |
| python-pygame | openai | YES | 236 | 4763ms | - |
| lua-love | gemini | YES | 213 | 3090ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 210 | 5134ms | Warning: luac/luajit not found, syntax not verified |

### Task: heat_diffusion

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 288 | 0ms | - |
| vibe | openai | YES | 288 | 0ms | - |
| vibe | claude | YES | 304 | 0ms | - |
| python-pygame | gemini | YES | 318 | 3342ms | - |
| python-pygame | openai | YES | 313 | 5131ms | - |
| lua-love | gemini | YES | 362 | 3510ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 333 | 3967ms | Warning: luac/luajit not found, syntax not verified |

### Task: asteroids_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 468 | 0ms | - |
| vibe | openai | YES | 461 | 0ms | - |
| vibe | claude | YES | 506 | 0ms | - |
| python-pygame | gemini | YES | 393 | 5483ms | - |
| python-pygame | openai | YES | 494 | 9137ms | - |
| lua-love | gemini | YES | 452 | 5007ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 504 | 8779ms | Warning: luac/luajit not found, syntax not verified |

### Task: rhythm_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 273 | 0ms | - |
| vibe | openai | YES | 277 | 0ms | - |
| vibe | claude | YES | 295 | 0ms | - |
| python-pygame | gemini | YES | 290 | 3785ms | - |
| python-pygame | openai | YES | 334 | 6975ms | - |
| lua-love | gemini | YES | 307 | 7110ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 302 | 6019ms | Warning: luac/luajit not found, syntax not verified |

### Task: fractal_tree

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 303 | 0ms | - |
| vibe | openai | YES | 303 | 0ms | - |
| vibe | claude | YES | 304 | 0ms | - |
| python-pygame | gemini | YES | 220 | 4132ms | - |
| python-pygame | openai | YES | 249 | 4693ms | - |
| lua-love | gemini | YES | 230 | 3032ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 249 | 4792ms | Warning: luac/luajit not found, syntax not verified |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 490 | 0ms | - |
| vibe | openai | YES | 521 | 0ms | - |
| vibe | claude | YES | 565 | 0ms | - |
| python-pygame | gemini | YES | 410 | 4928ms | - |
| python-pygame | openai | YES | 499 | 10763ms | - |
| lua-love | gemini | YES | 485 | 5100ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 551 | 10257ms | Warning: luac/luajit not found, syntax not verified |

### Task: spring_physics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 273 | 0ms | - |
| vibe | openai | YES | 273 | 0ms | - |
| vibe | claude | YES | 303 | 0ms | - |
| python-pygame | gemini | YES | 311 | 3728ms | - |
| python-pygame | openai | YES | 313 | 6090ms | - |
| lua-love | gemini | YES | 317 | 3489ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 320 | 6254ms | Warning: luac/luajit not found, syntax not verified |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 443 | 0ms | - |
| vibe | openai | YES | 397 | 0ms | - |
| vibe | claude | YES | 505 | 0ms | - |
| python-pygame | gemini | YES | 448 | 4705ms | - |
| python-pygame | openai | YES | 485 | 10632ms | - |
| lua-love | gemini | YES | 477 | 4700ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 428 | 6959ms | Warning: luac/luajit not found, syntax not verified |

### Task: pendulum_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 0ms | - |
| vibe | openai | YES | 134 | 0ms | - |
| vibe | claude | YES | 140 | 0ms | - |
| python-pygame | gemini | YES | 195 | 2877ms | - |
| python-pygame | openai | YES | 233 | 5217ms | - |
| lua-love | gemini | YES | 166 | 2468ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 151 | 2634ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_gravity_well

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 219 | 0ms | - |
| vibe | openai | YES | 205 | 0ms | - |
| vibe | claude | YES | 213 | 0ms | - |
| python-pygame | gemini | YES | 264 | 3391ms | - |
| python-pygame | openai | YES | 265 | 5455ms | - |
| lua-love | gemini | YES | 232 | 5115ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 227 | 2632ms | Warning: luac/luajit not found, syntax not verified |
