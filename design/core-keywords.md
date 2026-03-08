# Vibe 핵심 언어 키워드 설계서

> 이 문서는 Vibe 언어의 **핵심 언어 키워드**만 다룬다.
> 게임 도메인 키워드(entity, component, system, scene, signal 등)는 별도 에이전트가 담당한다.
> 총 키워드 예산 20-30개 중, 본 문서에서 **22개의 핵심 언어 키워드**를 확정한다.

---

## 0. 설계 판단 기준

모든 키워드 결정에 다음 기준을 적용했다:

| 기준 | 설명 |
|------|------|
| **비모호성** | 하나의 키워드 = 정확히 하나의 의미 |
| **LLM 토큰 효율** | 자연어 단어를 우선, BPE 토크나이저에서 단일 토큰으로 처리 |
| **교차 언어 전이** | Python/Lua/Go/Rust 중 2개 이상에서 동일 의미로 사용된 단어 우선 |
| **필수성** | 함수로 대체 가능하면 키워드에서 제외 |

---

## 1. 확정 키워드 목록 (22개)

### 카테고리 A: 선언 (3개)

---

#### 1. `let` -- 변수 선언 (불변)

**하는 일:** 불변 변수를 선언한다. 한 번 바인딩되면 재할당 불가.

**왜 `let`인가:**
- `var`(GDScript/Swift)는 "가변"을 암시 -- Vibe는 불변이 기본이므로 부적합
- `const`(JS)는 "상수"를 암시 -- 컴파일 타임 상수와 혼동될 수 있음
- `let`은 Rust/Swift/JS에서 "값 바인딩"의 의미로 가장 널리 사용됨
- LLM 훈련 데이터에서 `let x: Type = value` 패턴이 매우 풍부함

**코드 예시:**
```
let speed: f32 = 200.0
let name: str = "Player"
let items: List[Item] = []
```

**참조 언어:** Rust, Swift, JavaScript (ES6)

---

#### 2. `mut` -- 가변 변수 선언

**하는 일:** 가변 변수를 선언한다. `let mut`으로 사용하여 재할당 가능한 바인딩을 만든다.

**왜 `mut`인가:**
- `var`를 별도 키워드로 두면 `let` vs `var` 선택지가 생김 -- "한 가지 방법" 원칙 위반
- `let mut`은 Rust에서 검증된 패턴: "기본은 불변, 명시적으로 가변"
- LLM이 "가변이 필요한가?"를 항상 의식적으로 판단하게 강제
- `mut`은 3글자로 짧고, `mutable`의 축약으로 의미가 명확

**코드 예시:**
```
let mut health: i32 = 100
let mut position: Vec2 = vec2(0, 0)
health = health - 10

let speed: f32 = 200.0
speed = 300.0  # 컴파일 에러! let은 불변
```

**참조 언어:** Rust

**`var` 대신 `let mut`을 선택한 이유:**

| 대안 | 문제점 |
|------|--------|
| `var` (별도 키워드) | `let` vs `var` 두 가지 선언 방식 -- LLM이 매번 선택해야 함 |
| `let` 하나로 다 가변 | 불변성의 가치를 포기 -- 실수로 인한 버그 증가 |
| `const` + `let` | `const`는 "컴파일 타임 상수"와 혼동 |

---

#### 3. `fn` -- 함수 선언

**하는 일:** 함수를 선언한다.

**왜 `fn`인가:**
- `def`(Python/Ruby)는 "define"의 축약 -- 범용적이지만 3글자
- `func`(Go/Swift)는 4글자
- `fn`은 Rust에서 검증된 2글자 키워드 -- 가장 짧고 명확
- `function`(JS)은 8글자로 토큰 비효율
- 게임 코드에서 함수 선언은 매우 빈번 -- 짧을수록 좋음
- LLM 관점: `fn` 다음에는 반드시 함수 이름이 온다는 패턴이 100% 예측 가능

**코드 예시:**
```
fn update(dt: f32)
    let mut vel: f32 = 0.0
    vel = vel + gravity * dt

fn damage(amount: i32) -> i32
    return max(health - amount, 0)
```

