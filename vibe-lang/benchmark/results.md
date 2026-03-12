# LLM Code Generation Benchmark Results

**Generated**: 2026-03-13

> Note: "Syntax Pass Rate" measures whether generated code is syntactically valid and transpiles to valid Lua. Runtime behavioral correctness is not yet measured.

## Summary

### Official Generator (Claude Code with project context)

| Language | Claude |
|----------|--------|
| **Vibe** | **100% (38/38)** |

### Third-party LLMs (API with system prompt only)

| Language | LLM | Syntax Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|------------------|------------|-------------|
| vibe | gemini | 100% (38/38) | 161 | 3256ms |
| vibe | openai | 87% (33/38) | 170 | 11448ms |
| python-pygame | gemini | 100% (38/38) | 206 | 3397ms |
| python-pygame | openai | 100% (38/38) | 204 | 7030ms |
| lua-love | gemini | 100% (38/38) | 203 | 3254ms |
| lua-love | openai | 100% (38/38) | 211 | 7224ms |

## Analysis

### Vibe Syntax Pass Rate by LLM
- **Claude**: 100% — 공식 코드 생성기 (프로젝트 컨텍스트 포함)
- **Gemini**: 100% — 3회 연속 100% 달성
- **OpenAI**: 87% — 이전 71%에서 +16%p 개선 (프롬프트에서 `:` 메서드 구문 제거 효과)

### 프롬프트 개선 이력
| 버전 | 변경 내용 | Gemini | OpenAI |
|------|----------|--------|--------|
| v0.1 | 초기 프롬프트 | 97% | 66% |
| v0.2 | struct/enum 예제 + DO NOT 확장 | 100% | 71% |
| v0.3 | `:` 메서드 구문 → 자유 함수로 교체 | 100% | 87% |

