local score = 0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Score Counter")
end

function love.update(dt)
    -- No update logic required for this specific task
end

function love.keypressed(key)
    if key == "space" then
        score = score + 1
    end
end

function love.draw()
    love.graphics.print("Score: " .. tostring(score), 10, 10)
end