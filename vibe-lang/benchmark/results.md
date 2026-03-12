# LLM Code Generation Benchmark Results

**Generated**: 2026-03-13

## Summary

> Note: "Syntax Pass Rate" measures whether generated code is syntactically valid and transpiles to valid Lua. Runtime behavioral correctness is not yet measured.

### Official Generator (Claude Code with project context)

| Language | Claude |
|----------|--------|
| **Vibe** | **100% (38/38)** |

### Third-party LLMs (API with system prompt only)

| Language | LLM | Syntax Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|------------------|------------|-------------|
| vibe | gemini | 100% (38/38) | 165 | 3578ms |
| vibe | openai | 71% (27/38) | 169 | 13492ms |
| python-pygame | gemini | 100% (38/38) | 207 | 3637ms |
| python-pygame | openai | 100% (38/38) | 207 | 7142ms |
| lua-love | gemini | 100% (38/38) | 203 | 3488ms |
| lua-love | openai | 100% (38/38) | 211 | 7526ms |

## Analysis

### Vibe Syntax Pass Rate by LLM
- **Claude**: 100% — 공식 코드 생성기 (프로젝트 컨텍스트 포함, production 설정)
- **Gemini**: 100% — 프롬프트 개선 후 `tower_defense_path` 포함 전체 통과
- **OpenAI**: 71% — 이전 66%에서 개선. `:` 메서드 호출 구문(파서 미지원)과 dict 리터럴이 주요 실패 원인

### OpenAI 실패 패턴 분류 (11건)
| 패턴 | 건수 | 원인 | 태스크 |
|------|------|------|--------|
| `:` 메서드 호출 (파서 미지원) | 4 | `pos:lerp()`, `obj:draw()` 등 문서화되었으나 미구현 | mouse_follower, waypoint_patrol, trait_drawable, enemy_wave_loop |
| `:` dict 리터럴 (파서 미지원) | 2 | `{"key": val}` Map 리터럴 구문 | snake_movement, highscore_table |
| COLON `:` 메서드+dict 혼합 | 1 | 메서드 호출과 dict 리터럴 동시 사용 | tower_defense_path |
| LPAREN (잘못된 구문) | 2 | enum variant 파라미터, trait 메서드 구문 | enum_with_data, trait_updatable |
| DEDENT (들여쓰기 오류) | 1 | struct 본문 들여쓰기 | struct_basic |
| KW_IF (구문 오류) | 1 | 조건식 위치 오류 | pathfinding_viz |

### 프롬프트 개선 효과 (v0.1 → v0.2)
| 지표 | 이전 | 이번 | 변화 |
|------|------|------|------|
| Gemini Vibe | 97% (37/38) | 100% (38/38) | +3% |
| OpenAI Vibe | 66% (25/38) | 71% (27/38) | +5% |
| OpenAI Lua | 92% (35/38) | 100% (38/38) | +8% |

