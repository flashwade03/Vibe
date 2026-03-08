# Vibe 게임 도메인 키워드 제안

> 원칙: "함수로 동작할 수 있으면 키워드로 만들지 않는다."
> 예산: 전체 20-30개 키워드 중 게임 도메인에 할당 가능한 슬롯은 최대 7-8개.

---

## 0. 판단 기준

키워드로 승격시키려면 다음 중 **최소 2가지**를 만족해야 한다:

| 기준 | 설명 |
|------|------|
| **문법 구조가 필요하다** | 뒤에 블록이 따르거나, 파서가 특별한 구문 구조를 기대한다 |
| **함수 호출로 표현하면 의미가 모호해진다** | `fn`이나 일반 함수로는 "이것이 무엇인지"가 드러나지 않는다 |
| **LLM 예측 가능성을 크게 높인다** | 키워드가 있으면 LLM이 뒤에 올 코드 구조를 100% 예측할 수 있다 |
| **게임 개발에서 매 프로젝트마다 반복된다** | 모든 게임에서 반드시 등장하는 패턴이다 |

---

## 1. 제안하는 게임 도메인 키워드: 5개

### 키워드 1: `entity`

**역할:** 게임 오브젝트(엔티티)의 타입을 정의한다. 컴포넌트를 조합하여 구성되는 "설계도(blueprint)"를 선언한다.

**왜 키워드여야 하는가:**
- `struct`와 근본적으로 다르다. `entity`는 (1) 게임 월드에 스폰될 수 있고, (2) 생명주기(`on enter`, `on update`, `on draw`)를 가지며, (3) 컴포넌트를 부착할 수 있다. `struct`는 순수 데이터 컨테이너일 뿐이다.
- 파서가 `entity` 뒤에 오는 블록 내부에서 `has`, `on`, 생명주기 핸들러 등 특수 구문을 기대해야 한다.
- LLM이 `entity`를 보는 순간 "게임 오브젝트 정의"라는 맥락을 즉시 파악하여, 뒤에 올 코드 패턴을 정확히 예측할 수 있다.
- **모든 게임에서 사용된다.** 플레이어, 적, 총알, 아이템 등 게임의 기본 단위다.

**코드 예시:**
```
entity Player
    has Sprite("hero.png")
    has Body(dynamic)
    has Collider(box)

    speed: f32 = 200.0
    health: i32 = 100

    on update(dt: f32)
        let dir = input.axis("left", "right")
        self.velocity.x = dir * self.speed
    end

    on collide(other: Entity, col: Collision)
        if other is Enemy
            self.health -= 10
        end
    end
end
```

**대체하는 것:**
- GDScript: `extends CharacterBody2D` + `.gd` 파일
- KAPLAY: `add([sprite("hero"), pos(...), body(), area(), ...])` (타입 없는 배열 조합)
- LOVE 2D: 관례적 테이블 + 메타테이블 (표준 패턴 없음)

---

### 키워드 2: `scene`

**역할:** 게임의 논리적 단위(메뉴, 게임 플레이, 게임 오버 등)를 정의한다. 생명주기 콜백과 씬 전환 메커니즘을 포함한다.

**왜 키워드여야 하는가:**
- `scene`은 단순한 함수나 구조체가 아니다. (1) `on enter`/`on exit` 생명주기를 가지고, (2) `go(다른 씬)` 전환 시 현재 씬의 모든 엔티티가 정리되며, (3) 파라미터를 받아 상태를 전달할 수 있다.
- 파서가 `scene` 블록 내부에서 `on enter`, `on update`, `on draw`, `on exit`, `on input` 등 고정된 생명주기 핸들러를 기대해야 한다.
- "이 코드가 어디에 속하는가?"를 파일 수준에서 명확히 한다. `scene Main`은 그 자체로 프로그램의 진입점이 된다.
- **모든 게임에서 사용된다.** 가장 단순한 게임도 최소 1개의 씬이 필요하다.

