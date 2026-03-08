# Vibe -> Lua/LOVE 2D 트랜스파일 설계서

> 이 문서는 Vibe의 모든 게임 구문이 어떤 Lua/LOVE 2D 코드로 변환되는지를
> **실제 실행 가능한 코드**로 정의한다.

---

## 0. 아키텍처 개요

Vibe 트랜스파일러는 두 가지를 생성한다:

1. **런타임 라이브러리** (`vibe_runtime.lua`) -- 엔티티 관리, 이벤트 라우팅, 씬 관리, 타이머, 코루틴 스케줄러
2. **사용자 코드** -- Vibe 소스에서 변환된 Lua 코드

```
vibe_project/
  main.lua          -- LOVE 진입점 (자동 생성)
  vibe_runtime.lua  -- 런타임 라이브러리
  entities.lua      -- @entity struct들이 변환된 코드
  scenes.lua        -- @scene struct들이 변환된 코드
  handlers.lua      -- @on 핸들러들이 변환된 코드
  conf.lua          -- LOVE 설정 (자동 생성)
```

---

## 1. @entity struct -> Lua

### Vibe 소스

```
@entity
struct Player has Damageable
  health: Int = 100
  speed: Float = 200.0
  pos: Vec2 = Vec2(x: 0.0, y: 0.0)

  fn take_damage(self, amount: Int)
    self.health = self.health - amount
```

### 생성되는 Lua 코드

```lua
-- ==========================================================
-- entities.lua (트랜스파일러가 생성)
-- ==========================================================

local Runtime = require("vibe_runtime")

-- Player 엔티티 정의
Player = {}
Player.__index = Player
Player.__entity_name = "Player"
Player.__traits = { "Damageable" }

-- 기본값(blueprint)을 정의하는 팩토리 함수
function Player.new(overrides)
    overrides = overrides or {}
    local self = setmetatable({}, Player)

    -- 엔티티 메타 정보
    self.__id = Runtime.next_id()
    self.__entity_type = "Player"
    self.__alive = true
    self.__coroutines = {}

    -- 필드 초기화 (기본값 + 오버라이드)
    self.health = overrides.health or 100
    self.speed = overrides.speed or 200.0
    self.pos = overrides.pos or { x = 0.0, y = 0.0 }

    return self
end

-- 메서드: take_damage
function Player:take_damage(amount)
    self.health = self.health - amount
end
```

### 엔티티 저장 방식: 글로벌 레지스트리

```lua
-- vibe_runtime.lua 내부

local Runtime = {}

-- 엔티티 레지스트리: 모든 살아있는 엔티티를 저장
Runtime._entities = {}        -- id -> entity
Runtime._entities_by_type = {} -- type_name -> { entity, entity, ... }
Runtime._next_id = 0

function Runtime.next_id()
    Runtime._next_id = Runtime._next_id + 1
    return Runtime._next_id
end

-- 타입별로 엔티티를 조회
function Runtime.get_entities(type_name)
    return Runtime._entities_by_type[type_name] or {}
end

-- 특정 trait를 구현한 모든 엔티티를 조회
function Runtime.get_entities_with_trait(trait_name)
    local result = {}
    for _, entity in pairs(Runtime._entities) do
        if entity.__traits then
            for _, t in ipairs(entity.__traits) do
                if t == trait_name then
                    result[#result + 1] = entity
                    break
                end
            end
        end
    end
    return result
end
```

---

## 2. @on("update") / @on("draw") -> love.update / love.draw

### Vibe 소스

```
@on("update")
fn player_update(player: Player, dt: Float)
  player.pos.x = player.pos.x + player.speed * dt

@on("draw")
fn player_draw(player: Player)
  draw_sprite(player.sprite, player.pos.x, player.pos.y)
```

### 생성되는 Lua 코드

```lua
-- ==========================================================
-- handlers.lua (트랜스파일러가 생성)
-- ==========================================================

local Runtime = require("vibe_runtime")

-- @on("update") 핸들러 등록
-- 트랜스파일러가 첫 번째 매개변수의 타입(Player)을 분석하여
-- 해당 타입의 모든 엔티티에 대해 자동 호출되도록 등록한다.
Runtime.register_handler("update", "Player", function(player, dt)
    player.pos.x = player.pos.x + player.speed * dt
end)

-- @on("draw") 핸들러 등록
Runtime.register_handler("draw", "Player", function(player)
    love.graphics.draw(player.sprite, player.pos.x, player.pos.y)
end)
```

### 런타임: love.update / love.draw 라우팅

```lua
-- ==========================================================
-- vibe_runtime.lua -- 이벤트 라우팅 시스템
-- ==========================================================

-- 핸들러 레지스트리: event_name -> { {type_name, fn}, ... }
Runtime._handlers = {}

function Runtime.register_handler(event_name, entity_type, handler_fn)
    if not Runtime._handlers[event_name] then
        Runtime._handlers[event_name] = {}
    end
    table.insert(Runtime._handlers[event_name], {
        entity_type = entity_type,
        fn = handler_fn,
    })
end

-- 이벤트를 발동: 해당 타입의 모든 엔티티에 대해 핸들러를 호출
function Runtime.dispatch(event_name, ...)
    local handlers = Runtime._handlers[event_name]
    if not handlers then return end

    for _, handler in ipairs(handlers) do
        local entities = Runtime.get_entities(handler.entity_type)
        for _, entity in ipairs(entities) do
            if entity.__alive then
                handler.fn(entity, ...)
            end
        end
    end
end

-- ==========================================================
-- main.lua (자동 생성) -- LOVE 콜백을 런타임에 연결
-- ==========================================================

local Runtime = require("vibe_runtime")
require("entities")
require("handlers")
require("scenes")

function love.load()
    Runtime.dispatch("load")
    -- 초기 씬 진입
    if Runtime._initial_scene then
        Runtime.go_scene(Runtime._initial_scene)
    end
end

function love.update(dt)
    -- 1) 타이머/트윈 업데이트
    Runtime.update_timers(dt)
    Runtime.update_tweens(dt)

    -- 2) 코루틴 재개
    Runtime.resume_coroutines(dt)

    -- 3) @on("update") 핸들러 호출
    Runtime.dispatch("update", dt)

    -- 4) 충돌 검사
    Runtime.check_collisions()

    -- 5) destroy 예약된 엔티티 정리
    Runtime.flush_destroy_queue()
end

function love.draw()
    -- 씬 배경
    if Runtime._current_scene and Runtime._current_scene.background then
        local bg = Runtime._current_scene.background
        love.graphics.clear(bg.r / 255, bg.g / 255, bg.b / 255)
    end

    -- @on("draw") 핸들러 호출
    Runtime.dispatch("draw")
end

function love.keypressed(key, scancode, isrepeat)
    Runtime.dispatch_input("key_pressed", key, scancode, isrepeat)
end

function love.keyreleased(key, scancode)
    Runtime.dispatch_input("key_released", key, scancode)
end

function love.mousepressed(x, y, button)
    Runtime.dispatch_input("mouse_pressed", x, y, button)
end
```

---

## 3. @on("key_pressed") -> love.keypressed

### Vibe 소스

```
@on("key_pressed", key: "space")
fn jump(player: Player)
  player.vel.y = -300

@on("key_pressed", key: "escape")
fn pause_game()
  go(PauseScene)

@on("key_pressed")
fn any_key(player: Player, key: String)
  if key == "left"
    player.vel.x = -200
  elif key == "right"
    player.vel.x = 200
```

### 생성되는 Lua 코드

```lua
-- handlers.lua

-- 특정 키 필터링이 있는 핸들러
Runtime.register_input_handler("key_pressed", {
    key_filter = "space",
    entity_type = "Player",
    fn = function(player, key, scancode, isrepeat)
        player.vel.y = -300
    end,
})

-- 엔티티와 무관한 핸들러 (entity_type = nil)
Runtime.register_input_handler("key_pressed", {
    key_filter = "escape",
    entity_type = nil,
    fn = function(key, scancode, isrepeat)
        Runtime.go_scene("PauseScene")
    end,
})

-- 키 필터 없는 핸들러 (모든 키에 반응)
Runtime.register_input_handler("key_pressed", {
    key_filter = nil,
    entity_type = "Player",
    fn = function(player, key, scancode, isrepeat)
        if key == "left" then
            player.vel.x = -200
        elseif key == "right" then
            player.vel.x = 200
        end
    end,
})
```

### 런타임: 입력 이벤트 디스패치

