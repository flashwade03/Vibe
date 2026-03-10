local x = 384
local y = 550
local vy = 0.0
local on_ground = true
local gravity = 500.0
local speed = 200.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe")
end

function love.update(dt)
    if love.keyboard.isDown("left") then
        x = x - speed * dt
    end
    if love.keyboard.isDown("right") then
        x = x + speed * dt
    end

    if love.keyboard.isDown("up") then
        if on_ground then
            vy = -300.0
            on_ground = false
        end
    end

    vy = vy + gravity * dt
    y = y + vy * dt

    if y >= 550 then
        y = 550
        vy = 0.0
        on_ground = true
    end
end

function love.draw()
    love.graphics.rectangle("fill", x, y, 32, 32)
end