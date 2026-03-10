local health = 100.0
local max_health = 100.0
local regen_rate = 5.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Health Bar System")
end

function love.update(dt)
    if health > 0.0 and health < max_health then
        health = health + regen_rate * dt
    end
    
    if health > max_health then
        health = max_health
    end
end

function love.keypressed(key)
    if key == "space" then
        health = health - 15.0
        if health < 0.0 then
            health = 0.0
        end
    end
end

function love.draw()
    -- Draw background bar
    love.graphics.setColor(0.3, 0.3, 0.3)
    love.graphics.rectangle("fill", 250.0, 50.0, 300.0, 30.0)
    
    -- Draw filled portion
    local bar_width = (health / max_health) * 300.0
    love.graphics.setColor(0.0, 1.0, 0.0)
    love.graphics.rectangle("fill", 250.0, 50.0, bar_width, 30.0)
    
    -- Reset color and draw text
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("HP: " .. math.floor(health) .. " / 100", 250.0, 90.0)
    
    -- Draw player
    love.graphics.rectangle("fill", 384.0, 300.0, 32, 32)
    
    -- Draw instruction
    love.graphics.print("Press SPACE to take damage", 230.0, 550.0)
end