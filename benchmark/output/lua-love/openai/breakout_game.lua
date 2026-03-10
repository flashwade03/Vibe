local paddle_x = 360
local paddle_y = 570
local paddle_width = 80
local paddle_height = 12
local paddle_speed = 300

local ball_x = 400
local ball_y = 400
local ball_radius = 6
local ball_vx = 200
local ball_vy = -200

local bricks = {}
local brick_width = 90
local brick_height = 20
local brick_alive = {1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0}

local score = 0
local game_over = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Breakout")

    for i = 0, 7 do
        table.insert(bricks, {x = i * 100 + 5, y = 50})
    end
end

function love.update(dt)
    if game_over then return end

    -- Paddle movement
    if love.keyboard.isDown("left") then
        paddle_x = paddle_x - paddle_speed * dt
    end
    if love.keyboard.isDown("right") then
        paddle_x = paddle_x + paddle_speed * dt
    end

    -- Ball movement
    ball_x = ball_x + ball_vx * dt
    ball_y = ball_y + ball_vy * dt

    -- Ball collision with walls
    if ball_x < ball_radius or ball_x > 800 - ball_radius then
        ball_vx = -ball_vx
    end
    if ball_y < ball_radius then
        ball_vy = -ball_vy
    end

    -- Ball collision with paddle
    if ball_y >= paddle_y - ball_radius and ball_x >= paddle_x and ball_x <= paddle_x + paddle_width then
        ball_vy = -ball_vy
    end

    -- Ball collision with bricks
    for i, brick in ipairs(bricks) do
        if brick_alive[i] == 1.0 then
            if ball_x > brick.x and ball_x < brick.x + brick_width and ball_y > brick.y and ball_y < brick.y + brick_height then
                brick_alive[i] = 0.0
                ball_vy = -ball_vy
                score = score + 1
            end
        end
    end

    -- Check for game over
    if ball_y > 600 then
        game_over = true
    end
end

function love.draw()
    -- Draw paddle
    love.graphics.rectangle("fill", paddle_x, paddle_y, paddle_width, paddle_height)

    -- Draw ball
    love.graphics.circle("fill", ball_x, ball_y, ball_radius)

    -- Draw bricks
    for i, brick in ipairs(bricks) do
        if brick_alive[i] == 1.0 then
            love.graphics.rectangle("fill", brick.x, brick.y, brick_width, brick_height)
        end
    end

    -- Draw score
    love.graphics.print("Score: " .. score, 10, 10)

    -- Draw game over
    if game_over then
        love.graphics.print("GAME OVER", 350, 300)
    end
end