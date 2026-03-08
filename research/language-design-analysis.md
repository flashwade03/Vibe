# Vibe 언어 설계를 위한 참조 언어 심층 분석

> 목표: LLM이 100% 정확하게 이해하고 생성할 수 있는 게임 엔진 언어 "Vibe" 설계를 위한 기반 연구

---

## 1. GDScript 심층 분석

### 1.1 최고의 설계 결정들

#### (a) 노드/씬 시스템과 언어의 일체화

GDScript의 가장 탁월한 결정은 **언어와 엔진 아키텍처의 완전한 통합**이다. 스크립트 하나가 곧 노드 하나의 행동을 정의한다.

```gdscript
# Player.gd — 이 스크립트 자체가 Player 노드의 정의
extends CharacterBody2D

@export var speed: float = 200.0
@export var jump_force: float = -400.0

func _physics_process(delta: float) -> void:
    var direction := Input.get_axis("move_left", "move_right")
    velocity.x = direction * speed

    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_force

    velocity.y += gravity * delta
    move_and_slide()
```

**왜 좋은가?**
- "이 파일은 무엇을 하는가?"가 첫 줄(`extends CharacterBody2D`)에서 즉시 드러남
- LLM 관점에서 컨텍스트 윈도우에 파일 하나만 넣으면 해당 엔티티의 전체 행동을 이해할 수 있음
- `_physics_process`, `_ready`, `_input` 등 생명주기 함수가 명시적이고 예측 가능

#### (b) 시그널 시스템: 관찰자 패턴의 언어 수준 지원

GDScript의 시그널은 게임 개발에서 가장 흔한 패턴인 **이벤트 기반 통신**을 언어의 일급 시민으로 만들었다.

```gdscript
# Godot 4 스타일
signal health_changed(new_health: int)
signal died

var health: int = 100

func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health)
    if health <= 0:
        died.emit()

# 연결하는 쪽
func _ready() -> void:
    player.health_changed.connect(_on_player_health_changed)
    player.died.connect(_on_player_died)

func _on_player_health_changed(new_health: int) -> void:
    health_bar.value = new_health
```

**Vibe가 가져가야 할 것:**
- 시그널 선언이 클래스 상단에 명시적으로 보임
- `.connect()`, `.emit()` 패턴이 직관적
- 타입 정보가 시그널 인자에 포함됨

#### (c) @export 데코레이터를 통한 에디터 통합

```gdscript
@export var speed: float = 200.0
@export_range(0, 100) var health: int = 100
@export var bullet_scene: PackedScene
@export_enum("Warrior", "Mage", "Rogue") var character_class: int
```

에디터에서 값을 조정할 수 있는 변수를 언어 수준에서 선언하는 것은 게임 엔진 언어에서 매우 강력한 패턴이다.

### 1.2 최악의 설계 결정들

#### (a) "선택적" 타입 시스템의 혼란

```gdscript
# 이 세 가지가 모두 유효한 GDScript다
var x = 10           # 타입 없음
var y: int = 10      # 타입 명시
var z := 10          # 타입 추론

# 함수도 마찬가지
func foo(a, b):      # 인자 타입 없음
    return a + b

func bar(a: int, b: int) -> int:  # 타입 있음
    return a + b
```

**왜 나쁜가?**
- LLM이 "이 코드에 타입을 넣어야 하나 말아야 하나?"를 매번 판단해야 함
- 같은 의미를 표현하는 방법이 3가지 이상 → LLM 생성의 비결정성 증가
- **Vibe 교훈: 타입은 항상 필수이거나, 항상 추론이거나, 하나만 선택해야 한다**

#### (b) 순환 참조 문제

```gdscript
# PlayerManager.gd
var player: Player  # Player.gd가 PlayerManager를 참조하면 → 파싱 에러!

# 이건 컴파일러 한계가 아니라 설계 실수다
```

#### (c) 에러 처리의 부재

GDScript에는 `try/catch`도, `Result` 타입도, 체계적 에러 처리 메커니즘이 없다.

```gdscript
# 파일 열기가 실패하면? 그냥 런타임에 크래시
var file = FileAccess.open("user://save.dat", FileAccess.READ)
# file이 null일 수 있는데 컴파일러가 검사하지 않음
var data = file.get_as_text()  # null이면 크래시
```

#### (d) 접근 제어자 완전 부재

```gdscript
# 모든 것이 public. private, protected 없음.
# 관례적으로 _를 붙이지만 강제가 아님
var _internal_state = 0  # "private"인 척하지만 외부에서 접근 가능
```

### 1.3 Vibe가 GDScript에서 가져갈 것 / 버릴 것

| 가져갈 것 | 버릴 것 |
|-----------|---------|
| 생명주기 함수 패턴 (`_ready`, `_update`) | 선택적 타입 시스템 |
| 시그널 시스템 (일급 이벤트) | 상속 기반 노드 확장 (컴포지션으로 대체) |
| @export 패턴 (에디터 통합) | 에러 처리 부재 |
| 파일 = 엔티티 행동 원칙 | 순환 참조 제한 |
| 파이썬 유사 가독성 | 암묵적 null 허용 |

---

## 2. Go의 "한 가지 방법" 철학

### 2.1 Go가 단순성을 강제하는 방법

Go의 핵심 원칙은 Rob Pike의 말로 요약된다: **"단순함은 복잡하다 (Simplicity is Complicated)."**

Go는 기능을 추가하지 않음으로써 단순성을 달성한다. 다른 언어들이 "할 수 있다"에 집중할 때, Go는 "하지 않는다"에 집중한다.