**참조 언어:** Rust

**`def` 대신 `fn`을 선택한 이유:**

RESEARCH에서 `def`를 제안했으나 재검토 결과 `fn`으로 변경한다:
- `def`는 Python에서 "define"이라는 범용 의미 -- `def` 뒤에 클래스, 제너레이터 등 다양한 것이 올 수 있는 맥락이 있음
- `fn`은 **오직 함수 선언만을 의미** -- 비모호성 원칙에 부합
- Vibe는 들여쓰기 기반이므로 Python과 구문이 유사함 -- `def`를 쓰면 Python과 혼동될 수 있음
- Rust의 `fn`은 게임 개발자(Bevy, Macroquad 사용자)에게 이미 익숙

---

### 카테고리 B: 제어 흐름 (8개)

---

#### 4. `if` -- 조건 분기

**하는 일:** 조건이 참일 때 블록을 실행한다.

**왜 `if`인가:**
- 사실상 모든 프로그래밍 언어의 보편적 키워드
- 대안이 없음. 이것을 바꿀 이유가 없음

**코드 예시:**
```
if health <= 0
    die()
```

**참조 언어:** 모든 언어 공통

---

#### 5. `elif` -- 추가 조건 분기

**하는 일:** 앞선 `if`/`elif`가 거짓일 때 추가 조건을 검사한다.

**왜 `elif`인가 (vs `else if`, `elsif`, `or if`):**
- `else if` (두 단어): 키워드가 아니라 `else` + `if`의 조합 -- 들여쓰기 기반에서 파싱이 복잡해짐 (else 블록 안에 if가 중첩되는 건지, elif인 건지 모호)
- `elsif` (Ruby): 흔하지 않은 철자, LLM 훈련 데이터에서 빈도 낮음
- `or if`: 직관적이지만 기존 언어에서 전례 없음 -- 교차 전이 불가
- `elif`는 Python/GDScript에서 사용 -- LLM 훈련 데이터 극대화
- 단일 토큰으로 처리됨 (BPE에서 `elif`는 하나의 토큰)

**코드 예시:**
```
if score >= 100
    rank = "S"
elif score >= 80
    rank = "A"
elif score >= 60
    rank = "B"
else
    rank = "C"
```

**참조 언어:** Python, GDScript

---

#### 6. `else` -- 대안 분기

**하는 일:** 앞선 `if`/`elif`가 모두 거짓일 때 실행되는 블록.

**코드 예시:** (위의 `elif` 예시 참조)

**참조 언어:** 모든 언어 공통

---

#### 7. `match` -- 패턴 매칭

**하는 일:** 값을 여러 패턴과 비교하여 분기한다. 완전성 검사(exhaustiveness check)를 강제한다.

**왜 `match`인가 (vs `switch`, `when`):**
- `switch`(C/Go/JS): 폴스루(fallthrough) 의미론과 결합되어 있어 LLM이 `break` 누락 실수를 자주 함
- `when`(Kotlin): 직관적이지만 게임 이벤트의 "when"과 혼동 가능
- `match`는 Rust/Python 3.10에서 "패턴 매칭"의 표준 키워드로 자리잡음
- 완전성 검사와 자연스럽게 결합되는 의미

**코드 예시:**
```
match state
    Idle
        play_animation("idle")
    Running(speed)
        move(speed * dt)
    Jumping(vel)
        apply_gravity(vel, dt)
    Dead
        # 모든 variant를 처리해야 컴파일 통과
```

**참조 언어:** Rust, Python 3.10+

---

#### 8. `for` -- 반복 (이터레이션)

**하는 일:** 컬렉션의 각 요소에 대해 블록을 반복 실행한다. **`for..in` 형태만 허용**. C-style `for(;;)`는 없음.

**왜 `for`인가:**
- 보편적 키워드, 대안 불필요
- **`while`과 병합하지 않는 이유:** `for`은 "유한한 컬렉션 순회", `while`은 "조건이 참인 동안 반복" -- 의미가 근본적으로 다름. 하나로 합치면 LLM이 의도를 파악하기 어려워짐

