# LLM Code Generation Benchmark Results

**Generated**: 2026-03-10T11:25:40.507Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 100% (50/50) | 221 | 3266ms |
| lua-love | openai | 100% (50/50) | 221 | 5600ms |
| python-pygame | gemini | 100% (50/50) | 230 | 3400ms |
| python-pygame | openai | 100% (50/50) | 235 | 6790ms |
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | 100% (50/50) | 191 | 3101ms |
| vibe | openai | 100% (50/50) | 193 | 5388ms |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 52 | 1982ms | - |
| vibe | openai | YES | 52 | 1596ms | - |
| vibe | claude | YES | 60 | 0ms | - |
| python-pygame | gemini | YES | 111 | 2863ms | - |
| python-pygame | openai | YES | 92 | 5681ms | - |
| lua-love | gemini | YES | 81 | 2089ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 74 | 6693ms | Warning: luac/luajit not found, syntax not verified |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 60 | 1530ms | - |
| vibe | openai | YES | 64 | 1947ms | - |
| vibe | claude | YES | 64 | 0ms | - |
| python-pygame | gemini | YES | 137 | 2672ms | - |
| python-pygame | openai | YES | 115 | 4774ms | - |
| lua-love | gemini | YES | 119 | 1768ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 109 | 2611ms | Warning: luac/luajit not found, syntax not verified |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 25 | 2975ms | - |
| vibe | openai | YES | 25 | 857ms | - |
| vibe | claude | YES | 25 | 0ms | - |
| python-pygame | gemini | YES | 84 | 2560ms | - |
| python-pygame | openai | YES | 81 | 2660ms | - |
| lua-love | gemini | YES | 42 | 2062ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 34 | 1144ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_changing_rect

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 64 | 1512ms | - |
| vibe | openai | YES | 72 | 2561ms | - |
| vibe | claude | YES | 72 | 0ms | - |
| python-pygame | gemini | YES | 140 | 2535ms | - |
| python-pygame | openai | YES | 116 | 3612ms | - |
| lua-love | gemini | YES | 94 | 4527ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 86 | 2193ms | Warning: luac/luajit not found, syntax not verified |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 128 | 2242ms | - |
| vibe | openai | YES | 120 | 3698ms | - |
| vibe | claude | YES | 130 | 0ms | - |
| python-pygame | gemini | YES | 177 | 2460ms | - |
| python-pygame | openai | YES | 149 | 5663ms | - |
| lua-love | gemini | YES | 176 | 3569ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 177 | 3506ms | Warning: luac/luajit not found, syntax not verified |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 95 | 2546ms | - |
| vibe | openai | YES | 97 | 2794ms | - |
| vibe | claude | YES | 92 | 0ms | - |
| python-pygame | gemini | YES | 168 | 2687ms | - |
| python-pygame | openai | YES | 137 | 4757ms | - |
| lua-love | gemini | YES | 142 | 3145ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 9628ms | Warning: luac/luajit not found, syntax not verified |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 132 | 2369ms | - |
| vibe | openai | YES | 136 | 13820ms | - |
| vibe | claude | YES | 130 | 0ms | - |
| python-pygame | gemini | YES | 190 | 3341ms | - |
| python-pygame | openai | YES | 200 | 10685ms | - |
| lua-love | gemini | YES | 159 | 2973ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 169 | 4339ms | Warning: luac/luajit not found, syntax not verified |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 94 | 2303ms | - |
| vibe | openai | YES | 86 | 2411ms | - |
| vibe | claude | YES | 94 | 0ms | - |
| python-pygame | gemini | YES | 165 | 2466ms | - |
| python-pygame | openai | YES | 129 | 3447ms | - |
| lua-love | gemini | YES | 133 | 2521ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 1883ms | Warning: luac/luajit not found, syntax not verified |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 41 | 1662ms | - |
| vibe | openai | YES | 41 | 1059ms | - |
| vibe | claude | YES | 41 | 0ms | - |
| python-pygame | gemini | YES | 98 | 2789ms | - |
| python-pygame | openai | YES | 94 | 3561ms | - |
| lua-love | gemini | YES | 51 | 2233ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 57 | 1424ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_burst

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 122 | 2894ms | - |
| vibe | openai | YES | 144 | 4563ms | - |
| vibe | claude | YES | 120 | 0ms | - |
| python-pygame | gemini | YES | 168 | 3514ms | - |
| python-pygame | openai | YES | 169 | 4891ms | - |
| lua-love | gemini | YES | 138 | 2482ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 151 | 4731ms | Warning: luac/luajit not found, syntax not verified |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 164 | 3184ms | - |
| vibe | openai | YES | 168 | 4119ms | - |
| vibe | claude | YES | 176 | 0ms | - |
| python-pygame | gemini | YES | 244 | 3365ms | - |
| python-pygame | openai | YES | 232 | 5930ms | - |
| lua-love | gemini | YES | 197 | 2780ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 191 | 4357ms | Warning: luac/luajit not found, syntax not verified |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 194 | 4611ms | - |
| vibe | openai | YES | 187 | 4297ms | - |
| vibe | claude | YES | 195 | 0ms | - |
| python-pygame | gemini | YES | 218 | 3961ms | - |
| python-pygame | openai | YES | 196 | 5346ms | - |
| lua-love | gemini | YES | 214 | 3324ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 199 | 3879ms | Warning: luac/luajit not found, syntax not verified |

