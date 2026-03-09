# Vibe 코드 생성 방어 전략: Constrained Decoding + Error-Feedback Loop 통합 분석

> 2026-03-09 | Systems Integration Strategist Report
> "현실 검증(Reality Check)" 관점의 분석

---

## 0. 분석 요약 (Executive Summary)

**결론부터 말한다**: Vibe의 주 타겟 환경(클라우드 API)에서 가장 실용적인 전략은 **"Error-Feedback Loop 우선 + OpenAI CFG를 전략적 활용"**이다. Constrained Decoding을 "만능 해결책"으로 기대하는 것은 현실과 맞지 않으며, 각 접근법의 한계를 정확히 인식한 위에서 조합해야 한다.

**핵심 발견**:
1. OpenAI GPT-5/5.2가 **Lark 문법 기반 CFG 제약**을 네이티브 지원한다 -- 이것이 게임 체인저
2. 단, CFG 제약의 레이턴시가 **8-10x 느려진다** (~9.5초) -- 5초 목표와 직접 충돌
3. Anthropic/Google은 **JSON Schema 수준의 Structured Output만 지원** -- 임의 CFG 미지원
4. Error-Feedback Loop는 **모든 환경에서 작동**하며 첫 번째 재시도에서 **최대 24% 개선**
5. 두 근본 문제("모델 의존성", "학습 데이터 영향") 중 어떤 접근법도 **완전히 해결하지 못한다**

---

## 1. 전략 비교: 환경별 실현 가능성

### 1.1 환경별 매트릭스

| 환경 | Constrained Decoding | Error-Feedback | 둘 다 |
|------|---------------------|----------------|-------|
| **OpenAI API (GPT-5+)** | **가능** (Lark CFG, 네이티브) | **가능** (즉시 구현 가능) | **가능** (최적 조합) |
| **OpenAI API (GPT-4o)** | **JSON Schema만** (임의 CFG 불가) | **가능** | 부분적 |
| **Anthropic API (Claude)** | **JSON Schema만** (`output_format`) | **가능** | 부분적 |
| **Google API (Gemini)** | **JSON Schema만** (`responseSchema`) | **가능** | 부분적 |
| **Local (llama.cpp)** | **완전 지원** (GBNF) | **가능** | **가능** (최적) |
| **Cursor/VSCode** | **불가** (플러그인 제약) | **가능** (LSP 연동) | 부분적 |

### 1.2 각 환경의 현실적 상세

#### OpenAI GPT-5/5.2: Lark CFG 네이티브 지원 (유일한 클라우드 CFG)

```
API 엔드포인트: client.responses.create()
문법 형식: Lark (EBNF 변형) 또는 Regex
내부 엔진: LLGuidance (Rust, ~50μs/token CPU)
제한 사항:
  - Lookaround 미지원
  - Lazy quantifier 미지원
  - Terminal priorities 미지원
  - 대부분의 import 미지원 (%import common만 가능)
```

**핵심 문제: 레이턴시**
- CFG 제약 적용 시: **~9.5초** (단순 문법 기준)
- 제약 없이: **~1초**
- **8-10x 오버헤드** -- "5초 이내 레이턴시" 목표와 직접 충돌
- 복잡한 문법은 첫 컴파일에 **1-5분** 소요 가능 (24시간 캐시)

**추가 문제: 문법 복잡도**
- "간단한 문법이 가장 안정적" -- OpenAI 공식 가이던스
- 복잡한 문법에서 모델이 "out-of-distribution"으로 빠질 수 있음
- Vibe의 86개 PEG 규칙을 Lark로 변환하면 **상당히 복잡한 문법**에 해당
- 문법적으로 올바르지만 의미적으로 무의미한 코드를 생성할 위험

**현실 평가**: Vibe 전체 문법을 CFG로 제약하는 것은 **비실용적**. 부분적 제약(키워드 제한, 연산자 제한 등)은 가능하지만 효과가 제한적.

#### Anthropic Claude API: JSON Schema Structured Output

```
기능: output_format 파라미터로 JSON Schema 강제
모델: Claude Opus 4.6, Sonnet 4.5+, Haiku 4.5
내부: 문법 컴파일 + 토큰 수준 제약
오버헤드: 100-300ms (첫 컴파일), 이후 24시간 캐시
```

**임의 CFG 미지원**. JSON Schema만 가능하므로 Vibe 소스 코드를 직접 제약할 수 없다. 단, AST를 JSON으로 표현하면 Schema로 제약 가능 (후술).

**현실 평가**: Claude는 이미 Vibe 100%를 달성했으므로 Constrained Decoding이 **불필요**. Error-Feedback도 사실상 불필요.