**코드 예시:**
```
scene Game(level: i32 = 1)
    on enter
        let player = spawn Player at vec2(100, 200)
        load_map("level_{level}.tmx")
    end

    on update(dt: f32)
        if all_enemies_dead()
            go Game(level: level + 1)
        end
    end

    on input(key: Key)
        match key
            is Escape then go Menu
        end
    end

    on exit
        save_progress()
    end
end

scene Menu
    on enter
        spawn Title at vec2(400, 200)
    end

    on input(key: Key)
        match key
            is Enter then go Game(level: 1)
        end
    end
end
```

**대체하는 것:**
- GDScript: `.tscn` 파일 + `get_tree().change_scene_to_file()`
- KAPLAY: `scene("game", () => { ... })` + `go("game")` (문자열 기반, 타입 안전 없음)
- LOVE 2D: 씬 시스템 없음 (수동 상태 관리 테이블)

---

### 키워드 3: `on`

**역할:** 이벤트 핸들러를 선언한다. 생명주기 이벤트(`update`, `draw`, `enter`, `exit`), 입력 이벤트(`input`, `collide`), 커스텀 시그널 등을 처리한다.

**왜 키워드여야 하는가:**
- `fn`으로 표현하면 "이것이 직접 호출하는 함수인지, 이벤트에 반응하는 핸들러인지"가 구분되지 않는다. `on`은 **"이 코드는 무언가가 발생했을 때 실행된다"**는 의미를 명시적으로 선언한다.
- 파서가 `on` 뒤에 오는 이벤트 이름에 따라 매개변수 시그니처를 자동으로 결정할 수 있다: `on update`는 항상 `(dt: f32)`, `on collide`는 항상 `(other: Entity, col: Collision)`.
- LLM 관점에서 가장 중요한 키워드다. `on`을 보면 뒤에 오는 구조가 완전히 결정적이다. GDScript의 `_ready`, `_process` 같은 매직 함수명 + 언더스코어 관례보다 훨씬 명시적이다.
- **모든 게임 엔티티와 씬에서 사용된다.** 게임은 본질적으로 이벤트 구동(event-driven)이다.

**코드 예시:**
```
entity Coin
    has Sprite("coin.png")
    has Collider(circle)

    on enter
        self.play_animation("spin")
    end

    on collide(other: Entity, col: Collision)
        if other is Player
            other.score += 10
            play_sound("collect")
            destroy(self)
        end
    end
end
```

**`fn`과의 차이가 명확한 이유:**
```
-- fn: 직접 호출하는 함수. 호출자가 명시적으로 부른다.
fn take_damage(self: Player, amount: i32)
    self.health -= amount
end

-- on: 이벤트 핸들러. 엔진이 자동으로 호출한다.
on collide(other: Entity, col: Collision)
    if other is Enemy
        take_damage(self, 10)
    end
end
```

**대체하는 것:**
- GDScript: `func _ready()`, `func _process(delta)`, `func _on_body_entered(body)` (언더스코어 관례 + 매직 이름)
- KAPLAY: `onUpdate(() => ...)`, `onCollide("tag", (e) => ...)` (콜백 함수)
- LOVE 2D: `function love.update(dt)`, `function love.keypressed(key)` (전역 콜백)

---

### 키워드 4: `has`

**역할:** 엔티티에 컴포넌트(행동/데이터)를 부착한다.

**왜 키워드여야 하는가:**
- `has`는 "이 엔티티는 이 능력/속성을 가진다"는 **컴포지션 관계**를 선언한다. 이것은 필드 선언(`speed: f32`)과 근본적으로 다르다. `has Body(dynamic)`은 단순히 데이터를 저장하는 것이 아니라, 엔진의 물리 시스템에 등록하고, 충돌 감지를 활성화하고, 중력을 적용받게 한다.
- 파서가 `has` 뒤에 컴포넌트 타입과 초기화 인자를 기대해야 한다. 일반 필드 선언과 문법적으로 구분된다.
- LLM이 `has`를 보면 "내장 컴포넌트 부착"이라는 맥락을 즉시 파악한다. `Sprite`, `Body`, `Collider`, `AudioSource` 등 유한한 내장 컴포넌트 목록에서 선택하면 된다.
- KAPLAY의 배열 기반 컴포넌트 조합(`add([sprite(), body(), area()])`)의 타입 안전 버전이다.

