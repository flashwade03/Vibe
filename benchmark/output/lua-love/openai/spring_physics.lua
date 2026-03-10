local mass_xs = {}
local mass_ys = {}
local mass_vxs = {}
local mass_vys = {}

local rest_length = 100.0
local spring_k = 150.0
local damping = 0.95
local speed = 200.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Mass-Spring Simulation")
    for i = 0, 4 do
        table.insert(mass_xs, 200.0 + i * 100.0)
        table.insert(mass_ys, 300.0)
        table.insert(mass_vxs, 0.0)
        table.insert(mass_vys, 0.0)
    end
end

function love.update(dt)
    -- Move mass 0 with arrow keys
    if love.keyboard.isDown("left") then
        mass_xs[1] = mass_xs[1] - speed * dt
    end
    if love.keyboard.isDown("right") then
        mass_xs[1] = mass_xs[1] + speed * dt
    end
    if love.keyboard.isDown("up") then
        mass_ys[1] = mass_ys[1] - speed * dt
    end
    if love.keyboard.isDown("down") then
        mass_ys[1] = mass_ys[1] + speed * dt
    end

    mass_vxs[1] = 0.0
    mass_vys[1] = 0.0

    for i = 1, 4 do
        local dx = mass_xs[i + 1] - mass_xs[i]
        local dy = mass_ys[i + 1] - mass_ys[i]
        local dist = math.sqrt(dx * dx + dy * dy)
        if dist > 0.1 then
            local force = (dist - rest_length) * spring_k
            local fx = (dx / dist) * force
            local fy = (dy / dist) * force
            if i > 1 then
                mass_vxs[i] = mass_vxs[i] + fx * dt
                mass_vys[i] = mass_vys[i] + fy * dt
            end
            mass_vxs[i + 1] = mass_vxs[i + 1] - fx * dt
            mass_vys[i + 1] = mass_vys[i + 1] - fy * dt
        end
    end

    for i = 2, 5 do
        mass_vys[i] = mass_vys[i] + 200.0 * dt
        mass_xs[i] = mass_xs[i] + mass_vxs[i] * dt
        mass_ys[i] = mass_ys[i] + mass_vys[i] * dt
        mass_vxs[i] = mass_vxs[i] * damping
        mass_vys[i] = mass_vys[i] * damping
    end
end

function love.draw()
    for i = 1, 5 do
        love.graphics.circle("fill", mass_xs[i], mass_ys[i], 10.0)
    end

    for i = 1, 4 do
        for j = 0, 7 do
            local lt = j / 8.0
            love.graphics.circle("fill", mass_xs[i] + (mass_xs[i + 1] - mass_xs[i]) * lt, mass_ys[i] + (mass_ys[i + 1] - mass_ys[i]) * lt, 2.0)
        end
    end

    love.graphics.print("Arrows move anchor", 10.0, 10.0)
end