#### Google Gemini API: responseSchema

```
기능: responseSchema로 JSON Schema 강제
제한: JSON Mode만, 임의 CFG 미지원
성능: Constrained decoding 적용 시 오히려 성능 하락 보고됨
```

**현실 평가**: Gemini의 실패 원인이 **코드 절단(30%)과 마크다운 오염(20%)**이므로 문법 제약으로는 해결 불가. 모델 자체의 생성 품질 문제.

#### llama.cpp: GBNF 완전 지원

```
문법 형식: GBNF (BNF 확장, 정규식 지원)
성능: 네이티브, 추가 오버헤드 최소
활용 사례: 커스텀 8비트 CPU 어셈블리 문법 등 실증됨
```

**현실 평가**: 로컬 모델에서는 **가장 강력한 옵션**. 단, Vibe의 주 타겟이 클라우드 API이므로 2차 우선순위.

---

## 2. "Practical First" 질문: 무엇을 먼저 만들어야 하는가?

### 권장: (A) Error-Feedback Loop 우선 + OpenAI CFG 실험적 통합

#### 이유 1: Error-Feedback Loop는 모든 환경에서 즉시 작동한다

```
지원 환경: OpenAI, Anthropic, Google, 로컬, Cursor/VSCode -- 전부
구현 비용: 낮음 (Vibe 파이프라인이 이미 존재)
효과: 첫 번째 재시도에서 최대 24% 개선 (LLMLOOP 연구)
총 효과: pass@1 대비 pass@10에서 14% 추가 개선
```

#### 이유 2: Constrained Decoding의 ROI가 불확실하다

```
OpenAI CFG:
  - 레이턴시 8-10x 증가 (5초 목표 위반)
  - 복잡한 문법에서 불안정
  - GPT-5+ 전용 (GPT-4o 미지원)

Anthropic/Google:
  - 임의 CFG 미지원
  - JSON Schema만 가능

ROI 계산:
  - 구현 비용: 높음 (Vibe PEG → Lark 변환, 테스트, 튜닝)
  - 적용 범위: OpenAI GPT-5+만 (전체 사용자의 일부)
  - 정확도 개선: 구문 오류만 해결 (의미 오류는 미해결)
  - 벤치마크 기준: GPT-4o의 실패 원인이 "초기화 없는 선언"과 "while"이므로,
    += 구현 + while alias 추가만으로도 100% 도달 가능
```

#### 이유 3: Error-Feedback는 의미 오류도 잡을 수 있다

Constrained Decoding은 **구문 오류만** 방지한다. 그런데 LLM 코드 생성 오류의 **93%+가 의미적 오류**이다. Error-Feedback Loop에서 Vibe 파이프라인의 에러 메시지를 LLM에게 반환하면, 의미적 문제도 부분적으로 수정할 수 있다.

### 실행 순서

```
Phase 1 (즉시, 1-2주): Error-Feedback Loop
  - 생성 → Vibe 파이프라인 검증 → 실패 시 에러 메시지 포함 재시도
  - 최대 3회 재시도
  - 예상 효과: GPT-4o 90% → 95-98%, Gemini 50% → 60-70%

Phase 2 (중기, 2-4주): 언어 개선
  - += 파서 구현
  - 미초기화 변수 zero value
  - while alias
  - 에러 메시지 LLM-friendly화
  - 예상 효과: GPT-4o 98-100%, Gemini 65-75%

Phase 3 (선택적, 4-8주): OpenAI CFG 실험
  - Vibe 핵심 문법의 Lark 서브셋 정의 (전체가 아닌 핵심만)
  - GPT-5에서 실험적 테스트
  - 레이턴시가 허용 범위 내인지 평가
  - ROI가 증명되면 프로덕션 통합

Phase 4 (장기): llama.cpp GBNF 통합
  - 로컬 모델 지원을 위한 GBNF 문법 정의
  - Vibe CLI에서 로컬 모델 옵션 제공
```

---

## 3. 우리가 고려하지 않은 대안적 접근법

### 3.1 AST-First Generation (JSON Schema로 AST 생성)

**개념**: LLM이 Vibe 소스 코드 텍스트가 아니라, Vibe AST를 JSON으로 생성. 그 후 AST → Vibe 소스로 pretty-print.

```json
{
  "type": "Program",
  "body": [
    {
      "type": "LetDecl",
      "name": "x",
      "typeAnnotation": "Float",
      "init": {"type": "FloatLiteral", "value": 400.0}
    },
    {
      "type": "FnDecl",
      "name": "update",
      "params": [{"name": "dt", "type": "Float"}],
      "body": [
        {
          "type": "IfStmt",
          "condition": {
            "type": "CallExpr",
            "callee": "key_down",
            "args": [{"type": "StringLiteral", "value": "right"}]
          },
          "body": [...]
        }
      ]
    }
  ]
}
```

