# Vibe 타입 시스템 키워드 제안서

## 요약

총 10개의 타입 시스템 키워드를 제안한다. 전체 25개 키워드 예산 중 약 40%를 타입 시스템에 배정하는 것이며, 이는 Rust의 타입 안전성을 유지하면서 LLM 생성 정확도를 극대화하는 최소 집합이다.

```
struct, enum, match, ability, has, self, of, some, none, type
```

---

## 핵심 설계 결정 (Critical Questions 답변)

### 결정 1: `trait` vs `ability` vs `behavior` vs `interface`

**선택: `ability`**

| 후보 | 장점 | 단점 | LLM 전이 가능성 |
|------|------|------|-----------------|
| `trait` | Rust와 동일, 정확한 의미 | 게임 개발자에게 낯섦, "특성"이라는 뜻이 모호 | 높음 (Rust 학습 데이터) |
| `ability` | 게임 네이티브 ("이 캐릭터는 Damageable 능력이 있다"), 직관적 | 비게임 타입에 약간 어색할 수 있음 | 중간 (자연어로서 높음) |
| `behavior` | 행동 정의라는 의미가 명확 | 7글자로 김, ECS의 behavior tree와 충돌 가능 | 중간 |
| `interface` | Java/Go/TS 개발자에게 친숙 | 9글자로 가장 김, "지루하다" | 높음 (Java/Go/TS 데이터) |

**`ability`를 선택하는 이유:**

1. **자연어 가독성**: `struct Player has Damageable, Movable`은 영어 문장처럼 읽힌다. "Player has the ability to be damaged and to move." LLM은 자연어에 최적화되어 있으므로, 코드가 자연어에 가까울수록 생성 정확도가 높다.

2. **게임 도메인 적합성**: 게임 엔진 언어에서 ability는 핵심 개념이다. RPG의 "능력", 캐릭터의 "할 수 있는 것"과 자연스럽게 대응한다. `ability Drawable`는 "그릴 수 있는 능력"으로 읽히고, `ability Serializable`은 "직렬화 가능한 능력"으로 읽힌다.

3. **비게임 타입에서의 자연스러움**: `ability Hashable`, `ability Comparable` 같은 표현도 충분히 자연스럽다. "이 타입은 해시 가능한 능력을 갖고 있다"는 의미적으로 정확하다.

4. **LLM 전이 학습**: `ability`는 영어 단어로서 LLM 토크나이저에 단일 토큰으로 존재한다. `trait`도 단일 토큰이지만, `ability`는 자연어 맥락에서 훨씬 빈번하게 등장하므로 LLM이 의미를 더 정확하게 파악한다.

5. **5글자**: `trait`(5) = `ability`(7)보다 짧지만, `interface`(9)보다 훨씬 짧다. 토큰 효율과 가독성의 균형점에 있다.

**`trait`를 선택하지 않는 이유:**
- "trait"의 사전적 의미는 "특성/특질"이다. 이는 데이터 속성(필드)과 혼동될 수 있다. "Player의 trait는 speed: 100이다"라고 오해할 여지가 있다.
- Vibe의 핵심 목표 중 하나는 게임 개발 초보자와 LLM 모두에게 직관적인 것이다. `trait`는 프로그래밍 경험이 있는 사람에게만 의미가 통한다.

**`interface`를 선택하지 않는 이유:**
- 9글자로 타이핑 비용이 높다.
- Java/Go의 interface와 의미적으로 유사하지만, Vibe의 ability는 default implementation을 허용하므로 순수 interface보다 넓은 개념이다.
- 게임 엔진 언어의 정체성을 드러내지 못한다.

---

### 결정 2: `Option` -- 키워드 vs 내장 enum

**선택: `?` 접미사 문법 + `some`/`none` 키워드**

```
-- 타입 선언에서: ? 접미사
let target: Player? = find("enemy")

-- 값 생성에서: some/none 키워드
let health: Int? = some(100)
let empty: Int? = none

-- 패턴 매칭에서: some/none
match target
    is some(p) then p.damage(10)
    is none then pass
end

-- 간편 접근: ?. 체이닝
target?.damage(10)

-- 폴백: or 키워드 (제어흐름 키워드에서 이미 존재)
let hp: Int = target?.health or 0
```

**이 설계의 근거:**

1. **`T?` 문법이 `Option of T`보다 우월한 이유**:
   - 토큰 효율: `Player?`는 2토큰, `Option of Player`는 3토큰
   - LLM 학습 전이: TypeScript의 `T | undefined`, Swift의 `T?`, Kotlin의 `T?`에서 `?` 접미사가 nullable을 의미한다는 패턴이 이미 확립됨
   - 시각적 명확성: 타입 선언에서 `?`가 보이면 즉시 "이 값은 없을 수 있다"가 전달됨

2. **`some`/`none`을 키워드로 만드는 이유**:
   - `Option.Some(x)` / `Option.None`은 Rust 스타일이지만 6-11토큰을 소비
   - `some(x)` / `none`은 각각 2토큰/1토큰
   - match 구문에서 `is some(p) then`은 자연어처럼 읽힌다: "어떤 값 p가 있다면"
   - `none`은 `null`/`nil`의 안전한 대안으로, 키워드로 만들면 LLM이 절대로 `null`이나 `nil`을 생성하지 않게 된다

