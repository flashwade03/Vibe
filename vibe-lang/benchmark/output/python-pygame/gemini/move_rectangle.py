import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Rectangle")
clock = pygame.time.Clock()

# Initial position at center (800/2 - 32/2, 600/2 - 32/2)
x, y = 384.0, 284.0
speed = 200.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Movement logic using key states
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        x -= speed * dt
    if keys[pygame.K_RIGHT]:
        x += speed * dt
    if keys[pygame.K_UP]:
        y -= speed * dt
    if keys[pygame.K_DOWN]:
        y += speed * dt

    # Keep rectangle within screen bounds
    x = max(0, min(x, 800 - 32))
    y = max(0, min(y, 600 - 32))

    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(x), int(y), 32, 32))
    pygame.display.flip()

pygame.quit()
sys.exit()