local cells = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Grid Toggle")
    for i = 0, 47 do
        table.insert(cells, 0.0)
    end
end

function love.mousepressed(mx, my, button)
    local col = math.floor((mx - 40.0) / 80.0)
    local row = math.floor((my - 60.0) / 80.0)
    if col >= 0 and col < 8 and row >= 0 and row < 6 then
        local idx = row * 8 + col
        if cells[idx] == 0.0 then
            cells[idx] = 1.0
        else
            cells[idx] = 0.0
        end
    end
end

function love.draw()
    local count = 0
    for row = 0, 5 do
        for col = 0, 7 do
            local x = 40.0 + col * 80.0
            local y = 60.0 + row * 80.0
            love.graphics.rectangle("line", x, y, 80.0, 80.0)
            if cells[row * 8 + col] == 1.0 then
                love.graphics.rectangle("fill", x + 4.0, y + 4.0, 72.0, 72.0)
                count = count + 1
            end
        end
    end
    love.graphics.print("Active: " .. tostring(count), 10.0, 10.0)
end