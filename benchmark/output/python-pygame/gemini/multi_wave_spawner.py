```python
import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Wave Spawner")
clock = pygame.time.Clock()

# Player state
px, py = 400.0, 300.0
player_speed = 250.0

# Enemy parallel lists
ex = []
ey = []
evx = []
evy = []
elife = []

# Wave state
wave = 1
spawn_timer = 2.0
enemies_per_wave = 3
game_over = False

font = pygame.font.Font(None, 36)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not game_over:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            px -= player_speed * dt
        if keys[pygame.K_RIGHT]:
            px += player_speed * dt
        if keys[pygame.K_UP]:
            py -= player_speed * dt
        if keys[pygame.K_DOWN]:
            py += player_speed * dt

        spawn_timer -= dt
        if spawn_timer <= 0.0:
            for _ in range(enemies_per_wave):
                edge = random.uniform(0.0, 4.0)
                if edge < 1.0:
                    nx = random.uniform(0.0, 800.0)
                    ny = 0.0
                elif edge < 2.0:
                    nx = 800.0
                    ny = random.uniform(0.0, 600.0)
                elif edge < 3.0:
                    nx = random.uniform(0.0, 800.0)
                    ny = 600.0
                else:
                    nx = 0.0
                    ny = random.uniform(0.0, 600.0)

                dx = px - nx
                dy = py - ny
                dist = math.hypot(dx, dy)
                if dist != 0:
                    dx /= dist
                    dy /= dist
                
                speed = 80.0 + wave * 20.0
                
                ex.append(nx)
                ey.append(ny)
                evx.append(dx * speed)
                evy.append(dy * speed)
                elife.append(1.0)

            wave += 1
            enemies_per_wave = 3 + wave
            spawn_timer = max(0.5, 3.0 - wave * 0.2)

        for i in range(len(ex)):
            if elife[i] > 0:
                ex[i] += evx[i] * dt
                ey[i] += evy[i] * dt
                elife[i] -= dt

                dist = math.hypot(px - ex[i], py - ey[i])
                if dist < 20.0:  # 12 (player radius) + 8 (half of 16x16 rect)
                    game_over = True

    screen.fill((0, 0, 0))

    pygame.draw.circle(screen, (255, 255, 255), (int(px), int(py)), 12)

    for i in range(len(ex)):
        if elife[i] > 0:
            pygame.draw.rect(screen, (255, 255, 255), (int(ex[i]