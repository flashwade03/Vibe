```lua
local particle_xs = {}
local particle_ys = {}
local particle_vxs = {}
local particle_vys = {}
local particle_lifes = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Particle Burst")
end

function love.mouse