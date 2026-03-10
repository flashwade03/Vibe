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
    love.window.setMode(800, 600)
    love.window.setTitle("Game")
end

function love.update(dt)
    if love.keyboard.isDown("left") then
        x = x - speed * dt
    end
    if love.keyboard.isDown("right") then
        x = x + speed * dt
    end
    if love.keyboard.isDown("up") then
        y = y - speed * dt
    end
    if love.keyboard.isDown("down") then
        y = y + speed * dt
    end
end

function love.draw()
    love.graphics.rectangle("fill", x, y, 64, 64)
    
    local text = "x: " .. str(x) .. " y: " .. str(y)
    draw_text(text, 10, 10)
end