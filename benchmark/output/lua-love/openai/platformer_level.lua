local player_x = 100
local player_y = 400
local player_vx = 0
local player_vy = 0
local player_speed = 250
local gravity = 600.0
local jump_velocity = -350.0
local on_ground = false
local prev_y = player_y

local plat_xs = {50, 300, 500, 200, 450}
local plat_ys = {450, 380, 300, 220, 150}
local plat_ws = {200, 150, 180, 120, 200}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Simple Platformer")
end

function love.update(dt)
    prev_y = player_y

    -- Horizontal movement
    player_vx = 0
    if love.keyboard.isDown("left") then
        player_vx = -player_speed
    end
    if love.keyboard.isDown("right") then
        player_vx = player_speed
    end

    -- Jump
    if love.keyboard.isDown("up") and on_ground then
        player_vy = jump_velocity
        on_ground = false
    end

    -- Apply gravity
    player_vy = player_vy + gravity * dt

    -- Update position
    player_x = player_x + player_vx * dt
    player_y = player_y + player_vy * dt

    -- Collision detection
    on_ground = false
    for i = 1, #plat_xs do
        if player_vy >= 0 and prev_y + 20 <= plat_ys[i] and
           player_y + 20 >= plat_ys[i] and
           player_x + 20 > plat_xs[i] and
           player_x < plat_xs[i] + plat_ws[i] then
            player_y = plat_ys[i] - 20
            player_vy = 0
            on_ground = true
        end
    end

    -- Check ground
    if player_y + 20 >= 580 then
        player_y = 580 - 20
        player_vy = 0
        on_ground = true
    end

    -- Reset if player falls below screen
    if player_y > 620 then
        player_x = 100
        player_y = 400
        player_vy = 0
    end
end

function love.draw()
    -- Draw player
    love.graphics.rectangle("fill", player_x, player_y, 20, 20)

    -- Draw platforms
    for i = 1, #plat_xs do
        love.graphics.rectangle("fill", plat_xs[i], plat_ys[i], plat_ws[i], 12)
    end

    -- Draw instructions
    love.graphics.print("Use arrows + up to jump", 10, 10)
end