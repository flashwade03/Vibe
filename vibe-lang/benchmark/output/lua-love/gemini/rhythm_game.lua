local note_xs = {}
local note_ys = {}
local note_lanes = {}
local note_hit = {}

local spawn_timer = 0.0
local note_speed = 200.0
local score = 0
local misses = 0
local combo = 0
local flash_timer = 0.0
local flash_lane = -1

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Rhythm Game")
end

function love.update(dt)
    spawn_timer = spawn_timer + dt
    if spawn_timer >= 0.6 then
        spawn_timer = 0.0
        local lane = love.math.random(0, 3)
        table.insert(note_xs, 250.0 + lane * 100.0)
        table.insert(note_ys, -20.0)
        table.insert(note_lanes, lane)
        table.insert(note_hit, 0.0)
    end

    for i = 1, #note_ys do
        if note_hit[i] == 0.0 then
            note_ys[i] = note_ys[i] + note_speed * dt
            if note_ys[i] > 600.0 then
                note_hit[i] = 2.0
                misses = misses + 1
                combo = 0
            end
        end
    end

    flash_timer = flash_timer - dt
end

function love.keypressed(k)
    local press_lane = -1
    if k == "d" then press_lane = 0 end
    if k == "f" then press_lane = 1 end
    if k == "j" then press_lane = 2 end
    if k == "k" then press_lane = 3 end

    if press_lane >= 0 then
        for i = 1, #note_ys do
            if note_hit[i] == 0.0 and math.floor(note_lanes[i]) == press_lane and note_ys[i] > 470.0 and note_ys[i] < 530.0 then
                note_hit[i] = 1.0
                score = score + 1
                combo = combo + 1
                flash_timer = 0.15
                flash_lane = press_lane
                break
            end
        end
    end
end

function love.draw()
    for lane = 0, 3 do
        love.graphics.rectangle("line", 220.0 + lane * 100.0, 495.0, 60.0, 10.0)
    end

    for i = 1, #note_xs do
        if note_hit[i] == 0.0 then
            love.graphics.rectangle("fill", note_xs[i] - 30.0, note_ys[i] - 10.0, 60.0, 20.0)
        end
    end

    if flash_timer > 0.0 then
        love.graphics.rectangle("fill", 220.0 + flash_lane * 100.0, 488.0, 60.0, 24.0)
    end

    love.graphics.print("Score: " .. score, 10.0, 10.0)
    love.graphics.print("Combo: " .. combo, 10.0, 30.0)
    love.graphics.print("Miss: " .. misses, 10.0, 50.0)
    love.graphics.print("D F J K", 340.0, 560.0)
end