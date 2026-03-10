local cx = {}
local cy = {}
local cstate = {}
local cradius = {}
local ctimer = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Chain Reaction")

    for i = 1, 30 do
        cx[i] = love.math.random(50, 750)
        cy[i] = love.math.random(50, 550)
        cstate[i] = 0.0
        cradius[i] = 15.0
        ctimer[i] = 0.0
    end
end

function love.update(dt)
    for i = 1, #cx do
        if cstate[i] == 1.0 then
            cradius[i] = cradius[i] + 80.0 * dt
            ctimer[i] = ctimer[i] + dt
            if ctimer[i] > 1.0 then
                cstate[i] = 2.0
            end
            for j = 1, #cx do
                if cstate[j] == 0.0 then
                    local dx = cx[i] - cx[j]
                    local dy = cy[i] - cy[j]
                    local distance = math.sqrt(dx * dx + dy * dy)
                    if distance < cradius[i] + 15.0 then
                        cstate[j] = 1.0
                    end
                end
            end
        end
    end
end

function love.mousepressed(x, y, button)
    if button == 1 then
        for i = 1, #cx do
            local dx = cx[i] - x
            local dy = cy[i] - y
            local distance = math.sqrt(dx * dx + dy * dy)
            if distance < 15.0 then
                cstate[i] = 1.0
                break
            end
        end
    end
end

function love.draw()
    local explodedCount = 0
    for i = 1, #cx do
        if cstate[i] == 0.0 then
            love.graphics.circle("line", cx[i], cy[i], 15)
        elseif cstate[i] == 1.0 then
            love.graphics.circle("line", cx[i], cy[i], cradius[i])
        elseif cstate[i] == 2.0 then
            love.graphics.circle("fill", cx[i], cy[i], 3)
            explodedCount = explodedCount + 1
        end
    end
    love.graphics.print("Exploded Circles: " .. explodedCount, 10, 10)
end