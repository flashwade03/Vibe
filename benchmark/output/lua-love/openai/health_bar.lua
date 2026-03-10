local health = 100.0
local max_health = 100.0
local regen_rate = 5.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Health Bar Example")
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
    -- Draw health bar background
    love.graphics.setColor(0.5, 0.5, 0.5)
    love.graphics.rectangle("fill", 250.0, 50.0, 300.0, 30.0)

    -- Draw health bar filled portion
    local bar_width = (health / max_health) * 300.0
    love.graphics.setColor(0.0, 1.0, 0.0)
    love.graphics.rectangle("fill", 250.0, 50.0, bar_width, 30.0)

    -- Reset color to white
    love.graphics.setColor(1, 1, 1)

    -- Display health text
    love.graphics.print("HP: " .. tostring(math.floor(health)) .. " / 100", 250.0, 90.0)

    -- Draw player rectangle
    love.graphics.rectangle("fill", 384.0, 300.0, 32.0, 32.0)

    -- Display instructions
    love.graphics.print("Press SPACE to take damage", 230.0, 550.0)
end