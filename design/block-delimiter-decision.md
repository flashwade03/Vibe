# Vibe 블록 구분자 최종 결정서

> 결론: **Approach E -- `do`/`then` 키워드 + 들여쓰기 기반 (no `end`)** 을 선택한다.
> 단, `do`/`then`은 키워드 목록에서 **제거**하고, 들여쓰기만으로 블록을 결정한다.
> 최종 선택은 **순수 들여쓰기 (Approach A/D의 변형)** 이며, 블록 시작 표시자는 **없음 (no colon, no `do`, no `then`)** 이다.

---

## 0. 현재 프로젝트 내부 모순 정리

분석에 앞서, 프로젝트 문서 간의 모순을 명시한다:

| 문서 | 블록 구분 방식 | `then`/`end`/`do` |
|------|---------------|-------------------|
| `core-keywords.md` (22개 키워드) | 순수 들여쓰기 | **제거** (섹션 3.3, 4에서 상세 근거) |
| `LLM_CODE_GENERATION_ANALYSIS.md` | `end` 키워드 | **포함** (섹션 6.2에서 "높음" 평가) |
| `type-system-keywords.md` | `end` + `then` + `do` | **포함** (모든 예시에서 사용) |
| `game-domain-keywords.md` | `end` + `then` + `do` | **포함** (모든 예시에서 사용) |

이 모순의 원인: `LLM_CODE_GENERATION_ANALYSIS.md`가 먼저 작성되어 `end` 방식을 제안했고, 이후 `core-keywords.md`에서 재검토하여 들여쓰기 방식으로 변경했으나, 다른 문서들이 업데이트되지 않았다.

**본 문서에서 이 모순을 최종 해결한다.**

---

## 1. 다섯 가지 접근법 분석

### 1.1 평가 매트릭스

| 기준 | A: 순수 들여쓰기 | B: do/then + end | C: do/then + 들여쓰기 | D: 콜론 + 들여쓰기 | E: do/then (no end) |
|------|:-:|:-:|:-:|:-:|:-:|
| 들여쓰기 오류 복원력 | 낮음 | 높음 | 중간 | 낮음 | 낮음 |
| 토큰 효율 | 최고 | 최저 | 중간 | 높음 | 중간 |
| LLM 생성 일관성 | 높음 | 중간 | 중간 | 높음 | 중간 |
| 복사-붙여넣기 복원력 | 낮음 | 높음 | 중간 | 낮음 | 낮음 |
| 트랜스파일링 단순성 | 중간 | 높음 | 중간 | 중간 | 중간 |
| 키워드 예산 비용 | 0개 | 3개 | 2개 | 0개 | 2개 |
| Python 전이 학습 효과 | 최고 | 없음 | 부분적 | 높음 | 부분적 |
| 이중 부담 (두 가지를 맞춰야 함) | 없음 | **있음** | 없음 | 없음 | 없음 |

### 1.2 각 접근법 심층 분석

---

#### Approach A: 순수 들여쓰기 (Python)

```
fn update(dt: f32)
    if health > 0
        move(speed * dt)
    else
        die()

for enemy in enemies
    enemy.update(dt)
```

**장점:**
- Python과 동일한 패턴. LLM 훈련 데이터에서 가장 풍부한 들여쓰기 기반 언어
- 추가 키워드 0개. 키워드 예산 절약
- 코드가 가장 간결. 의미에 집중
- 들여쓰기만 맞추면 됨. 이중 부담 없음

**단점:**
- 들여쓰기 오류 시 의미가 변경됨 (silent bug)
- 복사-붙여넣기 시 들여쓰기가 손실될 수 있음
- `if` 뒤에 아무 표시 없이 바로 줄바꿈 -- "블록이 시작되었는가?"가 시각적으로 덜 명확

**LLM 관점:**
Python의 IndentationError는 전체 오류의 0.25%. LLM은 들여쓰기를 매우 정확하게 학습했다. 이 수치가 낮은 이유는 Python 훈련 데이터가 압도적으로 많기 때문인데, Vibe는 Python과 거의 동일한 들여쓰기 규칙을 사용하므로 이 전이 효과를 100% 활용할 수 있다.

