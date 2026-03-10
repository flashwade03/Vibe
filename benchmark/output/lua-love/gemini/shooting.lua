local player_x = 384
local player_y = 550
local player_speed = 200
local bullet_speed = 300
local bullet_xs = {}
local bullet_ys = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Shooter")
end

function love.keypressed(k)
    if k == "space" then
        table.insert(bullet_xs, player_x + 14) -- Center bullet in 32px player
        table.insert(bullet_ys, player_y)
    end
end

function love.update(dt)
    -- Player movement
    if love.keyboard.isDown("left") and player_x > 0 then
        player_x = player_x - player_speed * dt
    end
    if love.keyboard.isDown("right") and player_x < 768 then
        player_x = player_x + player_speed * dt
    end

    -- Bullet movement
    for i = 1, #bullet_ys do
        bullet_ys[i] = bullet_ys[i] - bullet_speed * dt
    end
end

function love.draw()
    -- Draw player
    love.graphics.setColor(1, 1, 1)
    love.graphics.rectangle("fill", player_x, player_y, 32, 32)

    -- Draw bullets
    love.graphics.setColor(1, 0, 0)
    for i = 1, #bullet_xs do
        love.graphics.rectangle("fill", bullet_xs[i], bullet_ys[i], 4, 4)
    end
    
    -- Reset color
    love.graphics.setColor(1, 1, 1)
end