3. **`null`이 존재하지 않음을 강제하는 방법**:
   - `none`이 키워드이므로, 타입 시스템에서 `T`(non-optional)와 `T?`(optional)가 완전히 분리된다
   - `let x: Player = none`은 컴파일 에러 -- `Player?`가 아니므로
   - LLM이 "값이 없을 수 있는" 상황을 만나면 반드시 `?` 타입을 사용해야 한다는 규칙이 단순하고 일관적

---

### 결정 3: `self` -- 키워드로 포함

**선택: `self`를 키워드로 포함한다**

```
struct Player
    health: Int = 100
    speed: Float = 200.0

    def take_damage(self, amount: Int)
        self.health = self.health - amount
    end
end
```

**근거:**

1. **명시적 `self`가 암묵적 `self`보다 LLM에게 유리한 이유**:
   - GDScript는 `self`를 암묵적으로 사용한다. `health = 100`이 `self.health = 100`인지 지역 변수 `health = 100`인지 문맥에 따라 달라진다.
   - 모호성 분석(RESEARCH.md 섹션 5)에서 확인했듯이, JavaScript의 `this` 바인딩 모호성이 LLM 오류의 주요 원인이다.
   - Python 스타일의 명시적 `self`는 학습 데이터가 가장 풍부하며, LLM이 "메서드의 첫 번째 인자가 self"라는 패턴을 완벽하게 학습하고 있다.

2. **Go 스타일(리시버 이름 자유) vs Python 스타일(항상 self)**:
   - Go: `func (p *Player) Update(dt float32)` -- `p`라는 이름이 자유롭게 변경 가능
   - Python: `def update(self, dt: float)` -- 항상 `self`
   - Vibe는 Python 스타일을 채택한다. 이유: "한 가지 방법" 원칙. 리시버 이름이 자유로우면 LLM이 `p`, `self`, `this`, `s`, `player` 중 무엇을 쓸지 매번 결정해야 한다.

3. **`self`는 메서드 시그니처에 명시적으로 등장한다**:
   - 일반 함수: `def add(a: Int, b: Int): Int`
   - 메서드: `def take_damage(self, amount: Int)`
   - 이 구분이 명확하면 LLM이 "이것은 메서드인가 함수인가?"를 시그니처만 보고 100% 판단할 수 있다.

---

### 결정 4: `type` 키워드 -- 포함

**선택: `type`을 타입 별칭 키워드로 포함한다**

```
-- 타입 별칭
type Health = Int
type Position = Vec2
type EntityList = List of Entity
type DamageHandler = Fn(Entity, Int): Bool
```

**근거:**

1. **게임 개발에서 타입 별칭의 필요성**:
   - `Int` 대신 `Health`, `Mana`, `Score`를 사용하면 코드의 의도가 명확해진다
   - 함수 타입 시그니처가 복잡해질 때 별칭이 가독성을 극적으로 향상시킨다
   - `type DamageHandler = Fn(Entity, Int): Bool`은 콜백 패턴에서 필수적

2. **LLM 관점에서의 이점**:
   - `type X = Y` 패턴은 TypeScript(`type X = Y`), Haskell(`type X = Y`), Go(`type X = Y`)에서 동일하다
   - LLM이 이 패턴을 이미 완벽하게 학습하고 있다
   - 키워드가 `type`이라는 가장 직관적인 단어이므로 혼동의 여지가 없다

3. **1토큰 비용으로 얻는 표현력이 크다**: 키워드 예산에서 1개를 사용하지만, 코드 전체의 가독성과 의미적 명확성을 크게 향상시킨다.

---

### 결정 5: `match`의 완전성(exhaustiveness) 검사

**선택: enum에 대한 match는 완전성을 강제한다. 단, `else` 절로 나머지를 처리할 수 있다.**

```
enum Direction
    Up
    Down
    Left
    Right
end

-- 완전성 강제: 모든 variant를 처리해야 함
match dir
    is Up then move(0, -1)
    is Down then move(0, 1)
    is Left then move(-1, 0)
    is Right then move(1, 0)
end

-- else로 나머지 일괄 처리 허용
match dir
    is Up then move(0, -1)
    is Down then move(0, 1)
    else then pass
end
```

**근거:**

1. **완전성 검사가 LLM에게 유리한 이유**:
   - RESEARCH.md의 Rust 분석에서 확인했듯이, 완전성 검사는 "새 상태를 추가했을 때 처리를 빼먹는" 가장 흔한 의미적 오류를 원천 차단한다
   - LLM이 코드를 생성할 때, 컴파일러가 누락된 케이스를 알려주면 자동 수정이 가능하다
   - 이는 Vibe의 설계 원칙 #1(의미적 명확성)에 직접적으로 부합한다

2. **`else` 절이 필요한 이유**:
   - 모든 상황에서 모든 variant를 나열하는 것은 과도하다. 예: 20개 variant를 가진 enum에서 2개만 특별 처리하고 싶을 때
   - `else`는 이미 제어흐름 키워드에 존재하므로 추가 키워드 비용이 없다
   - LLM이 `else then`을 보면 "나머지 모든 경우"로 즉시 이해한다

