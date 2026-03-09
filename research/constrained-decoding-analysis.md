# Constrained Decoding 실현 가능성 분석

> 2026-03-09 | Vibe 언어 LLM 코드 생성 정확도 향상 전략 연구

---

## 0. Executive Summary

**결론부터 말하면: Constrained Decoding은 Vibe의 주요 타겟(클라우드 API)에서는 실현 불가능하고, 로컬 모델에서도 들여쓰기 기반 문법 때문에 근본적 한계가 있다. Error-Feedback Loop에 집중하는 것이 압도적으로 올바른 전략이다.**

| 접근법 | 클라우드 API 적용 | 로컬 모델 적용 | 들여쓰기 처리 | 구현 난이도 | 기대 효과 |
|--------|-----------------|--------------|-------------|-----------|----------|
| Constrained Decoding | **불가능** | 제한적 가능 | **근본적 한계** | 극상 | 제한적 |
| Error-Feedback Loop | **즉시 가능** | 즉시 가능 | 문제 없음 | 중 | **높음** |
| 하이브리드 (Logit Bias) | 불가능 | 제한적 가능 | 부분 해결 | 상 | 중간 |
| 프롬프트 최적화 | **즉시 가능** | 즉시 가능 | 문제 없음 | 하 | **높음** |

---

## 1. 클라우드 LLM API의 Constrained Decoding 지원 현황

### 1.1 OpenAI (GPT-4o) — JSON Schema 전용, 커스텀 문법 불가

**현황 (2026년 3월 기준)**:
- **Structured Outputs** 지원: JSON Schema 기반 constrained decoding
- 내부적으로 JSON Schema → CFG(Context-Free Grammar)로 변환 후 토큰 마스킹
- 2025년 5월부터 llguidance (Microsoft) 엔진 통합
- **100% JSON Schema 준수** 보장

**Vibe에 적용 가능한가?**

**불가능.** OpenAI API는 JSON Schema만 지원한다. 커스텀 EBNF/BNF/PEG 문법을 직접 주입하는 API가 없다.

우회 방안 검토:

| 우회 방안 | 실현 가능성 | 문제점 |
|-----------|-----------|--------|
| JSON Schema로 AST 구조를 정의하고, AST를 Vibe 코드로 변환 | 이론적 가능 | AST가 거대해지고, LLM이 AST를 정확하게 생성하는 것은 코드를 직접 생성하는 것보다 어려움 |
| Logit Bias API로 잘못된 토큰 억제 | 제한적 가능 | 토큰 ID 매핑이 복잡, 문맥 의존적 규칙 처리 불가, 최대 300개 토큰만 bias 가능 |
| Function Calling으로 코드를 구조화된 인자로 받기 | 이론적 가능 | Vibe 코드의 자유도가 높아 스키마 정의가 비현실적 |

**결론: OpenAI API에서 Vibe 문법을 강제하는 constrained decoding은 불가능하다.**

### 1.2 Anthropic (Claude) — JSON Schema 전용, 커스텀 문법 불가

**현황 (2026년 3월 기준)**:
- 2025년 11월 14일 **Structured Outputs** 공개 베타 출시
- Claude Opus 4.6, Sonnet 4.6, Sonnet 4.5, Opus 4.5, Haiku 4.5 지원
- JSON Schema를 문법으로 컴파일 → 토큰별 제약 적용
- 첫 요청 시 100-300ms 오버헤드 (스키마 컴파일), 이후 24시간 캐시

**Vibe에 적용 가능한가?**

**불가능.** OpenAI와 동일하게 JSON Schema 전용이다. 임의의 CFG/PEG 문법을 주입하는 API는 없다.

**아이러니**: Claude는 이미 Vibe 벤치마크에서 **100% 정확도**를 달성하고 있다. Constrained decoding이 필요 없는 유일한 모델이다.

### 1.3 Google (Gemini) — JSON Schema 전용, 커스텀 문법 불가

**현황 (2026년 3월 기준)**:
- Structured Outputs 지원: JSON Schema 기반
- 2026년 1월 Structured Outputs 성능 개선 발표
- 그러나 연구 결과, constrained decoding 적용 시 오히려 비구조화 출력보다 성능이 떨어진다는 보고 있음

**Vibe에 적용 가능한가?**

**불가능.** 동일하게 JSON Schema 전용.