### OpenAI 잔여 실패 (5건)
| 패턴 | 건수 | 태스크 |
|------|------|--------|
| COMMA (dict/tuple 리터럴) | 2 | waypoint_patrol, tower_defense_path |
| LPAREN (enum variant / trait 구문) | 2 | enum_with_data, trait_updatable |
| KW_IN (구문 오류) | 1 | pathfinding_viz |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 63 | 1708ms | - |
| vibe | openai | YES | 63 | 2178ms | - |
| python-pygame | gemini | YES | 101 | 2127ms | - |
| python-pygame | openai | YES | 97 | 3850ms | - |
| lua-love | gemini | YES | 78 | 2001ms | - |
| lua-love | openai | YES | 74 | 3405ms | - |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 67 | 1942ms | - |
| vibe | openai | YES | 64 | 2389ms | - |
| python-pygame | gemini | YES | 140 | 2421ms | - |
| python-pygame | openai | YES | 113 | 3968ms | - |
| lua-love | gemini | YES | 95 | 1862ms | - |
| lua-love | openai | YES | 109 | 3830ms | - |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 28 | 1535ms | - |
| vibe | openai | YES | 25 | 1496ms | - |
| python-pygame | gemini | YES | 99 | 2260ms | - |
| python-pygame | openai | YES | 70 | 3457ms | - |
| lua-love | gemini | YES | 48 | 1510ms | - |
| lua-love | openai | YES | 42 | 2461ms | - |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 75 | 1926ms | - |
| vibe | openai | YES | 72 | 3618ms | - |
| python-pygame | gemini | YES | 152 | 2468ms | - |
| python-pygame | openai | YES | 114 | 4616ms | - |
| lua-love | gemini | YES | 120 | 8230ms | - |
| lua-love | openai | YES | 98 | 4631ms | - |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 79 | 1913ms | - |
| vibe | openai | YES | 78 | 3446ms | - |
| python-pygame | gemini | YES | 135 | 2215ms | - |
| python-pygame | openai | YES | 135 | 4479ms | - |
| lua-love | gemini | YES | 84 | 2122ms | - |
| lua-love | openai | YES | 95 | 2854ms | - |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 131 | 2573ms | - |
| vibe | openai | YES | 146 | 4723ms | - |
| python-pygame | gemini | YES | 174 | 3269ms | - |
| python-pygame | openai | YES | 163 | 5648ms | - |
| lua-love | gemini | YES | 174 | 2491ms | - |
| lua-love | openai | YES | 158 | 4807ms | - |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 115 | 2410ms | - |
| vibe | openai | YES | 124 | 5769ms | - |
| python-pygame | gemini | YES | 176 | 3162ms | - |
| python-pygame | openai | YES | 138 | 5830ms | - |
| lua-love | gemini | YES | 143 | 2555ms | - |
| lua-love | openai | YES | 159 | 5190ms | - |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 124 | 2795ms | - |
| vibe | openai | YES | 136 | 6633ms | - |
| python-pygame | gemini | YES | 186 | 3101ms | - |
| python-pygame | openai | YES | 164 | 5907ms | - |
| lua-love | gemini | YES | 200 | 2520ms | - |
| lua-love | openai | YES | 207 | 5487ms | - |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 147 | 2389ms | - |
| vibe | openai | YES | 127 | 4945ms | - |
| python-pygame | gemini | YES | 161 | 2891ms | - |
| python-pygame | openai | YES | 140 | 5658ms | - |
| lua-love | gemini | YES | 152 | 2922ms | - |
| lua-love | openai | YES | 114 | 2964ms | - |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 46 | 1470ms | - |
| vibe | openai | YES | 41 | 2937ms | - |
| python-pygame | gemini | YES | 94 | 2069ms | - |
| python-pygame | openai | YES | 84 | 3860ms | - |
| lua-love | gemini | YES | 79 | 1991ms | - |
| lua-love | openai | YES | 71 | 2799ms | - |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 122 | 2102ms | - |
| vibe | openai | YES | 128 | 4999ms | - |
| python-pygame | gemini | YES | 193 | 2765ms | - |
| python-pygame | openai | YES | 164 | 4595ms | - |
| lua-love | gemini | YES | 155 | 2389ms | - |
| lua-love | openai | YES | 160 | 5128ms | - |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 152 | 2291ms | - |
| vibe | openai | NO | 103 | 13680ms | expected NEWLINE, got COMMA (",") |
| python-pygame | gemini | YES | 171 | 2311ms | - |
| python-pygame | openai | YES | 176 | 6621ms | - |
| lua-love | gemini | YES | 184 | 2743ms | - |
| lua-love | openai | YES | 169 | 5405ms | - |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 170 | 3194ms | - |
| vibe | openai | YES | 228 | 33709ms | - |
| python-pygame | gemini | YES | 218 | 3447ms | - |
| python-pygame | openai | YES | 225 | 7334ms | - |
| lua-love | gemini | YES | 240 | 2916ms | - |
| lua-love | openai | YES | 272 | 7171ms | - |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 157 | 2881ms | - |
| vibe | openai | YES | 154 | 4912ms | - |
| python-pygame | gemini | YES | 178 | 3184ms | - |
| python-pygame | openai | YES | 187 | 7331ms | - |
| lua-love | gemini | YES | 193 | 2831ms | - |
| lua-love | openai | YES | 187 | 6955ms | - |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 160 | 2531ms | - |
| vibe | openai | YES | 178 | 6791ms | - |
| python-pygame | gemini | YES | 214 | 3844ms | - |
| python-pygame | openai | YES | 246 | 8836ms | - |
| lua-love | gemini | YES | 199 | 2781ms | - |
| lua-love | openai | YES | 215 | 5347ms | - |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 190 | 3355ms | - |
| vibe | openai | YES | 166 | 6788ms | - |
| python-pygame | gemini | YES | 197 | 3419ms | - |
| python-pygame | openai | YES | 188 | 5536ms | - |
| lua-love | gemini | YES | 190 | 2537ms | - |
| lua-love | openai | YES | 222 | 7177ms | - |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 212 | 3030ms | - |
| vibe | openai | YES | 322 | 12963ms | - |
| python-pygame | gemini | YES | 233 | 3096ms | - |
| python-pygame | openai | YES | 223 | 10529ms | - |
| lua-love | gemini | YES | 271 | 3202ms | - |
| lua-love | openai | YES | 337 | 8180ms | - |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 272 | 4610ms | - |
| vibe | openai | YES | 335 | 9784ms | - |
| python-pygame | gemini | YES | 284 | 4158ms | - |
| python-pygame | openai | YES | 253 | 7609ms | - |
| lua-love | gemini | YES | 339 | 1930ms | - |
| lua-love | openai | YES | 415 | 9922ms | - |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 290 | 3606ms | - |
| vibe | openai | YES | 240 | 7164ms | - |
| python-pygame | gemini | YES | 268 | 3230ms | - |
| python-pygame | openai | YES | 279 | 7205ms | - |
| lua-love | gemini | YES | 321 | 4849ms | - |
| lua-love | openai | YES | 310 | 10950ms | - |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 336 | 5113ms | - |
| vibe | openai | NO | 341 | 37455ms | expected NEWLINE, got COMMA (",") |
| python-pygame | gemini | YES | 338 | 3878ms | - |
| python-pygame | openai | YES | 476 | 13421ms | - |
| lua-love | gemini | YES | 432 | 4653ms | - |
| lua-love | openai | YES | 429 | 10787ms | - |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 183 | 3121ms | - |
| vibe | openai | YES | 190 | 13766ms | - |
| python-pygame | gemini | YES | 268 | 3781ms | - |
| python-pygame | openai | YES | 248 | 7212ms | - |
| lua-love | gemini | YES | 288 | 2821ms | - |
| lua-love | openai | YES | 295 | 8795ms | - |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 468 | 11926ms | - |
| vibe | openai | NO | 447 | 47674ms | expected NEWLINE, got KW_IN ("in") |
| python-pygame | gemini | YES | 365 | 4557ms | - |
| python-pygame | openai | YES | 383 | 12003ms | - |
| lua-love | gemini | YES | 402 | 4678ms | - |
| lua-love | openai | YES | 502 | 18023ms | - |

