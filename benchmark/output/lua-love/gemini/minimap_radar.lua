```lua
local player_x = 1000.0
local player_y = 1000.0
local speed = 300.0

local item_xs = {}
local item_ys = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe")
    
    for i = 1, 20 do
        item_xs[i] = love.math.random() * 2000.0
        item_ys[i] = love.math.random() * 2000.0
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
    -- Draw items in main view
    love.graphics.setColor(0.8, 0.8, 0.2)
    for i = 1, 20 do
        local draw_x = item_xs[i] - (player_x - 400.0)
        local draw_y = item_ys[i] - (player_y - 300.0)
        
        if draw_x >= -20 and draw_x <= 820 and draw_y >= -20 and draw_y <= 620 then
            love.graphics.rectangle("fill", draw_x, draw_y, 10, 10)
        end
    end
    
    -- Draw player in main view
    love.graphics.setColor(1, 1, 1)
    love.graphics.rectangle("fill", 400, 300, 16, 16)