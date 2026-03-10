local cx = {}
local cy = {}
local cstate = {}
local cradius = {}
local ctimer = {}
local num_circles = 30

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Chain Reaction")
    
    for i = 1, num_circles do
        table.insert(cx, love.math.random(50, 750))
        table.insert(cy, love.math.random(50, 550))
        table.insert(cstate, 0.0)
        table.insert(cradius, 15.0)
        table.insert(ctimer, 0.0)
    end
end

function love.mousepressed(x, y, button)
    if button == 1 then
        for i = 1, num_circles do
            if cstate[i] == 0.0 then
                local dx = x - cx[i]
                local dy = y - cy[i]
                if math.sqrt(dx*dx + dy*dy) <= 15 then
                    cstate[i] = 1.0
                end
            end
        end
    end
end

function love.update(dt)
    for i = 1, num_circles do
        if cstate[i] == 1.0 then
            cradius[i] = cradius[i] + 80.0 * dt
            ctimer[i] = ctimer[i] + dt
            
            if ctimer[i] > 1.0 then
                cstate[i] = 2.0
            end
            
            for j = 1, num_circles do
                if cstate[j] == 0.0 then
                    local dx = cx[i] - cx[j]
                    local dy = cy[i] - cy[j]
                    if math.sqrt(dx*dx + dy*dy) < (cradius[i] + 15.0) then
                        cstate[j] = 1.0
                    end
                end
            end
        end
    end
end

function love.draw()
    local count = 0
    for i = 1, num_circles do
        if cstate[i] == 0.0 then
            love.graphics.setColor(1, 1, 1)
            love.graphics.circle("line", cx[i], cy[i], 15)
        elseif cstate[i] == 1.0 then
            love.graphics.setColor(1, 0, 0)
            love.graphics.circle("fill", cx[i], cy[i], cradius[i])
            count = count + 1
        elseif cstate[i] == 2.0 then
            love.graphics.setColor(0.5, 0.5, 0.5)
            love.graphics.circle("fill", cx[i], cy[i], 3)
            count = count + 1
        end
    end
    
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Exploded: " .. count, 10, 10)
end