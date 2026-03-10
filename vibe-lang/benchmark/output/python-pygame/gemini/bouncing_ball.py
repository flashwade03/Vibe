import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Bouncing Ball")
clock = pygame.time.Clock()

# Ball state
x, y = 400.0, 300.0
radius = 16
vel_x = 150.0
vel_y = 150.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update position
    x += vel_x * dt
    y += vel_y * dt

    # Collision detection with walls
    if x - radius < 0:
        x = radius
        vel_x *= -1
    elif x + radius > 800:
        x = 800 - radius
        vel_x *= -1

    if y - radius < 0:
        y = radius
        vel_y *= -1
    elif y + radius > 600:
        y = 600 - radius
        vel_y *= -1

    # Draw
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(x), int(y)), radius)
    pygame.display.flip()

pygame.quit()
sys.exit()