#### 제거된 것들:
- 클래스와 상속 → 구조체 + 인터페이스 + 컴포지션
- 삼항 연산자 (`? :`) → `if/else`만 사용
- 예외 (exceptions) → 명시적 에러 반환
- 제네릭 (1.18 이전) → 구체적 타입 + `interface{}`
- 매크로 → 없음
- 함수 오버로딩 → 없음
- 기본 인자 (default parameters) → 없음

### 2.2 LLM에게 Go가 우호적인 구체적 이유

#### (a) gofmt: 모든 코드가 동일한 형태

```go
// 모든 Go 코드가 이 형태. 탭 vs 스페이스 논쟁 없음.
// 중괄호 위치, 들여쓰기, 줄바꿈이 모두 결정됨.
func SpawnEnemy(pos Vector2, health int) *Enemy {
    e := &Enemy{
        Position: pos,
        Health:   health,
        State:    StateIdle,
    }
    return e
}
```

**LLM 관점에서 왜 중요한가?**
- 훈련 데이터에서 동일한 패턴을 반복적으로 학습 → 생성 정확도 극대화
- "이 코드를 어떤 스타일로 쓸까?"라는 판단이 제거됨
- 토큰 예측 시 분기가 줄어듦

#### (b) 명시적 에러 처리

```go
// Go 방식 — 에러가 보인다
file, err := os.Open("save.dat")
if err != nil {
    return fmt.Errorf("failed to open save: %w", err)
}
defer file.Close()

data, err := io.ReadAll(file)
if err != nil {
    return fmt.Errorf("failed to read save: %w", err)
}
```

**LLM 관점:** 모든 실패 가능한 연산 후에 `if err != nil` 패턴이 나온다. 이 패턴은 100% 예측 가능하다. LLM은 이 패턴을 절대 빼먹지 않는다.

#### (c) 인터페이스의 암묵적 구현 (Structural Typing)

```go
// 인터페이스 정의
type Drawable interface {
    Draw(screen *Screen)
}

// Player는 "implements Drawable"를 선언하지 않는다.
// Draw 메서드만 있으면 자동으로 Drawable이다.
type Player struct {
    Sprite Texture
    Pos    Vector2
}

func (p *Player) Draw(screen *Screen) {
    screen.DrawTexture(p.Sprite, p.Pos)
}
```

**장점:** 의존성 방향이 명확해지고, 인터페이스를 사용하는 쪽에서 정의할 수 있다.

### 2.3 Go 방식의 게임 엔진 맥락에서의 단점

#### (a) 에러 처리 보일러플레이트의 과다

게임 엔진에서는 매 프레임 수백 번의 연산이 일어난다. 매번 `if err != nil`을 쓰면:

```go
func (g *Game) Update() error {
    pos, err := g.Player.GetPosition()
    if err != nil {
        return err
    }
    vel, err := g.Player.GetVelocity()
    if err != nil {
        return err
    }
    newPos, err := physics.Apply(pos, vel, g.DeltaTime)
    if err != nil {
        return err
    }
    // ... 이게 50줄 더 이어진다
}
```

**게임에서는 대부분의 연산이 실패하지 않아야 한다.** 에러 처리가 핫 패스를 오염시키면 안 된다.

#### (b) 제네릭의 제한 (개선되었지만 아직 약함)

게임 수학에서 벡터, 행렬, 쿼터니언 연산은 타입별로 동일한 로직이 필요하다:

```go
// Go에서 Vec2[float32]와 Vec2[float64]를 다루려면
type Vec2[T float32 | float64] struct {
    X, Y T
}

func Add[T float32 | float64](a, b Vec2[T]) Vec2[T] {
    return Vec2[T]{a.X + b.X, a.Y + b.Y}
}
// 가능하긴 하지만 연산자 오버로딩이 없어서 a + b가 아니라 Add(a, b)
```

#### (c) GC (가비지 컬렉터) 문제

Go의 GC는 게임의 실시간 프레임 루프와 충돌할 수 있다. 16.6ms (60fps) 안에 프레임을 완료해야 하는데, GC 스탑더월드가 끼어들면 프레임 스파이크가 발생한다.

### 2.4 Vibe가 Go에서 가져갈 것

| 가져갈 것 | 주의할 점 |
|-----------|-----------|
| 강제 포매터 (vibeformat) | - |
| "한 가지 방법" 원칙 | 게임 특화 단축 문법은 허용 |
| 구조체 + 인터페이스 (no 클래스) | 암묵적 인터페이스 vs 명시적 선택 필요 |
| `defer` 문 | 리소스 정리에 유용 |
| 간결한 문법 | 에러 처리는 게임에 맞게 재설계 |
| 대문자 = public 관례 | 가독성은 좋지만 게임에 맞는지 재고 필요 |

---

## 3. Rust 타입 시스템 — 선별적 차용

### 3.1 게임 언어에 가장 가치 있는 부분들

#### (a) enum + match: 상태 기계의 완벽한 표현

게임 개발에서 상태 기계(FSM)는 가장 흔한 패턴이다. Rust의 enum + match는 이것을 가장 안전하게 표현한다:

