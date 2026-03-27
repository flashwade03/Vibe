# LLM Code Generation Benchmark Results

**Generated**: 2026-03-27

> Note: "Syntax Pass Rate" measures whether generated code is syntactically valid and transpiles to valid Lua. Runtime behavioral correctness is not yet measured.

## Summary

### Official Generator (Claude Code with project context)

| Language | Claude |
|----------|--------|
| **Vibe** | **100% (42/42)** |

### Third-party LLMs (API with system prompt only)

| Language | LLM | Syntax Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|------------------|------------|-------------|
| vibe | gemini | 100% (42/42) | 162 | 3390ms |
| vibe | openai | 90% (38/42) | 164 | 8863ms |
| python-pygame | gemini | 100% (42/42) | 207 | 3835ms |
| python-pygame | openai | 100% (42/42) | 206 | 5858ms |
| lua-love | gemini | 100% (42/42) | 199 | 3129ms |
| lua-love | openai | 95% (40/42) | 213 | 5942ms |

## Analysis

### Annotation Tasks (v0.2 — 4 new tasks)
| Task | Gemini | OpenAI |
|------|--------|--------|
| annotation_entity_move | PASS | PASS |
| annotation_scene_transition | PASS | PASS |
| annotation_multi_entity | PASS | PASS |
| annotation_spawn_destroy | PASS | PASS |

**어노테이션 태스크 100% 통과 (Gemini, OpenAI 모두).** @entity, @component, @scene, @on + spawn/destroy/find_all/go_to 구문을 LLM이 정확하게 생성.

### OpenAI 잔여 실패 (4건)
| Task | Error |
|------|-------|
| tower_defense_path | RPAREN/COMMA (dict 리터럴) |
| highscore_table | COLON (dict 리터럴) |
| enum_with_data | LPAREN (enum variant 파라미터) |
| trait_updatable | LPAREN (trait 메서드 구문) |

### 프롬프트 개선 이력
| 버전 | 변경 | Gemini | OpenAI |
|------|------|--------|--------|
| v0.1 | 초기 (38 tasks) | 97% | 66% |
| v0.2 | struct/enum 예제 + DO NOT 확장 | 100% | 71% |
| v0.3 | `:` 메서드 → 자유 함수 | 100% | 87% |
| v0.4 | 어노테이션 4 tasks 추가 (42 tasks) | 100% | 90% |

## Detailed Results

### Task: move_rectangle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 63 | 2225ms | - |
| vibe | openai | YES | 63 | 5116ms | - |
| python-pygame | gemini | YES | 101 | 2363ms | - |
| python-pygame | openai | YES | 97 | 5162ms | - |
| lua-love | gemini | YES | 78 | 2664ms | - |
| lua-love | openai | YES | 74 | 2477ms | - |

### Task: bouncing_ball

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 67 | 1829ms | - |
| vibe | openai | YES | 64 | 3056ms | - |
| python-pygame | gemini | YES | 138 | 2921ms | - |
| python-pygame | openai | YES | 110 | 3650ms | - |
| lua-love | gemini | YES | 95 | 2045ms | - |
| lua-love | openai | YES | 81 | 2360ms | - |

### Task: score_counter

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 25 | 1523ms | - |
| vibe | openai | YES | 25 | 1768ms | - |
| python-pygame | gemini | YES | 102 | 2785ms | - |
| python-pygame | openai | YES | 70 | 1743ms | - |
| lua-love | gemini | YES | 48 | 1938ms | - |
| lua-love | openai | YES | 32 | 1356ms | - |

### Task: mouse_follower

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 72 | 2383ms | - |
| vibe | openai | YES | 71 | 4023ms | - |
| python-pygame | gemini | YES | 146 | 3181ms | - |
| python-pygame | openai | YES | 128 | 2995ms | - |
| lua-love | gemini | YES | 118 | 2568ms | - |
| lua-love | openai | YES | 98 | 3112ms | - |

### Task: simple_animation

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 85 | 2352ms | - |
| vibe | openai | YES | 82 | 3030ms | - |
| python-pygame | gemini | YES | 135 | 2783ms | - |
| python-pygame | openai | YES | 122 | 4419ms | - |
| lua-love | gemini | YES | 84 | 2086ms | - |
| lua-love | openai | YES | 89 | 2576ms | - |

### Task: enemy_follow

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 143 | 2333ms | - |
| vibe | openai | YES | 142 | 3559ms | - |
| python-pygame | gemini | YES | 172 | 3483ms | - |
| python-pygame | openai | YES | 132 | 4928ms | - |
| lua-love | gemini | YES | 172 | 1742ms | - |
| lua-love | openai | YES | 154 | 3566ms | - |