### Task: multi_wave_spawner

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 317 | 3227ms | - |
| vibe | openai | YES | 350 | 21580ms | - |
| vibe | claude | YES | 364 | 0ms | - |
| python-pygame | gemini | YES | 303 | 3500ms | - |
| python-pygame | openai | YES | 365 | 9568ms | - |
| lua-love | gemini | YES | 313 | 3169ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 410 | 7981ms | Warning: luac/luajit not found, syntax not verified |

### Task: orbital_mechanics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 124 | 3906ms | - |
| vibe | openai | YES | 98 | 3429ms | - |
| vibe | claude | YES | 106 | 0ms | - |
| python-pygame | gemini | YES | 169 | 2429ms | - |
| python-pygame | openai | YES | 178 | 4484ms | - |
| lua-love | gemini | YES | 153 | 3332ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 159 | 3885ms | Warning: luac/luajit not found, syntax not verified |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 216 | 2714ms | - |
| vibe | openai | YES | 219 | 5688ms | - |
| vibe | claude | YES | 226 | 0ms | - |
| python-pygame | gemini | YES | 295 | 3491ms | - |
| python-pygame | openai | YES | 287 | 7206ms | - |
| lua-love | gemini | YES | 298 | 3898ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 269 | 5901ms | Warning: luac/luajit not found, syntax not verified |

### Task: twin_stick_dodge

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 290 | 9148ms | - |
| vibe | openai | YES | 312 | 10248ms | - |
| vibe | claude | YES | 322 | 0ms | - |
| python-pygame | gemini | YES | 339 | 3941ms | - |
| python-pygame | openai | YES | 318 | 7715ms | - |
| lua-love | gemini | YES | 312 | 3560ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 354 | 9111ms | Warning: luac/luajit not found, syntax not verified |

### Task: flocking_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 250 | 4380ms | - |
| vibe | openai | YES | 273 | 5146ms | - |
| vibe | claude | YES | 266 | 0ms | - |
| python-pygame | gemini | YES | 223 | 3307ms | - |
| python-pygame | openai | YES | 275 | 8238ms | - |
| lua-love | gemini | YES | 286 | 4120ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 296 | 10493ms | Warning: luac/luajit not found, syntax not verified |

### Task: platformer_level

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 212 | 3097ms | - |
| vibe | openai | YES | 222 | 8271ms | - |
| vibe | claude | YES | 208 | 0ms | - |
| python-pygame | gemini | YES | 276 | 4436ms | - |
| python-pygame | openai | YES | 267 | 6400ms | - |
| lua-love | gemini | YES | 263 | 3187ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 269 | 5380ms | Warning: luac/luajit not found, syntax not verified |

### Task: minimap_radar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 247 | 3458ms | - |
| vibe | openai | YES | 222 | 7361ms | - |
| vibe | claude | YES | 204 | 0ms | - |
| python-pygame | gemini | YES | 272 | 4042ms | - |
| python-pygame | openai | YES | 253 | 9718ms | - |
| lua-love | gemini | YES | 266 | 3643ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 256 | 5111ms | Warning: luac/luajit not found, syntax not verified |

### Task: chain_reaction

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 213 | 2786ms | - |
| vibe | openai | YES | 244 | 4737ms | - |
| vibe | claude | YES | 222 | 0ms | - |
| python-pygame | gemini | YES | 242 | 3625ms | - |
| python-pygame | openai | YES | 240 | 5745ms | - |
| lua-love | gemini | YES | 236 | 3149ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 238 | 5831ms | Warning: luac/luajit not found, syntax not verified |

