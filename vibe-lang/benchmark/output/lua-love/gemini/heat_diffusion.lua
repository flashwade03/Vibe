local heat = {}
local next_heat = {}
local grid_w = 16
local grid_h = 12
local cell_size = 50

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Heat Diffusion")
    for i = 1, grid_w * grid_h do
        table.insert(heat, 0.0)
        table.insert(next_heat, 0.0)
    end
end

function love.mousepressed(mx, my, button)
    local col = math.floor(mx / cell_size)
    local row = math.floor(my / cell_size)
    if col >= 0 and col < grid_w and row >= 0 and row < grid_h then
        heat[row * grid_w + col + 1] = 100.0
    end
end

function love.update(dt)
    for row = 0, grid_h - 1 do
        for col = 0, grid_w - 1 do
            local idx = row * grid_w + col + 1
            local sum = 0.0
            local n = 0
            
            if row > 0 then sum = sum + heat[(row - 1) * grid_w + col + 1]; n = n + 1 end
            if row < grid_h - 1 then sum = sum + heat[(row + 1) * grid_w + col + 1]; n = n + 1 end
            if col > 0 then sum = sum + heat[row * grid_w + (col - 1) + 1]; n = n + 1 end
            if col < grid_w - 1 then sum = sum + heat[row * grid_w + (col + 1) + 1]; n = n + 1 end
            
            local avg = sum / n
            next_heat[idx] = heat[idx] + (avg - heat[idx]) * 2.0 * dt
            next_heat[idx] = next_heat[idx] * 0.998
        end
    end
    
    for i = 1, #heat do
        heat[i] = next_heat[i]
    end
end

function love.draw()
    local max_t = 0.0
    for row = 0, grid_h - 1 do
        for col = 0, grid_w - 1 do
            local temp = heat[row * grid_w + col + 1]
            if temp > max_t then max_t = temp end
            
            local size = (temp / 100.0) * 48.0
            if size > 48.0 then size = 48.0 end
            if size > 1.0 then
                local off = (48.0 - size) / 2.0
                love.graphics.rectangle("fill", col * cell_size + 1.0 + off, row * cell_size + 1.0 + off, size, size)
            end
        end
    end
    
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Click to add heat", 10.0, 10.0)
    love.graphics.print("Max: " .. math.floor(max_t), 10.0, 30.0)
end