**코드 예시:**
```
entity Bullet
    has Sprite("bullet.png")
    has Body(kinematic)
    has Collider(circle, radius: 4)
    has Lifetime(2.0)

    speed: f32 = 500.0
    damage: i32 = 10

    on update(dt: f32)
        self.position.x += self.speed * dt
    end
end
```

**`has`를 쓰지 않고 필드로 대체하면 생기는 문제:**
```
-- 이렇게 쓰면 "이것이 엔진에 등록되는 컴포넌트인지, 단순 데이터인지" 구분 불가
entity Bullet
    sprite: Sprite = Sprite("bullet.png")   -- 엔진이 렌더링해야 하나?
    body: Body = Body(kinematic)             -- 물리 시스템에 등록해야 하나?
    speed: f32 = 500.0                       -- 이건 그냥 데이터인가?
end
```

**대체하는 것:**
- GDScript: 에디터에서 노드를 자식으로 추가 (코드 외부)
- KAPLAY: `add([sprite(), body(), area()])` (배열 요소로 조합)
- Unity: `AddComponent<Rigidbody>()` / 에디터 Inspector에서 부착
- Bevy: `.insert(SpriteBundle { ... })` 체인

---

### 키워드 5: `signal`

**역할:** 커스텀 이벤트(시그널)를 선언한다. 옵저버 패턴을 언어 수준에서 지원한다.

**왜 키워드여야 하는가:**
- `signal`은 함수도 아니고 변수도 아닌 **선언(declaration)**이다. "이 엔티티는 이런 이벤트를 발생시킬 수 있다"는 계약(contract)을 정의한다.
- 파서가 `signal` 뒤에 시그널 이름과 페이로드 타입을 기대한다. 컴파일러가 `.emit()` 호출 시 인자 타입을 검증할 수 있다.
- GDScript의 `signal` 키워드가 이미 성공적으로 검증한 패턴이다. 게임에서 느슨한 결합(loose coupling)은 필수적이며, 시그널 없이는 모든 통신이 직접 참조로 이루어져 코드가 경직된다.
- LLM이 `signal`을 보면 뒤에 `.emit()`, `.connect()`, `on signal_name` 패턴이 올 것을 예측할 수 있다.

**코드 예시:**
```
entity Player
    has Sprite("hero.png")
    has Body(dynamic)

    health: i32 = 100

    signal damaged(amount: i32)
    signal died

    fn take_damage(amount: i32)
        self.health -= amount
        self.damaged.emit(amount)
        if self.health <= 0
            self.died.emit()
        end
    end
end

-- 다른 곳에서 시그널에 반응
entity HealthBar
    has Sprite("bar.png")

    on enter
        let player = find("Player")
        player.damaged.connect(self.on_player_damaged)
        player.died.connect(self.on_player_died)
    end

    fn on_player_damaged(amount: i32)
        self.update_display()
    end

    fn on_player_died()
        self.play_animation("game_over")
    end
end
```

**대체하는 것:**
- GDScript: `signal health_changed(new_health: int)` (거의 동일 -- 검증된 설계)
- KAPLAY: 시그널 시스템 없음 (콜백 함수 수동 관리)
- LOVE 2D: 시그널 시스템 없음 (직접 구현 필요)

---

## 2. 키워드로 만들지 않는 것들 (함수/라이브러리로 충분)

### `spawn` -- 함수로 충분

**이유:** `spawn`은 단순히 엔티티 인스턴스를 생성하여 월드에 추가하는 동작이다. 특별한 문법 구조가 필요하지 않다.

```
-- 함수로 충분하다
let bullet = spawn(Bullet, at: player.position + vec2(20, 0))
let enemy = spawn(Enemy, at: vec2(400, 100))

-- 키워드로 만들면 오히려 일관성이 깨진다
-- spawn Bullet at vec2(...)   -- 이건 함수 호출과 다른 문법을 학습해야 함
```

