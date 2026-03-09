local player_x = 400
local player_y = 300
local player_radius = 20
local speed = 150

local enemy_radius = 15
local enemy_xs = {100, 700, 200, 600, 400}
local enemy_ys = {100, 100, 400, 400, 500}

local hit = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Game")
end

function love.update(dt)
    hit = false

    if love.keyboard.isDown("left") then
        player_x = player_x - speed * dt
    end
    if love.keyboard.isDown("right") then
        player_x = player_x + speed * dt
    end
    if love.keyboard.isDown("up") then
        player_y = player_y - speed * dt
    end
    if love.keyboard.isDown("down") then
        player_y = player_y + speed * dt
    end

    for i = 1, #enemy_xs do
        local ex = enemy_xs[i]
        local ey = enemy_ys[i]
        local distance = math.sqrt((player_x - ex) * (player_x - ex) + (player_y - ey) * (player_y - ey))
        if distance < player_radius + enemy_radius then
            hit = true
            break
        end
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", player_x, player_y, player_radius)

    for i = 1, #enemy_xs do
        love.graphics.circle("fill", enemy_xs[i], enemy_ys[i], enemy_radius)
    end

    if hit then
        love.graphics.print("Hit!", 10, 10)
    end
end