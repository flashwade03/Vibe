# Vibe 언어를 위한 RAG 지식 아키텍처 설계

> 2026-03-09 | RAG Knowledge Architect Report
> "학습 데이터 0인 언어를 LLM에게 가르치는" RAG 시스템 설계

---

## 0. 설계 요약 (Executive Summary)

**핵심 문제**: Vibe의 현재 시스템 프롬프트는 ~170줄(약 1,200 토큰)로 전체 문법, 예제, 규칙을 정적으로 전달한다. GPT-4o 90%, Claude 100%, Gemini 50%의 정확도를 달성했지만, 향후 struct/enum/match/trait/annotation 등이 추가되면 프롬프트 크기가 2-3x로 증가하여 한계에 도달한다.

**핵심 전략**: 정적 프롬프트의 "핵심 불변 지식"은 유지하면서, 태스크에 따라 필요한 지식만 동적으로 주입하는 하이브리드 RAG.

**핵심 발견**:
1. **정적 프롬프트를 제거하지 않는다** -- RAG로 "대체"가 아닌 "확장"
2. **태스크 설명에서 필요 기능을 추출하는 것이 retrieval trigger** -- 임베딩 기반 검색이 아닌 규칙 기반 feature detection
3. **6개 예제가 수렴점** -- 정적 2-3개 + 동적 3-4개의 조합이 최적
4. **Negative Knowledge가 Positive Knowledge보다 ROI가 높다** -- "하지 마라"가 "이렇게 해라"보다 효과적
5. **Gemini 개선이 최대 ROI** -- 50% → 80%+ 달성이 RAG의 주요 목표

---

## 1. 지식 청킹 전략 (Knowledge Chunking Strategy)

### 1.1 현재 프롬프트 구조 분석

현재 `vibe-context.ts`를 기능 단위로 분해하면 14개의 암묵적 "청크"가 존재한다:

| # | 섹션 | 줄수 | 토큰(추정) | 모든 태스크에 필요? |
|---|------|------|-----------|-------------------|
| 1 | Role & Output 지시 | 3 | ~30 | **YES** (고정) |
| 2 | Language Overview | 2 | ~25 | **YES** (고정) |
| 3 | Keywords (20) | 1 | ~25 | **YES** (고정) |
| 4 | Built-in Constants | 1 | ~10 | **YES** (고정) |
| 5 | Types | 1 | ~15 | **YES** (고정) |
| 6 | Variable Declarations | 5 | ~45 | **YES** (고정) |
| 7 | Functions | 4 | ~35 | **YES** (고정) |
| 8 | Control Flow (if/for) | 14 | ~100 | **YES** (고정) |
| 9 | Boolean Operators | 1 | ~15 | **YES** (고정) |
| 10 | Operators | 4 | ~30 | **YES** (고정) |
| 11 | Type Conversion | 4 | ~35 | 조건부 (str 필수, int/float는 선택) |
| 12 | Game Loop Functions | 14 | ~100 | **YES** (고정) |
| 13 | Built-in Functions Table | 12 | ~120 | 조건부 (태스크에 따라 다름) |
| 14 | Lists | 5 | ~40 | 조건부 (리스트 사용 태스크만) |
| 15 | Example 1: Moving Rect | 14 | ~85 | 조건부 |
| 16 | Example 2: Bouncing Ball | 14 | ~85 | 조건부 |
| 17 | Example 3: Score Counter | 8 | ~50 | 조건부 |
| 18 | Rules | 7 | ~60 | **YES** (고정) |

**분석 결과**: 섹션 1-10, 12, 18은 **모든 태스크에 필수** (~435 토큰). 이것이 "핵심 불변 지식(Core Invariant Knowledge)"이다. 섹션 11, 13, 14, 15-17은 태스크에 따라 선택적으로 주입할 수 있다.

### 1.2 청킹 원칙

Vibe의 지식 청킹에는 일반적인 RAG의 "의미 기반 분할"이 아닌, **기능 기반 분할(Feature-Based Chunking)**이 필요하다.

**원칙**: 하나의 청크 = LLM이 하나의 언어 기능을 올바르게 사용하기 위한 최소 완결 단위.

각 청크는 반드시 다음 4요소를 포함해야 한다:

```
[청크 구조]
1. 문법 규칙 (Syntax Rule) -- "이렇게 쓴다"
2. 완전한 예제 (Complete Example) -- "실제로 이렇게 쓴다"
3. Negative Knowledge -- "이렇게 쓰지 않는다"
4. 의존 관계 (Dependencies) -- "이것을 쓰려면 X도 알아야 한다"
```

**근거**: LLM_CODE_GENERATION_ANALYSIS.md에서 "규칙 10줄보다 완전한 예제 1개가 더 효과적"이라는 발견. 또한 llm-training-data-analysis.md에서 "학습 데이터 중력"이 LLM 오류의 주요 원인이므로, Negative Knowledge가 필수.

### 1.3 Vibe 지식 청크 목록 (v0 + 확장)

#### Layer 0: Core Invariant (항상 주입, ~450 토큰)

정적 프롬프트에서 절대 분리하지 않는 지식. 이 부분은 RAG가 아닌 고정 프롬프트.

```
- Role 지시 + Output 형식
- Language Overview (들여쓰기 기반, 콜론 없음, 800x600)
- 키워드 20개 목록
- Built-in Constants (true, false, none)
- 기본 타입 (Int, Float, String, Bool)
- 변수 선언 (let/const + 반드시 초기화)
- 함수 선언 (fn + 들여쓰기, 콜론 없음)
- 기본 제어 흐름 (if/else, for)
- 연산자 (=, 산술, 비교, and/or/not)
- Game Loop 4 함수 (update, draw, keypressed, mousepressed)
- Rules (핵심 금지 사항)
```

#### Layer 1: Feature Chunks (태스크별 선택 주입)

