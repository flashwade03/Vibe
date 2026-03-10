local last_key = "none"
local key_count = 0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Key Tracker")
end

function love.keypressed(key)
    last_key = key
    key_count = key_count + 1
end

function love.update(dt)
end

function love.draw()
    love.graphics.print("Last Key: " .. last_key, 250, 250)
    love.graphics.print("Total Presses: " .. tostring(key_count), 250, 290)
    
    love.graphics.setColor(0.2, 0.2, 0.2)
    love.graphics.rectangle("line", 300, 350, 200, 80)
    love.graphics.setColor(1, 1, 1)
    
    love.graphics.print(last_key, 370, 380)
end