**새로 통과**: asteroid_field, space_invaders, particle_emitter_system, struct_methods, struct_list_management (+5)
**새로 실패**: snake_movement, highscore_table, struct_basic (-3, 비결정적)

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 63 | 2164ms | - |
| vibe | openai | YES | 63 | 3508ms | - |
| python-pygame | gemini | YES | 101 | 2259ms | - |
| python-pygame | openai | YES | 97 | 4320ms | - |
| lua-love | gemini | YES | 78 | 2116ms | - |
| lua-love | openai | YES | 74 | 3784ms | - |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 67 | 2126ms | - |
| vibe | openai | YES | 64 | 1774ms | - |
| python-pygame | gemini | YES | 136 | 2792ms | - |
| python-pygame | openai | YES | 118 | 3910ms | - |
| lua-love | gemini | YES | 95 | 1544ms | - |
| lua-love | openai | YES | 81 | 3374ms | - |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 28 | 2378ms | - |
| vibe | openai | YES | 25 | 2224ms | - |
| python-pygame | gemini | YES | 94 | 2585ms | - |
| python-pygame | openai | YES | 70 | 3146ms | - |
| lua-love | gemini | YES | 48 | 1278ms | - |
| lua-love | openai | YES | 42 | 2692ms | - |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 80 | 1849ms | - |
| vibe | openai | NO | 61 | 8733ms | expected NEWLINE, got COLON (":") |
| python-pygame | gemini | YES | 155 | 3781ms | - |
| python-pygame | openai | YES | 128 | 5323ms | - |
| lua-love | gemini | YES | 117 | 5152ms | - |
| lua-love | openai | YES | 98 | 3198ms | - |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 82 | 2965ms | - |
| vibe | openai | YES | 85 | 3098ms | - |
| python-pygame | gemini | YES | 137 | 3796ms | - |
| python-pygame | openai | YES | 118 | 5344ms | - |
| lua-love | gemini | YES | 84 | 2387ms | - |
| lua-love | openai | YES | 111 | 5189ms | - |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 143 | 2560ms | - |
| vibe | openai | YES | 148 | 4727ms | - |
| python-pygame | gemini | YES | 172 | 3303ms | - |
| python-pygame | openai | YES | 159 | 9061ms | - |
| lua-love | gemini | YES | 176 | 2810ms | - |
| lua-love | openai | YES | 166 | 5340ms | - |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 120 | 2763ms | - |
| vibe | openai | YES | 114 | 6354ms | - |
| python-pygame | gemini | YES | 172 | 3767ms | - |
| python-pygame | openai | YES | 129 | 4766ms | - |
| lua-love | gemini | YES | 143 | 3926ms | - |
| lua-love | openai | YES | 153 | 13789ms | - |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 124 | 3588ms | - |
| vibe | openai | YES | 155 | 12639ms | - |
| python-pygame | gemini | YES | 187 | 4075ms | - |
| python-pygame | openai | YES | 177 | 9636ms | - |
| lua-love | gemini | YES | 200 | 3625ms | - |
| lua-love | openai | YES | 195 | 7310ms | - |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 116 | 2494ms | - |
| vibe | openai | YES | 121 | 11482ms | - |
| python-pygame | gemini | YES | 163 | 4650ms | - |
| python-pygame | openai | YES | 151 | 4618ms | - |
| lua-love | gemini | YES | 152 | 3198ms | - |
| lua-love | openai | YES | 128 | 4638ms | - |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 47 | 2072ms | - |
| vibe | openai | YES | 41 | 2055ms | - |
| python-pygame | gemini | YES | 94 | 2858ms | - |
| python-pygame | openai | YES | 84 | 3483ms | - |
| lua-love | gemini | YES | 79 | 2578ms | - |
| lua-love | openai | YES | 83 | 3593ms | - |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 122 | 3227ms | - |
| vibe | openai | YES | 131 | 5281ms | - |
| python-pygame | gemini | YES | 186 | 4161ms | - |
| python-pygame | openai | YES | 162 | 7212ms | - |
| lua-love | gemini | YES | 149 | 3099ms | - |
| lua-love | openai | YES | 164 | 6729ms | - |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 146 | 3070ms | - |
| vibe | openai | NO | 92 | 15247ms | expected NEWLINE, got COLON (":") |
| python-pygame | gemini | YES | 172 | 3182ms | - |
| python-pygame | openai | YES | 175 | 7149ms | - |
| lua-love | gemini | YES | 184 | 2420ms | - |
| lua-love | openai | YES | 174 | 5270ms | - |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 183 | 4040ms | - |
| vibe | openai | YES | 186 | 12909ms | - |
| python-pygame | gemini | YES | 221 | 4429ms | - |
| python-pygame | openai | YES | 193 | 6835ms | - |
| lua-love | gemini | YES | 240 | 4350ms | - |
| lua-love | openai | YES | 290 | 8339ms | - |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 151 | 3698ms | - |
| vibe | openai | YES | 163 | 17051ms | - |
| python-pygame | gemini | YES | 204 | 4052ms | - |
| python-pygame | openai | YES | 187 | 6855ms | - |
| lua-love | gemini | YES | 193 | 3435ms | - |
| lua-love | openai | YES | 187 | 6666ms | - |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 169 | 2570ms | - |
| vibe | openai | YES | 171 | 7614ms | - |
| python-pygame | gemini | YES | 208 | 3915ms | - |
| python-pygame | openai | YES | 279 | 8069ms | - |
| lua-love | gemini | YES | 199 | 2704ms | - |
| lua-love | openai | YES | 227 | 7460ms | - |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 190 | 3777ms | - |
| vibe | openai | NO | 144 | 20315ms | expected RBRACKET, got COLON (":") |
| python-pygame | gemini | YES | 208 | 3469ms | - |
| python-pygame | openai | YES | 193 | 6273ms | - |
| lua-love | gemini | YES | 190 | 2162ms | - |
| lua-love | openai | YES | 218 | 7227ms | - |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 211 | 4670ms | - |
| vibe | openai | YES | 321 | 12859ms | - |
| python-pygame | gemini | YES | 239 | 3006ms | - |
| python-pygame | openai | YES | 226 | 7425ms | - |
| lua-love | gemini | YES | 271 | 3964ms | - |
| lua-love | openai | YES | 324 | 8650ms | - |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 303 | 4732ms | - |
| vibe | openai | YES | 271 | 21424ms | - |
| python-pygame | gemini | YES | 284 | 4269ms | - |
| python-pygame | openai | YES | 300 | 8346ms | - |
| lua-love | gemini | YES | 339 | 3743ms | - |
| lua-love | openai | YES | 422 | 11738ms | - |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 272 | 2966ms | - |
| vibe | openai | YES | 258 | 7741ms | - |
| python-pygame | gemini | YES | 272 | 4619ms | - |
| python-pygame | openai | YES | 257 | 6352ms | - |
| lua-love | gemini | YES | 321 | 4723ms | - |
| lua-love | openai | YES | 306 | 17603ms | - |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 295 | 8114ms | - |
| vibe | openai | NO | 332 | 50780ms | expected NEWLINE, got COLON (":") |
| python-pygame | gemini | YES | 304 | 4942ms | - |
| python-pygame | openai | YES | 428 | 13883ms | - |
| lua-love | gemini | YES | 444 | 5444ms | - |
| lua-love | openai | YES | 475 | 16096ms | - |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 173 | 4011ms | - |
| vibe | openai | YES | 217 | 23135ms | - |
| python-pygame | gemini | YES | 265 | 4505ms | - |
| python-pygame | openai | YES | 276 | 9404ms | - |
| lua-love | gemini | YES | 294 | 4394ms | - |
| lua-love | openai | YES | 280 | 7155ms | - |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 431 | 6147ms | - |
| vibe | openai | NO | 463 | 40860ms | unexpected token KW_IF ("if") |
| python-pygame | gemini | YES | 364 | 3696ms | - |
| python-pygame | openai | YES | 386 | 12378ms | - |
| lua-love | gemini | YES | 427 | 5520ms | - |
| lua-love | openai | YES | 476 | 18158ms | - |

