```lua
local player_x = 400
local player_y = 300
local player_speed = 200

local enemy_x = 100
local enemy_y = 100
local enemy_speed = 100

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle