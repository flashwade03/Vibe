import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Gravity Well")
clock = pygame.time.Clock()

# Particle properties
px = []
py = []
pvx = []
pvy = []

# Gravity well properties
well_x = 400.0
well_y = 300.0
well_strength = 5000.0

def load():
    global px, py, pvx, pvy
    for _ in range(50):
        px.append(random.uniform(0.0, 800.0))
        py.append(random.uniform(0.0, 600.0))
        pvx.append(random.uniform(-30.0, 30.0))
        pvy.append(random.uniform(-30.0, 30.0))

def mousepressed(mx, my, button):
    global well_x, well_y
    well_x = mx
    well_y = my

def update(dt):
    global px, py, pvx, pvy
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
    font = pygame.font.Font(None, 36)
    text = font.render("Particles: 50", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    text = font.render("Click to move well", True, (255, 255, 255))
    screen.blit(text, (10, 30))
    pygame.display.flip()

load()
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
    draw()

pygame.quit()
sys.exit()