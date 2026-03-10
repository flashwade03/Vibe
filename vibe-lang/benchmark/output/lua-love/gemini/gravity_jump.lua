local x = 384
local y = 550
local vy = 0.0
local on_ground = true
local speed = 200.0
local gravity = 500.0
local jump_force = -300.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Platformer")
end

function love.update(dt)
    -- Horizontal movement
    if love.keyboard.isDown("left") then
        x = x - speed * dt
    end
    if love.keyboard.isDown("right") then
        x = x + speed * dt
    end

    -- Vertical movement and gravity
    vy = vy + gravity * dt
    y = y + vy * dt

    -- Jump logic
    if love.keyboard.isDown("up") and on_ground then
        vy = jump_force
        on_ground = false
    end

    -- Ground collision
    if y >= 550 then
        y = 550
        vy = 0
        on_ground = true
    end
end

function love.draw()
    love.graphics.rectangle("fill", x, y, 32, 32)
    
    -- Draw ground line for reference
    love.graphics.line(0, 582, 800, 582)
end