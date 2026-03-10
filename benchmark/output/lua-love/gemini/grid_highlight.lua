local cells = {}
local grid_cols = 8
local grid_rows = 6
local cell_size = 80.0
local offset_x = 40.0
local offset_y = 60.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Grid Toggle")
    
    for i = 0, (grid_cols * grid_rows) - 1 do
        table.insert(cells, 0.0)
    end
end

function love.mousepressed(mx, my, button)
    local col = math.floor((mx - offset_x) / cell_size)
    local row = math.floor((my - offset_y) / cell_size)
    
    if col >= 0 and col < grid_cols and row >= 0 and row < grid_rows then
        local idx = row * grid_cols + col + 1
        if cells[idx] == 0.0 then
            cells[idx] = 1.0
        else
            cells[idx] = 0.0
        end
    end
end

function love.draw()
    local count = 0
    
    for row = 0, grid_rows - 1 do
        for col = 0, grid_cols - 1 do
            local x = offset_x + col * cell_size
            local y = offset_y + row * cell_size
            local idx = row * grid_cols + col + 1
            
            love.graphics.setColor(1, 1, 1)
            love.graphics.rectangle("line", x, y, cell_size, cell_size)
            
            if cells[idx] == 1.0 then
                love.graphics.setColor(0.2, 0.6, 1)
                love.graphics.rectangle("fill", x + 4.0, y + 4.0, 72.0, 72.0)
                count = count + 1
            end
        end
    end
    
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Active: " .. tostring(count), 10.0, 10.0)
end