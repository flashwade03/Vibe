local player_x = 1000
local player_y = 1000
local speed = 300
local item_xs = {}
local item_ys = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Program with Minimap")
    for i = 1, 20 do
        item_xs[i] = love.math.random() * 2000
        item_ys[i] = love.math.random() * 2000
    end
end

function love.update(dt)
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
end

function love.draw()
    -- Draw main view
    for i = 1, 20 do
        local draw_x = item_xs[i] - (player_x - 400.0)
        local draw_y = item_ys[i] - (player_y - 300.0)
        if draw_x > -20 and draw_x < 820 and draw_y > -20 and draw_y < 620 then
            love.graphics.rectangle("fill", draw_x, draw_y, 10, 10)
        end
    end
    love.graphics.rectangle("fill", 400, 300, 16, 16)

    -- Draw minimap
    love.graphics.setColor(0.2, 0.2, 0.2)
    love.graphics.rectangle("fill", 630, 10, 160, 120)
    love.graphics.setColor(1, 1, 1)
    for i = 1, 20 do
        local minimap_x = 630.0 + (item_xs[i] / 2000.0) * 160.0
        local minimap_y = 10.0 + (item_ys[i] / 2000.0) * 120.0
        love.graphics.rectangle("fill", minimap_x, minimap_y, 2, 2)
    end
    local player_minimap_x = 630.0 + (player_x / 2000.0) * 160.0
    local player_minimap_y = 10.0 + (player_y / 2000.0) * 120.0
    love.graphics.rectangle("fill", player_minimap_x, player_minimap_y, 2, 2)

    -- Draw position text
    love.graphics.print("Pos: " .. tostring(math.floor(player_x)) .. ", " .. tostring(math.floor(player_y)), 10, 10)
end