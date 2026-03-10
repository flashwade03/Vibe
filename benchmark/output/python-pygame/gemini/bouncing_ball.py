import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Bouncing Ball")
clock = pygame.time.Clock()

# Ball state
x, y = 400.0, 300.0
radius = 16
vel_x, vel_y = 150.0, 150.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update position
    x += vel_x * dt
    y += vel_y * dt

    # Collision detection with edges
    if x - radius <= 0 or x + radius >= 800:
        vel_x *= -1
        # Clamp to prevent sticking
        x = max(radius, min(x, 800 - radius))
        
    if y - radius <= 0 or y + radius >= 600:
        vel_y *= -1
        # Clamp to prevent sticking
        y = max(radius, min(y, 600 - radius))

    # Draw
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(x), int(y)), radius)
    pygame.display.flip()

pygame.quit()
sys.exit()