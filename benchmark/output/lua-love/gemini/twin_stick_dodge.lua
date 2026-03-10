local px, py = 400, 300
local p_speed = 300
local bx, by, bvx, bvy, blife = {}, {}, {}, {}, {}
local spawn_timer = 0.3
local survived_time = 0
local hit = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Dodge the Bullets")
end

function love.update(dt)
    if hit then return end
    
    survived_time = survived_time + dt
    
    -- Player movement
    if love.keyboard.isDown("left") then px = px - p_speed * dt end
    if love.keyboard.isDown("right") then px = px + p_speed * dt end
    if love.keyboard.isDown("up") then py = py - p_speed * dt end
    if love.keyboard.isDown("down") then py = py + p_speed * dt end
    
    -- Bullet spawning
    spawn_timer = spawn_timer - dt
    if spawn_timer <= 0 then
        spawn_timer = 0.3
        local edge = love.math.random(0, 3)
        local sx, sy
        if edge == 0 then sx, sy = love.math.random(0, 800), 0 -- Top
        elseif edge == 1 then sx, sy = 800, love.math.random(0, 600) -- Right
        elseif edge == 2 then sx, sy = love.math.random(0, 800), 600 -- Bottom
        else sx, sy = 0, love.math.random(0, 600) end -- Left
        
        local dx, dy = px - sx, py - sy
        local len = math.sqrt(dx*dx + dy*dy)
        table.insert(bx, sx)
        table.insert(by, sy)
        table.insert(bvx, (dx / len) * 250)
        table.insert(bvy, (dy / len) * 250)
        table.insert(blife, 4.0)
    end
    
    -- Update bullets
    for i = #bx, 1, -1 do
        bx[i] = bx[i] + bvx[i] * dt
        by[i] = by[i] + bvy[i] * dt
        blife[i] = blife[i] - dt
        
        -- Collision
        local dist = math.sqrt((px - bx[i])^2 + (py - by[i])^2)
        if dist < 13.0 and blife[i] > 0 then
            hit = true
        end
    end
end

function love.draw()
    love.graphics.circle("fill", px, py, 10)
    
    for i = 1, #bx do
        if blife[i] > 0 then
            love.graphics.rectangle("fill", bx[i] - 3, by[i] - 3, 6, 6)
        end
    end
    
    if hit then
        love.graphics.print("HIT! Time: " .. math.floor(survived_time), 350, 300)
    else
        love.graphics.print("Time: " .. math.floor(survived_time), 10, 10)
    end
end