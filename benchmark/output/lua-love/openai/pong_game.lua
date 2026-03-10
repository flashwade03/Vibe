local p1_y = 260.0
local p2_y = 260.0
local ball_x = 400.0
local ball_y = 300.0
local ball_vx = 250.0
local ball_vy = 150.0
local score1 = 0
local score2 = 0
local paddle_speed = 300.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("2-Player Pong")
end

function love.update(dt)
    -- Move left paddle
    if love.keyboard.isDown("w") then
        p1_y = p1_y - paddle_speed * dt
    end
    if love.keyboard.isDown("s") then
        p1_y = p1_y + paddle_speed * dt
    end
    p1_y = math.max(0, math.min(520, p1_y))

    -- Move right paddle
    if love.keyboard.isDown("up") then
        p2_y = p2_y - paddle_speed * dt
    end
    if love.keyboard.isDown("down") then
        p2_y = p2_y + paddle_speed * dt
    end
    p2_y = math.max(0, math.min(520, p2_y))

    -- Move ball
    ball_x = ball_x + ball_vx * dt
    ball_y = ball_y + ball_vy * dt

    -- Ball collision with top and bottom
    if ball_y < 8.0 then
        ball_vy = -ball_vy
        ball_y = 8.0
    elseif ball_y > 592.0 then
        ball_vy = -ball_vy
        ball_y = 592.0
    end

    -- Ball collision with left paddle
    if ball_x - 8.0 <= 42.0 and ball_x > 30.0 and ball_y >= p1_y and ball_y <= p1_y + 80.0 then
        ball_vx = -ball_vx
        ball_x = 50.0
    end

    -- Ball collision with right paddle
    if ball_x + 8.0 >= 758.0 and ball_x < 770.0 and ball_y >= p2_y and ball_y <= p2_y + 80.0 then
        ball_vx = -ball_vx
        ball_x = 750.0
    end

    -- Ball out of bounds
    if ball_x < 0.0 then
        score2 = score2 + 1
        ball_x = 400.0
        ball_y = 300.0
        ball_vx = 250.0
        ball_vy = 150.0
    elseif ball_x > 800.0 then
        score1 = score1 + 1
        ball_x = 400.0
        ball_y = 300.0
        ball_vx = -250.0
        ball_vy = -150.0
    end
end

function love.draw()
    -- Draw paddles
    love.graphics.rectangle("fill", 30.0, p1_y, 12.0, 80.0)
    love.graphics.rectangle("fill", 758.0, p2_y, 12.0, 80.0)

    -- Draw ball
    love.graphics.circle("fill", ball_x, ball_y, 8.0)

    -- Draw center line
    for i = 0, 29 do
        love.graphics.rectangle("fill", 398.0, i * 20.0, 4.0, 10.0)
    end

    -- Draw scores
    love.graphics.print(tostring(score1), 300.0, 20.0)
    love.graphics.print(tostring(score2), 480.0, 20.0)
end