```lua
local state = 0
local score = 0
local timer = 10.0
local target_x = 0
local target_y = 0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Target Clicker")
end

function love.update(dt)
    if state == 1 then
        timer = timer - dt
        if timer <= 0.0 then
            timer = 0.0
            state = 2
        end
    end
end

function love.draw()
    if state == 0 then
        love.graphics.print("Press SPACE to Start", 250, 280)
    elseif state == 1 then
        love.graphics.rectangle("fill", target_x, target_y, 20, 20)
        love.graphics.print("Score: " .. score, 10, 10)
        love.graphics.print("Timer: " .. string.format("%.2f", timer), 10, 30)
    elseif state == 2