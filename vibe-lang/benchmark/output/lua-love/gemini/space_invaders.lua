local inv_xs = {}
local inv_ys = {}
local inv_alive = {}
local inv_dir = 1.0
local inv_speed = 40.0

local px = 384.0
local py = 550.0
local p_speed = 250.0

local bul_xs = {}
local bul_ys = {}
local bul_alive = {}
local score = 0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Space Invaders")
    
    for row = 0, 2 do
        for col = 0, 5 do
            table.insert(inv_xs, 150.0 + col * 80.0)
            table.insert(inv_ys, 50.0 + row * 50.0)
            table.insert(inv_alive, 1.0)
        end
    end
end

function love.keypressed(k)
    if k == "space" then
        table.insert(bul_xs, px + 14.0)
        table.insert(bul_ys, 540.0)
        table.insert(bul_alive, 1.0)
    end
end

function love.update(dt)
    if love.keyboard.isDown("left") then px = px - p_speed * dt end
    if love.keyboard.isDown("right") then px = px + p_speed * dt end
    px = math.max(0.0, math.min(768.0, px))

    local reverse = false
    for i = 1, #inv_xs do
        if inv_alive[i] == 1.0 then
            inv_xs[i] = inv_xs[i] + inv_speed * inv_dir * dt
            if inv_xs[i] < 20.0 or inv_xs[i] > 750.0 then
                reverse = true
            end
        end
    end

    if reverse then
        inv_dir = -inv_dir
        for i = 1, #inv_ys do
            if inv_alive[i] == 1.0 then inv_ys[i] = inv_ys[i] + 20.0 end
        end
    end

    for j = 1, #bul_ys do
        if bul_alive[j] == 1.0 then
            bul_ys[j] = bul_ys[j] - 400.0 * dt
            if bul_ys[j] < 0.0 then bul_alive[j] = 0.0 end
            
            for i = 1, #inv_xs do
                if inv_alive[i] == 1.0 and bul_xs[j] >= inv_xs[i] and bul_xs[j] <= inv_xs[i] + 30.0 and bul_ys[j] >= inv_ys[i] and bul_ys[j] <= inv_ys[i] + 20.0 then
                    inv_alive[i] = 0.0
                    bul_alive[j] = 0.0
                    score = score + 1
                end
            end
        end
    end
end

function love.draw()
    love.graphics.rectangle("fill", px, py, 32, 16)
    
    for i = 1, #inv_xs do
        if inv_alive[i] == 1.0 then
            love.graphics.rectangle("fill", inv_xs[i], inv_ys[i], 30, 20)
        end
    end
    
    for j = 1, #bul_xs do
        if bul_alive[j] == 1.0 then
            love.graphics.rectangle("fill", bul_xs[j], bul_ys[j], 4, 10)
        end
    end
    
    love.graphics.print("Score: " .. score, 10, 10)
    
    local alive = 0
    for i = 1, #inv_alive do
        if inv_alive[i] == 1.0 then alive = alive + 1 end
    end
    if alive == 0 then
        love.graphics.print("YOU WIN!", 340, 280)
    end
end