3. **Rust와의 차이점**:
   - Rust: `_ => ...` (와일드카드 패턴)
   - Vibe: `else then ...` (자연어 키워드)
   - `_`는 기호이므로 LLM이 문맥에 따라 다른 의미(언더스코어 변수, 무시 패턴 등)와 혼동할 수 있다. `else`는 의미가 100% 명확하다.

---

### 결정 6: 타입 조합 표현 -- `has` 키워드

**선택: `has`**

```
struct Player has Damageable, Movable, Drawable
    name: String = "Player"
    health: Int = 100
end
```

| 후보 | 읽히는 방식 | 자연스러움 |
|------|------------|-----------|
| `has` | "Player has Damageable" (Player는 Damageable을 갖고 있다) | 매우 자연스러움 |
| `with` | "Player with Damageable" (Damageable과 함께인 Player) | 자연스럽지만 의미가 약함 |
| `is` | "Player is Damageable" (Player는 Damageable이다) | 자연스럽지만 `is` 연산자와 충돌 |
| `impl` | "Player impl Damageable" | 프로그래머 전용 |

**`has`를 선택하는 이유:**

1. **자연어 문장으로서의 완성도**: "struct Player has Damageable, Movable"은 "Player라는 구조체는 Damageable과 Movable 능력을 갖고 있다"로 읽힌다. 영어 문장으로서 완벽하다.

2. **`is`와의 충돌 회피**: `is`는 match 문에서 패턴 매칭에 이미 사용된다(`is some(x) then`, `is Idle then`). 타입 선언에서도 `is`를 사용하면 파서와 LLM 모두에게 혼동을 야기한다.

3. **`with`보다 강한 의미**: `with`는 "함께"라는 약한 연관을 암시하지만, `has`는 "소유"를 명확히 표현한다. ability를 "구현한다"는 것은 "그 능력을 소유한다"는 것이므로 `has`가 의미적으로 더 정확하다.

4. **KAPLAY의 컴포넌트 패턴과의 유사성**: KAPLAY에서 `add([sprite(), pos(), area(), body()])`처럼 엔티티가 컴포넌트를 "갖는" 패턴이 있다. `has`는 이 "갖고 있음" 개념과 직접적으로 대응한다.

---

## 10개 타입 시스템 키워드 상세 명세

---

### 1. `struct`

**역할**: 데이터 타입(구조체)을 정의한다.

**이 단어를 선택한 이유**:
- Rust, Go, C, Zig, Odin 등 다수 언어에서 동일한 키워드 사용
- LLM 학습 데이터에서 `struct`의 의미가 100% 일관적: "필드를 가진 복합 데이터 타입"
- `class`와 달리 상속을 암시하지 않으므로 "컴포지션 우선" 철학에 부합
- 6글자, 1토큰

**코드 예시**:
```
struct Vec2
    x: Float = 0.0
    y: Float = 0.0
end

struct Player has Damageable, Movable
    name: String = "Hero"
    health: Int = 100
    position: Vec2 = Vec2(0.0, 0.0)

    def take_damage(self, amount: Int)
        self.health = self.health - amount
    end
end

-- 인스턴스 생성
let player: Player = Player("Hero", 100, Vec2(0.0, 0.0))
let origin: Vec2 = Vec2(0.0, 0.0)
```

**Rust 대비 단순화**:
```rust
// Rust: struct + impl 블록이 분리됨
struct Player {
    name: String,
    health: i32,
    position: Vec2,
}

impl Damageable for Player {
    fn take_damage(&mut self, amount: i32) {
        self.health -= amount;
    }
}

impl Movable for Player { /* ... */ }
```
```
-- Vibe: struct 안에 메서드 정의 + has로 ability 선언
-- impl 블록이 없고, 메서드가 struct 내부에 위치
-- &mut self 대신 self
-- 세미콜론 없음, 중괄호 대신 end
struct Player has Damageable, Movable
    name: String = "Hero"
    health: Int = 100

    def take_damage(self, amount: Int)
        self.health = self.health - amount
    end
end
```

핵심 단순화:
- `impl` 블록 제거 (메서드가 struct 내부에 위치)
- `&self`, `&mut self` 구분 제거 (항상 `self`)
- 소유권/빌림 개념 제거
- 필드 기본값 지원 (Rust는 `Default` trait 필요)

---

### 2. `enum`

**역할**: 열거형(tagged union / sum type)을 정의한다. 각 variant는 데이터를 가질 수 있다.

**이 단어를 선택한 이유**:
- Rust, TypeScript, Swift, Java, C#, Python 등 거의 모든 현대 언어에서 사용
- LLM 학습 데이터에서 가장 일관적인 의미를 가진 키워드 중 하나
- 게임 개발에서 상태 기계(FSM)는 가장 핵심적인 패턴이며, enum이 이를 완벽하게 표현
- 4글자, 1토큰

