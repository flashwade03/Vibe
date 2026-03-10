```python
import pygame
import sys
import math
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Dodge the Bullets")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

player_x, player_y = 400.0, 300.0
player_speed = 300.0

bx = []
by = []
bvx = []
bvy = []
blife = []

spawn_timer = 0.3
survived_time = 0.0
hit = False

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not hit:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            player_x -= player_speed * dt
        if keys[pygame.K_RIGHT]:
            player_x += player_speed * dt
        if keys[pygame.K_UP]:
            player_y -= player_speed * dt
        if keys[pygame.K_DOWN]:
            player_y += player_speed * dt

        survived_time += dt