### Task: debug_hud

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 162 | 2954ms | - |
| vibe | openai | YES | 149 | 5199ms | - |
| python-pygame | gemini | YES | 181 | 3283ms | - |
| python-pygame | openai | YES | 169 | 5630ms | - |
| lua-love | gemini | YES | 192 | 6552ms | - |
| lua-love | openai | YES | 157 | 7435ms | - |

### Task: game_state_manager

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 206 | 3484ms | - |
| vibe | openai | YES | 236 | 8090ms | - |
| python-pygame | gemini | YES | 223 | 2786ms | - |
| python-pygame | openai | YES | 299 | 10634ms | - |
| lua-love | gemini | YES | 233 | 3474ms | - |
| lua-love | openai | YES | 268 | 8642ms | - |

### Task: combat_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 148 | 2190ms | - |
| vibe | openai | YES | 119 | 11319ms | - |
| python-pygame | gemini | YES | 232 | 4257ms | - |
| python-pygame | openai | YES | 247 | 15173ms | - |
| lua-love | gemini | YES | 162 | 3248ms | - |
| lua-love | openai | YES | 161 | 5836ms | - |

### Task: enemy_wave_loop

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 341 | 5002ms | - |
| vibe | openai | NO | 301 | 31553ms | expected NEWLINE, got COLON (":") |
| python-pygame | gemini | YES | 368 | 5644ms | - |
| python-pygame | openai | YES | 266 | 8761ms | - |
| lua-love | gemini | YES | 399 | 4190ms | - |
| lua-love | openai | YES | 372 | 10197ms | - |

### Task: tic_tac_toe

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 314 | 7782ms | - |
| vibe | openai | YES | 321 | 32719ms | - |
| python-pygame | gemini | YES | 322 | 4283ms | - |
| python-pygame | openai | YES | 368 | 9659ms | - |
| lua-love | gemini | YES | 343 | 4659ms | - |
| lua-love | openai | YES | 357 | 10438ms | - |

