local x = 368
local y = 268
local speed = 100
local size = 64

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Program")
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
    -- Draw the 64x64 rectangle
    love.graphics.rectangle("fill", x, y, size, size)
    
    -- Display the current x and y position as text
    -- Lua uses .. for concatenation and tostring() for str()
    love.graphics.print("x: " .. tostring(x) .. " y: " .. tostring(y), 10, 10)
end