```rust
enum PlayerState {
    Idle,
    Running { speed: f32 },
    Jumping { velocity: f32, air_time: f32 },
    Attacking { animation: AnimId, frame: u32 },
    Dead,
}

fn update_player(state: &mut PlayerState, input: &Input, dt: f32) {
    *state = match state {
        PlayerState::Idle => {
            if input.move_dir.length() > 0.1 {
                PlayerState::Running { speed: 100.0 }
            } else if input.jump_pressed {
                PlayerState::Jumping { velocity: -400.0, air_time: 0.0 }
            } else {
                PlayerState::Idle
            }
        }
        PlayerState::Jumping { velocity, air_time } => {
            let new_vel = *velocity + GRAVITY * dt;
            if *air_time > MAX_AIR_TIME {
                PlayerState::Idle
            } else {
                PlayerState::Jumping {
                    velocity: new_vel,
                    air_time: air_time + dt,
                }
            }
        }
        // 컴파일러가 모든 상태를 처리했는지 검사한다!
        // Dead를 빼먹으면 컴파일 에러
        PlayerState::Running { speed } => { /* ... */ PlayerState::Idle }
        PlayerState::Attacking { .. } => { /* ... */ PlayerState::Idle }
        PlayerState::Dead => PlayerState::Dead,
    };
}
```

**왜 탁월한가?**
- **완전성 검사 (exhaustiveness check)**: 새 상태를 추가하면 모든 match가 컴파일 에러를 뱉는다 → 빼먹을 수 없다
- **데이터를 가진 변형 (data-carrying variants)**: `Running { speed: f32 }`처럼 각 상태가 자체 데이터를 가짐
- LLM이 "어떤 상태를 처리해야 하는가?"를 100% 결정론적으로 알 수 있음

#### (b) Option과 Result: null과 예외의 안전한 대안

```rust
// null 대신 Option
fn find_enemy(id: EntityId) -> Option<&Enemy> {
    enemies.get(id)  // Some(&enemy) 또는 None
}

// 사용: 처리를 강제
match find_enemy(target_id) {
    Some(enemy) => attack(enemy),
    None => log::warn!("Enemy not found"),
}

// 또는 간결하게
if let Some(enemy) = find_enemy(target_id) {
    attack(enemy);
}

// Result: 실패 가능한 연산
fn load_level(path: &str) -> Result<Level, LoadError> {
    let data = fs::read(path)?;   // ?로 에러 전파
    let level = parse_level(&data)?;
    Ok(level)
}
```

**핵심 통찰:** `?` 연산자가 Go의 `if err != nil` 보일러플레이트를 한 글자로 줄인다.

#### (c) Trait: 행동의 명시적 계약

```rust
trait Drawable {
    fn draw(&self, renderer: &mut Renderer);
}

trait Updatable {
    fn update(&mut self, dt: f32);
}

// 컴포지션으로 여러 trait 구현
struct Player {
    pos: Vec2,
    sprite: Sprite,
    health: i32,
}

impl Drawable for Player {
    fn draw(&self, renderer: &mut Renderer) {
        renderer.draw_sprite(&self.sprite, self.pos);
    }
}

impl Updatable for Player {
    fn update(&mut self, dt: f32) {
        // 물리 업데이트
    }
}
```

### 3.2 LLM 이해에 적극적으로 유해한 부분들

#### (a) 라이프타임: LLM의 최악의 적

```rust
// LLM이 이걸 정확하게 생성할 확률은 매우 낮다
struct GameWorld<'a> {
    entities: Vec<Entity<'a>>,
    renderer: &'a mut Renderer,
}

impl<'a> GameWorld<'a> {
    fn get_entity_near<'b>(&'b self, pos: Vec2) -> Option<&'b Entity<'a>>
    where
        'a: 'b,
    {
        // ...
    }
}
```

**왜 유해한가?**
- `'a`, `'b` 같은 라이프타임 주석은 **코드의 의미가 아니라 컴파일러 힌트**
- LLM이 "어떤 라이프타임이 어떤 참조에 연결되어야 하는가?"를 정확하게 추론하기 극히 어려움
- 하나만 틀리면 20줄짜리 컴파일 에러 발생
- **결론: Vibe에서는 라이프타임을 절대 도입하지 말 것**

#### (b) 복잡한 제네릭과 where 절

```rust
// LLM이 이런 코드를 정확하게 생성하기는 매우 어렵다
fn process_entities<T, I, F>(iter: I, processor: F) -> Vec<T>
where
    I: Iterator<Item = &dyn Entity>,
    F: Fn(&dyn Entity) -> Option<T>,
    T: Clone + Send + 'static,
{
    iter.filter_map(processor).collect()
}
```

#### (c) 매크로 시스템 (macro_rules!, proc_macro)

```rust
// 이건 사실상 다른 언어다
macro_rules! impl_component {
    ($($t:ty),*) => {
        $(
            impl Component for $t {
                fn type_id() -> TypeId { TypeId::of::<$t>() }
            }
        )*
    }
}
```

LLM이 매크로를 정확하게 생성할 확률은 낮고, 매크로가 있는 코드를 읽는 것도 어렵다. **Vibe에서는 매크로 대신 컴파일 타임 코드 실행(Zig의 comptime처럼)이나 코드 생성으로 대체해야 한다.**

### 3.3 Rust의 안전성을 Rust의 복잡성 없이 얻는 방법

| Rust 기능 | Vibe 대안 |
|-----------|-----------|
| 라이프타임 + 빌림 검사기 | 값 타입 기본 + 참조 카운팅(RC) 또는 아레나 할당 |
| `Option<T>` | `T?` 문법 (nullable 타입 명시, 접근 시 검사 강제) |
| `Result<T, E>` | `T ! E` 문법 + `?` 전파 연산자 |
| `enum` + `match` | 완전히 채택 (Vibe의 핵심 기능) |
| `trait` | `interface` (Go 스타일 + 명시적 구현 선언) |
| 제네릭 | 단순한 형태만 (`List[T]`, `Map[K, V]` 수준) |
| 매크로 | 없음. 컴파일 타임 함수로 대체 |

---

## 4. Lua의 미니멀리즘

### 4.1 Lua가 내장 게임 언어로 성공한 이유