**코드 예시**:
```
-- 단순 열거형 (데이터 없음)
enum Direction
    Up
    Down
    Left
    Right
end

-- 데이터를 가진 열거형 (tagged union)
enum PlayerState
    Idle
    Running(speed: Float)
    Jumping(velocity: Float, air_time: Float)
    Attacking(animation: String, frame: Int)
    Dead
end

-- 사용
let state: PlayerState = PlayerState.Idle
let running: PlayerState = PlayerState.Running(200.0)
```

**Rust 대비 단순화**:
```rust
// Rust
enum PlayerState {
    Idle,
    Running { speed: f32 },
    Jumping { velocity: f32, air_time: f32 },
    Attacking { animation: AnimId, frame: u32 },
    Dead,
}
```
```
-- Vibe
enum PlayerState
    Idle
    Running(speed: Float)
    Jumping(velocity: Float, air_time: Float)
    Attacking(animation: String, frame: Int)
    Dead
end
```

핵심 단순화:
- 중괄호 `{}` 대신 `end`
- variant 데이터가 `{ field: Type }` 대신 `(field: Type)` -- 함수 인자와 동일한 형태
- 쉼표 구분자 없음 (줄바꿈으로 variant 분리)
- 접근 경로: `PlayerState::Idle` 대신 `PlayerState.Idle` (점 하나로 통일)

---

### 3. `match`

**역할**: 패턴 매칭을 수행한다. enum의 variant를 분기 처리한다.

**이 단어를 선택한 이유**:
- Rust, Python 3.10+, Scala에서 동일 키워드 사용
- `switch`보다 "매칭(대조)"이라는 의미가 패턴 매칭의 본질에 더 가깝다
- LLM이 `match`를 보면 "패턴에 따라 분기"라는 의미를 즉시 이해
- 5글자, 1토큰

**코드 예시**:
```
-- 기본 패턴 매칭
match state
    is PlayerState.Idle then
        play_animation("idle")
    is PlayerState.Running(speed) then
        move(speed * dt)
        play_animation("run")
    is PlayerState.Jumping(vel, time) then
        apply_gravity(vel, time)
    is PlayerState.Dead then
        show_game_over()
    else then
        pass
end

-- Option 타입 매칭
let target: Entity? = find_nearest_enemy()
match target
    is some(enemy) then
        attack(enemy)
    is none then
        patrol()
end

-- 값 매칭
match direction
    is Direction.Up then move(0, -1)
    is Direction.Down then move(0, 1)
    is Direction.Left then move(-1, 0)
    is Direction.Right then move(1, 0)
end
```

**Rust 대비 단순화**:
```rust
// Rust
match state {
    PlayerState::Idle => {
        play_animation("idle");
    }
    PlayerState::Running { speed } => {
        move_entity(speed * dt);
    }
    _ => {}
}
```
```
-- Vibe
match state
    is PlayerState.Idle then
        play_animation("idle")
    is PlayerState.Running(speed) then
        move(speed * dt)
    else then
        pass
end
```

핵심 단순화:
- `=>` 기호 대신 `is ... then` 키워드 쌍 (자연어처럼 읽힘)
- `_` 와일드카드 대신 `else then` (의미가 명확)
- `::` 대신 `.` (경로 구분자 통일)
- 중괄호/세미콜론 없음
- `is` 키워드가 각 arm을 시작하므로 구조가 시각적으로 일관적

**중요**: `is`는 match arm에서만 사용되는 문맥 키워드(soft keyword)로, 별도의 키워드 예산을 소비하지 않는다. `is`는 `match` 블록 내부에서만 특별한 의미를 가지며, 다른 곳에서는 식별자로 사용 가능하다. 이렇게 하면 키워드 총 개수를 줄이면서도 match 구문의 가독성을 유지할 수 있다.

---

### 4. `ability`

**역할**: 인터페이스/트레이트를 정의한다. 타입이 구현해야 하는 메서드 계약을 선언한다.

**이 단어를 선택한 이유**: (결정 1에서 상세 논의)

**코드 예시**:
```
-- 추상 ability (구현 없음)
ability Drawable
    def draw(self, renderer: Renderer)
end

-- 기본 구현이 있는 ability
ability Damageable
    def max_health(self): Int

    def take_damage(self, amount: Int)
        let current: Int = self.current_health()
        let new_hp: Int = max(current - amount, 0)
        self.set_health(new_hp)
    end

    def is_alive(self): Bool
        return self.current_health() > 0
    end
end

-- ability 조합
ability GameEntity has Drawable, Updatable, Damageable
end

-- struct에서 ability 구현
struct Player has Damageable, Drawable
    health: Int = 100

    def max_health(self): Int
        return 100
    end

    def current_health(self): Int
        return self.health
    end

    def set_health(self, hp: Int)
        self.health = hp
    end

    def draw(self, renderer: Renderer)
        renderer.sprite("player", self.position)
    end
end
```

**Rust 대비 단순화**:
```rust
// Rust
trait Damageable {
    fn max_health(&self) -> i32;

    fn take_damage(&mut self, amount: i32) {
        let current = self.current_health();
        let new_hp = (current - amount).max(0);
        self.set_health(new_hp);
    }
}

impl Damageable for Player {
    fn max_health(&self) -> i32 { 100 }
    // take_damage는 default 구현 사용
}
```
```
-- Vibe
ability Damageable
    def max_health(self): Int
    def take_damage(self, amount: Int)
        -- 기본 구현
    end
end

struct Player has Damageable
    def max_health(self): Int
        return 100
    end
end
```

