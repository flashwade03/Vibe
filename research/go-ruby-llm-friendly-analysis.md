# Go & Ruby LLM-Friendly Characteristics Analysis (2026-03-11)

## Purpose

Go와 Ruby가 "바이브 코딩에 가장 적합한 언어"로 평가받는 이유를 분석하고, Vibe 언어 설계에 이미 반영된 특성과 부족한 특성을 식별한다.

## Go의 LLM-Friendly 특성 7가지

| # | 특성 | 설명 | LLM에 미치는 영향 |
|---|------|------|-------------------|
| G1 | **25 키워드** | 언어 전체 키워드가 25개 | 학습해야 할 문법 규칙 자체가 적음 → 오류 표면적 축소 |
| G2 | **gofmt — 하나의 작성법** | 공식 포매터가 코드 스타일을 강제 | 트레이닝 데이터의 일관성 극대화 → 동일 패턴을 안정적으로 생성 |
| G3 | **명시적 에러 처리** | `if err != nil` 패턴, 암묵적 예외 없음 | LLM이 에러 처리를 빠뜨리지 않음 |
| G4 | **No magic** | 상속 없음, 매크로 없음, implicit conversion 없음 | 코드가 보이는 대로 동작 → LLM이 side effect를 추론할 필요 없음 |
| G5 | **10년+ 호환성** | Go 1.0 이후 breaking change 없음 | 오래된 트레이닝 데이터도 여전히 유효한 코드 |
| G6 | **하나의 빌드 시스템** | `go build` 하나 | Python의 pip/conda/poetry/setuptools 혼란 없음 |
| G7 | **정적 타입** | 컴파일 타임 타입 검증 | 타입 정보가 LLM의 구조적 추론을 도움 |

### Go의 핵심 원리: "코드 작성 방법이 하나뿐"

Go의 모든 LLM 친화성은 하나의 원리로 수렴한다: **동일한 로직을 표현하는 방법이 하나뿐이므로, LLM의 트레이닝 데이터가 일관적이고, 생성 시 선택지가 적어 오류가 줄어든다.**

## Ruby/Rails의 LLM-Friendly 특성 5가지

| # | 특성 | 설명 | LLM에 미치는 영향 |
|---|------|------|-------------------|
| R1 | **Convention over Configuration** | 규칙이 정해져 있음 | LLM이 "추측"할 게 적음 → 구조적 결정을 자동으로 올바르게 함 |
| R2 | **고품질 트레이닝 코퍼스** | GitHub, Shopify, Basecamp 등 20년간의 production 코드 | LLM이 cleaner, smarter output 생성 |
| R3 | **Opinionated structure** | "Rails way"가 명확 | 잘 조명된 환경에서 코드 생성 → edge case 감소 |
| R4 | **Human-readable 문법** | 코드가 영어 문장처럼 읽힘 | 자연어 프롬프트 ↔ 코드 간 거리가 짧음 |
| R5 | **올인원 프레임워크** | routing/DB/form 포함 | 라이브러리 조합 실수 없음 → 일관된 코드 생성 |

### Ruby의 핵심 원리: "LLM이 추측할 게 없는 opinionated 환경"

Rails의 강점은 문법이 아니라 **프레임워크 컨벤션**이다. 구조적 결정(파일 위치, 네이밍, 패턴)이 미리 정해져 있어 LLM이 "어떻게 조합할까"를 고민하지 않아도 된다.

## Vibe와의 비교

| LLM-Friendly 특성 | Go | Ruby | Vibe 현황 | 평가 |
|---|---|---|---|---|
| **적은 키워드** | 25개 | ~41개 | **20개** | Go보다 적음. 밀러-LLM 법칙 준수 |
| **하나의 코드 스타일** | gofmt 강제 | Rubocop (선택) | **들여쓰기 강제** (중괄호/end 없음) | Go와 동등. 스타일 변동 원천 제거 |
| **명시적 에러 처리** | `if err != nil` | 예외 기반 | **미구현** (v0) | 게임 언어라 try/catch 자체를 설계에서 제외. 합당한 결정 |
| **No magic / No implicit** | 상속/매크로 없음 | 매직 많음 | **상속/매크로/implicit return 없음** | Go 수준으로 명시적 |
| **호환성/안정성** | 10년+ 무파괴 | 버전 간 변경 있음 | v0 — 해당 없음 | 장기 관점에서 주의 필요 |
| **Convention > Config** | 약함 (명시적) | 핵심 철학 | **게임 루프 컨벤션** (update/draw/keypressed) | 부분 적용 |
| **고품질 코퍼스** | 대규모 | 20년 역사 | **없음** (새 언어) | 근본적 약점. 4-Layer Defense 존재 이유 |
| **Human-readable** | 가독성 좋으나 verbose | 영어처럼 읽힘 | **Python-like + 게임 도메인 용어** | Ruby에 가까운 방향 |
| **올인원** | 표준 라이브러리 강함 | Rails 올인원 | **게임 빌트인** (draw_rect, key_down 등) | 도메인 특화 올인원 지향 |
| **정적 타입** | 강타입 | 동적 | **타입 어노테이션 있으나 무시 (v0)** | 설계는 Go 방향, 구현은 미완 |