```lua
-- vibe_runtime.lua

Runtime._input_handlers = {}

function Runtime.register_input_handler(event_name, handler)
    if not Runtime._input_handlers[event_name] then
        Runtime._input_handlers[event_name] = {}
    end
    table.insert(Runtime._input_handlers[event_name], handler)
end

function Runtime.dispatch_input(event_name, ...)
    local handlers = Runtime._input_handlers[event_name]
    if not handlers then return end

    local args = { ... }

    for _, handler in ipairs(handlers) do
        -- 키 필터 검사
        if handler.key_filter and args[1] ~= handler.key_filter then
            goto continue_handler
        end

        if handler.entity_type then
            -- 엔티티 타입이 지정된 경우: 해당 타입의 모든 엔티티에 대해 호출
            local entities = Runtime.get_entities(handler.entity_type)
            for _, entity in ipairs(entities) do
                if entity.__alive then
                    handler.fn(entity, ...)
                end
            end
        else
            -- 엔티티 타입이 없는 경우: 글로벌 핸들러로 1회 호출
            handler.fn(...)
        end

        ::continue_handler::
    end
end
```

---

## 4. @on("collide") -> 충돌 감지

### Vibe 소스

```
@on("collide", self: Player, other: Enemy)
fn player_hit(player: Player, enemy: Enemy)
  player.health = player.health - 10

@on("collide", self: Bullet, other: Enemy)
fn bullet_hit(bullet: Bullet, enemy: Enemy)
  enemy.health = enemy.health - bullet.damage
  destroy(bullet)
```

### 설계 결정: AABB 수동 검사 (기본) + Box2D 옵션

LOVE 2D에서 충돌 감지는 두 가지 방식으로 구현 가능하다:

| 방식 | 장점 | 단점 |
|------|------|------|
| **AABB 수동 검사** | 단순, 의존성 없음, 예측 가능 | 복잡한 물리 불가 |
| **Box2D (love.physics)** | 정교한 물리, 연속 충돌 | 복잡도 높음, 설정 필요 |

Vibe v0.1에서는 **AABB를 기본값**으로 사용하고, `has Body(dynamic)` 컴포넌트가 있으면 Box2D로 전환한다.

### 생성되는 Lua 코드 (AABB 방식)

```lua
-- handlers.lua

Runtime.register_collision_handler({
    self_type = "Player",
    other_type = "Enemy",
    fn = function(player, enemy)
        player.health = player.health - 10
    end,
})

Runtime.register_collision_handler({
    self_type = "Bullet",
    other_type = "Enemy",
    fn = function(bullet, enemy)
        enemy.health = enemy.health - bullet.damage
        Runtime.destroy(bullet)
    end,
})
```

### 런타임: AABB 충돌 검사

```lua
-- vibe_runtime.lua

Runtime._collision_handlers = {}

function Runtime.register_collision_handler(handler)
    table.insert(Runtime._collision_handlers, handler)
end

-- AABB 충돌 판정 함수
local function aabb_overlap(a, b)
    -- 엔티티는 pos(중심), size(폭/높이)를 가진다고 가정
    local a_pos = a.pos or { x = 0, y = 0 }
    local a_size = a.size or { w = 32, h = 32 }
    local b_pos = b.pos or { x = 0, y = 0 }
    local b_size = b.size or { w = 32, h = 32 }

    local a_left   = a_pos.x - a_size.w / 2
    local a_right  = a_pos.x + a_size.w / 2
    local a_top    = a_pos.y - a_size.h / 2
    local a_bottom = a_pos.y + a_size.h / 2

    local b_left   = b_pos.x - b_size.w / 2
    local b_right  = b_pos.x + b_size.w / 2
    local b_top    = b_pos.y - b_size.h / 2
    local b_bottom = b_pos.y + b_size.h / 2

    return a_left < b_right
       and a_right > b_left
       and a_top < b_bottom
       and a_bottom > b_top
end

-- 매 프레임 충돌 검사 (love.update 내부에서 호출)
function Runtime.check_collisions()
    for _, handler in ipairs(Runtime._collision_handlers) do
        local self_entities = Runtime.get_entities(handler.self_type)
        local other_entities = Runtime.get_entities(handler.other_type)

        for _, self_entity in ipairs(self_entities) do
            if not self_entity.__alive then goto continue_self end
            for _, other_entity in ipairs(other_entities) do
                if not other_entity.__alive then goto continue_other end
                if self_entity.__id == other_entity.__id then goto continue_other end

                if aabb_overlap(self_entity, other_entity) then
                    handler.fn(self_entity, other_entity)
                end

                ::continue_other::
            end
            ::continue_self::
        end
    end
end
```

### Box2D 방식 (has Body 컴포넌트가 있을 때)

```lua
-- vibe_runtime.lua -- Box2D 물리 월드 (선택적)

Runtime._physics_world = nil

function Runtime.init_physics(gravity_x, gravity_y)
    Runtime._physics_world = love.physics.newWorld(gravity_x or 0, gravity_y or 980, true)

    -- 충돌 콜백 설정
    Runtime._physics_world:setCallbacks(
        function(a, b, contact)  -- beginContact
            local entity_a = a:getUserData()
            local entity_b = b:getUserData()
            if entity_a and entity_b then
                Runtime.dispatch_collision(entity_a, entity_b)
            end
        end,
        function(a, b, contact) end,  -- endContact
        function(a, b, contact) end,  -- preSolve
        function(a, b, contact, nx, ny) end  -- postSolve
    )
end

function Runtime.dispatch_collision(entity_a, entity_b)
    for _, handler in ipairs(Runtime._collision_handlers) do
        -- A가 self, B가 other
        if entity_a.__entity_type == handler.self_type
           and entity_b.__entity_type == handler.other_type then
            handler.fn(entity_a, entity_b)
        end
        -- B가 self, A가 other (양방향 검사)
        if entity_b.__entity_type == handler.self_type
           and entity_a.__entity_type == handler.other_type then
            handler.fn(entity_b, entity_a)
        end
    end
end

function Runtime.update_physics(dt)
    if Runtime._physics_world then
        Runtime._physics_world:update(dt)
    end
end
```

---

## 5. spawn() / destroy() -> 테이블 관리

### Vibe 소스

```
let player = spawn(Player, at: Vec2(400, 300))
let bullet = spawn(Bullet, at: player.pos, speed: 500.0)
destroy(bullet)
destroy_all("Enemy")
```

### 생성되는 Lua 코드

```lua
-- 사용자 코드에서의 호출 (트랜스파일 결과)
local player = Runtime.spawn(Player, { pos = { x = 400, y = 300 } })
local bullet = Runtime.spawn(Bullet, { pos = { x = player.pos.x, y = player.pos.y }, speed = 500.0 })
Runtime.destroy(bullet)
Runtime.destroy_all("Enemy")
```

### 런타임: spawn / destroy 구현

```lua
-- vibe_runtime.lua

-- 엔티티 스폰: 팩토리 함수를 호출하고 레지스트리에 등록
function Runtime.spawn(entity_class, overrides)
    local entity = entity_class.new(overrides)
    local type_name = entity.__entity_type

    -- 글로벌 레지스트리에 등록
    Runtime._entities[entity.__id] = entity

    -- 타입별 레지스트리에 등록
    if not Runtime._entities_by_type[type_name] then
        Runtime._entities_by_type[type_name] = {}
    end
    table.insert(Runtime._entities_by_type[type_name], entity)

    -- @on("enter") 핸들러 호출
    Runtime.dispatch_for_entity("enter", entity)

    return entity
end

-- 특정 엔티티에 대해서만 이벤트 디스패치
function Runtime.dispatch_for_entity(event_name, entity, ...)
    local handlers = Runtime._handlers[event_name]
    if not handlers then return end

    for _, handler in ipairs(handlers) do
        if entity.__entity_type == handler.entity_type then
            handler.fn(entity, ...)
        end
    end
end

-- 엔티티 파괴 예약 (즉시 삭제하면 순회 중 오류 발생 가능)
Runtime._destroy_queue = {}

function Runtime.destroy(entity)
    if entity and entity.__alive then
        entity.__alive = false
        table.insert(Runtime._destroy_queue, entity)

        -- @on("exit") 핸들러 호출
        Runtime.dispatch_for_entity("exit", entity)
    end
end

-- 타입 이름으로 모든 엔티티 파괴
function Runtime.destroy_all(type_name)
    local entities = Runtime.get_entities(type_name)
    for _, entity in ipairs(entities) do
        Runtime.destroy(entity)
    end
end

-- 파괴 큐 처리: love.update 끝에서 호출
function Runtime.flush_destroy_queue()
    for _, entity in ipairs(Runtime._destroy_queue) do
        -- 글로벌 레지스트리에서 제거
        Runtime._entities[entity.__id] = nil

        -- 타입별 레지스트리에서 제거
        local type_list = Runtime._entities_by_type[entity.__entity_type]
        if type_list then
            for i = #type_list, 1, -1 do
                if type_list[i].__id == entity.__id then
                    table.remove(type_list, i)
                    break
                end
            end
        end

        -- 코루틴 정리
        entity.__coroutines = nil
    end
    Runtime._destroy_queue = {}
end
```

---

## 6. @scene -> 상태 관리

### Vibe 소스

