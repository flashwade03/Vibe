local cp_xs = {100.0, 250.0, 550.0, 700.0}
local cp_ys = {500.0, 100.0, 100.0, 500.0}
local selected = 0
local speed = 150.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Bezier Curve")
end

function love.keypressed(k)
    if k == "1" then selected = 0 end
    if k == "2" then selected = 1 end
    if k == "3" then selected = 2 end
    if k == "4" then selected = 3 end
end

function love.update(dt)
    if love.keyboard.isDown("left") then cp_xs[selected + 1] = cp_xs[selected + 1] - speed * dt end
    if love.keyboard.isDown("right") then cp_xs[selected + 1] = cp_xs[selected + 1] + speed * dt end
    if love.keyboard.isDown("up") then cp_ys[selected + 1] = cp_ys[selected + 1] - speed * dt end
    if love.keyboard.isDown("down") then cp_ys[selected + 1] = cp_ys[selected + 1] + speed * dt end
end

function love.draw()
    -- Draw curve
    love.graphics.setColor(1, 1, 1)
    for i = 0, 50 do
        local t = i / 50.0
        local u = 1.0 - t
        local bx = u * u * u * cp_xs[1] + 3.0 * u * u * t * cp_xs[2] + 3.0 * u * t * t * cp_xs[3] + t * t * t * cp_xs[4]
        local by = u * u * u * cp_ys[1] + 3.0 * u * u * t * cp_ys[2] + 3.0 * u * t * t * cp_ys[3] + t * t * t * cp_ys[4]
        love.graphics.circle("fill", bx, by, 2.0)
    end

    -- Draw control polygon
    love.graphics.setColor(0.5, 0.5, 0.5)
    for i = 1, 3 do
        for j = 0, 10 do
            local lt = j / 10.0
            local lx = cp_xs[i] + (cp_xs[i + 1] - cp_xs[i]) * lt
            local ly = cp_ys[i] + (cp_ys[i + 1] - cp_ys[i]) * lt
            love.graphics.circle("fill", lx, ly, 1.0)
        end
    end

    -- Draw control points
    for i = 1, 4 do
        if (i - 1) == selected then love.graphics.setColor(1, 0, 0) else love.graphics.setColor(0, 1, 0) end
        love.graphics.circle("fill", cp_xs[i], cp_ys[i], 8.0)
    end

    -- Draw UI
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Point: " .. (selected + 1), 10, 10)
    love.graphics.print("Keys 1-4 select, arrows move", 10, 30)
end