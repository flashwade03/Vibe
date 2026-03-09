# Error-Feedback Loop 설계 분석

Vibe 언어의 LLM 코드 생성 파이프라인에 자기 교정(self-correction) 피드백 루프를 추가하기 위한 종합 분석 문서.

---

## 1. 현재 상태 분석

### 1.1 벤치마크 현황

| LLM | Pass Rate | 실패 횟수 |
|-----|-----------|----------|
| Claude | 100% (20/20) | 0 |
| GPT-4o | 90% (18/20) | 2 |
| Gemini | 50% (10/20) | 10 |

### 1.2 Gemini 실패 에러 분류 (10건 전수 분석)

실패한 출력물을 전수 조사한 결과, 에러를 4가지 카테고리로 분류할 수 있다.

| 카테고리 | 건수 | 에러 메시지 예시 | 근본 원인 |
|---------|------|----------------|----------|
| **출력 잘림 (Truncation)** | 5 | `expected RBRACKET, got EOF ("")`, `expected EQ, got NEWLINE ("")` | Gemini `maxOutputTokens` 한계 또는 조기 종료. 코드가 중간에 잘림 |
| **마크다운 코드 펜스** | 2 | `unexpected character: '\`'` | ` ```vibe ` 또는 ` ``` ` 를 출력에 포함 |
| **미지원 문법 사용** | 2 | `expected EQ, got NEWLINE ("")` | `while` 키워드 사용 (Vibe에는 없음, `for condition` 사용해야 함), 또는 초기값 없는 `let x: Float` 선언 |
| **문자열 잘림** | 1 | `unterminated string` | 출력 잘림으로 문자열 리터럴이 닫히지 않음 |

### 1.3 GPT-4o 실패 에러 분류 (2건)

| 태스크 | 에러 | 근본 원인 |
|-------|------|----------|
| twin_stick_dodge | `expected EQ, got NEWLINE ("")` | `while` 키워드 사용 (Vibe에 없음) |
| multi_wave_spawner | `expected EQ, got NEWLINE ("")` | 초기값 없는 변수 선언 `let spawn_x: Float` |

### 1.4 핵심 발견

**에러의 절대다수는 구문(syntax) 에러이며, 의미론적(semantic) 에러가 아니다.**

- 출력 잘림: 50% (5/10) — 피드백 루프로 해결 가능
- 마크다운 펜스: 20% (2/10) — 전처리로 해결 가능 (이미 `stripCodeFences` 존재하나 불완전)
- 미지원 문법: 30% (3/10+2) — 피드백 루프의 핵심 타겟
- 파싱 성공한 코드의 논리적 정확성은 검증 불가 (현재 파이프라인 한계)

---

## 2. 아키텍처 설계

### 2.1 제안 아키텍처: 2단계 방어 계층

```
┌──────────────────────────────────────────────────────┐
│                  Generation Pipeline                  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [LLM API Call]                                      │
│       │                                              │
│       ▼                                              │
│  ┌─────────────┐                                     │
│  │ Layer 0:     │  마크다운 펜스 제거, 공백 정규화    │
│  │ Preprocessor │  (stripCodeFences 강화)             │
│  └──────┬──────┘                                     │
│         ▼                                            │
│  ┌─────────────┐     ┌──────────────┐                │
│  │ Layer 1:     │────▶│ Vibe Pipeline│                │
│  │ Validate     │     │ lex→parse→   │                │
│  │              │◀────│ codegen      │                │
│  └──────┬──────┘     └──────────────┘                │
│         │                                            │
│    PASS?┼───YES──▶ return code ✓                     │
│         │                                            │
│        NO                                            │
│         │                                            │
│         ▼                                            │
│  ┌─────────────┐                                     │
│  │ Layer 2:     │  에러 분류 + 교정 프롬프트 생성     │
│  │ Error        │  + 정답 패턴 첨부                   │
│  │ Classifier   │                                    │
│  └──────┬──────┘                                     │
│         │                                            │
│         ▼                                            │
│  ┌─────────────┐                                     │
│  │ Retry LLM   │  최대 2회 재시도                    │
│  │ (same model) │                                    │
│  └──────┬──────┘                                     │
│         │                                            │
│         ▼                                            │
│    Validate again → PASS? → return                   │
│                   → FAIL? → return best attempt      │
│                              + error report          │
└──────────────────────────────────────────────────────┘
```

### 2.2 최적 재시도 횟수: 2회 (최대 3회 시도)

**근거:**

