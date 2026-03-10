import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Boids Simulation")
clock = pygame.time.Clock()

boid_xs = []
boid_ys = []
boid_vxs = []
boid_vys = []

def rand_float(min_val, max_val):
    return random.uniform(min_val, max_val)

def load():
    for i in range(15):
        boid_xs.append(rand_float(0.0, 800.0))
        boid_ys.append(rand_float(0.0, 600.0))
        boid_vxs.append(rand_float(-50.0, 50.0))
        boid_vys.append(rand_float(-50.0, 50.0))

def update(dt):
    center_x = sum(boid_xs) / 15
    center_y = sum(boid_ys) / 15

    for i in range(15):
        # Cohesion
        boid_vxs[i] += (center_x - boid_xs[i]) * 0.5 * dt
        boid_vys[i] += (center_y - boid_ys[i]) * 0.5 * dt

        # Separation
        for j in range(15):
            if i != j:
                dx = boid_xs[i] - boid_xs[j]
                dy = boid_ys[i] - boid_ys[j]
                distance = math.sqrt(dx * dx + dy * dy)
                if distance < 30.0:
                    boid_vxs[i] += dx / distance * 100.0 * dt
                    boid_vys[i] += dy / distance * 100.0 * dt

        # Clamp speed
        speed = math.sqrt(boid_vxs[i] ** 2 + boid_vys[i] ** 2)
        if speed > 150.0:
            boid_vxs[i] = boid_vxs[i] / speed * 150.0
            boid_vys[i] = boid_vys[i] / speed * 150.0

        # Update positions
        boid_xs[i] += boid_vxs[i] * dt
        boid_ys[i] += boid_vys[i] * dt

        # Wrap around screen edges
        boid_xs[i] %= 800
        boid_ys[i] %= 600

def draw():
    for i in range(15):
        pygame.draw.rect(screen, (255, 255, 255), (int(boid_xs[i]), int(boid_ys[i]), 4, 4))

load()
running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    update(dt)

    screen.fill((0, 0, 0))
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()