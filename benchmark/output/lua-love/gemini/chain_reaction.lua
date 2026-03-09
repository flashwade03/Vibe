```lua
local cx = {}
local cy = {}
local cstate = {}
local cradius = {}
local ctimer = {}
local num_circles = 30

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Chain Reaction")