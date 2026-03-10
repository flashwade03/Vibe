local state = 0
local score = 0
local timer = 10.0
local target_x = 400
local target_y = 300

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Game")
    math.randomseed(os.time())
end

function love.update(dt)
    if state == 1 then
        timer = timer - dt
        if timer <= 0 then
            state = 2
        end
    end
end

function love.keypressed(key)
    if key == "space" then
        if state == 0 then
            state = 1
            score = 0
            timer = 10.0
            target_x = love.math.random(0, 780)
            target_y = love.math.random(0, 580)
        elseif state == 2 then
            state = 0
        end
    end
end

function love.mousepressed(x, y, button)
    if state == 1 and button == 1 then
        if x >= target_x and x <= target_x + 20 and y >= target_y and y <= target_y + 20 then
            score = score + 1
            target_x = love.math.random(0, 780)
            target_y = love.math.random(0, 580)
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