# Vibe 게임 프리미티브 어노테이션 시스템 설계서

> 이 문서는 Vibe 언어의 **게임 도메인 어노테이션 시스템** 전체를 정의한다.
> 게임 개념은 키워드가 아닌 **어노테이션(`@name`)** 으로 표현하여, 핵심 언어를 깨끗하게 유지하고 엔진 교체를 가능하게 한다.

---

## 0. 설계 원칙

### 0.1 왜 키워드가 아니라 어노테이션인가

`game-domain-keywords.md`에서 `entity`, `scene`, `on`, `has`, `signal` 5개를 키워드로 제안했었다. 그러나 `peg-grammar-annotations-modules-special.peg`에서 최종적으로 **어노테이션 방식**으로 전환했다. 이유:

| 기준 | 키워드 방식 | 어노테이션 방식 |
|------|-----------|---------------|
| **키워드 예산** | 5개 소모 (20 -> 25개) | 0개 소모 (20개 유지) |
| **엔진 교체** | 키워드가 특정 엔진 개념에 결합 | 어노테이션만 교체하면 동일 코드 재사용 |
| **파서 복잡도** | `entity`, `scene` 등 별도 파싱 규칙 필요 | `struct` + `fn` 재사용, 의미 분석 단계에서 처리 |
| **확장성** | 새 게임 개념 = 새 키워드 (예산 한계) | 새 게임 개념 = 새 어노테이션 (무제한) |
| **LLM 전이** | 기존 언어에 `entity` 키워드 없음 | `@decorator` 패턴은 Python/Java에서 풍부 |

### 0.2 어노테이션 문법 (확정)

```
-- 기본 형태
@name

-- 인자 포함
@name("value")
@name(key: value)
@name("value", key: value)

-- 다중 어노테이션 (별도 줄 또는 같은 줄)
@entity
@networked
struct Player has Damageable
  health: Int = 100
```

어노테이션은 `struct`, `fn`, `let`, `const`, `enum` 선언 앞에 올 수 있다. 파서는 `@name(args)` 구조만 인식하고, 의미 검증은 컴파일러의 의미 분석 단계에서 수행한다.

### 0.3 핵심 설계 결정 요약

| 결정 | 선택 | 근거 |
|------|------|------|
| Entity 모델 | Option C (고유 필드 + 컴포넌트 혼합) | `@component` 타입은 컴포넌트, 나머지는 고유 데이터 |
| 이벤트 대상 판별 | 첫 번째 매개변수의 타입 | `fn f(player: Player, dt: Float)` -> Player에 적용 |
| Scene 생명주기 | enter, exit, update, draw | 모든 게임 엔진의 공통 패턴 |
| Signal 선언 | `@signal` 어노테이션 on `fn` 시그니처 | 타입 안전한 이벤트 선언 |
| 물리 통합 | 컴포넌트 기반 + `@on("collide")` 런타임 지원 | LOVE 2D의 물리 시스템과 매핑 |

---

## 1. 전체 어노테이션 목록

### 1.1 엔티티/컴포넌트 시스템

| 어노테이션 | 대상 | 설명 |
|-----------|------|------|
| `@entity` | `struct` | 이 구조체를 게임 엔티티(스폰 가능한 게임 오브젝트)로 표시 |
| `@component` | `struct` | 이 구조체를 컴포넌트(엔티티에 부착 가능한 데이터/행동 단위)로 표시 |

### 1.2 씬 시스템

| 어노테이션 | 대상 | 설명 |
|-----------|------|------|
| `@scene` | `struct` | 이 구조체를 게임 씬(논리적 게임 단위)으로 표시 |

### 1.3 이벤트 시스템

| 어노테이션 | 대상 | 설명 |
|-----------|------|------|
| `@on("event")` | `fn` | 이 함수를 특정 이벤트의 핸들러로 등록 |
| `@signal` | `fn` (시그니처만) | 이 함수 시그니처를 커스텀 이벤트(시그널) 선언으로 표시 |

### 1.4 에디터/내보내기

| 어노테이션 | 대상 | 설명 |
|-----------|------|------|
| `@export` | `let`, 구조체 필드 | 이 값을 에디터 인스펙터에 노출 |
| `@export(range: 0..100)` | `let`, 구조체 필드 | 범위 제한과 함께 에디터에 노출 |
| `@export(options: [...])` | `let`, 구조체 필드 | 선택지 목록과 함께 에디터에 노출 |

### 1.5 시스템/고급

| 어노테이션 | 대상 | 설명 |
|-----------|------|------|
| `@system` | `fn` | 이 함수를 ECS 시스템(매 프레임 실행되는 쿼리 기반 로직)으로 표시 |
| `@networked` | `struct`, 필드 | 네트워크 동기화 대상으로 표시 |
| `@tag("name")` | `@entity struct` | 엔티티에 문자열 태그 부여 |

---

## 2. Entity 시스템 -- `@entity`, `@component`

### 2.1 설계 결정: Option C (고유 필드 + 컴포넌트 혼합)

**`@entity` 구조체는 고유 필드와 `@component` 타입 필드를 모두 가질 수 있다.**
트랜스파일러는 필드의 **타입이 `@component`로 선언된 구조체인지** 를 검사하여 컴포넌트와 일반 데이터를 구분한다.

```
-- 컴포넌트 정의: @component가 붙은 struct
@component
struct Position
  x: Float = 0.0
  y: Float = 0.0

@component
struct Velocity
  dx: Float = 0.0
  dy: Float = 0.0

@component
struct Sprite
  path: String
  width: Int = 32
  height: Int = 32
  flip_x: Bool = false

@component
struct Health
  current: Int = 100
  max: Int = 100

@component
struct Collider
  shape: Shape = Shape.Rect(32, 32)
  is_trigger: Bool = false

@component
struct RigidBody
  body_type: BodyType = BodyType.Dynamic
  mass: Float = 1.0
  gravity_scale: Float = 1.0

-- 엔티티 정의: @entity가 붙은 struct
-- 트랜스파일러가 각 필드의 타입을 검사:
--   Position -> @component -> 컴포넌트로 등록
--   name     -> String     -> 고유 데이터
@entity
struct Player has Damageable
  name: String = "Player"        -- 고유 필드 (String은 @component가 아님)
  speed: Float = 200.0           -- 고유 필드
  pos: Position                  -- 컴포넌트 (Position은 @component)
  vel: Velocity                  -- 컴포넌트
  sprite: Sprite                 -- 컴포넌트
  health: Health                 -- 컴포넌트
  body: RigidBody                -- 컴포넌트
  collider: Collider             -- 컴포넌트

@entity
@tag("enemy")
struct Enemy
  speed: Float = 80.0
  pos: Position
  sprite: Sprite
  health: Health
  body: RigidBody
  collider: Collider

@entity
@tag("coin")
struct Coin
  value: Int = 10
  pos: Position
  sprite: Sprite
  collider: Collider
```

### 2.2 왜 Option C인가

| 옵션 | 설명 | 문제 |
|------|------|------|
| A: 컴포넌트만 필드 | `@entity struct Player` 에 `pos: Position`, `sprite: Sprite` 만 | 고유 데이터(`name`, `speed`)를 어디에 둘 것인가? 별도 컴포넌트로 만들면 과도한 세분화 |
| B: 빈 엔티티 + 동적 부착 | `@entity struct Player` 에 필드 없음, `spawn` 시 동적 부착 | 타입 안전성 상실, LLM이 어떤 컴포넌트가 필요한지 추론 불가 |
| **C: 혼합** | **필드 타입이 `@component`면 컴포넌트, 아니면 고유 데이터** | **없음. 타입 시스템이 자동으로 구분** |

### 2.3 트랜스파일러의 컴포넌트 판별 규칙

