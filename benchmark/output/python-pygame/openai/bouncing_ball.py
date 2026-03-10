import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Bouncing Ball")
clock = pygame.time.Clock()

# Ball properties
x, y = 400.0, 300.0
radius = 16
velocity_x, velocity_y = 150, 150

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update ball position
    x += velocity_x * dt
    y += velocity_y * dt

    # Bounce off the edges
    if x - radius < 0 or x + radius > 800:
        velocity_x = -velocity_x
    if y - radius < 0 or y + radius > 600:
        velocity_y = -velocity_y

    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(x), int(y)), radius)
    pygame.display.flip()

pygame.quit()
sys.exit()