### Task: shooting

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 123 | 3566ms | - |
| vibe | openai | YES | 132 | 3509ms | - |
| python-pygame | gemini | YES | 174 | 3985ms | - |
| python-pygame | openai | YES | 147 | 3872ms | - |
| lua-love | gemini | YES | 147 | 3243ms | - |
| lua-love | openai | YES | 153 | 4221ms | - |

### Task: circle_collision

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 132 | 3881ms | - |
| vibe | openai | YES | 155 | 12079ms | - |
| python-pygame | gemini | YES | 187 | 2217ms | - |
| python-pygame | openai | YES | 178 | 4460ms | - |
| lua-love | gemini | YES | 200 | 3653ms | - |
| lua-love | openai | YES | 207 | 3999ms | - |

### Task: gravity_jump

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 124 | 2674ms | - |
| vibe | openai | YES | 121 | 3896ms | - |
| python-pygame | gemini | YES | 176 | 3697ms | - |
| python-pygame | openai | YES | 145 | 3373ms | - |
| lua-love | gemini | YES | 133 | 2465ms | - |
| lua-love | openai | YES | 123 | 3647ms | - |

### Task: countdown_timer

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 47 | 1441ms | - |
| vibe | openai | YES | 35 | 1578ms | - |
| python-pygame | gemini | YES | 95 | 2640ms | - |
| python-pygame | openai | YES | 84 | 2337ms | - |
| lua-love | gemini | YES | 79 | 2028ms | - |
| lua-love | openai | YES | 83 | 2773ms | - |

### Task: health_bar

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 121 | 2767ms | - |
| vibe | openai | YES | 124 | 5847ms | - |
| python-pygame | gemini | YES | 181 | 3492ms | - |
| python-pygame | openai | YES | 163 | 4486ms | - |
| lua-love | gemini | YES | 160 | 2222ms | - |
| lua-love | openai | YES | 156 | 4719ms | - |

### Task: waypoint_patrol

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 140 | 1843ms | - |
| vibe | openai | YES | 120 | 7690ms | - |
| python-pygame | gemini | YES | 184 | 3491ms | - |
| python-pygame | openai | YES | 176 | 3453ms | - |
| lua-love | gemini | YES | 176 | 3103ms | - |
| lua-love | openai | YES | 170 | 3750ms | - |

### Task: asteroid_field

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 181 | 2133ms | - |
| vibe | openai | YES | 207 | 12096ms | - |
| python-pygame | gemini | YES | 212 | 4636ms | - |
| python-pygame | openai | YES | 237 | 6461ms | - |
| lua-love | gemini | YES | 242 | 3882ms | - |
| lua-love | openai | YES | 275 | 6620ms | - |

### Task: grid_highlight

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 2963ms | - |
| vibe | openai | YES | 183 | 5244ms | - |
| python-pygame | gemini | YES | 179 | 3082ms | - |
| python-pygame | openai | YES | 187 | 3973ms | - |
| lua-love | gemini | YES | 196 | 1860ms | - |
| lua-love | openai | YES | 187 | 4067ms | - |

### Task: state_machine_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 169 | 3383ms | - |
| vibe | openai | YES | 153 | 3694ms | - |
| python-pygame | gemini | YES | 205 | 4415ms | - |
| python-pygame | openai | YES | 283 | 5919ms | - |
| lua-love | gemini | YES | 199 | 3703ms | - |
| lua-love | openai | YES | 219 | 4638ms | - |

### Task: snake_movement

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 183 | 3421ms | - |
| vibe | openai | YES | 145 | 5132ms | - |
| python-pygame | gemini | YES | 192 | 3151ms | - |
| python-pygame | openai | YES | 197 | 4174ms | - |
| lua-love | gemini | YES | 186 | 2943ms | - |
| lua-love | openai | YES | 216 | 4959ms | - |

### Task: breakout_game

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 210 | 4309ms | - |
| vibe | openai | YES | 368 | 7344ms | - |
| python-pygame | gemini | YES | 233 | 4555ms | - |
| python-pygame | openai | YES | 225 | 5881ms | - |
| lua-love | gemini | YES | 271 | 3597ms | - |
| lua-love | openai | YES | 340 | 6354ms | - |

### Task: space_invaders

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 284 | 3997ms | - |
| vibe | openai | YES | 258 | 15204ms | - |
| python-pygame | gemini | YES | 285 | 5116ms | - |
| python-pygame | openai | YES | 273 | 6776ms | - |
| lua-love | gemini | YES | 354 | 4151ms | - |
| lua-love | openai | YES | 401 | 9387ms | - |

### Task: cellular_automata

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 290 | 4062ms | - |
| vibe | openai | YES | 263 | 6423ms | - |
| python-pygame | gemini | YES | 272 | 3978ms | - |
| python-pygame | openai | YES | 249 | 6629ms | - |
| lua-love | gemini | YES | 318 | 3968ms | - |
| lua-love | openai | YES | 319 | 6063ms | - |