#### (a) 극단적으로 작은 크기
- VM 전체가 ~200KB
- 의존성 제로
- C API가 매우 단순 (스택 기반, ~50개 함수)

```c
// C에서 Lua 함수 호출: 이것만 알면 된다
lua_getglobal(L, "on_player_hit");
lua_pushnumber(L, damage);
lua_pcall(L, 1, 0, 0);
```

#### (b) 테이블: 모든 것의 기반

Lua의 천재적인 결정은 **하나의 데이터 구조(테이블)로 배열, 딕셔너리, 객체, 모듈, 네임스페이스를 모두 표현**한다는 것이다:

```lua
-- 배열
local enemies = {"goblin", "orc", "dragon"}

-- 딕셔너리/객체
local player = {
    name = "Hero",
    health = 100,
    pos = {x = 0, y = 0},
}

-- 메서드가 있는 "객체"
function player:take_damage(amount)
    self.health = self.health - amount
    if self.health <= 0 then
        self:die()
    end
end
```

#### (c) 코루틴: 게임에 딱 맞는 비동기

```lua
-- 적 AI 행동을 코루틴으로 자연스럽게 표현
function enemy_patrol(enemy)
    while true do
        move_to(enemy, patrol_point_a)
        coroutine.yield()  -- 다음 프레임까지 대기

        wait_seconds(2.0)
        coroutine.yield()

        move_to(enemy, patrol_point_b)
        coroutine.yield()

        wait_seconds(2.0)
        coroutine.yield()
    end
end
```

### 4.2 Lua의 치명적 결함

#### (a) 1-기반 인덱싱: 프로그래밍 세계와의 불일치

```lua
local items = {"sword", "shield", "potion"}
print(items[1])  -- "sword" ... 모든 다른 언어에서는 items[0]

-- 이런 코드에서 버그가 끊임없이 발생
for i = 1, #items do  -- 0이 아니라 1부터!
    process(items[i])
end
```

LLM이 Lua 코드를 생성할 때 **1-기반 인덱싱을 잊는 것은 가장 흔한 버그 중 하나**다. 다른 언어 데이터와 인터페이스할 때 항상 +-1 변환이 필요하다.

#### (b) 실질적 타입 시스템의 부재

```lua
-- 함수가 뭘 받고 뭘 반환하는지 알 수 없다
function create_enemy(config)
    -- config가 뭔데? 어떤 필드가 있어야 하는데?
    local enemy = {}
    enemy.health = config.health or 100  -- config.health가 없으면? 그냥 100
    enemy.speed = config.speed or 50     -- 타이포: config.speeed → 에러 없이 nil
    return enemy
end
```

**LLM 관점에서 치명적:** 함수 시그니처만 보고는 무엇을 넘겨야 하는지 알 수 없다. 문서나 코드 전체를 읽어야 한다.

#### (c) 메타테이블의 암묵적 복잡성

```lua
-- Lua의 "OOP": 메타테이블로 상속을 흉내낸다
local Entity = {}
Entity.__index = Entity

function Entity.new(x, y)
    local self = setmetatable({}, Entity)
    self.x = x
    self.y = y
    return self
end

function Entity:update(dt)
    -- 기본 구현
end

-- "상속"
local Player = setmetatable({}, {__index = Entity})
Player.__index = Player

function Player.new(x, y, name)
    local self = Entity.new(x, y)
    setmetatable(self, Player)
    self.name = name
    return self
end
```

이 패턴은:
- 매번 다르게 작성된다 (표준 패턴이 없음)
- LLM이 생성할 때 `__index`, `setmetatable` 순서를 자주 틀림
- 디버깅이 어려움 (메타테이블 체인 추적)

### 4.3 "타입드 Lua"가 어떤 모습일까?

기존 시도들 (Teal, TypeScriptToLua, Haxe→Lua 타겟)의 장단점을 분석하면:

```
-- 가상의 "Typed Lua" 문법
-- Teal 스타일 + 게임 최적화

type Vec2 = record
    x: number
    y: number
end

type PlayerState = enum
    "idle"
    "running"
    "jumping"
end

type Player = record
    pos: Vec2
    health: integer
    state: PlayerState
    speed: number
end

function Player:update(dt: number): void
    if self.state == "running" then
        self.pos.x = self.pos.x + self.speed * dt
    end
end
```

**결론:** Teal의 접근(최소한의 타입 추가)이 Lua의 장점을 유지하면서 약점을 보완하지만, Vibe는 **처음부터 타입을 설계에 포함**하므로 Lua의 제약에서 자유롭다.

---

## 5. 구문 비교: 동일한 게임 로직을 5개 언어로

### 5.1 엔티티 스폰

#### GDScript
```gdscript
func spawn_enemy(pos: Vector2, enemy_type: String) -> Enemy:
    var enemy = Enemy.new()
    enemy.position = pos
    enemy.health = 100
    enemy.enemy_type = enemy_type
    add_child(enemy)
    return enemy
```

#### Lua
```lua
function spawn_enemy(pos_x, pos_y, enemy_type)
    local enemy = {
        x = pos_x,
        y = pos_y,
        health = 100,
        enemy_type = enemy_type,
    }
    table.insert(world.enemies, enemy)
    return enemy
end
```

#### Go
```go
func SpawnEnemy(world *World, pos Vec2, enemyType EnemyType) *Enemy {
    enemy := &Enemy{
        Pos:       pos,
        Health:    100,
        EnemyType: enemyType,
    }
    world.Entities = append(world.Entities, enemy)
    return enemy
}
```