1. **PyCapsule 연구 (2025)**: 최대 5회 시도 허용했으나, 1차 시도에서 실패 케이스의 9-18% 복구, 2차에서 1-5% 추가, 3차 이후 거의 무의미. 대부분의 개선은 처음 2회 재시도에 집중.

2. **Self-Debugging (ICLR 2024)**: "10배 이상의 후보 프로그램을 생성하는 기준 모델과 동등하거나 더 나은 성능" — 소수의 정밀한 재시도가 다량의 무작위 생성보다 효과적.

3. **Vibe 특수 상황**: 에러가 대부분 구문적이고 패턴이 한정적(5가지 미만)이므로, 1회 재시도로 충분한 경우가 대부분. 안전망으로 2회까지.

4. **비용 분석**: 평균 토큰 기준
   - Gemini 평균 출력: ~40 토큰
   - GPT-4o 평균 출력: ~161 토큰
   - 재시도 시 에러 컨텍스트 추가: ~200 토큰 (프롬프트 오버헤드)
   - 2회 재시도 최악: 원래 비용의 ~2.5x (시스템 프롬프트 재전송 시)
   - 에러 컨텍스트만 전송 시: ~1.8x

### 2.3 전체 코드 + 에러 vs 에러 컨텍스트만

**결론: 전체 코드 + 에러 + 정답 패턴 전송.**

이유:
- Vibe 코드가 짧다 (평균 40-160 토큰). 전체 코드를 보내도 비용 부담이 미미.
- LLM이 전체 맥락 없이 부분 수정하면 다른 부분과 불일치 발생 가능.
- 연구 결과: PyCapsule의 "concise and highly relevant natural language feedback"이 가장 효과적이었으나, 이는 코드 전체 + 구조화된 에러 피드백을 의미.

### 2.4 전체 재작성 vs 부분 수정

**결론: 전체 재작성 요청.**

이유:
- Vibe 코드가 짧으므로 전체 재작성 비용이 낮다.
- 들여쓰기 기반 언어에서 부분 수정은 위험하다 (들여쓰기 불일치 발생 가능).
- "diff 기반 수정"을 LLM에 요청하면 오히려 에러 확률이 높아진다.
- PyCapsule 연구에서도 "fix mode"가 이전 솔루션 + 에러 메시지를 받아 새 코드를 생성하는 방식.

### 2.5 연쇄 에러(Cascading Errors) 처리

**전략: 첫 번째 에러만 전달.**

현재 Vibe 파이프라인은 첫 번째 에러에서 예외를 throw하므로 자연스럽게 하나의 에러만 반환된다. 이는 오히려 장점이다:

- 첫 번째 에러 수정 시 연쇄 에러가 자동 해소되는 경우가 대부분
- 여러 에러를 한꺼번에 보내면 LLM이 혼란
- 에러 하나씩 순차 해결이 연구에서도 더 효과적으로 검증됨

### 2.6 시스템 프롬프트 재전송 여부

**결론: 재전송한다.**

- Vibe 시스템 프롬프트는 ~170줄로 짧다 (~2000 토큰)
- 시스템 프롬프트 없이 에러만 보내면 LLM이 Vibe 문법 규칙을 "잊고" 같은 실수를 반복할 가능성
- 비용 증가: 프롬프트 입력 토큰 기준 ~2000 추가 (출력 토큰 대비 입력 단가가 낮으므로 경제적)
- 단, 에러 피드백에 해당 에러와 관련된 문법 규칙을 강조 반복한다

---

## 3. 에러 메시지 품질 개선

### 3.1 현재 에러 메시지 분석

현재 에러 형식:
```
benchmark.vibe:4:34: parser error: expected EQ, got NEWLINE ("")
```

**문제점:**
- LLM에게 "왜" 에러가 났는지 알려주지 않음
- "무엇을 대신 써야 하는지" 알려주지 않음
- Vibe-특화 제안이 없음

### 3.2 에러 분류 및 LLM 맞춤 피드백

에러를 카테고리별로 분류하고, 각 카테고리에 대해 LLM이 이해할 수 있는 교정 피드백을 생성한다.

```typescript
interface ErrorFeedback {
  category: ErrorCategory;
  originalError: string;
  line: number;
  col: number;
  codeContext: string;       // 에러 전후 3줄
  explanation: string;       // LLM이 이해할 수 있는 설명
  correctPattern: string;    // 올바른 코드 패턴
  vibeRule: string;          // 관련 Vibe 문법 규칙
}

type ErrorCategory =
  | "UNSUPPORTED_KEYWORD"    // while, do, then, end 등 사용
  | "MISSING_INITIALIZER"    // let x: Float (초기값 없음)
  | "COMPOUND_ASSIGNMENT"    // +=, -=, *=, /= 사용
  | "MARKDOWN_FENCE"         // ```vibe 등
  | "TRUNCATED_OUTPUT"       // EOF에서 괄호/블록 미완성
  | "UNEXPECTED_CHAR"        // !, @, # 등
  | "INDENTATION_ERROR"      // 들여쓰기 불일치
  | "UNKNOWN"                // 분류 불가
