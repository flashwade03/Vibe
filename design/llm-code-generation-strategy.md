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
- **토큰 예산 원칙** — 모든 설계 결정의 비용 = 프롬프트 교정 토큰 + 생성 토큰. 비용 > 편익이면 도입하지 않음
- **밀러-LLM 법칙** — LLM이 프롬프트만으로 학습 가능한 "기존 언어에 없는 새 규칙" 상한: 7~12개. 현재 Vibe ~5-8개로 안전 범위 내

## 공식 코드 생성기

- **Claude = Vibe 공식 코드 생성기** — because 벤치마크 20/20 (100%), 프롬프트 instruction following 능력 최우수
- GPT-4o, Gemini 등 다른 모델은 best-effort 지원
- 모델 간 차이의 핵심: "긴 생성에서의 instruction adherence" — 코드가 복잡해질수록 학습 데이터 패턴이 프롬프트 규칙을 override하는 정도가 다름

## 방어 전략: 4-Layer Defense

- **Layer 0: 언어 설계** — 학습 데이터와의 충돌을 원천 제거 (`+=` 지원, `while` alias 등)
- **Layer 1: 프롬프트 최적화** — DO NOT 섹션, 예제 5개, 실패 패턴→정답 대비
- **Layer 2: 후처리** — 마크다운 펜스 제거, 탭→스페이스 변환 등 기계적 정제
- **Layer 3: Error-Feedback Loop** — 파서 검증 → 에러+정답패턴 전달 → 재생성 (최대 2회)

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
