local boid_xs = {}
local boid_ys = {}
local boid_vxs = {}
local boid_vys = {}
local num_boids = 15

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Boids Simulation")
    
    for i = 1, num_boids do
        table.insert(boid_xs, love.math.random(0, 800))
        table.insert(boid_ys, love.math.random(0, 600))
        table.insert(boid_vxs, love.math.random(-50, 50))
        table.insert(boid_vys, love.math.random(-50, 50))
    end
end

function love.update(dt)
    local sum_x, sum_y = 0, 0
    for i = 1, num_boids do
        sum_x = sum_x + boid_xs[i]
        sum_y = sum_y + boid_ys[i]
    end
    local center_x, center_y = sum_x / num_boids, sum_y / num_boids

    for i = 1, num_boids do
        -- Cohesion
        boid_vxs[i] = boid_vxs[i] + (center_x - boid_xs[i]) * 0.5 * dt
        boid_vys[i] = boid_vys[i] + (center_y - boid_ys[i]) * 0.5 * dt

        -- Separation
        for j = 1, num_boids do
            if i ~= j then
                local dx = boid_xs[i] - boid_xs[j]
                local dy = boid_ys[i] - boid_ys[j]
                local dist = math.sqrt(dx * dx + dy * dy)
                if dist < 30.0 and dist > 0 then
                    boid_vxs[i] = boid_vxs[i] + (dx / dist) * 100.0 * dt
                    boid_vys[i] = boid_vys[i] + (dy / dist) * 100.0 * dt
                end
            end
        end

        -- Clamp speed
        local speed = math.sqrt(boid_vxs[i] * boid_vxs[i] + boid_vys[i] * boid_vys[i])
        if speed > 150.0 then
            boid_vxs[i] = (boid_vxs[i] / speed) * 150.0
            boid_vys[i] = (boid_vys[i] / speed) * 150.0
        end

        -- Update position
        boid_xs[i] = boid_xs[i] + boid_vxs[i] * dt
        boid_ys[i] = boid_ys[i] + boid_vys[i] * dt

        -- Wrap around
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