```

### 3.3 카테고리별 교정 피드백 예시

#### UNSUPPORTED_KEYWORD (`while` 사용)
```
❌ 에러: benchmark.vibe:64:5: parser error: expected EQ, got NEWLINE ("")

📍 에러 위치 코드:
  62 |    let i = 0
  63 |    while i < len(bx)
  64 |        bx[i] = bx[i] + bvx[i] * dt

💡 원인: Vibe에는 `while` 키워드가 없습니다.
   조건 기반 반복문은 `for <condition>` 형태를 사용합니다.

✅ 올바른 패턴:
  let i = 0
  for i < len(bx)
      bx[i] = bx[i] + bvx[i] * dt
      i = i + 1
```

#### MISSING_INITIALIZER (`let x: Float` 초기값 없음)
```
❌ 에러: benchmark.vibe:34:22: parser error: expected EQ, got NEWLINE ("")

📍 에러 위치 코드:
  33 |        let edge = int(rand_float(0.0, 4.0))
  34 |        let spawn_x: Float
  35 |        let spawn_y: Float

💡 원인: Vibe에서 `let` 선언은 반드시 초기값이 필요합니다.
   초기값 없는 선언은 지원하지 않습니다.

✅ 올바른 패턴:
  let spawn_x: Float = 0.0
  let spawn_y: Float = 0.0
```

#### COMPOUND_ASSIGNMENT (`+=` 사용)
```
❌ 에러: benchmark.vibe:15:10: lexer error: unexpected character: '+'
   (또는 parser error: expected NEWLINE, got EQ)

💡 원인: Vibe에서 복합 대입 연산자(+=, -=, *=, /=)를 사용했습니다.
   Vibe는 `=` 만 지원합니다.

✅ 올바른 패턴:
  -- ❌ x += 5
  x = x + 5

  -- ❌ speed *= dt
  speed = speed * dt
```

#### TRUNCATED_OUTPUT (출력 잘림)
```
❌ 에러: benchmark.vibe:15:EOF: parser error: expected RBRACKET, got EOF ("")

💡 원인: 코드가 완전하지 않습니다. 출력이 중간에 끊긴 것으로 보입니다.
   모든 괄호, 리스트, 함수 본문이 완전히 닫혀야 합니다.

⚠️ 지시: 전체 코드를 처음부터 다시 작성해주세요.
   코드를 더 간결하게 작성하여 출력 한도 내에 맞추세요.
```

### 3.4 코드 컨텍스트 윈도우

에러 발생 줄 전후 **3줄**을 포함한다.

이유:
- Vibe는 들여쓰기 기반이므로 주변 줄의 들여쓰기 레벨이 중요
- 너무 넓으면 (5줄+) LLM이 핵심을 놓침
- 너무 좁으면 (1줄) 맥락 부족

```typescript
function extractContext(code: string, errorLine: number, window: number = 3): string {
  const lines = code.split("\n");
  const start = Math.max(0, errorLine - window - 1);
  const end = Math.min(lines.length, errorLine + window);
  return lines.slice(start, end)
    .map((line, i) => {
      const lineNum = start + i + 1;
      const marker = lineNum === errorLine ? ">>>" : "   ";
      return `${marker} ${lineNum} | ${line}`;
    })
    .join("\n");
}
```

---

## 4. 재시도 프롬프트 엔지니어링

### 4.1 재시도 프롬프트 구조

```
[시스템 프롬프트: 기존 Vibe 문법 전체 — 변경 없음]

[사용자 메시지:]
이전에 아래 작업을 위한 Vibe 코드를 생성했지만 컴파일 에러가 발생했습니다.

## 원래 작업
{original_task_description}

## 이전 코드 (에러 포함)
```
{previous_code}
```

## 컴파일 에러
{structured_error_feedback}