---

#### Approach B: `do`/`then` + `end` (Lua/Ruby)

```
fn update(dt: f32) do
    if health > 0 then
        move(speed * dt)
    else
        die()
    end
end

for enemy in enemies do
    enemy.update(dt)
end
```

**장점:**
- 들여쓰기 오류가 의미를 변경하지 않음. `end`가 블록 경계를 결정
- Lua로의 트랜스파일이 가장 자연스러움
- 복사-붙여넣기 시 들여쓰기가 손실되어도 구조 유지

**단점:**
- **이중 부담**: LLM이 들여쓰기도 맞추고 `end`도 맞춰야 함
- **`end` 개수 오류**: 깊은 중첩에서 `end`를 하나 빠뜨리거나 하나 더 넣는 실수. 이것은 들여쓰기 오류보다 **더 빈번한 새로운 오류 카테고리를 생성**한다
- 키워드 3개 소비 (`do`, `then`, `end`)
- 토큰 비효율: 매 블록마다 `end` 토큰 추가. 깊은 중첩에서 `end end end end` 같은 무의미한 토큰 시퀀스 발생
- Vibe의 핵심 참조 언어인 Python과의 구문적 유사성이 완전히 파괴됨

**LLM 관점:**
`LLM_CODE_GENERATION_ANALYSIS.md`에서 `end` 방식이 "높음"으로 평가되었으나, 이는 **단일 블록 수준에서의 평가**다. 실제 게임 코드에서의 중첩 깊이를 고려하면:

```
entity Player
    has Sprite("hero.png")
    on update(dt: f32)
        match self.state
            is Idle then
                if input.pressed("move") then
                    self.state = Running(200.0)
                end
            end
        end
    end
end
```

이 코드에서 `end`가 **5개**. LLM이 이 5개의 `end` 중 하나를 빠뜨리거나 위치를 잘못 놓을 확률은, 들여쓰기 오류 0.25%보다 **훨씬 높다**. Lua 코드 생성 연구에서 `end` 불일치 오류는 일반적인 구문 오류 카테고리에 속하며, 이는 5.76%의 구문 오류 중 상당 부분을 차지한다.

---

#### Approach C: `do`/`then` + 들여쓰기 (하이브리드)

```
fn update(dt: f32) do
    if health > 0 then
        move(speed * dt)
    else
        die()

for enemy in enemies do
    enemy.update(dt)
```

**장점:**
- `do`/`then`이 블록 시작을 명시적으로 표시 (시각적 명확성)
- `end` 없이 들여쓰기로 블록 종료 (이중 부담 없음)

**단점:**
- `do`/`then`이 **순수한 장식(decoration)** 이 됨. 파서는 들여쓰기만 보고 블록을 결정하므로, `do`/`then`은 파싱에 영향을 주지 않음
- 키워드 2개 소비 (의미적 기여 없이)
- "한 가지 방법" 원칙 위반의 냄새: 블록 시작을 `do`/`then`으로 표시하는가, 들여쓰기로 표시하는가? 둘 다라면 하나가 불필요
- LLM이 `do`/`then`을 빠뜨려도 코드가 동일하게 동작 -- 그러면 이 키워드들은 왜 존재하는가?

**LLM 관점:**
"이중 정보(redundancy)"가 LLM에게 도움이 된다는 주장이 있다. 그러나 이것은 **노이즈 증가**와 동의어다. LLM은 `do`와 `then`을 보면 Lua 패턴을 활성화하여 `end`를 생성하려는 경향을 보일 것이다. `end`가 없는 언어에서 `do`/`then`을 사용하면 LLM의 기존 학습 패턴과 **충돌**한다.

---

#### Approach D: 콜론 + 들여쓰기 (현재 가정)

```
fn update(dt: f32):
    if health > 0:
        move(speed * dt)
    else:
        die()

for enemy in enemies:
    enemy.update(dt)
```

**장점:**
- Python과 99% 동일한 구문. LLM 전이 학습 효과 극대화
- 콜론이 "블록 시작" 신호를 시각적으로 제공
- 추가 키워드 0개 (콜론은 구두점)

