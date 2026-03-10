local angle = 1.0
local angular_vel = 0.0
local length = 250.0
local gravity = 9.8

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Simple Pendulum")
end

function love.update(dt)
    local angular_acc = (0.0 - gravity / length) * math.sin(angle)
    angular_vel = angular_vel + angular_acc * dt
    angular_vel = angular_vel * 0.999
    angle = angle + angular_vel * dt
end

function love.draw()
    local bob_x = 400.0 + math.sin(angle) * length
    local bob_y = 100.0 + math.cos(angle) * length

    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", 400.0, 100.0, 5.0)

    for i = 0, 19 do
        local t = i / 20.0
        local rx = 400.0 + math.sin(angle) * length * t
        local ry = 100.0 + math.cos(angle) * length * t
        love.graphics.rectangle("fill", rx, ry, 2.0, 2.0)
    end

    love.graphics.circle("fill", bob_x, bob_y, 15.0)

    love.graphics.print("Angle: " .. string.format("%.2f", angle), 10.0, 10.0)
    love.graphics.print("Click to push", 10.0, 30.0)
end

function love.mousepressed(mx, my, button)
    if button == 1 then
        angular_vel = angular_vel + 0.5
    end
end