## 수정 지시
위 에러를 수정하여 전체 코드를 다시 작성해주세요.
반드시 아래 규칙을 지켜주세요:
- {에러 카테고리별 구체적 규칙}
- 출력은 Vibe 코드만 (마크다운 코드 펜스 사용 금지)
- 모든 괄호와 블록을 완전히 닫을 것
```

### 4.2 핵심 원칙: 에러 + 정답 패턴 동시 제공

연구 결과에 따르면, "무엇이 잘못되었는지"만 알려주는 것보다 "올바른 패턴이 무엇인지"를 함께 보여주는 것이 효과적이다.

```
❌ 약한 피드백: "expected EQ, got NEWLINE"
✅ 강한 피드백: "Vibe에서 let 선언은 초기값이 필수입니다. `let x: Float = 0.0` 형태로 작성하세요."
```

### 4.3 온도(Temperature) 조절

| 시도 | Temperature | 이유 |
|------|------------|------|
| 1차 (초기 생성) | 0.2 | 현재 벤치마크 설정 유지 |
| 2차 (1차 재시도) | 0.1 | 더 보수적으로 — 알려진 패턴에 가까이 |
| 3차 (2차 재시도) | 0.3 | 약간 높여서 다른 접근 시도 |

근거: 첫 재시도에서는 "거의 맞는" 코드를 보수적으로 교정하고, 그래도 실패하면 마지막 시도에서 약간 다른 전략을 유도한다.

### 4.4 모델 교체 전략

**같은 모델로 재시도가 기본이다.**

이유:
- 다른 모델로 전환하면 API 키, 엔드포인트, 비용 구조가 달라짐
- Gemini 50% → Gemini+피드백으로 ~80-90% 달성이 목표
- 모델 교체는 "피드백 루프"의 범위를 벗어남 (별도 fallback 전략)

단, **비용 최적화 관점**에서:
- Gemini가 3회 모두 실패 시: 해당 태스크를 "Gemini 불가"로 마킹하고 보고
- 프로덕션에서는 Gemini 실패 → Claude/GPT-4o 폴백 고려 가능

---

## 5. 성능 및 비용 분석

### 5.1 토큰 비용 추정

**재시도 없이 (현재):**
```
입력: 시스템 프롬프트 ~2000 토큰 + 태스크 설명 ~200 토큰 = ~2200 토큰
출력: Gemini ~40 토큰, GPT-4o ~161 토큰
```

**1회 재시도 시:**
```
입력: 시스템 프롬프트 ~2000 + 태스크 ~200 + 이전 코드 ~100 + 에러 피드백 ~150 = ~2450 토큰
출력: ~40-161 토큰 (동일)
```

**비용 배율:**

| 시나리오 | 입력 토큰 | 출력 토큰 | 비용 배율 (vs 1회) |
|---------|----------|----------|------------------|
| 1회 시도 (현재) | 2,200 | 100 | 1.0x |
| 2회 시도 (1회 재시도) | 4,650 | 200 | ~1.9x |
| 3회 시도 (2회 재시도) | 7,100 | 300 | ~2.8x |

**실제 예상 비용:** 대부분의 경우(현재 pass rate 기준) 재시도가 필요 없으므로:
- GPT-4o: 90% 패스 → 10%만 재시도 → 평균 비용 1.0 + 0.1 * 0.9 = **~1.09x**
- Gemini: 50% 패스 → 50% 재시도 → 평균 비용 1.0 + 0.5 * 0.9 = **~1.45x**

### 5.2 레이턴시 영향

| LLM | 현재 평균 레이턴시 | 재시도 포함 예상 |
|-----|-----------------|---------------|
| Gemini | ~10,000ms | 패스 케이스: 동일, 실패 케이스: ~20,000-30,000ms |
| GPT-4o | ~2,700ms | 패스 케이스: 동일, 실패 케이스: ~5,400-8,100ms |

### 5.3 더 좋은 모델 vs 약한 모델 + 재시도

**분석:**
```
Gemini (약한 모델) + 2회 재시도: 비용 ~1.45x, 예상 pass rate ~80-90%
Claude (강한 모델) 1회: 비용 ~3-5x (Claude가 Gemini보다 비쌈), pass rate 100%
```

**결론:**
- **정확도 최우선이면** Claude 단독 사용이 경제적 (100% pass, 재시도 오버헤드 없음)
- **비용 최우선이면** Gemini + 피드백 루프가 경제적 (1.45x 비용으로 ~85% 달성)
- **최적 전략**: Gemini + 2회 재시도 → 여전히 실패 시 Claude 폴백

---

## 6. Constrained Decoding과의 통합

### 6.1 역할 분담

```
┌─────────────────────────────────────────────────┐
│           방어 계층 (Defense in Depth)            │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 0: 전처리                                │
│  ├─ 마크다운 코드 펜스 제거                      │
│  ├─ 탭 → 스페이스 변환                          │
│  └─ 후행 공백 제거                              │
│                                                 │
│  Layer 1: Constrained Decoding (미래)            │
│  ├─ 토큰 레벨에서 문법 위반 차단                 │
│  ├─ 키워드 정확도 보장                           │
│  └─ 괄호 매칭 보장                              │
│  → 구문(syntax) 에러 차단                       │
│                                                 │
│  Layer 2: Error-Feedback Loop (이 설계)          │
│  ├─ 구문 에러 감지 + 교정 재시도                 │
│  ├─ 의미론적 검증 (빌트인 함수 존재 확인 등)     │
│  └─ Lua 런타임 검증 (선택적)                    │
│  → 구문 + 의미론(semantic) 에러 교정             │
│                                                 │
│  Layer 3: 런타임 검증 (v1+)                      │
│  ├─ 생성된 Lua를 실제 실행                      │
│  ├─ Lua 런타임 에러 포착                        │
│  └─ 에러 피드백으로 재생성                      │
│  → 런타임 에러 교정                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 6.2 Constrained Decoding이 처리 못하는 것 → Feedback Loop이 처리