**장점**:
- JSON Schema로 **모든 클라우드 API에서 Constrained Decoding 가능** (OpenAI, Anthropic, Google)
- 구문 오류가 **원천적으로 불가능** (들여쓰기, 연산자 등 모든 표면 구문 이슈 제거)
- 타입 시스템 제약도 Schema로 표현 가능

**단점 -- 현실 검증**:
- **토큰 비용 폭발**: 같은 로직을 JSON AST로 표현하면 소스 코드 대비 **3-5x 토큰 증가**
  - `let x: Float = 400.0` (6 토큰) → JSON AST (~25 토큰)
  - 이것은 Vibe의 토큰 효율성 장점(15-20% 절감)을 **완전히 상쇄하고도 남음**
- **LLM 정확도 하락**: LLM은 코드 텍스트에 최적화되어 있지 AST JSON에 최적화되어 있지 않음
  - GrammarCoder 연구가 AST 기반이 더 좋다고 했으나, 그것은 **학습 시** AST를 사용한 경우
  - 추론 시 JSON AST를 생성하라고 하면 오히려 **정확도가 떨어질 가능성**이 높음
- **의미적 오류 미해결**: AST 구조가 올바르더라도 로직이 틀릴 수 있음
- **레이턴시 증가**: 토큰이 3-5x 많아지면 생성 시간도 비례하여 증가
- **디버깅 어려움**: 중간 결과가 JSON이므로 개발자가 확인하기 어려움

**판정: 비추천**. 이론적으로 매력적이지만 실용성이 매우 낮다. 토큰 비용만으로도 탈락.

### 3.2 Anthropic Tool Use로 Vibe 코드 생성

**개념**: Vibe 코드 생성을 Claude의 "Tool"로 정의하고, Tool 입력에 JSON Schema 제약을 적용.

```python
tools = [{
    "name": "generate_vibe_code",
    "description": "Generate complete Vibe game code",
    "input_schema": {
        "type": "object",
        "properties": {
            "variables": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "type": {"enum": ["Int", "Float", "String", "Bool"]},
                        "value": {"type": "string"}
                    }
                }
            },
            "functions": {...}
        }
    }
}]
```

**판정: 비추천**. 이것은 AST-First의 변형에 불과하며 같은 문제(토큰 폭발, 정확도 하락)를 공유한다. 또한 Claude는 이미 100%를 달성했으므로 추가적 제약이 불필요하다.

### 3.3 Google Function Calling

Anthropic Tool Use와 동일한 접근. **같은 이유로 비추천**.

### 3.4 Incremental Generation (점진적 생성)

**개념**: 코드를 함수 단위로 나누어 생성. 각 함수 생성 후 검증, 실패 시 재시도.

```
Step 1: "전역 변수 선언을 생성하세요" → 검증 → OK
Step 2: "update(dt) 함수를 생성하세요" → 검증 → OK
Step 3: "draw() 함수를 생성하세요" → 검증 → OK
Step 4: 전체 합치기 → 최종 검증
```

**장점**:
- 각 단위가 짧아서 절단 오류(Gemini의 주요 실패 원인) 방지
- 에러 피드백이 더 정밀 (어떤 함수에서 실패했는지 명확)
- API 호출 실패 시 해당 단위만 재시도

**단점**:
- **API 호출 횟수 증가**: 3-5회 호출 = 비용 3-5x, 레이턴시 누적
- **함수 간 참조 문제**: 나중에 선언된 변수를 앞 함수에서 참조하면?
- **컨텍스트 손실**: 각 호출에서 전체 게임의 맥락을 유지해야 함
- **구현 복잡도**: "코드를 어떻게 나눌 것인가"에 대한 휴리스틱 필요

**판정: 조건부 추천**. 복잡한 게임(500+ 토큰)에서 **Gemini 전용 폴백**으로 사용할 만함. 단, 기본 전략으로는 부적합.

### 3.5 프롬프트 최적화 단독 (Prompt Optimization Alone)

**개념**: 방어 인프라 없이 프롬프트만 개선.

**현재 상태**: 170줄 프롬프트로 Claude 100%, GPT-4o 90%, Gemini 50%.

**추가 최적화 여지**:
- "없는 것" 섹션 추가 (~40 토큰)
- "흔한 실수와 올바른 코드" 섹션 추가 (~60 토큰)
- 복잡한 태스크 예제 1-2개 추가 (~80 토큰)

