```lua
local px = 400
local py = 300
local player_speed = 250

local ex = {}
local ey = {}
local evx = {}
local evy = {}
local elife = {}

local wave = 1
local spawn_timer = 2.0
local enemies_per_wave = 3
local game_over = false

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Wave Spawner")
end

function love.update(dt)
    if game_over then return end

    if love.keyboard.isDown("left") then
        px = px - player_speed * dt
    end
    if love.keyboard.isDown("right") then
        px = px +