### Task: tower_defense_path

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 319 | 8602ms | - |
| vibe | openai | YES | 384 | 17804ms | - |
| python-pygame | gemini | YES | 298 | 4909ms | - |
| python-pygame | openai | YES | 430 | 9947ms | - |
| lua-love | gemini | YES | 447 | 6122ms | - |
| lua-love | openai | YES | 489 | 19154ms | - |

### Task: bullet_hell_pattern

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 204 | 4098ms | - |
| vibe | openai | YES | 231 | 24498ms | - |
| python-pygame | gemini | YES | 266 | 6036ms | - |
| python-pygame | openai | YES | 237 | 12061ms | - |
| lua-love | gemini | YES | 284 | 4488ms | - |
| lua-love | openai | YES | 281 | 7511ms | - |

### Task: pathfinding_viz

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 438 | 5664ms | - |
| vibe | openai | NO | 415 | 33537ms | expected RPAREN, got COMMA (",") |
| python-pygame | gemini | YES | 364 | 5784ms | - |
| python-pygame | openai | YES | 393 | 11105ms | - |
| lua-love | gemini | YES | 436 | 5509ms | - |
| lua-love | openai | YES | 550 | 14765ms | - |

### Task: debug_hud

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 159 | 3160ms | - |
| vibe | openai | YES | 153 | 4825ms | - |
| python-pygame | gemini | YES | 180 | 2521ms | - |
| python-pygame | openai | YES | 164 | 4840ms | - |
| lua-love | gemini | YES | 201 | 2752ms | - |
| lua-love | openai | YES | 160 | 3753ms | - |

### Task: game_state_manager

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 206 | 3422ms | - |
| vibe | openai | YES | 204 | 7481ms | - |
| python-pygame | gemini | YES | 217 | 3938ms | - |
| python-pygame | openai | YES | 324 | 8574ms | - |
| lua-love | gemini | YES | 235 | 2406ms | - |
| lua-love | openai | YES | 265 | 6007ms | - |

### Task: combat_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 191 | 4037ms | - |
| vibe | openai | YES | 139 | 4883ms | - |
| python-pygame | gemini | YES | 250 | 5043ms | - |
| python-pygame | openai | YES | 221 | 5735ms | - |
| lua-love | gemini | YES | 160 | 3605ms | - |
| lua-love | openai | YES | 161 | 5029ms | - |

### Task: enemy_wave_loop

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 326 | 5694ms | - |
| vibe | openai | YES | 306 | 17766ms | - |
| python-pygame | gemini | YES | 349 | 3909ms | - |
| python-pygame | openai | YES | 302 | 8738ms | - |
| lua-love | gemini | YES | 399 | 5285ms | - |
| lua-love | openai | YES | 378 | 8994ms | - |

### Task: tic_tac_toe

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 334 | 5449ms | - |
| vibe | openai | YES | 299 | 17222ms | - |
| python-pygame | gemini | YES | 327 | 4939ms | - |
| python-pygame | openai | YES | 406 | 9717ms | - |
| lua-love | gemini | YES | 307 | 2834ms | - |
| lua-love | openai | YES | 345 | 9544ms | - |

### Task: rpg_battle

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 250 | 3919ms | - |
| vibe | openai | YES | 292 | 8668ms | - |
| python-pygame | gemini | YES | 257 | 4220ms | - |
| python-pygame | openai | YES | 252 | 6427ms | - |
| lua-love | gemini | YES | 288 | 3859ms | - |
| lua-love | openai | YES | 269 | 12301ms | - |

### Task: particle_emitter_system

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 158 | 3710ms | - |
| vibe | openai | YES | 155 | 8349ms | - |
| python-pygame | gemini | YES | 194 | 3453ms | - |
| python-pygame | openai | YES | 202 | 7714ms | - |
| lua-love | gemini | YES | 211 | 2352ms | - |
| lua-love | openai | YES | 216 | 14537ms | - |

### Task: highscore_table

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 211 | 3967ms | - |
| vibe | openai | NO | 184 | 22993ms | unexpected token COLON (":") |
| python-pygame | gemini | YES | 203 | 2774ms | - |
| python-pygame | openai | YES | 257 | 7381ms | - |
| lua-love | gemini | YES | 223 | 3943ms | - |
| lua-love | openai | YES | 233 | 5944ms | - |

### Task: struct_basic

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 51 | 2254ms | - |
| vibe | openai | YES | 51 | 1857ms | - |
| python-pygame | gemini | YES | 159 | 2976ms | - |
| python-pygame | openai | YES | 123 | 3220ms | - |
| lua-love | gemini | YES | 99 | 2373ms | - |
| lua-love | openai | YES | 109 | 3265ms | - |