**예상 효과**: GPT-4o 90% → 95-98% (llm-syntax-error-patterns.md 분석 기반)

**판정: 기본 라인으로 강력 추천**. 구현 비용이 가장 낮고 효과가 즉시 나타남. 단, Gemini의 절단/마크다운 문제는 프롬프트로 해결 불가.

---

## 4. 비용-편익 분석 (Cost-Benefit Matrix)

| 접근법 | 구현 비용 | 정확도 개선 | 클라우드 API 호환 | 유지보수 비용 |
|--------|----------|-----------|------------------|-------------|
| **Error-Feedback Loop** | **낮음** (1-2주) | **중** (첫 재시도 +24%, 총 +14%p) | **모든 API** | **낮음** (파이프라인 재사용) |
| **Constrained Decoding (OpenAI CFG)** | **높음** (4-8주) | **높음** (구문 오류 96% 제거) | **GPT-5+만** | **높음** (문법 동기화) |
| **Constrained Decoding (llama.cpp GBNF)** | **중간** (2-4주) | **높음** (구문 오류 96% 제거) | **로컬만** | **중간** |
| **AST-First Generation** | **매우 높음** (6-12주) | **중-높** (구문 오류 100% 제거) | **모든 API** (JSON Schema) | **매우 높음** (AST↔코드 동기화) |
| **Structured Output (Tool Use)** | **중간** (2-4주) | **낮-중** | **Anthropic만 (strict mode)** | **중간** |
| **프롬프트 최적화 단독** | **매우 낮음** (1-3일) | **낮-중** (+5-8%p) | **모든 API** | **매우 낮음** |
| **Incremental Generation** | **중간** (2-4주) | **중** (절단 방지) | **모든 API** | **중간** |

### 비용 효율 순위 (ROI)

```
1위: 프롬프트 최적화 (비용 1일 / 효과 +5-8%p)     -- ROI 최고
2위: Error-Feedback Loop (비용 1-2주 / 효과 +14%p)  -- ROI 높음
3위: 언어 개선 (+=, while, zero value)              -- ROI 높음 (GPT-4o → 100%)
4위: Incremental Generation (Gemini 전용)            -- ROI 중간
5위: Constrained Decoding (OpenAI CFG)               -- ROI 낮음 (범위 제한적)
6위: Constrained Decoding (llama.cpp)                -- ROI 낮음 (로컬만)
7위: AST-First Generation                           -- ROI 매우 낮음 (토큰 폭발)
```

---

## 5. 근본 문제 해결 여부 분석

### 문제 1: "모델의 성능에 크게 좌우된다" (Model-Dependent)

| 접근법 | 해결하는가? | 분석 |
|--------|-----------|------|
| **Error-Feedback Loop** | **부분적** | 약한 모델도 에러 피드백으로 수정 가능. 하지만 Gemini처럼 코드 자체를 잘라버리는 모델은 재시도해도 같은 실패를 반복할 가능성 높음 |
| **Constrained Decoding** | **구문에 한해서 Yes** | 구문 오류는 모델 능력과 무관하게 방지. 하지만 의미 오류는 여전히 모델 의존적. Gemini의 절단 문제도 해결 불가 (절단된 코드는 문법적으로도 불완전) |
| **AST-First** | **부분적** | 구문 문제는 해결되지만 AST 구조의 정확성은 여전히 모델 의존적 |
| **프롬프트 최적화** | **No** | 좋은 프롬프트는 좋은 모델에서 더 잘 작동. 격차를 줄이지 확대를 막지 못함 |
| **Incremental Generation** | **부분적** | 짧은 코드 단위로 나누면 약한 모델도 각 단위를 완성할 가능성이 높아짐. Gemini 절단 문제의 유일한 해결책일 수 있음 |

**냉정한 결론**: 어떤 접근법도 모델 의존성을 근본적으로 해결하지 못한다. **가장 현실적인 대응은 "최소 지원 모델 스펙"을 정의하는 것**이다. Gemini 2.0 Flash 수준의 모델은 Vibe 타겟에서 제외하고, GPT-4o급 이상을 최소 요구사항으로 설정하는 것이 합리적이다.

### 문제 2: "기반 지식의 영향에서 벗어날 수 없다" (Training Data Gravity)