**추가 문제**: Gemini 2.0 Flash의 주된 실패 원인은 **출력 절단(30%)과 마크다운 오염(20%)**이다 (llm-syntax-error-patterns.md 참조). 이것은 constrained decoding으로 해결할 수 있는 문제가 아니다. 모델이 코드 생성 도중 EOS를 출력하는 것은 "문법 위반"이 아니라 "생성 자체의 포기"이다.

### 1.4 클라우드 API 요약

```
┌─────────────────────────────────────────────────────────┐
│              클라우드 API Constrained Decoding            │
│                                                         │
│   OpenAI:    JSON Schema ✅  |  Custom Grammar ❌       │
│   Anthropic: JSON Schema ✅  |  Custom Grammar ❌       │
│   Google:    JSON Schema ✅  |  Custom Grammar ❌       │
│                                                         │
│   결론: 3개 API 모두 JSON Schema만 지원.                  │
│         Vibe PEG 문법을 직접 주입하는 것은 불가능.          │
└─────────────────────────────────────────────────────────┘
```

**핵심 사실**: 클라우드 API의 structured output은 **JSON/데이터 구조 생성**을 위해 설계되었지, **프로그래밍 언어 코드 생성**을 위해 설계되지 않았다.

---

## 2. 로컬 모델에서의 Constrained Decoding

### 2.1 llama.cpp GBNF

**현황**:
- GBNF (GGML BNF) 형식으로 CFG 문법을 정의
- 토큰 생성 시 문법에 맞지 않는 토큰의 확률을 0으로 마스킹
- 2025년부터 XGrammar, llguidance 등 고성능 엔진이 통합되어 오버헤드가 거의 0에 수렴
- XGrammar: 토큰당 40 마이크로초 미만
- llguidance: 토큰당 50 마이크로초, 128K 보캡 기준

**Vibe PEG → GBNF 변환이 가능한가?**

**부분적으로만 가능하다.** 핵심 문제는 INDENT/DEDENT이다.

Vibe의 PEG 문법에서 GBNF로 변환 가능한 부분:

```gbnf
# 변환 가능 -- 토큰 수준 규칙
root         ::= program
let-decl     ::= "let" ws ident ws ":" ws type ws "=" ws expr
fn-decl      ::= "fn" ws ident ws "(" params? ")" ws ("->" ws type)? nl block
if-stmt      ::= "if" ws expr nl block else-clause?
# ... 기타 CFG 규칙들
```

**변환 불가능한 부분 -- INDENT/DEDENT**:

```
# 이것은 GBNF로 표현할 수 없다
Block <- INDENT Stmt (NEWLINE Stmt)* DEDENT
```

GBNF는 **context-free grammar**이다. 그러나 들여쓰기 수준 추적은 **context-sensitive**한 작업이다. 특정 위치에서의 올바른 들여쓰기 수준은 "이전에 몇 번 INDENT가 발생했는가"에 의존하며, 이것은 스택(카운터)을 필요로 한다. CFG는 무한한 수의 중첩 수준을 올바르게 추적할 수 없다.

### 2.2 INDENT/DEDENT 문제의 심각성

이것이 이 리서치의 **가장 중요한 발견**이다.

**Python의 INDENT/DEDENT가 왜 context-sensitive인가:**

```python
# 들여쓰기 수준 0
def f():
    # 들여쓰기 수준 1
    if x:
        # 들여쓰기 수준 2
        if y:
            # 들여쓰기 수준 3
            pass
        # 여기서 DEDENT가 1번 필요 (수준 3 → 2)
    # 여기서 DEDENT가 1번 필요 (수준 2 → 1)
# 여기서 DEDENT가 1번 필요 (수준 1 → 0)
```

DEDENT의 수는 "현재 들여쓰기 수준"에 의존한다. 현재 들여쓰기 수준은 이전의 모든 INDENT/DEDENT 히스토리에 의존한다. 이것은 **pushdown automaton**이 필요한 context-free한 부분이 있지만, 정확한 들여쓰기 공백 수의 일치는 context-sensitive이다.

**기존 접근법들과 그 한계:**

| 접근법 | 설명 | 한계 |
|--------|------|------|
| 고정 깊이 제한 | 최대 4-5 수준까지만 GBNF에 하드코딩 | 깊은 중첩에서 실패. 문법이 지수적으로 커짐 |
| 렉서 시뮬레이션 | 문법 외부에서 들여쓰기 스택 관리 | GBNF/XGrammar 표준 인터페이스에서 지원 안 함 |
| 정규 언어 근사 | INDENT/DEDENT를 정규식으로 근사 | 정확성 보장 불가 |
| 후처리 검증 | 문법 없이 생성 후 파서로 검증 | 이것은 constrained decoding이 아니라 Error-Feedback Loop |

