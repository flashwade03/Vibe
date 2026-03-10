local heights = {}
local scroll_timer = 0.0
local scroll_speed = 60.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Procedural 1D Terrain")
    local h = 300.0
    for i = 0, 79 do
        h = h + love.math.random(-30, 30)
        if h < 100.0 then h = 100.0 end
        if h > 500.0 then h = 500.0 end
        table.insert(heights, h)
    end
end

function love.update(dt)
    scroll_timer = scroll_timer + scroll_speed * dt
    if scroll_timer >= 10.0 then
        scroll_timer = scroll_timer - 10.0
        for i = 1, 79 do
            heights[i] = heights[i + 1]
        end
        local new_h = heights[79] + love.math.random(-30, 30)
        if new_h < 100.0 then new_h = 100.0 end
        if new_h > 500.0 then new_h = 500.0 end
        heights[80] = new_h
    end

    if love.keyboard.isDown("up") then
        scroll_speed = scroll_speed + 50.0 * dt
    end
    if love.keyboard.isDown("down") then
        scroll_speed = scroll_speed - 50.0 * dt
    end
    if scroll_speed < 20.0 then scroll_speed = 20.0 end
    if scroll_speed > 200.0 then scroll_speed = 200.0 end
end

function love.draw()
    for i = 0, 79 do
        love.graphics.rectangle("fill", i * 10.0, heights[i + 1], 10.0, 600.0 - heights[i + 1])
    end
    local player_col = 20
    love.graphics.rectangle("fill", player_col * 10.0 - 1.0, heights[player_col + 1] - 14.0, 12.0, 14.0)
    love.graphics.print("Height: " .. tostring(math.floor(heights[21])), 10.0, 10.0)
    love.graphics.print("Speed: " .. tostring(math.floor(scroll_speed)), 10.0, 30.0)
end