```
규칙: @entity struct의 필드를 순회하면서,
  1. 필드 타입이 @component로 선언된 struct -> 엔진의 컴포넌트 시스템에 등록
  2. 필드 타입이 일반 struct 또는 기본 타입 -> 엔티티의 고유 데이터로 저장
  3. 필드 타입이 @entity -> 컴파일 에러 (엔티티는 다른 엔티티를 필드로 가질 수 없음)
```

### 2.4 내장 컴포넌트 목록 (엔진 제공)

| 컴포넌트 | 설명 | LOVE 2D 매핑 |
|---------|------|-------------|
| `Position` | 2D 좌표 | `x, y` 변수 |
| `Velocity` | 속도 벡터 | `dx, dy` 변수 |
| `Sprite` | 스프라이트 렌더링 | `love.graphics.draw()` |
| `AnimatedSprite` | 애니메이션 스프라이트 | 프레임 기반 `love.graphics.draw()` |
| `Health` | 체력 | 순수 데이터 |
| `RigidBody` | 물리 바디 | `love.physics.newBody()` |
| `Collider` | 충돌체 | `love.physics.newFixture()` + `love.physics.newShape()` |
| `AudioSource` | 오디오 재생기 | `love.audio.newSource()` |
| `Camera` | 카메라 | 좌표 변환 행렬 |
| `Timer` | 타이머 | `dt` 누적 |
| `Lifetime` | 자동 파괴 타이머 | `dt` 누적 후 `destroy()` |
| `Text` | 텍스트 렌더링 | `love.graphics.print()` |
| `TileMap` | 타일맵 | STI 라이브러리 또는 직접 렌더링 |
| `ParticleEmitter` | 파티클 | `love.graphics.newParticleSystem()` |

사용자는 `@component`로 커스텀 컴포넌트를 정의할 수 있다:

```
@component
struct Inventory
  items: List[String] = []
  capacity: Int = 20
```

---

## 3. Scene 시스템 -- `@scene`

### 3.1 씬 선언

```
@scene
struct MainMenu
  title: String = "My Game"
  background: Color = Color(30, 30, 46)

@scene
struct GamePlay
  level: Int = 1
  score: Int = 0
  gravity: Vec2 = Vec2(0.0, 980.0)

@scene
struct GameOver
  final_score: Int = 0
```

`@scene` 구조체의 필드는 **씬 파라미터** 겸 **씬 상태**다.

### 3.2 씬 생명주기

| 이벤트 | 시점 | 용도 |
|--------|------|------|
| `enter` | 씬 진입 직후 | 엔티티 스폰, 맵 로딩, BGM 재생 |
| `exit` | 씬 이탈 직전 | 리소스 정리, 진행 상황 저장 |
| `update` | 매 프레임 | 게임 로직, 승리/패배 조건 검사 |
| `draw` | 매 프레임 (update 이후) | HUD 그리기, 디버그 정보 표시 |

```
@on("enter")
fn gameplay_enter(scene: GamePlay)
  load_map("level_{scene.level}.tmx")
  spawn(Player, pos: Position(x: 100.0, y: 200.0))
  play_music("bgm.ogg", loop: true)

@on("exit")
fn gameplay_exit(scene: GamePlay)
  stop_music()
  save_progress(scene.level, scene.score)

@on("update")
fn gameplay_update(scene: GamePlay, dt: Float)
  if count(Enemy) == 0
    go_to(GamePlay, level: scene.level + 1, score: scene.score)

@on("draw")
fn gameplay_draw(scene: GamePlay)
  draw_text("Score: {scene.score}", x: 10.0, y: 10.0)
  draw_text("Level: {scene.level}", x: 10.0, y: 30.0)
```

### 3.3 씬 전환 함수

```
-- 기본 전환
go_to(MainMenu)

-- 파라미터 전달
go_to(GamePlay, level: 1)
go_to(GameOver, final_score: 1500)

-- 현재 씬 다시 시작
go_to(GamePlay, level: scene.level, score: 0)
```

`go_to`는 **함수**다 (키워드가 아님). 동작:
1. 현재 씬의 `exit` 이벤트 발생
2. 현재 씬의 모든 엔티티 `destroy()`
3. 새 씬의 `@scene` 구조체 인스턴스 생성 (파라미터로 초기화)
4. 새 씬의 `enter` 이벤트 발생

### 3.4 LOVE 2D 매핑

```lua
-- Vibe의 @scene -> Lua/LOVE 변환
local scenes = {}
local current_scene = nil

function scenes.GamePlay_enter(scene)
  -- @on("enter") fn gameplay_enter(scene: GamePlay)의 변환
  load_map("level_" .. scene.level .. ".tmx")
  spawn("Player", {pos = {x = 100, y = 200}})
  love.audio.play(bgm)
end

function scenes.GamePlay_update(scene, dt)
  -- @on("update") fn gameplay_update(scene: GamePlay, dt: Float)의 변환
  if count_entities("Enemy") == 0 then
    go_to("GamePlay", {level = scene.level + 1, score = scene.score})
  end
end

function go_to(scene_name, params)
  if current_scene then
    scenes[current_scene.name .. "_exit"](current_scene)
    destroy_all_entities()
  end
  current_scene = {name = scene_name}
  for k, v in pairs(params or {}) do
    current_scene[k] = v
  end
  scenes[scene_name .. "_enter"](current_scene)
end
```

---

## 4. Event 시스템 -- `@on` (핵심 어노테이션)

### 4.1 설계 원칙

`@on`은 Vibe 어노테이션 시스템의 **가장 중요한 요소**다. 다음 규칙을 따른다:

1. **대상 판별**: 함수의 **첫 번째 매개변수 타입**이 핸들러의 대상을 결정한다
2. **다중 등록**: 같은 이벤트에 여러 핸들러를 등록할 수 있다
3. **스택 가능**: 하나의 함수에 여러 `@on`을 붙일 수 있다
4. **인자 필터링**: `@on`의 인자로 이벤트 조건을 좁힐 수 있다

### 4.2 대상 판별 규칙

```
@on("update")
fn player_update(player: Player, dt: Float)
--                ^^^^^^^^^^^^^^
--                첫 번째 매개변수가 Player -> 이 핸들러는 Player 엔티티에 적용

@on("update")
fn enemy_update(enemy: Enemy, dt: Float)
--               ^^^^^^^^^^^^
--               첫 번째 매개변수가 Enemy -> 이 핸들러는 Enemy 엔티티에 적용

@on("enter")
fn menu_enter(scene: MainMenu)
--             ^^^^^^^^^^^^^^^^
--             첫 번째 매개변수가 MainMenu (@scene) -> 이 핸들러는 MainMenu 씬에 적용

@on("start")
fn game_start()
--  매개변수 없음 -> 전역 이벤트 (게임 시작 시 한 번)
```

**판별 규칙 요약:**

| 첫 번째 매개변수 타입 | 대상 | 호출 시점 |
|---------------------|------|----------|
| `@entity` 타입 | 해당 엔티티의 모든 인스턴스 | 각 인스턴스마다 호출 |
| `@scene` 타입 | 해당 씬 | 씬이 활성화된 동안 호출 |
| 없음 (매개변수 0개) | 전역 | 조건 충족 시 한 번 호출 |

### 4.3 전체 내장 이벤트 목록

#### 4.3.1 생명주기 이벤트

| 이벤트 | 매개변수 | 설명 | 적용 대상 |
|--------|---------|------|----------|
| `"start"` | `()` | 게임 최초 시작 시 한 번 | 전역 |
| `"enter"` | `(entity/scene)` | 엔티티 스폰 직후 또는 씬 진입 직후 | 엔티티, 씬 |
| `"exit"` | `(entity/scene)` | 엔티티 파괴 직전 또는 씬 이탈 직전 | 엔티티, 씬 |
| `"update"` | `(entity/scene, dt: Float)` | 매 프레임 로직 갱신 | 엔티티, 씬 |
| `"draw"` | `(entity/scene)` | 매 프레임 렌더링 (update 이후) | 엔티티, 씬 |
| `"late_update"` | `(entity/scene, dt: Float)` | update 이후, draw 이전 | 엔티티, 씬 |