**판단:** `spawn`은 `(Entity타입, 키워드인자...)` 형태의 일반 함수 호출로 완벽하게 표현된다. 반환값(`Entity` 인스턴스)도 자연스럽다.

---

### `tween` -- 함수로 충분

**이유:** 트위닝은 "값 A에서 값 B로 시간 T에 걸쳐 보간하는 동작"이다. 함수 체이닝으로 자연스럽게 표현된다.

```
-- 함수로 충분하다
tween(player.position, to: vec2(200, 100), duration: 1.0, ease: out_quad)

-- await와 결합
await tween(door.position, to: vec2(0, -100), duration: 1.0)
play_sound("door_opened")
```

**판단:** `tween`을 키워드로 만들면 `tween player.position to vec2(200, 100) in 1s ease out_quad` 같은 DSL 문법이 필요해진다. 이것은 매력적으로 보이지만, (1) 파서 복잡도를 크게 높이고, (2) LLM이 학습해야 할 고유 문법이 늘어나며, (3) 함수 호출로 동일한 의미를 전달할 수 있다. 키워드 슬롯을 소비할 가치가 없다.

---

### `after` / `every` -- 함수로 충분

**이유:** 지연 실행과 반복 실행은 콜백 함수로 자연스럽게 표현된다.

```
-- 함수로 충분하다
after(2.0, fn() spawn(Enemy) end)
every(0.5, fn() shoot() end)

-- await와 결합하면 더 강력하다
await after(2.0)
spawn(Enemy)

-- 취소 가능
let timer = every(1.0, fn() heal(5) end)
timer.cancel()
```

**판단:** `after 2s { spawn_enemy() }` 같은 키워드 구문은 가독성이 좋지만, `after(2.0, fn() ... end)` 함수 호출로 동일한 기능을 제공할 수 있다. 특히 `await after(2.0)` 패턴은 코루틴과 결합하여 매우 강력하면서도 키워드를 추가하지 않는다.

---

### 상태 기계 (state machine) -- `enum` + `match`로 충분

**이유:** Rust의 `enum` + `match` 패턴이 이미 상태 기계를 완벽하게 표현한다. 별도의 `state` 키워드를 도입하면 키워드 예산을 소모하면서 `enum`/`match`와 기능이 중복된다.

```
-- enum + match로 상태 기계 표현
enum EnemyState
    Idle
    Chase(target: Entity)
    Attack(frame: i32)
    Dead
end

entity Enemy
    has Sprite("enemy.png")
    has Body(dynamic)

    state: EnemyState = EnemyState.Idle
    speed: f32 = 100.0

    on update(dt: f32)
        self.state = match self.state
            is Idle then
                let player = find_nearest("Player")
                if distance(self, player) < 200.0
                    EnemyState.Chase(target: player)
                else
                    EnemyState.Idle
                end

            is Chase(target) then
                move_toward(self, target.position, self.speed * dt)
                if distance(self, target) < 30.0
                    EnemyState.Attack(frame: 0)
                else
                    EnemyState.Chase(target: target)
                end

            is Attack(frame) then
                if frame >= 10
                    EnemyState.Idle
                else
                    EnemyState.Attack(frame: frame + 1)
                end

            is Dead then
                EnemyState.Dead
        end
    end
end
```

**판단:** `state machine { idle { ... } attack { ... } }` 같은 전용 구문은 매력적이지만, (1) `enum` + `match`가 이미 완전성 검사(exhaustiveness check)를 제공하고, (2) 데이터를 가진 변형(data-carrying variants)을 지원하며, (3) Rust에서 검증된 패턴이라 LLM 전이 학습 효과가 크다. 별도 키워드를 추가할 이유가 없다.

**단, 편의를 위해 `on enter_state`, `on exit_state` 같은 생명주기 이벤트를 `on` 키워드로 지원하면, 상태 진입/이탈 시 애니메이션 전환 등을 깔끔하게 처리할 수 있다:**
```
on state_changed(old: EnemyState, new: EnemyState)
    match new
        is Idle then self.play_animation("idle")
        is Chase(_) then self.play_animation("run")
        is Attack(_) then self.play_animation("attack")
        is Dead then self.play_animation("death")
    end
end
```

