local shake_x = 0.0
local shake_y = 0.0
local shake_timer = 0.0
local shake_intensity = 0.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Screen Shake Effect")
end

function love.keypressed(key)
    if key == "space" then
        shake_timer = 0.5
        shake_intensity = 15.0
    end
end

function love.update(dt)
    if shake_timer > 0.0 then
        shake_timer = shake_timer - dt
        shake_x = love.math.random(-shake_intensity, shake_intensity)
        shake_y = love.math.random(-shake_intensity, shake_intensity)
        shake_intensity = shake_intensity - (20.0 * dt)
    else
        shake_x = 0.0
        shake_y = 0.0
    end
end

function love.draw()
    -- Center rectangle
    love.graphics.rectangle("fill", 368.0 + shake_x, 268.0 + shake_y, 64.0, 64.0)
    
    -- Corner markers
    love.graphics.rectangle("fill", 50.0 + shake_x, 50.0 + shake_y, 16.0, 16.0)
    love.graphics.rectangle("fill", 734.0 + shake_x, 50.0 + shake_y, 16.0, 16.0)
    love.graphics.rectangle("fill", 50.0 + shake_x, 534.0 + shake_y, 16.0, 16.0)
    love.graphics.rectangle("fill", 734.0 + shake_x, 534.0 + shake_y, 16.0, 16.0)
    
    -- Text
    love.graphics.print("Press SPACE to shake", 280.0 + shake_x, 550.0 + shake_y)
end