| 접근법 | 해결하는가? | 분석 |
|--------|-----------|------|
| **Error-Feedback Loop** | **부분적** | LLM이 `while`을 사용 → 에러 메시지로 `for condition` 사용을 안내 → 재시도 시 수정 가능. 하지만 학습 데이터 압력이 강하면 3회 재시도에서도 같은 실수 반복 가능 |
| **Constrained Decoding** | **구문에 한해서 Yes** | `while` 토큰 자체를 생성할 수 없게 차단. 학습 데이터 압력을 물리적으로 차단. **이것이 Constrained Decoding의 진정한 가치** |
| **AST-First** | **Yes** (구문 수준) | 소스 코드 텍스트를 생성하지 않으므로 키워드 수준의 학습 데이터 영향을 우회 |
| **프롬프트 최적화** | **부분적** | 벤치마크 데이터가 보여주듯, 복잡한 태스크에서 학습 데이터가 프롬프트를 override |
| **언어 개선 (+=, while 허용)** | **근본적 해결** | 학습 데이터와 싸우지 않고 순응. **"싸울 수 없으면 합류하라"** |

**냉정한 결론**: "학습 데이터 중력"에 대한 **가장 비용 효율적인 해결책은 언어 자체를 수정하는 것**이다. `+=` 구현, `while` alias 허용, 미초기화 변수 zero value 자동 부여 -- 이 세 가지 수정만으로 학습 데이터 충돌로 인한 실패의 **100%**를 제거할 수 있다. Constrained Decoding은 이론적으로 우아하지만, 언어 수정 대비 ROI가 현저히 낮다.

---

## 6. 권장 아키텍처: Vibe 코드 생성 파이프라인

### 6.1 전체 파이프라인 설계

```
┌─────────────────────────────────────────────────────────┐
│                 Vibe Code Generation Pipeline             │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [1] 프롬프트 구성                                         │
│      ├── 시스템 프롬프트 (최적화된 ~270줄)                    │
│      ├── 태스크 프롬프트 (사용자 요구사항)                     │
│      └── 복잡도 판단 (토큰 수 추정)                          │
│                                                           │
│  [2] 생성 전략 선택 (모델 + 복잡도 기반)                      │
│      ├── 단순 (<100 토큰): 단일 생성                        │
│      ├── 중간 (100-300 토큰): 단일 생성 + 검증               │
│      └── 복잡 (300+ 토큰): 점진적 생성 (선택적)               │
│                                                           │
│  [3] LLM 코드 생성                                         │
│      ├── 마크다운 펜스 제거 (stripCodeFences 강화)            │
│      └── 기본 정규화 (후행 공백 제거 등)                      │
│                                                           │
│  [4] Vibe 파이프라인 검증                                    │
│      ├── Lexer → Parser → CodeGen                         │
│      └── LLM-friendly 에러 메시지 생성                      │
│                                                           │
│  [5] Error-Feedback Loop (최대 3회)                         │
│      ├── 검증 실패 시: 에러 메시지 + 수정 가이드 포함 재프롬프트│
│      ├── 재시도 1: 정확한 에러 위치 + 수정 방향 제시           │
│      ├── 재시도 2: 추가 예제 코드 포함                       │
│      └── 재시도 3: 단순화된 요구사항으로 폴백                  │
│                                                           │
│  [6] 결과 반환 또는 실패 보고                                │
│                                                           │
├─────────────────────────────────────────────────────────┤
│  [선택적 확장]                                              │
│  ├── OpenAI GPT-5+: Lark CFG 제약 (핵심 구문만)             │
│  ├── 로컬 모델: GBNF 제약 (전체 문법)                        │
│  └── Gemini 전용: Incremental Generation 폴백               │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Error-Feedback Loop 상세 설계

```typescript
// 핵심 구현 구조 (의사 코드)

interface GenerationResult {
  code: string;
  valid: boolean;
  errors: string[];
  attempts: number;
  totalLatencyMs: number;
}

async function generateVibeCode(
  task: string,
  provider: LLMProvider,
  config: GenerationConfig
): Promise<GenerationResult> {
  const MAX_RETRIES = 3;
  let attempts = 0;
  let lastErrors: string[] = [];
  let lastCode = "";
  const startTime = Date.now();

  while (attempts < MAX_RETRIES) {
    attempts++;

    // 프롬프트 구성 (재시도 시 에러 피드백 포함)
    const prompt = attempts === 1
      ? buildInitialPrompt(task)
      : buildRetryPrompt(task, lastCode, lastErrors, attempts);

    // LLM 호출
    const { code } = await callLLM(provider, systemPrompt, prompt, config);

    // 마크다운 펜스 제거 + 정규화
    const cleanCode = normalizeCode(stripCodeFences(code));

    // Vibe 파이프라인 검증
    const validation = validateVibe(cleanCode);

    if (validation.valid) {
      return {
        code: cleanCode,
        valid: true,
        errors: [],
        attempts,
        totalLatencyMs: Date.now() - startTime
      };
    }

    lastCode = cleanCode;
    lastErrors = validation.errors.map(e => toLLMFriendlyError(e));
  }

  // 최대 재시도 후에도 실패
  return {
    code: lastCode,
    valid: false,
    errors: lastErrors,
    attempts: MAX_RETRIES,
    totalLatencyMs: Date.now() - startTime
  };
}

