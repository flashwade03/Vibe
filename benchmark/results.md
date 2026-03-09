# LLM Code Generation Benchmark Results

**Generated**: 2026-03-09T14:13:48.773Z

## Summary

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | gemini | 100% (20/20) | 62 | 20347ms |
| lua-love | openai | 100% (20/20) | 190 | 5501ms |
| python-pygame | gemini | 20% (4/20) | 60 | 19436ms |
| python-pygame | openai | 100% (20/20) | 190 | 6362ms |
| vibe | claude | **100% (20/20)** | 187 | - |
| vibe | gemini | 55% (11/20) | 57 | 18443ms |
| vibe | openai | 95% (19/20) | 154 | 4993ms |

### Claude Vibe Benchmark (Sub-agent)

Claude Opus 4.6 서브에이전트로 실행. Vibe 시스템 프롬프트만 제공, API 레이턴시 미측정.

| Task | Pass | Tokens |
|------|------|--------|
| move_rectangle | YES | 71 |
| bouncing_ball | YES | 86 |
| score_counter | YES | 33 |
| color_changing_rect | YES | 124 |
| enemy_follow | YES | 158 |
| shooting | YES | 111 |
| circle_collision | YES | 148 |
| gravity_jump | YES | 142 |
| countdown_timer | YES | 52 |
| particle_burst | YES | 149 |
| state_machine_game | YES | 202 |
| snake_movement | YES | 245 |
| multi_wave_spawner | YES | 317 |
| orbital_mechanics | YES | 134 |
| breakout_game | YES | 327 |
| twin_stick_dodge | YES | 384 |
| flocking_simulation | YES | 302 |
| platformer_level | YES | 280 |
| minimap_radar | YES | 319 |
| chain_reaction | YES | 284 |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 60 | 16497ms | - |
| vibe | openai | YES | 60 | 1706ms | - |
| python-pygame | gemini | YES | 88 | 22127ms | - |
| python-pygame | openai | YES | 95 | 2032ms | - |
| lua-love | gemini | YES | 76 | 13351ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 74 | 1178ms | Warning: luac/luajit not found, syntax not verified |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 64 | 11091ms | - |
| vibe | openai | YES | 64 | 3095ms | - |
| python-pygame | gemini | YES | 123 | 17294ms | - |
| python-pygame | openai | YES | 112 | 3325ms | - |
| lua-love | gemini | YES | 109 | 12669ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 109 | 1639ms | Warning: luac/luajit not found, syntax not verified |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 6557ms | - |
| vibe | openai | YES | 25 | 828ms | - |
| python-pygame | gemini | YES | 75 | 16222ms | - |
| python-pygame | openai | YES | 81 | 1933ms | - |
| lua-love | gemini | YES | 46 | 11811ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 40 | 2281ms | Warning: luac/luajit not found, syntax not verified |

### Task: color_changing_rect

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 72 | 17074ms | - |
| vibe | openai | YES | 72 | 1429ms | - |
| python-pygame | gemini | NO | 64 | 19365ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 111 | 2298ms | - |
| lua-love | gemini | YES | 91 | 18440ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 86 | 1761ms | Warning: luac/luajit not found, syntax not verified |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 29 | 18637ms | unexpected token NEWLINE ("") |
| vibe | openai | YES | 120 | 2452ms | - |
| python-pygame | gemini | NO | 114 | 19088ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 149 | 5267ms | - |
| lua-love | gemini | YES | 155 | 47944ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 178 | 3918ms | Warning: luac/luajit not found, syntax not verified |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 92 | 19736ms | - |
| vibe | openai | YES | 91 | 3106ms | - |
| python-pygame | gemini | NO | 23 | 21003ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 137 | 4180ms | - |
| lua-love | gemini | YES | 119 | 19113ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 2601ms | Warning: luac/luajit not found, syntax not verified |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 28 | 24307ms | unexpected token EOF ("") |
| vibe | openai | YES | 128 | 3805ms | - |
| python-pygame | gemini | NO | 98 | 20090ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 188 | 4214ms | - |
| lua-love | gemini | YES | 30 | 25558ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 170 | 3453ms | Warning: luac/luajit not found, syntax not verified |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 84 | 17064ms | - |
| vibe | openai | YES | 86 | 2028ms | - |
| python-pygame | gemini | NO | 24 | 19057ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 123 | 2839ms | - |
| lua-love | gemini | YES | 104 | 15030ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 105 | 3056ms | Warning: luac/luajit not found, syntax not verified |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 0 | 0ms | API error: fetch failed |
| vibe | openai | YES | 41 | 1897ms | - |
| python-pygame | gemini | YES | 84 | 14553ms | - |
| python-pygame | openai | YES | 94 | 3991ms | - |
| lua-love | gemini | YES | 45 | 14205ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 54 | 1846ms | Warning: luac/luajit not found, syntax not verified |

