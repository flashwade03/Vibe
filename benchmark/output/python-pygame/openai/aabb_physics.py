import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Falling Rectangles")
clock = pygame.time.Clock()

# Initialize box properties
box_xs = []
box_ys = []
box_vys = []
box_ws = []
box_hs = []

def load():
    for i in range(6):
        box_xs.append(80.0 + float(i) * 110.0)
        box_ys.append(random.uniform(50.0, 200.0))
        box_vys.append(0.0)
        box_ws.append(random.uniform(30.0, 60.0))
        box_hs.append(random.uniform(30.0, 60.0))

# Initialize platform properties
plat_xs = [50.0, 300.0, 550.0]
plat_ys = [450.0, 350.0, 450.0]
plat_ws = [200.0, 200.0, 200.0]

def update(dt):
    for i in range(6):
        # Apply gravity
        box_vys[i] += 300.0 * dt
        box_ys[i] += box_vys[i] * dt

        # Check collision with floor
        if box_ys[i] + box_hs[i] > 580.0:
            box_ys[i] = 580.0 - box_hs[i]
            box_vys[i] = 0.0

        # Check collision with platforms
        for j in range(3):
            if (box_vys[i] >= 0.0 and
                box_xs[i] + box_ws[i] > plat_xs[j] and
                box_xs[i] < plat_xs[j] + plat_ws[j] and
                box_ys[i] + box_hs[i] >= plat_ys[j] and
                box_ys[i] + box_hs[i] <= plat_ys[j] + 20.0):
                box_ys[i] = plat_ys[j] - box_hs[i]
                box_vys[i] = 0.0

    # Box-box push
    for i in range(6):
        for j in range(6):
            if j > i and (box_xs[i] < box_xs[j] + box_ws[j] and
                          box_xs[i] + box_ws[i] > box_xs[j] and
                          box_ys[i] < box_ys[j] + box_hs[j] and
                          box_ys[i] + box_hs[i] > box_ys[j]):
                ov = (box_xs[i] + box_ws[i]) - box_xs[j]
                if ov > 0.0:
                    box_xs[i] -= ov * 0.5
                    box_xs[j] += ov * 0.5

def keypressed(key):
    if key == pygame.K_SPACE:
        for i in range(6):
            box_ys[i] = random.uniform(50.0, 200.0)
            box_vys[i] = 0.0

def draw():
    screen.fill((0, 0, 0))
    for i in range(6):
        pygame.draw.rect(screen, (255, 255, 255), (box_xs[i], box_ys[i], box_ws[i], box_hs[i]))
    for j in range(3):
        pygame.draw.rect(screen, (255, 255, 255), (plat_xs[j], plat_ys[j], plat_ws[j], 15.0))
    font = pygame.font.Font(None, 36)
    text = font.render("Space: Reset", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    pygame.display.flip()

load()
running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            keypressed(event.key)

    update(dt)
    draw()

pygame.quit()
sys.exit()