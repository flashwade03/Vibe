```lua
local paddle_x = 360
local paddle_y = 570
local paddle_w = 80
local paddle_h = 12
local paddle_speed = 300

local bx = 400
local by = 400
local vx = 200
local vy = -200
local br = 6

local brick_alive = {1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0}
local brick_x_pos = {5, 105, 205, 305, 405, 505, 605, 705}
local brick_y = 50
local brick_w = 90
local brick_h = 20

local score = 0
local game_over = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Breakout")
end

function love.update(dt)
    if game_over then return end

    if love.keyboard.isDown("left") then
        paddle_x = paddle_x - paddle_speed * dt
    end
    if love.keyboard.isDown("right") then
        paddle_x = paddle_x + paddle_speed * dt
    end

    bx = bx + vx * dt
    by = by + vy * dt

    if by < 6.0 then
        by = 6.0
        vy = -vy
    end

    if by >= 564.0 and bx >= paddle_x and bx <= paddle_x + 80.0 then
        if vy > 0 then
            vy = -vy
        end
    end

    if bx < 6.0 then
        bx = 6.0
        vx = -vx
    elseif bx > 794.0 then
        bx = 794.0
        vx = -vx
    end

    for i = 1, 8 do
        if brick_alive[i] == 1.0 then
            local b_x = brick_x_pos[i]
            if bx >= b_x and bx <= b_x + brick_w and by >= brick_y and by <= brick_y + brick_h then
                brick_alive[i] = 0.0
                vy = -vy
                score = score + 1
                break
            end
        end
    end

    if by > 600 then
        game_over = true
    end
end

function love.draw()
    love.graphics.rectangle("fill", paddle_x, paddle_y, paddle_w, paddle_h)
    
    love.graphics.circle("fill", bx, by, br)

    for