#### 4.3.2 입력 이벤트

| 이벤트 | 추가 인자 | 매개변수 | 설명 |
|--------|----------|---------|------|
| `"key_pressed"` | `key: "space"` | `(entity?)` | 특정 키 눌림 |
| `"key_released"` | `key: "space"` | `(entity?)` | 특정 키 뗌 |
| `"key_down"` | `key: "left"` | `(entity?, dt: Float)` | 키 누르고 있는 동안 (매 프레임) |
| `"mouse_pressed"` | `button: "left"` | `(entity?, pos: Vec2)` | 마우스 버튼 눌림 |
| `"mouse_released"` | `button: "left"` | `(entity?, pos: Vec2)` | 마우스 버튼 뗌 |
| `"mouse_moved"` | -- | `(entity?, pos: Vec2, delta: Vec2)` | 마우스 이동 |
| `"gamepad_pressed"` | `button: "a"` | `(entity?)` | 게임패드 버튼 눌림 |

`key` 인자가 없으면 **모든 키**에 반응:

```
-- 특정 키만
@on("key_pressed", key: "space")
fn jump(player: Player)
  player.vel.dy = -400.0

-- 모든 키
@on("key_pressed")
fn any_key(player: Player, key: String)
  log("Key pressed: {key}")
```

#### 4.3.3 충돌 이벤트

| 이벤트 | 추가 인자 | 매개변수 | 설명 |
|--------|----------|---------|------|
| `"collide"` | -- | `(self_entity, other: Entity, collision: Collision)` | 두 엔티티 충돌 |
| `"collide"` | `other: Enemy` | `(self_entity, enemy: Enemy, collision: Collision)` | 특정 타입과 충돌 |
| `"collide"` | `tag: "coin"` | `(self_entity, other: Entity, collision: Collision)` | 특정 태그와 충돌 |
| `"trigger_enter"` | -- | `(self_entity, other: Entity)` | 트리거 영역 진입 |
| `"trigger_exit"` | -- | `(self_entity, other: Entity)` | 트리거 영역 이탈 |

```
-- 타입 기반 충돌 필터링
@on("collide", other: Enemy)
fn player_hit_enemy(player: Player, enemy: Enemy, col: Collision)
  if col.normal.y < -0.5
    -- 위에서 밟음
    destroy(enemy)
    player.vel.dy = -300.0
  else
    -- 옆에서 부딪힘
    emit(player, "damaged", amount: 10)

-- 태그 기반 충돌 필터링
@on("collide", tag: "coin")
fn player_collect_coin(player: Player, coin: Entity, col: Collision)
  player.score = player.score + coin.value
  play_sound("collect.wav")
  destroy(coin)

-- 모든 충돌
@on("collide")
fn player_any_collision(player: Player, other: Entity, col: Collision)
  log("Player collided with {type_of(other)}")
```

#### 4.3.4 커스텀 시그널 이벤트

| 이벤트 | 설명 |
|--------|------|
| `"signal_name"` | `@signal`로 선언된 커스텀 이벤트에 반응 |

```
-- 시그널 정의 (4절 참조)
@signal
fn health_changed(entity: Player, old_value: Int, new_value: Int)

-- 시그널 수신
@on("health_changed")
fn update_health_bar(player: Player, old_value: Int, new_value: Int)
  set_health_bar(new_value, player.health.max)
```

### 4.4 `@on` 스태킹 (다중 어노테이션)

하나의 함수에 여러 `@on`을 붙일 수 있다:

```
@on("key_pressed", key: "space")
@on("key_pressed", key: "w")
@on("gamepad_pressed", button: "a")
fn jump(player: Player)
  if is_on_ground(player)
    player.vel.dy = -400.0
```

이 함수는 스페이스, W키, 게임패드 A버튼 모두에 반응한다.

### 4.5 이벤트 실행 순서

한 프레임의 실행 순서:

```
1. 입력 이벤트 처리 (key_pressed, mouse_pressed 등)
2. @on("update") 호출 (모든 엔티티 + 씬)
3. 물리 시뮬레이션 실행
4. 충돌 이벤트 처리 (collide, trigger_enter 등)
5. @on("late_update") 호출
6. @on("draw") 호출 (모든 엔티티 + 씬)
7. 지연 파괴 처리 (destroy()로 표시된 엔티티 실제 제거)
```

### 4.6 LOVE 2D 매핑

```lua
-- @on("update") fn player_update(player: Player, dt: Float)
-- 변환 결과:

-- 엔진 내부 레지스트리
local event_handlers = {
  update = {},
  draw = {},
  key_pressed = {},
  collide = {},
}

-- 핸들러 등록 (컴파일 시점에 생성)
table.insert(event_handlers.update, {
  entity_type = "Player",
  handler = function(entity, dt)
    -- player_update 본문
  end
})

-- 게임 루프에서 디스패치
function love.update(dt)
  for _, handler in ipairs(event_handlers.update) do
    for _, entity in ipairs(get_entities(handler.entity_type)) do
      handler.handler(entity, dt)
    end
  end
end

-- @on("key_pressed", key: "space") fn jump(player: Player)
function love.keypressed(key)
  for _, handler in ipairs(event_handlers.key_pressed) do
    if handler.key == nil or handler.key == key then
      for _, entity in ipairs(get_entities(handler.entity_type)) do
        handler.handler(entity, key)
      end
    end
  end
end

-- @on("collide", other: Enemy) fn player_hit(player: Player, enemy: Enemy, col)
-- LOVE 2D의 World:setCallbacks 활용
world:setCallbacks(
  function(fixture_a, fixture_b, contact)  -- beginContact
    local entity_a = fixture_a:getUserData()
    local entity_b = fixture_b:getUserData()
    local collision = make_collision(contact)
    dispatch_collide(entity_a, entity_b, collision)
    dispatch_collide(entity_b, entity_a, collision)
  end
)
```

---

## 5. Signal 시스템 -- `@signal`

### 5.1 시그널 선언

`@signal`은 **`fn` 시그니처** (본문 없음)에 붙여 커스텀 이벤트를 선언한다:

```
-- 시그널 선언: 함수 시그니처만, 본문 없음
@signal
fn health_changed(entity: Player, old_value: Int, new_value: Int)

@signal
fn died(entity: Player)

@signal
fn item_collected(entity: Player, item_name: String, item_value: Int)

@signal
fn score_changed(scene: GamePlay, old_score: Int, new_score: Int)
```

**시그널의 첫 번째 매개변수**는 시그널을 발생시키는 주체(엔티티 또는 씬)다.

### 5.2 시그널 발생 (emit)

```
fn take_damage(player: Player, amount: Int)
  let old: Int = player.health.current
  player.health.current = max(player.health.current - amount, 0)
  emit(player, "health_changed", old_value: old, new_value: player.health.current)
  if player.health.current <= 0
    emit(player, "died")
```

`emit`은 **함수**다:
- 첫 번째 인자: 시그널을 발생시키는 엔티티/씬
- 두 번째 인자: 시그널 이름 (문자열)
- 나머지: 시그널에 정의된 추가 매개변수 (이름 있는 인자)

컴파일러는 `emit` 호출 시 시그널 선언과 **인자 타입을 대조 검증**한다.

### 5.3 시그널 수신

시그널 수신은 `@on`과 동일한 문법이다:

```
@on("health_changed")
fn update_health_bar(player: Player, old_value: Int, new_value: Int)
  let bar_width: Float = (new_value.to_float() / player.health.max.to_float()) * 200.0
  set_bar_width(bar_width)

@on("died")
fn on_player_died(player: Player)
  play_sound("death.wav")
  after(2.0, fn()
    go_to(GameOver, final_score: get_score())
  )

@on("item_collected")
fn show_item_popup(player: Player, item_name: String, item_value: Int)
  spawn_popup("+{item_value} ({item_name})", at: player.pos)
```

