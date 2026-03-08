local timer = 30.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Countdown Timer")
end

function love.update(dt)
    -- Subtract dt from timer
    timer = timer - dt
    
    -- Do not let it go below 0.0
    if timer < 0 then
        timer = 0
    end
end

function love.draw()
    if timer > 0 then
        -- Display remaining time as an integer at (350, 280)
        love.graphics.print(tostring(math.floor(timer)), 350, 280)
    else
        -- Display "Time Up!" at (330, 280)
        love.graphics.print("Time Up!", 330, 280)
    end
end