```lua
local boid_xs = {}
local boid_ys = {}
local boid_vxs = {}
local boid_vys = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Boids Flocking")
    
    for i = 1, 15 do
        table.insert(boid_xs, love.math.random() * 800.0)
        table.insert(boid_ys, love.math.random() * 600.0)
        table.insert(boid_vxs, love.math.random() * 100.0 - 50.0)
        table.insert(boid_vys, love.math.random() * 100.0 - 50.0)
    end
end

function love.update(dt)
    for i = 1, 15 do
        -- Compute center of mass of ALL boids
        local sum_x = 0.0
        local sum_y = 0.0
        for j = 1, 15 do
            sum_x = sum_x + boid_xs[j]
            sum_y = sum_y + boid_ys[j]
        end
        local center_x = sum_x / 15.0
        local center_y = sum_y /