```lua
local x = 368
local y = 268
local speed = 100

local function str(value)
    return tostring(value)
end

local function draw_text(text, px, py)
    love.graphics.print(text, px, py)
end

function love.load()
    love