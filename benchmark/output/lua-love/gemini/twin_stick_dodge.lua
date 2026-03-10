```lua
local player_x = 400
local player_y = 300
local player_speed = 300
local player_radius = 10

local bx = {}
local by = {}
local bvx = {}
local bvy = {}
local blife = {}

local spawn_timer = 0.3
local bullet_speed = 250.0
local survived_time = 0.0
local hit = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Dodge the Bullets")
end

function love.update(dt)
    if hit then return end

    sur