local px = 400
local py = 300
local p_radius = 20
local speed = 150

local enemy_xs = {100, 700, 200, 600, 400}
local enemy_ys = {100, 100, 400, 400, 500}
local e_radius = 15

local hit = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Circle Collision")
end

function love.update(dt)
    hit = false

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

    for i = 1, #enemy_xs do
        local ex = enemy_xs[i]
        local ey = enemy_ys[i]
        local dist = math.sqrt((px - ex) * (px - ex) + (py - ey) * (py - ey))
        
        if dist < (p_radius + e_radius) then
            hit = true
        end
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", px, py, p_radius)

    love.graphics.setColor(1, 0, 0)
    for i = 1, #enemy_xs do
        love.graphics.circle("fill", enemy_xs[i], enemy_ys[i], e_radius)
    end

    love.graphics.setColor(1, 1, 1)
    if hit then
        love.graphics.print("Hit!", 10, 10)
    end
end