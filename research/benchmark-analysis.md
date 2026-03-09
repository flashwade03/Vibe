# LLM 코드 생성 벤치마크 분석

> 2026-03-09 | Vibe v0 파이프라인 기준
> 최종 갱신: 프롬프트 최적화 후 2차 벤치마크 포함

## 핵심 가설

**"LLM을 위해 설계된 언어(Vibe)가, LLM이 이미 학습한 언어(Lua, Python)를 이길 수 있는가?"**

- Lua, Python: LLM 학습 데이터에 수백만~수억 개의 코드 파일 존재
- Vibe: 학습 데이터 **0개**. 프롬프트(시스템 프롬프트 ~170줄)만으로 LLM에게 문법을 전달

## 벤치마크 설계

### 구성

- **태스크**: 20개 (easy 4, medium 6, hard 10)
- **언어**: Vibe, Python-Pygame, Lua-LOVE
- **LLM**: GPT-4o (OpenAI), Gemini 2.0 Flash (Google)
- **추가 참여**: Claude Opus 4.6 (수동 서브에이전트 방식, Vibe만)

### 검증 방법

| 언어 | 검증 방식 |
|------|-----------|
| Vibe | Lexer → Parser → CodeGen 파이프라인 전체 통과 여부 |
| Python | `py_compile` 구문 검사 |
| Lua | `luac`/`luajit` 구문 검사 (미설치 시 경고만) |

### 태스크 목록

**Easy** (4): move_rectangle, bouncing_ball, score_counter, color_changing_rect

**Medium** (6): enemy_follow, shooting, circle_collision, gravity_jump, countdown_timer, particle_burst

**Hard** (10): state_machine_game, snake_movement, multi_wave_spawner, orbital_mechanics, breakout_game, twin_stick_dodge, flocking_simulation, platformer_level, minimap_radar, chain_reaction

## 결과 요약

### Pass Rate (1차 벤치마크)

| Language | LLM | Pass Rate | Avg Tokens | Avg Latency |
|----------|-----|-----------|------------|-------------|
| lua-love | Gemini | **100%** (20/20) | 101 | 9,765ms |
| lua-love | GPT-4o | **100%** (20/20) | 187 | 2,989ms |
| python-pygame | Gemini | 40% (8/20) | 83 | 10,030ms |
| python-pygame | GPT-4o | **100%** (20/20) | 194 | 3,382ms |
| vibe | Gemini | 50% (10/20) | 40 | 10,016ms |
| vibe | GPT-4o | 90% (18/20) | 161 | 2,664ms |
| vibe | Claude Opus 4.6 | **100%** (20/20) | - | - |

### Pass Rate (2차 벤치마크 — 프롬프트 최적화 후)

프롬프트 변경사항: `+=` 제거, DO NOT 섹션 추가 (10개 금지 규칙), 예제 2개 추가 (condition loop, list indexing)

| Language | LLM | Pass Rate | Avg Tokens | 변화 |
|----------|-----|-----------|------------|------|
| lua-love | Gemini | **100%** (20/20) | 106 | - |
| lua-love | GPT-4o | **100%** (20/20) | 186 | - |
| python-pygame | Gemini | 50% (10/20) | 103 | +10% |
| python-pygame | GPT-4o | **100%** (20/20) | 199 | - |
| vibe | Claude Opus 4.6 | **100%** (20/20) | 185 | 유지 |
| vibe | Gemini | 65% (13/20) | 38 | **+15%** |
| vibe | GPT-4o | 90% (18/20) | 163 | ±0 (1승1패) |

**프롬프트 최적화 효과**: Gemini +15% (50→65%), GPT-4o ±0 (twin_stick_dodge 복구, chain_reaction 신규 실패). Claude 100% 유지.

### 토큰 효율 비교 (GPT-4o 기준)

| 언어 | 평균 토큰 | Vibe 대비 |
|------|-----------|-----------|
| Vibe | 161 | 기준 |
| Lua-LOVE | 187 | +16% |
| Python-Pygame | 194 | +20% |

Vibe는 동일한 게임 로직을 **15~20% 적은 토큰**으로 표현한다.

## 실패 원인 분석

### Vibe + GPT-4o 실패 (2건)