**단점:**
- 타입 어노테이션의 콜론(`:`)과 블록 시작의 콜론(`:`)이 **동일 기호**
  - `let x: i32 = 10` (타입 어노테이션의 콜론)
  - `if health > 0:` (블록 시작의 콜론)
  - `fn update(dt: f32):` (함수 시그니처 끝의 콜론 -- `f32` 타입의 콜론과 블록 시작의 콜론이 같은 줄에 공존)
- Python에서도 콜론은 논란의 대상. "왜 콜론이 필요한가?"에 대한 답이 "역사적 이유"뿐

**LLM 관점:**
Python 전이 학습 효과는 최대이지만, 콜론의 이중 의미가 문제다. LLM이 `fn update(dt: f32):` 를 생성할 때, 마지막 콜론을 빠뜨리는 오류가 발생할 수 있다. 특히 Rust/Go 패턴(`fn update(dt: f32) {`)을 활성화하면 콜론을 빠뜨린다.

---

#### Approach E: `do`/`then` 키워드 (no `end`, 들여쓰기 기반)

```
if health > 0 then
    move(speed * dt)
else
    die()

for enemy in enemies do
    enemy.update(dt)

match state
    Idle then idle_animation()
    Running(speed) then run_animation(speed)
```

이것은 Approach C의 변형이며, 동일한 장단점을 가진다.

---

## 2. 결정: 순수 들여쓰기 (Approach A의 확장)

### 2.1 선택: 블록 시작 표시자 없음

```
fn update(dt: f32)
    if health > 0
        move(speed * dt)
    else
        die()

for enemy in enemies
    enemy.update(dt)

match self.state
    Idle
        idle_animation()
    Running(speed)
        run_animation(speed)
```

**`do`, `then`, `end`, `:` 모두 사용하지 않는다.**

### 2.2 이 결정의 7가지 근거

---

#### 근거 1: 키워드 예산의 극도의 희소성

현재 키워드 예산 상황:

```
핵심 언어 키워드: 22개 (core-keywords.md)
게임 도메인 키워드: 5개 (game-domain-keywords.md)
합계: 27개 (목표 범위 20-30개의 상단)
```

여기에 `do`, `then`, `end`를 추가하면 **30개**. 목표 범위의 최대값이다.

그런데 이 3개 키워드가 하는 일은 무엇인가? **순수하게 구문적 장식**이다. 프로그램의 의미(semantics)에 기여하는 것이 전혀 없다. 들여쓰기가 이미 블록 구조를 결정하는 상황에서, `do`/`then`/`end`는 "시각적 보조"에 불과하다.

키워드 예산 3개의 가치:
- `await` + `yield` + `import` -- 코루틴과 모듈 시스템 (게임 엔진에 필수적인 기능)
- 또는 `pub` + `type` + `defer` -- 접근 제어, 타입 별칭, 리소스 정리

**구문 장식에 3개를 쓸 것인가, 실질적 기능에 3개를 쓸 것인가?**

---

#### 근거 2: "한 가지 방법" 원칙의 엄격한 적용

`core-keywords.md`의 설계 판단 기준 중 **필수성**: "함수로 대체 가능하면 키워드에서 제외."

이를 블록 구분자에 적용하면: "들여쓰기로 대체 가능하면 키워드에서 제외."

`do`/`then`/`end`는 들여쓰기로 100% 대체 가능하다. 따라서 키워드에서 제외한다.

더 나아가, "한 가지 방법" 원칙은 블록 경계를 결정하는 방법이 **정확히 하나**여야 한다고 요구한다:

- Approach B: 들여쓰기 + `end` = **두 가지 방법** (모순 가능)
- Approach C/E: 들여쓰기 + `do`/`then` = **장식적 중복** (하나가 불필요)
- Approach A: 들여쓰기 = **한 가지 방법** (원칙 준수)

---

#### 근거 3: Python 전이 학습 효과의 극대화

`LLM_CODE_GENERATION_ANALYSIS.md` 섹션 4에서 확인된 데이터:

