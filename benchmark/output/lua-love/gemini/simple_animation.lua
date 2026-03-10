local frame = 0
local frame_timer = 0.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Pulsing Rectangle")
end

function love.update(dt)
    frame_timer = frame_timer + dt
    
    if frame_timer >= 0.25 then
        frame_timer = frame_timer - 0.25
        frame = frame + 1
    end
    
    if frame >= 4 then
        frame = 0
    end
end

function love.draw()
    if frame == 0 then
        love.graphics.rectangle("fill", 380, 280, 40, 40)
    elseif frame == 1 then
        love.graphics.rectangle("fill", 375, 275, 50, 50)
    elseif frame == 2 then
        love.graphics.rectangle("fill", 370, 270, 60, 60)
    elseif frame == 3 then
        love.graphics.rectangle("fill", 375, 275, 50, 50)
    end
    
    love.graphics.print("Frame: " .. tostring(frame), 10, 10)
end