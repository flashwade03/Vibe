local player_x = 100.0
local player_y = 300.0
local player_speed = 250.0

local ast_xs = {}
local ast_ys = {}
local ast_sizes = {}

local spawn_timer = 0.0
local scroll_speed = 200.0
local game_over = false
local score = 0.0

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Dodge the Asteroids")
end

function love.update(dt)
    if not game_over then
        -- Move player
        if love.keyboard.isDown("up") then
            player_y = player_y - player_speed * dt
        end
        if love.keyboard.isDown("down") then
            player_y = player_y + player_speed * dt
        end
        player_y = math.max(0.0, math.min(576.0, player_y))

        -- Spawn asteroids
        spawn_timer = spawn_timer + dt
        if spawn_timer >= 0.4 then
            spawn_timer = 0.0
            table.insert(ast_xs, 820.0)
            table.insert(ast_ys, love.math.random(20.0, 580.0))
            table.insert(ast_sizes, love.math.random(15.0, 40.0))
        end

        -- Move asteroids and check collision
        for i = #ast_xs, 1, -1 do
            ast_xs[i] = ast_xs[i] - scroll_speed * dt
            if ast_xs[i] < player_x + 24.0 and ast_xs[i] + ast_sizes[i] > player_x and
               ast_ys[i] < player_y + 24.0 and ast_ys[i] + ast_sizes[i] > player_y then
                game_over = true
            end
            if ast_xs[i] < -50 then
                table.remove(ast_xs, i)
                table.remove(ast_ys, i)
                table.remove(ast_sizes, i)
            end
        end

        -- Update score
        score = score + dt
    end
end

function love.draw()
    -- Draw player
    love.graphics.rectangle("fill", player_x, player_y, 24, 24)

    -- Draw asteroids
    for i = 1, #ast_xs do
        love.graphics.rectangle("fill", ast_xs[i], ast_ys[i], ast_sizes[i], ast_sizes[i])
    end

    -- Draw score
    love.graphics.print("Score: " .. tostring(math.floor(score)), 10, 10)

    -- Draw game over message
    if game_over then
        love.graphics.print("GAME OVER", 340, 280)
    end
end