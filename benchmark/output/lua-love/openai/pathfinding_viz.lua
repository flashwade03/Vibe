local grid = {}
local queue = {}
local q_ptr = 0
local parent = {}
local bfs_running = false
local found = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("BFS Visualization")
    for i = 0, 191 do
        grid[i] = 0.0
        parent[i] = -1.0
    end
    grid[0] = 4.0
    grid[191] = 5.0
end

function love.mousepressed(mx, my, button)
    local col = math.floor(mx / 50)
    local row = math.floor(my / 50)
    if col >= 0 and col < 16 and row >= 0 and row < 12 then
        local idx = row * 16 + col
        if idx ~= 0 and idx ~= 191 then
            if grid[idx] == 0.0 then
                grid[idx] = 1.0
            elseif grid[idx] == 1.0 then
                grid[idx] = 0.0
            end
        end
    end
end

function love.keypressed(k)
    if k == "space" and not bfs_running then
        for i = 0, 191 do
            if grid[i] == 2.0 or grid[i] == 3.0 then
                grid[i] = 0.0
            end
            parent[i] = -1.0
        end
        queue = {0.0}
        q_ptr = 0
        bfs_running = true
        found = false
    end
end

function love.update(dt)
    if bfs_running and q_ptr < #queue then
        local cur = math.floor(queue[q_ptr + 1])
        q_ptr = q_ptr + 1
        if cur == 191 then
            bfs_running = false
            found = true
            local p = 191
            for iter = 0, 191 do
                if parent[p] <= 0 then break end
                p = parent[p]
                if p ~= 0 then grid[p] = 3.0 end
            end
        else
            if grid[cur] ~= 4.0 then grid[cur] = 2.0 end
            local neighbors = {cur - 16, cur + 16, cur - 1, cur + 1}
            for _, n in ipairs(neighbors) do
                if n >= 0 and n < 192 and (grid[n] == 0.0 or grid[n] == 5.0) and parent[n] == -1.0 then
                    parent[n] = cur
                    table.insert(queue, n)
                end
            end
        end
    elseif q_ptr >= #queue and not found then
        bfs_running = false
    end
end

function love.draw()
    for row = 0, 11 do
        for col = 0, 15 do
            local idx = row * 16 + col
            local x = col * 50
            local y = row * 50
            if grid[idx] == 1.0 then
                love.graphics.rectangle("fill", x, y, 50, 50)
            elseif grid[idx] == 2.0 then
                love.graphics.rectangle("fill", x + 15, y + 15, 20, 20)
            elseif grid[idx] == 3.0 then
                love.graphics.rectangle("fill", x + 5, y + 5, 40, 40)
            elseif grid[idx] == 4.0 then
                love.graphics.circle("fill", x + 25, y + 25, 15)
            elseif grid[idx] == 5.0 then
                love.graphics.circle("fill", x + 25, y + 25, 15)
            end
        end
    end
    love.graphics.print("Click: walls | Space: BFS", 10, 10)
    if found then
        love.graphics.print("Path found!", 300, 10)
    elseif not bfs_running and not found and q_ptr > 0 then
        love.graphics.print("No path", 300, 10)
    end
end