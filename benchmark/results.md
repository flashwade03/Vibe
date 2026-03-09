# LLM Code Generation Benchmark Results

**Generated**: 2026-03-09T16:27:36.144Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 100% (20/20) | 76 | 19135ms |
| lua-love | openai | 100% (20/20) | 184 | 5441ms |
| python-pygame | gemini | 30% (6/20) | 60 | 18864ms |
| python-pygame | openai | 100% (20/20) | 194 | 6313ms |
| vibe | claude | **100% (20/20)** | 187 | - |
| vibe | gemini | 90% (18/20) | 79 | 0ms |
| vibe | openai | 95% (19/20) | 160 | 0ms |

### Claude Vibe Benchmark (Sub-agent)

Claude Opus 4.6 서브에이전트로 실행. Vibe 시스템 프롬프트만 제공, API 레이턴시 미측정.

| Task | Pass | Tokens |
|------|------|--------|
| move_rectangle | YES | 72 |
| bouncing_ball | YES | 86 |
| score_counter | YES | 33 |
| color_changing_rect | YES | 84 |
| enemy_follow | YES | 167 |
| shooting | YES | 105 |
| circle_collision | YES | 172 |
| gravity_jump | YES | 121 |
| countdown_timer | YES | 51 |
| particle_burst | YES | 141 |
| state_machine_game | YES | 185 |
| snake_movement | YES | 232 |
| multi_wave_spawner | YES | 401 |
| orbital_mechanics | YES | 133 |
| breakout_game | YES | 321 |
| twin_stick_dodge | YES | 395 |
| flocking_simulation | YES | 305 |
| platformer_level | YES | 297 |
| minimap_radar | YES | 291 |
| chain_reaction | YES | 265 |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 60 | 0ms | - |
| vibe | openai | YES | 60 | 0ms | - |
| python-pygame | gemini | YES | 87 | 13864ms | - |
| python-pygame | openai | YES | 96 | 3300ms | - |
| lua-love | gemini | YES | 77 | 12504ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 74 | 2849ms | Warning: luac/luajit not found, syntax not verified |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 73 | 0ms | - |
| vibe | openai | YES | 64 | 0ms | - |
| python-pygame | gemini | YES | 123 | 15095ms | - |
| python-pygame | openai | YES | 112 | 3742ms | - |
| lua-love | gemini | YES | 109 | 11329ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 85 | 1931ms | Warning: luac/luajit not found, syntax not verified |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 0ms | - |
| vibe | openai | YES | 25 | 0ms | - |
| python-pygame | gemini | YES | 72 | 13457ms | - |
| python-pygame | openai | YES | 81 | 5447ms | - |
| lua-love | gemini | YES | 43 | 17406ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 40 | 2790ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_changing_rect

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 72 | 0ms | - |
| vibe | openai | YES | 64 | 0ms | - |
| python-pygame | gemini | NO | 97 | 21105ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 118 | 4472ms | - |
| lua-love | gemini | YES | 31 | 26810ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 86 | 3586ms | Warning: luac/luajit not found, syntax not verified |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 30 | 0ms | - |
| vibe | openai | YES | 137 | 0ms | - |
| python-pygame | gemini | YES | 148 | 18848ms | - |
| python-pygame | openai | YES | 149 | 3289ms | - |
| lua-love | gemini | YES | 178 | 19066ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 178 | 7453ms | Warning: luac/luajit not found, syntax not verified |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 92 | 0ms | - |
| vibe | openai | YES | 97 | 0ms | - |
| python-pygame | gemini | NO | 85 | 19811ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 132 | 4398ms | - |
| lua-love | gemini | YES | 104 | 15222ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 2770ms | Warning: luac/luajit not found, syntax not verified |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 132 | 0ms | - |
| vibe | openai | YES | 128 | 0ms | - |
| python-pygame | gemini | NO | 27 | 19058ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 191 | 7859ms | - |
| lua-love | gemini | YES | 175 | 18600ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 161 | 4747ms | Warning: luac/luajit not found, syntax not verified |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 99 | 0ms | - |
| vibe | openai | YES | 86 | 0ms | - |
| python-pygame | gemini | YES | 123 | 19243ms | - |
| python-pygame | openai | YES | 116 | 2675ms | - |
| lua-love | gemini | YES | 106 | 15241ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 2352ms | Warning: luac/luajit not found, syntax not verified |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 34 | 0ms | - |
| vibe | openai | YES | 41 | 0ms | - |
| python-pygame | gemini | YES | 84 | 16315ms | - |
| python-pygame | openai | YES | 94 | 2425ms | - |
| lua-love | gemini | YES | 45 | 15712ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 54 | 1743ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_burst

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 130 | 0ms | - |
| vibe | openai | YES | 136 | 0ms | - |
| python-pygame | gemini | NO | 29 | 18753ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 147 | 3247ms | - |
| lua-love | gemini | YES | 37 | 27482ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 148 | 4841ms | Warning: luac/luajit not found, syntax not verified |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 180 | 0ms | - |
| vibe | openai | YES | 174 | 0ms | - |
| python-pygame | gemini | NO | 26 | 19286ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 253 | 9397ms | - |
| lua-love | gemini | YES | 94 | 19761ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 195 | 6640ms | Warning: luac/luajit not found, syntax not verified |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 21 | 0ms | expected EQ, got NEWLINE ("") |
| vibe | openai | YES | 182 | 0ms | - |
| python-pygame | gemini | NO | 20 | 20769ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 200 | 4949ms | - |
| lua-love | gemini | YES | 139 | 19254ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 203 | 4296ms | Warning: luac/luajit not found, syntax not verified |