| 청크 ID | 청크명 | 토큰(추정) | 트리거 조건 |
|---------|--------|-----------|------------|
| `LISTS` | 리스트 조작 | ~80 | 복수 엔티티, 병렬 데이터, 컬렉션 |
| `TYPE_CONV` | 타입 변환 | ~50 | 텍스트 표시, 정수-실수 변환 |
| `MATH_FNS` | 수학 함수 | ~60 | 삼각함수, 거리 계산, 각도 |
| `RANDOM` | 난수 생성 | ~40 | 랜덤 위치, 확률, 스폰 |
| `MOUSE` | 마우스 입력 | ~40 | 클릭, 마우스 좌표 |
| `LOAD_FN` | load() 함수 | ~40 | 초기화 루프, 대량 엔티티 생성 |
| `COLLISION` | 충돌 감지 패턴 | ~80 | 원-원 충돌, AABB 충돌 |
| `STATE_MACHINE` | 상태 기계 패턴 | ~80 | 게임 상태, 메뉴/플레이/게임오버 |
| `PARALLEL_LISTS` | 병렬 리스트 패턴 | ~100 | 파티클, 적, 총알 관리 |
| `CAMERA` | 카메라/뷰포트 | ~80 | 큰 월드, 미니맵, 스크롤 |
| `TIMER` | 타이머 패턴 | ~50 | 카운트다운, 스폰 주기, 쿨다운 |
| `SCREEN_WRAP` | 화면 래핑 | ~40 | 화면 밖 나가면 반대편 등장 |

#### Layer 2: Example Chunks (동적 예제 주입)

| 예제 ID | 예제명 | 토큰(추정) | 커버하는 기능 |
|---------|--------|-----------|-------------|
| `EX_MOVE_RECT` | Moving Rectangle | ~85 | key_down, update/draw, dt |
| `EX_BOUNCE_BALL` | Bouncing Ball | ~85 | 물리 반사, or 연산자, 경계 |
| `EX_SCORE` | Score Counter | ~50 | keypressed, str(), 텍스트 |
| `EX_SHOOTING` | Shooting | ~120 | 병렬 리스트, 스폰, 이동 |
| `EX_COLLISION` | Circle Collision | ~120 | sqrt, 거리 계산, 리스트 순회 |
| `EX_PARTICLES` | Particle Burst | ~130 | mousepressed, cos/sin, 수명 |
| `EX_STATE` | State Machine | ~140 | 상태 변수, 조건 분기, 종합 |
| `EX_SNAKE` | Snake Movement | ~150 | 그리드 이동, 타이머, 리스트 시프트 |
| `EX_FLOCK` | Flocking Sim | ~150 | load(), N체 상호작용, 속도 클램프 |
| `EX_CHAIN` | Chain Reaction | ~150 | 연쇄 반응, 상태 전이, 마우스 |

**예제 선택 원칙**: 태스크와 가장 유사한 예제 2개 + 태스크에서 요구하는 기능을 가장 많이 커버하는 예제 1개 = 동적 3개.

#### Layer 3: Negative Knowledge Chunks (오류 방지 주입)

벤치마크 실패 분석에서 도출된 "하지 마라" 지식:

| 청크 ID | 내용 | 대상 LLM | 트리거 |
|---------|------|----------|--------|
| `NEG_NO_WHILE` | `while` 대신 `for condition` 사용 | GPT-4o, Gemini | 반복문이 필요한 모든 태스크 |
| `NEG_MUST_INIT` | `let x: Type` 금지, 반드시 `= value` | GPT-4o | 변수 선언이 많은 태스크 |
| `NEG_NO_COLON_BLOCK` | 블록 전에 `:` 금지 | Gemini | if/for/fn 사용 시 |
| `NEG_NO_COMPOUND_ASSIGN` | `+=` 금지, `x = x + 1` 사용 | GPT-4o, Gemini | 누적 연산 태스크 |
| `NEG_NO_MARKDOWN` | 마크다운 펜스 금지 | Gemini | 항상 |
| `NEG_NO_UNINITIALIZED_LIST` | `let xs = []` 금지, 타입 필수 | Gemini | 리스트 사용 시 |

### 1.4 청크 크기 제약

**최대 청크 크기**: 150 토큰 (예제 포함 시)
**최소 청크 크기**: 30 토큰 (단일 규칙 + 한 줄 예제)
**근거**: 현재 전체 프롬프트가 ~1,200 토큰이고 이미 효과적임. 동적으로 추가되는 부분이 전체의 50%를 초과하면 "프롬프트 압력 vs 학습 데이터 압력" 균형이 깨진다 (llm-syntax-error-patterns.md의 발견).

---

## 2. 검색 트리거 (Retrieval Triggers)

### 2.1 임베딩 기반 검색이 부적합한 이유

일반적인 RAG는 사용자 질의와 지식 청크 사이의 임베딩 유사도로 검색한다. 그러나 Vibe의 경우 이 접근법이 부적합하다:

**문제 1: 쿼리가 자연어, 지식이 코드 문법**
- 사용자 입력: "Write a Vibe program with a bouncing ball"
- 필요한 지식: `if bx < 0.0 or bx > 784.0` → `or` 연산자 청크
- 자연어 "bouncing ball"과 코드 문법 `or` 사이에 임베딩 유사도가 낮다

**문제 2: 필요 기능이 태스크 설명에 명시적으로 언급되지 않음**
- "Make a shooting game" → 리스트가 필요하지만 "list"라는 단어가 없을 수 있음
- "Track survival time" → `str()` 변환이 필요하지만 "type conversion"이 언급되지 않음

**문제 3: 지식 청크 수가 적다**
- Layer 1: ~12개, Layer 2: ~10개, Layer 3: ~6개 = 총 ~28개
- 임베딩 검색은 수천~수만 개의 문서에서 위력을 발휘하지, 28개에서는 과잉 엔지니어링

### 2.2 규칙 기반 Feature Detection (권장 접근법)

태스크 설명에서 **필요 기능(Required Features)**을 추출하는 규칙 기반 시스템:

