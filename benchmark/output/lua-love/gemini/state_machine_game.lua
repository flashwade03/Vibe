```lua
local state = 0
local score = 0
local timer = 10.0
local target_x = 0
local target_y = 0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Target Clicker")
end

function love