```
@scene
struct MainScene
  background: Color = Color(30, 30, 46)

@on("enter", scene: MainScene)
fn main_enter()
  spawn(Player, at: Vec2(400, 300))

@on("exit", scene: MainScene)
fn main_exit()
  destroy_all("Player")

@scene
struct GameOverScene
  final_score: Int = 0
  background: Color = Color(60, 20, 20)
```

### 생성되는 Lua 코드

```lua
-- ==========================================================
-- scenes.lua (트랜스파일러가 생성)
-- ==========================================================

local Runtime = require("vibe_runtime")

-- 씬 정의
MainScene = {}
MainScene.__scene_name = "MainScene"

function MainScene.new(params)
    params = params or {}
    return {
        __scene_name = "MainScene",
        background = params.background or { r = 30, g = 30, b = 46 },
    }
end

GameOverScene = {}
GameOverScene.__scene_name = "GameOverScene"

function GameOverScene.new(params)
    params = params or {}
    return {
        __scene_name = "GameOverScene",
        final_score = params.final_score or 0,
        background = params.background or { r = 60, g = 20, b = 20 },
    }
end

-- 씬 이벤트 핸들러 등록
Runtime.register_scene_handler("enter", "MainScene", function(scene)
    Runtime.spawn(Player, { pos = { x = 400, y = 300 } })
end)

Runtime.register_scene_handler("exit", "MainScene", function(scene)
    Runtime.destroy_all("Player")
end)

-- 초기 씬 설정
Runtime._initial_scene = MainScene
```

### 런타임: 씬 관리 (게임 상태 스택)

```lua
-- vibe_runtime.lua -- 씬 관리 시스템

Runtime._current_scene = nil
Runtime._scene_stack = {}          -- push/pop 방식의 씬 스택
Runtime._scene_handlers = {}       -- scene_event -> scene_name -> { fn, ... }

function Runtime.register_scene_handler(event_name, scene_name, handler_fn)
    if not Runtime._scene_handlers[event_name] then
        Runtime._scene_handlers[event_name] = {}
    end
    if not Runtime._scene_handlers[event_name][scene_name] then
        Runtime._scene_handlers[event_name][scene_name] = {}
    end
    table.insert(Runtime._scene_handlers[event_name][scene_name], handler_fn)
end

local function dispatch_scene_event(event_name, scene)
    if not scene then return end
    local handlers = Runtime._scene_handlers[event_name]
    if not handlers then return end
    local scene_handlers = handlers[scene.__scene_name]
    if not scene_handlers then return end

    for _, fn in ipairs(scene_handlers) do
        fn(scene)
    end
end

-- 씬 전환: 현재 씬을 종료하고 새 씬으로 진입
-- Vibe의 go(SceneType, params) 에 대응
function Runtime.go_scene(scene_class, params)
    -- 1) 현재 씬의 exit 핸들러 호출
    if Runtime._current_scene then
        dispatch_scene_event("exit", Runtime._current_scene)
    end

    -- 2) 현재 씬의 모든 엔티티 파괴
    Runtime.destroy_all_entities()

    -- 3) 모든 타이머/트윈 정리
    Runtime.clear_timers()
    Runtime.clear_tweens()

    -- 4) 모든 코루틴 정리
    Runtime.clear_coroutines()

    -- 5) 새 씬 인스턴스 생성
    local new_scene = scene_class.new(params)
    Runtime._current_scene = new_scene

    -- 6) 새 씬의 enter 핸들러 호출
    dispatch_scene_event("enter", new_scene)
end

-- 씬 푸시: 현재 씬을 일시 정지하고 새 씬을 위에 쌓음
function Runtime.push_scene(scene_class, params)
    if Runtime._current_scene then
        dispatch_scene_event("pause", Runtime._current_scene)
        table.insert(Runtime._scene_stack, Runtime._current_scene)
    end
    local new_scene = scene_class.new(params)
    Runtime._current_scene = new_scene
    dispatch_scene_event("enter", new_scene)
end

-- 씬 팝: 현재 씬을 종료하고 이전 씬을 재개
function Runtime.pop_scene()
    if Runtime._current_scene then
        dispatch_scene_event("exit", Runtime._current_scene)
    end
    Runtime._current_scene = table.remove(Runtime._scene_stack)
    if Runtime._current_scene then
        dispatch_scene_event("resume", Runtime._current_scene)
    end
end

-- 모든 엔티티 파괴 (씬 전환 시)
function Runtime.destroy_all_entities()
    for _, entity in pairs(Runtime._entities) do
        entity.__alive = false
    end
    Runtime._entities = {}
    Runtime._entities_by_type = {}
    Runtime._destroy_queue = {}
end
```

---

## 7. tween() / after() / every() -> 타이머 및 보간

### Vibe 소스

```
tween(player.pos.x, to: 500.0, duration: 1.0, ease: "quad_out")
tween(player.pos, to: Vec2(500.0, 300.0), duration: 2.0, ease: "linear")

after(2.0, fn()
  spawn(Enemy, at: Vec2(100, 0))
)

let timer = every(0.5, fn()
  shoot()
)
timer.cancel()
```

### 생성되는 Lua 코드

```lua
-- 사용자 코드 (트랜스파일 결과)

-- 단일 값 트윈: 대상 객체 + 필드 이름 + 목표값
Runtime.tween({
    target = player.pos,
    field = "x",
    to = 500.0,
    duration = 1.0,
    ease = "quad_out",
})

-- Vec2 트윈: x, y 동시 보간
Runtime.tween({
    target = player,
    field = "pos",
    to = { x = 500.0, y = 300.0 },
    duration = 2.0,
    ease = "linear",
})

-- 지연 실행
Runtime.after(2.0, function()
    Runtime.spawn(Enemy, { pos = { x = 100, y = 0 } })
end)

-- 반복 실행
local timer = Runtime.every(0.5, function()
    shoot()
end)
timer:cancel()
```

### 런타임: 타이머 시스템

```lua
-- vibe_runtime.lua -- 타이머 시스템

Runtime._timers = {}

-- after: 일정 시간 뒤 1회 실행
function Runtime.after(delay, callback)
    local timer = {
        remaining = delay,
        callback = callback,
        repeating = false,
        cancelled = false,
    }
    function timer:cancel()
        self.cancelled = true
    end
    table.insert(Runtime._timers, timer)
    return timer
end

-- every: 일정 간격으로 반복 실행
function Runtime.every(interval, callback)
    local timer = {
        remaining = interval,
        interval = interval,
        callback = callback,
        repeating = true,
        cancelled = false,
    }
    function timer:cancel()
        self.cancelled = true
    end
    table.insert(Runtime._timers, timer)
    return timer
end

-- 타이머 업데이트 (love.update 내부에서 호출)
function Runtime.update_timers(dt)
    for i = #Runtime._timers, 1, -1 do
        local timer = Runtime._timers[i]
        if timer.cancelled then
            table.remove(Runtime._timers, i)
        else
            timer.remaining = timer.remaining - dt
            if timer.remaining <= 0 then
                timer.callback()
                if timer.repeating then
                    timer.remaining = timer.remaining + timer.interval
                else
                    table.remove(Runtime._timers, i)
                end
            end
        end
    end
end

function Runtime.clear_timers()
    Runtime._timers = {}
end
```

### 런타임: 트윈 시스템

