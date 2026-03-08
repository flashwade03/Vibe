local x = 400.0
local y = 300.0
local speed = 200.0

function love.update(dt)
  if love.keyboard.isDown("right") then
    x = x + speed * dt
  end
  if love.keyboard.isDown("left") then
    x = x - speed * dt
  end
  if love.keyboard.isDown("down") then
    y = y + speed * dt
  end
  if love.keyboard.isDown("up") then
    y = y - speed * dt
  end
end

function love.draw()
  love.graphics.rectangle("fill", x, y, 32, 32)
end
