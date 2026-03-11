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