```lua
-- vibe_runtime.lua -- 트윈 시스템

Runtime._tweens = {}

-- 이징 함수들
local easing = {}

function easing.linear(t)
    return t
end

function easing.quad_in(t)
    return t * t
end

function easing.quad_out(t)
    return t * (2 - t)
end

function easing.quad_in_out(t)
    if t < 0.5 then
        return 2 * t * t
    else
        return -1 + (4 - 2 * t) * t
    end
end

function easing.cubic_out(t)
    local t1 = t - 1
    return t1 * t1 * t1 + 1
end

function easing.elastic_out(t)
    if t == 0 or t == 1 then return t end
    return math.pow(2, -10 * t) * math.sin((t - 0.1) * 5 * math.pi) + 1
end

function easing.bounce_out(t)
    if t < 1 / 2.75 then
        return 7.5625 * t * t
    elseif t < 2 / 2.75 then
        t = t - 1.5 / 2.75
        return 7.5625 * t * t + 0.75
    elseif t < 2.5 / 2.75 then
        t = t - 2.25 / 2.75
        return 7.5625 * t * t + 0.9375
    else
        t = t - 2.625 / 2.75
        return 7.5625 * t * t + 0.984375
    end
end

-- 트윈 생성
function Runtime.tween(params)
    local ease_fn = easing[params.ease or "linear"] or easing.linear
    local target = params.target
    local field = params.field
    local to_value = params.to
    local duration = params.duration or 1.0

    -- 시작값 기록
    local from_value
    if type(to_value) == "table" then
        -- Vec2 등 테이블 값: 각 필드별 시작값 기록
        from_value = {}
        local current = target[field]
        for k, v in pairs(to_value) do
            from_value[k] = current[k]
        end
    else
        -- 스칼라 값
        from_value = target[field]
    end

    local tween_obj = {
        target = target,
        field = field,
        from_value = from_value,
        to_value = to_value,
        duration = duration,
        elapsed = 0,
        ease_fn = ease_fn,
        completed = false,
        on_complete = params.on_complete,
    }

    function tween_obj:cancel()
        self.completed = true
    end

    table.insert(Runtime._tweens, tween_obj)
    return tween_obj
end

-- 트윈 업데이트 (love.update 내부에서 호출)
function Runtime.update_tweens(dt)
    for i = #Runtime._tweens, 1, -1 do
        local tw = Runtime._tweens[i]
        if tw.completed then
            table.remove(Runtime._tweens, i)
        else
            tw.elapsed = tw.elapsed + dt
            local progress = math.min(tw.elapsed / tw.duration, 1.0)
            local eased = tw.ease_fn(progress)

            if type(tw.to_value) == "table" then
                -- 테이블 보간 (Vec2 등)
                local current = tw.target[tw.field]
                for k, _ in pairs(tw.to_value) do
                    current[k] = tw.from_value[k] + (tw.to_value[k] - tw.from_value[k]) * eased
                end
            else
                -- 스칼라 보간
                tw.target[tw.field] = tw.from_value + (tw.to_value - tw.from_value) * eased
            end

            if progress >= 1.0 then
                tw.completed = true
                if tw.on_complete then
                    tw.on_complete()
                end
                table.remove(Runtime._tweens, i)
            end
        end
    end
end

function Runtime.clear_tweens()
    Runtime._tweens = {}
end
```

---

## 8. play_sound() / play_music() -> love.audio

### Vibe 소스

```
play_sound("explosion.wav")
play_sound("collect.wav", volume: 0.5)
play_music("bgm.mp3", loop: true)
stop_music()
```

### 생성되는 Lua 코드

```lua
-- 사용자 코드 (트랜스파일 결과)
Runtime.play_sound("explosion.wav")
Runtime.play_sound("collect.wav", { volume = 0.5 })
Runtime.play_music("bgm.mp3", { loop = true })
Runtime.stop_music()
```

### 런타임: 오디오 시스템

```lua
-- vibe_runtime.lua -- 오디오 시스템

Runtime._sound_cache = {}       -- 파일 경로 -> Source 캐시
Runtime._current_music = nil    -- 현재 재생 중인 배경 음악

-- 사운드 로드 (캐시)
local function load_sound(path, source_type)
    source_type = source_type or "static"
    if not Runtime._sound_cache[path] then
        Runtime._sound_cache[path] = love.audio.newSource(
            "assets/sounds/" .. path, source_type
        )
    end
    return Runtime._sound_cache[path]
end

-- 효과음 재생 (동시 다중 재생 지원)
function Runtime.play_sound(path, params)
    params = params or {}
    local source = load_sound(path, "static")
    local clone = source:clone()  -- 동시 재생을 위해 복제
    clone:setVolume(params.volume or 1.0)
    if params.pitch then
        clone:setPitch(params.pitch)
    end
    clone:play()
    return clone
end

-- 배경 음악 재생
function Runtime.play_music(path, params)
    params = params or {}
    Runtime.stop_music()

    -- 음악은 stream 방식으로 로드 (메모리 절약)
    Runtime._current_music = love.audio.newSource(
        "assets/music/" .. path, "stream"
    )
    Runtime._current_music:setLooping(params.loop or false)
    Runtime._current_music:setVolume(params.volume or 1.0)
    Runtime._current_music:play()
end

-- 배경 음악 정지
function Runtime.stop_music()
    if Runtime._current_music then
        Runtime._current_music:stop()
        Runtime._current_music = nil
    end
end

-- 배경 음악 일시 정지/재개
function Runtime.pause_music()
    if Runtime._current_music then
        Runtime._current_music:pause()
    end
end

function Runtime.resume_music()
    if Runtime._current_music then
        Runtime._current_music:play()
    end
end
```

---

## 9. yield -> Lua 코루틴

### Vibe 소스

```
fn patrol(enemy: Enemy)
  let point_a: Vec2 = Vec2(100.0, 200.0)
  let point_b: Vec2 = Vec2(500.0, 200.0)
  while true
    enemy.move_to(point_a)
    yield
    wait(2.0)
    yield
    enemy.move_to(point_b)
    yield
    wait(2.0)
    yield
```

### 생성되는 Lua 코드

```lua
-- handlers.lua

-- 트랜스파일러는 함수 내에 yield가 있으면 코루틴으로 변환한다.
-- 코루틴 함수 자체 정의
local function patrol(enemy)
    local point_a = { x = 100.0, y = 200.0 }
    local point_b = { x = 500.0, y = 200.0 }
    while true do
        enemy:move_to(point_a)
        coroutine.yield()
        Runtime.wait_coroutine(2.0)
        coroutine.yield()
        enemy:move_to(point_b)
        coroutine.yield()
        Runtime.wait_coroutine(2.0)
        coroutine.yield()
    end
end

-- 코루틴을 엔티티에 부착하여 시작
-- 예: Vibe에서 start_coroutine(patrol, enemy) 호출 시
-- Runtime.start_coroutine(enemy, patrol, enemy)
```

### 런타임: 코루틴 스케줄러

```lua
-- vibe_runtime.lua -- 코루틴 스케줄러

Runtime._global_coroutines = {}

-- 엔티티에 코루틴을 부착하여 시작
function Runtime.start_coroutine(entity, fn, ...)
    local co = coroutine.create(fn)
    local co_data = {
        co = co,
        entity = entity,
        wait_time = 0,
        args = { ... },
    }

    -- 엔티티의 코루틴 목록에 추가
    if entity and entity.__coroutines then
        table.insert(entity.__coroutines, co_data)
    else
        -- 엔티티와 무관한 글로벌 코루틴
        table.insert(Runtime._global_coroutines, co_data)
    end

    -- 즉시 첫 번째 resume 실행
    local ok, err = coroutine.resume(co, ...)
    if not ok then
        print("[Vibe Runtime] Coroutine error: " .. tostring(err))
    end

    return co_data
end

-- wait: 코루틴 내부에서 호출하여 대기 시간을 설정
-- 현재 코루틴의 wait_time을 설정하는 방식으로 구현
-- 코루틴 내부에서 직접 사용하기 위해 스레드 로컬 저장소를 사용
Runtime._coroutine_wait_times = {}  -- coroutine thread -> wait_time

function Runtime.wait_coroutine(seconds)
    local co = coroutine.running()
    Runtime._coroutine_wait_times[co] = seconds
end

-- 매 프레임 코루틴 재개 (love.update 내부에서 호출)
function Runtime.resume_coroutines(dt)
    -- 엔티티 코루틴 재개
    for _, entity in pairs(Runtime._entities) do
        if entity.__alive and entity.__coroutines then
            for i = #entity.__coroutines, 1, -1 do
                local co_data = entity.__coroutines[i]
                local status = coroutine.status(co_data.co)

                if status == "dead" then
                    table.remove(entity.__coroutines, i)
                elseif status == "suspended" then
                    -- 대기 시간 확인
                    local wait = Runtime._coroutine_wait_times[co_data.co] or 0
                    if wait > 0 then
                        wait = wait - dt
                        Runtime._coroutine_wait_times[co_data.co] = wait
                        if wait > 0 then
                            goto continue_co
                        end
                        Runtime._coroutine_wait_times[co_data.co] = nil
                    end

                    local ok, err = coroutine.resume(co_data.co, dt)
                    if not ok then
                        print("[Vibe Runtime] Coroutine error: " .. tostring(err))
                        table.remove(entity.__coroutines, i)
                    end
                end
                ::continue_co::
            end
        end
    end

    -- 글로벌 코루틴 재개
    for i = #Runtime._global_coroutines, 1, -1 do
        local co_data = Runtime._global_coroutines[i]
        local status = coroutine.status(co_data.co)

        if status == "dead" then
            table.remove(Runtime._global_coroutines, i)
        elseif status == "suspended" then
            local wait = Runtime._coroutine_wait_times[co_data.co] or 0
            if wait > 0 then
                wait = wait - dt
                Runtime._coroutine_wait_times[co_data.co] = wait
                if wait > 0 then
                    goto continue_global_co
                end
                Runtime._coroutine_wait_times[co_data.co] = nil
            end

            local ok, err = coroutine.resume(co_data.co, dt)
            if not ok then
                print("[Vibe Runtime] Coroutine error: " .. tostring(err))
                table.remove(Runtime._global_coroutines, i)
            end
        end
        ::continue_global_co::
    end
end

function Runtime.clear_coroutines()
    Runtime._global_coroutines = {}
    Runtime._coroutine_wait_times = {}
end
```

---

## 10. 런타임 글루 -- 전체 아키텍처

