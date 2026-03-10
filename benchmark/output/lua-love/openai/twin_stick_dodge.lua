local player_x = 400
local player_y = 300
local player_speed = 300
local bullet_speed = 250
local spawn_timer = 0.3
local bullets_x = {}
local bullets_y = {}
local bullets_vx = {}
local bullets_vy = {}
local bullets_life = {}
local survived_time = 0
local hit = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Dodge the Bullets")
end

function love.update(dt)
    if not hit then
        -- Player movement
        if love.keyboard.isDown("left") then
            player_x = player_x - player_speed * dt
        end
        if love.keyboard.isDown("right") then
            player_x = player_x + player_speed * dt
        end
        if love.keyboard.isDown("up") then
            player_y = player_y - player_speed * dt
        end
        if love.keyboard.isDown("down") then
            player_y = player_y + player_speed * dt
        end

        -- Bullet spawning
        spawn_timer = spawn_timer - dt
        if spawn_timer <= 0 then
            spawn_timer = 0.3
            local edge = love.math.random(0, 3)
            local spawn_x, spawn_y

            if edge == 0 then
                spawn_x = love.math.random(0, 800)
                spawn_y = 0
            elseif edge == 1 then
                spawn_x = 800
                spawn_y = love.math.random(0, 600)
            elseif edge == 2 then
                spawn_x = love.math.random(0, 800)
                spawn_y = 600
            else
                spawn_x = 0
                spawn_y = love.math.random(0, 600)
            end

            local dx = player_x - spawn_x
            local dy = player_y - spawn_y
            local length = math.sqrt(dx * dx + dy * dy)
            dx = dx / length
            dy = dy / length

            table.insert(bullets_x, spawn_x)
            table.insert(bullets_y, spawn_y)
            table.insert(bullets_vx, dx * bullet_speed)
            table.insert(bullets_vy, dy * bullet_speed)
            table.insert(bullets_life, 4.0)
        end

        -- Bullet movement and life update
        for i = #bullets_x, 1, -1 do
            bullets_x[i] = bullets_x[i] + bullets_vx[i] * dt
            bullets_y[i] = bullets_y[i] + bullets_vy[i] * dt
            bullets_life[i] = bullets_life[i] - dt

            if bullets_life[i] <= 0 then
                table.remove(bullets_x, i)
                table.remove(bullets_y, i)
                table.remove(bullets_vx, i)
                table.remove(bullets_vy, i)
                table.remove(bullets_life, i)
            else
                local dist = math.sqrt((player_x - bullets_x[i])^2 + (player_y - bullets_y[i])^2)
                if dist < 13.0 then
                    hit = true
                end
            end
        end

        survived_time = survived_time + dt
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", player_x, player_y, 10)

    for i = 1, #bullets_x do
        if bullets_life[i] > 0 then
            love.graphics.rectangle("fill", bullets_x[i] - 3, bullets_y[i] - 3, 6, 6)
        end
    end

    love.graphics.print("Time: " .. math.floor(survived_time), 10, 10)

    if hit then
        love.graphics.printf("HIT! Time: " .. math.floor(survived_time), 0, 300, 800, "center")
    end
end