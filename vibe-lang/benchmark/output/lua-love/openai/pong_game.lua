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
        p1_y = math.max(0, p1_y - paddle_speed * dt)
    end
    if love.keyboard.isDown("s") then
        p1_y = math.min(520, p1_y + paddle_speed * dt)
    end

    -- Move right paddle
    if love.keyboard.isDown("up") then
        p2_y = math.max(0, p2_y - paddle_speed * dt)
    end
    if love.keyboard.isDown("down") then
        p2_y = math.min(520, p2_y + paddle_speed * dt)
    end

    -- Move ball
    ball_x = ball_x + ball_vx * dt
    ball_y = ball_y + ball_vy * dt

    -- Ball collision with top and bottom
    if ball_y < 8 then
        ball_vy = -ball_vy
        ball_y = 8
    elseif ball_y > 592 then
        ball_vy = -ball_vy
        ball_y = 592
    end

    -- Ball collision with left paddle
    if ball_x - 8 <= 42 and ball_x > 30 and ball_y >= p1_y and ball_y <= p1_y + 80 then
        ball_vx = -ball_vx
        ball_x = 50
    end

    -- Ball collision with right paddle
    if ball_x + 8 >= 758 and ball_x < 770 and ball_y >= p2_y and ball_y <= p2_y + 80 then
        ball_vx = -ball_vx
        ball_x = 750
    end

    -- Ball out of bounds
    if ball_x < 0 then
        score2 = score2 + 1
        ball_x = 400
        ball_y = 300
        ball_vx = 250
        ball_vy = 150
    elseif ball_x > 800 then
        score1 = score1 + 1
        ball_x = 400
        ball_y = 300
        ball_vx = -250
        ball_vy = -150
    end
end

function love.draw()
    -- Draw paddles
    love.graphics.rectangle("fill", 30, p1_y, 12, 80)
    love.graphics.rectangle("fill", 758, p2_y, 12, 80)

    -- Draw ball
    love.graphics.circle("fill", ball_x, ball_y, 8)

    -- Draw center line
    for i = 0, 29 do
        love.graphics.rectangle("fill", 398, i * 20, 4, 10)
    end

    -- Draw scores
    love.graphics.print(tostring(score1), 300, 20)
    love.graphics.print(tostring(score2), 480, 20)
end