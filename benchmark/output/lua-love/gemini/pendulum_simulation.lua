local pivot_x = 400.0
local pivot_y = 100.0
local angle = 1.0
local angular_vel = 0.0
local length = 250.0
local gravity = 9.8

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Pendulum Simulation")
end

function love.update(dt)
    local angular_acc = (0.0 - gravity / length) * math.sin(angle)
    angular_vel = angular_vel + angular_acc * dt
    angular_vel = angular_vel * 0.999
    angle = angle + angular_vel * dt
end

function love.draw()
    local bob_x = pivot_x + math.sin(angle) * length
    local bob_y = pivot_y + math.cos(angle) * length

    -- Draw pivot
    love.graphics.circle("fill", pivot_x, pivot_y, 5.0)

    -- Draw rod
    for i = 0, 19 do
        local t = i / 20.0
        local rx = pivot_x + math.sin(angle) * length * t
        local ry = pivot_y + math.cos(angle) * length * t
        love.graphics.rectangle("fill", rx, ry, 2.0, 2.0)
    end

    -- Draw bob
    love.graphics.circle("fill", bob_x, bob_y, 15.0)

    -- UI
    love.graphics.print("Angle: " .. tostring(angle), 10, 10)
    love.graphics.print("Click to push", 10, 30)
end

function love.mousepressed(mx, my, button)
    if button == 1 then
        angular_vel = angular_vel + 0.5
    end
end