```
Python: LLM 정확도 35.9% (CodeGeeX2), 35.5% (StarCoder)
Lua:    학습 데이터의 비중 낮음, "저자원" 카테고리
Go:     22.5% (CodeGeeX2)
Rust:   18.1% (CodeGeeX2), 1.8% (CodeGen-16B)
```

Python은 LLM이 가장 정확하게 코드를 생성하는 언어다. Vibe가 Python의 들여쓰기 패턴을 그대로 사용하면, Python에서 학습된 "들여쓰기 → 블록 구조" 매핑이 **직접 전이**된다.

반면 `do`/`then`/`end`를 추가하면:
- Lua 패턴 활성화 → `end` 생성 기대 → `end`가 없으면 혼란
- Ruby 패턴 활성화 → `do...end` 쌍 기대 → 들여쓰기가 결정자면 혼란
- **어떤 기존 언어와도 정확히 일치하지 않는 하이브리드** → 전이 학습 효과 손상

Vibe의 핵심 전략은 "기존 언어의 교집합"이다. `do`/`then` + 들여쓰기(no `end`)는 **어떤 기존 언어에도 존재하지 않는 조합**이다. 이것은 전이 학습을 돕는 것이 아니라 방해한다.

---

#### 근거 4: 이중 부담의 근본적 제거

`core-keywords.md` 섹션 4.1에서 이미 분석한 내용:

```
end 방식의 문제:
1. 이중 부담: LLM이 들여쓰기도 맞추고 end도 맞춰야 함
2. end 개수 오류: 깊은 중첩에서 end를 하나 빠뜨리거나 하나 더 넣는 실수
3. 키워드 3개 낭비
4. 토큰 비효율
```

이 분석은 Approach B뿐 아니라 Approach C/E에도 부분적으로 적용된다. `do`/`then`을 필수로 만들면, LLM은 "올바른 위치에 `do`/`then`을 넣었는가?"도 맞춰야 한다. 이것은 들여쓰기 외에 추가적인 구문 요소를 정확히 생성해야 하는 부담이다.

순수 들여쓰기에서는 LLM이 맞춰야 하는 것이 **하나**: 올바른 들여쓰기.

---

#### 근거 5: 토큰 효율성의 정량적 분석

`LLM_CODE_GENERATION_ANALYSIS.md` 섹션 3에서 확인된 원칙: 토큰이 적을수록 컨텍스트 윈도우를 효율적으로 사용하고, LLM 정확도가 높아진다.

실제 게임 코드 비교 (game-domain-keywords.md의 예시를 기준으로):

**Approach B (do/then/end) -- 약 45 토큰의 구문 오버헤드:**
```
entity Player do
    has Sprite("hero.png")
    on update(dt: f32) do
        match self.state
            is Idle then
                if input.pressed("move") then
                    self.state = Running(200.0)
                end
            end
        end
    end
end
```

**순수 들여쓰기 -- 0 토큰의 구문 오버헤드:**
```
entity Player
    has Sprite("hero.png")
    on update(dt: f32)
        match self.state
            Idle
                if input.pressed("move")
                    self.state = Running(200.0)
```

두 번째 코드가 첫 번째보다 약 **40% 적은 토큰**을 사용하면서 동일한 의미를 전달한다. 이 차이는 큰 게임 프로젝트에서 컨텍스트 윈도우 활용에 유의미한 영향을 준다.

---

#### 근거 6: 들여쓰기 오류율의 실제 데이터

"들여쓰기 오류가 위험하다"는 주장에 대한 실제 데이터:

- IndentationError: 전체 오류의 **0.25%** (12,837개 오류 중 32건)
- 이는 **가장 드문** 오류 유형이다
- NameError(22.71%)의 1/90, SyntaxError(5.76%)의 1/23

반면 `end` 불일치 오류는 SyntaxError 카테고리에 속하며, Lua/Ruby 코드에서 발생하는 구문 오류의 상당 부분을 차지한다. 즉, `end`를 추가하면 들여쓰기 오류(0.25%)를 방지하는 대신, `end` 불일치 오류(SyntaxError의 일부)를 **새롭게 도입**하는 것이다.

