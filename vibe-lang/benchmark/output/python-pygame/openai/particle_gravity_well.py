import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Gravity Well")
clock = pygame.time.Clock()

# Particle state
px = [random.uniform(0.0, 800.0) for _ in range(50)]
py = [random.uniform(0.0, 600.0) for _ in range(50)]
pvx = [random.uniform(-30.0, 30.0) for _ in range(50)]
pvy = [random.uniform(-30.0, 30.0) for _ in range(50)]

# Gravity well state
well_x, well_y = 400.0, 300.0
well_strength = 5000.0

font = pygame.font.Font(None, 36)

def update(dt):
    global px, py, pvx, pvy, well_x, well_y, well_strength
    for i in range(50):
        dx = well_x - px[i]
        dy = well_y - py[i]
        dist = math.sqrt(dx * dx + dy * dy)
        if dist > 5.0:
            force = well_strength / (dist * dist)
            pvx[i] += dx / dist * force * dt
            pvy[i] += dy / dist * force * dt

        px[i] += pvx[i] * dt
        py[i] += pvy[i] * dt

        if px[i] < 0.0:
            px[i] = 800.0
        if px[i] > 800.0:
            px[i] = 0.0
        if py[i] < 0.0:
            py[i] = 600.0
        if py[i] > 600.0:
            py[i] = 0.0

def draw():
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(well_x), int(well_y)), 8)
    for i in range(50):
        pygame.draw.rect(screen, (255, 255, 255), (int(px[i]), int(py[i]), 3, 3))
    text_particles = font.render("Particles: 50", True, (255, 255, 255))
    screen.blit(text_particles, (10, 10))
    text_click = font.render("Click to move well", True, (255, 255, 255))
    screen.blit(text_click, (10, 30))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            well_x, well_y = pygame.mouse.get_pos()

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()