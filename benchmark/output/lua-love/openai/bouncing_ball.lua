local x = 400
local y = 300
local radius = 16
local vx = 150
local vy = 150

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Bouncing Ball")
end

function love.update(dt)
    x = x + vx * dt
    y = y + vy * dt

    if x - radius < 0 or x + radius > love.graphics.getWidth() then
        vx = -vx
    end

    if y - radius < 0 or y + radius > love.graphics.getHeight() then
        vy = -vy
    end
end

function love.draw()
    love.graphics.circle("fill", x, y, radius)
end