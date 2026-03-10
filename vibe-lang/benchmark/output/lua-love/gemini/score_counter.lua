local score = 0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Score Clicker")
end

function love.keypressed(key)
    if key == "space" then
        score = score + 1
    end
end

function love.update(dt)
    -- Update logic if needed
end

function love.draw()
    love.graphics.print("Score: " .. tostring(score), 10, 10)
end