핵심 단순화:
- `trait` 대신 `ability` (게임 개발자에게 직관적)
- `impl Trait for Type` 블록이 제거됨 -- struct 선언 시 `has` 키워드로 직접 연결
- `&self`, `&mut self` 구분 없음 -- 항상 `self`
- `-> i32` 대신 `: Int` (TypeScript/Python 스타일 타입 표기)
- 기본 구현이 ability 내부에 직접 작성됨 (Rust와 동일하지만 문법이 더 간결)

---

### 5. `has`

**역할**: struct가 ability를 구현함을 선언한다. ability가 다른 ability를 요구함을 선언한다.

**이 단어를 선택한 이유**: (결정 6에서 상세 논의)

**코드 예시**:
```
-- struct가 ability를 구현
struct Player has Damageable, Movable, Drawable
    -- Damageable, Movable, Drawable의 필수 메서드를 여기서 구현
end

-- ability가 다른 ability를 요구 (supertrait)
ability GameEntity has Drawable, Updatable
    def on_spawn(self)
    def on_destroy(self)
end
-- GameEntity를 구현하려면 Drawable과 Updatable도 구현해야 함

-- 함수 파라미터에서 ability 제약
def render_all(entities: List of has Drawable)
    for entity in entities do
        entity.draw(renderer)
    end
end
```

**Rust 대비 단순화**:
```rust
// Rust
impl Damageable for Player { /* ... */ }
impl Movable for Player { /* ... */ }

trait GameEntity: Drawable + Updatable {
    fn on_spawn(&mut self);
}

fn render_all(entities: &[&dyn Drawable]) { /* ... */ }
```
```
-- Vibe
struct Player has Damageable, Movable
    -- 구현
end

ability GameEntity has Drawable, Updatable
    def on_spawn(self)
end

def render_all(entities: List of has Drawable)
    -- 구현
end
```

핵심 단순화:
- `impl X for Y` 블록이 제거되고 `struct Y has X`로 통합
- `: Drawable + Updatable` 대신 `has Drawable, Updatable` (자연어)
- `&[&dyn Drawable]` 대신 `List of has Drawable` (기호 없는 타입 표현)

---

### 6. `self`

**역할**: 메서드 내에서 현재 인스턴스를 참조한다.

**이 단어를 선택한 이유**: (결정 3에서 상세 논의)

**코드 예시**:
```
struct Enemy
    health: Int = 50
    position: Vec2 = Vec2(0.0, 0.0)

    def take_damage(self, amount: Int)
        self.health = self.health - amount
        if self.health <= 0 then
            self.die()
        end
    end

    def move_toward(self, target: Vec2, speed: Float, dt: Float)
        let direction: Vec2 = (target - self.position).normalized()
        self.position = self.position + direction * speed * dt
    end

    def die(self)
        emit(EnemyDied, self)
    end
end
```

**Rust 대비 단순화**:
```rust
// Rust: &self, &mut self, self의 3가지 변형
impl Enemy {
    fn take_damage(&mut self, amount: i32) { /* ... */ }
    fn position(&self) -> Vec2 { /* ... */ }    // immutable borrow
    fn into_loot(self) -> Vec<Item> { /* ... */ } // ownership transfer
}
```
```
-- Vibe: 항상 self 하나만 존재
struct Enemy
    def take_damage(self, amount: Int)
    def position(self): Vec2
    def into_loot(self): List of Item
end
```

핵심 단순화:
- `&self` / `&mut self` / `self` 3가지 구분이 사라지고 `self` 하나로 통일
- 소유권 이전 개념 없음 (GC 또는 RC로 메모리 관리)
- 메서드 시그니처만 보고 "이것은 메서드다" (self가 있으면)와 "이것은 함수다" (self가 없으면)를 즉시 구분

---

### 7. `of`

**역할**: 제네릭 타입의 타입 파라미터를 지정한다. `<>` 꺾쇠 괄호를 대체한다.

**이 단어를 선택한 이유**:
- `List of Int`는 영어 "List of integers"와 동일 -- 자연어에 가장 가까운 제네릭 표현
- `<>`는 HTML 태그와 혼동 가능하며, LLM 토크나이저에서 비효율적
- `of`는 2글자, 1토큰으로 극도로 효율적
- 비교 연산자 `<`, `>`와의 구문적 모호성이 완전히 제거됨

**코드 예시**:
```
-- 컨테이너 타입
let items: List of Item = []
let scores: Map of String to Int = {}
let target: Option of Entity = none  -- 또는 Entity? 로 축약

-- 제네릭 struct 정의
struct Pool of T
    items: List of T = []
    max_size: Int = 100

    def get(self): T?
        if self.items.length() > 0 then
            return some(self.items.pop())
        end
        return none
    end

    def release(self, item: T)
        if self.items.length() < self.max_size then
            self.items.push(item)
        end
    end
end

-- 사용
let bullet_pool: Pool of Bullet = Pool of Bullet([], 50)
let effect_pool: Pool of Particle = Pool of Particle([], 200)

-- 중첩 제네릭
let grouped: Map of String to List of Entity = {}
```

