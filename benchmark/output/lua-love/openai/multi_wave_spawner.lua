local playerX = 400
local playerY = 300
local playerSpeed = 250
local playerRadius = 12

local wave = 1
local spawn_timer = 2.0
local enemies_per_wave = 3

local ex, ey, evx, evy, elife = {}, {}, {}, {}, {}
local enemySize = 16
local enemySpeedBase = 80

local game_over = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Wave-based Enemy Spawner")
end

function love.update(dt)
    if game_over then return end

    -- Player movement
    if love.keyboard.isDown("left") then
        playerX = playerX - playerSpeed * dt
    end
    if love.keyboard.isDown("right") then
        playerX = playerX + playerSpeed * dt
    end
    if love.keyboard.isDown("up") then
        playerY = playerY - playerSpeed * dt
    end
    if love.keyboard.isDown("down") then
        playerY = playerY + playerSpeed * dt
    end

    -- Spawn enemies
    spawn_timer = spawn_timer - dt
    if spawn_timer <= 0 then
        for i = 1, enemies_per_wave do
            local edge = love.math.random() * 4
            local x, y
            if edge < 1 then
                x = love.math.random() * 800
                y = 0
            elseif edge < 2 then
                x = 800
                y = love.math.random() * 600
            elseif edge < 3 then
                x = love.math.random() * 800
                y = 600
            else
                x = 0
                y = love.math.random() * 600
            end

            local dx = playerX - x
            local dy = playerY - y
            local dist = math.sqrt(dx * dx + dy * dy)
            local speed = enemySpeedBase + wave * 20

            table.insert(ex, x)
            table.insert(ey, y)
            table.insert(evx, (dx / dist) * speed)
            table.insert(evy, (dy / dist) * speed)
            table.insert(elife, 1.0)
        end

        wave = wave + 1
        enemies_per_wave = 3 + wave
        spawn_timer = math.max(0.5, 3.0 - wave * 0.2)
    end

    -- Update enemies
    for i = #ex, 1, -1 do
        if elife[i] > 0 then
            ex[i] = ex[i] + evx[i] * dt
            ey[i] = ey[i] + evy[i] * dt
            elife[i] = elife[i] - dt

            -- Check collision with player
            local dx = playerX - ex[i]
            local dy = playerY - ey[i]
            local distance = math.sqrt(dx * dx + dy * dy)
            if distance < playerRadius + enemySize / 2 then
                game_over = true
            end
        end
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", playerX, playerY, playerRadius)

    for i = 1, #ex do
        if elife[i] > 0 then
            love.graphics.rectangle("fill", ex[i] - enemySize / 2, ey[i] - enemySize / 2, enemySize, enemySize)
        end
    end

    love.graphics.print("Wave: " .. wave, 10, 10)

    if game_over then
        love.graphics.printf("GAME OVER", 0, love.graphics.getHeight() / 2 - 10, love.graphics.getWidth(), "center")
    end
end