local player_x = 400
local player_y = 300
local player_speed = 200

local enemy_x = 100
local enemy_y = 100
local enemy_speed = 100

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Program")
end

function love.update(dt)
    -- Player movement
    if love.keyboard.isDown("left") then
        player_x = player_x - player_speed * dt
    end
    if love.keyboard.isDown("right") then
        player_x = player_x + player_speed * dt
    end
    if love.keyboard.isDown("up") then
        player_y = player_y - player_speed * dt
    end
    if love.keyboard.isDown("down") then
        player_y = player_y + player_speed * dt
    end

    -- Enemy follows player
    local dx = player_x - enemy_x
    local dy = player_y - enemy_y
    local distance = math.sqrt(dx * dx + dy * dy)

    if distance > 1.0 then
        dx = dx / distance
        dy = dy / distance
        enemy_x = enemy_x + dx * enemy_speed * dt
        enemy_y = enemy_y + dy * enemy_speed * dt
    end
end

function love.draw()
    -- Draw enemy in red
    love.graphics.setColor(1, 0, 0)
    love.graphics.rectangle("fill", enemy_x, enemy_y, 32, 32)

    -- Draw player in blue
    love.graphics.setColor(0, 0, 1)
    love.graphics.rectangle("fill", player_x, player_y, 32, 32)

    -- Reset color to white
    love.graphics.setColor(1, 1, 1)
end