**코드 예시:**
```
for enemy in enemies
    enemy.update(dt)

for i in range(10)
    spawn_coin(i * 32, 0)
```

**참조 언어:** Python, Go, Rust

---

#### 9. `in` -- 소속/이터레이션 지시자

**하는 일:** `for` 루프에서 이터레이션 대상을 지정한다. 오직 `for..in` 구문에서만 사용.

**왜 `in`인가:**
- Python/Rust/Go의 `for..in` 패턴이 LLM에게 가장 익숙
- `of`(JS의 `for..of`)는 제네릭 타입 표기(`List of Item`)와 충돌 가능성
- `in`은 단일 용도: `for x in collection` -- 비모호

**`in`을 멤버십 테스트(`x in list`)에도 사용할 것인가?**
아니다. 멤버십 테스트는 `list.contains(x)` 메서드로 처리한다. `in`은 오직 `for` 루프 전용이다. 하나의 키워드 = 하나의 의미 원칙.

**코드 예시:**
```
for item in inventory
    item.use()
```

**참조 언어:** Python, Rust, Go

---

#### 10. `while` -- 조건 반복

**하는 일:** 조건이 참인 동안 블록을 반복 실행한다.

**왜 `for`와 별도로 두는가:**
- `for`는 "이 컬렉션의 모든 요소를 순회해라" (유한성이 암시됨)
- `while`은 "이 조건이 참인 동안 계속해라" (무한 가능성이 암시됨)
- 게임에서 `while`의 주 용도: 게임 루프 대기, 코루틴 내 반복 등
- 두 키워드의 의도가 다르므로 LLM이 올바른 것을 선택하기 쉬움

**`loop` 키워드가 필요한가?**
아니다. `while true`로 무한 루프를 표현한다. 별도 `loop` 키워드는 불필요한 키워드 추가.

**코드 예시:**
```
while is_alive
    process_input()
    update_physics(dt)

# 무한 루프
while true
    wait(1.0)
    spawn_enemy()
```

**참조 언어:** Python, Go, Rust, Lua, GDScript

---

#### 11. `break` -- 루프 탈출

**하는 일:** 현재 루프(`for` 또는 `while`)를 즉시 종료한다.

**왜 `break`인가:**
- 사실상 모든 언어의 표준 키워드
- 대안(`exit`, `stop`)은 다른 의미와 충돌 가능
- `break`는 루프 문맥에서만 유효 -- 비모호

**코드 예시:**
```
for enemy in enemies
    if enemy.is_boss
        target = enemy
        break
```

**참조 언어:** 모든 언어 공통

---

#### 12. `continue` -- 다음 반복으로 건너뛰기

**하는 일:** 현재 반복의 나머지를 건너뛰고 다음 반복으로 진행한다.

**왜 `continue`인가 (vs `skip`, `next`):**
- `skip`: 직관적이지만 기존 언어에서 전례 없음
- `next` (Ruby): "다음 프레임"이라는 게임 도메인 용어와 충돌 가능
- `continue`는 C/Python/Go/Rust/Java 등 대부분의 언어에서 표준
- LLM이 가장 정확하게 사용하는 키워드

**코드 예시:**
```
for entity in entities
    if not entity.is_active
        continue
    entity.update(dt)
```

**참조 언어:** Python, Go, Rust, C

---

#### 13. `return` -- 함수 반환

**하는 일:** 함수에서 값을 반환하고 함수 실행을 종료한다.

**왜 `return`인가:**
- 보편적 키워드, 대안 불필요
- **암묵적 반환(마지막 표현식이 반환값)을 허용하지 않는 이유:** LLM이 "이 함수가 값을 반환하는가?"를 코드 끝까지 읽지 않고도 판단할 수 있어야 함. `return`이 있으면 반환, 없으면 반환 없음 -- 100% 명시적.

**코드 예시:**
```
fn add(a: i32, b: i32) -> i32
    return a + b

fn greet(name: str)
    print("Hello, " + name)
    # return 없음 = 반환값 없음
```

