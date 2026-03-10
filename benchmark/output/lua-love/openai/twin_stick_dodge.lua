local player_x = 400
local player_y = 300
local player_speed = 300

local bx = {}
local by = {}
local bvx = {}
local bvy = {}
local blife = {}

local spawn_timer = 0.3
local survived_time = 0
local hit = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Dodge the Bullets")
end

function love.update(dt)
    if not hit then
        -- Update player position
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

        -- Spawn bullets
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

            table.insert(bx, spawn_x)
            table.insert(by, spawn_y)
            table.insert(bvx, dx * 250)
            table.insert(bvy, dy * 250)
            table.insert(blife, 4.0)
        end

        -- Update bullets
        for i = #bx, 1, -1 do
            bx[i] = bx[i] + bvx[i] * dt
            by[i] = by[i] + bvy[i] * dt
            blife[i] = blife[i] - dt

            if blife[i] <= 0 then
                table.remove(bx, i)
                table.remove(by, i)
                table.remove(bvx, i)
                table.remove(bvy, i)
                table.remove(blife, i)
            else
                local dist = math.sqrt((player_x - bx[i])^2 + (player_y - by[i])^2)
                if dist < 13 then
                    hit = true
                end
            end
        end

        survived_time = survived_time + dt
    end
end

function love.draw()
    if hit then
        love.graphics.print("HIT! Time: " .. tostring(math.floor(survived_time)), 350, 290)
    else
        love.graphics.circle("fill", player_x, player_y, 10)
        for i = 1, #bx do
            if blife[i] > 0 then
                love.graphics.rectangle("fill", bx[i] - 3, by[i] - 3, 6, 6)
            end
        end
        love.graphics.print("Time: " .. tostring(math.floor(survived_time)), 10, 10)
    end
end