### Task: fading_text

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 36 | 1961ms | - |
| vibe | openai | YES | 36 | 1183ms | - |
| vibe | claude | YES | 36 | 0ms | - |
| python-pygame | gemini | YES | 100 | 2247ms | - |
| python-pygame | openai | YES | 90 | 3469ms | - |
| lua-love | gemini | YES | 44 | 1764ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 44 | 2144ms | Warning: luac/luajit not found, syntax not verified |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 71 | 1680ms | - |
| vibe | openai | YES | 71 | 2385ms | - |
| vibe | claude | YES | 71 | 0ms | - |
| python-pygame | gemini | YES | 144 | 2903ms | - |
| python-pygame | openai | YES | 122 | 2534ms | - |
| lua-love | gemini | YES | 84 | 1777ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 85 | 2349ms | Warning: luac/luajit not found, syntax not verified |

### Task: keyboard_display

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 44 | 1676ms | - |
| vibe | openai | YES | 42 | 1264ms | - |
| vibe | claude | YES | 44 | 0ms | - |
| python-pygame | gemini | YES | 129 | 2240ms | - |
| python-pygame | openai | YES | 109 | 3357ms | - |
| lua-love | gemini | YES | 54 | 1830ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 52 | 2216ms | Warning: luac/luajit not found, syntax not verified |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 76 | 2427ms | - |
| vibe | openai | YES | 76 | 2390ms | - |
| vibe | claude | YES | 82 | 0ms | - |
| python-pygame | gemini | YES | 140 | 2160ms | - |
| python-pygame | openai | YES | 130 | 3790ms | - |
| lua-love | gemini | YES | 98 | 2714ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 99 | 2188ms | Warning: luac/luajit not found, syntax not verified |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 115 | 2098ms | - |
| vibe | openai | YES | 123 | 3090ms | - |
| vibe | claude | YES | 99 | 0ms | - |
| python-pygame | gemini | YES | 180 | 2717ms | - |
| python-pygame | openai | YES | 172 | 5237ms | - |
| lua-love | gemini | YES | 144 | 2741ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 145 | 5522ms | Warning: luac/luajit not found, syntax not verified |

### Task: screen_shake

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 115 | 2555ms | - |
| vibe | openai | YES | 115 | 5746ms | - |
| vibe | claude | YES | 122 | 0ms | - |
| python-pygame | gemini | YES | 177 | 3490ms | - |
| python-pygame | openai | YES | 190 | 7016ms | - |
| lua-love | gemini | YES | 140 | 2662ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 162 | 7588ms | Warning: luac/luajit not found, syntax not verified |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 132 | 2557ms | - |
| vibe | openai | YES | 132 | 4048ms | - |
| vibe | claude | YES | 132 | 0ms | - |
| python-pygame | gemini | YES | 184 | 3827ms | - |
| python-pygame | openai | YES | 190 | 8235ms | - |
| lua-love | gemini | YES | 165 | 2597ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 149 | 3248ms | Warning: luac/luajit not found, syntax not verified |

### Task: expanding_rings

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 93 | 2184ms | - |
| vibe | openai | YES | 93 | 2417ms | - |
| vibe | claude | YES | 93 | 0ms | - |
| python-pygame | gemini | YES | 131 | 2873ms | - |
| python-pygame | openai | YES | 122 | 4174ms | - |
| lua-love | gemini | YES | 117 | 2637ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 111 | 3689ms | Warning: luac/luajit not found, syntax not verified |

