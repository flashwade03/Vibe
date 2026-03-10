local full_text = "Welcome to the Vibe engine!"
local text_len = 27
local char_index = 0
local char_timer = 0.0
local char_speed = 0.08

function love.load()
    love.window.setMode(800, 600)
    love.window.setTitle("Vibe Engine Text Reveal")
end

function love.update(dt)
    if char_index < text_len then
        char_timer = char_timer + dt
        if char_timer >= char_speed then
            char_timer = char_timer - char_speed
            char_index = char_index + 1
        end
    end
end

function love.draw()
    -- Draw the full text
    love.graphics.print(full_text, 100, 280)

    -- Draw covering rectangle to hide unrevealed characters
    -- Assuming a fixed-width font approximation of 10 pixels per character
    local cover_x = 100.0 + (char_index * 10.0)
    love.graphics.setColor(0, 0, 0)
    love.graphics.rectangle("fill", cover_x, 270, 700, 30)
    love.graphics.setColor(1, 1, 1)

    -- Draw cursor
    if math.sin(char_timer * 10.0) > 0.0 then
        love.graphics.rectangle("fill", cover_x, 275, 2, 20)
    end

    -- Display stats
    love.graphics.print("Chars: " .. char_index .. "/" .. text_len, 10, 10)

    -- Done message
    if char_index >= text_len then
        love.graphics.print("Done!", 10, 30)
    end
end

function love.keypressed(key)
    if key == "space" then
        char_index = 0
        char_timer = 0.0
    end
end