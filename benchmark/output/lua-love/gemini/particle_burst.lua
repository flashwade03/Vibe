local particle_xs = {}
local particle_ys = {}
local particle_vxs = {}
local particle_vys = {}
local particle_lifes = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Particle Burst")
end

function love.mousepressed(mx, my, button)
    for i = 1, 10 do
        local angle = love.math.random() * 6.283
        local speed = 50.0 + love.math.random() * 150.0
        local vx = math.cos(angle) * speed
        local vy = math.sin(angle) * speed
        
        table.insert(particle_xs, mx)
        table.insert(particle_ys, my)
        table.insert(particle_vxs, vx)
        table.insert(particle_vys, vy)
        table.insert(particle_lifes, 2.0)
    end
end

function love.update(dt)
    for i = 1, #particle_lifes do
        if particle_lifes[i] > 0.0 then
            particle_xs[i] = particle_xs[i] + particle_vxs[i] * dt
            particle_ys[i] = particle_ys[i] + particle_vys[i] * dt
            particle_lifes[i] = particle_lifes[i] - dt
        end
    end
end

function love.draw()
    for i = 1, #particle_lifes do
        if particle_lifes[i] > 0.0 then
            love.graphics.rectangle("fill", particle_xs[i], particle_ys[i], 4, 4)
        end
    end
end