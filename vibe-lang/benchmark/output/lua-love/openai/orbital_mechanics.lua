local orb_angles = {0.0, 2.094, 4.189}
local orb_radii = {100.0, 160.0, 220.0}
local orb_speeds = {1.5, 1.0, 0.6}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Orbiting Bodies Simulation")
end

function love.update(dt)
    for i = 1, 3 do
        orb_angles[i] = orb_angles[i] + orb_speeds[i] * dt
    end
end

function love.draw()
    -- Draw the sun
    love.graphics.setColor(1, 1, 0)
    love.graphics.circle("fill", 400, 300, 20)

    -- Draw orbiting bodies and their paths
    for i = 1, 3 do
        -- Draw orbit path
        love.graphics.setColor(0.5, 0.5, 0.5)
        for j = 0, 35 do
            local angle = j * 0.1745
            local px = 400.0 + math.cos(angle) * orb_radii[i]
            local py = 300.0 + math.sin(angle) * orb_radii[i]
            love.graphics.circle("fill", px, py, 1.0)
        end

        -- Calculate and draw the orbiting body
        local x = 400.0 + math.cos(orb_angles[i]) * orb_radii[i]
        local y = 300.0 + math.sin(orb_angles[i]) * orb_radii[i]
        love.graphics.setColor(1, 1, 1)
        love.graphics.circle("fill", x, y, 10)
    end

    -- Display the current angle of body 0
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Angle: " .. string.format("%.2f", orb_angles[1]), 10, 10)
end