**2024-2025 연구 동향**:

최근 논문 "Constrained Decoding for Fill-in-the-Middle Code Language Models via Efficient Left and Right Quotienting of Context-Sensitive Grammars" (arXiv:2402.17988)에서 Python의 INDENT/DEDENT를 처리하는 방법을 제안했다. 이 논문은:

- 렉서의 가능한 출력을 정규 언어로 기술: `NL (INDENT | DEDENT*)`
- 이전 들여쓰기 수준이 알려지지 않은 경우 `(INDENT | DEDENT*)`로 표현
- 들여쓰기 감소 시 `DEDENT{1,n-m}` 형태로 정의

그러나 이 접근법은:
1. **연구 수준**이며 프로덕션에 사용된 사례가 없음
2. Python 전용으로 설계됨 (Vibe 적응 필요)
3. 정확한 들여쓰기 수준 추적이 아닌 **근사(approximation)**

### 2.3 Outlines 라이브러리

**현황**:
- Python 기반 constrained decoding 라이브러리
- Lark 문법 형식(EBNF 변종) 지원
- JSON Schema → 인덱스 구조 → O(1) 유효 토큰 조회
- HuggingFace Transformers, vLLM 등과 통합

**Vibe에 적용 가능한가?**

Outlines는 **context-free grammar**을 지원한다. Vibe의 PEG 문법 중 CFG 부분은 Lark EBNF로 변환 가능하지만, **INDENT/DEDENT 문제는 동일하게 존재**한다.

추가 문제:
- Outlines는 Python 라이브러리 → Vibe 트랜스파일러는 TypeScript
- 로컬 모델 필요 (HuggingFace 모델 로딩)
- Vibe의 주요 타겟이 클라우드 API인 상황에서 로컬 모델 종속은 전략적 미스매치

### 2.4 Microsoft Guidance / llguidance

**현황**:
- llguidance: Rust 기반 고성능 constrained decoding 엔진
- 토큰당 ~50 마이크로초, 128K 보캡 기준
- Lark 형식 문법 변종 지원, 내장 JSON Schema + 정규식
- OpenAI, vLLM, SGLang에 통합됨
- **CFG 제약**은 동일하게 적용

**Vibe에 적용 가능한가?**

llguidance는 기술적으로 가장 앞선 엔진이지만, **API 수준에서 커스텀 문법을 주입하는 인터페이스를 제공하지 않는다** (OpenAI에 통합된 형태에서는). vLLM/SGLang을 직접 호스팅하는 경우에만 커스텀 문법을 사용할 수 있다.

### 2.5 vLLM / SGLang

**현황**:
- vLLM: `guided_grammar` 파라미터로 EBNF 문법 지정 가능
- SGLang: `ebnf` 파라미터로 EBNF 문법 지정 가능
- 둘 다 XGrammar를 기본 백엔드로 사용 (2025년 기준)
- 토큰 마스크 생성이 LLM 추론과 병렬 처리되어 오버헤드 최소화

**이것이 유일하게 실현 가능한 경로이다.** 그러나:

1. **자체 GPU 인프라 필요**: vLLM/SGLang을 실행하려면 GPU 서버가 필요
2. **모델 품질**: 로컬 모델(Llama, Mistral 등)은 GPT-4o/Claude 대비 코드 생성 능력이 낮음
3. **INDENT/DEDENT 문제**: XGrammar도 CFG 기반이므로 동일한 한계
4. **유지보수 부담**: Vibe 문법이 변경될 때마다 EBNF 동기화 필요

### 2.6 로컬 모델 요약

```
┌─────────────────────────────────────────────────────────────┐
│              로컬 모델 Constrained Decoding                   │
│                                                             │
│   llama.cpp GBNF:    가능하지만 INDENT/DEDENT 처리 불가 ⚠️    │
│   Outlines:          가능하지만 Python 종속 + INDENT 문제 ⚠️   │
│   llguidance:        가장 빠르지만 API 직접 주입 불가 ⚠️       │
│   vLLM/SGLang:       EBNF 지원 ✅ + GPU 인프라 필요 ⚠️        │
│                                                             │
│   공통 한계: INDENT/DEDENT는 CFG로 정확히 표현 불가            │
│             → 고정 깊이 근사 또는 렉서 시뮬레이션 필요          │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. INDENT/DEDENT 문제 심층 분석

이 섹션에서는 Vibe에서 constrained decoding을 적용할 때 가장 큰 장벽인 들여쓰기 문제를 상세히 분석한다.

### 3.1 문제의 본질

Vibe의 블록 구조:
```
fn update(dt: Float)        -- 수준 0
    if key_down("right")    -- 수준 1 (INDENT)
        x = x + speed * dt  -- 수준 2 (INDENT)
    if key_down("left")     -- 수준 1 (DEDENT + 새 문장)
        x = x - speed * dt  -- 수준 2 (INDENT)
                             -- 수준 0 (DEDENT DEDENT)
