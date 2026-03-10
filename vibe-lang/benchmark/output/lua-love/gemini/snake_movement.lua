local snake_xs = {400, 380, 360}
local snake_ys = {300, 300, 300}
local dir_x = 1.0
local dir_y = 0.0
local move_timer = 0.15
local speed_interval = 0.15

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Snake")
end

function love.update(dt)
    move_timer = move_timer - dt
    if move_timer <= 0 then
        move_timer = speed_interval
        
        local new_x = snake_xs[1] + dir_x * 20.0
        local new_y = snake_ys[1] + dir_y * 20.0
        
        -- Wrap positions
        if new_x >= 800 then new_x = 0 end
        if new_x < 0 then new_x = 780 end
        if new_y >= 600 then new_y = 0 end
        if new_y < 0 then new_y = 580 end
        
        -- Shift segments
        for i = #snake_xs, 2, -1 do
            snake_xs[i] = snake_xs[i-1]
            snake_ys[i] = snake_ys[i-1]
        end
        
        snake_xs[1] = new_x
        snake_ys[1] = new_y
    end
end

function love.keypressed(key)
    if key == "right" and dir_x ~= -1 then
        dir_x, dir_y = 1.0, 0.0
    elseif key == "left" and dir_x ~= 1 then
        dir_x, dir_y = -1.0, 0.0
    elseif key == "up" and dir_y ~= 1 then
        dir_x, dir_y = 0.0, -1.0
    elseif key == "down" and dir_y ~= -1 then
        dir_x, dir_y = 0.0, 1.0
    end
end

function love.draw()
    love.graphics.setColor(0, 1, 0)
    for i = 1, #snake_xs do
        love.graphics.rectangle("fill", snake_xs[i] + 1, snake_ys[i] + 1, 18, 18)
    end
    love.graphics.setColor(1, 1, 1)
end