### 5.4 LOVE 2D 매핑

```lua
-- 시그널은 단순한 이벤트 디스패치로 변환
local signal_handlers = {}

function register_signal(signal_name, entity_type, handler)
  signal_handlers[signal_name] = signal_handlers[signal_name] or {}
  table.insert(signal_handlers[signal_name], {
    entity_type = entity_type,
    handler = handler
  })
end

function emit(entity, signal_name, args)
  local handlers = signal_handlers[signal_name]
  if handlers then
    for _, h in ipairs(handlers) do
      if entity._type == h.entity_type then
        h.handler(entity, table.unpack(args))
      end
    end
  end
end
```

---

## 6. Spawn, Destroy, Find -- 내장 게임 함수

이것들은 **어노테이션이 아니라 함수**다. 키워드도 아니다.

### 6.1 Spawn (엔티티 생성)

```
-- 기본 스폰
let player: Player = spawn(Player)

-- 위치 지정
let player: Player = spawn(Player, pos: Position(x: 400.0, y: 300.0))

-- 컴포넌트 오버라이드
let enemy: Enemy = spawn(Enemy,
  pos: Position(x: 100.0, y: 100.0),
  health: Health(current: 50, max: 50)
)

-- 고유 필드 오버라이드
let boss: Enemy = spawn(Enemy,
  speed: 200.0,
  pos: Position(x: 400.0, y: 0.0),
  health: Health(current: 500, max: 500)
)
```

**`spawn` 시그니처:**
```
fn spawn(EntityType, ...named_overrides) -> EntityType
```

동작:
1. `@entity` 구조체의 인스턴스 생성 (기본값 적용)
2. 이름 있는 인자로 필드 오버라이드
3. `@component` 필드를 엔진의 컴포넌트 시스템에 등록
4. 엔티티를 월드에 추가
5. `"enter"` 이벤트 발생
6. 엔티티 참조 반환

### 6.2 Destroy (엔티티 파괴)

```
-- 단일 엔티티 파괴
destroy(enemy)

-- 태그 기반 일괄 파괴
destroy_all("enemy")

-- 모든 엔티티 파괴 (씬 전환 시 내부적으로 사용)
destroy_all()
```

동작:
1. 엔티티에 "파괴 예정" 표시
2. `"exit"` 이벤트 발생
3. 프레임 끝에서 실제 제거 (지연 파괴)

### 6.3 Find (엔티티 검색)

```
-- 타입으로 검색
let nearest: Enemy? = find_nearest(Enemy, from: player.pos)
let all_enemies: List[Enemy] = find_all(Enemy)
let first: Enemy? = find_first(Enemy)

-- 태그로 검색
let coins: List[Entity] = find_by_tag("coin")
let nearest_coin: Entity? = find_nearest_by_tag("coin", from: player.pos)

-- 개수 세기
let enemy_count: Int = count(Enemy)
let coin_count: Int = count_by_tag("coin")
```

### 6.4 LOVE 2D 매핑

```lua
-- spawn(Player, pos: Position(x: 100, y: 200))
function spawn(entity_type, overrides)
  local entity = deep_copy(entity_defaults[entity_type])
  for k, v in pairs(overrides or {}) do
    entity[k] = v
  end
  entity._type = entity_type
  entity._id = next_id()

  -- 물리 바디 생성 (@component RigidBody가 있으면)
  if entity.body then
    entity._physics_body = love.physics.newBody(world, entity.pos.x, entity.pos.y, entity.body.body_type)
  end
  -- 충돌체 생성 (@component Collider가 있으면)
  if entity.collider then
    local shape = make_shape(entity.collider.shape)
    entity._fixture = love.physics.newFixture(entity._physics_body, shape)
    entity._fixture:setUserData(entity)
    entity._fixture:setSensor(entity.collider.is_trigger)
  end

  table.insert(entities, entity)
  dispatch_event("enter", entity)
  return entity
end
```

---

## 7. 물리 시스템 통합

### 7.1 물리는 컴포넌트 기반

물리 시스템은 별도 어노테이션이 아니라 **컴포넌트 조합**으로 표현한다:

```
@component
struct RigidBody
  body_type: BodyType = BodyType.Dynamic  -- Dynamic, Static, Kinematic
  mass: Float = 1.0
  gravity_scale: Float = 1.0
  fixed_rotation: Bool = false
  linear_damping: Float = 0.0
  angular_damping: Float = 0.0

@component
struct Collider
  shape: Shape = Shape.Rect(32, 32)
  is_trigger: Bool = false              -- true면 물리 반응 없이 이벤트만
  friction: Float = 0.3
  restitution: Float = 0.0             -- 반발 계수
  density: Float = 1.0

enum BodyType
  Dynamic    -- 물리 법칙 적용 (플레이어, 적, 총알 등)
  Static     -- 움직이지 않음 (벽, 바닥 등)
  Kinematic  -- 코드로만 이동 (플랫폼, 엘리베이터 등)

enum Shape
  Rect(width: Float, height: Float)
  Circle(radius: Float)
  Polygon(vertices: List[Vec2])
```

### 7.2 충돌 이벤트 런타임 지원

`@on("collide")`는 물리 엔진의 콜백을 어노테이션 시스템에 연결한다:

```
-- 엔진 내부: LOVE 2D의 World:setCallbacks를 이용
-- 1. beginContact -> "collide" 이벤트 디스패치
-- 2. endContact -> "collide_end" 이벤트 디스패치
-- 3. preSolve -> 내부 처리 (충돌 필터링)
-- 4. postSolve -> "collide_resolved" 이벤트 디스패치 (충돌력 정보 포함)
```

**`Collision` 구조체 (엔진 제공):**

```
struct Collision
  normal: Vec2        -- 충돌 법선
  point: Vec2         -- 충돌 지점
  depth: Float        -- 관통 깊이
  relative_vel: Vec2  -- 상대 속도
```

### 7.3 트리거 (물리 반응 없는 감지)

```
@entity
struct DeathZone
  pos: Position
  collider: Collider = Collider(shape: Shape.Rect(800.0, 50.0), is_trigger: true)

@on("trigger_enter")
fn death_zone_entered(zone: DeathZone, other: Entity)
  if has_component(other, Health)
    emit(other, "died")
  else
    destroy(other)
```

---

## 8. 오디오 시스템

### 8.1 함수 기반 (어노테이션 불필요)

오디오는 단순 함수 호출로 처리한다. 대부분의 게임에서 오디오는 간단한 "재생/정지"로 충분하다:

```
-- 효과음 (한 번 재생)
play_sound("explosion.wav")
play_sound("jump.wav", volume: 0.8)
play_sound("coin.wav", volume: 0.5, pitch: 1.2)

-- 배경 음악
play_music("bgm.ogg", loop: true)
play_music("boss_bgm.ogg", loop: true, volume: 0.6)
stop_music()
pause_music()
resume_music()

-- 음악 전환 (페이드)
fade_music("new_bgm.ogg", duration: 2.0)
```

### 8.2 AudioSource 컴포넌트 (위치 기반 오디오가 필요할 때)

```
@component
struct AudioSource
  clip: String = ""
  volume: Float = 1.0
  pitch: Float = 1.0
  loop: Bool = false
  spatial: Bool = false     -- true면 위치 기반 감쇠
  max_distance: Float = 500.0

-- 사용 예
@entity
struct Waterfall
  pos: Position
  audio: AudioSource = AudioSource(
    clip: "waterfall_loop.wav",
    loop: true,
    spatial: true,
    max_distance: 300.0
  )

@on("enter")
fn waterfall_enter(w: Waterfall)
  play_source(w.audio)
```

### 8.3 LOVE 2D 매핑