**`end`는 오류를 줄이는 것이 아니라 오류 유형을 교체하는 것이다.**

더 중요한 것: 들여쓰기 오류든 `end` 불일치 오류든 **컴파일러가 잡을 수 있다.** 차이는:
- 들여쓰기 오류: "의도와 다른 블록에 코드가 배치됨" → 컴파일러가 잡을 수도 있고, silent bug가 될 수도 있음
- `end` 불일치: "닫히지 않은 블록" → 컴파일러가 항상 잡음

그러나 Vibe의 컴파일러가 들여쓰기 변경에 대해 **경고(warning)** 를 발행하면 (예: "이 줄의 들여쓰기가 이전 블록과 일치하지 않습니다"), silent bug 문제도 해결된다. 이것은 언어 설계가 아니라 컴파일러 구현의 문제다.

---

#### 근거 7: 복사-붙여넣기 문제의 현실적 평가

"들여쓰기가 손실되면 코드가 깨진다"는 우려가 있다. 그러나:

1. **현대 도구들은 들여쓰기를 보존한다**: VS Code, GitHub, 대부분의 채팅 플랫폼에서 코드 블록(`\`\`\``)은 들여쓰기를 보존한다.

2. **들여쓰기가 손실되는 환경은 `end`도 보존하지 못한다**: 만약 서식이 완전히 파괴되는 환경(이메일, 메모장)이라면, `end`가 있어도 코드 가독성은 이미 파괴된 상태다.

3. **Python이 이 문제를 30년간 겪어왔다**: Python은 세계에서 가장 많이 사용되는 언어 중 하나이며, 들여쓰기 기반 구문이 "복사-붙여넣기에 취약하다"는 것이 채택을 저해하지 않았다.

4. **`vibefmt` 강제 포매터**: Go의 `gofmt`처럼, Vibe에 강제 포매터를 도입하면 서식 불일치 문제가 원천 차단된다. 붙여넣기 후 `vibefmt`를 실행하면 됨.

---

### 2.3 `do`/`then`에 대한 최종 판결

**키워드 목록에서 제거한다.**

이유를 다시 정리하면:

| 질문 | 답 |
|------|-----|
| `do`/`then`이 파서에 필요한가? | 아니다. 들여쓰기만으로 블록 경계를 결정한다. |
| `do`/`then`이 LLM 정확도를 높이는가? | 아니다. 오히려 Lua/Ruby 패턴과의 혼동을 유발한다. |
| `do`/`then`이 가독성을 높이는가? | 미미하다. 들여쓰기 자체가 이미 블록 구조를 시각적으로 전달한다. |
| `do`/`then`이 기존 언어와 일치하는가? | `do`/`then` + 들여쓰기(no `end`)는 어떤 기존 언어에도 없는 조합이다. |
| `do`/`then` 대신 키워드 슬롯을 더 가치 있게 사용할 수 있는가? | 그렇다. `await`, `yield`, `import` 등. |

### 2.4 콜론(`:`)에 대한 최종 판결

**사용하지 않는다.**

이유:
1. 콜론은 이미 타입 어노테이션에 사용된다 (`let x: i32`, `fn update(dt: f32)`). 블록 시작에도 사용하면 이중 의미가 발생한다.
2. Python에서도 콜론은 "필요한 것인가?"에 대한 논란이 있다. Vibe는 이 기회에 콜론을 제거한다.
3. LLM이 함수 시그니처 끝에 콜론을 빠뜨리는 것은 흔한 오류다. 콜론이 없으면 이 오류 카테고리 자체가 사라진다.

---

## 3. 최종 구문 형태

### 3.1 제어 흐름

```
if health > 0
    move(speed * dt)
elif health == 0
    respawn()
else
    die()

for enemy in enemies
    enemy.update(dt)

while is_alive
    process_input()
    update_physics(dt)
```

### 3.2 선언