### Task: typewriter_text

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 113 | 2568ms | - |
| vibe | openai | YES | 113 | 4436ms | - |
| vibe | claude | YES | 113 | 0ms | - |
| python-pygame | gemini | YES | 184 | 3442ms | - |
| python-pygame | openai | YES | 175 | 5046ms | - |
| lua-love | gemini | YES | 158 | 2050ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 127 | 2425ms | Warning: luac/luajit not found, syntax not verified |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 173 | 3000ms | - |
| vibe | openai | YES | 164 | 12905ms | - |
| vibe | claude | YES | 183 | 0ms | - |
| python-pygame | gemini | YES | 205 | 3634ms | - |
| python-pygame | openai | YES | 207 | 6272ms | - |
| lua-love | gemini | YES | 241 | 3757ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 239 | 12472ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_pulse

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 74 | 1834ms | - |
| vibe | openai | YES | 74 | 1359ms | - |
| vibe | claude | YES | 76 | 0ms | - |
| python-pygame | gemini | YES | 123 | 2568ms | - |
| python-pygame | openai | YES | 118 | 2729ms | - |
| lua-love | gemini | YES | 90 | 3760ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 85 | 1895ms | Warning: luac/luajit not found, syntax not verified |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 153 | 2511ms | - |
| vibe | openai | YES | 144 | 2262ms | - |
| vibe | claude | YES | 153 | 0ms | - |
| python-pygame | gemini | YES | 206 | 3452ms | - |
| python-pygame | openai | YES | 199 | 4790ms | - |
| lua-love | gemini | YES | 197 | 2674ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 152 | 3718ms | Warning: luac/luajit not found, syntax not verified |

### Task: pong_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 245 | 3612ms | - |
| vibe | openai | YES | 273 | 5670ms | - |
| vibe | claude | YES | 265 | 0ms | - |
| python-pygame | gemini | YES | 288 | 4197ms | - |
| python-pygame | openai | YES | 323 | 7656ms | - |
| lua-love | gemini | YES | 285 | 4337ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 317 | 7266ms | Warning: luac/luajit not found, syntax not verified |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 332 | 4187ms | - |
| vibe | openai | YES | 321 | 6845ms | - |
| vibe | claude | YES | 343 | 0ms | - |
| python-pygame | gemini | YES | 342 | 4981ms | - |
| python-pygame | openai | YES | 338 | 10832ms | - |
| lua-love | gemini | YES | 349 | 3357ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 354 | 8621ms | Warning: luac/luajit not found, syntax not verified |

### Task: bezier_curves

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 254 | 3193ms | - |
| vibe | openai | YES | 257 | 5881ms | - |
| vibe | claude | YES | 262 | 0ms | - |
| python-pygame | gemini | YES | 302 | 3702ms | - |
| python-pygame | openai | YES | 314 | 7000ms | - |
| lua-love | gemini | YES | 345 | 3859ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 321 | 10801ms | Warning: luac/luajit not found, syntax not verified |

### Task: verlet_rope

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 319 | 2907ms | - |
| vibe | openai | YES | 320 | 8712ms | - |
| vibe | claude | YES | 339 | 0ms | - |
| python-pygame | gemini | YES | 349 | 3751ms | - |
| python-pygame | openai | YES | 341 | 7673ms | - |
| lua-love | gemini | YES | 358 | 3964ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 351 | 6245ms | Warning: luac/luajit not found, syntax not verified |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 350 | 2938ms | - |
| vibe | openai | YES | 350 | 6181ms | - |
| vibe | claude | YES | 370 | 0ms | - |
| python-pygame | gemini | YES | 384 | 4207ms | - |
| python-pygame | openai | YES | 443 | 10084ms | - |
| lua-love | gemini | YES | 426 | 4126ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 403 | 6785ms | Warning: luac/luajit not found, syntax not verified |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 226 | 3154ms | - |
| vibe | openai | YES | 226 | 3891ms | - |
| vibe | claude | YES | 242 | 0ms | - |
| python-pygame | gemini | YES | 268 | 4089ms | - |
| python-pygame | openai | YES | 255 | 6311ms | - |
| lua-love | gemini | YES | 260 | 4151ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 259 | 4721ms | Warning: luac/luajit not found, syntax not verified |

### Task: aabb_physics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 264 | 4189ms | - |
| vibe | openai | YES | 264 | 4939ms | - |
| vibe | claude | YES | 272 | 0ms | - |
| python-pygame | gemini | YES | 284 | 3432ms | - |
| python-pygame | openai | YES | 303 | 7824ms | - |
| lua-love | gemini | YES | 284 | 3664ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 280 | 4754ms | Warning: luac/luajit not found, syntax not verified |

### Task: inventory_grid

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 288 | 3037ms | - |
| vibe | openai | YES | 273 | 4154ms | - |
| vibe | claude | YES | 275 | 0ms | - |
| python-pygame | gemini | YES | 307 | 4084ms | - |
| python-pygame | openai | YES | 327 | 8371ms | - |
| lua-love | gemini | YES | 298 | 3548ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 289 | 4122ms | Warning: luac/luajit not found, syntax not verified |