```typescript
// 태스크 설명 → 필요 기능 매핑 (Feature Detection)
interface FeatureDetector {
  // 키워드 매칭 + 의미적 패턴 매칭
  detect(taskDescription: string): Feature[]
}

type Feature =
  | "lists"           // 복수 엔티티, 여러 개, 배열, 저장
  | "math"            // 거리, 각도, 삼각함수, 궤도, 원
  | "random"          // 랜덤, 무작위, 확률, 스폰
  | "mouse"           // 클릭, 마우스
  | "collision"       // 충돌, 겹침, 거리 검사
  | "state_machine"   // 상태, 메뉴, 게임오버, 전환
  | "timer"           // 타이머, 카운트다운, 주기, 쿨다운
  | "text_display"    // 표시, 점수, HUD, 텍스트
  | "load_init"       // 초기화, 대량 생성, 배치
  | "camera"          // 카메라, 월드, 미니맵, 뷰포트
  | "screen_wrap"     // 래핑, 감싸기, 반대편
  | "parallel_lists"  // 파티클, 총알, 여러 적
```

#### Feature Detection 규칙 예시

```typescript
const FEATURE_RULES: Record<Feature, DetectionRule> = {
  lists: {
    keywords: ["list", "store", "multiple", "enemies", "bullets", "particles",
               "parallel", "array", "positions", "collection"],
    patterns: [/\d+ (enemies|bullets|boids|circles|items|platforms)/],
    // 5개 이상의 동종 엔티티가 언급되면 lists 필요
    semanticRule: (desc) => /\b(\d+)\b/.test(desc) && parseInt(RegExp.$1) > 3
  },

  math: {
    keywords: ["sqrt", "distance", "angle", "cos", "sin", "orbit",
               "normalize", "direction", "radius", "circular"],
    patterns: [/direction.*toward/, /distance.*between/],
  },

  random: {
    keywords: ["random", "rand", "spawn", "burst", "scatter"],
    patterns: [/random (position|direction|speed|angle|edge)/],
  },

  collision: {
    keywords: ["collision", "collide", "hit", "overlap", "intersect",
               "bounce", "reflect"],
    patterns: [/distance.*<.*radius/, /check.*(collision|hit)/],
  },

  text_display: {
    keywords: ["score", "display", "show", "text", "HUD", "counter",
               "timer.*display"],
    patterns: [/display.*text/, /show.*(score|time|wave)/],
  },

  // ... 기타 기능
}
```

### 2.3 태스크별 Feature Detection 검증 (벤치마크 20개 태스크)

벤치마크의 20개 태스크에 Feature Detection을 적용하면:

| 태스크 | 난이도 | 감지된 Features | 필요 청크 |
|--------|--------|----------------|-----------|
| move_rectangle | easy | (없음) | Core만 |
| bouncing_ball | easy | (없음) | Core만 |
| score_counter | easy | text_display | TYPE_CONV |
| color_changing_rect | easy | text_display | TYPE_CONV |
| enemy_follow | medium | math | MATH_FNS |
| shooting | medium | lists, parallel_lists | LISTS, PARALLEL_LISTS |
| circle_collision | medium | lists, math, collision | LISTS, MATH_FNS, COLLISION |
| gravity_jump | medium | (없음) | Core만 |
| countdown_timer | medium | timer, text_display | TIMER, TYPE_CONV |
| particle_burst | hard | lists, parallel_lists, random, math, mouse | LISTS, PARALLEL_LISTS, RANDOM, MATH_FNS, MOUSE |
| state_machine_game | hard | state_machine, random, mouse, text_display | STATE_MACHINE, RANDOM, MOUSE, TYPE_CONV |
| snake_movement | hard | lists, timer, screen_wrap | LISTS, TIMER, SCREEN_WRAP |
| multi_wave_spawner | hard | lists, parallel_lists, random, math, collision, timer | LISTS, PARALLEL_LISTS, RANDOM, MATH_FNS, COLLISION, TIMER |
| orbital_mechanics | hard | lists, math, text_display, load_init | LISTS, MATH_FNS, TYPE_CONV, LOAD_FN |
| breakout_game | hard | lists, collision, text_display | LISTS, COLLISION, TYPE_CONV |
| twin_stick_dodge | hard | lists, parallel_lists, random, math, collision, timer, text_display | LISTS, PARALLEL_LISTS, RANDOM, MATH_FNS, COLLISION, TIMER, TYPE_CONV |
| flocking_simulation | hard | lists, math, load_init, screen_wrap | LISTS, MATH_FNS, LOAD_FN, SCREEN_WRAP |
| platformer_level | hard | lists, collision | LISTS, COLLISION |
| minimap_radar | hard | lists, load_init, random, camera, text_display | LISTS, LOAD_FN, RANDOM, CAMERA, TYPE_CONV |
| chain_reaction | hard | lists, math, mouse, load_init, text_display | LISTS, MATH_FNS, MOUSE, LOAD_FN, TYPE_CONV |

**관찰**:
- Easy 태스크 4개 중 2개는 Core만으로 충분 (추가 청크 불필요)
- Hard 태스크 10개 모두 3개 이상의 추가 청크 필요
- `LISTS`가 Hard 태스크 10개 중 10개에서 필요 -- 가장 빈번한 Feature
- `MATH_FNS`와 `TYPE_CONV`가 각각 7개, 7개에서 필요 -- 두 번째로 빈번

### 2.4 LLM별 Negative Knowledge 트리거

일반적인 RAG와 다른 Vibe만의 고유 요소: **LLM 모델에 따라 다른 Negative Knowledge를 주입**.

```typescript
function getNegativeChunks(llm: LLMProvider, features: Feature[]): Chunk[] {
  const chunks: Chunk[] = []

  // 모든 LLM에 공통
  chunks.push(NEG_NO_WHILE)  // 항상 주입 (가장 높은 ROI)

  if (llm === "openai") {
    // GPT-4o 특화: 초기화 없는 선언 방지
    chunks.push(NEG_MUST_INIT)
    if (features.includes("lists") || features.includes("timer")) {
      chunks.push(NEG_NO_COMPOUND_ASSIGN)
    }
  }

  if (llm === "gemini") {
    // Gemini 특화: 마크다운 펜스, 콜론 블록 방지
    chunks.push(NEG_NO_MARKDOWN)
    chunks.push(NEG_NO_COLON_BLOCK)
    if (features.includes("lists")) {
      chunks.push(NEG_NO_UNINITIALIZED_LIST)
    }
  }

  // Claude는 Negative Knowledge 불필요 (100% 달성)
  return chunks
}
```