---

### `destroy` -- 함수로 충분

```
destroy(self)          -- 자기 자신 파괴
destroy(bullet)        -- 특정 엔티티 파괴
destroy_all("Enemy")   -- 태그 기반 일괄 파괴
```

**판단:** 파괴는 단순 동작이다. 문법 구조가 필요하지 않다.

---

### `go` (씬 전환) -- 함수로 충분

```
go(Game, level: 2, score: 150)
go(Menu)
go(GameOver, final_score: score)
```

**판단:** `scene`이 키워드인 이상, 씬 전환은 정의된 씬 타입을 인자로 받는 함수로 충분하다. 컴파일러가 타입 검사를 수행하므로 존재하지 않는 씬으로의 전환을 컴파일 타임에 잡을 수 있다.

---

## 3. 핵심 질문에 대한 답변

### Q1: `entity`는 키워드여야 하는가, `struct`에 특별한 행동을 부여할 수 있는가?

**답: 키워드여야 한다.**

`struct`는 순수 데이터 컨테이너다. `entity`는 다음을 추가로 포함한다:
1. 생명주기 (`on enter`, `on update`, `on draw`, `on exit`)
2. 컴포넌트 부착 (`has`)
3. 시그널 선언 (`signal`)
4. 월드에 스폰/파괴 가능
5. 태그 기반 쿼리 대상

`struct`에 이 모든 것을 "특별한 행동"으로 부여하면, `struct`가 두 가지 완전히 다른 의미를 갖게 되어 LLM 혼란을 유발한다. `entity`와 `struct`가 명확히 분리되면 LLM은 "이것이 데이터인가 게임 오브젝트인가?"를 즉시 판단할 수 있다.

```
-- struct: 순수 데이터. 스폰 불가. 생명주기 없음.
struct Config
    width: i32 = 800
    height: i32 = 600
    fullscreen: bool = false
end

-- entity: 게임 오브젝트. 스폰 가능. 생명주기 있음.
entity Player
    has Sprite("hero.png")
    has Body(dynamic)
    speed: f32 = 200.0

    on update(dt: f32)
        -- ...
    end
end
```

---

### Q2: `scene`은 키워드여야 하는가, 특수한 엔티티인가?

**답: 키워드여야 한다.**

`scene`은 엔티티와 근본적으로 다르다:
1. 스폰되지 않는다 -- `go()`로 진입한다.
2. 파라미터를 받는다 -- `scene Game(level: i32)`.
3. 전환 시 현재 씬의 모든 엔티티가 정리된다.
4. 전체 프로그램의 최상위 조직 단위다.

`entity`의 특수한 형태로 만들면 "씬을 스폰할 수 있나?", "씬에 컴포넌트를 부착할 수 있나?" 같은 혼란이 생긴다.

---

### Q3: `on`은 키워드여야 하는가, `fn`으로 대체할 수 있는가?

**답: 키워드여야 한다.**

`fn`은 "호출자가 명시적으로 부르는 함수"다. `on`은 "엔진/시스템이 특정 이벤트 발생 시 자동으로 호출하는 핸들러"다. 이 구분은 게임 엔진에서 본질적이다.

만약 `fn`으로 통합하면:
```
-- 이 중 어떤 것이 엔진이 자동 호출하고, 어떤 것이 수동 호출인가?
fn update(dt: f32) ...     -- 자동? 수동?
fn take_damage(amount: i32) ...  -- 자동? 수동?
fn on_collide(other: Entity) ... -- 이름만으로 구분? 그러면 "on_" 접두사가 관례가 된다
```

`on` 키워드가 있으면:
```
-- 구분이 100% 명확하다
on update(dt: f32)               -- 엔진이 매 프레임 호출
on collide(other: Entity)        -- 충돌 시 엔진이 호출
fn take_damage(amount: i32)      -- 다른 코드가 수동으로 호출
fn calculate_score(): i32        -- 다른 코드가 수동으로 호출
```

