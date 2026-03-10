# Vibe Language

LLM이 100% 정확도로 이해/생성할 수 있도록 설계된 프로그래밍 언어 + 경량 게임 엔진.
전략: 언어 먼저 → LÖVE 2D로 트랜스파일 → 이후 자체 엔진.

## Tech Stack

- **언어**: TypeScript (트랜스파일러 구현)
- **파서**: Hand-written Recursive Descent
- **런타임**: LÖVE 2D 11.5 (Lua)
- **CLI**: `vibe run <file.vibe>` → 트랜스파일 + LÖVE 실행

## Vibe 언어 키워드 (20개)

```
fn let const if else for in match return break continue
enum struct and or not use yield trait has
```

- 내장 상수: `true`, `false`, `none`
- 블록: 순수 들여쓰기 (`:`, `do`, `then`, `end` 미사용)
- `:` 는 타입 어노테이션 전용
- 게임 도메인: 어노테이션 (`@entity`, `@scene`, `@on`, `@component`)

## 디렉토리 구조

```
vibe-lang/           — Vibe 언어 전체
  src/               — 트랜스파일러 소스 (TypeScript)
  grammar/           — PEG 문법 정의
  examples/          — Vibe 예제 코드 (.vibe)
  benchmark/         — LLM 벤치마크 (30 tasks × 3 langs × 3 LLMs)
design/              — 설계 문서
research/            — 리서치 문서
build/               — 생성된 Lua 출력 (gitignore)
```

## 설계 문서

구현 시 해당 영역의 설계 문서를 먼저 읽고 결정 사항을 따를 것.

| 문서 | 참조 시점 |
|------|----------|
| `design/phase1-minimal-pipeline.md` | 파이프라인 구조, 스코프, 제약 조건 확인 시 |
| `vibe-lang/grammar/vibe-core-grammar.peg` | 파서 구현 시 문법 규칙 참조 |
| `vibe-lang/grammar/type-system-grammar.peg` | 타입 시스템 문법 참조 |
| `design/game-annotations.md` | 어노테이션 체계 참조 (v0 이후) |
| `design/llm-code-generation-strategy.md` | LLM 코드 생성 전략, 5대 설계 원칙, 4-Layer Defense |
| `design/error-feedback-loop.md` | Error-Feedback Loop 아키텍처, 재시도 전략 |

## 구현 규칙

- Lexer, Parser, CodeGen은 독립 모듈로 분리
- v0 범위: 7개 키워드만 (`fn`, `let`, `const`, `if`, `else`, `return`, `for`)
- 타입 어노테이션은 파싱하되 무시 (v0에서 타입 체커 없음)
- 어노테이션, 모듈 시스템은 v0에서 구현하지 않음
- 생성된 Lua는 수정 없이 `love build/`로 실행 가능해야 함

## LLM 코드 생성 규칙

- Claude = 공식 Vibe 코드 생성기. 다른 모델은 best-effort
- 새 문법 추가 시 "기존 언어에 없는 새 규칙" 12개 초과 금지 (밀러-LLM 법칙)
- 프롬프트에 파서 미지원 문법을 지원한다고 명시 금지
- "거의 같지만 약간 다른" 문법은 가장 위험 — 명확히 같거나 명확히 다르게 설계
- 상세 전략은 `design/llm-code-generation-strategy.md` 참조

## 개발 워크플로우

모든 기능 개발은 아래 4단계를 따른다.

### 스코프 판단 (매 작업 시작 전)

`/design`의 Scope Check로 설계 필요 여부를 먼저 판단한다.
- **설계 불필요** (기존 구조 안에서 완결, 새 구조적 결정 없음): 1~2단계 건너뛰고 바로 3단계(구현) → 4단계(벤치마크)
- **설계 필요** (새 구조적 결정, 이후 기능이 의존): 1단계부터 순서대로

### 1단계: 설계 (S등급 도달까지 반복)

```
/design → 설계 문서 작성
/design-review <설계문서경로> → 6축 평가 (Grade S~F, Score 0-100)
→ FAIL/WARN 항목 수정 → /design-review 재평가
→ Grade S (Score 100) 도달할 때까지 반복
```

- `/design`(vibe-design)으로 설계 문서 작성. 대화를 통해 핵심 결정 확정.
- `/design-review`(design-review)로 6축 평가. S등급(모든 축 PASS)이 아니면 피드백 반영 후 재평가.
- S등급 확정 후 다음 단계로.

### 2단계: 구현 계획 (Damascus Forge)

```
/forge-plan -n 10 <설계 문서 기반 구현 지시>
```

- Damascus 멀티-LLM 리뷰 워크플로우로 구현 계획 품질 극대화.
- agent-teams 패턴 포함: 에이전트별 파일 소유권, 단계별 실행 순서, TDD.
- APPROVED 판정까지 자동 반복 (최대 10회).

### 3단계: 구현 (Agent-Teams)

구현 계획의 agent-teams 설계에 따라 병렬 에이전트로 개발.

- 각 에이전트는 자기 소유 파일만 수정
- 의존 관계가 있으면 단계별 순차 실행
- TDD: 테스트 먼저 작성, 구현, 모든 테스트 통과 확인

### 4단계: 벤치마크 검증

모든 변경 후 반드시 벤치마크 실행. 결과는 `vibe-lang/benchmark/results.md`에 갱신.

## 벤치마크 워크플로우

### 구조

- **30 tasks** × 3 languages (Vibe, Python-Pygame, Lua-LOVE) × 3 LLMs (Gemini, OpenAI, Claude)
- 난이도 4단계: Easy(5) / Medium(9) / Hard(8) / Trap(8)
- Trap 카테고리: Training Data Gravity를 의도적으로 유발하는 태스크

### Gemini/OpenAI 벤치마크 (API 기반)

```
Agent(prompt="npx tsx vibe-lang/benchmark/runner.ts를 실행하고 결과를 요약해줘. Vibe pass rate이 이전보다 떨어졌으면 원인 분석도 해줘.", run_in_background=true)
```

runner.ts가 Gemini/OpenAI API를 호출하여 코드 생성 → 파서 검증 → 결과 기록.

### Claude 벤치마크 (서브에이전트 기반)

Claude는 API가 아닌 **서브에이전트**가 직접 Vibe 코드를 생성한다. 이유:
- Claude = 공식 Vibe 코드 생성기이므로, 실제 사용 환경(Claude Code 세션)과 동일한 조건에서 테스트
- 시스템 프롬프트 + CLAUDE.md 컨텍스트를 자연스럽게 활용

실행 방법:
```
Agent(prompt="vibe-lang/benchmark/tasks.ts의 모든 태스크에 대해 Vibe 코드를 생성해줘.
각 태스크마다:
1. vibe-lang/benchmark/contexts/vibe-context.ts의 systemPrompt를 참고
2. task.description을 읽고 Vibe 코드 생성
3. 생성한 코드를 vibe-lang/benchmark/output/vibe/claude/{task_id}.vibe에 저장
4. 파서로 검증: vibe-lang/src/parser를 import해서 파싱 성공 여부 확인
5. 결과를 요약 (PASS/FAIL, 에러 메시지)", run_in_background=true)
```

### 벤치마크 결과 분석

- 전체 pass rate 비교: Claude vs Gemini vs OpenAI
- 난이도별 분석: Easy/Medium/Hard/Trap 카테고리 분리
- 에러 패턴 분류: Training Data Gravity 유형 (중괄호, while, colon, dict 리터럴 등)
- Vibe pass rate이 이전보다 떨어지면 원인 분석 후 수정