```lua
-- play_sound("explosion.wav", volume: 0.8)
function play_sound(path, args)
  local source = love.audio.newSource(path, "static")
  source:setVolume(args.volume or 1.0)
  source:setPitch(args.pitch or 1.0)
  source:play()
end

-- play_music("bgm.ogg", loop: true)
local current_music = nil
function play_music(path, args)
  if current_music then current_music:stop() end
  current_music = love.audio.newSource(path, "stream")
  current_music:setLooping(args.loop or false)
  current_music:setVolume(args.volume or 1.0)
  current_music:play()
end
```

---

## 9. Tween / Timer -- 함수 기반

### 9.1 Tween (값 보간)

```
-- 속성 트위닝
tween(player.pos, "x", to: 500.0, duration: 1.0, ease: "quad_out")
tween(door.pos, "y", to: -100.0, duration: 0.5, ease: "linear")
tween(sprite, "alpha", to: 0.0, duration: 2.0, ease: "sine_in")

-- 구조체 트위닝
tween(player.pos, to: Vec2(500.0, 300.0), duration: 1.0, ease: "quad_out")

-- 완료 콜백
tween(enemy.pos, to: Vec2(0.0, 0.0), duration: 2.0, ease: "cubic_in", on_complete: fn()
  destroy(enemy)
)
```

**내장 이징 함수:**

| 이름 | 설명 |
|------|------|
| `"linear"` | 등속 |
| `"quad_in"`, `"quad_out"`, `"quad_in_out"` | 2차 곡선 |
| `"cubic_in"`, `"cubic_out"`, `"cubic_in_out"` | 3차 곡선 |
| `"sine_in"`, `"sine_out"`, `"sine_in_out"` | 사인 곡선 |
| `"expo_in"`, `"expo_out"`, `"expo_in_out"` | 지수 곡선 |
| `"elastic_out"` | 탄성 |
| `"bounce_out"` | 바운스 |
| `"back_out"` | 오버슛 |

### 9.2 Timer (시간 기반 실행)

```
-- 지연 실행 (한 번)
after(2.0, fn()
  spawn(Enemy, pos: Position(x: rand_float(0.0, 800.0), y: 0.0))
)

-- 반복 실행
let spawner: Timer = every(3.0, fn()
  spawn(PowerUp, pos: Position(x: rand_float(0.0, 800.0), y: 0.0))
)

-- 타이머 취소
cancel(spawner)
```

### 9.3 코루틴 기반 시퀀싱

`yield` 키워드를 활용한 순차 실행:

```
fn cutscene(player: Player, npc: Entity)
  camera_follow(npc)
  yield
  show_dialog(npc, "Welcome, hero!")
  yield wait(2.0)
  npc_move_to(npc, Vec2(500.0, 300.0))
  yield wait(1.5)
  show_dialog(npc, "Follow me!")
  yield wait(1.0)
  camera_follow(player)
  yield
  give_quest(player, "find_sword")

fn boss_intro(boss: Enemy)
  slow_motion(0.3)
  yield
  camera_shake(10.0, duration: 0.5)
  yield wait(0.5)
  show_boss_name("DARK LORD")
  yield wait(2.0)
  slow_motion(1.0)
  yield
  play_music("boss_bgm.ogg", loop: true)
```

### 9.4 LOVE 2D 매핑

```lua
-- tween: flux 라이브러리 활용 (또는 직접 구현)
local flux = require("flux")

function tween(target, prop, args)
  return flux.to(target, args.duration, {[prop] = args.to})
    :ease(args.ease or "linear")
    :oncomplete(args.on_complete)
end

-- after/every: timer 라이브러리 또는 직접 구현
local timers = {}

function after(delay, callback)
  table.insert(timers, {
    remaining = delay,
    callback = callback,
    repeating = false
  })
end

function every(interval, callback)
  local t = {
    remaining = interval,
    interval = interval,
    callback = callback,
    repeating = true,
    active = true
  }
  table.insert(timers, t)
  return t
end

-- 코루틴: Lua의 coroutine 직접 활용
function start_coroutine(fn_ref, ...)
  local co = coroutine.create(fn_ref)
  coroutine.resume(co, ...)
  table.insert(active_coroutines, co)
end
```

---

## 10. Export / 에디터 통합 -- `@export`

### 10.1 기본 내보내기

```
@export
let max_enemies: Int = 10

@export
let player_speed: Float = 200.0

@export
let game_title: String = "My Platformer"
```

### 10.2 제약 조건 포함

```
@export(range: 0..100)
let health: Int = 100

@export(range: 0.0..1.0, step: 0.1)
let volume: Float = 0.8

@export(range: 0..360)
let rotation: Float = 0.0

@export(options: ["easy", "normal", "hard"])
let difficulty: String = "normal"

@export(multiline: true)
let description: String = "A brave hero"

@export(file: "*.png")
let sprite_path: String = "player.png"

@export(color: true)
let tint: Color = Color(255, 255, 255)
```

### 10.3 엔티티 내부의 export

```
@entity
struct Player has Damageable
  @export(range: 50.0..500.0)
  speed: Float = 200.0

  @export(range: 1..1000)
  max_health: Int = 100

  @export(file: "*.png")
  sprite_path: String = "hero.png"

  pos: Position
  health: Health
  sprite: Sprite
```

### 10.4 LOVE 2D 매핑

v0.1에서 에디터가 없으므로, `@export` 값은 **설정 파일(JSON/Lua 테이블)** 로 외부화한다:

```lua
-- @export 값을 config.lua에서 로드
local config = {
  max_enemies = 10,
  player_speed = 200.0,
  difficulty = "normal"
}

-- 게임 시작 시 로드
function love.load()
  local file = love.filesystem.read("config.lua")
  if file then
    config = load(file)()
  end
end
```

---

## 11. System 어노테이션 -- `@system` (ECS 쿼리)

### 11.1 시스템 정의

`@system`은 **특정 컴포넌트 조합을 가진 모든 엔티티**에 대해 매 프레임 실행되는 로직이다:

```
-- Position + Velocity를 가진 모든 엔티티에 적용
@system
fn movement(pos: Position, vel: Velocity, dt: Float)
  pos.x = pos.x + vel.dx * dt
  pos.y = pos.y + vel.dy * dt

-- Health를 가진 모든 엔티티에 적용
@system
fn health_check(entity: Entity, health: Health)
  if health.current <= 0
    destroy(entity)

-- Sprite + Position을 가진 모든 엔티티에 적용
@system
fn render_sprites(pos: Position, sprite: Sprite)
  draw_sprite(sprite.path, pos.x, pos.y, sprite.flip_x)

-- Lifetime을 가진 모든 엔티티에 적용
@system
fn lifetime_tick(entity: Entity, lifetime: Lifetime, dt: Float)
  lifetime.remaining = lifetime.remaining - dt
  if lifetime.remaining <= 0.0
    destroy(entity)
```

### 11.2 `@system` vs `@on("update")` 차이

| 특성 | `@system` | `@on("update")` |
|------|-----------|-----------------|
| **대상 선택** | 컴포넌트 조합 (쿼리 기반) | 특정 엔티티 타입 |
| **적합한 용도** | 범용 로직 (물리, 렌더링, 타이머) | 특정 엔티티 행동 (플레이어 입력, 적 AI) |
| **예시** | "Position + Velocity가 있는 모든 것을 이동" | "Player를 키보드로 조작" |

### 11.3 LOVE 2D 매핑

```lua
-- @system fn movement(pos: Position, vel: Velocity, dt: Float)
function system_movement(dt)
  for _, entity in ipairs(entities) do
    if entity.pos and entity.vel then
      entity.pos.x = entity.pos.x + entity.vel.dx * dt
      entity.pos.y = entity.pos.y + entity.vel.dy * dt
    end
  end
end
```

---

## 12. 전체 내장 게임 함수 목록

### 12.1 엔티티 생명주기

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `spawn` | `fn spawn(T, ...overrides) -> T` | 엔티티 생성 |
| `destroy` | `fn destroy(entity: Entity)` | 엔티티 파괴 (지연) |
| `destroy_all` | `fn destroy_all(tag: String?)` | 일괄 파괴 |

