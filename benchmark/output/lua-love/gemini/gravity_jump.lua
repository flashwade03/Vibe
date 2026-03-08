```lua
local x = 384
local y = 550
local vy = 0.0
local on_ground = true
local speed = 200
local gravity = 500.0

function love.load()
    love.window.setMode(800, 600)
    love.