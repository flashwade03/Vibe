local state = 0
local score = 0
local timer = 10.0
local target_x = 0
local target_y = 0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("3-State Game")
    resetTarget()
end

function love.update(dt)
    if state == 1 then
        timer = timer - dt
        if timer <= 0.0 then
            state = 2
        end
    end
end

function love.draw()
    if state == 0 then
        love.graphics.print("Press SPACE to Start", 250, 280)
    elseif state == 1 then
        love.graphics.rectangle("fill", target_x, target_y, 20, 20)
        love.graphics.print("Score: " .. score, 10, 10)
        love.graphics.print("Time: " .. string.format("%.1f", timer), 10, 30)
    elseif state == 2 then
        love.graphics.print("Game Over! Score: " .. score, 250, 260)
        love.graphics.print("Press SPACE to Restart", 250, 300)
    end
end

function love.keypressed(key)
    if key == "space" then
        if state == 0 then
            state = 1
            score = 0
            timer = 10.0
            resetTarget()
        elseif state == 2 then
            state = 0
        end
    end
end

function love.mousepressed(mx, my, button)
    if state == 1 and button == 1 then
        if mx >= target_x and mx <= target_x + 20 and my >= target_y and my <= target_y + 20 then
            score = score + 1
            resetTarget()
        end
    end
end

function resetTarget()
    target_x = love.math.random(0, 780)
    target_y = love.math.random(0, 580)
end