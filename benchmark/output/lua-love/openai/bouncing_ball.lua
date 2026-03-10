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

    if x - radius < 0 then
        x = radius
        vx = -vx
    elseif x + radius > love.graphics.getWidth() then
        x = love.graphics.getWidth() - radius
        vx = -vx
    end

    if y - radius < 0 then
        y = radius
        vy = -vy
    elseif y + radius > love.graphics.getHeight() then
        y = love.graphics.getHeight() - radius
        vy = -vy
    end
end

function love.draw()
    love.graphics.circle("fill", x, y, radius)
end