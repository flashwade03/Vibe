local orb_angles = {0.0, 2.094, 4.189}
local orb_radii = {100.0, 160.0, 220.0}
local orb_speeds = {1.5, 1.0, 0.6}
local center_x = 400.0
local center_y = 300.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Orbit Simulation")
end

function love.update(dt)
    for i = 1, 3 do
        orb_angles[i] = orb_angles[i] + orb_speeds[i] * dt
    end
end

function love.draw()
    -- Draw the sun
    love.graphics.circle("fill", center_x, center_y, 20)
    
    for i = 1, 3 do
        -- Draw the orbit paths
        for j = 0, 35 do
            local angle = j * 0.1745
            local px = center_x + math.cos(angle) * orb_radii[i]
            local py = center_y + math.sin(angle) * orb_radii[i]
            love.graphics.circle("fill", px, py, 1.0)
        end
        
        -- Draw the orbiting body
        local bx = center_x + math.cos(orb_angles[i]) * orb_radii[i]
        local by = center_y + math.sin(orb_angles[i]) * orb_radii[i]
        love.graphics.circle("fill", bx, by, 10)
    end
    
    -- Show current angle of the first body
    love.graphics.print("Angle: " .. tostring(orb_angles[1]), 10, 10)
end