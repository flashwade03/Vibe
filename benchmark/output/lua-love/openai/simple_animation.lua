local frame = 0
local frame_timer = 0.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Pulsing Rectangle Animation")
end

function love.update(dt)
    frame_timer = frame_timer + dt
    if frame_timer >= 0.25 then
        frame_timer = frame_timer - 0.25
        frame = frame + 1
        if frame >= 4 then
            frame = 0
        end
    end
end

function love.draw()
    if frame == 0 then
        love.graphics.rectangle("fill", 380.0, 280.0, 40.0, 40.0)
    elseif frame == 1 then
        love.graphics.rectangle("fill", 375.0, 275.0, 50.0, 50.0)
    elseif frame == 2 then
        love.graphics.rectangle("fill", 370.0, 270.0, 60.0, 60.0)
    elseif frame == 3 then
        love.graphics.rectangle("fill", 375.0, 275.0, 50.0, 50.0)
    end
    love.graphics.print("Frame: " .. tostring(frame), 10.0, 10.0)
end