---

### Q4: `spawn`은 키워드여야 하는가, 함수인가?

**답: 함수로 충분하다.** (위의 "키워드로 만들지 않는 것들" 참조)

---

### Q5: 상태 기계는 키워드 구조여야 하는가, `enum`/`match`로 구축할 수 있는가?

**답: `enum`/`match`로 충분하다.** (위의 "키워드로 만들지 않는 것들" 참조)

---

### Q6: `tween`, `after`, `every`는 키워드여야 하는가, 함수인가?

**답: 모두 함수로 충분하다.** (위의 "키워드로 만들지 않는 것들" 참조)

---

## 4. 최종 키워드 예산 계산

### 핵심 언어 키워드 (범용, Go/Rust에도 있는 것들)

| 키워드 | 용도 |
|--------|------|
| `let` | 변수 선언 |
| `fn` | 함수 선언 |
| `struct` | 데이터 구조체 선언 |
| `enum` | 열거형 선언 |
| `if` | 조건문 |
| `else` | 조건문 분기 |
| `match` | 패턴 매칭 |
| `is` | 패턴 매칭 / 타입 검사 |
| `for` | 반복문 |
| `in` | 반복문 / 포함 검사 |
| `while` | 조건 반복문 |
| `return` | 함수 반환 |
| `and` | 논리 AND |
| `or` | 논리 OR |
| `not` | 논리 NOT |
| `true` | 불리언 참 |
| `false` | 불리언 거짓 |
| `none` | Option의 빈 값 |
| `self` | 현재 인스턴스 참조 |
| `mut` | 가변 표시 |

**소계: 20개**

### 게임 도메인 키워드

| 키워드 | 용도 |
|--------|------|
| `entity` | 게임 오브젝트 타입 정의 |
| `scene` | 게임 씬 정의 |
| `on` | 이벤트 핸들러 선언 |
| `has` | 컴포넌트 부착 |
| `signal` | 커스텀 이벤트 선언 |

**소계: 5개**

### 블록 종료

| 키워드 | 용도 |
|--------|------|
| `end` | 블록 종료 (indentation-based를 선택하면 불필요) |

**소계: 0-1개**

---

### 총계: 25-26개

목표 범위 20-30개 내에서 **25개**로, 여유 슬롯이 4-5개 남는다. 이 여유 슬롯은 향후 필요에 따라 다음과 같은 후보에 사용할 수 있다:

| 후보 | 가능성 | 설명 |
|------|--------|------|
| `await` | 높음 | 코루틴/비동기 지원이 필요하면 추가 |
| `yield` | 중간 | 코루틴 중단점. `await`와 함께 검토 |
| `defer` | 중간 | Go 스타일 리소스 정리 |
| `pub` | 중간 | 접근 제어 (Go의 대문자 관례 대신) |
| `import` | 높음 | 모듈 시스템 |

---

## 5. 전체 조합 예시: 완전한 게임 코드

