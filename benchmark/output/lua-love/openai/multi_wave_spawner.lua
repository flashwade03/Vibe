local playerX = 400
local playerY = 300
local playerSpeed = 250
local playerRadius = 12

local wave = 1
local spawn_timer = 2.0
local enemies_per_wave = 3

local ex = {}
local ey = {}
local evx = {}
local evy = {}
local elife = {}

local game_over = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Wave-Based Enemy Spawner")
end

function love.update(dt)
    if not game_over then
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
                local speed = 80 + wave * 20
                local vx = (dx / dist) * speed
                local vy = (dy / dist) * speed

                table.insert(ex, x)
                table.insert(ey, y)
                table.insert(evx, vx)
                table.insert(evy, vy)
                table.insert(elife, 1.0)
            end

            wave = wave + 1
            enemies_per_wave = 3 + wave
            spawn_timer = math.max(0.5, 3.0 - wave * 0.2)
        end

        -- Update enemies
        for i = #ex, 1, -1 do
            ex[i] = ex[i] + evx[i] * dt
            ey[i] = ey[i] + evy[i] * dt
            elife[i] = elife[i] - dt

            -- Check collision with player
            local dx = playerX - ex[i]
            local dy = playerY - ey[i]
            local distance = math.sqrt(dx * dx + dy * dy)
            if distance < playerRadius + 8 then
                game_over = true
            end

            -- Remove dead enemies
            if elife[i] <= 0 then
                table.remove(ex, i)
                table.remove(ey, i)
                table.remove(evx, i)
                table.remove(evy, i)
                table.remove(elife, i)
            end
        end
    end
end

function love.draw()
    -- Draw player
    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", playerX, playerY, playerRadius)

    -- Draw enemies
    for i = 1, #ex do
        if elife[i] > 0 then
            love.graphics.rectangle("fill", ex[i] - 8, ey[i] - 8, 16, 16)
        end
    end

    -- Draw wave number
    love.graphics.print("Wave: " .. wave, 10, 10)

    -- Draw game over
    if game_over then
        love.graphics.printf("GAME OVER", 0, love.graphics.getHeight() / 2 - 10, love.graphics.getWidth(), "center")
    end
end