local state = 0
local score = 0
local timer = 10.0
local target_x = 0
local target_y = 0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Target Clicker")
end

function love.update(dt)
    if state == 1 then
        timer = timer - dt
        if timer <= 0.0 then
            timer = 0.0
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
        love.graphics.print(string.format("Timer: %.1f", timer), 10, 30)
    elseif state == 2 then
        love.graphics.print("Game Over! Score: " .. score, 250, 260)
        love.graphics.print("Press SPACE to Restart", 250, 300)
    end
end

function love.keypressed(key)
    if state == 0 then
        if key == "space" then
            state = 1
            score = 0
            timer = 10.0
            target_x = love.math.random(0, 780)
            target_y = love.math.random(0, 580)
        end
    elseif state == 2 then
        if key == "space" then
            state = 0
        end
    end
end

function love.mousepressed(x, y, button)
    if state == 1 then
        if button == 1 then
            if x >= target_x and x <= target_x + 20 and y >= target_y and y <= target_y + 20 then
                score = score + 1
                target_x = love.math.random(0, 780)
                target_y = love.math.random(0, 580)
            end
        end
    end
end