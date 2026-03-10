local boid_xs = {}
local boid_ys = {}
local boid_vxs = {}
local boid_vys = {}
local num_boids = 15

local function rand_float(min, max)
    return min + love.math.random() * (max - min)
end

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Boids Flocking")
    
    for i = 1, num_boids do
        boid_xs[i] = rand_float(0.0, 800.0)
        boid_ys[i] = rand_float(0.0, 600.0)
        boid_vxs[i] = rand_float(-50.0, 50.0)
        boid_vys[i] = rand_float(-50.0, 50.0)
    end
end

function love.update(dt)
    for i = 1, num_boids do
        -- Compute center of mass of ALL boids
        local sum_x = 0
        local sum_y = 0
        for j = 1, num_boids do
            sum_x = sum_x + boid_xs[j]
            sum_y = sum_y + boid_ys[j]
        end
        local center_x = sum_x / num_boids
        local center_y = sum_y / num_boids

        -- Apply cohesion
        boid_vxs[i] = boid_vxs[i] + (center_x - boid_xs[i]) * 0.5 * dt
        boid_vys[i] = boid_vys[i] + (center_y - boid_ys[i]) * 0.5 * dt

        -- Apply separation
        for j = 1, num_boids do
            if i ~= j then
                local dx = boid_xs[i] - boid_xs[j]
                local dy = boid_ys[i] - boid_ys[j]
                local dist = math.sqrt(dx * dx + dy * dy)
                
                if dist > 0 and dist < 30.0 then
                    local repulse_x = dx / dist
                    local repulse_y = dy / dist
                    boid_vxs[i] = boid_vxs[i] + repulse_x * 100.0 * dt
                    boid_vys[i] = boid_vys[i] + repulse_y * 100.0 * dt
                end
            end
        end

        -- Clamp speed
        local speed = math.sqrt(boid_vxs[i] * boid_vxs[i] + boid_vys[i] * boid_vys[i])
        if speed > 150.0 then
            boid_vxs[i] = (boid_vxs[i] / speed) * 150.0
            boid_vys[i] = (boid_vys[i] / speed) * 150.0
        end

        -- Update positions
        boid_xs[i] = boid_xs[i] + boid_vxs[i] * dt
        boid_ys[i] = boid_ys[i] + boid_vys[i] * dt

        -- Wrap around screen edges
        if boid_xs[i] < 0 then
            boid_xs[i] = boid_xs[i] + 800.0
        elseif boid_xs[i] > 800.0 then
            boid_xs[i] = boid_xs[i] - 800.0
        end
        
        if boid_ys[i] < 0 then
            boid_ys[i] = boid_ys[i] + 600.0
        elseif boid_ys[i] > 600.0 then
            boid_ys[i] = boid_ys[i] - 600.0
        end
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    for i = 1, num_boids do
        love.graphics.rectangle("fill", boid_xs[i] - 2, boid_ys[i] - 2, 4, 4)
    end
end