local paddle_x = 360
local paddle_speed = 300
local ball_x = 400
local ball_y = 400
local ball_radius = 6
local ball_vx = 200
local ball_vy = -200
local brick_width = 90
local brick_height = 20
local brick_alive = {1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0}
local score = 0
local game_over = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Breakout")
end

function love.update(dt)
    if love.keyboard.isDown("left") then
        paddle_x = paddle_x - paddle_speed * dt
    end
    if love.keyboard.isDown("right") then
        paddle_x = paddle_x + paddle_speed * dt
    end

    ball_x = ball_x + ball_vx * dt
    ball_y = ball_y + ball_vy * dt

    if ball_x < ball_radius or ball_x > 800 - ball_radius then
        ball_vx = -ball_vx
    end
    if ball_y < ball_radius then
        ball_vy = -ball_vy
    end

    if ball_y >= 564 and ball_x >= paddle_x and ball_x <= paddle_x + 80 then
        ball_vy = -ball_vy
    end

    for i = 0, 7 do
        if brick_alive[i + 1] == 1.0 then
            local brick_x = i * 100 + 5
            if ball_x > brick_x and ball_x < brick_x + brick_width and ball_y > 50 and ball_y < 50 + brick_height then
                brick_alive[i + 1] = 0.0
                ball_vy = -ball_vy
                score = score + 1
            end
        end
    end

    if ball_y > 600 then
        game_over = true
    end
end

function love.draw()
    love.graphics.rectangle("fill", paddle_x, 570, 80, 12)
    love.graphics.circle("fill", ball_x, ball_y, ball_radius)

    for i = 0, 7 do
        if brick_alive[i + 1] == 1.0 then
            local brick_x = i * 100 + 5
            love.graphics.rectangle("fill", brick_x, 50, brick_width, brick_height)
        end
    end

    love.graphics.print("Score: " .. score, 10, 10)

    if game_over then
        love.graphics.print("GAME OVER", 350, 300)
    end
end