local x = 400
local y = 300
local radius = 16
local velocityX = 150
local velocityY = 150

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Bouncing Ball")
end

function love.update(dt)
    x = x + velocityX * dt
    y = y + velocityY * dt

    if x - radius < 0 then
        x = radius
        velocityX = -velocityX
    elseif x + radius > love.graphics.getWidth() then
        x = love.graphics.getWidth() - radius
        velocityX = -velocityX
    end

    if y - radius < 0 then
        y = radius
        velocityY = -velocityY
    elseif y + radius > love.graphics.getHeight() then
        y = love.graphics.getHeight() - radius
        velocityY = -velocityY
    end
end

function love.draw()
    love.graphics.circle("fill", x, y, radius)
end