function buildRetryPrompt(
  task: string,
  failedCode: string,
  errors: string[],
  attempt: number
): string {
  let prompt = `Your previous code had errors. Please fix them.\n\n`;
  prompt += `## Previous Code (with errors)\n\`\`\`\n${failedCode}\n\`\`\`\n\n`;
  prompt += `## Errors Found\n`;
  for (const error of errors) {
    prompt += `- ${error}\n`;
  }
  prompt += `\n## Instructions\n`;
  prompt += `Fix the errors above and output the complete corrected Vibe code.\n`;

  if (attempt >= 3) {
    prompt += `\nIMPORTANT: If the code is too complex, simplify the implementation.\n`;
  }

  return prompt;
}

function toLLMFriendlyError(error: string): string {
  // "expected EQ, got NEWLINE" →
  // "Variable declaration requires initialization.
  //  Use 'let x: Float = 0.0' instead of 'let x: Float'"
  const patterns: Record<string, string> = {
    'expected EQ, got NEWLINE':
      "Variable must be initialized. Use 'let x: Float = 0.0' not 'let x: Float'",
    'unexpected token.*while':
      "Vibe has no 'while' keyword. Use 'for condition' instead: 'for x > 0'",
    'unexpected character.*`':
      "Do not include markdown backticks. Output only raw Vibe code.",
    'unterminated string':
      "String literal is missing closing quote. Ensure all strings are properly closed.",
    'expected RBRACKET, got EOF':
      "Code appears truncated. Ensure all lists [] are properly closed.",
  };
  // ... 패턴 매칭 로직
  return transformedError;
}
```

### 6.3 레이턴시 예산 분석

**목표: 5초 이내 (단순 게임)**

```
시나리오 A: 단순 게임, GPT-4o, 성공 (1회 시도)
  프롬프트 전송:  ~200ms
  LLM 생성:      ~2,000ms (GPT-4o 평균 2,664ms)
  코드 검증:      ~50ms (Vibe 파이프라인)
  총합:          ~2,250ms ✓

시나리오 B: 단순 게임, GPT-4o, 실패 후 재시도 (2회)
  1차 시도:      ~2,250ms
  2차 시도:      ~2,500ms (에러 피드백 포함으로 약간 증가)
  총합:          ~4,750ms ✓ (5초 이내)

시나리오 C: 복잡 게임, GPT-4o, 성공 (1회)
  프롬프트 전송:  ~200ms
  LLM 생성:      ~5,000ms (복잡 태스크 평균)
  코드 검증:      ~100ms
  총합:          ~5,300ms ✗ (약간 초과)

시나리오 D: OpenAI CFG 적용 (GPT-5)
  프롬프트 전송:  ~200ms
  LLM 생성:      ~9,500ms (8-10x 오버헤드)
  코드 검증:      불필요 (문법적으로 보장)
  총합:          ~9,700ms ✗✗ (심각한 초과)
```

**결론**: Error-Feedback Loop는 레이턴시 예산 내에서 동작하지만, OpenAI CFG는 현재 레이턴시로는 **5초 목표를 충족할 수 없다**. CFG는 레이턴시가 개선될 때까지 "정확도가 절대적으로 필요한 경우"에만 선택적으로 사용해야 한다.

### 6.4 비용 예산 분석

**Error-Feedback Loop의 추가 비용**:

```
기본 (1회 시도):
  GPT-4o: ~200 입력 토큰 + ~161 출력 토큰 = ~361 토큰
  비용: ~$0.004

재시도 (2회 시도):
  1차: ~361 토큰
  2차: ~200 입력 + ~161 이전 코드 + ~50 에러 메시지 + ~161 출력 = ~572 토큰
  총: ~933 토큰
  비용: ~$0.009

재시도 (3회 시도):
  총: ~1,505 토큰
  비용: ~$0.014

