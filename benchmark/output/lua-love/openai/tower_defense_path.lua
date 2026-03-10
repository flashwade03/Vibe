local path_xs = {0.0, 200.0, 200.0, 600.0, 600.0, 800.0}
local path_ys = {300.0, 300.0, 100.0, 100.0, 500.0, 500.0}

local en_xs = {}
local en_ys = {}
local en_wp = {}
local en_hp = {}

local tow_xs = {}
local tow_ys = {}
local tow_timers = {}

local proj_xs = {}
local proj_ys = {}
local proj_txs = {}
local proj_tys = {}
local proj_alive = {}

local spawn_timer = 2.0
local enemy_speed = 80.0
local score = 0
local lives = 10

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Tower Defense")
end

function love.update(dt)
    spawn_timer = spawn_timer - dt
    if spawn_timer <= 0.0 then
        spawn_timer = 2.0
        table.insert(en_xs, 0.0)
        table.insert(en_ys, 300.0)
        table.insert(en_wp, 1.0)
        table.insert(en_hp, 3.0)
    end

    for i = #en_xs, 1, -1 do
        if en_hp[i] > 0.0 then
            local wi = math.floor(en_wp[i])
            if wi < 6 then
                local dx = path_xs[wi + 1] - en_xs[i]
                local dy = path_ys[wi + 1] - en_ys[i]
                local d = math.sqrt(dx * dx + dy * dy)
                if d > 3.0 then
                    en_xs[i] = en_xs[i] + (dx / d) * enemy_speed * dt
                    en_ys[i] = en_ys[i] + (dy / d) * enemy_speed * dt
                else
                    en_wp[i] = en_wp[i] + 1.0
                end
            else
                en_hp[i] = 0.0
                lives = lives - 1
            end
        end
    end

    for t = 1, #tow_xs do
        tow_timers[t] = tow_timers[t] - dt
        if tow_timers[t] <= 0.0 then
            local best = -1
            local best_d = 151.0
            for i = 1, #en_xs do
                if en_hp[i] > 0.0 then
                    local td = math.sqrt((tow_xs[t] - en_xs[i])^2 + (tow_ys[t] - en_ys[i])^2)
                    if td < best_d then
                        best_d = td
                        best = i
                    end
                end
            end
            if best >= 0 then
                tow_timers[t] = 1.0
                table.insert(proj_xs, tow_xs[t])
                table.insert(proj_ys, tow_ys[t])
                table.insert(proj_txs, en_xs[best])
                table.insert(proj_tys, en_ys[best])
                table.insert(proj_alive, 1.0)
            end
        end
    end

    for p = #proj_xs, 1, -1 do
        if proj_alive[p] > 0.0 then
            local dx = proj_txs[p] - proj_xs[p]
            local dy = proj_tys[p] - proj_ys[p]
            local d = math.sqrt(dx * dx + dy * dy)
            if d > 10.0 then
                proj_xs[p] = proj_xs[p] + (dx / d) * 300.0 * dt
                proj_ys[p] = proj_ys[p] + (dy / d) * 300.0 * dt
            else
                for i = 1, #en_xs do
                    if en_hp[i] > 0.0 then
                        local ed = math.sqrt((proj_xs[p] - en_xs[i])^2 + (proj_ys[p] - en_ys[i])^2)
                        if ed < 10.0 then
                            en_hp[i] = en_hp[i] - 1.0
                            if en_hp[i] <= 0.0 then
                                score = score + 1
                            end
                        end
                    end
                end
                proj_alive[p] = 0.0
            end
        end
    end
end

function love.mousepressed(x, y, button)
    if button == 1 and #tow_xs < 5 then
        table.insert(tow_xs, x)
        table.insert(tow_ys, y)
        table.insert(tow_timers, 0.0)
    end
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    for i = 1, 5 do
        for j = 0, 19 do
            local px = path_xs[i] + (path_xs[i + 1] - path_xs[i]) * (j / 19)
            local py = path_ys[i] + (path_ys[i + 1] - path_ys[i]) * (j / 19)
            love.graphics.circle("fill", px, py, 2)
        end
    end

    for i = 1, #en_xs do
        if en_hp[i] > 0.0 then
            love.graphics.circle("fill", en_xs[i], en_ys[i], 8)
        end
    end

    for t = 1, #tow_xs do
        love.graphics.rectangle("fill", tow_xs[t] - 10, tow_ys[t] - 10, 20, 20)
    end

    for p = 1, #proj_xs do
        if proj_alive[p] > 0.0 then
            love.graphics.rectangle("fill", proj_xs[p] - 2, proj_ys[p] - 2, 4, 4)
        end
    end

    love.graphics.print("Lives: " .. lives .. " Score: " .. score, 10, 10)
    love.graphics.print("Click to place tower (" .. #tow_xs .. "/5)", 10, 30)
end