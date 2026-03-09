local player_x = 384
local player_y = 550
local player_speed = 200

local bullet_xs = {}
local bullet_ys = {}
local bullet_speed = 300

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Game")
end

function love.update(dt)
    if love.keyboard.isDown("left") then
        player_x = player_x - player_speed * dt
    end
    if love.keyboard.isDown("right") then
        player_x = player_x + player_speed * dt
    end

    for i = 1, #bullet_ys do
        bullet_ys[i] = bullet_ys[i] - bullet_speed * dt
    end
end

function love.keypressed(key)
    if key == "space" then
        table.insert(bullet_xs, player_x + 16)
        table.insert(bullet_ys, player_y)
    end
end

function love.draw()
    love.graphics.rectangle("fill", player_x, player_y, 32, 32)
    
    for i = 1, #bullet_xs do
        love.graphics.rectangle("fill", bullet_xs[i], bullet_ys[i], 4, 4)
    end
end