## 핵심 발견

### 1. Vibe는 이미 Go의 핵심 특성 대부분을 흡수하고 있다

- 적은 키워드 (20 < 25)
- 하나의 코드 스타일 (들여쓰기 강제 = gofmt와 동일 효과)
- No magic (상속/매크로/implicit 없음)
- 명시적 return 강제

이것은 우연이 아니라 Vibe의 "명확 분리 원칙"과 "토큰 예산 원칙"이 Go의 설계 철학과 자연스럽게 수렴한 결과다.

### 2. Ruby에서 배울 점: Convention over Configuration

- Rails의 강점은 "LLM이 추측할 게 없는 opinionated structure"
- Vibe의 `update/draw/keypressed` 게임 루프 컨벤션이 이미 이 역할을 함
- 그러나 struct/entity/component 레벨에서 "Vibe way"가 아직 없음
- **향후 `@entity`, `@scene` 어노테이션이 구현되면 이 갭이 메워질 수 있음**
- 이것은 Ruby 자체의 문법이 아니라 Rails 프레임워크의 특성 → Vibe의 게임 엔진 레이어가 담당할 영역

### 3. 근본적 차이: 트레이닝 코퍼스

- Go/Ruby의 최대 강점은 "이미 LLM이 대량의 코드를 학습했다"는 것
- Vibe는 새 언어이므로 이 이점이 원천적으로 없음
- 이것이 바로 4-Layer Defense가 존재하는 이유
- 벤치마크에서 OpenAI가 80%인 것은 "트레이닝 데이터 부재"가 아니라 "instruction adherence" 문제
- **Go/Ruby를 배제한 것은 실수가 아니라, Vibe가 다른 문제를 풀고 있기 때문**

### 4. Go/Ruby가 풀지 못하는 Vibe의 문제

Go/Ruby가 아무리 LLM-friendly해도 해결하지 못하는 것:

- **게임 도메인 최적화**: 범용 언어는 게임 루프/엔티티/충돌 등을 라이브러리로 제공. Vibe는 언어 수준에서 제공
- **토큰 효율성**: Vibe 평균 171 토큰 vs Python 213 vs Lua 216. Go의 verbose 에러 처리(`if err != nil`)는 토큰 비효율적
- **프롬프트 제어 가능성**: 새 언어이므로 Training Data Gravity가 없음(=양날의 검이지만, Layer 1 프롬프트로 100% 제어 가능)

## 결론

> **Go/Ruby의 LLM 친화성 = "트레이닝 데이터 양 × 코드 일관성"**
> **Vibe의 전략 = "트레이닝 데이터 없이도 프롬프트만으로 100% 정확도 달성"**

두 접근은 서로 다른 문제를 풀고 있다. Go/Ruby를 벤치마크 비교 대상에 추가하는 것은 유용하지만, Go/Ruby를 Vibe 대신 사용하는 것은 프로젝트의 근본 목표(게임 도메인 특화 + LLM 100% 정확도 + 토큰 효율성)와 충돌한다.

### 향후 액션

| 우선순위 | 액션 |
|----------|------|
| P2 | Go를 벤치마크 비교 언어에 추가 (gofmt 일관성 효과 vs Vibe 들여쓰기 강제 효과 비교) |
| P2 | struct/entity 레벨의 "Vibe way" 컨벤션 정의 (Ruby/Rails의 CoC에서 영감) |
| P3 | v1 이후 — LLM 트레이닝 데이터 SEO (Go의 10년 코퍼스 일관성에서 영감) |

## Sources

- [In my experience, Go is one of the best LLM targets - HN](https://news.ycombinator.com/item?id=44123043)
- [Why Ruby on Rails Is the Best Stack for Vibe Coding](https://jetrockets.com/blog/why-ruby-on-rails-is-the-best-stack-for-vibe-coding-in-the-age-of-ai)
- [Building LLM-powered applications in Go](https://go.dev/blog/llmpowered)
- [The future of AI is Ruby on Rails](https://www.seangoedecke.com/ai-and-ruby/)
- [Ask HN: What is the best programming language for "vibe coding"?](https://news.ycombinator.com/item?id=43282015)
- [Benchmarking LLM Performance: Python vs Go](https://www.aadhilimam.com/posts/benchmarking-llm-python-vs-go/)
- [A case for Go as the best language for AI agents - HN](https://news.ycombinator.com/item?id=47222270)
