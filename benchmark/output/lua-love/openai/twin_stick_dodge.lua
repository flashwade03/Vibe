local player_x = 400
local player_y = 300
local player_speed = 300

local bx = {}
local by = {}
local bvx = {}
local bvy = {}
local blife = {}

local spawn_timer = 0.3
local spawn_interval = 0.3
local bullet_speed = 250.0
local bullet_size = 6
local bullet_life = 4.0

local survived_time = 0.0
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
            spawn_timer = spawn_interval
            local edge = love.math.random(0, 3)
            local spawn_x, spawn_y

            if edge == 0 then -- Top edge
                spawn_x = love.math.random(0, love.graphics.getWidth())
                spawn_y = 0
            elseif edge == 1 then -- Right edge
                spawn_x = love.graphics.getWidth()
                spawn_y = love.math.random(0, love.graphics.getHeight())
            elseif edge == 2 then -- Bottom edge
                spawn_x = love.math.random(0, love.graphics.getWidth())
                spawn_y = love.graphics.getHeight()
            else -- Left edge
                spawn_x = 0
                spawn_y = love.math.random(0, love.graphics.getHeight())
            end

            local dx = player_x - spawn_x
            local dy = player_y - spawn_y
            local dist = math.sqrt(dx * dx + dy * dy)
            dx = dx / dist
            dy = dy / dist

            table.insert(bx, spawn_x)
            table.insert(by, spawn_y)
            table.insert(bvx, dx * bullet_speed)
            table.insert(bvy, dy * bullet_speed)
            table.insert(blife, bullet_life)
        end

        -- Update bullets
        for i = #bx, 1, -1 do
            bx[i] = bx[i] + bvx[i] * dt
            by[i] = by[i] + bvy[i] * dt
            blife[i] = blife[i] - dt

            -- Check collision
            if math.sqrt((player_x - bx[i])^2 + (player_y - by[i])^2) < 13.0 and blife[i] > 0.0 then
                hit = true
            end

            -- Remove dead bullets
            if blife[i] <= 0 then
                table.remove(bx, i)
                table.remove(by, i)
                table.remove(bvx, i)
                table.remove(bvy, i)
                table.remove(blife, i)
            end
        end

        -- Update survived time
        survived_time = survived_time + dt
    end
end

function love.draw()
    if hit then
        love.graphics.print("HIT! Time: " .. tostring(math.floor(survived_time)), 350, 290)
    else
        love.graphics.setColor(1, 1, 1)
        love.graphics.circle("fill", player_x, player_y, 10)

        for i = 1, #bx do
            if blife[i] > 0 then
                love.graphics.rectangle("fill", bx[i] - bullet_size / 2, by[i] - bullet_size / 2, bullet_size, bullet_size)
            end
        end

        love.graphics.print("Time: " .. tostring(math.floor(survived_time)), 10, 10)
    end
end