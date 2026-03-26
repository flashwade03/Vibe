-- Vibe Runtime Prelude
-- Loaded before main.lua to provide built-in types and utilities.

-- ── Vec2 ────────────────────────────────────────────────────
Vec2 = {}
Vec2.__index = Vec2

function Vec2.new(x, y)
  return setmetatable({ x = x or 0, y = y or 0 }, Vec2)
end

function Vec2.__add(a, b) return Vec2.new(a.x + b.x, a.y + b.y) end
function Vec2.__sub(a, b) return Vec2.new(a.x - b.x, a.y - b.y) end
function Vec2.__mul(a, b)
  if type(a) == "number" then return Vec2.new(a * b.x, a * b.y) end
  if type(b) == "number" then return Vec2.new(a.x * b, a.y * b) end
  return Vec2.new(a.x * b.x, a.y * b.y)
end
function Vec2.__unm(a) return Vec2.new(-a.x, -a.y) end
function Vec2.__eq(a, b) return a.x == b.x and a.y == b.y end
function Vec2.__tostring(a) return "Vec2(" .. a.x .. ", " .. a.y .. ")" end

function Vec2:length() return math.sqrt(self.x * self.x + self.y * self.y) end
function Vec2:length_sq() return self.x * self.x + self.y * self.y end
function Vec2:normalize()
  local len = self:length()
  if len > 0 then return Vec2.new(self.x / len, self.y / len) end
  return Vec2.new(0, 0)
end
function Vec2:dot(other) return self.x * other.x + self.y * other.y end
function Vec2:distance(other)
  local dx = self.x - other.x
  local dy = self.y - other.y
  return math.sqrt(dx * dx + dy * dy)
end
function Vec2:lerp(target, t)
  return Vec2.new(self.x + (target.x - self.x) * t, self.y + (target.y - self.y) * t)
end

-- ── Color ───────────────────────────────────────────────────
Color = {}

function Color.rgb(r, g, b) return { r, g, b, 1 } end
function Color.rgba(r, g, b, a) return { r, g, b, a } end

Color.RED     = { 1, 0, 0, 1 }
Color.GREEN   = { 0, 1, 0, 1 }
Color.BLUE    = { 0, 0, 1, 1 }
Color.WHITE   = { 1, 1, 1, 1 }
Color.BLACK   = { 0, 0, 0, 1 }
Color.YELLOW  = { 1, 1, 0, 1 }
Color.CYAN    = { 0, 1, 1, 1 }
Color.MAGENTA = { 1, 0, 1, 1 }
Color.ORANGE  = { 1, 0.5, 0, 1 }
Color.GRAY    = { 0.5, 0.5, 0.5, 1 }

-- ── Math Utilities ──────────────────────────────────────────
function clamp(value, min_val, max_val)
  return math.max(min_val, math.min(max_val, value))
end

function lerp(a, b, t)
  return a + (b - a) * t
end

function sign(x)
  if x > 0 then return 1 elseif x < 0 then return -1 else return 0 end
end

function distance(x1, y1, x2, y2)
  local dx = x1 - x2
  local dy = y1 - y2
  return math.sqrt(dx * dx + dy * dy)
end

function normalize(x, y)
  local len = math.sqrt(x * x + y * y)
  if len > 0 then return x / len, y / len end
  return 0, 0
end

function angle_to(x1, y1, x2, y2)
  return math.atan2(y2 - y1, x2 - x1)
end

-- ── Collision ───────────────────────────────────────────────
function collides_rect(ax, ay, aw, ah, bx, by, bw, bh)
  return ax < bx + bw and ax + aw > bx and ay < by + bh and ay + ah > by
end

function collides_circle(ax, ay, ar, bx, by, br)
  local dx = ax - bx
  local dy = ay - by
  return (dx * dx + dy * dy) <= (ar + br) * (ar + br)
end

function collides_point_rect(px, py, rx, ry, rw, rh)
  return px >= rx and px <= rx + rw and py >= ry and py <= ry + rh
end

function collides_point_circle(px, py, cx, cy, cr)
  local dx = px - cx
  local dy = py - cy
  return (dx * dx + dy * dy) <= cr * cr
end

-- ══════════════════════════════════════════════════════════════
-- v0.2 Game Annotation Runtime
-- Entity storage, scene management, event dispatch, LOVE callbacks
-- ══════════════════════════════════════════════════════════════

-- ── Entity Storage ────────────────────────────────────────────
_vibe_entities = {}
_vibe_next_id = 1
_vibe_destroy_queue = {}

-- ── Scene Manager ─────────────────────────────────────────────
_vibe_current_scene = nil
_vibe_scene_defaults = {}   -- codegen sets: { SceneName = fn(params) → scene }
_vibe_handlers = {}          -- codegen sets: { event_name = { {entity_type, scene_type, handler}, ... } }
_vibe_entity_defaults = {}   -- codegen sets: { TypeName = fn() → entity }
_vibe_first_scene = nil      -- codegen sets: "SceneName" or nil

-- ── Built-in Functions (5) ────────────────────────────────────

