local grid = {}
local parent = {}
local queue = {}
local q_ptr = 0
local bfs_running = false
local found = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("BFS Visualization")
    for i = 0, 191 do
        table.insert(grid, 0.0)
        table.insert(parent, -1.0)
    end
    grid[1] = 4.0 -- Start (index 0)
    grid[192] = 5.0 -- End (index 191)
end

function love.mousepressed(mx, my, button)
    local col = math.floor(mx / 50.0)
    local row = math.floor(my / 50.0)
    if col >= 0 and col < 16 and row >= 0 and row < 12 then
        local idx = row * 16 + col + 1
        if idx ~= 1 and idx ~= 192 then
            if grid[idx] == 0.0 then grid[idx] = 1.0
            elseif grid[idx] == 1.0 then grid[idx] = 0.0 end
        end
    end
end

function love.keypressed(k)
    if k == "space" and not bfs_running then
        for i = 1, 192 do
            if grid[i] == 2.0 or grid[i] == 3.0 then grid[i] = 0.0 end
            parent[i] = -1.0
        end
        queue = {1.0}
        q_ptr = 1
        bfs_running = true
        found = false
    end
end

function love.update(dt)
    if bfs_running and q_ptr <= #queue then
        local cur = math.floor(queue[q_ptr])
        q_ptr = q_ptr + 1
        
        if cur == 192 then
            bfs_running = false
            found = true
            local p = math.floor(parent[192])
            while p ~= -1 and p ~= 1 do
                grid[p] = 3.0
                p = math.floor(parent[p])
            end
        else
            if grid[cur] ~= 4.0 then grid[cur] = 2.0 end
            local r, c = math.floor((cur - 1) / 16), (cur - 1) % 16
            local neighbors = {{r-1, c}, {r+1, c}, {r, c-1}, {r, c+1}}
            for _, n in ipairs(neighbors) do
                local nr, nc = n[1], n[2]
                if nr >= 0 and nr < 12 and nc >= 0 and nc < 16 then
                    local nidx = nr * 16 + nc + 1
                    if (grid[nidx] == 0.0 or grid[nidx] == 5.0) and parent[nidx] == -1.0 then
                        parent[nidx] = cur
                        table.insert(queue, nidx)
                    end
                end
            end
        end
        if q_ptr > #queue and not found then bfs_running = false end
    end
end

function love.draw()
    for row = 0, 11 do
        for col = 0, 15 do
            local idx = row * 16 + col + 1
            local x, y = col * 50.0, row * 50.0
            love.graphics.setColor(0.3, 0.3, 0.3)
            love.graphics.rectangle("line", x, y, 50, 50)
            love.graphics.setColor(1, 1, 1)
            if grid[idx] == 1.0 then love.graphics.rectangle("fill", x, y, 50, 50)
            elseif grid[idx] == 2.0 then love.graphics.rectangle("fill", x + 15, y + 15, 20, 20)
            elseif grid[idx] == 3.0 then love.graphics.rectangle("fill", x + 5, y + 5, 40, 40)
            elseif grid[idx] == 4.0 then love.graphics.circle("fill", x + 25, y + 25, 15)
            elseif grid[idx] == 5.0 then love.graphics.circle("fill", x + 25, y + 25, 15) end
        end
    end
    love.graphics.print("Click: walls | Space: BFS", 10, 570)
    if found then love.graphics.print("Path found!", 300, 570)
    elseif not bfs_running and q_ptr > 1 and not found then love.graphics.print("No path", 300, 570) end
end