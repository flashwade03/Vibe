local box_xs = {}
local box_ys = {}
local box_vys = {}
local box_ws = {}
local box_hs = {}

local plat_xs = {50.0, 300.0, 550.0}
local plat_ys = {450.0, 350.0, 450.0}
local plat_ws = {200.0, 200.0, 200.0}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Falling Boxes")
    
    for i = 1, 6 do
        table.insert(box_xs, 80.0 + (i - 1) * 110.0)
        table.insert(box_ys, love.math.random(50.0, 200.0))
        table.insert(box_vys, 0.0)
        table.insert(box_ws, love.math.random(30.0, 60.0))
        table.insert(box_hs, love.math.random(30.0, 60.0))
    end
end

function love.update(dt)
    for i = 1, 6 do
        box_vys[i] = box_vys[i] + 300.0 * dt
        box_ys[i] = box_ys[i] + box_vys[i] * dt
        
        if box_ys[i] + box_hs[i] > 580.0 then
            box_ys[i] = 580.0 - box_hs[i]
            box_vys[i] = 0.0
        end
        
        for j = 1, 3 do
            if box_vys[i] >= 0.0 and 
               box_xs[i] + box_ws[i] > plat_xs[j] and 
               box_xs[i] < plat_xs[j] + plat_ws[j] and 
               box_ys[i] + box_hs[i] >= plat_ys[j] and 
               box_ys[i] + box_hs[i] <= plat_ys[j] + 20.0 then
                box_ys[i] = plat_ys[j] - box_hs[i]
                box_vys[i] = 0.0
            end
        end
    end
    
    for i = 1, 6 do
        for j = 1, 6 do
            if j > i and 
               box_xs[i] < box_xs[j] + box_ws[j] and 
               box_xs[i] + box_ws[i] > box_xs[j] and 
               box_ys[i] < box_ys[j] + box_hs[j] and 
               box_ys[i] + box_hs[i] > box_ys[j] then
                local ov = (box_xs[i] + box_ws[i]) - box_xs[j]
                if ov > 0.0 then
                    box_xs[i] = box_xs[i] - ov * 0.5
                    box_xs[j] = box_xs[j] + ov * 0.5
                end
            end
        end
    end
end

function love.keypressed(k)
    if k == "space" then
        for i = 1, 6 do
            box_ys[i] = love.math.random(50.0, 200.0)
            box_vys[i] = 0.0
        end
    end
end

function love.draw()
    for i = 1, 6 do
        love.graphics.rectangle("fill", box_xs[i], box_ys[i], box_ws[i], box_hs[i])
    end
    
    for j = 1, 3 do
        love.graphics.rectangle("fill", plat_xs[j], plat_ys[j], plat_ws[j], 15.0)
    end
    
    love.graphics.print("Space: Reset", 10.0, 10.0)
end