### 모듈 구성

```
vibe_runtime/
  init.lua            -- Runtime 메인 모듈 (아래 모듈을 모두 로드)
  registry.lua        -- 엔티티 레지스트리 (spawn/destroy/find)
  events.lua          -- 이벤트 핸들러 등록/디스패치
  scenes.lua          -- 씬 관리 (go/push/pop)
  collision.lua       -- 충돌 감지 (AABB + Box2D 선택)
  timers.lua          -- after/every 타이머
  tweens.lua          -- 트윈 보간
  coroutines.lua      -- 코루틴 스케줄러
  audio.lua           -- play_sound/play_music
  input.lua           -- 입력 상태 관리 (just_pressed, axis 등)
  signals.lua         -- 시그널/옵저버 시스템
```

### 완전한 vibe_runtime.lua (통합본)

```lua
-- ==========================================================
-- vibe_runtime.lua -- Vibe 게임 엔진 런타임 (LOVE 2D)
-- ==========================================================
-- 이 파일은 Vibe 트랜스파일러가 생성하는 모든 Lua 코드의
-- 기반이 되는 런타임 라이브러리이다.

local Runtime = {}

-- ==========================================
-- 1. 엔티티 레지스트리
-- ==========================================
Runtime._entities = {}
Runtime._entities_by_type = {}
Runtime._next_id = 0
Runtime._destroy_queue = {}

function Runtime.next_id()
    Runtime._next_id = Runtime._next_id + 1
    return Runtime._next_id
end

function Runtime.spawn(entity_class, overrides)
    local entity = entity_class.new(overrides)
    local type_name = entity.__entity_type
    Runtime._entities[entity.__id] = entity
    if not Runtime._entities_by_type[type_name] then
        Runtime._entities_by_type[type_name] = {}
    end
    table.insert(Runtime._entities_by_type[type_name], entity)
    Runtime.dispatch_for_entity("enter", entity)
    return entity
end

function Runtime.destroy(entity)
    if entity and entity.__alive then
        entity.__alive = false
        table.insert(Runtime._destroy_queue, entity)
        Runtime.dispatch_for_entity("exit", entity)
    end
end

function Runtime.destroy_all(type_name)
    local entities = Runtime.get_entities(type_name)
    for _, entity in ipairs(entities) do
        Runtime.destroy(entity)
    end
end

function Runtime.destroy_all_entities()
    for _, entity in pairs(Runtime._entities) do
        entity.__alive = false
    end
    Runtime._entities = {}
    Runtime._entities_by_type = {}
    Runtime._destroy_queue = {}
end

function Runtime.get_entities(type_name)
    return Runtime._entities_by_type[type_name] or {}
end

function Runtime.find_first(type_name)
    local entities = Runtime.get_entities(type_name)
    for _, e in ipairs(entities) do
        if e.__alive then return e end
    end
    return nil
end

function Runtime.flush_destroy_queue()
    for _, entity in ipairs(Runtime._destroy_queue) do
        Runtime._entities[entity.__id] = nil
        local type_list = Runtime._entities_by_type[entity.__entity_type]
        if type_list then
            for i = #type_list, 1, -1 do
                if type_list[i].__id == entity.__id then
                    table.remove(type_list, i)
                    break
                end
            end
        end
        entity.__coroutines = nil
    end
    Runtime._destroy_queue = {}
end

-- ==========================================
-- 2. 이벤트 시스템
-- ==========================================
Runtime._handlers = {}
Runtime._input_handlers = {}

function Runtime.register_handler(event_name, entity_type, handler_fn)
    if not Runtime._handlers[event_name] then
        Runtime._handlers[event_name] = {}
    end
    table.insert(Runtime._handlers[event_name], {
        entity_type = entity_type,
        fn = handler_fn,
    })
end

function Runtime.dispatch(event_name, ...)
    local handlers = Runtime._handlers[event_name]
    if not handlers then return end
    for _, handler in ipairs(handlers) do
        local entities = Runtime.get_entities(handler.entity_type)
        for _, entity in ipairs(entities) do
            if entity.__alive then
                handler.fn(entity, ...)
            end
        end
    end
end

function Runtime.dispatch_for_entity(event_name, entity, ...)
    local handlers = Runtime._handlers[event_name]
    if not handlers then return end
    for _, handler in ipairs(handlers) do
        if entity.__entity_type == handler.entity_type then
            handler.fn(entity, ...)
        end
    end
end

function Runtime.register_input_handler(event_name, handler)
    if not Runtime._input_handlers[event_name] then
        Runtime._input_handlers[event_name] = {}
    end
    table.insert(Runtime._input_handlers[event_name], handler)
end

function Runtime.dispatch_input(event_name, ...)
    local handlers = Runtime._input_handlers[event_name]
    if not handlers then return end
    local args = { ... }
    for _, handler in ipairs(handlers) do
        if handler.key_filter and args[1] ~= handler.key_filter then
            goto continue_handler
        end
        if handler.entity_type then
            local entities = Runtime.get_entities(handler.entity_type)
            for _, entity in ipairs(entities) do
                if entity.__alive then
                    handler.fn(entity, ...)
                end
            end
        else
            handler.fn(...)
        end
        ::continue_handler::
    end
end

-- ==========================================
-- 3. 씬 관리
-- ==========================================
Runtime._current_scene = nil
Runtime._scene_stack = {}
Runtime._scene_handlers = {}
Runtime._initial_scene = nil

function Runtime.register_scene_handler(event_name, scene_name, handler_fn)
    if not Runtime._scene_handlers[event_name] then
        Runtime._scene_handlers[event_name] = {}
    end
    if not Runtime._scene_handlers[event_name][scene_name] then
        Runtime._scene_handlers[event_name][scene_name] = {}
    end
    table.insert(Runtime._scene_handlers[event_name][scene_name], handler_fn)
end

local function dispatch_scene_event(event_name, scene)
    if not scene then return end
    local handlers = Runtime._scene_handlers[event_name]
    if not handlers then return end
    local scene_handlers = handlers[scene.__scene_name]
    if not scene_handlers then return end
    for _, fn in ipairs(scene_handlers) do
        fn(scene)
    end
end

function Runtime.go_scene(scene_class, params)
    if Runtime._current_scene then
        dispatch_scene_event("exit", Runtime._current_scene)
    end
    Runtime.destroy_all_entities()
    Runtime.clear_timers()
    Runtime.clear_tweens()
    Runtime.clear_coroutines()
    local new_scene = scene_class.new(params)
    Runtime._current_scene = new_scene
    dispatch_scene_event("enter", new_scene)
end

function Runtime.push_scene(scene_class, params)
    if Runtime._current_scene then
        dispatch_scene_event("pause", Runtime._current_scene)
        table.insert(Runtime._scene_stack, Runtime._current_scene)
    end
    local new_scene = scene_class.new(params)
    Runtime._current_scene = new_scene
    dispatch_scene_event("enter", new_scene)
end

function Runtime.pop_scene()
    if Runtime._current_scene then
        dispatch_scene_event("exit", Runtime._current_scene)
    end
    Runtime._current_scene = table.remove(Runtime._scene_stack)
    if Runtime._current_scene then
        dispatch_scene_event("resume", Runtime._current_scene)
    end
end

-- ==========================================
-- 4. 충돌 검사
-- ==========================================
Runtime._collision_handlers = {}

function Runtime.register_collision_handler(handler)
    table.insert(Runtime._collision_handlers, handler)
end

local function aabb_overlap(a, b)
    local ap = a.pos or { x = 0, y = 0 }
    local as = a.size or { w = 32, h = 32 }
    local bp = b.pos or { x = 0, y = 0 }
    local bs = b.size or { w = 32, h = 32 }
    return ap.x - as.w / 2 < bp.x + bs.w / 2
       and ap.x + as.w / 2 > bp.x - bs.w / 2
       and ap.y - as.h / 2 < bp.y + bs.h / 2
       and ap.y + as.h / 2 > bp.y - bs.h / 2
end

function Runtime.check_collisions()
    for _, handler in ipairs(Runtime._collision_handlers) do
        local self_entities = Runtime.get_entities(handler.self_type)
        local other_entities = Runtime.get_entities(handler.other_type)
        for _, se in ipairs(self_entities) do
            if not se.__alive then goto cs end
            for _, oe in ipairs(other_entities) do
                if not oe.__alive then goto co end
                if se.__id == oe.__id then goto co end
                if aabb_overlap(se, oe) then
                    handler.fn(se, oe)
                end
                ::co::
            end
            ::cs::
        end
    end
end

-- ==========================================
-- 5. 타이머
-- ==========================================
Runtime._timers = {}

function Runtime.after(delay, callback)
    local t = { remaining = delay, callback = callback, repeating = false, cancelled = false }
    function t:cancel() self.cancelled = true end
    table.insert(Runtime._timers, t)
    return t
end

function Runtime.every(interval, callback)
    local t = { remaining = interval, interval = interval, callback = callback, repeating = true, cancelled = false }
    function t:cancel() self.cancelled = true end
    table.insert(Runtime._timers, t)
    return t
end

function Runtime.update_timers(dt)
    for i = #Runtime._timers, 1, -1 do
        local t = Runtime._timers[i]
        if t.cancelled then
            table.remove(Runtime._timers, i)
        else
            t.remaining = t.remaining - dt
            if t.remaining <= 0 then
                t.callback()
                if t.repeating then
                    t.remaining = t.remaining + t.interval
                else
                    table.remove(Runtime._timers, i)
                end
            end
        end
    end
end

function Runtime.clear_timers()
    Runtime._timers = {}
end

-- ==========================================
-- 6. 트윈
-- ==========================================
Runtime._tweens = {}

local easing = {}
function easing.linear(t) return t end
function easing.quad_in(t) return t * t end
function easing.quad_out(t) return t * (2 - t) end
function easing.quad_in_out(t)
    if t < 0.5 then return 2 * t * t end
    return -1 + (4 - 2 * t) * t
end
function easing.cubic_out(t)
    local u = t - 1; return u * u * u + 1
end
function easing.bounce_out(t)
    if t < 1 / 2.75 then return 7.5625 * t * t
    elseif t < 2 / 2.75 then t = t - 1.5 / 2.75; return 7.5625 * t * t + 0.75
    elseif t < 2.5 / 2.75 then t = t - 2.25 / 2.75; return 7.5625 * t * t + 0.9375
    else t = t - 2.625 / 2.75; return 7.5625 * t * t + 0.984375 end
end

function Runtime.tween(params)
    local ease_fn = easing[params.ease or "linear"] or easing.linear
    local from_val
    if type(params.to) == "table" then
        from_val = {}
        local cur = params.target[params.field]
        for k, _ in pairs(params.to) do from_val[k] = cur[k] end
    else
        from_val = params.target[params.field]
    end
    local tw = {
        target = params.target, field = params.field,
        from_value = from_val, to_value = params.to,
        duration = params.duration or 1.0, elapsed = 0,
        ease_fn = ease_fn, completed = false,
        on_complete = params.on_complete,
    }
    function tw:cancel() self.completed = true end
    table.insert(Runtime._tweens, tw)
    return tw
end

function Runtime.update_tweens(dt)
    for i = #Runtime._tweens, 1, -1 do
        local tw = Runtime._tweens[i]
        if tw.completed then
            table.remove(Runtime._tweens, i)
        else
            tw.elapsed = tw.elapsed + dt
            local p = math.min(tw.elapsed / tw.duration, 1.0)
            local e = tw.ease_fn(p)
            if type(tw.to_value) == "table" then
                local cur = tw.target[tw.field]
                for k, _ in pairs(tw.to_value) do
                    cur[k] = tw.from_value[k] + (tw.to_value[k] - tw.from_value[k]) * e
                end
            else
                tw.target[tw.field] = tw.from_value + (tw.to_value - tw.from_value) * e
            end
            if p >= 1.0 then
                tw.completed = true
                if tw.on_complete then tw.on_complete() end
                table.remove(Runtime._tweens, i)
            end
        end
    end
end

function Runtime.clear_tweens()
    Runtime._tweens = {}
end

-- ==========================================
-- 7. 코루틴 스케줄러
-- ==========================================
Runtime._global_coroutines = {}
Runtime._coroutine_wait_times = {}

function Runtime.start_coroutine(entity, fn, ...)
    local co = coroutine.create(fn)
    local co_data = { co = co, entity = entity }
    if entity and entity.__coroutines then
        table.insert(entity.__coroutines, co_data)
    else
        table.insert(Runtime._global_coroutines, co_data)
    end
    local ok, err = coroutine.resume(co, ...)
    if not ok then
        print("[Vibe] Coroutine error: " .. tostring(err))
    end
    return co_data
end

function Runtime.wait_coroutine(seconds)
    local co = coroutine.running()
    Runtime._coroutine_wait_times[co] = seconds
end

local function resume_co_list(list, dt)
    for i = #list, 1, -1 do
        local cd = list[i]
        local status = coroutine.status(cd.co)
        if status == "dead" then
            table.remove(list, i)
        elseif status == "suspended" then
            local wait = Runtime._coroutine_wait_times[cd.co] or 0
            if wait > 0 then
                wait = wait - dt
                Runtime._coroutine_wait_times[cd.co] = wait
                if wait > 0 then goto next_co end
                Runtime._coroutine_wait_times[cd.co] = nil
            end
            local ok, err = coroutine.resume(cd.co, dt)
            if not ok then
                print("[Vibe] Coroutine error: " .. tostring(err))
                table.remove(list, i)
            end
        end
        ::next_co::
    end
end

function Runtime.resume_coroutines(dt)
    for _, entity in pairs(Runtime._entities) do
        if entity.__alive and entity.__coroutines then
            resume_co_list(entity.__coroutines, dt)
        end
    end
    resume_co_list(Runtime._global_coroutines, dt)
end

function Runtime.clear_coroutines()
    Runtime._global_coroutines = {}
    Runtime._coroutine_wait_times = {}
end

-- ==========================================
-- 8. 오디오
-- ==========================================
Runtime._sound_cache = {}
Runtime._current_music = nil

function Runtime.play_sound(path, params)
    params = params or {}
    local full_path = "assets/sounds/" .. path
    if not Runtime._sound_cache[full_path] then
        Runtime._sound_cache[full_path] = love.audio.newSource(full_path, "static")
    end
    local clone = Runtime._sound_cache[full_path]:clone()
    clone:setVolume(params.volume or 1.0)
    if params.pitch then clone:setPitch(params.pitch) end
    clone:play()
    return clone
end

function Runtime.play_music(path, params)
    params = params or {}
    Runtime.stop_music()
    Runtime._current_music = love.audio.newSource("assets/music/" .. path, "stream")
    Runtime._current_music:setLooping(params.loop or false)
    Runtime._current_music:setVolume(params.volume or 1.0)
    Runtime._current_music:play()
end

function Runtime.stop_music()
    if Runtime._current_music then
        Runtime._current_music:stop()
        Runtime._current_music = nil
    end
end

-- ==========================================
-- 9. 입력 헬퍼
-- ==========================================
Runtime._keys_pressed_this_frame = {}
Runtime._keys_released_this_frame = {}

function Runtime.just_pressed(key)
    return Runtime._keys_pressed_this_frame[key] or false
end

function Runtime.is_pressed(key)
    return love.keyboard.isDown(key)
end

function Runtime.axis(negative_key, positive_key)
    local val = 0
    if love.keyboard.isDown(negative_key) then val = val - 1 end
    if love.keyboard.isDown(positive_key) then val = val + 1 end
    return val
end

-- love.keypressed에서 호출
function Runtime.on_key_pressed(key)
    Runtime._keys_pressed_this_frame[key] = true
end

-- 매 프레임 끝에서 리셋
function Runtime.clear_input_state()
    Runtime._keys_pressed_this_frame = {}
    Runtime._keys_released_this_frame = {}
end

-- ==========================================
-- 10. 시그널 시스템
-- ==========================================

function Runtime.create_signal()
    local signal = {
        _listeners = {},
    }
    function signal:connect(fn)
        table.insert(self._listeners, fn)
        return fn  -- 연결 해제에 사용
    end
    function signal:disconnect(fn)
        for i = #self._listeners, 1, -1 do
            if self._listeners[i] == fn then
                table.remove(self._listeners, i)
                return
            end
        end
    end
    function signal:emit(...)
        for _, fn in ipairs(self._listeners) do
            fn(...)
        end
    end
    return signal
end

return Runtime
```

