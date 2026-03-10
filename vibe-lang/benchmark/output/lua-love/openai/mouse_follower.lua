local target_x = 400.0
local target_y = 300.0
local cx = 400.0
local cy = 300.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Circle Follow")
end

function love.update(dt)
    cx = cx + (target_x - cx) * 3.0 * dt
    cy = cy + (target_y - cy) * 3.0 * dt
end

function love.mousepressed(mx, my, button)
    if button == 1 then
        target_x = mx
        target_y = my
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", cx, cy, 20)
    love.graphics.circle("fill", target_x, target_y, 4)
    love.graphics.print("Click to move", 10, 10)
end