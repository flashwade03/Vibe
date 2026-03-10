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
    if button == 1 then
        for i = 1, 10 do
            local angle = love.math.random() * 6.283
            local speed = love.math.random(50, 200)
            
            table.insert(particle_xs, mx)
            table.insert(particle_ys, my)
            table.insert(particle_vxs, math.cos(angle) * speed)
            table.insert(particle_vys, math.sin(angle) * speed)
            table.insert(particle_lifes, 2.0)
        end
    end
end

function love.update(dt)
    for i = #particle_lifes, 1, -1 do
        particle_lifes[i] = particle_lifes[i] - dt
        
        if particle_lifes[i] <= 0 then
            table.remove(particle_xs, i)
            table.remove(particle_ys, i)
            table.remove(particle_vxs, i)
            table.remove(particle_vys, i)
            table.remove(particle_lifes, i)
        else
            particle_xs[i] = particle_xs[i] + particle_vxs[i] * dt
            particle_ys[i] = particle_ys[i] + particle_vys[i] * dt
        end
    end
end

function love.draw()
    for i = 1, #particle_lifes do
        if particle_lifes[i] > 0 then
            love.graphics.rectangle("fill", particle_xs[i], particle_ys[i], 4, 4)
        end
    end
end