**근거**: llm-training-data-analysis.md의 "Training Data Gravity" 분석. GPT-4o는 `let x: Type`(초기화 없는 선언)과 `while` 패턴에 끌리고, Gemini는 마크다운 펜스와 Python의 `:` 패턴에 끌린다. 같은 Negative Knowledge를 모든 LLM에 주입하면 토큰 낭비.

---

## 3. 컨텍스트 윈도우 예산 (Context Window Budget)

### 3.1 현재 예산 분석

현재 시스템 프롬프트의 토큰 구조:

```
[시스템 프롬프트: ~1,200 토큰]
  ├── Core Invariant: ~450 토큰 (37.5%)
  ├── 내장 함수 테이블: ~120 토큰 (10%)
  ├── Lists 설명: ~40 토큰 (3.3%)
  ├── 타입 변환: ~35 토큰 (2.9%)
  ├── 예제 3개: ~220 토큰 (18.3%)
  └── Rules: ~60 토큰 (5%)
[태스크 설명: ~100-400 토큰]
[출력 여유: ~2,048 토큰 maxOutputTokens]
```

### 3.2 RAG 도입 후 예산 설계

**목표**: 시스템 프롬프트 + 동적 지식 = **최대 2,500 토큰** (현재의 ~2x)

이 상한은 다음 근거에 기반한다:
- 현재 1,200 토큰으로 GPT-4o 90% 달성 → 2배까지는 안전한 확장
- llm-syntax-error-patterns.md: "프롬프트 압력 vs 학습 데이터 압력" 균형점이 존재
- 너무 긴 프롬프트는 attention 분산으로 오히려 정확도 감소 가능
- benchmark llm-client.ts에서 maxOutputTokens = 2048이므로, 입력은 컨텍스트의 50% 이내가 안전

```
[RAG 도입 후 시스템 프롬프트: 최대 ~2,500 토큰]
  ├── [고정] Core Invariant: ~550 토큰 (22%) -- 약간 확장
  │   ├── Role + Output 지시
  │   ├── Language Overview
  │   ├── Keywords + Constants
  │   ├── Types
  │   ├── Variable Declarations
  │   ├── Functions
  │   ├── Control Flow (if/for)
  │   ├── Operators
  │   ├── Game Loop Functions
  │   └── Core Rules
  │
  ├── [동적] Feature Chunks: 최대 ~500 토큰 (20%)
  │   ├── 필요 기능별 청크 (0-5개)
  │   └── 각 청크 ~80-100 토큰
  │
  ├── [동적] Examples: 최대 ~400 토큰 (16%)
  │   ├── 고정 핵심 예제 1개 (~85 토큰)
  │   └── 동적 선택 예제 2-3개 (~100-300 토큰)
  │
  ├── [동적] Negative Knowledge: 최대 ~200 토큰 (8%)
  │   ├── LLM별 특화 금지 사항
  │   └── 최대 4개 청크
  │
  └── [여유] 미사용 버퍼: ~850 토큰 (34%)
      └── 향후 struct/enum/match 등 확장 여유
```

### 3.3 예산 할당 우선순위

컨텍스트 윈도우가 부족할 때 무엇을 먼저 희생하는가:

```
절대 삭제 불가 (Priority 0):
  - Core Invariant (~550 토큰)

마지막에 삭제 (Priority 1):
  - Negative Knowledge (~200 토큰)
  - 이유: "하지 마라"는 오류 예방에 가장 직접적

필요시 축소 (Priority 2):
  - Feature Chunks (~500 → ~300 토큰)
  - 예제가 Feature를 커버하면 중복 제거 가능

필요시 축소 (Priority 3):
  - Dynamic Examples (~400 → ~170 토큰)
  - 3개 → 1개로 줄일 수 있음
```

**핵심 통찰**: 예제와 Negative Knowledge는 **trade-off 관계가 아니라 보완 관계**이다. 예제는 "이렇게 해라"를, Negative Knowledge는 "이렇게 하지 마라"를 전달한다. 둘 중 하나만 있으면 불완전하다.

### 3.4 Vibe 확장 시 예산 시뮬레이션

향후 struct, enum, match, trait, annotation이 추가된 상황:

```
[Full Vibe 시스템 프롬프트 (RAG 없이): ~3,500+ 토큰]
  ├── Core Invariant (현재): ~550 토큰
  ├── struct 문법 + 예제: ~200 토큰
  ├── enum 문법 + 예제: ~150 토큰
  ├── match 문법 + 예제: ~200 토큰
  ├── trait 문법 + 예제: ~200 토큰
  ├── annotation 문법 + 예제: ~200 토큰
  ├── Optional 시스템: ~150 토큰
  ├── 기존 Feature + 예제: ~660 토큰
  └── Negative Knowledge: ~200 토큰
  = 합계: ~3,510 토큰 (정적 프롬프트로는 과도)

[Full Vibe 시스템 프롬프트 (RAG 적용): 최대 ~2,500 토큰]
  ├── Core Invariant (확장): ~700 토큰 (struct/enum 기본 문법 포함)
  └── Dynamic (태스크 필요분만): ~1,800 토큰 중 선택
      ├── "Make a platformer with struct Player"
      │   → struct 청크 + collision 청크 + 예제 2개 = ~600 토큰
      │   → 총: 700 + 600 = 1,300 토큰 (예산 내)
      │
      └── "Implement trait Damageable for Enemy"
          → trait 청크 + struct 청크 + 예제 2개 = ~700 토큰
          → 총: 700 + 700 = 1,400 토큰 (예산 내)
```

RAG 없이는 3,500+ 토큰이 필요한 것을 RAG로 1,300-1,400 토큰에 해결. **약 60% 절감**.

---

## 4. 지식 베이스 설계 (Knowledge Base Design)

### 4.1 저장 형식

**선택: TypeScript 객체 리터럴** (임베딩 DB가 아닌 코드 기반)

```typescript
// knowledge-base.ts
export interface KnowledgeChunk {
  id: string
  layer: 0 | 1 | 2 | 3          // Core / Feature / Example / Negative
  features: Feature[]             // 이 청크가 커버하는 기능들
  dependencies: string[]          // 의존 청크 ID (이것이 있으면 같이 주입)
  tokens: number                  // 추정 토큰 수 (예산 관리용)
  targetLLMs?: LLMProvider[]      // 특정 LLM에만 적용 (없으면 전체)
  content: string                 // 실제 프롬프트 텍스트
}
```

