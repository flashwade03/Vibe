local ship_x = 400.0
local ship_y = 300.0
local ship_angle = -1.5708
local ship_vx = 0.0
local ship_vy = 0.0
local game_over = false
local score = 0

local ax, ay, avx, avy, asize, aalive = {}, {}, {}, {}, {}, {}
local bx, by, bvx, bvy, blife = {}, {}, {}, {}, {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Asteroids")
    
    for i = 1, 6 do
        table.insert(ax, love.math.random(0, 800))
        table.insert(ay, love.math.random(0, 600))
        table.insert(avx, love.math.random(-60, 60))
        table.insert(avy, love.math.random(-60, 60))
        table.insert(asize, 25.0)
        table.insert(aalive, 1.0)
    end
end

function love.keypressed(k)
    if k == "space" and not game_over then
        table.insert(bx, ship_x + math.cos(ship_angle) * 15.0)
        table.insert(by, ship_y + math.sin(ship_angle) * 15.0)
        table.insert(bvx, math.cos(ship_angle) * 400.0)
        table.insert(bvy, math.sin(ship_angle) * 400.0)
        table.insert(blife, 2.0)
    end
end

function love.update(dt)
    if not game_over then
        if love.keyboard.isDown("left") then ship_angle = ship_angle - 3.0 * dt end
        if love.keyboard.isDown("right") then ship_angle = ship_angle + 3.0 * dt end
        if love.keyboard.isDown("up") then
            ship_vx = ship_vx + math.cos(ship_angle) * 300.0 * dt
            ship_vy = ship_vy + math.sin(ship_angle) * 300.0 * dt
        end
        
        ship_vx = ship_vx * 0.99
        ship_vy = ship_vy * 0.99
        ship_x = ship_x + ship_vx * dt
        ship_y = ship_y + ship_vy * dt
        
        if ship_x > 800.0 then ship_x = 0.0 elseif ship_x < 0.0 then ship_x = 800.0 end
        if ship_y > 600.0 then ship_y = 0.0 elseif ship_y < 0.0 then ship_y = 600.0 end
        
        for i = 1, #ax do
            if aalive[i] == 1.0 then
                ax[i] = ax[i] + avx[i] * dt
                ay[i] = ay[i] + avy[i] * dt
                if ax[i] > 800.0 then ax[i] = 0.0 elseif ax[i] < 0.0 then ax[i] = 800.0 end
                if ay[i] > 600.0 then ay[i] = 0.0 elseif ay[i] < 0.0 then ay[i] = 600.0 end
                
                local sdx, sdy = ship_x - ax[i], ship_y - ay[i]
                if math.sqrt(sdx*sdx + sdy*sdy) < asize[i] + 8.0 then game_over = true end
            end
        end
        
        for j = 1, #bx do
            if blife[j] > 0.0 then
                blife[j] = blife[j] - dt
                bx[j] = bx[j] + bvx[j] * dt
                by[j] = by[j] + bvy[j] * dt
                for i = 1, #ax do
                    if aalive[i] == 1.0 then
                        local ddx, ddy = bx[j] - ax[i], by[j] - ay[i]
                        if math.sqrt(ddx*ddx + ddy*ddy) < asize[i] then
                            aalive[i] = 0.0
                            blife[j] = 0.0
                            score = score + 1
                        end
                    end
                end
            end
        end
    end
end

function love.draw()
    love.graphics.circle("line", ship_x, ship_y, 8.0)
    love.graphics.circle("fill", ship_x + math.cos(ship_angle) * 15.0, ship_y + math.sin(ship_angle) * 15.0, 3.0)
    for i = 1, #ax do if aalive[i] == 1.0 then love.graphics.circle("line", ax[i], ay[i], asize[i]) end end
    for j = 1, #bx do if blife[j] > 0.0 then love.graphics.circle("fill", bx[j], by[j], 2.0) end end
    love.graphics.print("Score: " .. score, 10, 10)
    if game_over then love.graphics.print("GAME OVER", 340, 280) end
end