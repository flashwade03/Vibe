local x = 384
local y = 284
local speed = 200

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Rectangle")
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
    love.graphics.rectangle("fill", x, y, 32, 32)
end