비용 증가율: 최대 3.5x (3회 시도 시)
```

현재 벤치마크에서 GPT-4o 실패율 10% (2/20)이므로, 평균적으로:
- 18/20은 1회 시도 = $0.004 × 18 = $0.072
- 2/20은 2회 시도 = $0.009 × 2 = $0.018
- **총합: $0.090 (20 태스크) vs 기존 $0.080**
- **비용 증가: ~12.5%** -- 매우 합리적

---

## 7. 불편한 진실: 이 분석이 간과해서는 안 되는 것들

### 7.1 Constrained Decoding의 숨겨진 위험

**"문법적으로 올바르지만 의미적으로 무의미한 코드"** 문제:

Constrained Decoding은 모든 토큰이 문법적으로 유효하도록 강제한다. 하지만 이 과정에서 모델이 원래 생성하려던 의미적으로 올바른 코드가 **왜곡될 수 있다**.

예시:
```
-- LLM이 생성하려던 코드 (구문 오류 있으나 의도는 올바름):
while i < len(enemies)    -- 'while'은 Vibe에 없음
    enemies[i].update(dt)
    i = i + 1

-- Constrained Decoding이 강제한 코드 (구문은 올바르지만 의미가 다름):
for i < len(enemies)      -- 'while' 토큰 차단됨, 'for'로 대체
    enemies[i].update(dt)
    i = i + 1
```

이 경우에는 결과적으로 올바르다. 하지만 더 복잡한 상황에서는:

```
-- LLM이 생성하려던 코드:
let spawn_x: Float        -- 초기화 없음 (구문 오류)

-- Constrained Decoding이 강제한 코드:
let spawn_x: Float =      -- 문법이 '=' 다음에 표현식을 요구하므로...
let spawn_x: Float = 0    -- 모델이 아무 숫자나 생성할 수 있음
```

이 경우 `0`이 의미적으로 올바른 기본값인지 보장할 수 없다. Constrained Decoding은 모델의 다음 토큰 확률 분포에서 **유효한 토큰만 남기고 나머지를 0으로 만든다**. 이 과정에서 원래 분포가 심하게 왜곡되면 의미적 품질이 하락할 수 있다.

연구도 이를 확인한다: "Gemini 모델에서 JSON-Schema 제약만 적용하면 비제약 출력 대비 **성능이 오히려 하락**한다."

### 7.2 Error-Feedback Loop의 숨겨진 위험

**"같은 실수를 반복하는" 패턴**:

연구에 따르면 피드백 루프의 효과는 **지수적으로 감소**한다:
- 1차 재시도: 최대 24% 개선
- 2차 재시도: 추가 ~5% 개선
- 3차 재시도: 추가 ~1% 개선
- 이후: **거의 무의미** (plateau)

특히 학습 데이터 압력이 강한 패턴(`while`, `+=`)에서는 에러 메시지를 받아도 **같은 실수를 반복할 확률이 높다**. LLM이 "while은 사용할 수 없습니다"라는 피드백을 받아도, 다음 생성에서 다시 `while`을 사용할 수 있다 -- 이것이 "학습 데이터 중력"의 본질이다.

### 7.3 가장 효과적인 방어는 "공격 표면을 줄이는 것"

모든 방어 전략을 분석한 결과, **가장 비용 효율적인 접근은 방어 인프라가 아니라 언어 자체를 수정하는 것**이다:

```
비용-효과 비교:

[언어 수정] += 구현 + while alias + zero value
  구현 비용: ~3일
  효과: GPT-4o 실패 100% 제거 (4/4건)
  적용 범위: 모든 LLM, 모든 환경
  유지보수: 거의 없음

[Error-Feedback Loop]
  구현 비용: ~2주
  효과: 재시도 시 실패 50-80% 복구
  적용 범위: 모든 LLM, 모든 환경
  유지보수: 에러 메시지 업데이트

[Constrained Decoding (OpenAI CFG)]
  구현 비용: ~4-8주
  효과: 구문 오류 96% 방지
  적용 범위: GPT-5+만
  유지보수: 문법 변경 시 Lark 동기화

