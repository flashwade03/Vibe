local inv_items = {}
local held_item = 0.0
local grid_x = 200.0
local grid_y = 100.0
local cell_size = 80.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Inventory Management")
    for i = 1, 20 do
        table.insert(inv_items, 0.0)
    end
end

function love.keypressed(key)
    local item_type = 0.0
    if key == "1" then item_type = 1.0
    elseif key == "2" then item_type = 2.0
    elseif key == "3" then item_type = 3.0
    end

    if item_type > 0 then
        for i = 1, 20 do
            if inv_items[i] == 0.0 then
                inv_items[i] = item_type
                break
            end
        end
    end
end

function love.mousepressed(mx, my, button)
    local col = math.floor((mx - grid_x) / cell_size)
    local row = math.floor((my - grid_y) / cell_size)

    if col >= 0 and col < 5 and row >= 0 and row < 4 then
        local idx = row * 5 + col + 1
        if held_item == 0.0 and inv_items[idx] > 0.0 then
            held_item = inv_items[idx]
            inv_items[idx] = 0.0
        elseif held_item > 0.0 and inv_items[idx] == 0.0 then
            inv_items[idx] = held_item
            held_item = 0.0
        elseif held_item > 0.0 and inv_items[idx] > 0.0 then
            local tmp = inv_items[idx]
            inv_items[idx] = held_item
            held_item = tmp
        end
    end
end

function love.draw()
    for row = 0, 3 do
        for col = 0, 4 do
            local x = grid_x + col * cell_size
            local y = grid_y + row * cell_size
            
            love.graphics.setColor(1, 1, 1)
            love.graphics.rectangle("line", x, y, cell_size, cell_size)
            
            local val = inv_items[row * 5 + col + 1]
            love.graphics.setColor(0.8, 0.8, 0.8)
            if val == 1.0 then
                love.graphics.rectangle("fill", x + 25, y + 20, 30, 8)
                love.graphics.rectangle("fill", x + 37, y + 28, 6, 32)
            elseif val == 2.0 then
                love.graphics.circle("fill", x + 40, y + 40, 15)
            elseif val == 3.0 then
                love.graphics.circle("fill", x + 40, y + 40, 8)
            end
        end
    end
    
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Held: " .. math.floor(held_item), 10, 10)
    love.graphics.print("1-3: Add | Click: Pick/Place", 200, 540)
end