Constrained decoding은 **토큰 생성 시점**에서 문법을 강제하므로 구문 에러를 원천 차단한다. 그러나:

1. **의미론적 에러**: 존재하지 않는 함수 호출 (예: `abs()` — Vibe에 없음)
2. **타입 불일치**: `draw_rect`에 인자 6개 전달 (4개가 정상)
3. **논리적 에러**: 올바른 구문이지만 의도와 다른 동작
4. **Constrained decoding 미지원 API**: Gemini/OpenAI API가 커스텀 문법 제약을 지원하지 않을 수 있음

따라서 **Feedback Loop은 Constrained Decoding과 상호 보완적**이다.

### 6.3 의미론적 검증 확장

현재 파이프라인 (`lex → parse → codegen`)을 넘어 추가 검증 가능:

```typescript
interface SemanticValidator {
  // 1. 빌트인 함수 존재 확인
  checkBuiltinFunctions(ast: Program): ValidationResult;

  // 2. 게임 루프 함수 시그니처 확인
  checkGameLoopSignatures(ast: Program): ValidationResult;

  // 3. 미정의 변수 참조 확인 (단순 스코프 분석)
  checkUndefinedReferences(ast: Program): ValidationResult;
}
```

**구현 우선순위:**

| 검증 | 구현 난이도 | 효과 | 우선순위 |
|------|-----------|------|---------|
| 빌트인 함수 존재 확인 | 낮음 (BUILTIN_MAP 조회) | 중간 | P0 |
| 게임 루프 시그니처 | 낮음 (FnDecl 이름/파라미터 확인) | 낮음 | P1 |
| 미정의 변수 참조 | 중간 (스코프 트래킹) | 높음 | P1 |
| Lua 런타임 검증 | 높음 (love 환경 필요) | 높음 | P2 |

### 6.4 빌트인 함수 검증 구현 스케치

```typescript
const KNOWN_BUILTINS = new Set([
  ...Object.keys(BUILTIN_MAP),  // key_down, draw_rect, etc.
  "range", "len",               // 특수 처리 함수
]);

const GAME_LOOP_FUNCTIONS = new Set([
  "update", "draw", "load",
  "keypressed", "keyreleased",
  "mousepressed", "mousereleased", "mousemoved",
]);

function validateSemantics(ast: Program): ValidationResult {
  const errors: string[] = [];
  const definedFunctions = new Set<string>();

  // 1차: 정의된 함수 수집
  for (const decl of ast.body) {
    if (decl.kind === "FnDecl") {
      definedFunctions.add(decl.name);
    }
  }

  // 2차: 호출된 함수가 정의되었거나 빌트인인지 확인
  walkCalls(ast, (callExpr) => {
    if (callExpr.callee.kind === "Identifier") {
      const name = callExpr.callee.name;
      if (!definedFunctions.has(name) &&
          !KNOWN_BUILTINS.has(name) &&
          !GAME_LOOP_FUNCTIONS.has(name)) {
        errors.push(
          `Unknown function "${name}" at line ${callExpr.loc.line}. ` +
          `Available built-in functions: ${[...KNOWN_BUILTINS].join(", ")}`
        );
      }
    }
  });

  return { valid: errors.length === 0, errors };
}
```

---

## 7. 엣지 케이스 처리

### 7.1 같은 에러 반복 시

**전략: 에러 에스컬레이션**

