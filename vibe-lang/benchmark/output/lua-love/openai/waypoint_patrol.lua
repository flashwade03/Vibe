local wp_xs = {100.0, 700.0, 700.0, 100.0}
local wp_ys = {100.0, 100.0, 500.0, 500.0}
local patrol_x = 100.0
local patrol_y = 100.0
local current_wp = 1
local patrol_speed = 120.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Patrol Enemy")
end

function love.update(dt)
    local dx = wp_xs[current_wp] - patrol_x
    local dy = wp_ys[current_wp] - patrol_y
    local dist = math.sqrt(dx * dx + dy * dy)

    if dist > 2.0 then
        patrol_x = patrol_x + (dx / dist) * patrol_speed * dt
        patrol_y = patrol_y + (dy / dist) * patrol_speed * dt
    else
        current_wp = current_wp + 1
        if current_wp > 4 then
            current_wp = 1
        end
    end
end

function love.draw()
    -- Draw enemy
    love.graphics.rectangle("fill", patrol_x - 12.0, patrol_y - 12.0, 24, 24)

    -- Draw waypoints
    for i = 1, #wp_xs do
        love.graphics.rectangle("fill", wp_xs[i] - 4.0, wp_ys[i] - 4.0, 8, 8)
    end

    -- Display current waypoint
    love.graphics.print("Waypoint: " .. tostring(current_wp), 10.0, 10.0)
end