### Task: particle_burst

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 13307ms | - |
| vibe | openai | YES | 144 | 3437ms | - |
| python-pygame | gemini | NO | 29 | 18390ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 147 | 5402ms | - |
| lua-love | gemini | YES | 30 | 19435ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 146 | 3822ms | Warning: luac/luajit not found, syntax not verified |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 180 | 18908ms | - |
| vibe | openai | YES | 172 | 5455ms | - |
| python-pygame | gemini | NO | 25 | 19471ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 227 | 16030ms | - |
| lua-love | gemini | YES | 30 | 28441ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 191 | 4064ms | Warning: luac/luajit not found, syntax not verified |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 21 | 27497ms | expected EQ, got NEWLINE ("") |
| vibe | openai | YES | 187 | 6435ms | - |
| python-pygame | gemini | NO | 21 | 20445ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 196 | 4974ms | - |
| lua-love | gemini | YES | 23 | 20318ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 203 | 4713ms | Warning: luac/luajit not found, syntax not verified |

### Task: multi_wave_spawner

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 35 | 19867ms | - |
| vibe | openai | NO | 350 | 14958ms | expected EQ, got NEWLINE ("") |
| python-pygame | gemini | NO | 27 | 21007ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 365 | 11585ms | - |
| lua-love | gemini | YES | 45 | 20795ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 406 | 7512ms | Warning: luac/luajit not found, syntax not verified |

### Task: orbital_mechanics

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 106 | 16162ms | - |
| vibe | openai | YES | 98 | 3266ms | - |
| python-pygame | gemini | NO | 136 | 19527ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 167 | 7390ms | - |
| lua-love | gemini | YES | 145 | 16983ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 163 | 5211ms | Warning: luac/luajit not found, syntax not verified |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 32 | 39856ms | expected EQ, got NEWLINE ("") |
| vibe | openai | YES | 207 | 8573ms | - |
| python-pygame | gemini | NO | 21 | 20191ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 295 | 6851ms | - |
| lua-love | gemini | YES | 37 | 19868ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 325 | 6743ms | Warning: luac/luajit not found, syntax not verified |

### Task: twin_stick_dodge

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 33 | 20633ms | expected EQ, got NEWLINE ("") |
| vibe | openai | YES | 332 | 8943ms | - |
| python-pygame | gemini | NO | 25 | 20590ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 315 | 10656ms | - |
| lua-love | gemini | YES | 43 | 20616ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 386 | 11243ms | Warning: luac/luajit not found, syntax not verified |

### Task: flocking_simulation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 33 | 20126ms | unexpected character: '`' |
| vibe | openai | YES | 248 | 6009ms | - |
| python-pygame | gemini | NO | 130 | 20398ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 248 | 7342ms | - |
| lua-love | gemini | YES | 16 | 20217ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 298 | 21188ms | Warning: luac/luajit not found, syntax not verified |

### Task: platformer_level

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 32 | 20384ms | expected IDENT, got EOF ("") |
| vibe | openai | YES | 221 | 9307ms | - |
| python-pygame | gemini | NO | 21 | 19204ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 266 | 7313ms | - |
| lua-love | gemini | YES | 34 | 20820ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 269 | 7775ms | Warning: luac/luajit not found, syntax not verified |

### Task: minimap_radar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 34 | 20168ms | - |
| vibe | openai | YES | 212 | 6561ms | - |
| python-pygame | gemini | NO | 24 | 20418ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 257 | 12028ms | - |
| lua-love | gemini | YES | 26 | 20661ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 256 | 10849ms | Warning: luac/luajit not found, syntax not verified |

### Task: chain_reaction

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | NO | 43 | 20988ms | unexpected character: '`' |
| vibe | openai | YES | 213 | 6562ms | - |
| python-pygame | gemini | NO | 46 | 20288ms | Traceback (most recent call last):   File "/opt/anaconda3/lib/python3.12/py_comp |
| python-pygame | openai | YES | 231 | 7586ms | - |
| lua-love | gemini | YES | 44 | 20664ms | Warning: luac/luajit not found, syntax not verified |
| lua-love | openai | YES | 237 | 5174ms | Warning: luac/luajit not found, syntax not verified |
