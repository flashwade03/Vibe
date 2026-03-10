```lua
local player_x = 400
local player_y = 300
local player_speed = 300

local bx = {}
local by = {}
local bvx = {}
local bvy = {}
local blife = {}

local spawn_timer = 0.3
local survived_time = 0.0
local hit = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Dodge the Bullets")
end

function love.update(dt)
    if hit then return end

    -- Move player
    if love.keyboard.isDown("left") then
        player_x = player_x - player_speed * dt
    end
    if love.keyboard.isDown("right") then
        player_x = player_x + player_speed * dt
    end
    if love.keyboard.isDown("up") then
        player_y = player_y - player_speed * dt
    end
    if love.keyboard.isDown("down") then
        player_y = player_y + player_speed * dt
    end

    survived_time = survived_time + dt

    -- Spawn bullets
    spawn_timer = spawn_timer - dt
    if spawn_timer <= 0.0 then
        spawn_timer = 0.3
        
        local edge = love.math.random(1, 4)
        local sx, sy
        
        if edge == 1 then
            sx = love.math.random(0, 800)
            sy = 0
        elseif edge == 2 then
            sx = 800
            sy = love.