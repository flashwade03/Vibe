local target_x = 400.0
local target_y = 300.0
local cx = 400.0
local cy = 300.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Smooth Follow")
end

function love.mousepressed(mx, my, button)
    target_x = mx
    target_y = my
end

function love.update(dt)
    cx = cx + (target_x - cx) * 3.0 * dt
    cy = cy + (target_y - cy) * 3.0 * dt
end

function love.draw()
    love.graphics.print("Click to move", 10.0, 10.0)
    
    -- Draw the circle
    love.graphics.circle("fill", cx, cy, 20.0)
    
    -- Draw the target marker
    love.graphics.circle("fill", target_x, target_y, 4.0)
end