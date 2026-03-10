local px, py = 400, 300
local speed = 150
local hit = false

local enemy_xs = {100, 700, 200, 600, 400}
local enemy_ys = {100, 100, 400, 400, 500}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Game")
end

function love.update(dt)
    hit = false

    if love.keyboard.isDown("left") then px = px - speed * dt end
    if love.keyboard.isDown("right") then px = px + speed * dt end
    if love.keyboard.isDown("up") then py = py - speed * dt end
    if love.keyboard.isDown("down") then py = py + speed * dt end

    for i = 1, #enemy_xs do
        local ex, ey = enemy_xs[i], enemy_ys[i]
        local dist = math.sqrt((px - ex)^2 + (py - ey)^2)
        if dist < (20 + 15) then
            hit = true
        end
    end
end

function love.draw()
    love.graphics.setColor(0, 1, 0)
    love.graphics.circle("fill", px, py, 20)

    love.graphics.setColor(1, 0, 0)
    for i = 1, #enemy_xs do
        love.graphics.circle("fill", enemy_xs[i], enemy_ys[i], 15)
    end

    love.graphics.setColor(1, 1, 1)
    if hit then
        love.graphics.print("Hit!", 10, 10)
    end
end