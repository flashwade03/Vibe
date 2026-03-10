local x = 400 - 32
local y = 300 - 32
local speed = 100

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Game")
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
    
    local text = "x: " .. tostring(x) .. " y: " .. tostring(y)
    love.graphics.print(text, 10, 10)
end