function spawn(type_name, overrides)
  local factory = _vibe_entity_defaults[type_name]
  if not factory then
    error("spawn: unknown entity type '" .. tostring(type_name) .. "'")
  end
  local entity = factory()
  entity._type = type_name
  entity._id = _vibe_next_id
  entity._destroyed = false
  _vibe_next_id = _vibe_next_id + 1
  if overrides then
    for k, v in pairs(overrides) do
      entity[k] = v
    end
  end
  table.insert(_vibe_entities, entity)
  _vibe_dispatch("enter", entity)
  return entity
end

function destroy(entity)
  if entity._destroyed then return end
  entity._destroyed = true
  table.insert(_vibe_destroy_queue, entity)
end

function find_all(type_name)
  local result = {}
  for _, entity in ipairs(_vibe_entities) do
    if entity._type == type_name and not entity._destroyed then
      table.insert(result, entity)
    end
  end
  return result
end

function go_to(scene_name, params)
  -- Exit current scene
  if _vibe_current_scene then
    _vibe_dispatch_scene("exit", _vibe_current_scene)
    -- Destroy all entities
    for _, entity in ipairs(_vibe_entities) do
      entity._destroyed = true
    end
    _vibe_entities = {}
    _vibe_destroy_queue = {}
  end
  -- Create new scene
  local factory = _vibe_scene_defaults[scene_name]
  if not factory then
    error("go_to: unknown scene '" .. tostring(scene_name) .. "'")
  end
  local scene = factory(params)
  scene._type = scene_name
  _vibe_current_scene = scene
  _vibe_dispatch_scene("enter", _vibe_current_scene)
end

function emit(entity, signal_name, ...)
  local handlers = _vibe_handlers[signal_name]
  if not handlers then return end
  for _, h in ipairs(handlers) do
    if h.entity_type and entity._type == h.entity_type then
      h.handler(entity, ...)
    elseif not h.entity_type and not h.scene_type then
      h.handler(entity, ...)
    end
  end
end

-- ── Event Dispatch Functions ──────────────────────────────────

function _vibe_dispatch(event_name, ...)
  local handlers = _vibe_handlers[event_name]
  if not handlers then return end
  for _, h in ipairs(handlers) do
    if h.entity_type then
      -- Per-entity handler: iterate matching entities
      for _, entity in ipairs(_vibe_entities) do
        if entity._type == h.entity_type and not entity._destroyed then
          h.handler(entity, ...)
        end
      end
    elseif h.scene_type then
      -- Per-scene handler: check current scene type
      if _vibe_current_scene and _vibe_current_scene._type == h.scene_type then
        h.handler(_vibe_current_scene, ...)
      end
    else
      -- Global handler: call directly
      h.handler(...)
    end
  end
end

function _vibe_dispatch_scene(event_name, scene)
  local handlers = _vibe_handlers[event_name]
  if not handlers then return end
  for _, h in ipairs(handlers) do
    if h.scene_type and scene._type == h.scene_type then
      h.handler(scene)
    elseif not h.entity_type and not h.scene_type then
      h.handler(scene)
    end
  end
end

function _vibe_dispatch_input(event_name, ...)
  local handlers = _vibe_handlers[event_name]
  if not handlers then return end
  for _, h in ipairs(handlers) do
    if h.entity_type then
      for _, entity in ipairs(_vibe_entities) do
        if entity._type == h.entity_type and not entity._destroyed then
          h.handler(entity, ...)
        end
      end
    elseif h.scene_type then
      if _vibe_current_scene and _vibe_current_scene._type == h.scene_type then
        h.handler(_vibe_current_scene, ...)
      end
    else
      h.handler(...)
    end
  end
end

function _vibe_dispatch_mouse(event_name, x, y, button)
  local handlers = _vibe_handlers[event_name]
  if not handlers then return end
  for _, h in ipairs(handlers) do
    if h.entity_type then
      for _, entity in ipairs(_vibe_entities) do
        if entity._type == h.entity_type and not entity._destroyed then
          h.handler(entity, x, y, button)
        end
      end
    elseif h.scene_type then
      if _vibe_current_scene and _vibe_current_scene._type == h.scene_type then
        h.handler(_vibe_current_scene, x, y, button)
      end
    else
      h.handler(x, y, button)
    end
  end
end

function _vibe_process_destroy_queue()
  if #_vibe_destroy_queue == 0 then return end
  for _, entity in ipairs(_vibe_destroy_queue) do
    for i = #_vibe_entities, 1, -1 do
      if _vibe_entities[i]._id == entity._id then
        table.remove(_vibe_entities, i)
        break
      end
    end
  end
  _vibe_destroy_queue = {}
end

-- ── LOVE Callbacks (owned by runtime in game mode) ────────────

function love.load()
  if _vibe_first_scene then
    go_to(_vibe_first_scene)
  end
end

function love.update(dt)
  _vibe_dispatch("update", dt)
  _vibe_process_destroy_queue()
end

function love.draw()
  _vibe_dispatch("draw")
end

function love.keypressed(key)
  _vibe_dispatch_input("key_pressed", key)
end

function love.keyreleased(key)
  _vibe_dispatch_input("key_released", key)
end

function love.mousepressed(x, y, button)
  _vibe_dispatch_mouse("mouse_pressed", x, y, button)
end
