# Vibe

**LLM이 100% 정확도로 코드를 생성할 수 있도록 설계된 프로그래밍 언어** + 경량 게임 엔진.

[English](README.md) | [日本語](README.ja.md)

## Vibe란?

Vibe는 LLM이 완벽한 정확도로 이해하고 생성할 수 있도록 만들어진 새로운 프로그래밍 언어입니다. Lua로 트랜스파일되어 [LOVE 2D](https://love2d.org/)에서 실행되며, 향후 자체 엔진을 목표로 합니다.

```
let x: Float = 400.0
let y: Float = 300.0
let speed: Float = 200.0

fn update(dt: Float)
  if key_down("right")
    x = x + speed * dt
  if key_down("left")
    x = x - speed * dt
  if key_down("down")
    y = y + speed * dt
  if key_down("up")
    y = y - speed * dt

fn draw()
  draw_rect(x, y, 32, 32)
```

## 특징

- **순수 들여쓰기** — `:`, `do`, `then`, `end` 없음. 들여쓰기만으로 블록을 구분합니다.
- **20개 키워드** — `fn let const if else for in match return break continue enum struct and or not use yield trait has`
- **LLM 퍼스트 설계** — 최소한의 문법 모호성, 일관된 패턴, 코드 생성을 방해하는 엣지 케이스 제로.
- **게임 레디** — 입력, 드로잉, 게임 루프를 위한 내장 함수. `fn update(dt)`와 `fn draw()`가 엔진에 직접 매핑됩니다.
- **Lua로 트랜스파일** — 생성된 코드가 LOVE 2D에서 수정 없이 실행됩니다.

## 빠른 시작

### 사전 요구사항

- [Node.js](https://nodejs.org/) 18+
- [LOVE 2D](https://love2d.org/) 설치 (macOS: `brew install love`)

### 설치 및 실행

```bash
git clone https://github.com/flashwade03/Vibe.git
cd Vibe
npm install

# .vibe 파일을 트랜스파일하고 실행
npx tsx src/cli/cli.ts run examples/02_moving_player.vibe

# LOVE가 PATH에 없는 경우 (macOS)
npx tsx src/cli/cli.ts run examples/02_moving_player.vibe
open -a love build
```

### 테스트 실행

```bash
npx vitest run
```

4개 스위트 67개 테스트: 렉서 (22), 파서 (22), 코드젠 (20), E2E (3).

## 언어 개요

### 변수

```
let x: Int = 42
const PI: Float = 3.14
```

### 함수

```
fn greet(name: String)
  draw_text("Hello " + name, 100, 100)
```

### 제어 흐름

```
if health > 0
  draw_text("Alive", 10, 10)
else
  draw_text("Game Over", 10, 10)

for enemy in enemies
  draw_rect(enemy.x, enemy.y, 32, 32)

for i in range(10)
  draw_circle(i * 50, 100, 10)
```

### 불리언 연산자

```
if alive and not invincible
  take_damage()
```

### 내장 함수 (v0)

| Vibe | 설명 |
|------|------|
| `key_down(key)` | 키 입력 확인 |
| `draw_rect(x, y, w, h)` | 채워진 사각형 그리기 |
| `draw_circle(x, y, r)` | 채워진 원 그리기 |
| `draw_text(text, x, y)` | 텍스트 그리기 |

## 예제

`examples/` 디렉토리에 점진적으로 복잡해지는 10개 프로그램이 있습니다:

| # | 파일 | 설명 |
|---|------|------|
| 01 | `hello_vibe.vibe` | 텍스트 표시 |
| 02 | `moving_player.vibe` | 화살표 키 이동 |
| 03 | `coin_collector.vibe` | 충돌과 점수 |
| 04 | `enemy_ai.vibe` | 상태 머신 AI |
| 05 | `scene_transition.vibe` | 씬 관리 |
| 06 | `shooting_game.vibe` | 발사체 |
| 07 | `platformer.vibe` | 중력과 점프 |
| 08 | `inventory_system.vibe` | 데이터 구조 |
| 09 | `particle_tween_effects.vibe` | 파티클과 트윈 |
| 10 | `coroutine_cutscene.vibe` | 코루틴 컷씬 |

## 아키텍처

```
.vibe 파일 → Lexer → Parser → CodeGen → Lua → LOVE 2D
```

트랜스파일러는 TypeScript로 작성되었으며 세 개의 독립 모듈로 구성됩니다:

- **Lexer** — Python 스타일 INDENT/DEDENT로 토큰화
- **Parser** — 수제 재귀 하강 파서, AST 생성
- **CodeGen** — AST 순회, LOVE 2D API 매핑으로 Lua 출력

## 프로젝트 구조

```
src/
  lexer/       — 토크나이저 (INDENT/DEDENT, 키워드, 연산자)
  parser/      — 재귀 하강 파서 → AST
  codegen/     — AST → Lua 코드 생성기
  cli/         — CLI 진입점 (vibe run)
  pipeline.ts  — 접착제: lex | parse | generate
  e2e/         — E2E 테스트 및 픽스처
design/        — 언어 및 파이프라인 설계 문서
examples/      — Vibe 예제 프로그램 (.vibe)
research/      — 언어 설계 리서치
build/         — 생성된 Lua 출력 (gitignore)
```

## 로드맵

Vibe는 현재 **Phase 1 v0** — 최소 트랜스파일러 파이프라인 단계입니다. 향후 방향:

- 타입 체커
- `enum` / `match` / `struct` / `trait` / `has`
- 어노테이션 시스템 (`@entity`, `@scene`, `@on`)
- 모듈 시스템 (`use`)
- 핫 리로드
- 소스맵 (Lua 에러 → Vibe 줄번호 역매핑)
- LSP 서버
- 자체 게임 엔진 (Rust)

## 라이선스

ISC
