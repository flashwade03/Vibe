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
bx, by, bvx, bvy, blife = [], [], [], [], []
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
        survived_time += dt

        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            player_x -= 300.0 * dt
        if keys[pygame.K_RIGHT]:
            player_x += 300.0 * dt
        if keys[pygame.K_UP]:
            player_y -= 300.0 * dt
        if keys[pygame.K_DOWN]:
            player_y += 300.0 * dt

        spawn_timer -= dt
        if spawn_timer <= 0.0:
            spawn_timer = 0.3
            edge = random.uniform(0.0, 4.0)
            
            if edge < 1.0:
                sx = random.uniform(0.0, 800.0)
                sy = 0.0
            elif edge < 2.0:
                sx = 800.0
                sy = random.uniform(0.0, 600.0)
            elif edge < 3.0:
                sx = random.uniform(0.0, 800.0)
                sy = 600.0
            else:
                sx = 0.0
                sy = random.uniform(0.0, 600.0)

            dx = player_x - sx
            dy = player_y - sy
            dist = math.sqrt(dx**2 + dy**2)
            
            if dist != 0:
                dx /= dist
                dy /= dist

            bx.append(sx)
            by.append(sy)
            bvx.append(dx * 250.0)
            bvy.append(dy * 250.0)
            blife.append(4.0)

        for i in range