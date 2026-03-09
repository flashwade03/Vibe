```lua
local player_x = 1000.0
local player_y = 1000.0
local player_speed = 300.0

local item_xs = {}
local item_ys = {}

function love.load()
    love.window.setMode(800, 600)
    love