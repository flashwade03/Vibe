```python
import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Player and Enemy")
clock = pygame.time.Clock()

player_x, player_y = 400.0, 300.0
player_speed = 200.0

enemy_x, enemy_y = 100.0, 100.0
enemy_speed = 100.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= player_speed * dt
    if keys[pygame.K_RIGHT]:
        player_x += player_speed * dt
    if keys[pygame.K_UP]:
        player_y -= player_speed * dt
    if keys[pygame.K_DOWN]:
        player_y += player_speed * dt

    dx = player_x - enemy_x
    dy = player_y - enemy_y
    distance = math.sqrt(dx * dx + dy * dy)
    
    if distance > 1.0:
        enemy_x += (dx / distance