---

## 11. 완전한 예시: Vibe 소스 -> 생성된 Lua 프로젝트

### Vibe 소스 (전체 게임)

```
# game.vibe -- 간단한 슈팅 게임

@entity
struct Player has Damageable
  health: Int = 100
  speed: Float = 200.0
  pos: Vec2 = Vec2(x: 400.0, y: 500.0)
  size: Vec2 = Vec2(w: 32.0, h: 32.0)

  signal damaged(amount: Int)
  signal died

  fn take_damage(self, amount: Int)
    self.health = self.health - amount
    self.damaged.emit(amount)
    if self.health <= 0
      self.died.emit()

@entity
struct Bullet
  speed: Float = 500.0
  damage: Int = 10
  pos: Vec2 = Vec2(x: 0.0, y: 0.0)
  size: Vec2 = Vec2(w: 8.0, h: 16.0)

@entity
struct Enemy
  health: Int = 30
  speed: Float = 80.0
  pos: Vec2 = Vec2(x: 0.0, y: 0.0)
  size: Vec2 = Vec2(w: 32.0, h: 32.0)

@scene
struct GameScene
  background: Color = Color(r: 10, g: 10, b: 30)
  score: Int = 0

@on("enter", scene: GameScene)
fn game_enter()
  spawn(Player)
  every(2.0, fn()
    let x: Float = math.random(0, 768)
    spawn(Enemy, pos: Vec2(x: x, y: -32.0))
  )

@on("update")
fn player_move(player: Player, dt: Float)
  let dir: Float = input.axis("left", "right")
  player.pos.x = player.pos.x + dir * player.speed * dt

@on("key_pressed", key: "space")
fn player_shoot(player: Player)
  spawn(Bullet, pos: Vec2(x: player.pos.x, y: player.pos.y - 20.0))

@on("update")
fn bullet_move(bullet: Bullet, dt: Float)
  bullet.pos.y = bullet.pos.y - bullet.speed * dt
  if bullet.pos.y < -20.0
    destroy(bullet)

@on("update")
fn enemy_move(enemy: Enemy, dt: Float)
  enemy.pos.y = enemy.pos.y + enemy.speed * dt
  if enemy.pos.y > 620.0
    destroy(enemy)

@on("collide", self: Bullet, other: Enemy)
fn bullet_hit_enemy(bullet: Bullet, enemy: Enemy)
  enemy.health = enemy.health - bullet.damage
  if enemy.health <= 0
    destroy(enemy)
    play_sound("explosion.wav")
  destroy(bullet)

@on("collide", self: Player, other: Enemy)
fn player_hit_enemy(player: Player, enemy: Enemy)
  player.take_damage(20)
  destroy(enemy)

@on("draw")
fn draw_player(player: Player)
  love.graphics.setColor(0.2, 0.8, 1.0)
  love.graphics.rectangle("fill", player.pos.x - 16, player.pos.y - 16, 32, 32)

@on("draw")
fn draw_bullet(bullet: Bullet)
  love.graphics.setColor(1.0, 1.0, 0.2)
  love.graphics.rectangle("fill", bullet.pos.x - 4, bullet.pos.y - 8, 8, 16)

@on("draw")
fn draw_enemy(enemy: Enemy)
  love.graphics.setColor(1.0, 0.2, 0.2)
  love.graphics.rectangle("fill", enemy.pos.x - 16, enemy.pos.y - 16, 32, 32)
```