### Task: multi_wave_spawner

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 35 | 0ms | - |
| vibe | openai | NO | 350 | 0ms | expected EQ, got NEWLINE ("") |
| python-pygame | gemini | NO | 26 | 19355ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 359 | 11780ms | - |
| lua-love | gemini | YES | 45 | 21760ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 409 | 9677ms | Warning: luac/luajit not found, syntax not verified |

### Task: orbital_mechanics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 106 | 0ms | - |
| vibe | openai | YES | 98 | 0ms | - |
| python-pygame | gemini | NO | 105 | 18940ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 173 | 7245ms | - |
| lua-love | gemini | YES | 141 | 16691ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 160 | 6361ms | Warning: luac/luajit not found, syntax not verified |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 209 | 0ms | - |
| vibe | openai | YES | 269 | 0ms | - |
| python-pygame | gemini | NO | 21 | 20333ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 297 | 9117ms | - |
| lua-love | gemini | YES | 33 | 21943ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 297 | 7287ms | Warning: luac/luajit not found, syntax not verified |

### Task: twin_stick_dodge

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 35 | 0ms | - |
| vibe | openai | YES | 332 | 0ms | - |
| python-pygame | gemini | NO | 25 | 21628ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 328 | 15021ms | - |
| lua-love | gemini | YES | 42 | 20082ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 346 | 10771ms | Warning: luac/luajit not found, syntax not verified |

### Task: flocking_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 33 | 0ms | - |
| vibe | openai | YES | 273 | 0ms | - |
| python-pygame | gemini | NO | 25 | 19085ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 269 | 7781ms | - |
| lua-love | gemini | YES | 26 | 22085ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 298 | 10731ms | Warning: luac/luajit not found, syntax not verified |

### Task: platformer_level

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 147 | 0ms | expected IDENT, got NEWLINE ("") |
| vibe | openai | YES | 222 | 0ms | - |
| python-pygame | gemini | NO | 21 | 20091ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 275 | 7366ms | - |
| lua-love | gemini | YES | 34 | 20800ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 266 | 8028ms | Warning: luac/luajit not found, syntax not verified |

### Task: minimap_radar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 36 | 0ms | - |
| vibe | openai | YES | 219 | 0ms | - |
| python-pygame | gemini | NO | 24 | 22887ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 257 | 6352ms | - |
| lua-love | gemini | YES | 26 | 20129ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 250 | 5044ms | Warning: luac/luajit not found, syntax not verified |

### Task: chain_reaction

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 40 | 0ms | - |
| vibe | openai | YES | 245 | 0ms | - |
| python-pygame | gemini | NO | 27 | 19363ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 231 | 6400ms | - |
| lua-love | gemini | YES | 31 | 20832ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 221 | 4929ms | Warning: luac/luajit not found, syntax not verified |
