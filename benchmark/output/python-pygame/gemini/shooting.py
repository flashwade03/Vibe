```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Shooter")
clock = pygame.time.Clock()

player_x = 384.0
player_y = 550.0
player_speed = 200.0

bullet_xs = []
bullet_ys = []

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                bullet_xs.append(player_x + 16.0)
                bullet_ys.append(player_y)

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= player_speed * dt
    if keys[pygame.K_RIGHT]:
        player_x += player_speed * dt

    for i in range(len(bullet_ys)):
        bullet_ys[