```
1차 실패: 일반 피드백 (에러 + 정답 패턴)
2차 실패 (같은 에러): 강화된 피드백 + 구체적 코드 예시 추가
   "이 에러는 이전 시도에서도 발생했습니다.
    반드시 `while`이 아닌 `for condition` 문법을 사용하세요.
    예시: for i < 10 (줄바꿈) (들여쓰기) i = i + 1"
3차 실패: 포기 + 최선의 시도 반환 + 에러 보고
```

```typescript
function isSameError(prev: string, curr: string): boolean {
  // 같은 에러 카테고리인지 확인
  return classifyError(prev) === classifyError(curr);
}
```

### 7.2 한 에러 수정이 다른 에러 유발

**전략: 진행 추적**

```typescript
interface RetryState {
  attempt: number;
  previousErrors: ErrorFeedback[];
  bestCode: string;        // 가장 적은 에러를 가진 코드
  bestErrorCount: number;  // 해당 코드의 에러 수
}
```

에러 수가 증가하면 이전 최선의 코드를 유지한다. 단, 현재 파이프라인은 첫 에러에서 throw하므로 에러 수를 직접 비교하기 어렵다. 대안으로 "에러 발생 줄 번호"가 증가하면 진행 중인 것으로 간주한다 (코드 앞부분은 수정되었다는 의미).

### 7.3 구문은 맞지만 논리가 틀린 코드

**현재로서는 해결 불가.** 이유:
- Vibe에 타입 체커가 없음 (v0 범위)
- 논리적 정확성 검증에는 실행 + 기대 동작 비교 필요
- 기대 동작을 자동화하려면 비주얼 테스트 또는 상태 검증 필요

**v1 이후 방안:**
- 생성된 Lua를 headless LOVE2D로 실행하여 런타임 에러 포착
- "smoke test" — 1프레임 실행하여 크래시 여부 확인
- 변수 상태 스냅샷으로 기본 동작 확인

### 7.4 최대 재시도 예산

| 사용 맥락 | 최대 시도 | 이유 |
|----------|---------|------|
| 벤치마크 | 3 (1+2) | 비용 통제, 통계적 의미 유지 |
| 대화형 사용 | 3 (1+2) | 사용자 대기 시간 한계 (~30초) |
| 배치 처리 | 5 (1+4) | 비용 허용 시 최대한 시도 |

---

## 8. 예상 정확도 개선

### 8.1 에러 카테고리별 교정 성공률 예측

| 카테고리 | 건수 | 1회 재시도 교정률 | 2회 재시도 교정률 | 근거 |
|---------|------|-----------------|-----------------|------|
| 출력 잘림 | 5 | 60% (3건) | 80% (4건) | "코드를 간결하게" 지시 + 전체 재작성. 잘림이 근본적 한계일 수 있음 |
| 마크다운 펜스 | 2 | 95% (2건) | 99% | 전처리(Layer 0)에서 거의 완전 해결 가능. 재시도 불필요 |
| 미지원 문법 | 5 | 80% (4건) | 90% (4-5건) | 정답 패턴을 직접 보여주므로 교정 효과 높음 |

### 8.2 종합 예상 결과

**전처리(마크다운 펜스 제거 강화)만으로:**
- Gemini: 50% → **60%** (+2건)

**전처리 + 1회 재시도:**
- Gemini: 50% → **75-80%** (+5-6건)

**전처리 + 2회 재시도:**
- Gemini: 50% → **80-90%** (+6-8건)

**GPT-4o + 1회 재시도:**
- GPT-4o: 90% → **95-100%** (+1-2건)

### 8.3 해결 불가능한 케이스

출력 잘림이 모델의 근본적 한계(context window 부족, 생성 능력 부족)인 경우:
- `maxOutputTokens`를 4096으로 증가시켜도 긴 코드를 생성 못하는 모델
- 이런 경우는 피드백 루프로 해결 불가 → 모델 업그레이드 또는 태스크 분해 필요

---

## 9. 구현 계획

### 9.1 파일 구조

```
src/
├── feedback/
│   ├── error-classifier.ts    -- 에러 분류기
│   ├── feedback-generator.ts  -- LLM용 교정 피드백 생성
│   ├── retry-loop.ts          -- 재시도 루프 로직
│   └── semantic-validator.ts  -- 의미론적 검증 (빌트인 확인 등)
```

### 9.2 핵심 인터페이스