```

LLM은 **토큰 단위**로 생성한다. "다음 토큰이 공백 4개인지, 공백 8개인지, 문자인지"를 문법 규칙으로 결정해야 하는데, 올바른 공백 수는 **현재 블록 깊이**에 의존한다.

### 3.2 LLM 토크나이저와의 충돌

GPT-4o/Claude의 토크나이저(BPE)는 공백을 다음과 같이 토큰화한다:

```
"    " (공백 4개) → 하나의 토큰
"        " (공백 8개) → 하나의 토큰 또는 두 개의 토큰
"if" → 하나의 토큰
"\n    if" → 여러 토큰
```

문제: 토큰 마스킹은 **토큰 ID 수준**에서 작동한다. "공백 4개" 토큰과 "공백 8개" 토큰을 구분해서 마스킹하려면, 현재 들여쓰기 수준을 추적하는 **상태(state)**가 필요하다. 그러나 CFG 기반 마스킹은 **상태를 문법 규칙으로만 표현**할 수 있고, 무한한 들여쓰기 수준을 CFG로 표현하는 것은 불가능하다.

### 3.3 고정 깊이 근사의 현실

실용적 해결책으로 "최대 깊이 N까지만 허용"하는 GBNF를 작성할 수 있다:

```gbnf
# 최대 깊이 4까지 하드코딩한 근사 GBNF (의사 코드)
block-0 ::= stmt-at-0 ("\n" stmt-at-0)*
block-1 ::= "    " stmt-at-1 ("\n    " stmt-at-1)*
block-2 ::= "        " stmt-at-2 ("\n        " stmt-at-2)*
block-3 ::= "            " stmt-at-3 ("\n            " stmt-at-3)*

stmt-at-0 ::= let-decl | fn-decl-0 | ...
fn-decl-0 ::= "fn" ws ident "(" params? ")" ("->" ws type)? "\n" block-1
if-at-1   ::= "    if" ws expr "\n" block-2 else-at-1?
if-at-2   ::= "        if" ws expr "\n" block-3 else-at-2?
# ... 각 깊이별로 모든 규칙을 복제해야 함
```

**문제점**:
1. **규칙 폭발**: Vibe PEG 문법은 ~86개 규칙. 깊이 4로 제한해도 86 x 4 = **344개 규칙**으로 폭발. 각 규칙 내에서 들여쓰기 문자열도 달라지므로 실제로는 더 많음.
2. **깊이 제한**: 게임 코드에서 `fn > if > for > if` 는 깊이 4로 흔하게 발생. 깊이 5-6도 가능.
3. **유지보수 불가**: 문법 변경 시 모든 깊이 수준의 규칙을 동기화해야 함.
4. **토큰 효율 저하**: 문법이 커지면 XGrammar의 context-dependent 토큰 비율이 증가하여 성능 하락.

### 3.4 현실적 판단

**들여쓰기 기반 언어에 대한 완전한 constrained decoding은 현재 기술로는 실현 불가능하다.**

이것은 Vibe만의 문제가 아니다. Python 코드 생성에도 동일한 문제가 존재하며, 현재까지 프로덕션 수준에서 Python의 들여쓰기를 완전히 처리하는 constrained decoding 시스템은 없다.

---

## 4. 대안적 접근법 분석

### 4.1 Error-Feedback Loop (현재 최선의 전략)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ LLM이     │────>│ Vibe     │────>│ 에러     │────>│ LLM에게  │
│ 코드 생성 │     │ 파서로    │     │ 발생 시  │     │ 에러와   │──┐
│           │     │ 파싱     │     │          │     │ 수정 요청│  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘  │
     ▲                                                            │
     └────────────────────────────────────────────────────────────┘
                          재생성 (최대 N회)
```

