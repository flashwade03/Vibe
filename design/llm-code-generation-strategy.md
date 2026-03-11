# LLM 코드 생성 전략

## Goal

Vibe 코드 생성의 정확도를 모든 주요 LLM에서 극대화하는 전략을 정의한다.

## 핵심 원칙

### 근본 원칙: 학습 데이터 정렬 법칙

LLM 학습 데이터와 충돌하는 제약은, 그 제약이 제공하는 가치가 프롬프트 토큰 비용보다 클 때만 도입한다.

### 5대 설계 원칙

- **명확 분리 원칙** — 기존 언어와 다르게 만들 때는 명확하게 다르게 만든다. "거의 같지만 약간 다른"이 가장 위험 — because 벤치마크에서 `for condition`(while과 유사)이 패턴 누출을 유발, 반면 `fn`(def와 명확히 다름)은 오류 0건
- **예제 주도 학습** — 프롬프트에서 규칙 10줄보다 완전한 예제 1개가 더 효과적 — because 벤치마크에서 예제에 있는 패턴의 정확도가 규칙만 있는 패턴보다 높음
- **부정적 제약 우선** — "하지 마라"가 "이것을 해라"보다 LLM에게 효과적 — because "Do NOT use colons" 같은 금지 규칙은 위반 0건, 긍정적 허용(`+=` 지원)은 오류 유발
- **토큰 예산 원칙** — 모든 설계 결정의 비용 = 프롬프트 교정 토큰 + 생성 토큰. 비용 > 편익이면 도입하지 않음. 벤치마크 검증: Vibe 평균 171 토큰 vs Python 213 vs Lua 216 — 동일 로직을 20-25% 적은 토큰으로 표현. 적은 토큰 = 적은 Training Data Gravity 노출 표면적
- **밀러-LLM 법칙** — LLM이 프롬프트만으로 학습 가능한 "기존 언어에 없는 새 규칙" 상한: 7~12개. 현재 Vibe ~5-8개로 안전 범위 내

## 공식 코드 생성기

- **Claude = Vibe 공식 코드 생성기** — 벤치마크 30/30 (100%), 프롬프트 instruction following 능력 최우수
- **Gemini = 1급 지원 모델** — 벤치마크 30/30 (100%), Trap 카테고리 포함 전 난이도 통과. 토큰 효율성도 최우수 (평균 171 토큰)
- OpenAI = best-effort 지원 — 벤치마크 24/30 (80%), 비결정적 (실행마다 ±10% 변동, 범위 71-87%)
- 모델 간 차이의 핵심: "긴 생성에서의 instruction adherence" — 코드가 복잡해질수록 학습 데이터 패턴이 프롬프트 규칙을 override하는 정도가 다름
- **OpenAI 실패의 유일한 원천은 Python** — 6/6 실패가 전부 Python 구문 누출 (tuple, list comprehension, ternary, slice, dict literal). JS/Lua 패턴 유입 0건

## 방어 전략: 4-Layer Defense

- **Layer 0: 언어 설계** — 학습 데이터와의 충돌을 원천 제거 (`+=` 지원, `while` alias 등). 벤치마크로 검증됨: Gemini/Claude 100%, Trap 카테고리 전 통과
- **Layer 1: 프롬프트 최적화** — DO NOT 섹션, 예제 5개, 실패 패턴→정답 대비. Python-specific 방어에 집중 (tuple, list comprehension, ternary, slice, dict literal 금지)
- **Layer 2: 후처리** — 마크다운 펜스 제거, 탭→스페이스 변환 등 기계적 정제
- **Layer 3: Error-Feedback Loop** — 파서 검증 → 에러+정답패턴 전달 → 재생성 (최대 2회). 현실적 한계: 이미 적용된 상태에서 OpenAI 80%, 상한 추정 83-87%. Layer 3만으로 100%는 불가능 — 모델의 instruction adherence가 근본 제약

### 4-Layer의 알려진 갭: 파서 통과 ≠ 런타임 정확

4-Layer Defense는 "LLM이 파서를 통과하는 Vibe 코드를 생성하는가"만 다룬다. 생성된 코드가 트랜스파일 후 실제로 동작하는지는 별도 검증이 필요하다. 확인된 CodeGen 버그:
- `len()` → Lua `#` 연산자로 미매핑 (런타임 undefined function)
- 0-indexed 배열 접근이 1-indexed Lua에 그대로 전달 (런타임 nil)
- `continue` → `-- continue` 주석으로만 변환 (동작 안 함)
- `..` range가 Lua 문자열 연결로 오번역

이 갭이 해결되기 전까지, 벤치마크 pass rate는 "파서 통과율"이지 "실행 가능률"이 아니다.

### 비결정성 (Nondeterminism)

OpenAI 벤치마크 결과는 실행마다 ±10% 변동한다 (같은 태스크가 PASS↔FAIL 교차). 이는 temperature 설정과 무관한 모델 고유 특성이다. 벤치마크 보고 시 단일 실행이 아닌 3-5회 반복의 평균/표준편차를 사용해야 한다. Gemini도 이전 97% → 현재 100%로 변동이 있으므로, 100%가 항상 보장되지는 않는다.

## Constraints

- Must: 시스템 프롬프트는 200줄 이내 유지 (밀러-LLM 법칙)
- Must: 모든 프롬프트 규칙은 최소 1개 예제에서 시연
- Must: 새 문법 기능 추가 시 "기존 언어에 없는 새 규칙" 수가 12개를 초과하지 않는지 확인
- Must not: 프롬프트에 파서가 미지원하는 문법을 지원한다고 명시
- Must not: 컨텍스트 윈도우 병목이 발생하지 않는 단계에서 RAG 도입

## Scope

**In scope (v0)**:
- 프롬프트 오류 수정 및 DO NOT 섹션 추가
- Logit Bias로 `while`/`var` 등 위험 토큰 차단
- 전처리 (마크다운 펜스 제거)
- `+=`/`-=`/`*=`/`/=` 파서 구현
- `while` → `for` 파서 자동 변환 (alias)
- Error-Feedback Loop 구현

**Out of scope (v1 이후)**:
- 합성 트레이닝 데이터 생태계 (GitHub/npm 공개)
- Lua → Vibe 역변환기
- 규칙 기반 예제 선택 (pseudo-RAG)
- Vibe 전용 소형 모델 (Knowledge Distillation)
- 본격 RAG (지식이 10,000+ 토큰일 때)
- Constrained Decoding (API 네이티브 지원 시)

## v1 이후 검토 방향 (확정 아님)

- Fine-tuning / LoRA (문법 안정화 + 예제 50개 이상 확보 후)
- Lua → Vibe 역변환기로 트레이닝 데이터 대량 생산
- "LLM 트레이닝 데이터 SEO" (GitHub, StackOverflow, npm 전략적 배치)
- Vibe 전용 소형 모델 (Claude distillation)
- 자연어 → Vibe 선언적 게임 기술 레이어
