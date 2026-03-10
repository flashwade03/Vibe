import pygame
import sys
import math
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Particle Burst")
clock = pygame.time.Clock()

particle_xs = []
particle_ys = []
particle_vxs = []
particle_vys = []
particle_lifes = []

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = event.pos
            for _ in range(10):
                angle = random.uniform(0.0, 6.283)
                speed = random.uniform(50.0, 200.0)
                vx = math.cos(angle) * speed
                vy = math.sin(angle) * speed
                
                particle_xs.append(float(mx))
                particle_ys.append(float(my))
                particle_vxs.append(vx)
                particle_vys.append(vy)
                particle_lifes.append(2.0)

    for i in range(len(particle_lifes) - 1, -1, -1):
        particle_xs[i] += particle_vxs[i] * dt
        particle_ys[i] += particle_vys[i] * dt
        particle_lifes[i] -= dt
        
        if particle_lifes[i] <= 0.0:
            particle_xs.pop(i)
            particle_ys.pop(i)
            particle_vxs.pop(i)
            particle_vys.pop(i)
            particle_lifes.pop(i)

    screen.fill((0, 0, 0))
    
    for i in range(len(particle_lifes)):
        if particle_lifes[i] > 0.0:
            pygame.draw.rect(screen, (255, 255, 255), (int(particle_xs[i]), int(particle_ys[i]), 4, 4))

    pygame.display.flip()

pygame.quit()
sys.exit()