**장점**:
1. **클라우드 API에서 즉시 사용 가능**: GPT-4o, Claude, Gemini 모든 API에 적용
2. **INDENT/DEDENT 문제 없음**: Vibe의 기존 파서(Lexer → Parser)가 정확히 검증
3. **의미 오류도 검출 가능**: 구문 오류뿐 아니라 미정의 변수, 타입 오류도 피드백 가능
4. **구현 간단**: 이미 트랜스파일러 파이프라인(Lexer → Parser → CodeGen)이 존재
5. **LLM 친화적 에러 메시지**: 에러 메시지를 LLM이 이해할 수 있도록 설계 가능

**예상 효과** (벤치마크 데이터 기반):

GPT-4o의 2건 실패 분석:
- `twin_stick_dodge`: `while` 사용 + `+=` 사용 + 미초기화 선언
- `multi_wave_spawner`: `+=` 사용 + 미초기화 선언

이 오류들의 에러 메시지:
```
Error at line 64: unexpected keyword 'while'. Use 'for condition' instead.
Error at line 31: expected '=', got NEWLINE. Variable declarations require initialization: 'let x: Float = 0.0'
```

GPT-4o는 이런 구체적 에러 메시지를 받으면 **1회 재시도로 100% 수정 가능**할 것으로 예상된다 (GPT-4o의 instruction following 능력은 벤치마크에서 검증됨).

Gemini의 경우:
- 절단 오류(3건): 에러 메시지 피드백으로 해결 불가 (모델 자체 문제)
- 마크다운 오염(2건): 후처리 `stripCodeFences()`로 이미 방어 중, 개선 가능
- `+=` 등 문법 오류(5건): 에러 피드백으로 일부 해결 가능

**예상 개선율**:
| 모델 | 현재 | 1회 재시도 후 | 2회 재시도 후 |
|------|------|-------------|-------------|
| GPT-4o | 90% (18/20) | **100%** (20/20) | 100% |
| Claude | 100% (20/20) | 100% | 100% |
| Gemini | 50% (10/20) | **65%** (13/20) | **70%** (14/20) |

### 4.2 Token-by-Token Validation (토큰별 검증)

**개념**: LLM이 토큰을 하나씩 생성할 때마다 incremental parser로 검증하고, 잘못된 토큰이 생성되면 즉시 되돌리기.

**실현 가능성**: **클라우드 API에서 불가능.**

- 클라우드 API는 토큰별 개입(intervention)을 허용하지 않음
- Streaming API가 있지만, 이미 생성된 토큰을 되돌릴 수 없음
- 로컬 모델에서만 가능하며, 이 경우 constrained decoding과 동일

### 4.3 Logit Bias / Token Masking

**개념**: 특정 토큰의 logit을 낮추어 생성 확률을 감소시킴.

**OpenAI API 지원**: `logit_bias` 파라미터로 최대 300개 토큰에 대해 -100~+100 범위의 bias 설정 가능.

**Vibe에 적용 가능한 시나리오**:

```javascript
// "while" 키워드 토큰 억제
logit_bias: {
  [TOKEN_ID_while]: -100,  // "while" 토큰 생성 억제
  [TOKEN_ID_def]: -100,     // "def" 토큰 생성 억제
  // ... 기타 금지 키워드
}
```

**한계**:
1. **300개 토큰 제한**: 금지할 토큰이 많으면 부족
2. **문맥 무시**: `while`이 문자열 리터럴 안에 있어도 억제됨 (`"meanwhile"` 등)
3. **BPE 토큰화**: `while`이 여러 토큰으로 분할될 수 있어 정확한 억제가 어려움
4. **긍정적 제약 불가**: "이 위치에서는 `fn`만 가능하다"를 표현할 수 없음
5. **들여쓰기 제약 불가**: 공백 수를 logit bias로 제어하는 것은 비현실적