### Task: struct_methods

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 148 | 3581ms | - |
| vibe | openai | YES | 127 | 4130ms | - |
| python-pygame | gemini | YES | 216 | 3736ms | - |
| python-pygame | openai | YES | 156 | 4644ms | - |
| lua-love | gemini | YES | 157 | 3351ms | - |
| lua-love | openai | YES | 137 | 3585ms | - |

### Task: enum_state_machine

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 69 | 2100ms | - |
| vibe | openai | YES | 68 | 2343ms | - |
| python-pygame | gemini | YES | 164 | 3467ms | - |
| python-pygame | openai | YES | 164 | 4559ms | - |
| lua-love | gemini | YES | 129 | 2549ms | - |
| lua-love | openai | YES | 116 | 3697ms | - |

### Task: enum_with_data

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 126 | 3232ms | - |
| vibe | openai | NO | 179 | 32012ms | expected NEWLINE, got LPAREN ("(") |
| python-pygame | gemini | YES | 225 | 5705ms | - |
| python-pygame | openai | YES | 231 | 9704ms | - |
| lua-love | gemini | YES | 192 | 2326ms | - |
| lua-love | openai | YES | 215 | 5187ms | - |

### Task: struct_composition

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 134 | 2225ms | - |
| vibe | openai | YES | 114 | 4361ms | - |
| python-pygame | gemini | YES | 210 | 4635ms | - |
| python-pygame | openai | YES | 169 | 5081ms | - |
| lua-love | gemini | YES | 185 | 3275ms | - |
| lua-love | openai | YES | 184 | 4394ms | - |

### Task: trait_drawable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 116 | 2679ms | - |
| vibe | openai | YES | 104 | 2940ms | - |
| python-pygame | gemini | YES | 176 | 3329ms | - |
| python-pygame | openai | YES | 171 | 4345ms | - |
| lua-love | gemini | YES | 172 | 2165ms | - |
| lua-love | openai | YES | 189 | 5635ms | - |

### Task: trait_updatable

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 247 | 8192ms | - |
| vibe | openai | NO | 228 | 19258ms | expected IDENT, got LPAREN ("(") |
| python-pygame | gemini | YES | 268 | 4400ms | - |
| python-pygame | openai | YES | 256 | 7268ms | - |
| lua-love | gemini | YES | 219 | 2231ms | - |
| lua-love | openai | YES | 239 | 6996ms | - |

### Task: struct_list_management

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 97 | 1935ms | - |
| vibe | openai | YES | 130 | 11565ms | - |
| python-pygame | gemini | YES | 162 | 3289ms | - |
| python-pygame | openai | YES | 184 | 5815ms | - |
| lua-love | gemini | YES | 127 | 2640ms | - |
| lua-love | openai | YES | 164 | 4920ms | - |

### Task: annotation_entity_move

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 60 | 2628ms | - |
| vibe | openai | YES | 63 | 2197ms | - |
| python-pygame | gemini | YES | 174 | 3286ms | - |
| python-pygame | openai | YES | 154 | 4782ms | - |
| lua-love | gemini | YES | 105 | 2613ms | - |
| lua-love | openai | NO | 143 | 3141ms | luac: /tmp/vibe_benchmark_test.lua:3: syntax error near 'Position'  |

### Task: annotation_scene_transition

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 61 | 1672ms | - |
| vibe | openai | YES | 61 | 2311ms | - |
| python-pygame | gemini | YES | 170 | 3827ms | - |
| python-pygame | openai | YES | 172 | 5288ms | - |
| lua-love | gemini | YES | 151 | 2926ms | - |
| lua-love | openai | YES | 172 | 4564ms | - |

### Task: annotation_multi_entity

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 154 | 3531ms | - |
| vibe | openai | YES | 147 | 6255ms | - |
| python-pygame | gemini | YES | 260 | 4747ms | - |
| python-pygame | openai | YES | 272 | 6812ms | - |
| lua-love | gemini | YES | 196 | 3972ms | - |
| lua-love | openai | NO | 291 | 8905ms | luac: /tmp/vibe_benchmark_test.lua:3: syntax error near 'Position'  |

### Task: annotation_spawn_destroy

| Language | LLM | Pass | Tokens | Latency | Errors |
|----------|-----|------|--------|---------|--------|
| vibe | gemini | YES | 162 | 3537ms | - |
| vibe | openai | YES | 149 | 4700ms | - |
| python-pygame | gemini | YES | 220 | 4155ms | - |
| python-pygame | openai | YES | 227 | 7586ms | - |
| lua-love | gemini | YES | 159 | 3971ms | - |
| lua-love | openai | YES | 264 | 7071ms | - |