**왜 임베딩 DB가 아닌가:**
1. 청크 수가 ~30개로 매우 적다 -- 벡터 DB의 오버헤드가 효과보다 크다
2. 검색이 임베딩 유사도가 아닌 규칙 기반이다 (2.2절 참조)
3. 지식이 자주 변하지 않는다 -- Vibe 문법이 바뀔 때만 업데이트
4. 타입 안전성과 IDE 지원을 받을 수 있다

### 4.2 지식 베이스 구조 예시

```typescript
export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // ── Layer 1: Feature Chunks ──
  {
    id: "LISTS",
    layer: 1,
    features: ["lists"],
    dependencies: [],
    tokens: 80,
    content: `## Lists
\`\`\`
let xs: List[Float] = []
xs = xs + [1.0]            -- append by concatenating
let n = len(xs)             -- length
let v = xs[0]               -- index access
xs[0] = 99.0               -- index assignment
\`\`\`
IMPORTANT: Lists must be typed. Use \`xs = xs + [value]\` to append.
Do NOT use .append() or .push(). There is no remove operation in v0.`
  },

  {
    id: "PARALLEL_LISTS",
    layer: 1,
    features: ["parallel_lists"],
    dependencies: ["LISTS"],
    tokens: 100,
    content: `## Parallel Lists Pattern
To store multiple entities (bullets, enemies, particles), use parallel Lists:
\`\`\`
let bx: List[Float] = []
let by: List[Float] = []
let bvx: List[Float] = []
let bvy: List[Float] = []

-- spawn: append to all lists
bx = bx + [400.0]
by = by + [300.0]
bvx = bvx + [0.0]
bvy = bvy + [-200.0]

-- update: iterate all
for i in range(0, len(bx))
    bx[i] = bx[i] + bvx[i] * dt
    by[i] = by[i] + bvy[i] * dt
\`\`\``
  },

  {
    id: "MATH_FNS",
    layer: 1,
    features: ["math"],
    dependencies: [],
    tokens: 60,
    content: `## Math Functions
| Function | Description |
|----------|-------------|
| sqrt(x: Float) -> Float | Square root |
| cos(x: Float) -> Float | Cosine (radians) |
| sin(x: Float) -> Float | Sine (radians) |

Distance: \`let d: Float = sqrt(dx * dx + dy * dy)\`
Normalize: \`if d > 0.0\\n    nx = dx / d\\n    ny = dy / d\``
  },

  // ── Layer 2: Example Chunks ──
  {
    id: "EX_SHOOTING",
    layer: 2,
    features: ["lists", "parallel_lists"],
    dependencies: ["LISTS", "PARALLEL_LISTS"],
    tokens: 120,
    content: `## Example: Shooting
\`\`\`
let px: Float = 384.0
let py: Float = 550.0
let speed: Float = 200.0
let bx: List[Float] = []
let by: List[Float] = []

fn keypressed(k: String)
    if k == "space"
        bx = bx + [px + 16.0]
        by = by + [py]

fn update(dt: Float)
    if key_down("left")
        px = px - speed * dt
    if key_down("right")
        px = px + speed * dt
    for i in range(0, len(bx))
        by[i] = by[i] - 300.0 * dt

fn draw()
    draw_rect(px, py, 32.0, 32.0)
    for i in range(0, len(bx))
        draw_rect(bx[i], by[i], 4.0, 4.0)
\`\`\``
  },

  // ── Layer 3: Negative Knowledge ──
  {
    id: "NEG_NO_WHILE",
    layer: 3,
    features: [],
    dependencies: [],
    tokens: 30,
    targetLLMs: ["openai", "gemini"],
    content: `NEVER use \`while\`. Vibe does not have while loops. Use \`for condition\` instead:
WRONG: \`while x > 0\`
RIGHT: \`for x > 0\``
  },

  {
    id: "NEG_MUST_INIT",
    layer: 3,
    features: [],
    dependencies: [],
    tokens: 30,
    targetLLMs: ["openai"],
    content: `NEVER declare variables without initialization.
WRONG: \`let x: Float\`
RIGHT: \`let x: Float = 0.0\`
Every \`let\` and \`const\` MUST have \`= value\`.`
  },

  {
    id: "NEG_NO_COMPOUND_ASSIGN",
    layer: 3,
    features: [],
    dependencies: [],
    tokens: 25,
    targetLLMs: ["openai", "gemini"],
    content: `Do NOT use compound assignment operators (+=, -=, *=, /=).
WRONG: \`x += 1\`
RIGHT: \`x = x + 1\``
  },
]
```

### 4.3 Negative Knowledge 설계 원칙

벤치마크 오류 분석의 정량적 데이터에서 도출:

**원칙 1: 발생 빈도 기반 우선순위**

| Negative Knowledge | 벤치마크 실패 건수 | 비율 | 우선순위 |
|-------------------|-----------------|------|---------|
| `+= 금지` | 6건 | 25% | **최상** |
| `while 금지` | 2건 | 8.3% | **상** |
| `초기화 필수` | 2건 | 8.3% | **상** |
| `마크다운 금지` | 2건 | 8.3% | **상** |
| `콜론 블록 금지` | ~4건 (추정) | ~17% | **상** |

**원칙 2: "WRONG/RIGHT" 대비 형식**

LLM은 "하지 마라"보다 "대신 이렇게 해라"를 더 잘 따른다:

```
# 나쁜 Negative Knowledge
"Do not use while loops."

# 좋은 Negative Knowledge (WRONG/RIGHT 대비)
"NEVER use `while`. Use `for condition` instead.
 WRONG: `while x > 0`
 RIGHT: `for x > 0`"
```

**원칙 3: 근거 명시 금지**

LLM에게 "왜 안 되는지" 설명하면 오히려 해당 패턴을 활성화시킨다:

```
# 나쁜 Negative Knowledge (근거 포함)
"Vibe does not support while loops because Python and JavaScript's while
was considered but removed for simplicity."
→ LLM: "Python...while..." → while 패턴 활성화

