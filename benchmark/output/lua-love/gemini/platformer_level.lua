local px, py = 100, 400
local vx, vy = 0, 0
local prev_y = 400
local on_ground = false

local gravity = 600.0
local jump_vel = -350.0
local speed = 250.0

local plat_xs = {50, 300, 500, 200, 450}
local plat_ys = {450, 380, 300, 220, 150}
local plat_ws = {200, 150, 180, 120, 200}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Platformer")
end

function love.update(dt)
    prev_y = py
    
    -- Horizontal movement
    vx = 0
    if love.keyboard.isDown("left") then vx = -speed end
    if love.keyboard.isDown("right") then vx = speed end
    px = px + vx * dt
    
    -- Vertical movement
    vy = vy + gravity * dt
    py = py + vy * dt
    
    -- Jump
    if on_ground and love.keyboard.isDown("up") then
        vy = jump_vel
        on_ground = false
    end
    
    -- Collision with platforms
    on_ground = false
    if vy >= 0 then
        for i = 1, #plat_xs do
            if prev_y + 20 <= plat_ys[i] and py + 20 >= plat_ys[i] and 
               px + 20 > plat_xs[i] and px < plat_xs[i] + plat_ws[i] then
                py = plat_ys[i] - 20.0
                vy = 0
                on_ground = true
            end
        end
        -- Ground collision
        if py + 20 >= 580 then
            py = 580 - 20
            vy = 0
            on_ground = true
        end
    end
    
    -- Reset if fallen
    if py > 620 then
        px, py = 100, 400
        vy = 0
    end
end

function love.draw()
    love.graphics.print("Use arrows + up to jump", 10, 10)
    
    -- Draw player
    love.graphics.rectangle("fill", px, py, 20, 20)
    
    -- Draw platforms
    for i = 1, #plat_xs do
        love.graphics.rectangle("fill", plat_xs[i], plat_ys[i], plat_ws[i], 12)
    end
    
    -- Draw ground
    love.graphics.rectangle("fill", 0, 580, 800, 20)
end