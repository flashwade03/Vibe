```lua
local boid_xs = {}
local boid_ys = {}
local boid_vxs = {}
local boid_vys = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Boids")
    
    for i = 1,