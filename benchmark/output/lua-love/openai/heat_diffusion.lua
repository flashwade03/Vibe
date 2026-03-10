local heat = {}
local next_heat = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("2D Heat Diffusion")
    for i = 1, 192 do
        table.insert(heat, 0.0)
        table.insert(next_heat, 0.0)
    end
end

function love.mousepressed(mx, my, button)
    local col = math.floor(mx / 50)
    local row = math.floor(my / 50)
    if col >= 0 and col < 16 and row >= 0 and row < 12 then
        heat[row * 16 + col + 1] = 100.0
    end
end

function love.update(dt)
    for row = 0, 11 do
        for col = 0, 15 do
            local idx = row * 16 + col + 1
            local sum = 0.0
            local n = 0
            if row > 0 then
                sum = sum + heat[(row - 1) * 16 + col + 1]
                n = n + 1
            end
            if row < 11 then
                sum = sum + heat[(row + 1) * 16 + col + 1]
                n = n + 1
            end
            if col > 0 then
                sum = sum + heat[row * 16 + col]
                n = n + 1
            end
            if col < 15 then
                sum = sum + heat[row * 16 + col + 2]
                n = n + 1
            end
            local avg = sum / n
            next_heat[idx] = heat[idx] + (avg - heat[idx]) * 2.0 * dt
            next_heat[idx] = next_heat[idx] * 0.998
        end
    end
    for i = 1, 192 do
        heat[i] = next_heat[i]
    end
end

function love.draw()
    local max_t = 0.0
    for row = 0, 11 do
        for col = 0, 15 do
            local temp = heat[row * 16 + col + 1]
            if temp > max_t then
                max_t = temp
            end
            local size = temp / 100.0 * 48.0
            if size > 48.0 then
                size = 48.0
            end
            if size > 1.0 then
                local off = (48.0 - size) / 2.0
                love.graphics.rectangle("fill", col * 50 + 1 + off, row * 50 + 1 + off, size, size)
            end
        end
    end
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Click to add heat", 10, 10)
    love.graphics.print("Max: " .. math.floor(max_t), 10, 30)
end