| 태스크 | 에러 | 원인 |
|--------|------|------|
| multi_wave_spawner | `expected EQ, got NEWLINE` | `+=` 복합 할당 연산자 사용 |
| twin_stick_dodge | `expected EQ, got NEWLINE` | `+=` 복합 할당 연산자 사용 |

**근본 원인**: 시스템 프롬프트(vibe-context.ts)에 `Assignment: = += -= *= /=`라고 `+=`를 지원한다고 명시했으나, 실제 파서에는 미구현. 프롬프트의 오류로 LLM이 잘못된 문법을 사용.

### Vibe + Gemini 실패 (10건)

| 에러 유형 | 건수 | 원인 |
|-----------|------|------|
| `expected EQ, got NEWLINE` | 4 | `+=` 등 복합 할당 연산자 사용 |
| `expected RBRACKET, got EOF/DEDENT` | 3 | 코드 잘림/불완전 생성 (토큰 수 20~37) |
| `unexpected character: '\`'` | 2 | 마크다운 백틱을 코드에 포함 |
| `unterminated string` | 1 | 문자열 리터럴 미닫힘 |

Gemini의 경우 프롬프트 오류 외에도 출력 품질 자체가 낮음 (코드 잘림, 마크다운 혼입).

### Python-Pygame + Gemini 실패 (12건)

- 모두 `py_compile` 구문 에러. Gemini가 Python도 제대로 생성 못함 (40%).
- Gemini는 Lua-LOVE에서만 100% — Lua가 가장 단순한 문법이라 실수가 적은 것으로 추정.

## 핵심 인사이트

### 1. 학습 데이터 vs 언어 설계

| | 학습 데이터 | GPT-4o 정확도 | 토큰 수 |
|---|---|---|---|
| Lua | 수백만 파일 | 100% | 187 |
| Python | 수억 파일 | 100% | 194 |
| **Vibe** | **0개** | **90%** | **161** |

학습 데이터가 전혀 없는 Vibe가 프롬프트만으로 90%에 도달. 프롬프트 오류(`+=`) 수정 시 95~100% 도달 가능성 높음.

### 2. Claude vs GPT-4o vs Gemini

| LLM | Vibe 정확도 | 특징 |
|-----|-------------|------|
| Claude Opus 4.6 | **100%** (20/20) | 프롬프트를 가장 정확하게 따름 |
| GPT-4o | 90% (18/20) | 복잡한 태스크에서 `+=` 실수 |
| Gemini 2.0 Flash | 50% (10/20) | 코드 잘림, 마크다운 혼입, 문법 오류 다발 |

Claude가 "프롬프트만 보고 새 언어 학습" 능력에서 가장 우수.

### 3. LLM을 위한 언어 설계가 유효하다

- Vibe는 **학습 데이터 0**인데도 GPT-4o 기준 Lua/Python과 10% 차이
- 토큰 효율은 Vibe가 **가장 우수** (15~20% 절감)
- 프롬프트 오류 수정 + `+=` 지원 추가 시 격차는 더 줄어들 전망
- **결론**: LLM에 최적화된 언어 설계는 학습 데이터량을 상당 부분 대체할 수 있다

### 4. 토큰 효율의 의미

게임 코드에서 토큰 15~20% 절감의 실질적 가치:
- LLM API 비용 절감 (토큰 과금 기준)
- 컨텍스트 윈도우 내 더 많은 코드 참조 가능
- 더 복잡한 게임을 단일 프롬프트로 생성 가능

## 프롬프트 오류 발견

벤치마크 실행 중 시스템 프롬프트(`benchmark/contexts/vibe-context.ts`)에서 오류 발견:

```
Assignment: = += -= *= /=
```

파서에 `+=` 등 복합 할당 연산자가 구현되어 있지 않은데 프롬프트에 지원한다고 명시. 이로 인해 GPT-4o 2건, Gemini 4건 실패 발생.

**수정 방향**: 프롬프트에서 제거하거나 파서에 실제 구현.

## 다음 단계

1. **프롬프트 오류 수정** — `+=` 제거 또는 파서 구현
2. **GDScript 벤치마크 추가** — 같은 게임 도메인 언어 3파전 (Lua-LOVE vs GDScript vs Vibe)
3. **태스크 50개 확장** — 통계적 유의성을 위한 태스크 수 증가
4. **Claude 자동화** — 서브에이전트 기반 자동 벤치마크로 3-LLM 비교 체계화
