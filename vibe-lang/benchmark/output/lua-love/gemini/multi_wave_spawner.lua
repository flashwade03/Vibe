local px, py = 400, 300
local p_speed = 250
local wave = 1
local spawn_timer = 2.0
local enemies_per_wave = 3
local game_over = false

local ex, ey, evx, evy, elife = {}, {}, {}, {}, {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Wave")
end

function love.update(dt)
    if game_over then return end

    if love.keyboard.isDown("left") then px = px - p_speed * dt end
    if love.keyboard.isDown("right") then px = px + p_speed * dt end
    if love.keyboard.isDown("up") then py = py - p_speed * dt end
    if love.keyboard.isDown("down") then py = py + p_speed * dt end

    spawn_timer = spawn_timer - dt
    if spawn_timer <= 0 then
        local speed = 80 + wave * 20
        for i = 1, enemies_per_wave do
            local side = love.math.random() * 4
            local x, y
            if side < 1 then x, y = love.math.random(0, 800), 0
            elseif side < 2 then x, y = 800, love.math.random(0, 600)
            elseif side < 3 then x, y = love.math.random(0, 800), 600
            else x, y = 0, love.math.random(0, 600) end
            
            local dx, dy = px - x, py - y
            local dist = math.sqrt(dx*dx + dy*dy)
            table.insert(ex, x); table.insert(ey, y)
            table.insert(evx, (dx/dist) * speed); table.insert(evy, (dy/dist) * speed)
            table.insert(elife, 1.0)
        end
        wave = wave + 1
        enemies_per_wave = 3 + wave
        spawn_timer = math.max(0.5, 3.0 - wave * 0.2)
    end

    for i = #ex, 1, -1 do
        ex[i] = ex[i] + evx[i] * dt
        ey[i] = ey[i] + evy[i] * dt
        elife[i] = elife[i] - dt
        
        local dist = math.sqrt((ex[i] - px)^2 + (ey[i] - py)^2)
        if dist < 20 then game_over = true end
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", px, py, 12)
    
    for i = 1, #ex do
        if elife[i] > 0 then
            love.graphics.rectangle("fill", ex[i] - 8, ey[i] - 8, 16, 16)
        end
    end
    
    love.graphics.print("Wave: " .. wave, 10, 10)
    if game_over then
        love.graphics.print("GAME OVER", 370, 300)
    end
end