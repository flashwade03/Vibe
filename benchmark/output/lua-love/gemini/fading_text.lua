local timer = 0.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Blinking Text")
end

function love.update(dt)
    timer = timer + dt
end

function love.draw()
    local vis = math.sin(timer * 2.0)
    
    if vis > 0.0 then
        love.graphics.print("Hello Vibe!", 300, 280)
    end
    
    love.graphics.print("Time: " .. math.floor(timer), 10, 10)
end