### 트랜스파일 결과: main.lua

```lua
-- ==========================================================
-- main.lua (Vibe 트랜스파일러 자동 생성)
-- ==========================================================

local Runtime = require("vibe_runtime")

-- ========================
-- 엔티티 정의
-- ========================

Player = {}
Player.__index = Player
Player.__entity_name = "Player"
Player.__traits = { "Damageable" }

function Player.new(overrides)
    overrides = overrides or {}
    local self = setmetatable({}, Player)
    self.__id = Runtime.next_id()
    self.__entity_type = "Player"
    self.__alive = true
    self.__coroutines = {}
    self.health = overrides.health or 100
    self.speed = overrides.speed or 200.0
    self.pos = overrides.pos or { x = 400.0, y = 500.0 }
    self.size = overrides.size or { w = 32.0, h = 32.0 }
    -- 시그널 생성
    self.damaged = Runtime.create_signal()
    self.died = Runtime.create_signal()
    return self
end

function Player:take_damage(amount)
    self.health = self.health - amount
    self.damaged:emit(amount)
    if self.health <= 0 then
        self.died:emit()
    end
end

Bullet = {}
Bullet.__index = Bullet
Bullet.__entity_name = "Bullet"
Bullet.__traits = {}

function Bullet.new(overrides)
    overrides = overrides or {}
    local self = setmetatable({}, Bullet)
    self.__id = Runtime.next_id()
    self.__entity_type = "Bullet"
    self.__alive = true
    self.__coroutines = {}
    self.speed = overrides.speed or 500.0
    self.damage = overrides.damage or 10
    self.pos = overrides.pos or { x = 0.0, y = 0.0 }
    self.size = overrides.size or { w = 8.0, h = 16.0 }
    return self
end

Enemy = {}
Enemy.__index = Enemy
Enemy.__entity_name = "Enemy"
Enemy.__traits = {}

function Enemy.new(overrides)
    overrides = overrides or {}
    local self = setmetatable({}, Enemy)
    self.__id = Runtime.next_id()
    self.__entity_type = "Enemy"
    self.__alive = true
    self.__coroutines = {}
    self.health = overrides.health or 30
    self.speed = overrides.speed or 80.0
    self.pos = overrides.pos or { x = 0.0, y = 0.0 }
    self.size = overrides.size or { w = 32.0, h = 32.0 }
    return self
end

-- ========================
-- 씬 정의
-- ========================

GameScene = {}
GameScene.__scene_name = "GameScene"

function GameScene.new(params)
    params = params or {}
    return {
        __scene_name = "GameScene",
        background = params.background or { r = 10, g = 10, b = 30 },
        score = params.score or 0,
    }
end

-- ========================
-- 핸들러 등록
-- ========================

-- @on("enter", scene: GameScene)
Runtime.register_scene_handler("enter", "GameScene", function(scene)
    Runtime.spawn(Player)
    Runtime.every(2.0, function()
        local x = math.random(0, 768)
        Runtime.spawn(Enemy, { pos = { x = x, y = -32.0 } })
    end)
end)

-- @on("update") fn player_move
Runtime.register_handler("update", "Player", function(player, dt)
    local dir = Runtime.axis("left", "right")
    player.pos.x = player.pos.x + dir * player.speed * dt
end)

-- @on("key_pressed", key: "space") fn player_shoot
Runtime.register_input_handler("key_pressed", {
    key_filter = "space",
    entity_type = "Player",
    fn = function(player, key, scancode, isrepeat)
        Runtime.spawn(Bullet, { pos = { x = player.pos.x, y = player.pos.y - 20.0 } })
    end,
})

-- @on("update") fn bullet_move
Runtime.register_handler("update", "Bullet", function(bullet, dt)
    bullet.pos.y = bullet.pos.y - bullet.speed * dt
    if bullet.pos.y < -20.0 then
        Runtime.destroy(bullet)
    end
end)

-- @on("update") fn enemy_move
Runtime.register_handler("update", "Enemy", function(enemy, dt)
    enemy.pos.y = enemy.pos.y + enemy.speed * dt
    if enemy.pos.y > 620.0 then
        Runtime.destroy(enemy)
    end
end)

-- @on("collide", self: Bullet, other: Enemy)
Runtime.register_collision_handler({
    self_type = "Bullet",
    other_type = "Enemy",
    fn = function(bullet, enemy)
        enemy.health = enemy.health - bullet.damage
        if enemy.health <= 0 then
            Runtime.destroy(enemy)
            Runtime.play_sound("explosion.wav")
        end
        Runtime.destroy(bullet)
    end,
})

-- @on("collide", self: Player, other: Enemy)
Runtime.register_collision_handler({
    self_type = "Player",
    other_type = "Enemy",
    fn = function(player, enemy)
        player:take_damage(20)
        Runtime.destroy(enemy)
    end,
})

-- @on("draw") fn draw_player
Runtime.register_handler("draw", "Player", function(player)
    love.graphics.setColor(0.2, 0.8, 1.0)
    love.graphics.rectangle("fill", player.pos.x - 16, player.pos.y - 16, 32, 32)
end)

-- @on("draw") fn draw_bullet
Runtime.register_handler("draw", "Bullet", function(bullet)
    love.graphics.setColor(1.0, 1.0, 0.2)
    love.graphics.rectangle("fill", bullet.pos.x - 4, bullet.pos.y - 8, 8, 16)
end)

-- @on("draw") fn draw_enemy
Runtime.register_handler("draw", "Enemy", function(enemy)
    love.graphics.setColor(1.0, 0.2, 0.2)
    love.graphics.rectangle("fill", enemy.pos.x - 16, enemy.pos.y - 16, 32, 32)
end)

-- ========================
-- 초기 씬 설정
-- ========================
Runtime._initial_scene = GameScene

-- ========================
-- LOVE 2D 콜백
-- ========================

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Game")
    math.randomseed(os.time())
    if Runtime._initial_scene then
        Runtime.go_scene(Runtime._initial_scene)
    end
end

function love.update(dt)
    Runtime.update_timers(dt)
    Runtime.update_tweens(dt)
    Runtime.resume_coroutines(dt)
    Runtime.dispatch("update", dt)
    Runtime.check_collisions()
    Runtime.flush_destroy_queue()
    Runtime.clear_input_state()
end

function love.draw()
    if Runtime._current_scene and Runtime._current_scene.background then
        local bg = Runtime._current_scene.background
        love.graphics.clear(bg.r / 255, bg.g / 255, bg.b / 255)
    end
    Runtime.dispatch("draw")
    -- UI: 디버그 정보
    love.graphics.setColor(1, 1, 1)
    local player = Runtime.find_first("Player")
    if player then
        love.graphics.print("HP: " .. player.health, 10, 10)
    end
end

function love.keypressed(key, scancode, isrepeat)
    Runtime.on_key_pressed(key)
    Runtime.dispatch_input("key_pressed", key, scancode, isrepeat)
    if key == "escape" then
        love.event.quit()
    end
end

function love.keyreleased(key, scancode)
    Runtime.dispatch_input("key_released", key, scancode)
end
```