### Task: procedural_terrain

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 172 | 2836ms | - |
| vibe | openai | YES | 172 | 4447ms | - |
| vibe | claude | YES | 180 | 0ms | - |
| python-pygame | gemini | YES | 205 | 3351ms | - |
| python-pygame | openai | YES | 222 | 4858ms | - |
| lua-love | gemini | YES | 213 | 3603ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 212 | 5864ms | Warning: luac/luajit not found, syntax not verified |

### Task: heat_diffusion

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 288 | 3866ms | - |
| vibe | openai | YES | 288 | 6391ms | - |
| vibe | claude | YES | 304 | 0ms | - |
| python-pygame | gemini | YES | 316 | 2928ms | - |
| python-pygame | openai | YES | 313 | 7206ms | - |
| lua-love | gemini | YES | 362 | 2950ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 330 | 7072ms | Warning: luac/luajit not found, syntax not verified |

### Task: asteroids_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 464 | 5111ms | - |
| vibe | openai | YES | 474 | 13976ms | - |
| vibe | claude | YES | 506 | 0ms | - |
| python-pygame | gemini | YES | 404 | 5256ms | - |
| python-pygame | openai | YES | 493 | 10824ms | - |
| lua-love | gemini | YES | 393 | 4364ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 512 | 13599ms | Warning: luac/luajit not found, syntax not verified |

### Task: rhythm_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 273 | 3697ms | - |
| vibe | openai | YES | 277 | 7152ms | - |
| vibe | claude | YES | 295 | 0ms | - |
| python-pygame | gemini | YES | 290 | 4614ms | - |
| python-pygame | openai | YES | 334 | 10504ms | - |
| lua-love | gemini | YES | 307 | 3815ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 302 | 7199ms | Warning: luac/luajit not found, syntax not verified |

### Task: fractal_tree

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 303 | 4077ms | - |
| vibe | openai | YES | 303 | 5644ms | - |
| vibe | claude | YES | 304 | 0ms | - |
| python-pygame | gemini | YES | 250 | 2959ms | - |
| python-pygame | openai | YES | 252 | 8019ms | - |
| lua-love | gemini | YES | 230 | 4430ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 301 | 7685ms | Warning: luac/luajit not found, syntax not verified |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 490 | 4859ms | - |
| vibe | openai | YES | 503 | 12203ms | - |
| vibe | claude | YES | 565 | 0ms | - |
| python-pygame | gemini | YES | 390 | 4403ms | - |
| python-pygame | openai | YES | 498 | 16220ms | - |
| lua-love | gemini | YES | 517 | 5092ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 527 | 13779ms | Warning: luac/luajit not found, syntax not verified |

### Task: spring_physics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 273 | 3506ms | - |
| vibe | openai | YES | 273 | 8458ms | - |
| vibe | claude | YES | 303 | 0ms | - |
| python-pygame | gemini | YES | 305 | 3948ms | - |
| python-pygame | openai | YES | 310 | 7346ms | - |
| lua-love | gemini | YES | 317 | 3976ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 321 | 5946ms | Warning: luac/luajit not found, syntax not verified |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 443 | 5204ms | - |
| vibe | openai | YES | 397 | 5911ms | - |
| vibe | claude | YES | 505 | 0ms | - |
| python-pygame | gemini | YES | 444 | 4352ms | - |
| python-pygame | openai | YES | 472 | 15725ms | - |
| lua-love | gemini | YES | 477 | 5130ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 433 | 8145ms | Warning: luac/luajit not found, syntax not verified |

### Task: pendulum_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 134 | 2434ms | - |
| vibe | openai | YES | 134 | 1933ms | - |
| vibe | claude | YES | 140 | 0ms | - |
| python-pygame | gemini | YES | 195 | 3055ms | - |
| python-pygame | openai | YES | 221 | 7142ms | - |
| lua-love | gemini | YES | 167 | 2471ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 151 | 3048ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_gravity_well

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | claude | 100% (50/50) | 200 | - |
| vibe | gemini | YES | 207 | 2661ms | - |
| vibe | openai | YES | 205 | 3344ms | - |
| vibe | claude | YES | 213 | 0ms | - |
| python-pygame | gemini | YES | 265 | 3145ms | - |
| python-pygame | openai | YES | 251 | 9196ms | - |
| lua-love | gemini | YES | 232 | 3944ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 227 | 4834ms | Warning: luac/luajit not found, syntax not verified |
