local node_xs = {}
local node_ys = {}
local prev_xs = {}
local prev_ys = {}
local pin_x = 200.0
local pin_y = 200.0
local speed = 200.0
local rest_len = 40.0
local num_nodes = 10

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Verlet Rope")
    for i = 0, num_nodes - 1 do
        local xv = 200.0 + i * 40.0
        table.insert(node_xs, xv)
        table.insert(prev_xs, xv)
        table.insert(node_ys, 200.0)
        table.insert(prev_ys, 200.0)
    end
end

function love.update(dt)
    if love.keyboard.isDown("left") then pin_x = pin_x - speed * dt end
    if love.keyboard.isDown("right") then pin_x = pin_x + speed * dt end
    if love.keyboard.isDown("up") then pin_y = pin_y - speed * dt end
    if love.keyboard.isDown("down") then pin_y = pin_y + speed * dt end

    node_xs[1] = pin_x
    node_ys[1] = pin_y
    prev_xs[1] = pin_x
    prev_ys[1] = pin_y

    for i = 2, num_nodes do
        local vx = node_xs[i] - prev_xs[i]
        local vy = node_ys[i] - prev_ys[i]
        prev_xs[i] = node_xs[i]
        prev_ys[i] = node_ys[i]
        node_xs[i] = node_xs[i] + vx * 0.99
        node_ys[i] = node_ys[i] + vy * 0.99 + 400.0 * dt * dt
    end

    for iter = 1, 3 do
        for i = 1, num_nodes - 1 do
            local dx = node_xs[i + 1] - node_xs[i]
            local dy = node_ys[i + 1] - node_ys[i]
            local dist = math.sqrt(dx * dx + dy * dy)
            if dist > 0.1 then
                local diff = (dist - rest_len) / dist * 0.5
                if i == 1 then
                    node_xs[i + 1] = node_xs[i + 1] - dx * diff * 2.0
                    node_ys[i + 1] = node_ys[i + 1] - dy * diff * 2.0
                else
                    node_xs[i] = node_xs[i] + dx * diff
                    node_ys[i] = node_ys[i] + dy * diff
                    node_xs[i + 1] = node_xs[i + 1] - dx * diff
                    node_ys[i + 1] = node_ys[i + 1] - dy * diff
                end
            end
        end
    end
end

function love.draw()
    for i = 1, num_nodes do
        love.graphics.circle("fill", node_xs[i], node_ys[i], 5.0)
    end
    for i = 1, num_nodes - 1 do
        for j = 0, 4 do
            local lt = j / 5.0
            local lx = node_xs[i] + (node_xs[i+1] - node_xs[i]) * lt
            local ly = node_ys[i] + (node_ys[i+1] - node_ys[i]) * lt
            love.graphics.circle("fill", lx, ly, 2.0)
        end
    end
    love.graphics.print("Arrows move anchor", 10.0, 10.0)
end