#### Rust
```rust
fn spawn_enemy(world: &mut World, pos: Vec2, enemy_type: EnemyType) -> EntityId {
    let enemy = Enemy {
        pos,
        health: 100,
        enemy_type,
    };
    world.spawn(enemy)
}
```

#### Python
```python
def spawn_enemy(world: World, pos: Vec2, enemy_type: EnemyType) -> Enemy:
    enemy = Enemy(pos=pos, health=100, enemy_type=enemy_type)
    world.add_entity(enemy)
    return enemy
```

#### 분석

| 기준 | GDScript | Lua | Go | Rust | Python |
|------|----------|-----|----|------|--------|
| 타입 명확성 | 부분적 | 없음 | 완전 | 완전 | 힌트만 |
| LLM 예측 용이성 | 높음 | 낮음 | 매우 높음 | 높음 | 중간 |
| 보일러플레이트 | 중간 | 낮음 | 중간 | 낮음 | 낮음 |
| 비모호성 | 중간 | 낮음 | 높음 | 매우 높음 | 중간 |

### 5.2 충돌 처리

#### GDScript
```gdscript
func _on_body_entered(body: Node2D) -> void:
    if body is Player:
        var player := body as Player
        player.take_damage(10)
        queue_free()
```

#### Lua
```lua
function on_collision(self, other)
    if other.tag == "player" then
        other:take_damage(10)
        destroy(self)
    end
end
```

#### Go
```go
func (b *Bullet) OnCollision(other Entity) {
    if player, ok := other.(*Player); ok {
        player.TakeDamage(10)
        b.Destroy()
    }
}
```

#### Rust
```rust
fn on_collision(bullet: Entity, other: Entity, world: &mut World) {
    if let Some(player) = world.get_component::<Player>(other) {
        player.take_damage(10);
        world.despawn(bullet);
    }
}
```

#### Python
```python
def on_collision(self, other: Entity) -> None:
    if isinstance(other, Player):
        other.take_damage(10)
        self.destroy()
```

#### 분석

**가장 비모호한 순서: Rust > Go > GDScript > Python > Lua**

- **Rust**: 타입 캐스팅이 `if let Some`으로 명시적이고, 실패 경로가 보임
- **Go**: 타입 어서션 `other.(*Player)`가 명시적이고, ok 패턴으로 안전
- **GDScript**: `is`/`as` 패턴이 직관적이지만 `as`가 실패 시 null 반환
- **Lua**: `other.tag == "player"` 문자열 비교 → 타이포 시 무소음 실패

### 5.3 상태 기계 (FSM)

#### GDScript
```gdscript
enum State { IDLE, RUN, JUMP, ATTACK }
var current_state: State = State.IDLE

func _physics_process(delta: float) -> void:
    match current_state:
        State.IDLE:
            if Input.is_action_pressed("move"):
                current_state = State.RUN
            elif Input.is_action_just_pressed("jump"):
                current_state = State.JUMP
        State.RUN:
            velocity.x = direction * speed
            if not Input.is_action_pressed("move"):
                current_state = State.IDLE
        State.JUMP:
            velocity.y += gravity * delta
            if is_on_floor():
                current_state = State.IDLE
        State.ATTACK:
            if animation_finished:
                current_state = State.IDLE
```

#### Lua
```lua
local State = { IDLE = 1, RUN = 2, JUMP = 3, ATTACK = 4 }

local state_handlers = {
    [State.IDLE] = function(self, dt)
        if input.is_pressed("move") then
            self.state = State.RUN
        elseif input.just_pressed("jump") then
            self.state = State.JUMP
        end
    end,
    [State.RUN] = function(self, dt)
        self.vel_x = self.direction * self.speed
        if not input.is_pressed("move") then
            self.state = State.IDLE
        end
    end,
    -- ... 더 많은 상태 ...
}

function player_update(self, dt)
    local handler = state_handlers[self.state]
    if handler then handler(self, dt) end
end
```

#### Go
```go
type PlayerState int

const (
    StateIdle PlayerState = iota
    StateRun
    StateJump
    StateAttack
)

func (p *Player) Update(dt float32) {
    switch p.State {
    case StateIdle:
        if input.IsPressed("move") {
            p.State = StateRun
        } else if input.JustPressed("jump") {
            p.State = StateJump
        }
    case StateRun:
        p.Velocity.X = p.Direction * p.Speed
        if !input.IsPressed("move") {
            p.State = StateIdle
        }
    case StateJump:
        p.Velocity.Y += Gravity * dt
        if p.IsOnFloor() {
            p.State = StateIdle
        }
    case StateAttack:
        if p.AnimationFinished {
            p.State = StateIdle
        }
    }
}
```

#### Rust
```rust
enum PlayerState {
    Idle,
    Run { speed: f32 },
    Jump { velocity: f32 },
    Attack { frame: u32 },
}

fn update(state: &PlayerState, input: &Input, dt: f32) -> PlayerState {
    match state {
        PlayerState::Idle => {
            if input.is_pressed("move") {
                PlayerState::Run { speed: 200.0 }
            } else if input.just_pressed("jump") {
                PlayerState::Jump { velocity: -400.0 }
            } else {
                PlayerState::Idle
            }
        }
        PlayerState::Run { speed } => {
            if !input.is_pressed("move") {
                PlayerState::Idle
            } else {
                PlayerState::Run { speed: *speed }
            }
        }
        PlayerState::Jump { velocity } => {
            let new_vel = velocity + GRAVITY * dt;
            if is_on_floor() {
                PlayerState::Idle
            } else {
                PlayerState::Jump { velocity: new_vel }
            }
        }
        PlayerState::Attack { frame } => {
            if *frame >= MAX_ATTACK_FRAMES {
                PlayerState::Idle
            } else {
                PlayerState::Attack { frame: frame + 1 }
            }
        }
    }
}
```

