local ring_xs = {}
local ring_ys = {}
local ring_radii = {}
local ring_lifes = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Expanding Circles")
end

function love.mousepressed(mx, my, button)
    if button == 1 then
        table.insert(ring_xs, mx)
        table.insert(ring_ys, my)
        table.insert(ring_radii, 5.0)
        table.insert(ring_lifes, 2.0)
    end
end

function love.update(dt)
    for i = #ring_xs, 1, -1 do
        ring_radii[i] = ring_radii[i] + 80.0 * dt
        ring_lifes[i] = ring_lifes[i] - dt
        if ring_lifes[i] <= 0.0 then
            table.remove(ring_xs, i)
            table.remove(ring_ys, i)
            table.remove(ring_radii, i)
            table.remove(ring_lifes, i)
        end
    end
end

function love.draw()
    for i = 1, #ring_xs do
        if ring_lifes[i] > 0.0 then
            love.graphics.circle("line", ring_xs[i], ring_ys[i], ring_radii[i])
        end
    end
    love.graphics.print("Rings: " .. tostring(#ring_xs), 10, 10)
    love.graphics.print("Click to create rings", 280, 560)
end