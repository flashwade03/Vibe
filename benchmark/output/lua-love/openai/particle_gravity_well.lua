local px = {}
local py = {}
local pvx = {}
local pvy = {}
local well_x = 400.0
local well_y = 300.0
local well_strength = 5000.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Gravity Well with Particles")
    for i = 1, 50 do
        px[i] = love.math.random(0, 800)
        py[i] = love.math.random(0, 600)
        pvx[i] = love.math.random(-30, 30)
        pvy[i] = love.math.random(-30, 30)
    end
end

function love.mousepressed(mx, my, button)
    if button == 1 then
        well_x = mx
        well_y = my
    end
end

function love.update(dt)
    for i = 1, 50 do
        local dx = well_x - px[i]
        local dy = well_y - py[i]
        local dist = math.sqrt(dx * dx + dy * dy)
        if dist > 5.0 then
            local force = well_strength / (dist * dist)
            pvx[i] = pvx[i] + (dx / dist) * force * dt
            pvy[i] = pvy[i] + (dy / dist) * force * dt
        end
        px[i] = px[i] + pvx[i] * dt
        py[i] = py[i] + pvy[i] * dt

        if px[i] < 0 then px[i] = 800 end
        if px[i] > 800 then px[i] = 0 end
        if py[i] < 0 then py[i] = 600 end
        if py[i] > 600 then py[i] = 0 end
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.circle("fill", well_x, well_y, 8)
    for i = 1, 50 do
        love.graphics.rectangle("fill", px[i], py[i], 3, 3)
    end
    love.graphics.print("Particles: 50", 10, 10)
    love.graphics.print("Click to move well", 10, 30)
end