local player_x = 1000
local player_y = 1000
local speed = 300
local item_xs = {}
local item_ys = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe World")
    
    for i = 1, 20 do
        table.insert(item_xs, love.math.random(0, 2000))
        table.insert(item_ys, love.math.random(0, 2000))
    end
end

function love.update(dt)
    if love.keyboard.isDown("left") then player_x = player_x - speed * dt end
    if love.keyboard.isDown("right") then player_x = player_x + speed * dt end
    if love.keyboard.isDown("up") then player_y = player_y - speed * dt end
    if love.keyboard.isDown("down") then player_y = player_y + speed * dt end
    
    player_x = math.max(0, math.min(2000, player_x))
    player_y = math.max(0, math.min(2000, player_y))
end

function love.draw()
    -- Main View
    local cam_x = player_x - 400
    local cam_y = player_y - 300
    
    for i = 1, 20 do
        local draw_x = item_xs[i] - cam_x
        local draw_y = item_ys[i] - cam_y
        
        if draw_x >= -20 and draw_x <= 820 and draw_y >= -20 and draw_y <= 620 then
            love.graphics.setColor(0, 1, 0)
            love.graphics.rectangle("fill", draw_x, draw_y, 10, 10)
        end
    end
    
    love.graphics.setColor(1, 1, 1)
    love.graphics.rectangle("fill", 400 - 8, 300 - 8, 16, 16)
    
    -- Minimap
    love.graphics.setColor(0.2, 0.2, 0.2, 0.8)
    love.graphics.rectangle("fill", 630, 10, 160, 120)
    
    love.graphics.setColor(1, 1, 1)
    local p_map_x = 630 + (player_x / 2000) * 160
    local p_map_y = 10 + (player_y / 2000) * 120
    love.graphics.rectangle("fill", p_map_x - 2, p_map_y - 2, 4, 4)
    
    love.graphics.setColor(0, 1, 0)
    for i = 1, 20 do
        local m_x = 630 + (item_xs[i] / 2000) * 160
        local m_y = 10 + (item_ys[i] / 2000) * 120
        love.graphics.rectangle("fill", m_x, m_y, 2, 2)
    end
    
    -- UI
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Pos: " .. math.floor(player_x) .. ", " .. math.floor(player_y), 10, 10)
end