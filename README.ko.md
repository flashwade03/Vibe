# Vibe

**LLM이 100% 구문 정확도로 코드를 생성할 수 있도록 설계된 프로그래밍 언어** — LLM 퍼스트 게임 프로그래밍 언어.

[English](README.md) | [日本語](README.ja.md)

## Vibe란?

Vibe는 LLM이 구문적으로 완벽한 코드를 첫 시도에 생성할 수 있도록 설계된 새로운 프로그래밍 언어입니다. Lua로 트랜스파일되어 [LOVE 2D](https://love2d.org/)에서 실행되며, 향후 자체 엔진을 목표로 합니다.

```
struct Ball
    x: Float
    y: Float
    vx: Float
    vy: Float
    r: Float

let balls: List[Ball] = []

fn update(dt: Float)
    for b in balls
        b.x = b.x + b.vx * dt
        b.y = b.y + b.vy * dt
        if b.x < b.r or b.x > 800.0 - b.r
            b.vx = -b.vx
        if b.y < b.r or b.y > 600.0 - b.r
            b.vy = -b.vy

fn draw()
    set_color(0.2, 0.8, 1.0)
    for b in balls
        draw_circle(b.x, b.y, b.r)
    set_color(1.0, 1.0, 1.0)
    draw_text("Balls: " + str(len(balls)), 10.0, 10.0)
```

## 특징

- **순수 들여쓰기** — `:`, `do`, `then`, `end` 없음. 들여쓰기만으로 블록을 구분합니다.
- **20개 키워드** — `fn let const if else for in match return break continue enum struct and or not use yield trait has`
- **LLM 퍼스트 설계** — 최소한의 문법 모호성, 일관된 패턴, 코드 생성을 방해하는 엣지 케이스 제로.
- **구조체, 열거형, 트레이트** — `struct Player has Drawable`, `enum GameState`, `Enum.Variant` 패턴 매치.
- **게임 레디** — 입력, 드로잉, 게임 루프를 위한 내장 함수. `fn update(dt)`와 `fn draw()`가 엔진에 직접 매핑됩니다.
- **Lua로 트랜스파일** — 생성된 코드가 LOVE 2D에서 수정 없이 실행됩니다.

## LLM 벤치마크 (구문 통과율)

38개 게임 태스크 × 4단계 난이도(Easy/Medium/Hard/Trap), 풀 파이프라인 검증 (lexer → parser → codegen → luac).

**공식 생성기 (Claude Code, 프로젝트 컨텍스트 포함):**

| 언어 | Claude |
|------|--------|
| **Vibe** | **100% (38/38)** |

**서드파티 LLM (API, 시스템 프롬프트만):**

| 언어 | Gemini | OpenAI |
|------|--------|--------|
| **Vibe** | **100% (38/38)** | 71% (27/38) |
| Python-Pygame | 100% (38/38) | 100% (38/38) |
| Lua-LOVE | 100% (38/38) | 100% (38/38) |

**토큰 효율성** (Gemini 평균): Vibe **165** vs Python 207 vs Lua 203.

> 참고: "구문 통과율"은 생성된 코드가 문법적으로 유효하고 Lua로 트랜스파일됨을 의미합니다. 런타임 동작 정확성은 아직 측정하지 않습니다.

[전체 벤치마크 결과](vibe-lang/benchmark/results.md)

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
npx tsx vibe-lang/src/cli/cli.ts run vibe-lang/examples/demo_bouncing_balls.vibe
```

### 테스트 실행

```bash
npx vitest run
```

4개 스위트 129개 테스트: 렉서 (22), 파서 (51), 코드젠 (52), E2E (4).

## 언어 개요

### 변수

```
let x: Int = 42
const PI: Float = 3.14
```

### 함수

```
fn greet(name: String)
    draw_text("Hello " + name, 100.0, 100.0)
```

### 제어 흐름

```
if health > 0
    draw_text("Alive", 10.0, 10.0)
else
    draw_text("Game Over", 10.0, 10.0)

for enemy in enemies
    draw_rect(enemy.x, enemy.y, 32.0, 32.0)

match state
    GameState.Menu
        draw_text("Press SPACE", 300.0, 300.0)
    GameState.Playing
        draw_text("Playing!", 300.0, 300.0)
```

### 구조체 & 트레이트

```
struct Player has Drawable
    x: Float
    y: Float
    size: Float

    fn draw(self_x: Float, self_y: Float)
        draw_rect(self_x, self_y, 32.0, 32.0)
```

### 열거형 & 매치

```
enum GameState
    Menu
    Playing
    GameOver

let state: GameState = GameState.Menu

match state
    GameState.Menu
        draw_text("Menu", 300.0, 300.0)
    GameState.Playing
        draw_text("Play", 300.0, 300.0)
    GameState.GameOver
        draw_text("Over", 300.0, 300.0)
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
| `set_color(r, g, b)` | 드로잉 색상 설정 |
| `len(list)` | 리스트 길이 |
| `append(list, item)` | 리스트에 항목 추가 |
| `abs(x)` / `min(a,b)` / `max(a,b)` | 수학 함수 |
| `rand_int(a, b)` / `rand_float(a, b)` | 난수 생성 |
| `print(value)` | 콘솔 출력 |

## 아키텍처

```
.vibe 파일 → Lexer → Parser → CodeGen → Lua → LOVE 2D
```

트랜스파일러는 TypeScript로 작성되었으며 (~3,500줄) 세 개의 독립 모듈로 구성됩니다:

- **Lexer** (648줄) — Python 스타일 INDENT/DEDENT로 토큰화
- **Parser** (1,551줄) — 수제 재귀 하강 파서, AST 생성
- **CodeGen** (686줄) — AST 순회, LOVE 2D API 매핑으로 Lua 출력
- **Feedback** (492줄) — LLM 재시도를 위한 Error-Feedback Loop (Layer 3 방어)

## 프로젝트 구조

```
vibe-lang/               — Vibe 언어 (언어 관련 파일 전체)
  src/                   — 트랜스파일러 (lexer, parser, codegen, feedback, cli)
  grammar/               — PEG 문법 정의
  examples/              — Vibe 예제 프로그램 (.vibe)
  benchmark/             — LLM 벤치마크 (38 tasks × 3 languages × 2 LLMs)
design/                  — 설계 문서
research/                — 언어 설계 리서치
build/                   — 생성된 Lua 출력 (gitignore)
```

## 로드맵

Vibe v0 완료 — 트랜스파일러 파이프라인이 struct, enum, trait, match, 게임 루프를 end-to-end로 처리합니다. 다음 단계:

- 타입 체커 (어노테이션은 파싱하지만 현재 무시)
- 어노테이션 런타임 (`@entity`, `@scene`, `@on`)
- 모듈 시스템 (`use`)
- 런타임 벤치마크 검증 (현재 파서 검증만)
- 핫 리로드
- 소스맵 (Lua 에러 → Vibe 줄번호 역매핑)
- LSP 서버
- 자체 게임 엔진 (Rust)

## 라이선스

ISC
