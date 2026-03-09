```python
import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Circle Collision")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

px, py = 400.0, 300.0
player_radius = 20
speed = 150.0

enemy_xs = [100.0, 700.0, 200.0, 600.0, 400.0]
enemy_ys = [100.0, 100.0, 400.0, 400.0, 500.0]
enemy_radius = 15

hit = False

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        px -= speed * dt
    if keys[pygame.K_RIGHT]:
        px += speed * dt
    if keys[pygame.K_UP]:
        py -= speed * dt
    if