```lua
local cx = {}
local cy = {}
local cstate = {}
local cradius = {}
local ctimer = {}

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Chain Reaction")
    
    for i = 1, 30 do
        cx[i] = 50.0 + love.math.random() * 700.0
        cy[i] = 50.0 + love.math.random() * 500.0
        cstate[i] = 0.0
        cradius[i] = 15.0
        ctimer[i] = 0.0
    end
end

function love.mousepressed(x, y, button)
    if button == 1 then
        local closest_dist = 15.0
        local closest_idx = -1
        
        for i = 1, 30 do
            local dx = cx[i] - x
            local dy = cy[i] - y
            local dist = math.sqrt(dx * dx + dy * dy)
            
            if dist <= closest_dist then
                closest_dist = dist
                closest_idx = i
            end
        end