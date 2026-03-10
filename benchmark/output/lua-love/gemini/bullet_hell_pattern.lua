local bul_xs = {}
local bul_ys = {}
local bul_vxs = {}
local bul_vys = {}
local bul_lifes = {}

local emit_angle = 0.0
local emit_timer = 0.0
local game_over = false

local px = 400.0
local py = 500.0
local p_radius = 8.0
local p_speed = 300.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Spiral Bullet Hell")
end

function love.update(dt)
    if not game_over then
        emit_angle = emit_angle + 2.5 * dt
        emit_timer = emit_timer + dt
        
        if emit_timer >= 0.05 then
            emit_timer = 0.0
            for k = 0, 2 do
                local angle = emit_angle + k * 2.094
                table.insert(bul_xs, 400.0)
                table.insert(bul_ys, 200.0)
                table.insert(bul_vxs, math.cos(angle) * 120.0)
                table.insert(bul_vys, math.sin(angle) * 120.0)
                table.insert(bul_lifes, 5.0)
            end
        end

        if love.keyboard.isDown("left") then
            px = px - p_speed * dt
        end
        if love.keyboard.isDown("right") then
            px = px + p_speed * dt
        end

        for i = #bul_xs, 1, -1 do
            bul_xs[i] = bul_xs[i] + bul_vxs[i] * dt
            bul_ys[i] = bul_ys[i] + bul_vys[i] * dt
            bul_lifes[i] = bul_lifes[i] - dt
            
            if bul_lifes[i] > 0.0 then
                local ddx = px - bul_xs[i]
                local ddy = py - bul_ys[i]
                if math.sqrt(ddx * ddx + ddy * ddy) < 11.0 then
                    game_over = true
                end
            end
        end
    end
end

function love.draw()
    love.graphics.circle("fill", 400.0, 200.0, 12.0)
    
    for i = 1, #bul_xs do
        if bul_lifes[i] > 0.0 then
            love.graphics.circle("fill", bul_xs[i], bul_ys[i], 3.0)
        end
    end
    
    love.graphics.circle("fill", px, py, p_radius)
    
    if game_over then
        love.graphics.print("GAME OVER", 340.0, 300.0)
    end
    
    local alive = 0
    for i = 1, #bul_lifes do
        if bul_lifes[i] > 0.0 then
            alive = alive + 1
        end
    end
    love.graphics.print("Bullets: " .. alive, 10.0, 10.0)
end