```typescript
// retry-loop.ts
interface RetryConfig {
  maxRetries: number;           // 기본값: 2
  includeSystemPrompt: boolean; // 기본값: true
  temperatures: number[];       // [0.2, 0.1, 0.3]
  enableSemanticValidation: boolean; // 기본값: true
}

interface RetryResult {
  code: string;
  valid: boolean;
  attempts: number;            // 실제 시도 횟수
  errors: string[];            // 최종 에러 (실패 시)
  totalLatencyMs: number;
  totalTokens: number;         // 전체 시도의 토큰 합계
}

async function generateWithRetry(
  provider: LLMProvider,
  systemPrompt: string,
  taskDescription: string,
  config: RetryConfig & BenchmarkConfig
): Promise<RetryResult> {
  // 1차 생성
  let { code, latencyMs } = await callLLM(provider, systemPrompt, taskDescription, config);
  code = preprocess(code);  // Layer 0

  let validation = validateFull(code);  // Layer 1 + 2
  let attempt = 1;
  let totalLatency = latencyMs;

  while (!validation.valid && attempt <= config.maxRetries) {
    const feedback = generateFeedback(code, validation, attempt);
    const retryPrompt = buildRetryPrompt(taskDescription, code, feedback);
    const temp = config.temperatures[attempt] ?? 0.2;

    const result = await callLLM(provider, systemPrompt, retryPrompt, { ...config, temperature: temp });
    code = preprocess(result.code);
    validation = validateFull(code);

    totalLatency += result.latencyMs;
    attempt++;
  }

  return {
    code,
    valid: validation.valid,
    attempts: attempt,
    errors: validation.errors,
    totalLatencyMs: totalLatency,
    totalTokens: estimateTokens(code) * attempt,
  };
}
```

### 9.3 전처리(Layer 0) 강화

현재 `stripCodeFences`는 ```` ```vibe ````을 처리하지만, 일부 케이스를 놓친다.

```typescript
function preprocess(code: string): string {
  let cleaned = code;

  // 1. 마크다운 코드 펜스 제거 (기존 로직 강화)
  cleaned = stripCodeFences(cleaned);

  // 2. 코드 시작 전 설명 텍스트 제거
  //    "Here's the Vibe code:" 같은 텍스트가 앞에 올 수 있음
  const firstCodeLine = cleaned.split("\n").findIndex(
    line => /^(fn |let |const |--|$)/.test(line.trimStart())
  );
  if (firstCodeLine > 0) {
    cleaned = cleaned.split("\n").slice(firstCodeLine).join("\n");
  }

  // 3. 탭 → 4스페이스 변환
  cleaned = cleaned.replace(/\t/g, "    ");

  // 4. 후행 공백 제거
  cleaned = cleaned.split("\n").map(l => l.trimEnd()).join("\n");

  // 5. 후행 빈 줄 제거
  cleaned = cleaned.trimEnd() + "\n";

  return cleaned;
}
```

### 9.4 벤치마크 통합

`benchmark/runner.ts`에 재시도 옵션을 추가한다.

```typescript
// runner.ts — 변경 부분
const RETRY_ENABLED = process.env.VIBE_RETRY !== "false";
const MAX_RETRIES = parseInt(process.env.VIBE_MAX_RETRIES ?? "2");

// 기존 callLLM → generateWithRetry 교체
const result = RETRY_ENABLED
  ? await generateWithRetry(llm, langCtx.systemPrompt, task.description, {
      maxRetries: MAX_RETRIES,
      includeSystemPrompt: true,
      temperatures: [0.2, 0.1, 0.3],
      enableSemanticValidation: true,
      ...config,
    })
  : await callLLMDirect(llm, langCtx.systemPrompt, task.description, config);