```
fn update(dt: f32)
    let mut vel: f32 = 0.0
    vel = vel + gravity * dt

fn damage(amount: i32) -> i32
    return max(health - amount, 0)

struct Vec2
    x: f32
    y: f32

enum PlayerState
    Idle
    Running(speed: f32)
    Jumping(velocity: f32)
    Dead

trait Drawable
    fn draw(self, renderer: Renderer)

impl Drawable for Player
    fn draw(self, renderer: Renderer)
        renderer.draw_sprite(self.sprite, self.pos)
```

### 3.3 패턴 매칭

```
match state
    Idle
        play_animation("idle")
    Running(speed)
        move(speed * dt)
        play_animation("run")
    Jumping(vel)
        apply_gravity(vel, dt)
    Dead
        show_game_over()
```

`match` arm에서 `then`을 사용하지 않는다. 패턴 뒤에 바로 들여쓰기 블록이 온다. 이것은 Python의 `match/case` 문과 동일한 구조다:

```python
# Python 3.10+
match state:
    case Idle():
        play_animation("idle")
    case Running(speed=s):
        move(s * dt)
```

Vibe에서는 `case` 대신 패턴 자체가 arm을 시작하고, `:` 대신 들여쓰기가 블록을 구분한다. `then`이 제거됨으로써 match arm의 구문이 **더 깔끔**해진다.

### 3.4 한 줄 match arm (선택적)

```
match direction
    Up    -> move(0, -1)
    Down  -> move(0, 1)
    Left  -> move(-1, 0)
    Right -> move(1, 0)
```

단일 표현식 arm은 `->` 연산자로 한 줄에 작성할 수 있다. 이것은 `then`의 역할을 하지만 **키워드가 아니라 연산자**이며, `->` 는 이미 반환 타입 표시에 사용되는 연산자이므로 추가 비용이 없다. 이 기능은 선택적이며, 여러 줄 블록은 항상 들여쓰기를 사용한다.

### 3.5 게임 도메인 구문

```
entity Player
    has Sprite("hero.png")
    has Body(dynamic)
    has Collider(box)

    speed: f32 = 200.0
    health: i32 = 100

    signal damaged(amount: i32)
    signal died

    on update(dt: f32)
        let dir = input.axis("left", "right")
        self.velocity.x = dir * self.speed

    on collide(other: Entity, col: Collision)
        if other is Enemy
            self.health = self.health - 10

    fn take_damage(amount: i32)
        self.health = self.health - amount
        self.damaged.emit(amount)
        if self.health <= 0
            self.died.emit()

scene Game(level: i32 = 1)
    on enter
        let player = spawn(Player, at: vec2(100, 200))
        load_map("level_{level}.tmx")

    on update(dt: f32)
        if all_enemies_dead()
            go(Game, level: level + 1)

    on input(key: Key)
        match key
            Escape
                go(Menu)
```

### 3.6 전체 게임 예시

```
# types.vibe

struct Vec2
    x: f32
    y: f32

enum PlayerState
    Idle
    Running(speed: f32)
    Jumping(velocity: f32)
    Attacking(frame: i32)
    Dead

# player.vibe

entity Player
    has Sprite("hero.png")
    has Body(dynamic)
    has Collider(box)

    state: PlayerState = PlayerState.Idle
    health: i32 = 100
    speed: f32 = 200.0
    jump_force: f32 = 400.0

    signal damaged(amount: i32)
    signal died

    on update(dt: f32)
        self.state = match self.state
            Idle
                if input.axis("left", "right") != 0.0
                    PlayerState.Running(speed: self.speed)
                elif input.just_pressed("jump") and self.is_on_floor()
                    PlayerState.Jumping(velocity: -self.jump_force)
                else
                    PlayerState.Idle
            Running(speed)
                self.velocity.x = input.axis("left", "right") * speed
                if not input.pressed("move")
                    PlayerState.Idle
                elif input.just_pressed("jump") and self.is_on_floor()
                    PlayerState.Jumping(velocity: -self.jump_force)
                else
                    PlayerState.Running(speed: speed)
            Jumping(velocity)
                let new_vel: f32 = velocity + GRAVITY * dt
                if self.is_on_floor()
                    PlayerState.Idle
                else
                    PlayerState.Jumping(velocity: new_vel)
            Dead
                PlayerState.Dead

    on collide(other: Entity, col: Collision)
        if other is Enemy
            if col.direction == Direction.Bottom
                destroy(other)
                self.velocity.y = -self.jump_force * 0.5
            else
                self.take_damage(10)

    fn take_damage(amount: i32)
        self.health = self.health - amount
        self.damaged.emit(amount)
        if self.health <= 0
            self.state = PlayerState.Dead
            self.died.emit()

# game.vibe

scene Game(level: i32 = 1)
    let mut score: i32 = 0

    on enter
        load_map("level_{level}.tmx")
        let player = spawn(Player, at: vec2(100, 200))
        player.died.connect(fn()
            go(GameOver, final_score: score))

    on update(dt: f32)
        if all_dead("Enemy") and all_dead("Coin")
            go(Game, level: level + 1)

scene Menu
    on enter
        spawn(Title, at: vec2(400, 200))

    on input(key: Key)
        match key
            Enter -> go(Game)
            Escape -> quit()

scene GameOver(final_score: i32 = 0)
    on enter
        spawn(Text, at: vec2(400, 200), content: "Game Over!")
        spawn(Text, at: vec2(400, 260), content: "Score: {final_score}")

    on input(key: Key)
        match key
            Enter -> go(Menu)
```

