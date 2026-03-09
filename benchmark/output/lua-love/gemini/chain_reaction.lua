```lua
local cx = {}
local cy = {}
local cstate = {}
local cradius = {}
local ctimer = {}
local num_circles = 30

local function getDistance(x1, y1, x2, y2)
    local dx = x1 - x2
    local dy = y1 - y2
    return