# 좋은 Negative Knowledge (근거 없이 단호하게)
"NEVER use `while`. Use `for condition` instead."
→ LLM: 대안 패턴으로 직행
```

### 4.4 지식 베이스 유지보수

```
[유지보수 주기]
1. 문법 변경 시: 해당 Feature Chunk + Example Chunk 업데이트
2. 새 기능 추가 시: 새 청크 추가 + Feature Detection 규칙 추가
3. 벤치마크 실행 후: 새로운 실패 패턴 → Negative Knowledge 추가
4. LLM 모델 변경 시: targetLLMs 재평가

[자동화 가능 영역]
- 벤치마크 실패 시 자동으로 오류 유형 분류 → Negative Knowledge 후보 제안
- 프롬프트 토큰 수 자동 계산 → 예산 초과 경고
```

---

## 5. 예제 선택 전략 (Example Selection Strategy)

### 5.1 Few-shot 수렴점: 6개

LLM_CODE_GENERATION_ANALYSIS.md의 핵심 발견:
- 성능 향상은 약 **6개 예제에서 수렴** (log perplexity 개선 약 5.0)
- "단 하나의 one-shot 예제만 추가해도, 모델 아키텍처나 학습 데이터셋 설계 선택만큼의 성능 향상"
- "더 복잡한 입력을 가진 예제가 더 유익"

**전략**: 고정 2개 + 동적 3-4개 = 총 5-6개

### 5.2 고정 예제 (항상 포함)

```
고정 예제 1: Moving Rectangle (~85 토큰)
  커버 기능: let, fn, if, key_down, update, draw, dt, draw_rect
  이유: Vibe의 가장 기본적인 패턴. 거의 모든 게임 태스크의 기초.

고정 예제 2: Score Counter (~50 토큰)
  커버 기능: keypressed, str(), draw_text, Int 변수
  이유: 이벤트 처리 + 타입 변환 + 텍스트 표시의 최소 예제.
```

**Bouncing Ball을 고정 예제에서 제외하는 이유**: Moving Rectangle과 기능 커버리지가 85% 중복 (둘 다 update+draw+변수). 대신 Score Counter를 포함하여 keypressed + str() 패턴을 커버.

### 5.3 동적 예제 선택 알고리즘

```typescript
function selectExamples(
  features: Feature[],          // 감지된 필요 기능
  fixedExampleIds: string[],    // 이미 포함된 고정 예제
  budget: number                // 남은 토큰 예산
): KnowledgeChunk[] {

  const candidates = KNOWLEDGE_BASE
    .filter(c => c.layer === 2)                    // 예제 청크만
    .filter(c => !fixedExampleIds.includes(c.id))  // 고정 예제 제외

  // 1단계: 기능 커버리지 점수 계산
  const scored = candidates.map(ex => ({
    chunk: ex,
    // 요구 기능 중 이 예제가 커버하는 비율
    coverageScore: ex.features.filter(f => features.includes(f)).length,
    // 이미 고정 예제가 커버한 기능과의 중복 패널티
    redundancyPenalty: ex.features.filter(f =>
      fixedExampleIds.some(fid =>
        KNOWLEDGE_BASE.find(c => c.id === fid)?.features.includes(f)
      )
    ).length * 0.5
  }))

  // 2단계: (커버리지 - 중복) 순으로 정렬
  scored.sort((a, b) =>
    (b.coverageScore - b.redundancyPenalty) -
    (a.coverageScore - a.redundancyPenalty)
  )

  // 3단계: 예산 내에서 최대한 선택 (greedy)
  const selected: KnowledgeChunk[] = []
  let remaining = budget

  for (const s of scored) {
    if (s.coverageScore <= 0) break          // 관련 없는 예제 제외
    if (s.chunk.tokens <= remaining) {
      selected.push(s.chunk)
      remaining -= s.chunk.tokens
      if (selected.length >= 4) break        // 최대 4개
    }
  }

  return selected
}
```

### 5.4 예제 선택 시뮬레이션

**태스크: chain_reaction (Hard)**
- 감지 기능: lists, math, mouse, load_init, text_display
- 고정 예제: EX_MOVE_RECT (lists: X, math: X), EX_SCORE (text_display: O)

```
후보 예제 점수:
  EX_PARTICLES:  coverage=3(lists, math, mouse) - redundancy=0 = 3.0  ✓ 선택
  EX_COLLISION:  coverage=2(lists, math) - redundancy=0.5 = 1.5       ✓ 선택
  EX_FLOCK:      coverage=2(lists, math) - redundancy=1.0 = 1.0       ✓ 선택
  EX_SHOOTING:   coverage=1(lists) - redundancy=0.5 = 0.5             (예산 잔여시)
  EX_STATE:      coverage=1(mouse) - redundancy=0.5 = 0.5             (제외)

최종: 고정 2 + 동적 3 = 5개 예제 (수렴점 6에 근접)
```

**태스크: move_rectangle (Easy)**
- 감지 기능: (없음)
- 고정 예제: EX_MOVE_RECT, EX_SCORE

```
후보 예제 점수: 모든 후보의 coverage = 0
최종: 고정 2개만 (Easy에는 추가 예제 불필요)
```

### 5.5 예제 라이브러리 확장 전략

벤치마크의 **성공 출력**을 예제 라이브러리의 소스로 활용:

```
[예제 소스 우선순위]
1. Claude의 벤치마크 출력 (100% 통과) -- 가장 관용적(idiomatic)
2. GPT-4o의 통과 출력 (18/20) -- GPT-4o가 생성한 스타일이 GPT-4o에 가장 효과적
3. 수동 작성 예제 -- 교육적 목적에 최적화

[주의사항]
- Claude의 출력을 GPT-4o에게 예제로 보여주는 것이 반드시 최적은 아님
- 이상적으로는 LLM별 예제 라이브러리를 따로 유지
- 단, v0에서는 단일 라이브러리로 시작
```

**예제 축소 기법**: 벤치마크의 성공 출력(50-70줄)을 예제로 사용하기에는 너무 길다. 핵심 패턴만 추출하여 20-30줄로 축소:

```
[chain_reaction.vibe 원본: 67줄]
  → 핵심 패턴 추출:
    - load()에서 리스트 초기화 패턴
    - mousepressed에서 가장 가까운 엔티티 찾기 패턴
    - 상태 전이 패턴 (0.0 → 1.0 → 2.0)
    - 이중 for 루프에서 상호작용 패턴
  → 축소된 예제: ~30줄