---

## 4. 트랜스파일링 전략

Vibe → Lua 트랜스파일러는 들여쓰기를 분석하여 `do`/`then`/`end`를 **자동 삽입**한다.

```
-- Vibe 소스
if health > 0
    move(speed * dt)
else
    die()

-- Lua 출력
if health > 0 then
    move(speed * dt)
else
    die()
end
```

이것은 Python → 다른 언어 트랜스파일러가 사용하는 표준 기법이다. 들여쓰기 기반 언어를 블록 구분자 기반 언어로 변환하는 것은 **trivial한 작업**이다. 역방향(블록 구분자 → 들여쓰기)이 어려운 것이지, 순방향은 간단하다.

트랜스파일러 구현:
1. 들여쓰기 수준 추적 (스택 기반)
2. 들여쓰기 증가 = 블록 시작. 해당 키워드에 맞는 Lua 블록 시작자 삽입 (`then`, `do`, 또는 없음)
3. 들여쓰기 감소 = 블록 종료. `end` 삽입
4. `else`, `elif` = 현재 블록 종료 + 새 블록 시작

이 알고리즘은 Python 파서와 동일하며, 구현 복잡도가 매우 낮다.

---

## 5. 반론에 대한 대응

### 반론 1: "LLM_CODE_GENERATION_ANALYSIS.md에서 `end`가 가장 높다고 했는데?"

그 문서의 평가표(섹션 6.2)를 다시 보면:

```
| 방식 | LLM 친화도 | 이유 |
|------|-----------|------|
| 중괄호 {} | 중간 | 매칭이 깊은 중첩에서 오류 발생 |
| 들여쓰기 | 낮음 | LLM이 공백 수를 정확히 세는 것은 매우 어려움 |
| end 키워드 | 높음 | 명시적 텍스트 토큰 |
```

이 평가에는 두 가지 문제가 있다:

1. **"LLM이 공백 수를 정확히 세는 것은 매우 어려움"이라는 전제가 데이터와 모순된다.** 같은 문서의 섹션 1.1에서 IndentationError는 0.25%로 가장 드문 오류라고 보고했다. 0.25%를 "매우 어려움"으로 평가하는 것은 과장이다.

2. **`end` 키워드의 장점을 과대평가했다.** "명시적 텍스트 토큰"이라는 장점은, `end`가 **올바른 위치에 올바른 개수로** 생성되어야만 성립한다. 깊은 중첩에서 `end`의 개수와 위치를 맞추는 것은 LLM에게 또 다른 도전이다.

결론: 그 문서의 평가는 **단일 블록 수준에서의 분석**이었으며, **중첩된 실제 게임 코드**에서의 이중 부담을 고려하지 않았다. `core-keywords.md`에서 이 분석을 재검토하여 들여쓰기 방식으로 변경한 것이 올바르다.

