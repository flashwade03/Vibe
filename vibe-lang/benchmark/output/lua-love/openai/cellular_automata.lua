local cells = {}
local next_cells = {}
local sim_timer = 0.0
local generation = 0
local paused = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Conway's Game of Life")
    for i = 0, 299 do
        if love.math.random() > 0.7 then
            table.insert(cells, 1.0)
        else
            table.insert(cells, 0.0)
        end
        table.insert(next_cells, 0.0)
    end
end

function love.keypressed(k)
    if k == "space" then
        paused = not paused
    end
end

function love.update(dt)
    if not paused then
        sim_timer = sim_timer + dt
        if sim_timer >= 0.2 then
            sim_timer = 0.0
            generation = generation + 1
            for row = 0, 14 do
                for col = 0, 19 do
                    local count = 0
                    if row > 0 and col > 0 and cells[(row - 1) * 20 + col - 1] == 1.0 then count = count + 1 end
                    if row > 0 and cells[(row - 1) * 20 + col] == 1.0 then count = count + 1 end
                    if row > 0 and col < 19 and cells[(row - 1) * 20 + col + 1] == 1.0 then count = count + 1 end
                    if col > 0 and cells[row * 20 + col - 1] == 1.0 then count = count + 1 end
                    if col < 19 and cells[row * 20 + col + 1] == 1.0 then count = count + 1 end
                    if row < 14 and col > 0 and cells[(row + 1) * 20 + col - 1] == 1.0 then count = count + 1 end
                    if row < 14 and cells[(row + 1) * 20 + col] == 1.0 then count = count + 1 end
                    if row < 14 and col < 19 and cells[(row + 1) * 20 + col + 1] == 1.0 then count = count + 1 end
                    local idx = row * 20 + col
                    if cells[idx] == 1.0 then
                        if count == 2 or count == 3 then
                            next_cells[idx] = 1.0
                        else
                            next_cells[idx] = 0.0
                        end
                    else
                        if count == 3 then
                            next_cells[idx] = 1.0
                        else
                            next_cells[idx] = 0.0
                        end
                    end
                end
            end
            for i = 0, 299 do
                cells[i] = next_cells[i]
            end
        end
    end
end

function love.draw()
    for row = 0, 14 do
        for col = 0, 19 do
            if cells[row * 20 + col] == 1.0 then
                love.graphics.rectangle("fill", col * 40.0, row * 40.0, 38.0, 38.0)
            end
        end
    end
    love.graphics.print("Gen: " .. generation, 10.0, 10.0)
    if paused then
        love.graphics.print("PAUSED", 350.0, 10.0)
    end
end