```

---

## 6. 정적 프롬프트 vs RAG 비교: 전환점 분석

### 6.1 현재 상태 (정적 프롬프트가 우월한 구간)

| 지표 | 정적 프롬프트 | RAG |
|------|-------------|-----|
| 지식 범위 | v0 (7 키워드) | v0 (7 키워드) |
| 프롬프트 크기 | ~1,200 토큰 | ~1,300-1,800 토큰 |
| GPT-4o 정확도 | 90% | 90-95% (추정) |
| Gemini 정확도 | 50% | 60-70% (추정) |
| 구현 복잡도 | 0 (현상 유지) | 중간 (Feature Detection + 조합 로직) |
| 유지보수 비용 | 낮음 | 중간 |

**현 시점 결론**: v0의 7개 키워드만으로는 RAG의 ROI가 낮다. 정적 프롬프트 최적화 + Error-Feedback Loop이 더 효과적.

### 6.2 전환점 (RAG가 유리해지는 시점)

```
[전환점 공식]
RAG 도입 비용 < 정적 프롬프트 유지 비용

구체적으로:
  정적 프롬프트 토큰 수 > 2,000 토큰
  → 약 키워드 15개 + struct/enum/match 구현 시점
  → 정적 프롬프트로는 "필요 없는 지식"도 항상 전달해야 함
  → attention 분산으로 정확도 감소 시작
  → RAG로 필요한 지식만 전달하는 것이 효과적
```

**전환점 시뮬레이션**:

```
v0 (현재, 7 키워드):
  정적: ~1,200 토큰 → RAG 불필요

v1 (struct + enum + match 추가):
  정적: ~2,000 토큰 → RAG 선택적 (Negative Knowledge 동적 주입만으로도 가치)
  RAG:  ~1,500 토큰 (Core 700 + Dynamic 800)

v2 (trait + annotation + module 추가):
  정적: ~3,500 토큰 → RAG 필수
  RAG:  ~1,800 토큰 (Core 800 + Dynamic 1000)
  절감: ~49%

v3 (완전한 언어):
  정적: ~5,000+ 토큰 → 한계 초과, RAG 필수
  RAG:  ~2,200 토큰 (Core 900 + Dynamic 1300)
  절감: ~56%
```

### 6.3 하이브리드 전략: 점진적 전환

```
[Phase 0 - 현재] 정적 프롬프트만
  ├── vibe-context.ts 유지
  └── Error-Feedback Loop 도입 (우선)

[Phase 1 - v1 릴리스 시] Negative Knowledge RAG
  ├── Core Invariant 고정
  ├── Feature Chunks 고정 (아직 적으므로)
  └── Negative Knowledge만 동적 주입 (LLM별 분기)
  기대 효과: GPT-4o 90→95%, Gemini 50→65%

[Phase 2 - v2 릴리스 시] Feature + Example RAG
  ├── Core Invariant 고정
  ├── Feature Chunks 동적 (태스크별 선택)
  ├── Examples 동적 (기능 커버리지 기반)
  └── Negative Knowledge 동적 (LLM별)
  기대 효과: GPT-4o 95→98%, Gemini 65→85%

[Phase 3 - v3 이후] Full RAG
  ├── Core Invariant 고정 (확장)
  ├── 모든 지식 동적
  └── 예제 라이브러리 자동 확장 (벤치마크 출력 기반)
  기대 효과: 모든 LLM 95%+
```

---

## 7. 구현 접근법 (Implementation Approach)

### 7.1 아키텍처 개요

```
[요청 흐름]

User Request: "Make a shooting game"
       │
       ▼
┌──────────────────────┐
│  Feature Detector     │ ← 태스크 설명에서 필요 기능 추출
│  (규칙 기반)          │
└──────────┬───────────┘
           │ features: [lists, parallel_lists]
           ▼
┌──────────────────────┐
│  Chunk Selector       │ ← 기능 → 청크 매핑
│  (Knowledge Base)     │
└──────────┬───────────┘
           │ chunks: [LISTS, PARALLEL_LISTS, NEG_NO_WHILE, ...]
           ▼
┌──────────────────────┐
│  Example Selector     │ ← 기능 커버리지 기반 예제 선택
│  (Greedy Algorithm)   │
└──────────┬───────────┘
           │ examples: [EX_MOVE_RECT, EX_SCORE, EX_SHOOTING]
           ▼
┌──────────────────────┐
│  Budget Manager       │ ← 토큰 예산 내에서 조합
│  (2,500 토큰 상한)    │
└──────────┬───────────┘
           │ finalPrompt: Core + selectedChunks + selectedExamples + negKnowledge
           ▼
┌──────────────────────┐
│  Prompt Assembler     │ ← 최종 프롬프트 조립
│  (순서 배치)          │
└──────────┬───────────┘
           │
           ▼
       LLM API Call
```

### 7.2 프롬프트 조립 순서

LLM의 attention 패턴을 고려한 배치:

```
[프롬프트 구조 - 순서가 중요]

1. Role 지시 (첫 번째 = 가장 높은 attention)
2. Language Overview
3. Core Grammar (키워드, 타입, 변수, 함수, 제어흐름, 연산자)
4. Game Loop Functions
5. ────── 여기서부터 동적 ──────
6. [Dynamic] Feature Chunks (태스크에 필요한 기능 문법)
7. [Dynamic] Negative Knowledge (WRONG/RIGHT 대비)
8. [Dynamic] Examples (가장 마지막 = recency bias 활용)
9. Rules (마지막에 다시 한번 핵심 규칙 강조)
```

**배치 근거**:
- 위치 민감성(Position Sensitivity): LLM은 프롬프트의 처음과 끝에 가장 높은 attention
- 예제를 끝 부분에 배치하면 "가장 최근 본 패턴"으로 생성에 직접 영향
- Negative Knowledge는 예제 바로 전에 배치하여, 예제의 패턴이 Negative를 override하지 않도록

### 7.3 구현 단계 (Simple-First)

#### Step 1: Knowledge Base 정의 (~2시간)

```
파일: benchmark/knowledge-base.ts
내용: KnowledgeChunk[] 배열로 모든 청크 정의
테스트: 각 청크의 토큰 수 검증
```

현재 `vibe-context.ts`의 내용을 분해하여 청크로 재구성. 새로운 지식을 추가하는 것이 아니라, 기존 지식을 분리하는 것이 핵심.

#### Step 2: Feature Detector 구현 (~3시간)

```
파일: benchmark/feature-detector.ts
내용: 태스크 설명 → Feature[] 추출
테스트: 벤치마크 20개 태스크 전수 검증
  - 각 태스크의 예상 Feature 목록을 하드코딩
  - Feature Detector 출력과 비교
  - 100% 일치해야 통과
