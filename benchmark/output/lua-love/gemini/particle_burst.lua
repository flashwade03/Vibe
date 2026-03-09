```lua
local particle_xs = {}
local particle_ys = {}
local particle_vxs = {}
local particle_vys = {}
local particle_lifes = {}

local function rand_float(min, max)
    return min + love.math.random() * (max - min)
end

function love.load()
    love.window