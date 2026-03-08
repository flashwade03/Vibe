local ballX = 400
local ballY = 300
local ballRadius = 16
local velX = 150
local velY = 150
local windowWidth = 800
local windowHeight = 600

function love.load()
    love.window.setMode(windowWidth, windowHeight)
    love.window.setTitle("Bouncing Ball")
end

function love.update(dt)
    -- Move the ball
    ballX = ballX + velX * dt
    ballY = ballY + velY * dt

    -- Bounce off left and right edges
    if ballX - ballRadius < 0 then
        ballX = ballRadius
        velX = -velX
    elseif ballX + ballRadius > windowWidth then
        ballX = windowWidth - ballRadius
        velX = -velX
    end

    -- Bounce off top and bottom edges
    if ballY - ballRadius < 0 then
        ballY = ballRadius
        velY = -velY
    elseif ballY + ballRadius > windowHeight then
        ballY = windowHeight - ballRadius
        velY = -velY
    end
end

function love.draw()
    love.graphics.circle("fill", ballX, ballY, ballRadius)
end