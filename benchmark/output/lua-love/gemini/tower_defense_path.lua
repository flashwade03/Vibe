local path_xs = {0.0, 200.0, 200.0, 600.0, 600.0, 800.0}
local path_ys = {300.0, 300.0, 100.0, 100.0, 500.0, 500.0}
local en_xs, en_ys, en_wp, en_hp = {}, {}, {}, {}
local spawn_timer = 2.0
local enemy_speed = 80.0
local score = 0
local lives = 10
local tow_xs, tow_ys, tow_timers = {}, {}, {}
local proj_xs, proj_ys, proj_txs, proj_tys, proj_alive = {}, {}, {}, {}, {}

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
                local dx, dy = path_xs[wi+1] - en_xs[i], path_ys[wi+1] - en_ys[i]
                local d = math.sqrt(dx*dx + dy*dy)
                if d > 3.0 then
                    en_xs[i] = en_xs[i] + (dx/d) * enemy_speed * dt
                    en_ys[i] = en_ys[i] + (dy/d) * enemy_speed * dt
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
            local best, best_d = -1, 151.0
            for i = 1, #en_xs do
                if en_hp[i] > 0.0 then
                    local td = math.sqrt((tow_xs[t]-en_xs[i])^2 + (tow_ys[t]-en_ys[i])^2)
                    if td < best_d then best_d, best = td, i end
                end
            end
            if best >= 0 then
                tow_timers[t] = 1.0
                table.insert(proj_xs, tow_xs[t]); table.insert(proj_ys, tow_ys[t])
                table.insert(proj_txs, en_xs[best]); table.insert(proj_tys, en_ys[best])
                table.insert(proj_alive, 1.0)
            end
        end
    end

    for i = 1, #proj_xs do
        if proj_alive[i] == 1.0 then
            local dx, dy = proj_txs[i] - proj_xs[i], proj_tys[i] - proj_ys[i]
            local d = math.sqrt(dx*dx + dy*dy)
            if d < 10.0 then
                proj_alive[i] = 0.0
                for j = 1, #en_xs do
                    if en_hp[j] > 0.0 and math.sqrt((proj_xs[i]-en_xs[j])^2 + (proj_ys[i]-en_ys[j])^2) < 20 then
                        en_hp[j] = en_hp[j] - 1
                        if en_hp[j] <= 0 then score = score + 10 end
                    end
                end
            else
                proj_xs[i] = proj_xs[i] + (dx/d) * 300 * dt
                proj_ys[i] = proj_ys[i] + (dy/d) * 300 * dt
            end
        end
    end
end

function love.mousepressed(x, y, button)
    if #tow_xs < 5 then
        table.insert(tow_xs, x); table.insert(tow_ys, y); table.insert(tow_timers, 0.0)
    end
end

function love.draw()
    love.graphics.setColor(0.5, 0.5, 0.5)
    for i = 1, 5 do
        for j = 0, 20 do
            local t = j / 20
            local x = path_xs[i] + (path_xs[i+1]-path_xs[i]) * t
            local y = path_ys[i] + (path_ys[i+1]-path_ys[i]) * t
            love.graphics.circle("fill", x, y, 2)
        end
    end
    love.graphics.setColor(1, 0, 0)
    for i = 1, #en_xs do if en_hp[i] > 0 then love.graphics.circle("fill", en_xs[i], en_ys[i], 8) end end
    love.graphics.setColor(0, 1, 0)
    for i = 1, #tow_xs do love.graphics.rectangle("fill", tow_xs[i]-10, tow_ys[i]-10, 20, 20) end
    love.graphics.setColor(1, 1, 0)
    for i = 1, #proj_xs do if proj_alive[i] == 1 then love.graphics.rectangle("fill", proj_xs[i]-2, proj_ys[i]-2, 4, 4) end end
    love.graphics.setColor(1, 1, 1)
    love.graphics.print("Lives: " .. lives .. " Score: " .. score, 10, 10)
    love.graphics.print("Click to place tower (" .. #tow_xs .. "/5)", 10, 30)
end