결론: 언어 수정의 ROI가 압도적으로 높다.
```

---

## 8. 최종 권장 사항

### 즉시 실행 (이번 주)

1. **프롬프트 최적화**: "없는 것" 섹션 + "흔한 실수" 섹션 추가 (100 토큰)
2. **프롬프트 오류 수정**: `Assignment: = += -= *= /=`에서 미구현 연산자 제거
3. **stripCodeFences 강화**: 닫는 백틱 없는 케이스 처리

### 단기 (1-3주)

4. **언어 수정**: `+=` `-=` `*=` `/=` 파서 구현
5. **언어 수정**: `let x: Type` 미초기화 변수에 zero value 자동 부여
6. **언어 수정**: `while` 키워드를 `for` 조건 루프의 별칭으로 허용
7. **에러 메시지**: LLM-friendly 에러 메시지 (수정 방향 포함)

### 중기 (2-6주)

8. **Error-Feedback Loop**: 생성 → 검증 → 재시도 (최대 3회) 파이프라인 구현
9. **벤치마크 확장**: Error-Feedback 적용 전/후 비교 실험 (20 → 50 태스크)

### 장기 (선택적)

10. **OpenAI CFG 실험**: Vibe 핵심 구문의 Lark 서브셋 정의 + 레이턴시 측정
11. **llama.cpp GBNF**: 로컬 모델 지원을 위한 GBNF 문법 정의
12. **Incremental Generation**: Gemini 전용 폴백 전략

### 명시적으로 하지 않는 것

- AST-First Generation (토큰 비용 폭발)
- Tool Use 기반 코드 생성 (불필요한 복잡도)
- 전체 Vibe 문법의 CFG 제약 (레이턴시 초과, 복잡도 과다)

---

## 9. 예상 결과 로드맵

```
현재 상태 (2026-03-09):
  Claude Opus 4.6:   100% (20/20)
  GPT-4o:             90% (18/20) -- 실패: 초기화 없는 선언, while
  Gemini 2.0 Flash:   50% (10/20) -- 실패: 절단, 마크다운, 구문 오류

Phase 1 후 (프롬프트 최적화 + 언어 수정):
  Claude Opus 4.6:   100% (유지)
  GPT-4o:            ~100% (+=, while, zero value로 모든 실패 원인 제거)
  Gemini 2.0 Flash:  ~65% (구문 오류 4건 해결, 절단/마크다운은 미해결)

Phase 2 후 (Error-Feedback Loop):
  Claude Opus 4.6:   100% (유지)
  GPT-4o:            ~100% (유지)
  Gemini 2.0 Flash:  ~75% (재시도로 일부 절단/마크다운 케이스 복구)

이론적 한계:
  Gemini의 절단/마크다운 문제(6건)는 언어 설계나 재시도로
  완전히 해결할 수 없다. 이것은 모델 자체의 한계이다.
  Gemini의 최대 도달 가능 정확도: ~80-85%
```

---

*이 분석의 핵심 메시지: "LLM의 학습 데이터와 싸우지 마라. 학습 데이터에 순응하는 언어 설계가 어떤 방어 인프라보다 효과적이다. 방어 인프라는 언어 설계만으로 해결할 수 없는 잔여 문제(절단, 마크다운 오염, 의미 오류)에 집중하라."*

---

## Sources

- [OpenAI Structured Outputs](https://openai.com/index/introducing-structured-outputs-in-the-api/)
- [OpenAI Structured Model Outputs Guide](https://developers.openai.com/api/docs/guides/structured-outputs/)
- [GPT-5 CFG Support (Lark/Regex)](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_new_params_and_tools/)
- [GPT-5 CFG Guide by Mike Bommarito](https://michaelbommarito.com/wiki/models/gpt-5-context-free-grammar-guide/)
- [Using GPT-5.2 with CFG](https://platform.openai.com/docs/guides/latest-model)
- [Claude API Structured Outputs](https://docs.claude.com/en/docs/build-with-claude/structured-outputs)
- [Anthropic Structured Outputs (Tribe AI)](https://www.tribe.ai/applied-ai/a-gentle-introduction-to-structured-generation-with-anthropic-api)
- [Hands-On Anthropic Structured Outputs (TDS)](https://towardsdatascience.com/hands-on-with-anthropics-new-structured-output-capabilities/)
- [Google Gemini Structured Outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- [Improving Gemini Structured Outputs (Google Blog)](https://blog.google/technology/developers/gemini-api-structured-outputs/)
- [llama.cpp GBNF Grammar](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)
- [Teaching LLM Assembly with GBNF](https://www.jamesdrandall.com/posts/gbnf-constrained-generation/)
- [SynCode: LLM Generation with Grammar Augmentation](https://arxiv.org/abs/2403.01632)
- [LLMLOOP: Improving LLM Code Generation](https://valerio-terragni.github.io/assets/pdf/ravi-icsme-2025.pdf)
- [LlmFix: Fixing Code Generation Errors](https://arxiv.org/abs/2409.00676)
- [Feedback Loops in LLM Code Translation](https://arxiv.org/html/2512.02567)
- [Constrained Decoding Guide (Aidan Cooper)](https://www.aidancooper.co.uk/constrained-decoding/)
- [How Structured Outputs and Constrained Decoding Work](https://www.letsdatascience.com/blog/structured-outputs-making-llms-return-reliable-json)
- [LLM Structured Output in 2026](https://dev.to/pockit_tools/llm-structured-output-in-2026-stop-parsing-json-with-regex-and-do-it-right-34pk)
- [vLLM Structured Outputs](https://docs.vllm.ai/en/latest/features/structured_outputs/)
