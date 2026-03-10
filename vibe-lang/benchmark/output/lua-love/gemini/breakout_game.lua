local paddle_x = 360
local paddle_speed = 300
local ball_x = 400
local ball_y = 400
local ball_vx = 200
local ball_vy = -200
local ball_radius = 6
local brick_alive = {1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0}
local score = 0
local game_over = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Breakout")
end

function love.update(dt)
    if game_over then return end

    -- Paddle movement
    if love.keyboard.isDown("left") and paddle_x > 0 then
        paddle_x = paddle_x - paddle_speed * dt
    end
    if love.keyboard.isDown("right") and paddle_x < 720 then
        paddle_x = paddle_x + paddle_speed * dt
    end

    -- Ball movement
    ball_x = ball_x + ball_vx * dt
    ball_y = ball_y + ball_vy * dt

    -- Wall collisions
    if ball_x < ball_radius or ball_x > 800 - ball_radius then
        ball_vx = -ball_vx
    end
    if ball_y < ball_radius then
        ball_vy = -ball_vy
    end

    -- Paddle collision
    if ball_y >= 564 and ball_y <= 576 and ball_x >= paddle_x and ball_x <= paddle_x + 80 then
        ball_vy = -math.abs(ball_vy)
    end

    -- Brick collisions
    for i = 1, 8 do
        if brick_alive[i] == 1.0 then
            local bx = (i - 1) * 100 + 5
            local by = 50
            if ball_x >= bx and ball_x <= bx + 90 and ball_y >= by and ball_y <= by + 20 then
                brick_alive[i] = 0.0
                ball_vy = -ball_vy
                score = score + 1
            end
        end
    end

    -- Game over
    if ball_y > 600 then
        game_over = true
    end
end

function love.draw()
    love.graphics.print("Score: " .. score, 10, 10)
    
    -- Draw paddle
    love.graphics.rectangle("fill", paddle_x, 570, 80, 12)
    
    -- Draw ball
    love.graphics.circle("fill", ball_x, ball_y, ball_radius)
    
    -- Draw bricks
    for i = 1, 8 do
        if brick_alive[i] == 1.0 then
            love.graphics.rectangle("fill", (i - 1) * 100 + 5, 50, 90, 20)
        end
    end
    
    if game_over then
        love.graphics.print("GAME OVER", 370, 300)
    end
end