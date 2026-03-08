local timer = 30.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Countdown Timer")
end

function love.update(dt)
    if timer > 0.0 then
        timer = timer - dt
        if timer < 0.0 then
            timer = 0.0
        end
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    if timer > 0.0 then
        love.graphics.print(tostring(math.floor(timer)), 350, 280)
    else
        love.graphics.print("Time Up!", 330, 280)
    end
end