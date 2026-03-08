local particle_xs = {}
local particle_ys = {}
local particle_vxs = {}
local particle_vys = {}
local particle_lifes = {}

local function rand_float(min, max)
    return min + love.math.random() * (max - min)
end

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Particle Burst")
end

function love.mousepressed(mx, my, button)
    -- Create 10 particles at the click position
    for i = 1, 10 do
        local angle = rand_float(0.0, 6.283)
        local speed = rand_float(50.0, 200.0)
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
    -- Update each particle and remove dead ones
    for i = #particle_lifes, 1, -1 do
        particle_xs[i] = particle_xs[i] + particle_vxs[i] * dt
        particle_ys[i] = particle_ys[i] + particle_vys[i] * dt
        particle_lifes[i] = particle_lifes[i] - dt
        
        -- Cleanup dead particles
        if particle_lifes[i] <= 0 then
            table.remove(particle_xs, i)
            table.remove(particle_ys, i)
            table.remove(particle_vxs, i)
            table.remove(particle_vys, i)
            table.remove(particle_lifes, i)
        end
    end