### Task: debug_hud

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 160 | 2889ms | - |
| vibe | openai | YES | 151 | 5953ms | - |
| python-pygame | gemini | YES | 183 | 3280ms | - |
| python-pygame | openai | YES | 165 | 5154ms | - |
| lua-love | gemini | YES | 202 | 2986ms | - |
| lua-love | openai | YES | 157 | 6096ms | - |

### Task: game_state_manager

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 194 | 3486ms | - |
| vibe | openai | YES | 233 | 7755ms | - |
| python-pygame | gemini | YES | 228 | 3655ms | - |
| python-pygame | openai | YES | 303 | 12350ms | - |
| lua-love | gemini | YES | 248 | 4066ms | - |
| lua-love | openai | YES | 269 | 9304ms | - |

### Task: combat_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 140 | 2984ms | - |
| vibe | openai | YES | 105 | 6942ms | - |
| python-pygame | gemini | YES | 261 | 4823ms | - |
| python-pygame | openai | YES | 230 | 7521ms | - |
| lua-love | gemini | YES | 150 | 2500ms | - |
| lua-love | openai | YES | 178 | 6974ms | - |

### Task: enemy_wave_loop

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 243 | 3317ms | - |
| vibe | openai | YES | 332 | 15687ms | - |
| python-pygame | gemini | YES | 318 | 4970ms | - |
| python-pygame | openai | YES | 262 | 10062ms | - |
| lua-love | gemini | YES | 400 | 4204ms | - |
| lua-love | openai | YES | 396 | 13854ms | - |

### Task: tic_tac_toe

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 298 | 4401ms | - |
| vibe | openai | YES | 315 | 24581ms | - |
| python-pygame | gemini | YES | 278 | 4027ms | - |
| python-pygame | openai | YES | 361 | 9624ms | - |
| lua-love | gemini | YES | 344 | 4343ms | - |
| lua-love | openai | YES | 344 | 11554ms | - |

### Task: rpg_battle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 229 | 4051ms | - |
| vibe | openai | YES | 268 | 8651ms | - |
| python-pygame | gemini | YES | 251 | 4224ms | - |
| python-pygame | openai | YES | 247 | 7623ms | - |
| lua-love | gemini | YES | 290 | 3883ms | - |
| lua-love | openai | YES | 249 | 7514ms | - |