### 반론 2: "복사-붙여넣기에서 들여쓰기가 깨지면?"

대응:
1. `vibefmt` 강제 포매터로 해결 (붙여넣기 후 자동 포매팅)
2. 현대 코드 편집기/플랫폼은 들여쓰기를 보존한다
3. Python이 이 "문제"와 함께 30년간 번성했다
4. `end`가 있어도 들여쓰기가 깨지면 가독성이 파괴된다

### 반론 3: "`then` 없이 match arm이 모호하지 않나?"

```
match state
    Idle
        play_animation("idle")
    Running(speed)
        move(speed * dt)
```

여기서 `Idle`이 패턴인지 함수 호출인지 어떻게 구분하는가?

대응: **들여쓰기로 구분한다.** `match` 키워드 뒤에 오는 블록 내에서, 현재 블록보다 한 단계 들여쓰기된 줄은 패턴이다. 그 패턴보다 한 단계 더 들여쓰기된 줄은 해당 arm의 본문이다. 이것은 Python의 `match/case`와 동일한 규칙이다.

파서 관점에서:
1. `match` 키워드 → match 문 시작
2. 들여쓰기 +1 → arm 패턴 시작
3. 들여쓰기 +2 → arm 본문
4. 들여쓰기 +1 → 다음 arm 패턴
5. 들여쓰기 +0 (또는 이하) → match 문 종료

이 규칙은 결정론적이며 모호성이 없다.

### 반론 4: "Lua로 트랜스파일하니까 `end`가 자연스럽지 않나?"

대응: 트랜스파일 타겟이 언어 설계를 결정해서는 안 된다. C는 어셈블리로 컴파일되지만 어셈블리 문법을 따르지 않는다. TypeScript는 JavaScript로 컴파일되지만 JavaScript 문법의 상위 집합이지 동일하지 않다. Python도 C로 구현되어 있지만 C 문법과 무관하다.

Vibe → Lua 트랜스파일은 구현 세부사항이다. Vibe의 문법은 **사용자(LLM + 인간)에게 최적화**되어야 하며, 타겟 언어에 최적화되어서는 안 된다.

---

## 6. `core-keywords.md`와의 정합성 확인

이 결정은 `core-keywords.md`의 결정과 **완전히 정합**한다:

- 섹션 3.3: `then`, `end`, `do` 모두 "의도적으로 키워드에서 제외한 제어 구문"으로 분류됨
- 섹션 4: "들여쓰기 방식으로 변경" 결정의 상세 근거 제시
- 22개 키워드 목록에 `then`, `end`, `do` 미포함

**`type-system-keywords.md`와 `game-domain-keywords.md`의 예시 코드가 업데이트되어야 한다.** 이 두 문서에서 사용된 `end`, `then`, `do`, `is ... then` 구문을 모두 순수 들여쓰기 구문으로 변경해야 한다.

---

## 7. 요약

| 항목 | 결정 |
|------|------|
| 블록 구분 방식 | **순수 들여쓰기** (Python과 동일) |
| `do` 키워드 | **제거** (키워드 목록에서 제외) |
| `then` 키워드 | **제거** (키워드 목록에서 제외) |
| `end` 키워드 | **제거** (키워드 목록에서 제외) |
| `:` (콜론) 블록 시작 | **사용하지 않음** (타입 어노테이션 전용) |
| 블록 시작 신호 | **없음** -- 줄 끝에서 다음 줄의 들여쓰기 증가가 블록 시작 |
| 블록 종료 신호 | **없음** -- 들여쓰기 감소가 블록 종료 |
| match arm 구분 | **들여쓰기** (패턴 → 들여쓰기 증가 → 본문) |
| 한 줄 match arm | `->` 연산자 (선택적) |
| 키워드 예산 절감 | **3개** (`do`, `then`, `end`) → 다른 기능에 재배분 가능 |
| 트랜스파일링 | 트랜스파일러가 `do`/`then`/`end`를 자동 삽입 |
| 서식 도구 | `vibefmt` 강제 포매터 도입 |

**최종 키워드 수: 22개** (core-keywords.md 기준, 블록 구분자 키워드 0개)