---

## 12. 트랜스파일 규칙 요약 테이블

| Vibe 구문 | 생성되는 Lua | 필요한 런타임 모듈 |
|-----------|-------------|-------------------|
| `@entity struct X` | `X = {}; X.__index = X; function X.new(overrides) ... end` | registry |
| `@on("update") fn f(x: X, dt: Float)` | `Runtime.register_handler("update", "X", function(x, dt) ... end)` | events |
| `@on("draw") fn f(x: X)` | `Runtime.register_handler("draw", "X", function(x) ... end)` | events |
| `@on("key_pressed", key: "space") fn f(x: X)` | `Runtime.register_input_handler("key_pressed", {key_filter="space", entity_type="X", fn=...})` | events, input |
| `@on("collide", self: A, other: B) fn f(a: A, b: B)` | `Runtime.register_collision_handler({self_type="A", other_type="B", fn=...})` | collision |
| `@on("enter", scene: S) fn f()` | `Runtime.register_scene_handler("enter", "S", function(scene) ... end)` | scenes |
| `spawn(X, at: Vec2(a, b))` | `Runtime.spawn(X, {pos={x=a, y=b}})` | registry |
| `destroy(x)` | `Runtime.destroy(x)` | registry |
| `@scene struct S` | `S = {}; function S.new(params) ... end` | scenes |
| `go(S, params)` | `Runtime.go_scene(S, params)` | scenes |
| `tween(...)` | `Runtime.tween({target=..., field=..., to=..., duration=..., ease=...})` | tweens |
| `after(t, fn)` | `Runtime.after(t, function() ... end)` | timers |
| `every(t, fn)` | `Runtime.every(t, function() ... end)` | timers |
| `play_sound(path)` | `Runtime.play_sound(path)` | audio |
| `play_music(path, loop: true)` | `Runtime.play_music(path, {loop=true})` | audio |
| `yield` | `coroutine.yield()` | coroutines |
| `wait(t)` | `Runtime.wait_coroutine(t); coroutine.yield()` | coroutines |
| `signal damaged(amount: Int)` | `self.damaged = Runtime.create_signal()` | signals |
| `self.damaged.emit(amount)` | `self.damaged:emit(amount)` | signals |
| `x.damaged.connect(fn)` | `x.damaged:connect(fn)` | signals |
| `let x: Int = 5` | `local x = 5` | (없음) |
| `let mut x: Int = 5` | `local x = 5` | (없음, Lua는 기본 가변) |
| `if ... elif ... else` | `if ... then ... elseif ... then ... else ... end` | (없음) |
| `for x in list` | `for _, x in ipairs(list) do ... end` | (없음) |
| `while cond` | `while cond do ... end` | (없음) |
| `match x` | `if x == ... then ... elseif ... end` 또는 룩업 테이블 | (없음) |
| `fn f(a: Int) -> Int` | `function f(a) ... end` 또는 `local function f(a) ... end` | (없음) |
| `struct Vec2` | `Vec2 = {}; Vec2.__index = Vec2; function Vec2.new(...) ... end` | (없음) |
| `enum State` | 정수 상수 테이블 또는 문자열 상수 | (없음) |
| `trait T` / `impl T for X` | 메타테이블 메서드 + 런타임 trait 태그 | (없음) |
| `self` | `self` (Lua 메타테이블의 self와 동일) | (없음) |
| `none` | `nil` | (없음) |
| `some(x)` / `match ... some(v)` | `x ~= nil` / `if v ~= nil then` | (없음) |

---

## 13. Vibe 제어 구문 -> Lua 변환 상세

### if / elif / else

```
# Vibe
if health <= 0
  die()
elif health < 20
  show_warning()
else
  continue_game()
```

```lua
-- Lua
if health <= 0 then
    die()
elseif health < 20 then
    show_warning()
else
    continue_game()
end
```

### for..in

```
# Vibe
for enemy in enemies
  enemy.update(dt)

for i in range(10)
  spawn_coin(i * 32, 0)
```

```lua
-- Lua
for _, enemy in ipairs(enemies) do
    enemy:update(dt)
end

for i = 0, 9 do
    spawn_coin(i * 32, 0)
end
```

### match (enum)

```
# Vibe
match state
  Idle
    play_animation("idle")
  Running(speed)
    move(speed * dt)
  Dead
    respawn()
```

```lua
-- Lua (태그 기반 enum 변환)
if state.tag == "Idle" then
    play_animation("idle")
elseif state.tag == "Running" then
    local speed = state.speed
    move(speed * dt)
elseif state.tag == "Dead" then
    respawn()
end
```

### match (Optional / some / none)

```
# Vibe
match find_enemy(pos)
  some(enemy)
    attack(enemy)
  none
    patrol()
```

```lua
-- Lua
local _match_val = find_enemy(pos)
if _match_val ~= nil then
    local enemy = _match_val
    attack(enemy)
else
    patrol()
end
```

### enum 선언

```
# Vibe
enum PlayerState
  Idle
  Running(speed: Float)
  Jumping(velocity: Float, air_time: Float)
  Dead
```

```lua
-- Lua (태그 기반 tagged union)
PlayerState = {}

function PlayerState.Idle()
    return { tag = "Idle" }
end

function PlayerState.Running(speed)
    return { tag = "Running", speed = speed }
end

function PlayerState.Jumping(velocity, air_time)
    return { tag = "Jumping", velocity = velocity, air_time = air_time }
end

function PlayerState.Dead()
    return { tag = "Dead" }
end
```

### and / or / not

```
# Vibe
if is_alive and has_weapon
  attack()
if not is_dead or is_invincible
  continue_game()
```

```lua
-- Lua (동일한 키워드)
if is_alive and has_weapon then
    attack()
end
if (not is_dead) or is_invincible then
    continue_game()
end
```

---

## 14. 런타임 실행 순서 (매 프레임)

```
love.update(dt) 진입
  |
  +-- 1. Runtime.update_timers(dt)
  |     after/every 타이머 처리
  |
  +-- 2. Runtime.update_tweens(dt)
  |     트윈 보간 처리
  |
  +-- 3. Runtime.resume_coroutines(dt)
  |     모든 활성 코루틴 resume
  |     (wait_coroutine에 의한 대기 시간 차감 후 resume)
  |
  +-- 4. Runtime.dispatch("update", dt)
  |     모든 @on("update") 핸들러 호출
  |     각 핸들러는 해당 타입의 모든 살아있는 엔티티에 대해 실행
  |
  +-- 5. Runtime.check_collisions()
  |     모든 @on("collide") 쌍에 대해 AABB 검사
  |     충돌 시 핸들러 호출
  |
  +-- 6. Runtime.flush_destroy_queue()
  |     destroy()로 예약된 엔티티를 레지스트리에서 실제 제거
  |
  +-- 7. Runtime.clear_input_state()
        just_pressed 등 프레임 단위 입력 상태 리셋

love.draw() 진입
  |
  +-- 1. 씬 배경 그리기 (love.graphics.clear)
  |
  +-- 2. Runtime.dispatch("draw")
        모든 @on("draw") 핸들러 호출
```

---

## 15. 설계 결정 근거 요약

| 결정 | 근거 |
|------|------|
| **글로벌 엔티티 레지스트리** (ECS가 아닌 테이블) | LOVE 2D의 단순성에 맞춤. 수천 개의 엔티티까지는 O(n) 순회로 충분. 본격 ECS는 v0.2에서 고려 |
| **AABB 기본 충돌** | 2D 게임의 90%가 AABB로 충분. Box2D는 has Body 컴포넌트 사용 시 자동 전환 |
| **타이머/트윈 자체 구현** | hump, flux 등 외부 라이브러리 의존성을 없애고, Vibe 런타임으로 완전히 제어 |
| **코루틴 기반 yield** | Lua의 네이티브 코루틴과 1:1 대응. 추가 라이브러리 불필요 |
| **씬 스택** | go(씬)은 스택을 비우고 전환, push/pop으로 일시 정지/재개 지원 (일시 정지 메뉴 등) |
| **시그널은 런타임 함수** | GDScript의 signal과 동일한 패턴. connect/emit/disconnect 3개 API로 충분 |
| **enum은 태그 기반 테이블** | `{tag="Running", speed=200}` 형태. Lua에 네이티브 tagged union이 없으므로 가장 단순한 표현 |
| **Optional은 nil 매핑** | Lua의 nil과 Vibe의 none이 자연스럽게 대응. some(x)는 x ~= nil 검사로 변환 |