**결론**: Logit bias는 몇 가지 명확한 금지 토큰(`while`, `` ` ``, `def` 등)에 대해서만 유용. 전체적인 문법 강제에는 부적합.

### 4.4 하이브리드 접근: 부분 제약 + Error-Feedback

가장 현실적인 하이브리드:

```
┌───────────────────────────────────────────────┐
│ Layer 0: 프롬프트 최적화                        │
│   - 정확한 문법 설명 + 풍부한 예제             │
│   - 금지 패턴 명시 ("NO while, use for")      │
│                                               │
│ Layer 1: Logit Bias (클라우드 API 한정)         │
│   - while, def, class 등 금지 토큰 억제        │
│   - 마크다운 백틱(```) 억제                     │
│                                               │
│ Layer 2: 후처리                                │
│   - stripCodeFences() (마크다운 제거)           │
│   - 빈 줄 / 주석 정리                          │
│                                               │
│ Layer 3: Error-Feedback Loop                   │
│   - Vibe 파서로 검증                           │
│   - 에러 시 LLM-friendly 메시지와 함께 재시도   │
│   - 최대 3회 재시도                            │
└───────────────────────────────────────────────┘
```

이 4-레이어 방어는 각 레이어가 독립적으로 적용 가능하고, 레이어를 추가할수록 정확도가 높아진다.

---

## 5. Constrained Decoding vs Error-Feedback Loop 정량 비교

### 5.1 비용-효과 분석

| 항목 | Constrained Decoding (로컬) | Error-Feedback Loop (클라우드) |
|------|---------------------------|-------------------------------|
| **구현 기간** | 4-8주 (EBNF 변환 + 깊이 제한 + 테스트) | 1-2주 (에러 파서 + 재시도 로직) |
| **인프라 비용** | GPU 서버 필요 ($1000+/월) | API 비용만 (재시도 시 2-3x) |
| **모델 품질** | Llama 3 70B 수준 (GPT-4o 대비 열등) | GPT-4o / Claude 사용 가능 |
| **들여쓰기 처리** | 근사만 가능 (완전하지 않음) | 기존 파서로 완전 검증 |
| **유지보수** | 문법 변경 시 EBNF 동기화 필요 | 파서가 자동으로 처리 |
| **적용 범위** | 구문 오류만 방지 | 구문 + 의미 오류 피드백 가능 |
| **이론적 최대 정확도** | ~95% (깊이 제한 + CFG 한계) | ~100% (무한 재시도 가정) |
| **실용적 정확도** | ~90% | **~98%** (3회 재시도) |

### 5.2 Vibe 벤치마크 데이터 기반 분석

현재 오류 24건의 원인별 해결 가능성:

| 오류 원인 | 건수 | Constrained Decoding으로 해결? | Error-Feedback으로 해결? |
|-----------|------|-------------------------------|------------------------|
| `+=` 미지원 | 6 | **가능** (토큰 마스킹) | **가능** (에러 메시지 + 재시도) |
| 미초기화 선언 | 2 | **가능** (문법 규칙) | **가능** (에러 메시지 + 재시도) |
| `while` 사용 | 2 | **가능** (토큰 마스킹) | **가능** (에러 메시지 + 재시도) |
| 출력 절단 | 4 | **불가능** | **불가능** (모델 자체 문제) |
| 마크다운 오염 | 2 | **부분 가능** | **가능** (후처리 + 재시도) |
| 미종료 문자열 | 1 | **불가능** (절단의 변종) | **불가능** |
| 기타 토큰 오류 | 7 | - | **부분 가능** |

**핵심**: 두 접근법 모두 **절단 오류를 해결할 수 없다**. 절단은 모델이 생성을 포기하는 현상이므로, 문법 제약이나 에러 피드백으로는 해결 불가능하다.

Constrained decoding이 해결할 수 있는 오류 = Error-Feedback이 해결할 수 있는 오류. 차이가 없다.

---

## 6. 최종 권고: Error-Feedback Loop에 집중하라

### 6.1 결론

Constrained decoding은 Vibe에 대해 **비용 대비 효과가 매우 낮다**.

**Constrained Decoding이 부적합한 3가지 근본 이유:**

1. **타겟 불일치**: Vibe의 주요 사용 시나리오는 클라우드 API(GPT-4o, Claude, Gemini)이고, 3개 API 모두 커스텀 문법 주입을 지원하지 않는다.

2. **기술적 한계**: Vibe의 들여쓰기 기반 문법은 context-free grammar로 완전히 표현할 수 없다. 어떤 constrained decoding 엔진을 사용하더라도 근사만 가능하다.

3. **효과 중복**: Constrained decoding이 해결할 수 있는 오류 집합은 Error-Feedback Loop가 해결할 수 있는 오류 집합의 부분집합이다. Constrained decoding만이 해결할 수 있는 오류는 없다.

### 6.2 권장 전략: 4-Layer Defense

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Layer 0: 언어 설계 최적화 (이미 진행 중)                 │
│  ─────────────────────────────────────────               │
│  - += 구현 (llm-syntax-error-patterns.md R1)            │
│  - 미초기화 변수 zero value 부여 (R2)                    │
│  - while 별칭 허용 (R4)                                 │
│  효과: GPT-4o 90% → 100%, Gemini 50% → 65%             │
│                                                         │
│  Layer 1: 프롬프트 최적화                                │
│  ─────────────────────────────────────────               │
│  - 프롬프트에서 += 오류 수정 (R3)                        │
│  - 복잡한 예제 추가 (R6)                                 │
│  - 금지 패턴 명시: "NO while, NO :, NO def"              │
│  효과: 누적 Gemini 65% → 70%                            │
│                                                         │
│  Layer 2: 후처리                                         │
│  ─────────────────────────────────────────               │
│  - stripCodeFences() 강화                                │
│  - 앞뒤 빈 줄 / 불필요 텍스트 제거                        │
│  - while → for 자동 변환 (선택적)                        │
│  효과: 누적 Gemini 70% → 75%                            │
│                                                         │
│  Layer 3: Error-Feedback Loop                            │
│  ─────────────────────────────────────────               │
│  - Vibe 파서(Lexer → Parser)로 검증                     │
│  - LLM-friendly 에러 메시지 생성                         │
│  - 에러 + 원본 코드 + 수정 힌트와 함께 재시도              │
│  - 최대 3회 재시도                                       │
│  효과: 누적 GPT-4o 100%, Gemini 75% → 85%               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Error-Feedback Loop 구현 계획

**구현 범위**:

```typescript
// 의사 코드
async function generateVibeCode(prompt: string, model: string): Promise<string> {
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // 1. LLM에게 코드 생성 요청
    let code = await llm.generate(prompt, model);

    // 2. 후처리
    code = stripCodeFences(code);
    code = normalizeWhitespace(code);

    // 3. Vibe 파서로 검증
    const result = vibePipeline.parse(code);

    if (result.success) {
      return code;  // 성공
    }

    // 4. 실패 시 LLM-friendly 에러 메시지 생성
    const errorMsg = generateLLMFriendlyError(result.errors);

    // 5. 에러 피드백과 함께 재시도 프롬프트 구성
    prompt = buildRetryPrompt(code, errorMsg, attempt);
  }

  throw new Error("Max retries exceeded");
}

function generateLLMFriendlyError(errors: ParseError[]): string {
  // 기존: "expected EQ, got NEWLINE"
  // 개선: "Line 34: Variable 'spawn_x' needs initialization. Write 'let spawn_x: Float = 0.0' instead of 'let spawn_x: Float'"
  return errors.map(e => {
    switch (e.type) {
      case 'MISSING_INIT':
        return `Line ${e.line}: Variable '${e.name}' needs initialization. ` +
               `Write 'let ${e.name}: ${e.typeName} = ${zeroValue(e.typeName)}'`;
      case 'UNKNOWN_KEYWORD':
        if (e.keyword === 'while')
          return `Line ${e.line}: 'while' is not a Vibe keyword. Use 'for ${e.condition}' instead.`;
        break;
      case 'UNSUPPORTED_OPERATOR':
        if (e.operator === '+=')
          return `Line ${e.line}: Use 'x = x + n' instead of 'x += n'`;
        break;
      // ...
    }
  }).join('\n');
}
```

**예상 일정**:

| 단계 | 작업 | 기간 |
|------|------|------|
| 1 | LLM-friendly 에러 메시지 시스템 구현 | 2-3일 |
| 2 | 재시도 프롬프트 설계 + 구현 | 1-2일 |
| 3 | 후처리 파이프라인 강화 | 1일 |
| 4 | 벤치마크 통합 + 검증 | 1-2일 |
| **총** | | **5-8일** |

### 6.4 미래에 Constrained Decoding을 재검토할 조건

다음 조건 중 **하나라도** 충족되면 constrained decoding을 재검토할 가치가 있다:

1. **클라우드 API가 커스텀 문법을 지원**: OpenAI/Anthropic/Google이 JSON Schema 외에 CFG/PEG 문법 주입 API를 추가한 경우
2. **context-sensitive constrained decoding이 프로덕션화**: INDENT/DEDENT를 정확히 처리하는 엔진이 오픈소스로 출시된 경우
3. **Vibe가 중괄호 기반으로 전환**: 들여쓰기 → `{}` 블록으로 변경한 경우 (이 경우 CFG로 완전 표현 가능)
4. **로컬 모델이 GPT-4o 수준에 도달**: 로컬 모델의 코드 생성 품질이 충분히 높아진 경우

현재(2026년 3월) 기준으로 이 조건 중 어느 것도 충족되지 않는다.

---

## 7. 부록: JSON Schema "우회" 전략의 비현실성

"JSON Schema로 Vibe AST 구조를 정의하면 되지 않나?"라는 질문에 대한 답변.

### 7.1 이론

```json
{
  "type": "object",
  "properties": {
    "program": {
      "type": "array",
      "items": {
        "oneOf": [
          { "$ref": "#/definitions/FnDecl" },
          { "$ref": "#/definitions/LetDecl" }
        ]
      }
    }
  },
  "definitions": {
    "FnDecl": {
      "type": "object",
      "properties": {
        "type": { "const": "fn_decl" },
        "name": { "type": "string" },
        "params": { ... },
        "body": { ... }
      }
    }
  }
}
```

LLM이 이 JSON AST를 생성하면, 그것을 Vibe 소스 코드로 변환(pretty print)한다.

### 7.2 왜 비현실적인가

1. **AST가 코드보다 5-10배 크다**: `let x: Float = 0.0`은 9 토큰이지만, 같은 의미의 JSON AST는 50+ 토큰. LLM의 토큰 비용과 지연이 5-10배 증가.

2. **LLM이 AST를 정확하게 생성하기 더 어렵다**: 코드는 자연어에 가깝지만, AST는 기계적 구조. 연구에 따르면 LLM은 JSON Schema 기반 structured output에서도 복잡한 스키마에서 오류율이 높아진다.

3. **식별자 자유도**: 변수 이름, 함수 이름은 자유 텍스트. JSON Schema로 "유효한 식별자만 허용"하려면 정규식 패턴이 필요하지만, 모든 API가 `pattern` 키워드를 지원하는 것은 아님.

4. **표현식의 재귀적 구조**: `a + b * c - d`같은 표현식은 재귀적 AST 트리로 표현됨. JSON Schema의 `$ref`로 재귀 구조를 정의할 수 있지만, LLM이 정확히 생성하는 것은 매우 어려움.

5. **왕복 문제**: AST → 코드 → AST 변환에서 정보 손실 가능 (포매팅, 주석 등).

**결론**: JSON Schema 우회는 이론적으로 가능하지만, 실용적으로는 직접 코드를 생성하는 것보다 **더 나쁜** 결과를 낸다.

---

## 8. 참고 문헌 및 출처

- [OpenAI Structured Outputs 소개](https://openai.com/index/introducing-structured-outputs-in-the-api/)
- [OpenAI Structured Outputs 가이드](https://developers.openai.com/api/docs/guides/structured-outputs/)
- [How Structured Outputs and Constrained Decoding Work](https://www.letsdatascience.com/blog/structured-outputs-making-llms-return-reliable-json)
- [Constrained Decoding: Grammar-Guided Generation for Structured LLM Output](https://mbrenndoerfer.com/writing/constrained-decoding-structured-llm-output)
- [Anthropic Claude Structured Outputs 문서](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Claude API Structured Output 가이드](https://thomas-wiegold.com/blog/claude-api-structured-output/)
- [Google Gemini Structured Outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- [Improving Structured Outputs in the Gemini API](https://blog.google/technology/developers/gemini-api-structured-outputs/)
- [llama.cpp GBNF Grammar 문서](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)
- [llguidance - Super-fast Structured Outputs](https://github.com/guidance-ai/llguidance)
- [Outlines - Structured Outputs 라이브러리](https://github.com/dottxt-ai/outlines)
- [vLLM Structured Outputs 문서](https://docs.vllm.ai/en/latest/features/structured_outputs/)
- [Constrained Decoding for Code LMs via Context-Sensitive Grammars](https://arxiv.org/abs/2402.17988)
- [Flexible and Efficient Grammar-Constrained Decoding (ICML 2025)](https://openreview.net/forum?id=L6CYAzpO1k)
- [Correctness-Guaranteed Code Generation via Constrained Decoding](https://arxiv.org/html/2508.15866v1)
- [Principled Parsing for Indentation-Sensitive Languages](https://michaeldadams.org/papers/layout_parsing/LayoutParsing.pdf)
- [Teaching an LLM to Write Assembly: GBNF-Constrained Generation](https://www.jamesdrandall.com/posts/gbnf-constrained-generation/)
- [A Guide to Structured Outputs Using Constrained Decoding](https://www.aidancooper.co.uk/constrained-decoding/)
