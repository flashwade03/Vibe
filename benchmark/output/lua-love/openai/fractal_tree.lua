local seg_x1s = {}
local seg_y1s = {}
local seg_x2s = {}
local seg_y2s = {}

local q_xs = {}
local q_ys = {}
local q_angles = {}
local q_lens = {}
local q_depths = {}

local max_depth = 7
local branch_angle = 0.5
local built = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Fractal Tree")
end

function love.update(dt)
    if not built then
        q_xs[#q_xs + 1] = 400.0
        q_ys[#q_ys + 1] = 580.0
        q_angles[#q_angles + 1] = -1.5708
        q_lens[#q_lens + 1] = 100.0
        q_depths[#q_depths + 1] = 0.0

        local ptr = 1
        for _ = 1, 500 do
            if ptr > #q_xs then break end

            local sx = q_xs[ptr]
            local sy = q_ys[ptr]
            local sa = q_angles[ptr]
            local sl = q_lens[ptr]
            local sd = q_depths[ptr]

            local ex = sx + math.cos(sa) * sl
            local ey = sy + math.sin(sa) * sl

            seg_x1s[#seg_x1s + 1] = sx
            seg_y1s[#seg_y1s + 1] = sy
            seg_x2s[#seg_x2s + 1] = ex
            seg_y2s[#seg_y2s + 1] = ey

            if sd < max_depth then
                local nl = sl * 0.7
                local nd = sd + 1.0

                q_xs[#q_xs + 1] = ex
                q_ys[#q_ys + 1] = ey
                q_angles[#q_angles + 1] = sa - branch_angle
                q_lens[#q_lens + 1] = nl
                q_depths[#q_depths + 1] = nd

                q_xs[#q_xs + 1] = ex
                q_ys[#q_ys + 1] = ey
                q_angles[#q_angles + 1] = sa + branch_angle
                q_lens[#q_lens + 1] = nl
                q_depths[#q_depths + 1] = nd
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