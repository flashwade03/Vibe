```python
import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Boids Flocking")
clock = pygame.time.Clock()

boid_xs = []
boid_ys = []
boid_vxs = []
boid_vys = []

for i in range(15):
    boid_xs.append(random.uniform(0.0, 800.0))
    boid_ys.append(random.uniform(0.0, 600.0))
    boid_vxs.append(random.uniform(-50.0, 50.0))
    boid_vys.append(random.uniform(-50.0, 50.0))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    center_x = sum(boid_xs) / 15.0
    center_y = sum(boid_ys) / 15.0

    for i in range(15):
        boid_vxs[i] += (center_x - boid_xs[i]) * 0.5 * dt
        boid_vys[i] += (center_y - boid_ys[i]) * 0.5 * dt

        for j in range(15):
            if i != j:
                dx = boid_xs[i] - boid_xs[j]
                dy = boid_ys[i] - boid_ys[j]
                dist = math.sqrt(dx * dx + dy * dy)
                if 0 < dist < 30.0:
                    b