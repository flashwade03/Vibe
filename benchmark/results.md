# LLM Code Generation Benchmark Results

**Generated**: 2026-03-09T18:48:15.368Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 100% (20/20) | 146 | 23402ms |
| lua-love | openai | 100% (20/20) | 184 | 5069ms |
| python-pygame | gemini | 75% (15/20) | 150 | 25083ms |
| python-pygame | openai | 95% (19/20) | 195 | 5891ms |
| vibe | claude | **100% (20/20)** | 158 | - |
| vibe | gemini | 100% (20/20) | 135 | 0ms |
| vibe | openai | 100% (20/20) | 154 | 0ms |

### Claude Vibe Benchmark (Sub-agent)

Claude Opus 4.6 서브에이전트로 실행. Vibe 시스템 프롬프트만 제공, API 레이턴시 미측정.

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
| multi_wave_spawner | YES | 366 |
| orbital_mechanics | YES | 106 |
| breakout_game | YES | 219 |
| twin_stick_dodge | YES | 335 |
| flocking_simulation | YES | 262 |
| platformer_level | YES | 212 |
| minimap_radar | YES | 232 |
| chain_reaction | YES | 227 |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 60 | 0ms | - |
| vibe | openai | YES | 52 | 0ms | - |
| python-pygame | gemini | YES | 88 | 12032ms | - |
| python-pygame | openai | YES | 96 | 3435ms | - |
| lua-love | gemini | YES | 76 | 14083ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 74 | 2108ms | Warning: luac/luajit not found, syntax not verified |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 77 | 0ms | - |
| vibe | openai | YES | 64 | 0ms | - |
| python-pygame | gemini | YES | 132 | 12372ms | - |
| python-pygame | openai | YES | 113 | 3139ms | - |
| lua-love | gemini | YES | 108 | 10015ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 109 | 4488ms | Warning: luac/luajit not found, syntax not verified |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 0ms | - |
| vibe | openai | YES | 25 | 0ms | - |
| python-pygame | gemini | YES | 82 | 18345ms | - |
| python-pygame | openai | YES | 81 | 3381ms | - |
| lua-love | gemini | YES | 46 | 10707ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 40 | 2539ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_changing_rect

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 72 | 0ms | - |
| vibe | openai | YES | 72 | 0ms | - |
| python-pygame | gemini | YES | 130 | 18965ms | - |
| python-pygame | openai | YES | 113 | 3033ms | - |
| lua-love | gemini | YES | 104 | 18066ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 86 | 2194ms | Warning: luac/luajit not found, syntax not verified |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 144 | 0ms | - |
| vibe | openai | YES | 138 | 0ms | - |
| python-pygame | gemini | YES | 150 | 18231ms | - |
| python-pygame | openai | YES | 149 | 4573ms | - |
| lua-love | gemini | YES | 178 | 17699ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 178 | 3129ms | Warning: luac/luajit not found, syntax not verified |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 97 | 0ms | - |
| vibe | openai | YES | 97 | 0ms | - |
| python-pygame | gemini | YES | 115 | 23760ms | - |
| python-pygame | openai | YES | 139 | 5010ms | - |
| lua-love | gemini | YES | 104 | 13932ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 3169ms | Warning: luac/luajit not found, syntax not verified |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 145 | 0ms | - |
| vibe | openai | YES | 128 | 0ms | - |
| python-pygame | gemini | YES | 217 | 27861ms | - |
| python-pygame | openai | YES | 188 | 5230ms | - |
| lua-love | gemini | YES | 165 | 21191ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 161 | 7058ms | Warning: luac/luajit not found, syntax not verified |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 84 | 0ms | - |
| vibe | openai | YES | 86 | 0ms | - |
| python-pygame | gemini | YES | 128 | 28480ms | - |
| python-pygame | openai | YES | 116 | 4861ms | - |
| lua-love | gemini | YES | 106 | 21740ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 2417ms | Warning: luac/luajit not found, syntax not verified |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 34 | 0ms | - |
| vibe | openai | YES | 41 | 0ms | - |
| python-pygame | gemini | YES | 84 | 16137ms | - |
| python-pygame | openai | YES | 94 | 2098ms | - |
| lua-love | gemini | YES | 45 | 15568ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 57 | 2481ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_burst

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 0ms | - |
| vibe | openai | YES | 138 | 0ms | - |
| python-pygame | gemini | YES | 141 | 25309ms | - |
| python-pygame | openai | YES | 165 | 7715ms | - |
| lua-love | gemini | YES | 140 | 25726ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 146 | 4604ms | Warning: luac/luajit not found, syntax not verified |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 176 | 0ms | - |
| vibe | openai | YES | 176 | 0ms | - |
| python-pygame | gemini | YES | 247 | 18936ms | - |
| python-pygame | openai | YES | 280 | 9338ms | - |
| lua-love | gemini | YES | 206 | 18095ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 194 | 5923ms | Warning: luac/luajit not found, syntax not verified |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 192 | 0ms | - |
| vibe | openai | YES | 187 | 0ms | - |
| python-pygame | gemini | YES | 208 | 24226ms | - |
| python-pygame | openai | YES | 206 | 4504ms | - |
| lua-love | gemini | YES | 196 | 22520ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 199 | 4702ms | Warning: luac/luajit not found, syntax not verified |

