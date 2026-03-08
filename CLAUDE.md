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
src/           — 트랜스파일러 소스 (TypeScript)
design/        — 설계 문서
research/      — 리서치 문서
examples/      — Vibe 예제 코드 (.vibe)
build/         — 생성된 Lua 출력 (gitignore)
```

## 설계 문서

구현 시 해당 영역의 설계 문서를 먼저 읽고 결정 사항을 따를 것.

| 문서 | 참조 시점 |
|------|----------|
| `design/phase1-minimal-pipeline.md` | 파이프라인 구조, 스코프, 제약 조건 확인 시 |
| `design/vibe-core-grammar.peg` | 파서 구현 시 문법 규칙 참조 |
| `design/type-system-grammar.peg` | 타입 시스템 문법 참조 |
| `design/game-annotations.md` | 어노테이션 체계 참조 (v0 이후) |

## 구현 규칙

- Lexer, Parser, CodeGen은 독립 모듈로 분리
- v0 범위: 7개 키워드만 (`fn`, `let`, `const`, `if`, `else`, `return`, `for`)
- 타입 어노테이션은 파싱하되 무시 (v0에서 타입 체커 없음)
- 어노테이션, 모듈 시스템은 v0에서 구현하지 않음
- 생성된 Lua는 수정 없이 `love build/`로 실행 가능해야 함
