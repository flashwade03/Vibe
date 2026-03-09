import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Program")
clock = pygame.time.Clock()

x, y = 384.0, 550.0
speed = 200
vy = 0.0
gravity = 500.0
on_ground = True

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        x -= speed * dt
    if keys[pygame.K_RIGHT]:
        x += speed * dt
    if keys[pygame.K_UP] and on_ground:
        vy = -300.0
        on_ground = False

    # Apply gravity
    vy += gravity * dt
    y += vy * dt

    # Check ground collision
    if y >= 550:
        y = 550
        vy = 0
        on_ground = True

    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(x), int(y), 32, 32))
    pygame.display.flip()

pygame.quit()
sys.exit()