**Rust 대비 단순화**:
```rust
// Rust
struct Pool<T> {
    items: Vec<T>,
    max_size: usize,
}

impl<T> Pool<T> {
    fn get(&mut self) -> Option<T> { /* ... */ }
    fn release(&mut self, item: T) { /* ... */ }
}

let pool: Pool<Bullet> = Pool::new(50);
let grouped: HashMap<String, Vec<Entity>> = HashMap::new();
```
```
-- Vibe
struct Pool of T
    items: List of T = []
    max_size: Int = 100
    def get(self): T?
    def release(self, item: T)
end

let pool: Pool of Bullet = Pool of Bullet([], 50)
let grouped: Map of String to List of Entity = {}
```

핵심 단순화:
- `<T>` 대신 `of T` (자연어)
- `impl<T> Pool<T>` 같은 반복 없음 (struct 내부에 메서드)
- `HashMap<String, Vec<Entity>>` 대신 `Map of String to List of Entity` (가독성 극대화)
- `Pool::new(50)` 대신 `Pool of Bullet([], 50)` (경로 기호 없음)

**`to` 키워드에 대한 참고**: `Map of K to V`에서 `to`는 Map 타입에서만 사용되는 관용적 표현이다. `to`를 별도 키워드로 카운트하지 않고 `of` 문법의 일부로 취급한다. 이 패턴은 `Map` 타입의 고유한 문법이며, 사용자 정의 타입에서는 `of T` 형태만 사용한다.

---

### 8. `some`

**역할**: Optional 타입의 "값이 있음" 상태를 표현한다.

**이 단어를 선택한 이유**:
- Rust의 `Some`과 동일한 의미, 소문자 변환 (Vibe의 키워드는 모두 소문자)
- 자연어 "some value" (어떤 값)과 직접 대응
- `match`에서 `is some(x) then`은 "어떤 값 x가 있다면"으로 읽힘
- 4글자, 1토큰

**코드 예시**:
```
-- Optional 값 생성
let target: Entity? = some(find_nearest_enemy())
let empty: Entity? = none

-- match에서 사용
match target
    is some(enemy) then
        attack(enemy)
    is none then
        idle()
end

-- if 조건에서 바인딩 (선택적 단축 문법)
if some(enemy) = find_nearest_enemy() then
    attack(enemy)
end

-- some은 값을 감싸는 함수처럼 동작
def first_alive(entities: List of Entity): Entity?
    for e in entities do
        if e.is_alive() then
            return some(e)
        end
    end
    return none
end
```

**Rust 대비 단순화**:
```rust
// Rust
let target: Option<Entity> = Some(find_nearest_enemy());

if let Some(enemy) = find_nearest_enemy() {
    attack(enemy);
}

match target {
    Some(enemy) => attack(enemy),
    None => idle(),
}
```
```
-- Vibe
let target: Entity? = some(find_nearest_enemy())

if some(enemy) = find_nearest_enemy() then
    attack(enemy)
end

match target
    is some(enemy) then attack(enemy)
    is none then idle()
end
```

핵심 단순화:
- `Option<Entity>` 대신 `Entity?`
- `Some` (대문자 시작) 대신 `some` (소문자, 키워드)
- `if let Some(enemy) = ...` 대신 `if some(enemy) = ...` (`let` 생략)
- `=>` 대신 `then`

---

### 9. `none`

**역할**: Optional 타입의 "값이 없음" 상태를 표현한다. `null`/`nil`의 안전한 대안.

**이 단어를 선택한 이유**:
- Rust의 `None`과 동일한 의미
- `null`(5글자)이나 `nil`(3글자)보다 의미가 명확: "없음"
- `null`을 사용하지 않음으로써 "null은 존재하지 않는다"는 설계 의도를 키워드 수준에서 강제
- `none`은 Python의 `None`과 의미적으로 동일하여 LLM 전이 학습에 유리
- 4글자, 1토큰

**코드 예시**:
```
-- 값 없음을 표현
let target: Entity? = none

-- 함수 반환값으로 사용
def find_item(name: String): Item?
    for item in inventory do
        if item.name == name then
            return some(item)
        end
    end
    return none
end

-- or 키워드로 폴백 (제어흐름 키워드에서 이미 존재)
let weapon: Item = find_item("sword") or default_weapon
let hp: Int = target?.health or 0

-- none 체크
if target == none then
    search_for_enemy()
end

-- match에서
match find_item("potion")
    is some(potion) then use(potion)
    is none then print("No potions left!")
end
```

**Rust 대비 단순화**:
```rust
// Rust
let target: Option<Entity> = None;

let weapon = find_item("sword").unwrap_or(default_weapon);
let hp = target.map(|t| t.health).unwrap_or(0);

if target.is_none() {
    search_for_enemy();
}
```
```
-- Vibe
let target: Entity? = none

let weapon: Item = find_item("sword") or default_weapon
let hp: Int = target?.health or 0

if target == none then
    search_for_enemy()
end
```