#### Python
```python
from enum import Enum, auto

class PlayerState(Enum):
    IDLE = auto()
    RUN = auto()
    JUMP = auto()
    ATTACK = auto()

def update(player: Player, dt: float) -> None:
    match player.state:
        case PlayerState.IDLE:
            if input.is_pressed("move"):
                player.state = PlayerState.RUN
            elif input.just_pressed("jump"):
                player.state = PlayerState.JUMP
        case PlayerState.RUN:
            player.velocity.x = player.direction * player.speed
            if not input.is_pressed("move"):
                player.state = PlayerState.IDLE
        case PlayerState.JUMP:
            player.velocity.y += GRAVITY * dt
            if player.is_on_floor():
                player.state = PlayerState.IDLE
        case PlayerState.ATTACK:
            if player.animation_finished:
                player.state = PlayerState.IDLE
```

#### 핵심 분석

**Rust의 enum이 압도적으로 우수하다.**

이유:
1. **각 상태가 자체 데이터를 소유**: `Jump { velocity: f32 }` — 다른 언어에서는 별도의 변수로 관리
2. **완전성 검사**: 새 상태를 추가하면 컴파일러가 모든 match를 업데이트하도록 강제
3. **상태 전환이 값 반환**: `update`가 새 상태를 반환 → 상태 전환이 순수 함수

**LLM 우호도 순위: Rust > Go > Python > GDScript > Lua**

- Rust: 패턴이 완전히 결정론적, 상태 빼먹기 불가
- Go: switch + iota가 예측 가능하지만 데이터 연관이 없음
- Python: match/case가 3.10+에서 도입, LLM 훈련 데이터에 아직 적음
- Lua: 테이블 기반 핸들러는 동적이라 LLM이 실수하기 쉬움

### 5.4 애니메이션

#### GDScript
```gdscript
func play_attack_animation() -> void:
    sprite.play("attack")
    await sprite.animation_finished
    sprite.play("idle")
```

#### Lua (코루틴 활용)
```lua
function play_attack_animation(sprite)
    sprite:play("attack")
    while not sprite:is_finished() do
        coroutine.yield()
    end
    sprite:play("idle")
end
```

#### Go
```go
// Go에서 비동기 애니메이션은 어색하다
func (s *Sprite) PlayAttackAnimation(done chan struct{}) {
    s.Play("attack")
    // 별도 고루틴에서 완료 감시
    go func() {
        for !s.IsFinished() {
            time.Sleep(16 * time.Millisecond)
        }
        s.Play("idle")
        done <- struct{}{}
    }()
}
```

#### Rust (async)
```rust
async fn play_attack_animation(sprite: &mut Sprite) {
    sprite.play("attack");
    sprite.wait_finished().await;
    sprite.play("idle");
}
```

#### Python
```python
async def play_attack_animation(sprite: Sprite) -> None:
    sprite.play("attack")
    await sprite.animation_finished()
    sprite.play("idle")
```

#### 분석

**GDScript의 `await`가 가장 깔끔하다.** Lua의 코루틴, Go의 채널은 게임 애니메이션 맥락에서 과도하거나 어색하다.

**Vibe를 위한 교훈:** 게임 특화 비동기(`await signal`, `await timer(2.0)`)는 반드시 언어 수준에서 지원해야 한다.

---

## 6. 다른 언어들의 숨겨진 보석

### 6.1 Odin: 게임 개발자를 위해 설계된 언어

#### (a) 암묵적 컨텍스트 시스템

Odin의 가장 혁신적인 기능이다. **모든 함수가 암묵적으로 `context` 매개변수를 받는다:**

```odin
// context에는 할당자, 로거, 사용자 데이터가 포함
Context :: struct {
    allocator:      Allocator,
    temp_allocator: Allocator,
    logger:         Logger,
    user_ptr:       rawptr,
    user_index:     int,
}

// 함수를 호출할 때 자동으로 전달
process_entities :: proc(entities: []Entity) {
    // context.allocator가 자동으로 사용 가능
    temp := make([]f32, len(entities))  // context.allocator 사용
    defer delete(temp)
    // ...
}

// 특정 스코프에서 할당자 변경
{
    context.allocator = arena_allocator
    process_entities(entities)  // 이 호출에서는 arena 사용
}
```

**Vibe에 대한 시사점:** 게임 엔진에서는 할당자, 렌더러, 오디오 시스템 같은 "글로벌 서비스"가 자주 필요하다. 매번 매개변수로 전달하면 보일러플레이트가 폭발한다. Odin의 컨텍스트 시스템은 이 문제를 깔끔하게 해결한다.

#### (b) 내장 벡터/행렬 연산

```odin
// 배열이 곧 벡터. 연산자 오버로딩 없이 벡터 수학!
Vector3 :: [3]f32

a: Vector3 = {1, 2, 3}
b: Vector3 = {4, 5, 6}
c := a + b        // {5, 7, 9}
d := a * 2.0      // {2, 4, 6}

// 스위즐링!
pos: Vector3 = {10, 20, 30}
xy := pos.xy     // [2]f32{10, 20}
```

**Vibe에 대한 시사점:** 게임 언어라면 벡터 수학이 일급 시민이어야 한다. 라이브러리가 아니라 언어 차원에서.

#### (c) `or_return`과 `or_else` 패턴

```odin
// 에러 처리를 깔끔하게
load_texture :: proc(path: string) -> (Texture, bool) {
    data := os.read_entire_file(path) or_return  // 실패 시 즉시 반환
    image := decode_png(data) or_return
    return upload_to_gpu(image)
}
```

