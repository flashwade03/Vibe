import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Particle Burst")
clock = pygame.time.Clock()

# Particle data lists
particle_xs = []
particle_ys = []
particle_vxs = []
particle_vys = []
particle_lifes = []

def spawn_particles(mx, my):
    for _ in range(10):
        angle = random.uniform(0.0, 6.283)
        speed = random.uniform(50.0, 200.0)
        particle_xs.append(float(mx))
        particle_ys.append(float(my))
        particle_vxs.append(math.cos(angle) * speed)
        particle_vys.append(math.sin(angle) * speed)
        particle_lifes.append(2.0)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            spawn_particles(mx, my)

    # Update logic
    new_xs, new_ys, new_vxs, new_vys, new_lifes = [], [], [], [], []
    for i in range(len(particle_lifes)):
        if particle_lifes[i] > 0:
            new_xs.append(particle_xs[i] + particle_vxs[i] * dt)
            new_ys.append(particle_ys[i] + particle_vys[i] * dt)
            new_vxs.append(particle_vxs[i])
            new_vys.append(particle_vys[i])
            new_lifes.append(particle_lifes[i] - dt)
    
    particle_xs, particle_ys, particle_vxs, particle_vys, particle_lifes = new_xs, new_ys, new_vxs, new_vys, new_lifes

    # Draw logic
    screen.fill((0, 0, 0))
    for i in range(len(particle_lifes)):
        if particle_lifes[i] > 0:
            pygame.draw.rect(screen, (255, 255, 255), (int(particle_xs[i]), int(particle_ys[i]), 4, 4))
    
    pygame.display.flip()

pygame.quit()
sys.exit()