**참조 언어:** 모든 언어 공통

---

### 카테고리 C: 불리언 연산자 (3개)

---

#### 14. `and` -- 논리곱

**하는 일:** 두 불리언 표현식이 모두 참일 때 참을 반환한다. 단락 평가(short-circuit) 적용.

**왜 `and`인가 (vs `&&`):**
- `&&`는 기호 2개 -- BPE 토크나이저에서 비효율적
- `and`는 자연어 그 자체 -- LLM의 자연어 이해 능력이 코드 생성에 직접 전이
- Python/Lua/GDScript에서 `and` 사용 -- 충분한 훈련 데이터

**코드 예시:**
```
if is_alive and has_weapon
    attack(target)
```

**참조 언어:** Python, Lua, GDScript

---

#### 15. `or` -- 논리합

**하는 일:** 두 불리언 표현식 중 하나라도 참이면 참을 반환한다. 단락 평가 적용.

**코드 예시:**
```
if is_invincible or health > 0
    continue_game()
```

**참조 언어:** Python, Lua, GDScript

---

#### 16. `not` -- 논리 부정

**하는 일:** 불리언 값을 반전시킨다.

**왜 `not`인가 (vs `!`):**
- `!`는 `!=`와 시각적으로 혼동 가능 -- 특히 `if !x != y` 같은 표현에서
- `not`은 영어 그 자체: `if not is_dead` → "if not is dead" → 자연어로 읽힘
- Python/Lua에서 `not` 사용

**코드 예시:**
```
if not is_dead
    update(dt)
```

**참조 언어:** Python, Lua, GDScript

---

### 카테고리 D: 타입 관련 (3개)

---

#### 17. `enum` -- 열거형 선언

**하는 일:** 데이터를 가질 수 있는 열거형(tagged union/sum type)을 선언한다.

**왜 `enum`인가:**
- 게임에서 상태 기계(FSM)는 가장 핵심적인 패턴 -- `enum + match`로 완벽하게 표현
- Rust에서 검증된 데이터 보유 enum + 완전성 검사의 조합
- `enum`은 C/Java/Rust/TypeScript 등에서 보편적

**코드 예시:**
```
enum PlayerState
    Idle
    Running(speed: f32)
    Jumping(velocity: f32, air_time: f32)
    Attacking(frame: i32)
    Dead
```

**참조 언어:** Rust (데이터 보유 variant), GDScript (enum 키워드)

---

#### 18. `struct` -- 구조체 선언

**하는 일:** 이름이 있는 데이터 묶음(레코드)을 선언한다. 메서드 없음 -- 순수 데이터 컨테이너.