```
-- game.vibe: Vibe 언어로 작성된 간단한 플랫포머

-- 데이터 정의 (struct)
struct Config
    gravity: f32 = 980.0
    max_enemies: i32 = 10
end

-- 상태 정의 (enum)
enum PlayerState
    Idle
    Running(speed: f32)
    Jumping(velocity: f32)
    Dead
end

-- 엔티티 정의 (entity + has + on + signal)
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
        let dir = input.axis("left", "right")

        self.state = match self.state
            is Idle then
                if dir != 0.0
                    PlayerState.Running(speed: self.speed)
                else if input.just_pressed("jump") and self.is_on_floor()
                    PlayerState.Jumping(velocity: -self.jump_force)
                else
                    PlayerState.Idle
                end

            is Running(speed) then
                self.velocity.x = dir * speed
                if not input.pressed("move")
                    PlayerState.Idle
                else if input.just_pressed("jump") and self.is_on_floor()
                    PlayerState.Jumping(velocity: -self.jump_force)
                else
                    PlayerState.Running(speed: speed)
                end

            is Jumping(velocity) then
                let new_vel = velocity + Config.gravity * dt
                if self.is_on_floor()
                    PlayerState.Idle
                else
                    PlayerState.Jumping(velocity: new_vel)
                end

            is Dead then
                PlayerState.Dead
        end
    end

    on collide(other: Entity, col: Collision)
        if other is Enemy
            if col.direction == Direction.Bottom
                destroy(other)
                self.velocity.y = -self.jump_force * 0.5
            else
                self.take_damage(10)
            end
        end
    end

    fn take_damage(amount: i32)
        self.health -= amount
        self.damaged.emit(amount)
        if self.health <= 0
            self.state = PlayerState.Dead
            self.died.emit()
        end
    end
end

entity Enemy
    has Sprite("enemy.png")
    has Body(dynamic)
    has Collider(box)

    speed: f32 = 50.0

    on update(dt: f32)
        self.velocity.x = -self.speed
    end
end

entity Coin
    has Sprite("coin.png")
    has Collider(circle)

    value: i32 = 10

    on enter
        self.play_animation("spin")
    end

    on collide(other: Entity, col: Collision)
        if other is Player
            score += self.value
            play_sound("collect")
            destroy(self)
        end
    end
end

-- 씬 정의 (scene)
scene Game(level: i32 = 1)
    let score: i32 = 0

    on enter
        load_map("level_{level}.tmx")
        let player = spawn(Player, at: vec2(100, 200))
        player.died.connect(fn() go(GameOver, final_score: score) end)

        every(2.0, fn()
            let x = rand_f32(0.0, 800.0)
            spawn(Enemy, at: vec2(x, 0.0))
        end)
    end

    on update(dt: f32)
        if all_dead("Enemy") and all_dead("Coin")
            go(Game, level: level + 1)
        end
    end
end

scene Menu
    on enter
        spawn(Title, at: vec2(400, 200))
    end

    on input(key: Key)
        match key
            is Enter then go(Game)
            is Escape then quit()
        end
    end
end

scene GameOver(final_score: i32 = 0)
    on enter
        spawn(Text, at: vec2(400, 200), content: "Game Over!")
        spawn(Text, at: vec2(400, 260), content: "Score: {final_score}")
    end

    on input(key: Key)
        match key
            is Enter then go(Menu)
        end
    end
end
```

---

## 6. 요약

| 게임 키워드 | 필수 여부 | 이유 |
|-------------|-----------|------|
| `entity` | **필수** | 게임 오브젝트 타입 정의. `struct`와 명확히 구분 필요. 생명주기 + 컴포넌트 + 시그널 포함 |
| `scene` | **필수** | 게임의 최상위 조직 단위. 생명주기 + 전환 메커니즘 + 파라미터 전달 |
| `on` | **필수** | 이벤트 핸들러 선언. `fn`과의 의미 구분이 게임 엔진에서 본질적 |
| `has` | **필수** | 컴포넌트 부착. 필드 선언과 명확히 구분. 엔진 시스템 등록을 의미 |
| `signal` | **필수** | 커스텀 이벤트 선언. 느슨한 결합의 핵심. GDScript에서 검증 |
| `spawn` | 함수 | 문법 구조 불필요. `spawn(Type, ...)` 함수 호출로 충분 |
| `tween` | 함수 | 함수 호출 + `await`로 충분. DSL 문법은 파서 복잡도만 증가 |
| `after`/`every` | 함수 | 콜백 함수 또는 `await` 패턴으로 충분 |
| `state` | `enum`+`match` | Rust 패턴이 이미 완전성 검사 + 데이터 변형 제공 |
| `destroy` | 함수 | 단순 동작. 문법 구조 불필요 |
| `go` | 함수 | `scene` 타입을 인자로 받는 함수로 충분 |

**최종: 5개의 게임 도메인 키워드 (`entity`, `scene`, `on`, `has`, `signal`)**

이 5개 키워드가 Vibe를 "범용 언어"에서 "게임 언어"로 전환시키는 핵심 차별점이다. 나머지는 모두 함수/라이브러리로 제공하여 키워드 예산을 보존한다.
