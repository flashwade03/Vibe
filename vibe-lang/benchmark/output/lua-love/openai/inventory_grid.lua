local inv_items = {}
local held_item = 0.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Inventory Management")
    for i = 0, 19 do
        table.insert(inv_items, 0.0)
    end
end

function love.keypressed(k)
    local item_type = 0.0
    if k == "1" then
        item_type = 1.0
    elseif k == "2" then
        item_type = 2.0
    elseif k == "3" then
        item_type = 3.0
    end

    if item_type > 0.0 then
        for i = 1, 20 do
            if inv_items[i] == 0.0 then
                inv_items[i] = item_type
                break
            end
        end
    end
end

function love.mousepressed(mx, my, button)
    local col = math.floor((mx - 200.0) / 80.0)
    local row = math.floor((my - 100.0) / 80.0)

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
            local x = 200.0 + col * 80.0
            local y = 100.0 + row * 80.0
            love.graphics.rectangle("line", x, y, 80, 80)

            local val = inv_items[row * 5 + col + 1]
            if val == 1.0 then
                love.graphics.rectangle("fill", x + 25.0, y + 20.0, 30.0, 8.0)
                love.graphics.rectangle("fill", x + 37.0, y + 28.0, 6.0, 32.0)
            elseif val == 2.0 then
                love.graphics.circle("fill", x + 40.0, y + 40.0, 15.0)
            elseif val == 3.0 then
                love.graphics.circle("fill", x + 40.0, y + 40.0, 8.0)
            end
        end
    end

    love.graphics.print("Held: " .. tostring(held_item), 10.0, 10.0)
    love.graphics.print("1-3: Add | Click: Pick/Place", 200.0, 540.0)
end