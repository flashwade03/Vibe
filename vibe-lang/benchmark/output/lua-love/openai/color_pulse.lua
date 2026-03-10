local timer = 0.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Pulsing Circles Grid")
end

function love.update(dt)
    timer = timer + dt
end

function love.draw()
    for row = 0, 3 do
        for col = 0, 4 do
            local cx = 100.0 + col * 160.0
            local cy = 100.0 + row * 150.0
            local phase = (row * 5 + col) * 0.5
            local radius = 20.0 + 15.0 * math.sin(timer * 3.0 + phase)
            love.graphics.circle("fill", cx, cy, radius)
        end
    end
    love.graphics.print("Time: " .. tostring(math.floor(timer)), 10.0, 10.0)
end