### 6.2 Zig: 컴파일 타임의 정수

#### (a) comptime: 매크로를 대체하는 컴파일 타임 실행

```zig
// 컴파일 타임에 실행되는 일반 Zig 코드
fn Vec(comptime T: type, comptime N: usize) type {
    return struct {
        data: [N]T,

        const Self = @This();

        pub fn add(a: Self, b: Self) Self {
            var result: Self = undefined;
            inline for (0..N) |i| {
                result.data[i] = a.data[i] + b.data[i];
            }
            return result;
        }
    };
}

// 사용
const Vec3 = Vec(f32, 3);
var a = Vec3{ .data = .{1, 2, 3} };
var b = Vec3{ .data = .{4, 5, 6} };
var c = a.add(b);
```

**왜 탁월한가?**
- 제네릭과 매크로를 **하나의 메커니즘**으로 통합
- 컴파일 타임 코드도 일반 코드와 동일한 문법 → LLM이 별도 DSL을 배울 필요 없음
- Rust의 `macro_rules!`보다 100배 이해하기 쉬움

#### (b) 할당자를 명시적으로 전달

```zig
// Zig에서는 모든 할당이 할당자를 명시적으로 받는다
var list = std.ArrayList(u8).init(allocator);
defer list.deinit();

try list.append(42);
```

### 6.3 Wren: Smalltalk의 유산

#### (a) 파이버(Fiber) 기반 동시성

```wren
// Wren의 파이버는 게임 AI에 완벽하다
var fiber = Fiber.new {
    System.print("Phase 1")
    Fiber.yield()  // 일시 중지
    System.print("Phase 2")
    Fiber.yield()
    System.print("Phase 3")
}

// 게임 루프에서
fiber.call()   // "Phase 1" 출력 후 중지
// ... 다른 로직 ...
fiber.call()   // "Phase 2" 출력 후 중지
```

**Vibe에 대한 시사점:** 코루틴/파이버는 게임 AI, 컷신, 튜토리얼 시퀀스에 핵심적이다. Lua와 Wren 모두 이를 일급으로 지원한다.

#### (b) 클래스 기반의 명확한 OOP

```wren
class Enemy {
    construct new(x, y, health) {
        _x = x
        _y = y
        _health = health
    }

    x { _x }
    y { _y }
    health { _health }

    takeDamage(amount) {
        _health = _health - amount
        if (_health <= 0) die()
    }
}
```

Lua의 메타테이블 기반 OOP보다 훨씬 명확하고 LLM이 정확하게 생성할 수 있다.

### 6.4 Haxe: 크로스 컴파일의 왕

#### (a) 추상 타입 (Abstract Types)

```haxe
// 타입 안전 단위 시스템
abstract Pixels(Int) from Int to Int {
    @:op(A + B)
    public function add(rhs: Pixels): Pixels {
        return this + rhs;
    }
}

abstract Meters(Float) from Float {
    public function toPixels(): Pixels {
        return Std.int(this * 32.0);
    }
}

// 컴파일 타임에 Pixels와 Meters를 혼동할 수 없다!
var x: Pixels = 100;
var y: Meters = 3.5;
// var z: Pixels = y;  // 컴파일 에러!
var z: Pixels = y.toPixels();  // OK
```

**Vibe에 대한 시사점:** 게임에서 단위 혼동 (픽셀 vs 미터, 초 vs 프레임)은 흔한 버그 원인. 추상 타입으로 이를 방지할 수 있다.

### 6.5 Nim: Python의 가독성 + 네이티브 성능

#### (a) UFCS (Uniform Function Call Syntax)

```nim
# 이 두 호출이 동일하다
echo len("hello")
echo "hello".len()

# 체이닝이 자연스러워진다
let result = enemies
    .filter(proc(e: Enemy): bool = e.health > 0)
    .sortedByIt(it.distanceTo(player))
    .first()
```

#### (b) 대소문자/언더스코어 무시

```nim
# 이 모두가 같은 식별자
var myVariable = 10
var my_variable = 10   # 같은 변수!
var myvariable = 10    # 같은 변수!
```

**주의:** 이 기능은 LLM에게는 오히려 **해로울 수 있다**. 동일한 식별자를 여러 방식으로 쓸 수 있으면 비일관성이 생긴다.

### 6.6 종합: 각 언어에서 훔쳐올 아이디어

| 언어 | 훔쳐올 아이디어 | Vibe에서의 형태 |
|------|-----------------|----------------|
| **Odin** | 암묵적 컨텍스트, 내장 벡터, `or_return` | `context` 시스템, 벡터 리터럴, `?` 연산자 |
| **Zig** | comptime (컴파일 타임 실행) | `comptime` 블록 (매크로 대체) |
| **Wren** | 파이버 기반 동시성, 깔끔한 클래스 | 코루틴을 일급 시민으로 |
| **Haxe** | 추상 타입 (단위 안전) | `distinct` 타입 키워드 |
| **Nim** | UFCS, Python 유사 문법 | 메서드 호출 = 함수 호출 통합 |

---

## 7. 종합 결론: Vibe 언어를 위한 설계 원칙

위 분석을 종합하여, Vibe 언어의 설계 원칙을 도출한다:

### 7.1 LLM 우호성 원칙

