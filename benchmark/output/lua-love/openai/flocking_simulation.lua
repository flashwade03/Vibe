local boid_xs = {}
local boid_ys = {}
local boid_vxs = {}
local boid_vys = {}
local num_boids = 15

function rand_float(min, max)
    return min + (max - min) * love.math.random()
end

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Boids Simulation")
    for i = 1, num_boids do
        table.insert(boid_xs, rand_float(0.0, 800.0))
        table.insert(boid_ys, rand_float(0.0, 600.0))
        table.insert(boid_vxs, rand_float(-50.0, 50.0))
        table.insert(boid_vys, rand_float(-50.0, 50.0))
    end
end

function love.update(dt)
    for i = 1, num_boids do
        local center_x = 0
        local center_y = 0

        for j = 1, num_boids do
            center_x = center_x + boid_xs[j]
            center_y = center_y + boid_ys[j]
        end

        center_x = center_x / num_boids
        center_y = center_y / num_boids

        -- Cohesion
        boid_vxs[i] = boid_vxs[i] + (center_x - boid_xs[i]) * 0.5 * dt
        boid_vys[i] = boid_vys[i] + (center_y - boid_ys[i]) * 0.5 * dt

        -- Separation
        for j = 1, num_boids do
            if i ~= j then
                local dx = boid_xs[i] - boid_xs[j]
                local dy = boid_ys[i] - boid_ys[j]
                local distance = math.sqrt(dx * dx + dy * dy)
                if distance < 30.0 then
                    boid_vxs[i] = boid_vxs[i] + (dx / distance) * 100.0 * dt
                    boid_vys[i] = boid_vys[i] + (dy / distance) * 100.0 * dt
                end
            end
        end

        -- Clamp speed
        local speed = math.sqrt(boid_vxs[i] * boid_vxs[i] + boid_vys[i] * boid_vys[i])
        if speed > 150.0 then
            boid_vxs[i] = boid_vxs[i] / speed * 150.0
            boid_vys[i] = boid_vys[i] / speed * 150.0
        end

        -- Update positions
        boid_xs[i] = boid_xs[i] + boid_vxs[i] * dt
        boid_ys[i] = boid_ys[i] + boid_vys[i] * dt

        -- Wrap around screen edges
        if boid_xs[i] < 0 then boid_xs[i] = 800 end
        if boid_xs[i] > 800 then boid_xs[i] = 0 end
        if boid_ys[i] < 0 then boid_ys[i] = 600 end
        if boid_ys[i] > 600 then boid_ys[i] = 0 end
    end
end

function love.draw()
    for i = 1, num_boids do
        love.graphics.rectangle("fill", boid_xs[i], boid_ys[i], 4, 4)
    end
end