```

#### Step 3: Prompt Assembler 구현 (~2시간)

```
파일: benchmark/prompt-assembler.ts
내용: Core + Feature Chunks + Examples + Negative → 최종 프롬프트
테스트:
  - 토큰 예산 2,500 이하 검증
  - 의존성 자동 포함 검증 (PARALLEL_LISTS → LISTS 자동 추가)
  - LLM별 Negative Knowledge 분기 검증
```

#### Step 4: 벤치마크 통합 (~1시간)

```
파일: benchmark/contexts/vibe-rag-context.ts
내용: 기존 vibe-context.ts를 대체하는 RAG 기반 컨텍스트 생성기
변경: runner.ts에서 vibe 언어일 때 RAG 컨텍스트 사용 옵션 추가
```

#### Step 5: A/B 벤치마크 (~2시간)

```
실행: 동일 20개 태스크에서 정적 vs RAG 비교
  - vibe-static: 기존 vibe-context.ts
  - vibe-rag: 새 RAG 기반 컨텍스트
측정:
  - Pass rate 변화 (GPT-4o, Gemini 각각)
  - 토큰 효율성 변화
  - 오류 유형 변화
```

### 7.4 성공 기준

```
[Phase 1 성공 기준 - Negative Knowledge RAG만]
  - GPT-4o: 90% → 95%+ (2건 실패 → 1건 이하)
  - Gemini: 50% → 60%+ (10건 실패 → 8건 이하)
  - 프롬프트 토큰: 기존 대비 +20% 이내

[Phase 2 성공 기준 - Full Feature RAG]
  - GPT-4o: 95%+ 유지
  - Gemini: 65%+ (더 높으면 보너스)
  - 프롬프트 토큰: struct/enum 추가 후에도 2,500 이내

[실패 판정 기준]
  - RAG 도입 후 기존 대비 pass rate 감소 → 즉시 롤백
  - 특정 태스크에서 새로운 오류 유형 발생 → 해당 청크 검토
```

---

## 8. 핵심 통찰 요약

### 8.1 Vibe RAG가 일반 RAG와 다른 점

| 일반 RAG | Vibe RAG |
|----------|----------|
| 대규모 문서에서 검색 | 30개 미만의 소규모 지식 |
| 임베딩 기반 유사도 검색 | 규칙 기반 Feature Detection |
| 사용자 질의 → 관련 문서 | 태스크 설명 → 필요 기능 → 청크 |
| 검색 정확도가 핵심 | 기능 감지 정확도가 핵심 |
| 컨텍스트 윈도우 절약이 목적 | 불필요 지식 제거로 attention 집중이 목적 |
| Negative Knowledge 불필요 | Negative Knowledge가 핵심 (학습 데이터 중력 대응) |
| 모든 사용자에게 동일 검색 | LLM 모델별 차별화된 지식 주입 |

### 8.2 최우선 실행 항목

현재 시점에서 **가장 ROI가 높은 순서**:

```
1위: Error-Feedback Loop 구현 (design/error-feedback-loop.md)
     → 이미 설계 완료, ~11시간 구현, 즉각적 개선

2위: 프롬프트 오류 수정 (vibe-context.ts)
     → `Assignment: = += -= *= /=` 에서 += 등 제거
     → GPT-4o 실패 원인의 25%가 이 프롬프트 오류
     → 5분 작업, 즉각적 효과

3위: Negative Knowledge 주입 (Phase 1 RAG)
     → LLM별 "하지 마라" 분기만 추가
     → 2-3시간 구현, 중간 효과

4위: Full Feature RAG (Phase 2)
     → v1에서 struct/enum 추가 시점에 도입
     → 8-10시간 구현, 장기적 확장성
```

### 8.3 유지보수 원칙

```
[지식 베이스 갱신 규칙]
1. 벤치마크 실패 → 오류 분석 → Negative Knowledge 추가 (최우선)
2. 새 문법 기능 추가 → Feature Chunk + Example Chunk 추가
3. 벤치마크 성공 출력 → Example Library 후보 등록
4. LLM 모델 업데이트 → A/B 테스트로 Negative Knowledge 재평가

[절대 금지]
- Core Invariant에 선택적 지식 혼입 금지
- 예제 없이 규칙만 있는 청크 금지 (규칙 10줄 < 예제 1개)
- 한 청크에 2개 이상 기능 혼합 금지 (기능 단위 분리 원칙)
```

---

## 9. 결론

Vibe의 RAG 시스템은 "학습 데이터가 0인 언어를 LLM에게 가르치는" 독특한 문제를 해결한다. 일반적인 RAG의 "검색 정확도" 문제가 아니라, **"최소한의 토큰으로 최대한의 문법 전이를 달성하는"** 지식 설계 문제이다.

핵심 전략은 3가지:
1. **분리하되 대체하지 않는다** -- Core Invariant는 항상 유지
2. **부정 지식이 긍정 지식보다 ROI가 높다** -- "하지 마라"가 패턴 누출 방지의 핵심
3. **6개 예제 수렴점을 활용한다** -- 고정 2 + 동적 3-4의 하이브리드

가장 중요한 발견: **현 시점에서 RAG 자체보다 프롬프트 오류 수정(+= 제거)과 Error-Feedback Loop이 더 급하다.** RAG는 v1에서 struct/enum이 추가될 때 본격 도입하면 된다.