1. **"한 가지 방법" 원칙 (Go에서)**: 모든 개념에 대해 표현 방법이 정확히 하나여야 한다. 변형을 허용하지 않는다.
2. **강제 포매터 (Go에서)**: `vibefmt`가 존재하며, 모든 Vibe 코드가 동일한 형태를 가진다.
3. **완전한 타입 정보 (Rust에서)**: 함수 시그니처만 보고 입출력을 100% 이해할 수 있어야 한다.
4. **예측 가능한 패턴**: 매 프레임 실행되는 코드, 이벤트 핸들러, 초기화 코드의 형태가 고정되어 있다.
5. **소규모 키워드 세트**: 30개 미만의 키워드로 언어 전체를 표현한다.

### 7.2 게임 엔진 특화 원칙

1. **컴포지션 > 상속 (Go에서)**: 클래스 상속 없음. 구조체 + 인터페이스 + 컴포지션.
2. **일급 이벤트/시그널 (GDScript에서)**: `signal` 키워드로 이벤트를 선언하고, `.emit()`, `.connect()`로 사용.
3. **일급 코루틴 (Lua/Wren에서)**: 게임 AI, 애니메이션 시퀀스를 코루틴으로 자연스럽게 표현.
4. **내장 벡터 수학 (Odin에서)**: `Vec2`, `Vec3`, `Vec4`가 언어 프리미티브. `+`, `-`, `*` 연산 내장.
5. **에디터 통합 (GDScript에서)**: `@export` 같은 메타데이터로 에디터 UI 자동 생성.

### 7.3 안전성 원칙

1. **enum + match + 완전성 검사 (Rust에서)**: 모든 상태를 처리했는지 컴파일러가 검증.
2. **Null 안전 (Rust에서)**: `T?`로 nullable을 표현하고, 접근 시 검사를 강제.
3. **결과 타입 + ? 전파 (Rust에서)**: 에러 처리를 간결하게, 하지만 무시할 수 없게.
4. **`defer` (Go/Odin에서)**: 리소스 정리를 스코프 기반으로.
5. **distinct 타입 (Haxe/Odin에서)**: `Pixels`와 `Meters`를 혼동할 수 없게.

### 7.4 버린 것들

| 버린 기능 | 이유 |
|-----------|------|
| 클래스 상속 | 컴포지션으로 대체. 다이아몬드 문제 등 복잡성 제거 |
| 라이프타임 | LLM이 정확하게 생성 불가. 아레나/RC로 대체 |
| 매크로 시스템 | comptime으로 대체. 별도 DSL을 없앤다 |
| 예외 (try/catch) | Result 타입 + ? 연산자로 대체 |
| 1-기반 인덱싱 | 0-기반이 업계 표준 |
| 선택적 타입 | 항상 필수 (추론 가능하지만 생략 불가) |
| 함수 오버로딩 | 이름이 곧 의미. 다른 이름을 사용 |
| 암묵적 변환 | 모든 변환이 명시적 |
| null | `Option`/`T?`로 대체 |
| 연산자 오버로딩 | 내장 벡터 타입이 대신 처리 |
| 삼항 연산자 | `if/else` 표현식으로 대체 |

### 7.5 Vibe 의사 코드 미리보기

위 원칙들을 종합한 가상의 Vibe 코드:

```
// Player.vibe — 파일이 곧 컴포넌트 정의

component Player {
    @export speed: f32 = 200.0
    @export jump_force: f32 = 400.0

    health: i32 = 100
    state: PlayerState = .Idle

    signal damaged(amount: i32)
    signal died()
}

enum PlayerState {
    Idle,
    Running { speed: f32 },
    Jumping { velocity: f32 },
    Attacking { frame: u32 },
    Dead,
}

fn update(p: mut Player, input: Input, dt: f32) {
    p.state = match p.state {
        .Idle => {
            if input.pressed("move") {
                .Running { speed: p.speed }
            } else if input.just_pressed("jump") {
                .Jumping { velocity: -p.jump_force }
            } else {
                .Idle
            }
        }
        .Running { speed } => {
            p.velocity.x = input.axis("left", "right") * speed
            if !input.pressed("move") => .Idle
            else => .Running { speed }
        }
        .Jumping { velocity } => {
            let new_vel = velocity + GRAVITY * dt
            if p.is_on_floor() => .Idle
            else => .Jumping { velocity: new_vel }
        }
        .Attacking { frame } => {
            if frame >= MAX_FRAMES => .Idle
            else => .Attacking { frame: frame + 1 }
        }
        .Dead => .Dead
    }
}

fn take_damage(p: mut Player, amount: i32) {
    p.health -= amount
    p.damaged.emit(amount)
    if p.health <= 0 {
        p.state = .Dead
        p.died.emit()
    }
}

// 코루틴: AI 행동
fn patrol(enemy: mut Enemy) -> coroutine {
    loop {
        enemy.move_to(point_a)
        yield until enemy.reached_target()

        wait(2.0)
        yield

        enemy.move_to(point_b)
        yield until enemy.reached_target()

        wait(2.0)
        yield
    }
}

// 레벨 로딩 (에러 처리)
fn load_level(path: str) -> Level ? LoadError {
    let data = fs.read(path)?
    let level = parse_level(data)?
    ok(level)
}
```

이 의사 코드에서 관찰할 수 있는 특징:

- **Rust의 enum + match**: 상태 기계가 완전성 검사를 받음
- **GDScript의 signal**: `signal damaged(amount: i32)`로 선언, `.emit()`으로 발사
- **GDScript의 @export**: 에디터 노출 변수
- **Go의 단순성**: 클래스 없음, 함수와 구조체만
- **Lua/Wren의 코루틴**: `yield`, `yield until` 패턴
- **Rust의 ? 연산자**: 에러 전파
- **Odin의 벡터**: `p.velocity.x` 같은 내장 벡터 연산

---

*이 분석은 Vibe 언어의 구체적인 문법 설계 단계에서 참조 자료로 활용됩니다.*
