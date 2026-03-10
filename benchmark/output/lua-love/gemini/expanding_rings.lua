local ring_xs = {}
local ring_ys = {}
local ring_radii = {}
local ring_lifes = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Expanding Rings")
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
    for i = 1, #ring_xs do
        ring_radii[i] = ring_radii[i] + 80.0 * dt
        ring_lifes[i] = ring_lifes[i] - dt
    end
end

function love.draw()
    for i = 1, #ring_xs do
        if ring_lifes[i] > 0.0 then
            love.graphics.circle("line", ring_xs[i], ring_ys[i], ring_radii[i])
        end
    end

    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Rings: " .. #ring_xs, 10.0, 10.0)
    love.graphics.print("Click to create rings", 280.0, 560.0)
end