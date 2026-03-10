import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Rectangle")
clock = pygame.time.Clock()

x, y = 400.0, 300.0
speed = 200

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
    if keys[pygame.K_UP]:
        y -= speed * dt
    if keys[pygame.K_DOWN]:
        y += speed * dt

    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(x) - 16, int(y) - 16, 32, 32))
    pygame.display.flip()

pygame.quit()
sys.exit()