```

### 9.5 구현 단계

| 단계 | 내용 | 예상 시간 |
|------|------|----------|
| **Phase 1** | 전처리 강화 (`stripCodeFences` 개선, 탭 변환) | 1시간 |
| **Phase 2** | 에러 분류기 (`error-classifier.ts`) | 2시간 |
| **Phase 3** | 피드백 생성기 (`feedback-generator.ts`) | 2시간 |
| **Phase 4** | 재시도 루프 (`retry-loop.ts`) | 2시간 |
| **Phase 5** | 벤치마크 통합 + 결과 비교 | 1시간 |
| **Phase 6** | 의미론적 검증기 (`semantic-validator.ts`) | 3시간 |
| **총계** | | ~11시간 |

---

## 10. 관련 연구 및 업계 동향

### 10.1 학술 연구

| 연구 | 핵심 결과 | Vibe 적용 시사점 |
|------|----------|-----------------|
| [Self-Debugging (ICLR 2024)](https://arxiv.org/abs/2304.05128) | 코드 설명(rubber duck debugging)으로 최대 12% 개선. 10x 후보 생성과 동등한 효과 | Vibe는 외부 피드백(컴파일 에러)이 있으므로 더 효과적일 것 |
| [PyCapsule (2025)](https://arxiv.org/html/2502.02928v1) | 2-agent 아키텍처로 BigCodeBench 24.4% 개선. 1차 시도에서 9-18% 복구, 2차 1-5%, 이후 무의미 | 2회 재시도 최적. 에러 핸들러의 "concise and relevant feedback" 패턴 채택 |
| [Accuracy-Correction Paradox (2025)](https://arxiv.org/abs/2601.00828) | 약한 모델이 교정률 1.6x 더 높음 (26.8% vs 16.7%) | Gemini(50%)가 교정 혜택을 가장 많이 받을 것 |
| [LLMLOOP (ICSME 2025)](https://valerio-terragni.github.io/assets/pdf/ravi-icsme-2025.pdf) | 컴파일 에러 피드백 루프로 Java 코드 개선 | 컴파일러 에러 + 코멘트 기반 피드백 패턴 참조 |
| [Constrained Decoding (2025)](https://arxiv.org/html/2508.15866v1) | 문법 제약 디코딩으로 컴파일 에러 50% 이상 감소 | 피드백 루프와 상호 보완적. API 지원 시 Layer 1으로 추가 |

### 10.2 업계 사례

| 도구 | 접근법 | Vibe 참고 사항 |
|------|-------|---------------|
| **Cursor** | 에이전트가 코드 생성 → 실행/테스트 → 에러 시 자동 수정 루프. 최대 25 요청/세션 | 피드백 루프 + 인간 검증 체크포인트 |
| **GitHub Copilot** | 인라인 제안 → 에러 시 사용자 수동 수정 → 컨텍스트 학습 | 자동 재시도 없음 — Vibe는 자동화가 더 적합 |
| **Replit Agent** | 코드 생성 → 실행 → 에러 → 자동 수정 → 실행 반복 | Vibe와 유사한 패턴. 런타임 검증까지 포함 |

---

## 11. 결론 및 권장 사항

### 즉시 구현 (ROI 최고)

1. **전처리 강화** — 마크다운 펜스 제거 개선만으로 Gemini +10% (50→60%)
2. **에러 분류기 + 피드백 생성기** — 카테고리별 맞춤 교정 피드백
3. **2회 재시도 루프** — Gemini +25-35% (50→75-85%), GPT-4o +5-10% (90→95-100%)

### 중기 (v0.5)

4. **의미론적 검증** — 빌트인 함수 존재 확인, 게임 루프 시그니처 검증
5. **벤치마크 결과 비교** — 재시도 전후 pass rate, 비용, 레이턴시 추적

### 장기 (v1+)

6. **Lua 런타임 검증** — headless LOVE2D로 1프레임 smoke test
7. **Constrained Decoding** — API 지원 시 Layer 1 추가
8. **모델 폴백 체인** — Gemini 실패 → GPT-4o → Claude

---

## Sources

- [Teaching Large Language Models to Self-Debug (ICLR 2024)](https://arxiv.org/abs/2304.05128)
- [PyCapsule: Large Language Model Guided Self-Debugging Code Generation (2025)](https://arxiv.org/html/2502.02928v1)
- [Decomposing LLM Self-Correction: The Accuracy-Correction Paradox (2025)](https://arxiv.org/abs/2601.00828)
- [When Can LLMs Actually Correct Their Own Mistakes? (MIT Press TACL)](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00713/125177)
- [LLMLOOP: Improving LLM-Generated Code (ICSME 2025)](https://valerio-terragni.github.io/assets/pdf/ravi-icsme-2025.pdf)
- [Revisit Self-Debugging with Self-Generated Tests (ACL 2025)](https://aclanthology.org/2025.acl-long.881/)
- [Correctness-Guaranteed Code Generation via Constrained Decoding (2025)](https://arxiv.org/html/2508.15866v1)
- [Self-Correction in LLMs: A Review](https://theelderscripts.com/self-correction-in-llm-calls-a-review/)
- [Self-Correcting LLM Papers Collection (GitHub)](https://github.com/teacherpeterpan/self-correction-llm-papers)
- [Strategies to prevent Copilot from Trial-and-Error loops (GitHub Discussion)](https://github.com/orgs/community/discussions/182145)
- [Iterative Refinement with Compiler Feedback (COCOGEN)](https://www.themoonlight.io/en/review/iterative-refinement-of-project-level-code-context-for-precise-code-generation-with-compiler-feedback)
- [TreeCoder: Systematic Exploration of Decoding Constraints for Code Generation](https://arxiv.org/html/2511.22277v1)