**왜 `struct`인가 (vs `type`, `record`, `data`):**
- `type`(Go): 너무 범용적 -- 타입 별칭, 인터페이스 등 여러 의미
- `record`(Java): 덜 보편적
- `data`(Haskell): 게임에서 "게임 데이터"와 혼동
- `struct`는 C/Go/Rust에서 "순수 데이터 묶음"의 표준 키워드
- 게임 개발자(Unity C#, Bevy Rust)에게 가장 익숙

**코드 예시:**
```
struct Vec2
    x: f32
    y: f32

struct Hitbox
    offset: Vec2
    size: Vec2
    is_active: bool
```

**참조 언어:** Go, Rust, C

---

#### 19. `trait` -- 인터페이스/행동 계약 선언

**하는 일:** 타입이 구현해야 하는 메서드 집합을 선언한다.

**왜 `trait`인가 (vs `interface`, `protocol`):**
- `interface`(Go/Java): 9글자로 긺, Go의 암묵적 구현과 혼동 가능
- `protocol`(Swift): 8글자, 네트워크 프로토콜과 혼동
- `trait`는 Rust에서 "행동의 명시적 계약"으로 가장 정확한 의미
- 5글자로 적절한 길이
- Vibe의 trait는 **명시적 구현 선언** 필요 (Go의 암묵적 구현이 아님) -- `impl Trait for Type` 패턴

**코드 예시:**
```
trait Drawable
    fn draw(self, renderer: Renderer)

trait Updatable
    fn update(self, dt: f32)

# 구현
impl Drawable for Player
    fn draw(self, renderer: Renderer)
        renderer.draw_sprite(self.sprite, self.pos)
```

**참조 언어:** Rust

---

### 카테고리 E: 기타 필수 구문 (5개)

---

#### 20. `impl` -- trait 구현 선언

**하는 일:** 특정 타입이 특정 trait를 구현함을 선언한다.

**왜 `impl`인가:**
- `impl Trait for Type` 구문은 "누가 무엇을 구현하는가"가 100% 명시적
- Rust에서 검증된 패턴
- `extends`(GDScript/Java)는 상속을 암시 -- Vibe에는 상속이 없음
- `implements`(Java)는 10글자로 너무 긺
- `impl`은 4글자로 짧고 의미 명확

**코드 예시:**
```
impl Updatable for Enemy
    fn update(self, dt: f32)
        match self.state
            Patrol
                self.patrol_logic(dt)
            Chase(target)
                self.chase_logic(target, dt)
```

**참조 언어:** Rust

---

#### 21. `self` -- 현재 인스턴스 참조

**하는 일:** trait 구현 내의 메서드에서 현재 인스턴스를 참조한다.

**왜 `self`인가 (vs `this`, 암묵적):**
- `this`(JS/Java/C++): JavaScript의 동적 바인딩 문제로 LLM 오류가 빈번
- 암묵적 자기 참조(Ruby): LLM이 "이 변수가 로컬인가 인스턴스 필드인가" 혼동
- `self`는 Python/Rust에서 **명시적 첫 번째 매개변수** -- 100% 정적으로 결정
- 바인딩 규칙이 단순: `self`는 항상 해당 메서드가 호출된 인스턴스

**`self`는 키워드인가 관례인가?**
키워드다. Python처럼 "아무 이름이나 가능"하면 LLM이 `self` vs `this` vs `me` 중 선택해야 한다. Vibe에서는 `self`만 허용.

**코드 예시:**
```
impl Drawable for Player
    fn draw(self, renderer: Renderer)
        renderer.draw_sprite(self.sprite, self.pos)
```

**참조 언어:** Rust, Python

---

#### 22. `none` -- 값 없음 리터럴

**하는 일:** Option 타입의 "값 없음" 상태를 나타낸다. 일반 타입에는 할당 불가 -- `Option[T]` 타입에서만 사용.

**왜 `none`인가 (vs `nil`, `null`, `None`):**
- `null`(Java/JS): "널 포인터 예외"의 부정적 유산, 모든 타입에 할당 가능한 것으로 오해
- `nil`(Lua/Go): `null`과 동일한 문제
- `None`(Python): 대문자 시작이라 다른 타입과 혼동
- `none`은 소문자로 일관되며, "값이 없음"이라는 의미가 명확
- Option[T] 전용이므로 null 안전성을 언어 수준에서 강제

**코드 예시:**
```
let target: Option[Entity] = none

match find_enemy(pos)
    Some(enemy)
        attack(enemy)
    none
        patrol()
```

**참조 언어:** Rust의 `None` (소문자로 변경)

---

## 2. 확정 키워드 요약 테이블

| # | 키워드 | 카테고리 | 의미 | 참조 |
|---|--------|----------|------|------|
| 1 | `let` | 선언 | 불변 변수 선언 | Rust, Swift |
| 2 | `mut` | 선언 | 가변 표시자 (`let mut`) | Rust |
| 3 | `fn` | 선언 | 함수 선언 | Rust |
| 4 | `if` | 제어흐름 | 조건 분기 | 공통 |
| 5 | `elif` | 제어흐름 | 추가 조건 분기 | Python |
| 6 | `else` | 제어흐름 | 대안 분기 | 공통 |
| 7 | `match` | 제어흐름 | 패턴 매칭 | Rust |
| 8 | `for` | 제어흐름 | 컬렉션 이터레이션 | Python, Rust |
| 9 | `in` | 제어흐름 | for 루프 대상 지시 | Python, Rust |
| 10 | `while` | 제어흐름 | 조건 반복 | 공통 |
| 11 | `break` | 제어흐름 | 루프 탈출 | 공통 |
| 12 | `continue` | 제어흐름 | 다음 반복 건너뛰기 | 공통 |
| 13 | `return` | 제어흐름 | 함수 반환 | 공통 |
| 14 | `and` | 불리언 | 논리곱 | Python, Lua |
| 15 | `or` | 불리언 | 논리합 | Python, Lua |
| 16 | `not` | 불리언 | 논리 부정 | Python, Lua |
| 17 | `enum` | 타입 | 열거형 선언 | Rust |
| 18 | `struct` | 타입 | 구조체 선언 | Go, Rust |
| 19 | `trait` | 타입 | 인터페이스 선언 | Rust |
| 20 | `impl` | 타입 | trait 구현 | Rust |
| 21 | `self` | 기타 | 현재 인스턴스 참조 | Rust, Python |
| 22 | `none` | 기타 | 값 없음 리터럴 | Rust |

---

## 3. 의도적으로 제외한 것들

### 3.1 키워드가 아니라 리터럴인 것

| 항목 | 처리 방식 | 이유 |
|------|-----------|------|
| `true` | 불리언 리터럴 (키워드 아님) | `1`, `3.14`처럼 리터럴 값. 예약어이지만 키워드 예산에 포함하지 않음 |
| `false` | 불리언 리터럴 (키워드 아님) | 동일 |

`true`, `false`, `none`은 모두 예약어지만, `none`만 키워드로 분류하는 이유: `none`은 `match` 패턴에서 패턴으로 사용되므로 구문적 역할이 있다. `true`/`false`는 순수 값이다.

### 3.2 키워드 대신 함수/메서드로 처리하는 것

| 항목 | 대안 | 이유 |
|------|------|------|
| `print` | 내장 함수 `print()` | 언어 구문이 아닌 부수 효과 |
| `typeof`/`type` | 내장 함수 `type_of(x)` | 타입 질의는 런타임 함수 |
| `cast`/`as` | 메서드 `x.as_type(T)` 또는 `T.from(x)` | 타입 변환은 함수로 충분 |
| `is` | 메서드 `x.is_type(T)` 또는 match 사용 | `match`로 타입 매칭이 가능하므로 별도 키워드 불필요 |
| `assert` | 내장 함수 `assert(condition, message)` | 디버깅 유틸리티는 함수 |
| `defer` | 내장 함수 `defer(fn)` | 리소스 정리. Go에서는 키워드이나, Vibe에서는 함수로 충분 |
| `await`/`yield` | 게임 도메인 에이전트 담당 | 코루틴은 게임 특화 기능 |
| `spawn`/`destroy` | 게임 도메인 에이전트 담당 | 엔티티 생명주기는 게임 API |
| `import`/`use` | 게임 도메인 에이전트와 협의 필요 | 모듈 시스템은 별도 설계 |
| `pub` | 접근 제어는 네이밍 관례로 | 대문자 시작 = public (Go 스타일), 또는 별도 설계 |

### 3.3 의도적으로 키워드에서 제외한 제어 구문

| 항목 | 이유 |
|------|------|
| `then` | 불필요. 들여쓰기로 블록 시작을 표시. `if condition` 다음에 바로 들여쓰기 블록이 온다. `then`은 Lua/Ruby의 중괄호 대체물인데, 들여쓰기 기반에서는 군더더기. |
| `end` | 불필요. 들여쓰기 기반이므로 블록 종료를 명시할 필요 없음. Python처럼 들여쓰기 감소로 블록 종료. 초기 연구에서 `end`를 제안했으나, 들여쓰기 기반 + `end`는 중복이고 LLM이 들여쓰기와 `end` 둘 다 맞춰야 하는 이중 부담 발생. |
| `do` | 불필요. `for x in list` 다음에 바로 들여쓰기 블록이 시작. `do`는 Lua의 중괄호 대체물. |
| `loop` | `while true`로 대체. 별도 키워드 불필요. |
| `switch` | `match`로 통합. `switch`의 폴스루 의미론은 버그의 온상. |
| `case` | `match` 내에서 패턴은 들여쓰기로 구분. 별도 키워드 불필요. |
| `pass` | 빈 블록에는 주석 `# empty`을 사용하거나 `...`(Ellipsis 리터럴) 사용. 키워드 추가 불필요. |
| `class` | Vibe에는 클래스가 없음. `struct` + `trait` + `impl`로 대체. |
| `try`/`catch`/`throw` | Vibe에는 예외가 없음. `Option`/`Result` + `?` 연산자로 대체. |
| `async`/`await` | 게임 도메인 에이전트 담당. 코루틴 기반으로 설계 예정. |
| `new` | 생성자 함수(`Type.new()` 또는 구조체 리터럴 `Vec2 { x: 0, y: 0 }`)로 대체. |
| `null`/`nil` | `none`으로 통합. 모든 타입에 null이 허용되지 않음. |

---

## 4. `then`/`end`/`do` 제거 결정의 상세 근거

초기 연구(LLM_CODE_GENERATION_ANALYSIS.md)에서는 `end` 키워드 방식을 제안했었다. 그러나 재검토 결과, **들여쓰기 기반으로 변경**한다.

### 4.1 `end` 방식의 문제점

```
# end 방식 -- 키워드 3개 추가 (then, end, do)
if health > 0 then
    for enemy in enemies do
        match enemy.state
            is Idle then
                # ...
            end
        end
    end
end
```

문제:
1. **이중 부담**: LLM이 들여쓰기도 맞추고 `end`도 맞춰야 함
2. **`end` 개수 오류**: 깊은 중첩에서 `end`를 하나 빠뜨리거나 하나 더 넣는 실수
3. **키워드 3개 낭비**: `then`, `end`, `do`가 순수 구문적 목적으로만 존재
4. **토큰 비효율**: 매 블록마다 `end` 토큰이 추가

### 4.2 들여쓰기 방식의 장점

```
# 들여쓰기 방식 -- 추가 키워드 0개
if health > 0
    for enemy in enemies
        match enemy.state
            Idle
                # ...
```

장점:
1. **키워드 3개 절약** -- 22개 vs 25개
2. **Python과 동일한 패턴** -- LLM 훈련 데이터 극대화
3. **시각적으로 깔끔** -- 코드의 의미에 집중
4. **이중 부담 없음** -- 들여쓰기만 맞추면 됨

### 4.3 들여쓰기 오류 우려에 대한 반론

연구 데이터에 따르면:
- Python의 IndentationError는 전체 오류의 **0.25%**에 불과
- 이는 LLM이 들여쓰기를 매우 정확하게 학습했음을 증명
- `end`를 추가해도 들여쓰기 오류가 줄지 않음 -- 오히려 `end` 누락 오류가 추가됨

---

## 5. 구문 미리보기: 22개 키워드로 작성한 게임 코드

```
# ===== 타입 선언 =====

struct Vec2
    x: f32
    y: f32

enum PlayerState
    Idle
    Running(speed: f32)
    Jumping(velocity: f32)
    Dead

trait Updatable
    fn update(self, dt: f32)

trait Drawable
    fn draw(self, r: Renderer)

# ===== 구조체와 trait 구현 =====

struct Player
    pos: Vec2
    state: PlayerState
    health: i32
    sprite: Sprite

impl Updatable for Player
    fn update(self, dt: f32)
        match self.state
            Idle
                if input.pressed("move")
                    self.state = Running(200.0)
            Running(speed)
                self.pos.x = self.pos.x + speed * dt
                if not input.pressed("move")
                    self.state = Idle
            Jumping(vel)
                let new_vel: f32 = vel + GRAVITY * dt
                self.pos.y = self.pos.y + new_vel * dt
                if self.pos.y >= GROUND_Y
                    self.state = Idle
            Dead
                return

impl Drawable for Player
    fn draw(self, r: Renderer)
        r.draw_sprite(self.sprite, self.pos)

# ===== 함수 =====

fn find_nearest_enemy(pos: Vec2, enemies: List[Enemy]) -> Option[Enemy]
    let mut nearest: Option[Enemy] = none
    let mut min_dist: f32 = 999999.0
    for enemy in enemies
        if not enemy.is_alive
            continue
        let dist: f32 = distance(pos, enemy.pos)
        if dist < min_dist
            min_dist = dist
            nearest = Some(enemy)
    return nearest

fn process_combat(player: Player, enemies: List[Enemy])
    match find_nearest_enemy(player.pos, enemies)
        Some(enemy)
            if distance(player.pos, enemy.pos) < ATTACK_RANGE
                let mut dmg: i32 = calculate_damage(player)
                enemy.take_damage(dmg)
        none
            # 적이 없으면 아무것도 하지 않음
            pass

fn calculate_damage(player: Player) -> i32
    match player.state
        Attacking(frame)
            if frame > 3 and frame < 8
                return 25
            else
                return 10
        _
            return 0
```

---

## 6. 키워드 예산 분석

| 할당 | 개수 | 비고 |
|------|------|------|
| 핵심 언어 키워드 (본 문서) | **22개** | 선언 3 + 제어흐름 8 + 불리언 3 + 타입 4 + 기타 4 |
| 게임 도메인 키워드 (별도 에이전트) | **~6-8개 예상** | entity, component, system, scene, signal, emit 등 |
| **합계** | **~28-30개** | 목표 범위 20-30개 내 |

핵심 언어 키워드를 22개로 억제함으로써, 게임 도메인 에이전트에게 **6-8개의 키워드 예산**을 확보해준다.

---

## 7. 연산자 목록 (키워드 아님)

키워드가 아니라 기호 연산자로 처리하는 것들:

| 연산자 | 의미 | 비고 |
|--------|------|------|
| `+`, `-`, `*`, `/`, `%` | 산술 | 표준 |
| `==`, `!=` | 동등 비교 | `===` 없음 (타입이 강제되므로 불필요) |
| `>`, `<`, `>=`, `<=` | 크기 비교 | 표준 |
| `=` | 할당 | `let` 선언 또는 재할당 |
| `->` | 반환 타입 표시 | `fn foo() -> i32` |
| `?` | 에러 전파 | `result?`로 Option/Result 언래핑 |
| `.` | 필드/메서드 접근 | 경로 구분자와 통일 |
| `_` | 와일드카드 패턴 | `match`에서 "나머지 모든 경우" |
| `..` | 범위 | `for i in 0..10` |
| `#` | 주석 | 한 줄 주석만 지원 |

**의도적으로 제외한 연산자:**

| 제외 | 이유 |
|------|------|
| `&&`, `\|\|`, `!` | `and`, `or`, `not` 키워드로 대체 |
| `++`, `--` | `x = x + 1`로 명시적 표현. 전위/후위 모호성 제거 |
| `+=`, `-=`, `*=`, `/=` | 고려 중이나, "한 가지 방법" 원칙에 의해 `x = x + 1` 방식만 허용 가능 |
| `? :` (삼항) | `if/else` 표현식으로 대체 |
| `\|>` (파이프) | 초기 버전에서는 제외. 함수 호출 중첩으로 대체 |
| `::` | `.`으로 통일 |
| `<>` (제네릭) | `[]`로 대체: `List[Item]`, `Map[str, i32]` |

---

## 8. 열린 질문 (게임 도메인 에이전트와 협의 필요)

1. **모듈 시스템**: `import`/`use`/`from` 키워드가 필요한가? 아니면 파일 시스템 기반 자동 임포트?
2. **접근 제어**: `pub` 키워드 vs Go 스타일 대문자 관례 vs 전부 public?
3. **코루틴**: `yield`/`await`가 핵심 키워드인가, 게임 도메인 키워드인가?
4. **복합 할당**: `+=`, `-=` 등을 허용할 것인가? (편의성 vs "한 가지 방법" 원칙)
5. **타입 별칭**: `type Health = i32` 같은 구문이 필요한가? `type` 키워드 추가 여부.
