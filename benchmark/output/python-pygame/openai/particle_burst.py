import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Particle Burst")
clock = pygame.time.Clock()

particle_xs = []
particle_ys = []
particle_vxs = []
particle_vys = []
particle_lifes = []

def rand_float(min_val, max_val):
    return random.uniform(min_val, max_val)

def mousepressed(mx, my, button):
    for _ in range(10):
        angle = rand_float(0.0, 6.283)  # 0 to 2*pi
        speed = rand_float(50.0, 200.0)
        vx = math.cos(angle) * speed
        vy = math.sin(angle) * speed
        particle_xs.append(mx)
        particle_ys.append(my)
        particle_vxs.append(vx)
        particle_vys.append(vy)
        particle_lifes.append(2.0)

def update(dt):
    for i in range(len(particle_xs) - 1, -1, -1):
        particle_xs[i] += particle_vxs[i] * dt
        particle_ys[i] += particle_vys[i] * dt
        particle_lifes[i] -= dt
        if particle_lifes[i] <= 0.0:
            del particle_xs[i]
            del particle_ys[i]
            del particle_vxs[i]
            del particle_vys[i]
            del particle_lifes[i]

def draw():
    for i in range(len(particle_xs)):
        if particle_lifes[i] > 0.0:
            pygame.draw.rect(screen, (255, 255, 255), (int(particle_xs[i]), int(particle_ys[i]), 4, 4))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            mousepressed(mx, my, event.button)

    update(dt)

    screen.fill((0, 0, 0))
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()