### 12.2 엔티티 검색

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `find_first` | `fn find_first(T) -> T?` | 첫 번째 엔티티 |
| `find_all` | `fn find_all(T) -> List[T]` | 모든 엔티티 |
| `find_nearest` | `fn find_nearest(T, from: Vec2) -> T?` | 가장 가까운 엔티티 |
| `find_by_tag` | `fn find_by_tag(tag: String) -> List[Entity]` | 태그로 검색 |
| `find_nearest_by_tag` | `fn find_nearest_by_tag(tag: String, from: Vec2) -> Entity?` | 태그로 가장 가까운 것 |
| `count` | `fn count(T) -> Int` | 해당 타입 엔티티 수 |
| `count_by_tag` | `fn count_by_tag(tag: String) -> Int` | 태그별 엔티티 수 |

### 12.3 컴포넌트 조회

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `has_component` | `fn has_component(entity: Entity, T) -> Bool` | 컴포넌트 보유 여부 |
| `get_component` | `fn get_component(entity: Entity, T) -> T?` | 컴포넌트 가져오기 |
| `type_of` | `fn type_of(entity: Entity) -> String` | 엔티티 타입 이름 |

### 12.4 씬

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `go_to` | `fn go_to(SceneType, ...params)` | 씬 전환 |
| `current_scene` | `fn current_scene() -> Entity` | 현재 씬 참조 |

### 12.5 이벤트

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `emit` | `fn emit(entity: Entity, signal: String, ...args)` | 시그널 발생 |

### 12.6 오디오

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `play_sound` | `fn play_sound(path: String, volume: Float?, pitch: Float?)` | 효과음 재생 |
| `play_music` | `fn play_music(path: String, loop: Bool?, volume: Float?)` | 배경음 재생 |
| `stop_music` | `fn stop_music()` | 배경음 정지 |
| `pause_music` | `fn pause_music()` | 배경음 일시정지 |
| `resume_music` | `fn resume_music()` | 배경음 재개 |
| `fade_music` | `fn fade_music(path: String, duration: Float)` | 배경음 전환 |
| `play_source` | `fn play_source(source: AudioSource)` | 오디오 소스 재생 |

### 12.7 Tween / Timer

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `tween` | `fn tween(target, prop: String?, to: Any, duration: Float, ease: String?)` | 값 보간 |
| `after` | `fn after(delay: Float, callback: fn())` | 지연 실행 |
| `every` | `fn every(interval: Float, callback: fn()) -> Timer` | 반복 실행 |
| `cancel` | `fn cancel(timer: Timer)` | 타이머 취소 |
| `wait` | `fn wait(seconds: Float)` | 코루틴 내 대기 |

### 12.8 입력

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `is_key_down` | `fn is_key_down(key: String) -> Bool` | 키 누름 여부 |
| `is_key_pressed` | `fn is_key_pressed(key: String) -> Bool` | 키 방금 눌림 여부 |
| `is_key_released` | `fn is_key_released(key: String) -> Bool` | 키 방금 뗌 여부 |
| `input_axis` | `fn input_axis(neg: String, pos: String) -> Float` | 축 입력 (-1, 0, 1) |
| `mouse_pos` | `fn mouse_pos() -> Vec2` | 마우스 위치 |
| `is_mouse_down` | `fn is_mouse_down(button: String) -> Bool` | 마우스 버튼 눌림 |

### 12.9 그래픽

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `draw_sprite` | `fn draw_sprite(path: String, x: Float, y: Float, flip_x: Bool?)` | 스프라이트 그리기 |
| `draw_rect` | `fn draw_rect(x: Float, y: Float, w: Float, h: Float, color: Color)` | 사각형 그리기 |
| `draw_circle` | `fn draw_circle(x: Float, y: Float, r: Float, color: Color)` | 원 그리기 |
| `draw_line` | `fn draw_line(x1: Float, y1: Float, x2: Float, y2: Float, color: Color)` | 선 그리기 |
| `draw_text` | `fn draw_text(text: String, x: Float, y: Float, size: Int?, color: Color?)` | 텍스트 그리기 |

### 12.10 수학/유틸리티

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `distance` | `fn distance(a: Vec2, b: Vec2) -> Float` | 두 점 사이 거리 |
| `direction` | `fn direction(from: Vec2, to: Vec2) -> Vec2` | 정규화된 방향 벡터 |
| `move_toward` | `fn move_toward(from: Float, to: Float, max_delta: Float) -> Float` | 값을 목표에 접근 |
| `lerp` | `fn lerp(a: Float, b: Float, t: Float) -> Float` | 선형 보간 |
| `clamp` | `fn clamp(value: Float, min: Float, max: Float) -> Float` | 범위 제한 |
| `rand_float` | `fn rand_float(min: Float, max: Float) -> Float` | 랜덤 실수 |
| `rand_int` | `fn rand_int(min: Int, max: Int) -> Int` | 랜덤 정수 |
| `rand_bool` | `fn rand_bool() -> Bool` | 랜덤 불리언 |

### 12.11 카메라

| 함수 | 시그니처 | 설명 |
|------|---------|------|
| `camera_follow` | `fn camera_follow(target: Entity, smooth: Float?)` | 카메라 추적 |
| `camera_set` | `fn camera_set(pos: Vec2)` | 카메라 위치 설정 |
| `camera_shake` | `fn camera_shake(intensity: Float, duration: Float)` | 카메라 흔들기 |
| `camera_zoom` | `fn camera_zoom(scale: Float, duration: Float?)` | 카메라 줌 |
| `slow_motion` | `fn slow_motion(time_scale: Float)` | 시간 배속 조절 |

---

## 13. LOVE 2D 트랜스파일 매핑 전체 요약

| Vibe 개념 | LOVE 2D 매핑 |
|-----------|-------------|
| `@entity struct` | Lua 테이블 + 엔티티 레지스트리 |
| `@component struct` | 엔티티 테이블 내 중첩 테이블 |
| `@scene struct` | 씬 전환 상태 머신 (Lua 테이블) |
| `@on("update")` | `love.update(dt)` 내부 디스패치 |
| `@on("draw")` | `love.draw()` 내부 디스패치 |
| `@on("key_pressed")` | `love.keypressed(key)` |
| `@on("mouse_pressed")` | `love.mousepressed(x, y, button)` |
| `@on("collide")` | `World:setCallbacks()` beginContact |
| `@on("enter")` | 엔티티 생성 직후 콜백 |
| `@on("exit")` | 엔티티 파괴 직전 콜백 |
| `@on("start")` | `love.load()` |
| `@signal` + `emit()` | 커스텀 이벤트 디스패치 테이블 |
| `@system` | `love.update(dt)` 내 컴포넌트 쿼리 루프 |
| `@export` | config.lua 파일 로드 |
| `spawn()` | 테이블 생성 + 물리 바디 생성 + 레지스트리 추가 |
| `destroy()` | 파괴 대기열 추가 + 프레임 끝 제거 |
| `tween()` | flux 라이브러리 (또는 커스텀 보간) |
| `after()`/`every()` | 타이머 테이블 + `love.update`에서 카운트다운 |
| `yield` / 코루틴 | Lua `coroutine.create`/`resume`/`yield` |
| `play_sound()` | `love.audio.newSource()` + `:play()` |
| `play_music()` | `love.audio.newSource("stream")` + `:play()` |
| `RigidBody` 컴포넌트 | `love.physics.newBody()` |
| `Collider` 컴포넌트 | `love.physics.newFixture()` + `newShape()` |
| `Camera` 관련 함수 | `love.graphics.translate()`/`scale()`/`rotate()` |

---

## 14. 완전한 게임 예시: 탑다운 슈터

