local px = 400
local py = 300
local speed = 150
local pr = 20
local er = 15
local hit = false

local enemy_xs = {100, 700, 200, 600, 400}
local enemy_ys = {100, 100, 400, 400, 500}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Collision Detection")
end

function love.update(dt)
    hit = false

    -- Player movement
    if love.keyboard.isDown("left") then
        px = px - speed * dt
    end
    if love.keyboard.isDown("right") then
        px = px + speed * dt
    end
    if love.keyboard.isDown("up") then
        py = py - speed * dt
    end
    if love.keyboard.isDown("down") then
        py = py + speed * dt
    end

    -- Collision detection
    for i = 1, #enemy_xs do
        local ex = enemy_xs[i]
        local ey = enemy_ys[i]
        local distance = math.sqrt((px - ex) * (px - ex) + (py - ey) * (py - ey))
        if distance < (pr + er) then
            hit = true
        end
    end
end

function love.draw()
    -- Draw player
    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", px, py, pr)

    -- Draw enemies
    for i = 1, #enemy_xs do
        love.graphics.circle("fill", enemy_xs[i], enemy_ys[i], er)
    end

    -- Draw UI
    if hit then
        love.graphics.print("Hit!", 10, 10)
    end
end