핵심 단순화:
- `None` (대문자) 대신 `none` (소문자 키워드)
- `.unwrap_or()` 대신 `or` 키워드 (자연어)
- `.map(|t| t.health).unwrap_or(0)` 대신 `target?.health or 0` (클로저 불필요)
- `.is_none()` 대신 `== none` (직관적 비교)

---

### 10. `type`

**역할**: 타입 별칭을 정의한다.

**이 단어를 선택한 이유**: (결정 4에서 상세 논의)

**코드 예시**:
```
-- 단순 별칭
type Health = Int
type Mana = Int
type Score = Int

-- 복합 타입 별칭
type Position = Vec2
type Velocity = Vec2
type EntityList = List of Entity
type EntityMap = Map of String to Entity

-- 함수 타입 별칭
type DamageHandler = Fn(Entity, Int): Bool
type UpdateCallback = Fn(Float)
type EventListener = Fn(Event)

-- 사용
let on_damage: DamageHandler = def(target: Entity, amount: Int): Bool
    target.health = target.health - amount
    return target.health > 0
end

let enemies: EntityList = []
let player_hp: Health = 100
```

**Rust 대비 단순화**:
```rust
// Rust
type Health = i32;
type EntityList = Vec<Entity>;
type DamageHandler = fn(&Entity, i32) -> bool;
type DamageHandlerDyn = Box<dyn Fn(&Entity, i32) -> bool>;
```
```
-- Vibe
type Health = Int
type EntityList = List of Entity
type DamageHandler = Fn(Entity, Int): Bool
-- fn, Fn, FnMut, FnOnce 구분 없음. 항상 Fn 하나만.
```

핵심 단순화:
- `fn` / `Fn` / `FnMut` / `FnOnce` 구분 없음 -- `Fn` 하나만 존재
- `Box<dyn Fn(...)>` 같은 동적 디스패치 래핑 불필요
- `-> bool` 대신 `: Bool` (일관된 타입 표기)
- 세미콜론 없음

---

## 키워드 간 상호작용 설계

### 패턴 1: struct + ability + has (타입 정의와 구현)

```
-- ability 정의
ability Collidable
    def bounds(self): Rect
    def on_collide(self, other: has Collidable)
end

ability Renderable
    def render(self, ctx: RenderContext)
    def layer(self): Int
        return 0  -- 기본 구현
    end
end

-- struct에서 ability 구현
struct Bullet has Collidable, Renderable
    position: Vec2 = Vec2(0.0, 0.0)
    size: Vec2 = Vec2(4.0, 4.0)
    damage: Int = 10

    def bounds(self): Rect
        return Rect(self.position, self.size)
    end

    def on_collide(self, other: has Collidable)
        -- 충돌 처리
    end

    def render(self, ctx: RenderContext)
        ctx.draw_circle(self.position, 2.0, Color.Red)
    end

    def layer(self): Int
        return 5  -- 기본 구현을 오버라이드
    end
end
```

### 패턴 2: enum + match + some/none (상태 기계와 Optional)

```
enum AIState
    Patrol(route: List of Vec2, index: Int)
    Chase(target: Entity)
    Attack(target: Entity, cooldown: Float)
    Flee(direction: Vec2)
    Idle
end

def update_ai(self, dt: Float): AIState
    match self.state
        is AIState.Patrol(route, index) then
            let next_point: Vec2 = route.get(index) or route.get(0) or Vec2(0.0, 0.0)
            self.move_toward(next_point, dt)
            if self.reached(next_point) then
                let next_index: Int = (index + 1) % route.length()
                return AIState.Patrol(route, next_index)
            end
            let target: Entity? = self.detect_enemy()
            match target
                is some(enemy) then return AIState.Chase(enemy)
                is none then return AIState.Patrol(route, index)
            end
        is AIState.Chase(target) then
            if target.is_alive() and self.distance_to(target) > 50.0 then
                self.move_toward(target.position, dt)
                return AIState.Chase(target)
            end
            if target.is_alive() then
                return AIState.Attack(target, 0.0)
            end
            return AIState.Idle
        is AIState.Attack(target, cooldown) then
            if cooldown <= 0.0 then
                self.deal_damage(target, 10)
                return AIState.Attack(target, 1.0)
            end
            return AIState.Attack(target, cooldown - dt)
        is AIState.Flee(direction) then
            self.move(direction * self.speed * dt)
            return AIState.Flee(direction)
        is AIState.Idle then
            return AIState.Patrol(self.default_route, 0)
    end
end
```

### 패턴 3: type + of + struct (타입 별칭과 제네릭)

```
type Callback = Fn(Event)
type SpriteSheet = Map of String to List of Rect

struct ObjectPool of T
    available: List of T = []
    active: List of T = []

    def acquire(self): T?
        if self.available.length() > 0 then
            let item: T = self.available.pop()
            self.active.push(item)
            return some(item)
        end
        return none
    end

    def release(self, item: T)
        self.active.remove(item)
        self.available.push(item)
    end
end

-- 타입 별칭과 제네릭 조합
type BulletPool = ObjectPool of Bullet
type ParticlePool = ObjectPool of Particle
```

---

## 의도적으로 제외한 키워드와 근거

### `impl` -- 제외