### Task: particle_emitter_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 147 | 3172ms | - |
| vibe | openai | YES | 175 | 7664ms | - |
| python-pygame | gemini | YES | 190 | 3594ms | - |
| python-pygame | openai | YES | 202 | 5182ms | - |
| lua-love | gemini | YES | 195 | 2880ms | - |
| lua-love | openai | YES | 196 | 5819ms | - |

### Task: highscore_table

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 213 | 3237ms | - |
| vibe | openai | YES | 169 | 25942ms | - |
| python-pygame | gemini | YES | 206 | 3993ms | - |
| python-pygame | openai | YES | 260 | 8373ms | - |
| lua-love | gemini | YES | 215 | 3625ms | - |
| lua-love | openai | YES | 219 | 8145ms | - |

### Task: struct_basic

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 50 | 1809ms | - |
| vibe | openai | YES | 51 | 3278ms | - |
| python-pygame | gemini | YES | 159 | 2960ms | - |
| python-pygame | openai | YES | 118 | 5018ms | - |
| lua-love | gemini | YES | 99 | 4414ms | - |
| lua-love | openai | YES | 111 | 4086ms | - |

### Task: struct_methods

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 5506ms | - |
| vibe | openai | YES | 140 | 6099ms | - |
| python-pygame | gemini | YES | 216 | 5574ms | - |
| python-pygame | openai | YES | 156 | 6026ms | - |
| lua-love | gemini | YES | 156 | 4499ms | - |
| lua-love | openai | YES | 135 | 5724ms | - |

### Task: enum_state_machine

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 80 | 2388ms | - |
| vibe | openai | YES | 68 | 5827ms | - |
| python-pygame | gemini | YES | 164 | 2731ms | - |
| python-pygame | openai | YES | 164 | 6911ms | - |
| lua-love | gemini | YES | 129 | 2318ms | - |
| lua-love | openai | YES | 117 | 3876ms | - |

### Task: enum_with_data

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 133 | 2674ms | - |
| vibe | openai | NO | 169 | 21499ms | expected NEWLINE, got LPAREN ("(") |
| python-pygame | gemini | YES | 218 | 3618ms | - |
| python-pygame | openai | YES | 230 | 7333ms | - |
| lua-love | gemini | YES | 199 | 4473ms | - |
| lua-love | openai | YES | 242 | 19480ms | - |

### Task: struct_composition

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 115 | 2930ms | - |
| vibe | openai | YES | 132 | 10968ms | - |
| python-pygame | gemini | YES | 217 | 3491ms | - |
| python-pygame | openai | YES | 169 | 6512ms | - |
| lua-love | gemini | YES | 194 | 2903ms | - |
| lua-love | openai | YES | 185 | 7649ms | - |

### Task: trait_drawable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 112 | 2707ms | - |
| vibe | openai | YES | 124 | 5368ms | - |
| python-pygame | gemini | YES | 174 | 3326ms | - |
| python-pygame | openai | YES | 168 | 7003ms | - |
| lua-love | gemini | YES | 145 | 3512ms | - |
| lua-love | openai | YES | 185 | 8246ms | - |

### Task: trait_updatable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 157 | 7106ms | - |
| vibe | openai | NO | 200 | 31548ms | expected IDENT, got LPAREN ("(") |
| python-pygame | gemini | YES | 259 | 3996ms | - |
| python-pygame | openai | YES | 234 | 10429ms | - |
| lua-love | gemini | YES | 219 | 3436ms | - |
| lua-love | openai | YES | 239 | 9622ms | - |

### Task: struct_list_management

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 108 | 2661ms | - |
| vibe | openai | YES | 130 | 9431ms | - |
| python-pygame | gemini | YES | 162 | 3185ms | - |
| python-pygame | openai | YES | 204 | 6528ms | - |
| lua-love | gemini | YES | 127 | 3091ms | - |
| lua-love | openai | YES | 163 | 4300ms | - |
