local cp_xs = {100.0, 250.0, 550.0, 700.0}
local cp_ys = {500.0, 100.0, 100.0, 500.0}
local selected = 0
local speed = 150.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Interactive Cubic Bezier Curve")
end

function love.update(dt)
    if love.keyboard.isDown("left") then
        cp_xs[selected + 1] = cp_xs[selected + 1] - speed * dt
    end
    if love.keyboard.isDown("right") then
        cp_xs[selected + 1] = cp_xs[selected + 1] + speed * dt
    end
    if love.keyboard.isDown("up") then
        cp_ys[selected + 1] = cp_ys[selected + 1] - speed * dt
    end
    if love.keyboard.isDown("down") then
        cp_ys[selected + 1] = cp_ys[selected + 1] + speed * dt
    end
end

function love.keypressed(key)
    if key == "1" then
        selected = 0
    elseif key == "2" then
        selected = 1
    elseif key == "3" then
        selected = 2
    elseif key == "4" then
        selected = 3
    end
end

function love.draw()
    -- Draw the Bezier curve
    for i = 0, 50 do
        local t = i / 50.0
        local u = 1.0 - t
        local bx = u * u * u * cp_xs[1] + 3.0 * u * u * t * cp_xs[2] + 3.0 * u * t * t * cp_xs[3] + t * t * t * cp_xs[4]
        local by = u * u * u * cp_ys[1] + 3.0 * u * u * t * cp_ys[2] + 3.0 * u * t * t * cp_ys[3] + t * t * t * cp_ys[4]
        love.graphics.circle("fill", bx, by, 2.0)
    end

    -- Draw control points
    for i = 1, 4 do
        love.graphics.circle("fill", cp_xs[i], cp_ys[i], 8.0)
    end

    -- Draw control polygon
    for i = 1, 3 do
        for j = 0, 10 do
            local lt = j / 10.0
            local lx = cp_xs[i] + (cp_xs[i + 1] - cp_xs[i]) * lt
            local ly = cp_ys[i] + (cp_ys[i + 1] - cp_ys[i]) * lt
            love.graphics.circle("fill", lx, ly, 1.0)
        end
    end

    -- Draw text
    love.graphics.print("Point: " .. tostring(selected + 1), 10, 10)
    love.graphics.print("Keys 1-4 select, arrows move", 10, 30)
end