```
-- ============================================================
-- game.vibe: Vibe 언어로 작성한 탑다운 슈터
-- ============================================================

use math
use audio

-- ============================================================
-- 상수
-- ============================================================

const SCREEN_W: Float = 800.0
const SCREEN_H: Float = 600.0
const PLAYER_SPEED: Float = 250.0
const BULLET_SPEED: Float = 600.0
const ENEMY_SPEED: Float = 100.0
const SPAWN_INTERVAL: Float = 2.0

-- ============================================================
-- 컴포넌트 정의
-- ============================================================

@component
struct Position
  x: Float = 0.0
  y: Float = 0.0

@component
struct Velocity
  dx: Float = 0.0
  dy: Float = 0.0

@component
struct Sprite
  path: String = ""
  width: Int = 32
  height: Int = 32
  rotation: Float = 0.0

@component
struct Health
  current: Int = 100
  max: Int = 100

@component
struct Collider
  shape: Shape = Shape.Rect(32.0, 32.0)
  is_trigger: Bool = false

@component
struct Lifetime
  remaining: Float = 5.0

-- ============================================================
-- 엔티티 정의
-- ============================================================

@entity
struct Player has Damageable
  speed: Float = PLAYER_SPEED
  fire_cooldown: Float = 0.0
  score: Int = 0
  pos: Position
  vel: Velocity
  sprite: Sprite = Sprite(path: "player.png", width: 32, height: 32)
  health: Health = Health(current: 3, max: 3)
  collider: Collider = Collider(shape: Shape.Circle(16.0))

@entity
@tag("enemy")
struct Enemy
  speed: Float = ENEMY_SPEED
  points: Int = 100
  pos: Position
  vel: Velocity
  sprite: Sprite = Sprite(path: "enemy.png", width: 24, height: 24)
  health: Health = Health(current: 1, max: 1)
  collider: Collider = Collider(shape: Shape.Circle(12.0))

@entity
@tag("bullet")
struct Bullet
  damage: Int = 1
  pos: Position
  vel: Velocity
  sprite: Sprite = Sprite(path: "bullet.png", width: 8, height: 8)
  collider: Collider = Collider(shape: Shape.Circle(4.0), is_trigger: true)
  lifetime: Lifetime = Lifetime(remaining: 3.0)

@entity
struct Explosion
  pos: Position
  sprite: Sprite = Sprite(path: "explosion.png", width: 48, height: 48)
  lifetime: Lifetime = Lifetime(remaining: 0.5)

@entity
struct HudText
  label: String = ""
  value: String = ""
  x: Float = 0.0
  y: Float = 0.0

-- ============================================================
-- 시그널 정의
-- ============================================================

@signal
fn player_damaged(entity: Player, amount: Int)

@signal
fn player_died(entity: Player)

@signal
fn enemy_killed(entity: Enemy, killer: Player)

@signal
fn score_changed(entity: Player, new_score: Int)

-- ============================================================
-- 씬 정의
-- ============================================================

@scene
struct TitleScreen
  blink_timer: Float = 0.0

@scene
struct Game
  wave: Int = 1
  spawn_timer: Float = 0.0
  enemies_to_spawn: Int = 5
  game_over: Bool = false

@scene
struct GameOverScreen
  final_score: Int = 0

-- ============================================================
-- 시스템 (범용 로직)
-- ============================================================

@system
fn movement(pos: Position, vel: Velocity, dt: Float)
  pos.x = pos.x + vel.dx * dt
  pos.y = pos.y + vel.dy * dt

@system
fn lifetime_tick(entity: Entity, lifetime: Lifetime, dt: Float)
  lifetime.remaining = lifetime.remaining - dt
  if lifetime.remaining <= 0.0
    destroy(entity)

-- ============================================================
-- 타이틀 화면
-- ============================================================

@on("enter")
fn title_enter(scene: TitleScreen)
  play_music("title_bgm.ogg", loop: true)

@on("update")
fn title_update(scene: TitleScreen, dt: Float)
  scene.blink_timer = scene.blink_timer + dt

@on("draw")
fn title_draw(scene: TitleScreen)
  draw_text("SPACE SHOOTER", x: 250.0, y: 200.0, size: 48)
  if (scene.blink_timer % 1.0) < 0.7
    draw_text("Press ENTER to start", x: 280.0, y: 350.0, size: 20)

@on("key_pressed", key: "return")
fn title_start(scene: TitleScreen)
  go_to(Game)

-- ============================================================
-- 게임 씬 -- 씬 생명주기
-- ============================================================

@on("enter")
fn game_enter(scene: Game)
  play_music("game_bgm.ogg", loop: true)
  spawn(Player, pos: Position(x: SCREEN_W / 2.0, y: SCREEN_H - 80.0))

@on("update")
fn game_update(scene: Game, dt: Float)
  if scene.game_over
    return
  -- 적 스폰
  scene.spawn_timer = scene.spawn_timer + dt
  if scene.spawn_timer >= SPAWN_INTERVAL and scene.enemies_to_spawn > 0
    scene.spawn_timer = 0.0
    scene.enemies_to_spawn = scene.enemies_to_spawn - 1
    let x: Float = rand_float(50.0, SCREEN_W - 50.0)
    spawn(Enemy,
      pos: Position(x: x, y: -30.0),
      speed: ENEMY_SPEED + scene.wave.to_float() * 15.0
    )
  -- 웨이브 클리어 확인
  if scene.enemies_to_spawn == 0 and count(Enemy) == 0
    scene.wave = scene.wave + 1
    scene.enemies_to_spawn = 5 + scene.wave * 2
    scene.spawn_timer = 0.0

@on("draw")
fn game_draw(scene: Game)
  let player: Player? = find_first(Player)
  match player
    some(p)
      draw_text("Score: {p.score}", x: 10.0, y: 10.0, size: 20)
      draw_text("HP: {p.health.current}", x: 10.0, y: 35.0, size: 20)
      draw_text("Wave: {scene.wave}", x: SCREEN_W - 120.0, y: 10.0, size: 20)
    none
      draw_text("GAME OVER", x: 300.0, y: 280.0, size: 48)

-- ============================================================
-- 플레이어 행동
-- ============================================================

@on("update")
fn player_move(player: Player, dt: Float)
  let dx: Float = input_axis("left", "right")
  let dy: Float = input_axis("up", "down")
  player.vel.dx = dx * player.speed
  player.vel.dy = dy * player.speed
  -- 화면 밖으로 나가지 않도록
  player.pos.x = clamp(player.pos.x, 16.0, SCREEN_W - 16.0)
  player.pos.y = clamp(player.pos.y, 16.0, SCREEN_H - 16.0)
  -- 쿨다운 감소
  player.fire_cooldown = max(player.fire_cooldown - dt, 0.0)

@on("key_down", key: "space")
fn player_shoot(player: Player, dt: Float)
  if player.fire_cooldown <= 0.0
    player.fire_cooldown = 0.15
    play_sound("shoot.wav", volume: 0.5)
    spawn(Bullet,
      pos: Position(x: player.pos.x, y: player.pos.y - 20.0),
      vel: Velocity(dx: 0.0, dy: -BULLET_SPEED)
    )

-- ============================================================
-- 적 행동
-- ============================================================

@on("update")
fn enemy_move(enemy: Enemy, dt: Float)
  -- 플레이어를 향해 이동
  let player: Player? = find_first(Player)
  match player
    some(p)
      let dir: Vec2 = direction(
        Vec2(enemy.pos.x, enemy.pos.y),
        Vec2(p.pos.x, p.pos.y)
      )
      enemy.vel.dx = dir.x * enemy.speed
      enemy.vel.dy = dir.y * enemy.speed
    none
      enemy.vel.dx = 0.0
      enemy.vel.dy = enemy.speed

-- ============================================================
-- 충돌 처리
-- ============================================================

@on("collide", other: Enemy)
fn bullet_hit_enemy(bullet: Bullet, enemy: Enemy, col: Collision)
  enemy.health.current = enemy.health.current - bullet.damage
  destroy(bullet)
  if enemy.health.current <= 0
    let player: Player? = find_first(Player)
    match player
      some(p)
        p.score = p.score + enemy.points
        emit(p, "score_changed", new_score: p.score)
      none
        pass
    spawn(Explosion, pos: Position(x: enemy.pos.x, y: enemy.pos.y))
    play_sound("explosion.wav", volume: 0.7)
    emit(enemy, "enemy_killed", killer: player or Player())
    destroy(enemy)

@on("collide", other: Player)
fn enemy_hit_player(enemy: Enemy, player: Player, col: Collision)
  player.health.current = player.health.current - 1
  emit(player, "player_damaged", amount: 1)
  camera_shake(5.0, duration: 0.2)
  spawn(Explosion, pos: Position(x: enemy.pos.x, y: enemy.pos.y))
  destroy(enemy)
  if player.health.current <= 0
    emit(player, "player_died")

-- ============================================================
-- 시그널 핸들러
-- ============================================================

@on("player_damaged")
fn on_player_damaged(player: Player, amount: Int)
  play_sound("hit.wav")
  -- 피격 무적 깜빡임
  tween(player.sprite, "alpha", to: 0.3, duration: 0.1, ease: "linear")
  after(0.1, fn()
    tween(player.sprite, "alpha", to: 1.0, duration: 0.1, ease: "linear")
  )

@on("player_died")
fn on_player_died(player: Player)
  play_sound("game_over.wav")
  spawn(Explosion, pos: Position(x: player.pos.x, y: player.pos.y))
  destroy(player)
  after(2.0, fn()
    let scene: Game? = find_first(Game)
    match scene
      some(s)
        go_to(GameOverScreen, final_score: 0)
      none
        go_to(GameOverScreen, final_score: 0)
  )

@on("score_changed")
fn on_score_changed(player: Player, new_score: Int)
  -- 1000점마다 체력 회복
  if new_score % 1000 == 0
    player.health.current = min(player.health.current + 1, player.health.max)
    play_sound("heal.wav")

-- ============================================================
-- 게임 오버 화면
-- ============================================================

@on("enter")
fn gameover_enter(scene: GameOverScreen)
  stop_music()

@on("draw")
fn gameover_draw(scene: GameOverScreen)
  draw_text("GAME OVER", x: 270.0, y: 200.0, size: 48)
  draw_text("Final Score: {scene.final_score}", x: 290.0, y: 280.0, size: 24)
  draw_text("Press ENTER to retry", x: 280.0, y: 380.0, size: 20)

@on("key_pressed", key: "return")
fn gameover_restart(scene: GameOverScreen)
  go_to(Game)

@on("key_pressed", key: "escape")
fn gameover_to_title(scene: GameOverScreen)
  go_to(TitleScreen)
```