**Rust에서의 역할**: trait 구현을 struct와 분리된 블록에 작성
**제외 이유**: Vibe에서는 `has` 키워드와 struct 내부 메서드 정의로 대체됨. `impl` 블록을 제거하면:
- 하나의 타입에 대한 모든 정보가 한 곳(struct 블록)에 모임
- LLM이 "이 메서드는 어디에 정의되었는가?"를 추적할 필요 없음
- 파일 하나 = 타입 하나의 원칙 유지 가능

### `dyn` -- 제외

**Rust에서의 역할**: 동적 디스패치를 명시 (`Box<dyn Trait>`)
**제외 이유**: Vibe에서는 ability 타입을 직접 사용할 때 자동으로 동적 디스패치. `has Drawable` 파라미터가 `dyn Drawable`과 동일한 역할. 정적/동적 디스패치의 구분은 컴파일러가 최적화 단계에서 결정.

### `impl` (in function position) -- 제외

**Rust에서의 역할**: `fn draw(item: impl Drawable)` -- 정적 디스패치
**제외 이유**: `has Drawable`로 통합. 디스패치 방식은 프로그래머가 아니라 컴파일러가 결정.

### `where` -- 제외

**Rust에서의 역할**: 복잡한 제네릭 제약을 별도 절에 기술
**제외 이유**: Vibe의 제네릭은 단순한 수준만 지원 (`Pool of T` 수준). 복잡한 제약 조건이 필요한 설계를 근본적으로 피한다.

### `pub` / `private` -- 제외

**Rust에서의 역할**: 가시성 제어
**제외 이유**: 게임 엔진 스크립트에서 접근 제어는 우선순위가 낮다. 모든 것이 기본 public. 관례적으로 `_` 접두사로 "내부용"을 표시 (Python 스타일). 키워드 예산을 접근 제어에 쓰는 것보다 게임 기능에 쓰는 것이 더 가치 있다.

### `mut` -- 제외

**Rust에서의 역할**: 가변성 표시
**제외 이유**: Vibe에서는 `let`으로 선언된 변수가 기본적으로 가변(mutable). 불변을 원하면 문서 수준의 관례로 표시. 소유권/빌림이 없으므로 `mut`의 필요성이 근본적으로 사라진다. 이는 Python/Lua와 동일한 접근.

### `class` -- 제외

**제외 이유**: `struct`가 데이터 + 메서드를 모두 담으므로 `class`가 불필요. `class`는 상속을 암시하는데, Vibe는 상속을 지원하지 않는다.

### `interface` -- 제외

**제외 이유**: `ability`가 동일한 역할을 수행하며, 게임 엔진 도메인에 더 적합.

---

## 전체 키워드 예산 배치도

타입 시스템 10개 키워드가 전체 25개 예산에서 차지하는 위치:

```
[타입 시스템: 10개]
  struct, enum, match, ability, has, self, of, some, none, type

[제어흐름: 9개] (별도 제안서에서 다룰 예정)
  if, then, else, for, in, while, return, and, or

[선언: 2개]
  let, def

[블록: 2개]
  end, do

[값: 2개]
  true, false

합계: 25개
```

**문맥 키워드 (소프트 키워드, 예산 미차감)**:
- `is` -- match arm에서만 사용
- `not` -- 논리 부정
- `to` -- `Map of K to V`에서만 사용
- `pass` -- 빈 블록 표시

---

## LLM 생성 정확도 예측

### 토큰 효율 비교 (동일 로직)

**Rust (약 52토큰)**:
```rust
enum State { Idle, Run(f32) }
struct Player { state: State, hp: i32 }
trait Hittable { fn hit(&mut self, dmg: i32); }
impl Hittable for Player {
    fn hit(&mut self, dmg: i32) { self.hp -= dmg; }
}
```

**Vibe (약 35토큰)**:
```
enum State
    Idle
    Run(speed: Float)
end

ability Hittable
    def hit(self, dmg: Int)
end

struct Player has Hittable
    state: State = State.Idle
    hp: Int = 100

    def hit(self, dmg: Int)
        self.hp = self.hp - dmg
    end
end
```

Vibe가 약 33% 적은 토큰으로 동일한 타입 안전성을 표현한다. 이는 LLM의 컨텍스트 윈도우를 더 효율적으로 사용하게 해주며, 생성 시 각 토큰의 예측 정확도를 높인다.

### 패턴 일관성 점수

| 패턴 | 변형 수 | 규칙 |
|------|---------|------|
| 타입 정의 | 1 | `struct [Name] ... end` |
| 열거형 정의 | 1 | `enum [Name] ... end` |
| 인터페이스 정의 | 1 | `ability [Name] ... end` |
| 메서드 정의 | 1 | `def [name](self, ...) ... end` |
| 타입 표기 | 1 | `[name]: [Type]` |
| 제네릭 표기 | 1 | `[Container] of [Type]` |
| Optional 표기 | 1 | `[Type]?` |
| 패턴 매칭 | 1 | `match [expr] is [pattern] then ... end` |

**총 변형 수: 8가지 패턴, 각각 정확히 1가지 방법** -- 이것이 "한 가지 방법" 원칙의 실현이다. LLM은 8개 패턴만 학습하면 Vibe의 전체 타입 시스템을 생성할 수 있다.