### Task: rpg_battle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 225 | 3728ms | - |
| vibe | openai | YES | 274 | 7729ms | - |
| python-pygame | gemini | YES | 256 | 3475ms | - |
| python-pygame | openai | YES | 263 | 7150ms | - |
| lua-love | gemini | YES | 282 | 3949ms | - |
| lua-love | openai | YES | 249 | 6684ms | - |

### Task: particle_emitter_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 140 | 2459ms | - |
| vibe | openai | YES | 151 | 14413ms | - |
| python-pygame | gemini | YES | 194 | 3090ms | - |
| python-pygame | openai | YES | 202 | 5977ms | - |
| lua-love | gemini | YES | 190 | 3133ms | - |
| lua-love | openai | YES | 185 | 5200ms | - |

### Task: highscore_table

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 226 | 3692ms | - |
| vibe | openai | NO | 192 | 20309ms | expected RBRACKET, got COLON (":") |
| python-pygame | gemini | YES | 207 | 3491ms | - |
| python-pygame | openai | YES | 254 | 7972ms | - |
| lua-love | gemini | YES | 215 | 4228ms | - |
| lua-love | openai | YES | 215 | 7667ms | - |

### Task: struct_basic

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 54 | 1653ms | - |
| vibe | openai | NO | 62 | 8147ms | unexpected token DEDENT ("") |
| python-pygame | gemini | YES | 159 | 2513ms | - |
| python-pygame | openai | YES | 123 | 3532ms | - |
| lua-love | gemini | YES | 99 | 2547ms | - |
| lua-love | openai | YES | 109 | 3807ms | - |

### Task: struct_methods

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 5160ms | - |
| vibe | openai | YES | 127 | 3903ms | - |
| python-pygame | gemini | YES | 215 | 3285ms | - |
| python-pygame | openai | YES | 156 | 6399ms | - |
| lua-love | gemini | YES | 156 | 3653ms | - |
| lua-love | openai | YES | 137 | 4930ms | - |

### Task: enum_state_machine

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 82 | 1926ms | - |
| vibe | openai | YES | 68 | 2891ms | - |
| python-pygame | gemini | YES | 164 | 3020ms | - |
| python-pygame | openai | YES | 164 | 6885ms | - |
| lua-love | gemini | YES | 133 | 2646ms | - |
| lua-love | openai | YES | 116 | 3726ms | - |

### Task: enum_with_data

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 2918ms | - |
| vibe | openai | NO | 171 | 19381ms | expected NEWLINE, got LPAREN ("(") |
| python-pygame | gemini | YES | 209 | 3761ms | - |
| python-pygame | openai | YES | 216 | 6280ms | - |
| lua-love | gemini | YES | 200 | 3181ms | - |
| lua-love | openai | YES | 223 | 8819ms | - |

### Task: struct_composition

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 124 | 2822ms | - |
| vibe | openai | YES | 132 | 10005ms | - |
| python-pygame | gemini | YES | 213 | 3356ms | - |
| python-pygame | openai | YES | 191 | 4743ms | - |
| lua-love | gemini | YES | 185 | 2847ms | - |
| lua-love | openai | YES | 184 | 7880ms | - |

### Task: trait_drawable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 112 | 2554ms | - |
| vibe | openai | NO | 124 | 14752ms | expected NEWLINE, got COLON (":") |
| python-pygame | gemini | YES | 180 | 3289ms | - |
| python-pygame | openai | YES | 192 | 5870ms | - |
| lua-love | gemini | YES | 148 | 2738ms | - |
| lua-love | openai | YES | 188 | 7994ms | - |

### Task: trait_updatable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 233 | 8204ms | - |
| vibe | openai | NO | 236 | 23153ms | expected IDENT, got LPAREN ("(") |
| python-pygame | gemini | YES | 259 | 3170ms | - |
| python-pygame | openai | YES | 261 | 7153ms | - |
| lua-love | gemini | YES | 219 | 3467ms | - |
| lua-love | openai | YES | 249 | 8369ms | - |

### Task: struct_list_management

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 104 | 3467ms | - |
| vibe | openai | YES | 137 | 7316ms | - |
| python-pygame | gemini | YES | 162 | 3393ms | - |
| python-pygame | openai | YES | 192 | 5798ms | - |
| lua-love | gemini | YES | 127 | 3450ms | - |
| lua-love | openai | YES | 168 | 4351ms | - |