---

## 15. 설계 결정 근거 종합

### 15.1 `@entity` vs `entity` 키워드

| 관점 | `entity` 키워드 | `@entity` 어노테이션 |
|------|---------------|-------------------|
| 파서 | `entity` 전용 문법 규칙 필요 | `struct` 문법 재사용, 의미 분석에서 처리 |
| 키워드 예산 | 1개 소모 | 0개 |
| LLM 전이 | 기존 언어에 `entity` 키워드 없음 | Python `@dataclass`, Java `@Entity` 패턴 풍부 |
| 확장성 | 새 게임 개념마다 키워드 추가 | `@component`, `@networked` 등 자유롭게 추가 |

### 15.2 `@on` vs `on` 키워드

`on` 키워드의 장점은 `fn`과의 구분이 명확하다는 것이었다. 그러나 `@on` 어노테이션도 동일한 명확성을 제공한다:

```
-- @on 어노테이션: fn이라는 것이 명확 + 이벤트 핸들러라는 것도 명확
@on("update")
fn player_update(player: Player, dt: Float)
  ...

-- 일반 함수: @on이 없으면 일반 함수
fn calculate_damage(base: Int, multiplier: Float) -> Int
  return (base.to_float() * multiplier).to_int()
```

### 15.3 `@signal` vs `signal` 키워드

`signal`을 키워드로 만들면 GDScript와 유사해지지만, 어노테이션으로도 동일한 기능을 제공한다:

```
-- GDScript 스타일 (signal 키워드)
signal health_changed(old: int, new: int)

-- Vibe 스타일 (@signal 어노테이션)
@signal
fn health_changed(entity: Player, old_value: Int, new_value: Int)
```

Vibe 스타일의 장점:
1. **타입 정보가 완전하다**: 첫 번째 매개변수로 발신자 타입이 명시됨
2. **함수 시그니처 문법 재사용**: 새로운 구문 규칙이 불필요
3. **컴파일러가 `emit()` 호출의 인자를 검증**할 수 있음

### 15.4 충돌 이벤트의 타입 필터링 vs 태그 필터링

두 가지 방식을 모두 제공한다:

```
-- 타입 필터링: 특정 엔티티 타입과의 충돌
@on("collide", other: Enemy)
fn bullet_hit_enemy(bullet: Bullet, enemy: Enemy, col: Collision)

-- 태그 필터링: 태그로 충돌 대상 지정
@on("collide", tag: "coin")
fn player_collect(player: Player, coin: Entity, col: Collision)
```

**타입 필터링**은 컴파일 타임에 타입 안전성을 보장한다 (enemy 매개변수가 Enemy 타입).
**태그 필터링**은 런타임 유연성을 제공한다 (다양한 엔티티를 하나의 태그로 묶기).

---

## 16. 키워드 예산 최종 확인

```
핵심 언어 키워드 (vibe-core-grammar.peg): 20개
  fn let const if else for in match return break
  continue enum struct and or not use yield trait has

게임 도메인 키워드:                         0개
  (모두 @어노테이션으로 처리)

합계:                                      20개
목표:                                      20-30개
여유:                                      10개

예약된 여유 슬롯 (향후 필요 시 추가):
  - import (모듈 시스템 확장)
  - pub (접근 제어)
  - type (타입 별칭)
  - async / await (비동기 확장)
  - mut (불변 기본으로 전환 시)
  - self (메서드 문법 도입 시)
  - while (별도 루프 키워드가 필요하면)
```

어노테이션 방식을 채택함으로써 키워드 예산에 **10개의 여유**가 확보되었다. 이것은 언어의 미래 발전에 매우 유리한 위치다.

---

## 17. 열린 질문

### Q1: `@on("update")`의 실행 순서를 제어할 수 있는가?

현재 설계에서는 같은 이벤트에 등록된 핸들러의 실행 순서가 **정의되지 않는다** (registration order). 우선순위가 필요하면 `@on("update", priority: 10)` 같은 인자를 추가할 수 있다. v0.1에서는 파일 내 정의 순서를 따른다.

### Q2: `@entity`는 다른 `@entity`를 필드로 가질 수 있는가?

**아니다.** 엔티티 간 참조는 `Entity?` 타입(옵셔널 엔티티 참조)으로 표현하며, 이는 참조일 뿐 소유가 아니다:

```
@entity
struct HomingMissile
  target: Entity? = none    -- 추적 대상 엔티티 참조 (소유 아님)
  pos: Position
  vel: Velocity
```

### Q3: `@system`과 `@on("update")`가 동시에 있으면 어떤 순서로 실행되는가?

실행 순서: `@system` -> `@on("update")`. 시스템은 범용 물리/이동 처리를 먼저 수행하고, 이후 개별 엔티티 로직이 실행된다.

### Q4: 씬 간 데이터 공유는 어떻게 하는가?

씬 전환 시 `go_to`의 파라미터로 데이터를 전달한다. 영속적인 데이터(세이브 파일, 설정 등)는 별도 모듈의 전역 상태로 관리한다:

```
-- globals.vibe
let save_data: SaveData = load_save() or SaveData()

-- game.vibe
@on("enter")
fn game_enter(scene: Game)
  scene.score = save_data.last_score
```
