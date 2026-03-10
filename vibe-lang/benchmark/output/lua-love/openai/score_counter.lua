local score = 0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Score Tracker")
end

function love.keypressed(k)
    if k == "space" then
        score = score + 1
    end
end

function love.draw()
    love.graphics.print("Score: " .. tostring(score), 10, 10)
end