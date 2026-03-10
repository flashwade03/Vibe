# Vibe Game Engine - 아키텍처 심층 분석 보고서

## 목차
1. [KAPLAY 아키텍처 분석](#1-kaplay-아키텍처-분석)
2. [LOVE 2D 아키텍처 분석](#2-love-2d-아키텍처-분석)
3. [Godot 아키텍처 분석 (비교용)](#3-godot-아키텍처-분석)
4. [게임 언어에 필수적인 내장 기능](#4-게임-언어에-필수적인-내장-기능)
5. [언어 수준의 게임 패턴](#5-일반-게임-패턴을-언어-구성요소로)
6. [런타임 아키텍처](#6-런타임-아키텍처)
7. [API 설계 철학 비교](#7-api-설계-철학-비교)

---

## 1. KAPLAY 아키텍처 분석

### 1.1 핵심 설계 철학: "Fun-First"

KAPLAY(구 Kaboom.js)는 **"재미 우선(fun-first)"** 2D 게임 라이브러리다. 핵심 철학은 단 하나: **코딩하면서 게임을 만드는 느낌**을 주는 것이다. 이 철학이 API 전체를 지배한다.

### 1.2 초기화와 전역 함수 패턴

KAPLAY의 가장 특징적인 패턴은 **"모든 것이 전역 함수"**라는 점이다:

```javascript
// 엔진 초기화 - 단 한 줄
kaplay({
    background: "#6d80fa",
});

// 에셋 로딩 - 전역 함수
loadSprite("bean", "https://play.kaplayjs.com/bean.png");

// 게임 오브젝트 생성 - 전역 함수
const bean = add([
    sprite("bean"),
    pos(100, 200),
    scale(2),
    rotate(0),
    anchor("center"),
    area(),
    body(),
    health(100),
    "player",        // 태그 (문자열)
    {                // 커스텀 데이터 (객체 리터럴)
        speed: 300,
        coins: 0,
    },
]);
```

**분석**: `kaplay()` 호출 시 모든 API 함수(`add`, `sprite`, `pos`, `area`, `onKeyPress` 등)가 전역 스코프에 주입된다. 이것은 초보자에게는 극도로 편리하지만, 대규모 프로젝트에서는 네임스페이스 오염 문제가 발생한다.

### 1.3 컴포넌트 시스템: 배열 기반 조합

KAPLAY의 핵심은 **컴포넌트 배열 패턴**이다. 게임 오브젝트는 `add()` 함수에 컴포넌트 배열을 전달하여 생성한다:

```javascript
const obj = add([
    // === 변환(Transform) 컴포넌트 ===
    pos(100, 100),            // 위치: obj.pos, obj.move(), obj.moveTo()
    scale(1),                 // 크기: obj.scale, obj.scaleTo()
    rotate(0),                // 회전: obj.angle
    anchor("center"),         // 앵커: "topleft", "center", "botright" 등
    z(10),                    // Z순서 (그리기 순서)

    // === 렌더링 컴포넌트 ===
    sprite("player"),         // 스프라이트: obj.sprite, obj.play(), obj.frame
    color(255, 0, 0),         // 색상 틴트: obj.color
    opacity(1),               // 투명도: obj.opacity, obj.fadeIn()
    rect(50, 50),             // 사각형 도형
    circle(25),               // 원형 도형
    text("Hello"),            // 텍스트: obj.text, obj.font, obj.textSize

    // === 물리 컴포넌트 ===
    area(),                   // 충돌 영역: obj.onCollide(), obj.isHovering()
    body(),                   // 물리 바디: obj.jump(), obj.isGrounded()

    // === 유틸리티 컴포넌트 ===
    health(100),              // 체력: obj.hp, obj.heal(), obj.hurt()
    timer(),                  // 타이머: obj.wait(), obj.loop(), obj.tween()
    state("idle", ["idle", "walk", "jump"]),  // 상태 머신
    animate(),                // 키프레임 애니메이션
    lifespan(2),              // 2초 후 자동 파괴
    offscreen({ destroy: true }),  // 화면 밖 처리
    follow(target, vec2(0, -20)),  // 다른 오브젝트 추적
    layer("ui"),              // 렌더 레이어
    fixed(),                  // 카메라 변환 무시
]);
```

**핵심 통찰**: 이 패턴은 전통적인 ECS(Entity-Component-System)와 다르다. **"System"이 없다**. 대신 각 컴포넌트가 자체적으로 동작(behavior)을 포함한다. 이것은 "Component-Attach" 패턴이며, Unity의 MonoBehaviour와 유사하지만 훨씬 가볍다.

### 1.4 태그 기반 객체 관리

KAPLAY는 클래스 상속 대신 **태그(tag) 시스템**으로 객체를 분류한다:

```javascript
// 태그는 문자열로 컴포넌트 배열에 포함
add([sprite("enemy"), pos(200, 100), area(), "enemy", "dangerous"]);
add([sprite("coin"), pos(300, 200), area(), "coin", "collectible"]);

// 태그 기반 충돌 처리
player.onCollide("enemy", (enemy, collision) => {
    if (collision.isBottom()) {
        destroy(enemy);           // 적 밟기
        player.jump(400);
    } else {
        player.hurt(1);           // 피격
    }
});

player.onCollide("coin", (coin) => {
    destroy(coin);
    score += 10;
});

// 태그 기반 일괄 처리
onUpdate("enemy", (enemy) => {
    enemy.move(-100, 0);          // 모든 "enemy" 태그 객체를 왼쪽으로 이동
});
```

### 1.5 씬(Scene) 시스템

```javascript
// 씬 정의
scene("menu", () => {
    add([text("Press Space to Start"), pos(center())]);
    onKeyPress("space", () => go("game"));
});

scene("game", ({ level, score }) => {
    // 구조 분해로 파라미터 수신
    add([text(`Level: ${level}`), pos(12, 12)]);

    // ... 게임 로직
    player.onCollide("goal", () => {
        go("game", { level: level + 1, score: score + 100 });
    });
});

scene("gameover", (finalScore) => {
    add([text(`Game Over! Score: ${finalScore}`), pos(center())]);
});

// 씬 전환 (데이터 전달 가능)
go("menu");
go("game", { level: 1, score: 0 });
```

**중요한 제약**: `go()` 호출 시 현재 씬의 **모든 게임 오브젝트가 파괴**된다. `stay()` 컴포넌트를 사용해야 씬 전환 시 유지된다.

### 1.6 입력 시스템

```javascript
// 추상화된 버튼 바인딩 (키보드 + 게임패드 통합)
kaplay({
    buttons: {
        jump: { keyboard: ["space", "w"], gamepad: ["south"] },
        fire: { keyboard: ["f"], mouse: "left", gamepad: ["west"] },
    },
});

// 추상 버튼으로 처리
onButtonPress("jump", () => player.jump());
onButtonDown("fire", () => shoot());

// 또는 직접 처리
onKeyPress("space", () => player.jump());
onKeyDown("left", () => player.move(-SPEED, 0));
onMousePress("left", () => shoot(mousePos()));
onGamepadStick("left", (vec) => player.move(vec.x * SPEED, vec.y * SPEED));

// 터치 입력
onTouchStart((pos, touch) => { /* ... */ });
```

### 1.7 게임 루프 모델

KAPLAY는 게임 루프를 **완전히 숨긴다**. 사용자는 `onUpdate`, `onDraw` 콜백만 등록한다:

```javascript
// 프레임마다 실행되는 로직
onUpdate(() => {
    // 전역 업데이트 로직
});

// 특정 태그 객체만 업데이트
onUpdate("enemy", (e) => {
    e.move(-100 * dt(), 0);    // dt()로 델타 타임 접근
});

// 그리기 (커스텀 렌더링이 필요한 경우)
onDraw(() => {
    drawLine({ p1: vec2(0), p2: mousePos(), color: RED });
});
```

### 1.8 KAPLAY의 장점과 한계

**장점:**
- 극도의 진입 장벽 낮춤 (5줄로 게임 시작)
- 컴포넌트 조합이 직관적
- 태그 시스템이 간단하면서 강력
- 내장 물리, 충돌, 애니메이션
- 웹 기반 에디터(KAPLAYGROUND) 제공

**한계:**
- 전역 함수 오염 (대규모 프로젝트 부적합)
- 커스텀 렌더링 파이프라인 부재
- 성능 최적화 어려움 (ECS 아님)
- 씬 전환 시 모든 객체 파괴 (유연하지 않음)
- 3D 지원 불가
- 타일맵/레벨 에디터 통합 미흡

---

## 2. LOVE 2D 아키텍처 분석

### 2.1 핵심 설계 철학: "프레임워크, 엔진이 아님"

LOVE 2D는 스스로를 **"프레임워크"**라고 정의한다. 게임 구조를 강제하지 않고, 개발자에게 빌딩 블록만 제공한다. Lua 언어를 사용하며, C++/SDL 기반의 네이티브 백엔드를 가진다.

### 2.2 콜백 기반 아키텍처

LOVE 2D의 핵심은 **콜백 함수** 패턴이다:

```lua
-- 게임 초기화 (한 번 실행)
function love.load()
    player = {
        x = 400,
        y = 300,
        speed = 200,
        sprite = love.graphics.newImage("player.png")
    }
    bullets = {}
    enemies = {}
    score = 0
end

-- 게임 로직 업데이트 (매 프레임)
function love.update(dt)
    -- dt = 이전 프레임 이후 경과 시간 (초)
    if love.keyboard.isDown("left") then
        player.x = player.x - player.speed * dt
    end
    if love.keyboard.isDown("right") then
        player.x = player.x + player.speed * dt
    end

    -- 총알 업데이트
    for i = #bullets, 1, -1 do
        bullets[i].y = bullets[i].y - 500 * dt
        if bullets[i].y < 0 then
            table.remove(bullets, i)
        end
    end
end

-- 렌더링 (매 프레임, update 후)
function love.draw()
    love.graphics.draw(player.sprite, player.x, player.y)
    for _, bullet in ipairs(bullets) do
        love.graphics.rectangle("fill", bullet.x, bullet.y, 4, 10)
    end
    love.graphics.print("Score: " .. score, 10, 10)
end

-- 이벤트 콜백
function love.keypressed(key)
    if key == "space" then
        table.insert(bullets, { x = player.x, y = player.y })
    end
    if key == "escape" then
        love.event.quit()
    end
end

function love.keyreleased(key)
    -- 키 해제 시
end

function love.mousepressed(x, y, button)
    if button == 1 then  -- 좌클릭
        table.insert(bullets, { x = x, y = y })
    end
end

function love.focus(focused)
    -- 윈도우 포커스 변경 시
end

function love.quit()
    -- 게임 종료 전 정리
    return false  -- true 반환 시 종료 취소
end
```

**분석**: 이 패턴의 핵심은 **관심사의 분리**다. `load`에서 초기화, `update`에서 로직, `draw`에서 렌더링. 단순하지만 강력하다. 개발자가 게임 구조를 100% 자유롭게 설계할 수 있다.

### 2.3 모듈 시스템

LOVE 2D는 약 15개의 핵심 모듈로 구성된다:

```
love.graphics   - 렌더링 (Canvas, Image, Mesh, Font, Shader, ParticleSystem)
love.physics    - Box2D 물리 엔진 래퍼 (World, Body, Shape, Fixture, Joint)
love.audio      - 오디오 (Source, RecordingDevice, 공간 음향)
love.keyboard   - 키보드 입력
love.mouse      - 마우스 입력 (위치, 버튼, 커서)
love.joystick   - 게임패드/조이스틱
love.touch      - 터치 입력 (압력 감도 포함)
love.filesystem - 파일 시스템 (세이브/로드)
love.window     - 윈도우 관리
love.timer      - 시간 관리 (dt, FPS)
love.math       - 수학 유틸리티 (노이즈, 랜덤)
love.system     - OS 정보
love.thread     - 스레딩
love.event      - 이벤트 큐
love.data       - 데이터 인코딩/디코딩
```

### 2.4 물리 엔진 통합 (Box2D)

```lua
function love.load()
    -- 물리 세계 생성 (중력: x=0, y=9.81*64)
    world = love.physics.newWorld(0, 9.81 * 64, true)

    -- 바닥 (정적 바디)
    ground = {}
    ground.body = love.physics.newBody(world, 400, 550, "static")
    ground.shape = love.physics.newRectangleShape(800, 20)
    ground.fixture = love.physics.newFixture(ground.body, ground.shape)

    -- 플레이어 (동적 바디)
    player = {}
    player.body = love.physics.newBody(world, 400, 200, "dynamic")
    player.shape = love.physics.newCircleShape(20)
    player.fixture = love.physics.newFixture(player.body, player.shape, 1)
    player.fixture:setRestitution(0.5)  -- 탄성

    -- 충돌 콜백
    world:setCallbacks(beginContact, endContact, preSolve, postSolve)
end

function beginContact(a, b, coll)
    -- a, b는 fixture, coll은 Contact 객체
end

function love.update(dt)
    world:update(dt)  -- 물리 시뮬레이션 진행
end

function love.draw()
    love.graphics.circle("fill",
        player.body:getX(), player.body:getY(),
        player.shape:getRadius())
    love.graphics.rectangle("fill",
        ground.body:getX() - 400, ground.body:getY() - 10,
        800, 20)
end
```

**분석**: LOVE 2D의 물리는 **명시적이고 저수준**이다. Body/Shape/Fixture를 직접 생성해야 한다. KAPLAY처럼 `body()` 한 줄로 끝나지 않는다. 이는 유연성을 주지만 진입 장벽이 높다.

### 2.5 게임 루프 내부 구조

LOVE 2D의 `love.run()` 기본 구현:

```lua
function love.run()
    if love.load then love.load(love.arg.parseGameArguments(arg), arg) end

    -- 타이머가 dt를 추적하기 시작
    if love.timer then love.timer.step() end

    local dt = 0
    local fixed_dt = 1/60
    local accumulator = 0

    -- 메인 게임 루프
    return function()
        -- 이벤트 처리
        if love.event then
            love.event.pump()
            for name, a,b,c,d,e,f in love.event.poll() do
                if name == "quit" then
                    if not love.quit or not love.quit() then
                        return a or 0
                    end
                end
                love.handlers[name](a,b,c,d,e,f)
            end
        end

        -- 델타 타임 계산
        if love.timer then dt = love.timer.step() end

        -- 업데이트
        if love.update then love.update(dt) end

        -- 렌더링
        if love.graphics and love.graphics.isActive() then
            love.graphics.origin()
            love.graphics.clear(love.graphics.getBackgroundColor())
            if love.draw then love.draw() end
            love.graphics.present()
        end

        if love.timer then love.timer.sleep(0.001) end
    end
end
```

**핵심 통찰**: `love.run()`을 **오버라이드할 수 있다**. 이는 고정 시간 간격(fixed timestep), 물리 보간(interpolation) 등 고급 게임 루프를 직접 구현할 수 있다는 의미다.

### 2.6 상태 관리 (커뮤니티 패턴)

LOVE 2D는 내장 씬/상태 시스템이 **없다**. 커뮤니티 라이브러리를 사용하거나 직접 구현한다:

```lua
-- 수동 상태 관리 패턴
local states = {}
local currentState = nil

states.menu = {
    enter = function()
        -- 메뉴 초기화
    end,
    update = function(dt)
        if love.keyboard.isDown("return") then
            switchState("game")
        end
    end,
    draw = function()
        love.graphics.print("Press Enter to Start", 300, 300)
    end,
}

states.game = {
    enter = function()
        -- 게임 초기화
    end,
    update = function(dt)
        -- 게임 로직
    end,
    draw = function()
        -- 게임 렌더링
    end,
}

function switchState(name)
    if currentState and currentState.exit then currentState.exit() end
    currentState = states[name]
    if currentState.enter then currentState.enter() end
end

function love.load()
    switchState("menu")
end

function love.update(dt)
    if currentState.update then currentState.update(dt) end
end

function love.draw()
    if currentState.draw then currentState.draw() end
end
```

### 2.7 LOVE 2D의 장점과 한계

**장점:**
- 극도의 유연성 (프레임워크가 구조를 강제하지 않음)
- Lua의 간결함과 빠른 프로토타이핑
- Box2D 통합 물리 엔진
- 크로스 플랫폼 (Windows, Mac, Linux, Android, iOS)
- 성숙한 생태계와 커뮤니티
- `love.run()` 오버라이드로 게임 루프 완전 제어
- 네이티브 C++ 백엔드로 우수한 성능

**한계:**
- 내장 씬/상태 관리 없음 (매번 직접 구현)
- 내장 ECS/컴포넌트 시스템 없음
- 내장 UI 시스템 없음
- 타일맵 지원 없음 (서드파티 필요)
- 물리 API가 저수준 (Box2D 직접 노출)
- 에디터 없음 (코드만으로 개발)
- 웹 배포 공식 미지원 (비공식 love.js 존재)

---

## 3. Godot 아키텍처 분석

### 3.1 핵심 설계 철학: "모든 것은 노드"

Godot의 핵심 추상화는 **노드 트리(Node Tree)**다. 게임의 모든 것(스프라이트, 물리 바디, 오디오, UI, 스크립트)이 노드이고, 노드는 트리 구조로 조직된다.

### 3.2 노드 생명주기

```gdscript
extends Node

# 노드가 씬 트리에 진입할 때 (초기화)
func _ready():
    print("Node is ready!")
    var sprite = $Sprite2D  # get_node("Sprite2D")의 축약

# 매 프레임 호출 (렌더링, 애니메이션)
func _process(delta: float):
    rotation += 2.0 * delta

# 고정 간격 호출 (물리, 게임 로직)
func _physics_process(delta: float):
    velocity += gravity * delta
    move_and_slide()

# 입력 이벤트 발생 시
func _input(event: InputEvent):
    if event.is_action_pressed("jump"):
        velocity.y = -jump_force

# 노드가 트리에서 제거될 때 (정리)
func _exit_tree():
    print("Cleaning up...")
```

**핵심 차이점**: LOVE 2D는 `update`/`draw` 두 개의 콜백만 있지만, Godot는 `_process`(렌더링 프레임)와 `_physics_process`(물리 프레임)를 **분리**한다. 이것이 고정 시간 간격 물리를 자연스럽게 지원하는 이유다.

### 3.3 씬 시스템: 재사용 가능한 노드 트리

Godot에서 **씬(Scene)**은 노드 트리의 저장 단위다:

```
# Player.tscn 씬 구조
Player (CharacterBody2D)
  ├── Sprite2D
  ├── CollisionShape2D
  ├── AnimationPlayer
  └── Muzzle (Marker2D)

# Level.tscn 씬 구조
Level (Node2D)
  ├── TileMap
  ├── Player (Player.tscn 인스턴스)
  ├── Enemies
  │   ├── Enemy1 (Enemy.tscn 인스턴스)
  │   └── Enemy2 (Enemy.tscn 인스턴스)
  └── UI (Control)
      ├── HealthBar
      └── ScoreLabel
```

씬을 코드로 인스턴스화:

```gdscript
extends Node2D

const BulletScene = preload("res://scenes/bullet.tscn")
const EnemyScene = preload("res://scenes/enemy.tscn")

@export var enemy_scene: PackedScene  # 에디터에서 할당 가능

func spawn_bullet():
    var bullet = BulletScene.instantiate()
    bullet.position = $Muzzle.global_position
    bullet.rotation = rotation
    bullet.speed = 800.0
    get_parent().add_child(bullet)  # 트리에 추가

func spawn_enemy_at(pos: Vector2):
    var enemy = enemy_scene.instantiate()
    enemy.position = pos
    enemy.died.connect(_on_enemy_died)  # 시그널 연결
    add_child(enemy)

func _on_enemy_died():
    score += 100

func go_to_next_level():
    get_tree().change_scene_to_file("res://scenes/level_2.tscn")

func restart_level():
    get_tree().reload_current_scene()

func destroy():
    queue_free()  # 안전한 삭제 (현재 프레임 끝에서)
```

### 3.4 시그널 시스템: 옵저버 패턴

Godot의 시그널은 **느슨한 결합(loose coupling)**을 실현하는 핵심 메커니즘이다:

```gdscript
extends Node

# 커스텀 시그널 정의
signal health_changed(new_health: int)
signal player_died
signal item_collected(item_name: String, quantity: int)

# setter로 자동 시그널 발신
var health: int = 100:
    set(value):
        health = clamp(value, 0, MAX_HEALTH)
        health_changed.emit(health)      # 시그널 발신
        if health <= 0:
            player_died.emit()

func _ready():
    # 자식 노드의 시그널에 연결
    $Button.pressed.connect(_on_button_pressed)
    $Area2D.body_entered.connect(_on_body_entered)

    # 자신의 시그널에 연결
    health_changed.connect(_on_health_changed)

func _on_body_entered(body: Node2D):
    if body.is_in_group("enemies"):
        take_damage(10)

func _on_health_changed(new_health: int):
    $HealthBar.value = new_health

func collect_item(item_name: String, qty: int = 1):
    item_collected.emit(item_name, qty)
```

**Vibe 엔진에 차용할 수 있는 개념:**
- 시그널은 게임에서 **필수적**인 통신 패턴이다 (체력 변화 -> UI 갱신, 적 사망 -> 점수 증가)
- 시그널을 **언어 수준**에서 지원하면 엄청난 편의성을 제공한다
- setter와 시그널의 통합 (`var health: set -> emit`)은 매우 강력하다

### 3.5 물리 바디 예시

```gdscript
extends CharacterBody2D

@export var speed: float = 400.0
@export var jump_velocity: float = -400.0
@export var gravity: float = 980.0

func _physics_process(delta: float):
    # 중력 적용
    if not is_on_floor():
        velocity.y += gravity * delta

    # 점프
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_velocity

    # 수평 이동 (-1, 0, 1)
    var direction = Input.get_axis("move_left", "move_right")
    if direction != 0:
        velocity.x = direction * speed
    else:
        velocity.x = move_toward(velocity.x, 0, speed)

    move_and_slide()  # 물리 처리 + 충돌 응답
```

### 3.6 상태 머신 패턴

Godot에서는 노드 트리 자체를 상태 머신으로 사용한다:

```gdscript
# StateMachine.gd
func _init():
    add_to_group("state_machine")

func _ready():
    state_changed.connect(_on_state_changed)
    _state.enter()

func _unhandled_input(event):
    _state.unhandled_input(event)

func transition_to(target_state_path, msg={}):
    if not has_node(target_state_path):
        return
    var target_state = get_node(target_state_path)
    _state.exit()
    self._state = target_state
    _state.enter(msg)
    Events.player_state_changed.emit(_state.name)
```

### 3.7 Godot에서 가볍게 차용할 수 있는 것

| Godot 개념 | 차용 가능성 | 이유 |
|---|---|---|
| 노드 트리 | **부분 차용** | 계층 구조는 유용하나 전체 에디터는 불필요 |
| 시그널 | **강력 추천** | 게임의 이벤트 통신에 필수적 |
| `_process`/`_physics_process` 분리 | **강력 추천** | 렌더링과 물리를 분리해야 안정적 |
| 씬 인스턴스화 | **추천** | 프리팹(prefab) 개념은 매우 유용 |
| `@export` | **추천** | 에디터 연동 아니더라도 설정값 노출에 유용 |
| 그룹(Group) | **추천** | KAPLAY의 태그와 유사, 매우 실용적 |
| `queue_free()` | **참고** | 안전한 객체 삭제 패턴 |

---

## 4. 게임 언어에 필수적인 내장 기능

### 4.1 엔티티/컴포넌트 시스템

**세 가지 접근법 비교:**

#### A. 전통적 ECS (Bevy 스타일)
```
// 엔티티 = ID, 컴포넌트 = 데이터, 시스템 = 로직
component Position { x: float, y: float }
component Velocity { dx: float, dy: float }
component Sprite { image: string }

system move_system(query: [Position, Velocity]) {
    for entity in query {
        entity.Position.x += entity.Velocity.dx * dt
        entity.Position.y += entity.Velocity.dy * dt
    }
}
```
- **장점**: 최고의 성능 (캐시 친화적), 대규모 게임에 적합
- **단점**: 초보자에게 추상적, 컴포넌트 간 통신이 복잡

#### B. 상속 기반 (전통 OOP)
```
class Enemy extends Sprite {
    health: int = 100
    speed: float = 50.0

    on update(dt) {
        move(-speed * dt, 0)
    }
}
```
- **장점**: 직관적, 대부분의 개발자에게 친숙
- **단점**: 다이아몬드 상속 문제, 경직된 계층 구조

#### C. 컴포넌트 부착 (KAPLAY/Unity 스타일) -- **권장**
```
entity player = create {
    sprite("hero"),
    position(100, 200),
    physics(dynamic),
    collider(box),
    health(100),
    tag("player"),
    {
        speed: 300,
        coins: 0,
    }
}
```
- **장점**: 유연한 조합, 코드 재사용, 직관적
- **단점**: 순수 ECS보다 성능 낮음 (하지만 2D 게임에는 충분)

**Vibe 엔진 추천**: **컴포넌트 부착 방식을 기본으로, ECS적 성능 최적화를 내부에서 수행**. 사용자 API는 KAPLAY처럼 간결하게, 런타임은 ECS처럼 효율적으로.

### 4.2 물리 시스템

**결론: 내장 2D 물리 필수, 단계적 추상화**

```
// Level 1: 간단한 물리 (대부분의 게임에 충분)
entity player = create {
    position(100, 200),
    physics(dynamic),      // 자동으로 중력, 충돌 처리
    collider(box),
}
player.jump(400)
player.is_grounded()       // 바닥 접촉 여부

// Level 2: 세밀한 제어
entity platform = create {
    position(0, 500),
    physics(static),
    collider(rect(800, 20)),
    friction(0.8),
    restitution(0.2),      // 탄성
}

// Level 3: 저수준 접근 (필요 시)
physics.set_gravity(0, 980)
physics.raycast(from, to)
physics.add_joint(a, b, type: revolute)
```

### 4.3 렌더링: 최소 필수 요소

| 기능 | 필수 여부 | 설명 |
|---|---|---|
| 스프라이트 | **필수** | 이미지 표시, 스프라이트시트, 애니메이션 |
| 도형 | **필수** | rect, circle, line, polygon |
| 텍스트 | **필수** | 폰트 렌더링, 정렬, 크기 |
| 타일맵 | **필수** | 2D 게임의 핵심, Tiled 호환 권장 |
| 카메라 | **필수** | 이동, 줌, 회전, 대상 추적 |
| 파티클 | **중요** | 시각 효과에 필수적 |
| 셰이더 | **선택** | 고급 시각 효과 (나중에 추가 가능) |
| 레이어/Z순서 | **필수** | 그리기 순서 제어 |
| 스프라이트 배칭 | **내부** | 성능 최적화 (사용자에게 투명) |

```
// 최소한의 렌더링 API 설계안
sprite("hero", x: 100, y: 200, frame: 3)
rect(0, 0, 100, 50, fill: red)
circle(200, 200, 30, fill: blue)
text("Score: 100", x: 10, y: 10, size: 24, font: "pixel")
tilemap("level1.tmx")

camera.follow(player, smooth: 0.1)
camera.zoom(2.0)
camera.shake(intensity: 5, duration: 0.3)

particles("explosion", x: 100, y: 200) {
    count: 50,
    speed: 100..200,
    lifetime: 0.5..1.0,
    color: red..yellow,
    size: 5..1,           // 시작..끝 (시간에 따라 변화)
}
```

### 4.4 오디오 시스템

```
// 효과음 vs 음악 구분 필수
sound explosion = load_sound("explosion.wav")    // 메모리에 완전 로드
music bgm = load_music("background.ogg")         // 스트리밍

play(explosion)                    // 즉시 재생
play(explosion, volume: 0.5, pitch: 1.2)

play(bgm, loop: true)
fade_in(bgm, duration: 2.0)
crossfade(bgm, new_bgm, duration: 1.0)

// 공간 음향 (선택적이지만 유용)
play(explosion, position: vec2(200, 300))  // 리스너 위치 기준 패닝
```

**추천**: 효과음(Sound)과 음악(Music)을 타입 수준에서 구분. 공간 음향은 2D 패닝 수준만 내장.

### 4.5 입력 시스템

```
// 추상 액션 바인딩 (KAPLAY의 buttons + Godot의 InputMap)
input {
    jump:  [keyboard.space, keyboard.w, gamepad.south]
    fire:  [keyboard.f, mouse.left, gamepad.west]
    move:  [keyboard.arrows, gamepad.left_stick]
}

// 사용
on input.jump.pressed {
    player.jump()
}

on input.fire.held {
    shoot()
}

// 축 입력 (아날로그)
let dir = input.move.axis    // vec2(-1..1, -1..1)
player.move(dir * speed * dt)

// 저수준 접근도 가능
on key.pressed("escape") { quit() }
on mouse.moved(pos) { crosshair.position = pos }
on touch.started(pos, id) { /* 멀티터치 */ }
```

**추천**: **추상 액션 시스템을 기본으로**, 저수준 접근도 허용. 키보드/마우스/게임패드/터치를 통합하는 추상화가 핵심.

### 4.6 UI 시스템

```
// 게임 내 UI는 필수, 풀 GUI 프레임워크는 불필요
ui {
    // HUD (카메라 영향 없음)
    hud {
        text("HP: {player.health}", anchor: top_left, margin: 10)
        bar(player.health, max: 100, color: red, width: 200)
        text("Score: {score}", anchor: top_right, margin: 10)
    }

    // 메뉴 (별도 화면)
    screen menu {
        text("My Game", size: 48, center: true)
        button("Start") { go_to(game) }
        button("Options") { go_to(options) }
        button("Quit") { quit() }
    }

    // 대화 시스템 (선택적)
    dialog {
        portrait("npc.png")
        say("Welcome, adventurer!")
        choice("Yes") { accept_quest() }
        choice("No") { decline_quest() }
    }
}
```

**추천**: HUD와 간단한 메뉴 시스템은 내장, 복잡한 GUI는 확장으로.

### 4.7 상태 관리

```
// 씬 시스템 (KAPLAY 스타일 + Godot 스타일 혼합)
scene menu {
    on enter {
        // 초기화
    }

    on update(dt) {
        // 로직
    }

    on draw {
        // 렌더링
    }

    on exit {
        // 정리
    }
}

scene game(level: int, score: int) {
    // 파라미터 수신 가능
    on enter {
        load_level(level)
    }
}

// 씬 전환
go_to(menu)
go_to(game, level: 1, score: 0)
go_to(game, level: 2, score: score)  // 현재 값 전달

// 게임 상태 저장/로드
save("slot1") {
    player_pos: player.position,
    score: score,
    level: current_level,
    inventory: player.inventory,
}

let data = load("slot1")
```

### 4.8 네트워킹

**결론: 경량 엔진에 멀티플레이어는 포함하지 말 것.**

이유:
1. 네트워킹은 게임 아키텍처 전체를 변경시킨다
2. 입력 지연, 상태 동기화, 권위적 서버 등 복잡도가 폭발적
3. KAPLAY, LOVE 2D, 심지어 Godot도 네트워킹은 선택적
4. 경량 엔진의 목표 사용자(초보자, 게임잼)에게 불필요

**대안**: 플러그인/확장 시스템으로 나중에 추가 가능하도록 아키텍처만 열어두기.

---

## 5. 일반 게임 패턴을 언어 구성요소로

### 5.1 상태 머신 (State Machine)

게임에서 가장 흔한 패턴. 적 AI, 플레이어 상태, UI 상태 등 모든 곳에 사용된다.

**현재 접근법들:**

```javascript
// KAPLAY: 컴포넌트로 제공
const enemy = add([
    state("idle", ["idle", "attack", "dead"]),
]);
enemy.onStateEnter("idle", () => { /* ... */ });
enemy.onStateUpdate("attack", () => { /* ... */ });
enemy.onStateEnd("dead", () => { /* ... */ });
enemy.enterState("attack");
```

```gdscript
# Godot: 노드 트리 + 스크립트로 수동 구현
# StateMachine > Idle, Walk, Jump (각각 Node 스크립트)
func transition_to(target_state_path, msg={}):
    _state.exit()
    _state = get_node(target_state_path)
    _state.enter(msg)
```

**Vibe 언어 제안: `state` 블록을 1급 언어 구성요소로**

```
entity Enemy {
    health: 100
    speed: 50

    state machine {
        idle {
            on enter { play_animation("idle") }
            on update(dt) {
                if distance_to(player) < 200 {
                    go attack
                }
            }
        }

        attack {
            on enter { play_animation("attack") }
            on update(dt) {
                move_toward(player.position, speed * dt)
                if distance_to(player) < 30 {
                    player.hurt(10)
                    go cooldown
                }
            }
            after 5s { go idle }   // 5초 후 자동 전환
        }

        cooldown {
            on enter { play_animation("idle") }
            after 1s { go attack }
        }

        dead {
            on enter {
                play_animation("death")
                spawn_particles("explosion")
                after 0.5s { destroy() }
            }
        }
    }

    on hurt(damage) {
        health -= damage
        if health <= 0 { machine.go dead }
    }
}
```

**핵심 이점**:
- 상태 전환이 명확하게 보인다
- `on enter`/`on update`/`on exit`가 자연스럽다
- `after 5s` 같은 시간 기반 전환이 1급 지원
- 보일러플레이트가 거의 없다

### 5.2 트위닝/이징 (Tweening/Easing)

```javascript
// KAPLAY
tween(0, 100, 1, (val) => obj.pos.x = val, easings.easeOutBounce);

// 또는 컴포넌트 메서드로
obj.tween("pos", vec2(200, 100), 1.0, "easeOutQuad");
```

**Vibe 언어 제안: `tween` 표현식**

```
// 기본 트윈
tween player.position to vec2(200, 100) in 1s ease out_quad

// 체이닝
tween player {
    .position to vec2(200, 100) in 0.5s ease out_quad
    then .scale to vec2(2, 2) in 0.3s ease out_bounce
    then .opacity to 0 in 0.2s ease linear
}

// 병렬 트윈
tween player {
    .position to vec2(200, 100) in 1s ease out_quad
    and .rotation to 360 in 1s ease linear
}

// 루프
tween player.scale to vec2(1.2, 1.2) in 0.5s ease in_out_sine loop ping_pong

// await 지원 (코루틴과 통합)
await tween door.position to vec2(0, -100) in 1s
play_sound("door_opened")
spawn_enemy()
```

### 5.3 타이머와 지연된 액션

```javascript
// KAPLAY
wait(2, () => { spawn_enemy(); });
loop(0.5, () => { shoot(); });
```

```lua
-- LOVE 2D: 수동 구현 필요
timer = 0
function love.update(dt)
    timer = timer + dt
    if timer >= 2 then
        spawn_enemy()
        timer = 0
    end
end
```

**Vibe 언어 제안: `after`와 `every` 키워드**

```
// 지연 실행
after 2s { spawn_enemy() }

// 반복 실행
every 0.5s { shoot() }

// 조건부 반복
every 1s while wave_active {
    spawn_enemy()
}

// 횟수 제한
repeat 5 every 0.3s {
    shoot()
}

// 코루틴 스타일 (순차적 스크립팅)
sequence boss_intro {
    camera.zoom_to(boss, duration: 1s)
    await after 0.5s
    boss.say("Prepare to die!")
    await after 1s
    camera.zoom_to(player, duration: 0.5s)
    boss.machine.go attack
}
```

### 5.4 충돌 처리

```javascript
// KAPLAY
player.onCollide("enemy", (enemy, collision) => {
    if (collision.isBottom()) { destroy(enemy); }
});
```

**Vibe 언어 제안: `on collide` 구문**

```
entity Player {
    // 충돌 핸들러를 엔티티 정의 안에 선언
    on collide with "enemy" as enemy {
        if collision.direction == bottom {
            enemy.destroy()
            jump(400)
        } else {
            hurt(1)
        }
    }

    on collide with "coin" as coin {
        coin.destroy()
        score += coin.value
        play_sound("collect")
    }

    on overlap with "water" {
        // 매 프레임 (겹침 지속 중)
        swim_effect()
    }

    on collide_end with "platform" {
        // 충돌 종료
        can_coyote_jump = true
        after 0.1s { can_coyote_jump = false }
    }
}
```

### 5.5 스폰과 풀링

```
// 간단한 스폰
spawn Bullet at player.position + vec2(20, 0) {
    velocity: vec2(500, 0),
    damage: 10,
}

// 풀링 (성능 최적화) - 언어가 자동 관리
pool Bullet(max: 100)   // 100개 미리 할당

spawn Bullet { /* ... */ }  // 풀에서 가져옴, 없으면 가장 오래된 것 재활용

// 웨이브 스폰
wave {
    count: 10,
    interval: 0.3s,
    pattern: arc(center: vec2(400, 0), radius: 200, angle: 0..180),
    entity: Enemy,
}
```

### 5.6 카메라 추적

```
// 선언적 카메라 설정
camera {
    follow player with smooth(0.1)
    bounds: rect(0, 0, world.width, world.height)
    zoom: 2.0
    deadzone: rect(-50, -30, 100, 60)  // 데드존 (추적 시작 전 허용 범위)
}

// 명령적 카메라 제어
camera.shake(intensity: 10, duration: 0.3)
camera.flash(color: white, duration: 0.1)

await camera.pan_to(boss.position, duration: 1s)
// 컷씬 후 돌아옴
await camera.pan_to(player.position, duration: 0.5s)
camera.follow(player)  // 다시 추적 모드
```

### 5.7 파티클 효과

```
// 파티클 정의 (재사용 가능한 템플릿)
particle explosion {
    count: 30..50            // 랜덤 범위
    lifetime: 0.3s..0.8s
    speed: 100..300
    direction: 0..360        // 전방향
    gravity: vec2(0, 200)
    color: orange >> red >> transparent   // 시간에 따른 그라데이션
    size: 8 >> 2             // 시작 >> 끝
    shape: circle
    emission: burst          // burst (한번에) vs stream (지속)
}

particle rain {
    count: 100
    lifetime: 2s
    speed: 200..400
    direction: 260..280      // 아래쪽 (약간 비스듬히)
    color: rgba(100, 150, 255, 0.5)
    size: 2
    shape: line(length: 10)
    emission: stream(rate: 50/s)
    area: rect(0, -50, screen.width, 10)  // 화면 위에서 발생
}

// 사용
spawn_particles(explosion, at: enemy.position)
let rain_emitter = start_particles(rain)
// 나중에...
rain_emitter.stop()
```

---

## 6. 런타임 아키텍처

### 6.1 실행 모델 비교

#### A. 트리 워킹 인터프리터 (Tree-Walking Interpreter)

```
소스 코드 → 토큰 → AST → [AST 직접 순회하며 실행]
```

- **장점**: 구현이 가장 간단 (Crafting Interpreters의 jlox 수준)
- **단점**: 가장 느림 (AST 노드마다 간접 호출), 메모리 비효율
- **적합**: 프로토타입, 매우 간단한 스크립팅
- **사례**: 초기 Ruby, 대부분의 교육용 인터프리터

#### B. 바이트코드 VM (Bytecode Virtual Machine) -- **권장**

```
소스 코드 → 토큰 → AST → 바이트코드 컴파일 → [VM이 바이트코드 실행]
```

- **장점**: 트리 워킹보다 10-100배 빠름, 컴팩트한 표현, 직렬화 가능
- **단점**: 구현 복잡도 중간 (Wren VM이 약 4000줄)
- **적합**: 게임 스크립팅 언어의 최적 지점
- **사례**: Lua VM, Wren, GDScript, Python(CPython)

```
// 예시: Vibe 바이트코드
LOAD_CONST   100        // 스택에 100 push
LOAD_CONST   200        // 스택에 200 push
CALL         pos 2      // pos(100, 200) 호출
LOAD_CONST   "hero"
CALL         sprite 1   // sprite("hero") 호출
MAKE_ARRAY   2          // [pos(100,200), sprite("hero")]
CALL         create 1   // create([...]) 호출
STORE_LOCAL  0          // 결과를 로컬 변수 0에 저장
```

#### C. 트랜스파일 (Transpilation)

```
소스 코드 → 토큰 → AST → JavaScript/Lua/C 코드 생성 → [호스트 언어 런타임 실행]
```

- **장점**: 호스트 언어의 최적화 혜택 (JIT 등), 기존 생태계 활용
- **단점**: 디버깅 어려움 (소스맵 필요), 언어 의미론 제약
- **적합**: 웹 타깃 (JS로 트랜스파일), 기존 엔진 위에 올릴 때
- **사례**: TypeScript→JS, Haxe→다중 타깃, GDScript→C++(비공식)

**Vibe 엔진 추천: 바이트코드 VM + 선택적 트랜스파일**

```
[Vibe 소스 코드]
       │
       ▼
   [프론트엔드]
   (렉서 → 파서 → AST)
       │
       ├─── [바이트코드 컴파일러] → [Vibe VM] (네이티브 실행)
       │
       └─── [JS 코드 생성기] → [브라우저 실행] (웹 배포용)
```

이유:
1. **바이트코드 VM**을 기본 실행 모델로: 성능과 제어의 최적 균형
2. **JS 트랜스파일**을 보조 타깃으로: 웹 배포 지원 (KAPLAY처럼)
3. Wren 수준의 작은 VM (4000줄 내외)이면 충분
4. 게임 특화 옵코드 추가 가능 (SPAWN, TWEEN, EMIT_SIGNAL 등)

### 6.2 게임 루프 설계

**권장: 고정 업데이트 + 가변 렌더링 (하이브리드)**

```
const FIXED_DT = 1.0 / 60.0   // 물리/로직: 60Hz 고정
var accumulator = 0.0
var previous_time = get_time()
var game_state = {}
var previous_state = {}

loop {
    // 1. 시간 계산
    var current_time = get_time()
    var frame_time = current_time - previous_time
    if frame_time > 0.25 { frame_time = 0.25 }  // 죽음의 나선 방지
    previous_time = current_time
    accumulator += frame_time

    // 2. 입력 처리 (매 프레임)
    process_input()

    // 3. 고정 시간 간격 업데이트 (물리 + 게임 로직)
    while accumulator >= FIXED_DT {
        previous_state = copy(game_state)
        update(game_state, FIXED_DT)        // 사용자의 on update
        physics_step(game_state, FIXED_DT)  // 물리 엔진
        accumulator -= FIXED_DT
    }

    // 4. 보간 렌더링 (가변 프레임레이트)
    var alpha = accumulator / FIXED_DT
    var render_state = interpolate(previous_state, game_state, alpha)
    render(render_state)                     // 사용자의 on draw
}
```

**사용자에게 노출되는 API:**

```
// 사용자는 복잡한 루프를 몰라도 됨
scene game {
    on update(dt) {
        // dt는 항상 FIXED_DT (1/60)
        // 물리적으로 안정적
        player.move(input.axis * speed * dt)
    }

    on draw {
        // 자동 보간된 위치에서 렌더링
        // 별도 처리 불필요
    }
}
```

### 6.3 핫 리로딩

게임 개발에서 **핫 리로딩은 생산성의 핵심**이다.

```
[Vibe 런타임 아키텍처]

┌─────────────────────────────────────────┐
│  Vibe Runtime                            │
│                                          │
│  ┌──────────┐    ┌──────────────────┐    │
│  │ 파일     │    │ 코드 모듈 레지스트리│    │
│  │ 감시기   │───→│ (핫 스왑 가능)     │    │
│  │ (inotify │    │                    │    │
│  │  /FSEvt) │    │ module "player"    │    │
│  └──────────┘    │ module "enemy"     │    │
│                  │ module "level"     │    │
│                  └──────────────────┘    │
│                          │               │
│                  ┌───────▼───────┐       │
│                  │   게임 상태    │       │
│                  │ (유지됨!)      │       │
│                  └───────────────┘       │
└─────────────────────────────────────────┘
```

핫 리로딩 전략:
1. **코드만 교체, 상태는 유지**: 스크립트가 변경되면 해당 모듈만 재컴파일하고, 게임 오브젝트의 데이터는 그대로 유지
2. **씬 단위 리로드**: 현재 씬만 리셋 (가장 안전)
3. **표현식 단위 리로드**: REPL 스타일로 개별 표현식 실행

```
// 개발 모드에서의 핫 리로딩 경험
// enemy.vibe 파일 수정 후 저장하면...
[Vibe] Reloading enemy.vibe...
[Vibe] Recompiled 3 functions
[Vibe] Hot-swapped: Enemy.on_update, Enemy.on_hurt, Enemy.state.attack
[Vibe] Game state preserved. 12 enemies updated.
```

### 6.4 에셋 파이프라인

```
[프로젝트 구조]

my_game/
├── game.vibe           # 메인 진입점
├── player.vibe         # 플레이어 모듈
├── enemies/
│   ├── slime.vibe
│   └── boss.vibe
├── assets/
│   ├── sprites/
│   │   ├── hero.png
│   │   └── hero.json   # 스프라이트시트 메타데이터
│   ├── sounds/
│   │   ├── jump.wav
│   │   └── bgm.ogg
│   ├── maps/
│   │   └── level1.tmx  # Tiled 맵
│   └── fonts/
│       └── pixel.ttf
└── vibe.toml           # 프로젝트 설정

[vibe.toml]
name = "My Game"
version = "1.0"
resolution = [320, 240]
scale = 2
pixel_perfect = true

[assets]
sprites = "assets/sprites"
sounds = "assets/sounds"
maps = "assets/maps"
```

**에셋 로딩 방식:**

```
// 선언적 에셋 로딩 (KAPLAY 스타일)
assets {
    sprite hero = "sprites/hero.png" {
        frames: grid(4, 4),             // 4x4 스프라이트시트
        animations: {
            idle: frames(0..3, speed: 8),
            walk: frames(4..7, speed: 12),
            jump: frame(8),
        }
    }
    sprite enemy = "sprites/enemy.png"
    sound jump = "sounds/jump.wav"
    music bgm = "sounds/bgm.ogg"
    tilemap level1 = "maps/level1.tmx"
    font pixel = "fonts/pixel.ttf"
}

// 사용 (이름으로 참조)
entity player = create {
    sprite(hero, animation: "idle"),
    position(100, 200),
}
player.sprite.play("walk")
play(jump)
```

**내부 에셋 관리:**
1. **빌드 타임**: 이미지 아틀라스 자동 생성, 오디오 포맷 변환
2. **로드 타임**: 비동기 로딩 + 로딩 화면 자동 표시
3. **런타임**: 참조 카운팅으로 미사용 에셋 자동 해제
4. **캐싱**: 같은 에셋을 여러 번 로드해도 한 번만 메모리에 적재

---

## 7. API 설계 철학 비교

### 7.1 세 가지 패러다임

#### A. "모든 것이 함수" (KAPLAY 스타일)

```javascript
kaplay();
loadSprite("bean", "bean.png");

const player = add([
    sprite("bean"),
    pos(100, 200),
    area(),
    body(),
]);

onKeyPress("space", () => player.jump());
onCollide("player", "enemy", () => go("gameover"));
```

**특징:**
- 전역 함수 호출의 나열
- 선언적이고 읽기 쉬움
- 네임스페이스가 평평함 (flat)
- "코딩을 모르는 사람도 읽을 수 있음"

**장점:** 극도의 간결함, 진입 장벽 최저
**단점:** 전역 오염, 대규모 프로젝트 부적합, 자동완성 어려움

#### B. "모든 것이 노드" (Godot 스타일)

```gdscript
extends CharacterBody2D

@export var speed: float = 400.0

func _ready():
    $AnimatedSprite2D.play("idle")

func _physics_process(delta):
    var direction = Input.get_axis("left", "right")
    velocity.x = direction * speed
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = -400
    move_and_slide()
```

**특징:**
- 노드 트리의 계층 구조
- 스크립트가 노드에 부착됨
- `$Path` 구문으로 트리 탐색
- 시그널로 통신

**장점:** 구조적, 재사용성, 에디터 친화적
**단점:** 보일러플레이트, 노드 찾기/연결의 복잡함

#### C. "콜백" (LOVE 2D 스타일)

```lua
function love.load()
    player = { x=400, y=300, speed=200 }
end

function love.update(dt)
    if love.keyboard.isDown("right") then
        player.x = player.x + player.speed * dt
    end
end

function love.draw()
    love.graphics.rectangle("fill", player.x, player.y, 32, 32)
end
```

**특징:**
- 최소한의 구조
- 개발자가 100% 자유롭게 설계
- 모듈은 네임스페이스로 구분 (`love.graphics`, `love.audio`)
- 프레임워크는 콜백만 호출

**장점:** 최대 유연성, 학습할 "마법"이 없음
**단점:** 모든 구조를 직접 만들어야 함, 일관성 없음

### 7.2 LLM 친화성 분석

**핵심 질문: 어떤 API 스타일이 LLM(대형 언어 모델)이 코드를 생성하기 가장 쉬운가?**

#### 평가 기준:

| 기준 | KAPLAY (함수) | Godot (노드) | LOVE 2D (콜백) |
|---|---|---|---|
| **패턴 예측 가능성** | 매우 높음 | 높음 | 중간 |
| **보일러플레이트** | 최소 | 중간 | 중간 |
| **컨텍스트 의존성** | 낮음 | 높음 (트리 구조) | 낮음 |
| **코드 완결성** | 높음 | 낮음 (씬 파일 필요) | 높음 |
| **의미론적 명확성** | 높음 | 높음 | 낮음 (자유도 과잉) |

#### 분석 결과:

**1. KAPLAY 스타일이 LLM에 가장 유리한 이유:**

```
// LLM이 생성하기 쉬운 이유:
// 1. 한 파일에 모든 게임 로직 (컨텍스트 창에 들어감)
// 2. 패턴이 일정함 (add + 컴포넌트 배열)
// 3. 함수 이름이 자기 설명적 (sprite, pos, area, body)
// 4. 의존성이 적음 (전역 함수 → import 불필요)
```

**2. Godot 스타일의 LLM 문제점:**
```
// 문제: LLM이 생성해야 하는 것이 너무 많다
// - .tscn 파일 (씬 구조 정의)
// - .gd 파일 (스크립트)
// - 에디터 설정 (노드 프로퍼티)
// - 시그널 연결 (에디터 or 코드)
// 코드만으로는 완전한 게임을 표현할 수 없다
```

**3. LOVE 2D 스타일의 LLM 문제점:**
```
// 문제: 자유도가 너무 높아서 패턴이 불일정
// - 상태 관리 방법이 100가지
// - OOP? 함수형? 절차적?
// - 같은 기능도 10가지 방법으로 구현 가능
// LLM은 "정해진 패턴"이 있을 때 가장 정확하다
```

### 7.3 Vibe 엔진의 최적 API 설계

**결론: KAPLAY의 간결함 + Godot의 구조 + LOVE 2D의 명시성을 조합**

```
// === Vibe 언어 API 설계 제안 ===

// 1. 게임 설정 (선언적)
game {
    title: "My Platformer"
    size: 320 x 240
    scale: 2
    background: #1a1a2e
}

// 2. 에셋 로딩 (선언적)
assets {
    sprite hero = "hero.png" { frames: grid(4, 4) }
    sprite coin = "coin.png" { frames: row(6) }
    sound jump = "jump.wav"
    music bgm = "bgm.ogg"
}

// 3. 엔티티 정의 (구조적이지만 간결)
entity Player {
    sprite(hero, animation: "idle")
    position(100, 200)
    physics(dynamic)
    collider(box)
    tag("player")

    let speed = 300
    let jump_force = 400

    on update(dt) {
        let dir = input.move.axis
        move(dir.x * speed * dt, 0)

        if input.jump.pressed and is_grounded {
            jump(jump_force)
            play(jump_sound)
        }
    }

    on collide with "coin" as c {
        c.destroy()
        score += 1
        play(collect_sound)
    }

    on collide with "enemy" as e {
        if collision.from_above {
            e.hurt(1)
            jump(200)
        } else {
            hurt(1)
        }
    }

    state machine {
        idle {
            on enter { sprite.play("idle") }
            on update { if moving { go walk } }
        }
        walk {
            on enter { sprite.play("walk") }
            on update { if not moving { go idle } }
        }
    }
}

entity Coin {
    sprite(coin, animation: "spin")
    position(0, 0)    // 스폰 시 설정
    physics(static)
    collider(circle)
    tag("coin")

    let value = 1

    // 트위닝으로 위아래 흔들기
    tween position.y by -5 in 0.5s ease in_out_sine loop ping_pong
}

// 4. 씬 정의
scene game(level: int = 1) {
    let score = 0
    let player = spawn Player at (100, 200)

    load_map("level{level}.tmx")

    on update(dt) {
        if get_all("coin").is_empty {
            go_to scene.win(score: score)
        }
    }

    camera {
        follow player with smooth(0.1)
        bounds: map.bounds
    }

    hud {
        text("Score: {score}", at: top_left, margin: 10)
        bar(player.health, max: 3, at: top_right, color: red)
    }
}

scene menu {
    text("My Platformer", size: 32, center: true)

    on input.start.pressed {
        go_to scene.game(level: 1)
    }
}

scene win(score: int) {
    text("You Win!", size: 48, center: true)
    text("Score: {score}", size: 24, center: true, offset_y: 40)

    on input.start.pressed {
        go_to scene.menu
    }
}

// 5. 게임 시작
start scene.menu
```

### 7.4 이 설계가 LLM 친화적인 이유

1. **일관된 패턴**: 모든 엔티티가 같은 구조 (`entity Name { 컴포넌트, 이벤트 핸들러, 상태 머신 }`)
2. **자기 설명적 구문**: `on collide with "enemy"`, `tween position.y`, `after 2s`
3. **단일 파일 완결성**: 하나의 .vibe 파일만으로 게임 동작을 완전히 기술
4. **최소 보일러플레이트**: `import`, `class`, `extends` 같은 의식적 코드가 없음
5. **선언적 + 명령적 혼합**: 설정은 선언적, 로직은 명령적 → LLM이 컨텍스트에 따라 적절한 스타일 선택 가능
6. **타입 추론**: 명시적 타입 선언 불필요하지만 런타임에서 타입 안전성 보장
7. **게임 도메인 키워드**: `spawn`, `destroy`, `collide`, `tween`, `camera`, `scene` 등이 언어 키워드 → LLM의 학습 데이터에서 이미 게임 컨텍스트와 연결됨

### 7.5 KAPLAY/LOVE 2D/Godot와의 최종 비교

```
┌──────────────┬───────────┬───────────┬───────────┬───────────┐
│   측면        │ KAPLAY    │ LOVE 2D   │ Godot     │ Vibe(제안) │
├──────────────┼───────────┼───────────┼───────────┼───────────┤
│ 진입 장벽     │ 매우 낮음  │ 낮음      │ 중간      │ 매우 낮음  │
│ 구조화       │ 낮음      │ 없음      │ 높음      │ 중간      │
│ 유연성       │ 중간      │ 매우 높음  │ 높음      │ 높음      │
│ 성능         │ 낮음(JS)  │ 높음(C++) │ 높음(C++) │ 중간(VM)  │
│ 물리 내장     │ O        │ O(Box2D)  │ O        │ O        │
│ 상태 관리     │ 씬       │ 없음      │ 씬 트리   │ 씬+상태   │
│ LLM 친화성   │ 높음      │ 중간      │ 낮음      │ 매우 높음  │
│ 게임 패턴     │ 일부 내장  │ 없음      │ 노드로    │ 언어 내장  │
│ 핫 리로딩     │ 웹 기반   │ 없음      │ 에디터    │ 내장      │
│ 배포 타깃     │ 웹       │ 데스크탑   │ 전부      │ 웹+데스크탑│
└──────────────┴───────────┴───────────┴───────────┴───────────┘
```

---

## 부록: 핵심 설계 결정 요약

### 반드시 포함해야 하는 것
1. **컴포넌트 부착 시스템** (KAPLAY 스타일, 내부 최적화는 ECS)
2. **내장 2D 물리** (Box2D 수준, 3단계 추상화)
3. **상태 머신을 1급 언어 구성요소로**
4. **트위닝/타이머를 언어 키워드로** (`tween`, `after`, `every`)
5. **시그널 시스템** (Godot에서 차용)
6. **고정 시간 간격 게임 루프** (사용자에게 투명)
7. **씬 시스템** (파라미터 전달, 전환 효과)
8. **선언적 에셋 로딩**
9. **추상 입력 바인딩**
10. **핫 리로딩**

### 포함하지 말아야 하는 것
1. 네트워킹/멀티플레이어 (플러그인으로)
2. 3D 렌더링
3. 풀 GUI 프레임워크 (간단한 HUD만)
4. 셰이더 편집기 (텍스트 기반 셰이더만)
5. 비주얼 스크립팅

### 런타임 결정
- **바이트코드 VM** (Wren 수준의 경량 VM)
- **JS 트랜스파일러** (웹 배포 보조)
- **하이브리드 게임 루프** (고정 업데이트 + 가변 렌더링)
- **파일 감시 기반 핫 리로딩**
- **빌드 타임 에셋 처리** (아틀라스, 포맷 변환)