### Task: multi_wave_spawner

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 73 | 0ms | - |
| vibe | openai | YES | 354 | 0ms | - |
| python-pygame | gemini | NO | 304 | 36054ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 338 | 9410ms | - |
| lua-love | gemini | YES | 81 | 33662ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 374 | 8934ms | Warning: luac/luajit not found, syntax not verified |

### Task: orbital_mechanics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 106 | 0ms | - |
| vibe | openai | YES | 112 | 0ms | - |
| python-pygame | gemini | YES | 152 | 21669ms | - |
| python-pygame | openai | YES | 185 | 5598ms | - |
| lua-love | gemini | YES | 148 | 20846ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 157 | 5533ms | Warning: luac/luajit not found, syntax not verified |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 237 | 0ms | - |
| vibe | openai | YES | 210 | 0ms | - |
| python-pygame | gemini | NO | 48 | 36403ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 300 | 7508ms | - |
| lua-love | gemini | YES | 290 | 31518ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 316 | 5597ms | Warning: luac/luajit not found, syntax not verified |

### Task: twin_stick_dodge

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 334 | 0ms | - |
| vibe | openai | YES | 307 | 0ms | - |
| python-pygame | gemini | NO | 114 | 34901ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 318 | 10571ms | - |
| lua-love | gemini | YES | 69 | 35297ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 344 | 8993ms | Warning: luac/luajit not found, syntax not verified |

### Task: flocking_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 50 | 0ms | - |
| vibe | openai | YES | 253 | 0ms | - |
| python-pygame | gemini | YES | 207 | 26890ms | - |
| python-pygame | openai | YES | 248 | 6037ms | - |
| lua-love | gemini | YES | 340 | 32896ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 296 | 7344ms | Warning: luac/luajit not found, syntax not verified |

### Task: platformer_level

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 199 | 0ms | - |
| vibe | openai | YES | 216 | 0ms | - |
| python-pygame | gemini | NO | 42 | 35029ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 266 | 7751ms | - |
| lua-love | gemini | YES | 230 | 36804ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 269 | 7096ms | Warning: luac/luajit not found, syntax not verified |

### Task: minimap_radar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 216 | 0ms | - |
| vibe | openai | YES | 213 | 0ms | - |
| python-pygame | gemini | NO | 168 | 36674ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 257 | 6513ms | - |
| lua-love | gemini | YES | 162 | 33485ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 237 | 6723ms | Warning: luac/luajit not found, syntax not verified |

### Task: chain_reaction

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 250 | 0ms | - |
| vibe | openai | YES | 213 | 0ms | - |
| python-pygame | gemini | YES | 241 | 29377ms | - |
| python-pygame | openai | NO | 238 | 8115ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| lua-love | gemini | YES | 116 | 34185ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 224 | 6341ms | Warning: luac/luajit not found, syntax not verified |
