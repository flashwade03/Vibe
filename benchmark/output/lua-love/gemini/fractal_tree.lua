local seg_x1s, seg_y1s, seg_x2s, seg_y2s = {}, {}, {}, {}
local q_xs, q_ys, q_angles, q_lens, q_depths = {}, {}, {}, {}, {}
local max_depth = 7
local branch_angle = 0.5
local built = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Fractal Tree")
end

function love.update(dt)
    if not built then
        table.insert(q_xs, 400.0)
        table.insert(q_ys, 580.0)
        table.insert(q_angles, -1.5708)
        table.insert(q_lens, 100.0)
        table.insert(q_depths, 0.0)

        local ptr = 1
        for iter = 0, 500 do
            if ptr > #q_xs then break end
            
            local sx = q_xs[ptr]
            local sy = q_ys[ptr]
            local sa = q_angles[ptr]
            local sl = q_lens[ptr]
            local sd = q_depths[ptr]
            
            local ex = sx + math.cos(sa) * sl
            local ey = sy + math.sin(sa) * sl
            
            table.insert(seg_x1s, sx)
            table.insert(seg_y1s, sy)
            table.insert(seg_x2s, ex)
            table.insert(seg_y2s, ey)
            
            if sd < max_depth then
                local nl = sl * 0.7
                local nd = sd + 1.0
                
                table.insert(q_xs, ex)
                table.insert(q_ys, ey)
                table.insert(q_angles, sa - branch_angle)
                table.insert(q_lens, nl)
                table.insert(q_depths, nd)
                
                table.insert(q_xs, ex)
                table.insert(q_ys, ey)
                table.insert(q_angles, sa + branch_angle)
                table.insert(q_lens, nl)
                table.insert(q_depths, nd)
            end
            ptr = ptr + 1
        end
        built = true
    end
end

function love.draw()
    for i = 1, #seg_x1s do
        for j = 0, 4 do
            local lt = j / 5.0
            local lx = seg_x1s[i] + (seg_x2s[i] - seg_x1s[i]) * lt
            local ly = seg_y1s[i] + (seg_y2s[i] - seg_y1s[i]) * lt
            love.graphics.circle("fill", lx, ly, 1.0)
        end
    end
    
    love.graphics.print("Segments: " .. #seg_x1s, 10, 10)
    love.graphics.print("Angle: " .. branch_angle, 10, 30)
end