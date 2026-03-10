local orb_angles = {0.0, 2.094, 4.189}
local orb_radii = {100.0, 160.0, 220.0}
local orb_speeds = {1.5, 1.0, 0.6}
local center_x = 400
local center_y = 300

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Orbiting Bodies")
end

function love.update(dt)
    for i = 1, 3 do
        orb_angles[i] = orb_angles[i] + orb_speeds[i] * dt
    end
end

function love.draw()
    -- Draw Sun
    love.graphics.setColor(1, 1, 0)
    love.graphics.circle("fill", center_x, center_y, 20)

    -- Draw Orbits and Bodies
    for i = 1, 3 do
        -- Draw orbit path
        love.graphics.setColor(0.5, 0.5, 0.5)
        for j = 0, 35 do
            local angle = j * 0.1745
            local px = center_x + math.cos(angle) * orb_radii[i]
            local py = center_y + math.sin(angle) * orb_radii[i]
            love.graphics.circle("fill", px, py, 1.0)
        end

        -- Draw body
        local bx = center_x + math.cos(orb_angles[i]) * orb_radii[i]
        local by = center_y + math.sin(orb_angles[i]) * orb_radii[i]
        love.graphics.setColor(0, 0.7, 1)
        love.graphics.circle("fill", bx, by, 10)
    end

    -- Draw text
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Angle: " .. tostring(orb_angles[1]), 10, 10)
end