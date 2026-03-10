import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Falling Rectangles")
clock = pygame.time.Clock()

# Initialize box properties
box_xs = [80.0 + float(i) * 110.0 for i in range(6)]
box_ys = [random.uniform(50.0, 200.0) for _ in range(6)]
box_vys = [0.0 for _ in range(6)]
box_ws = [random.uniform(30.0, 60.0) for _ in range(6)]
box_hs = [random.uniform(30.0, 60.0) for _ in range(6)]

# Initialize platform properties
plat_xs = [50.0, 300.0, 550.0]
plat_ys = [450.0, 350.0, 450.0]
plat_ws = [200.0, 200.0, 200.0]

def reset_boxes():
    for i in range(6):
        box_ys[i] = random.uniform(50.0, 200.0)
        box_vys[i] = 0.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                reset_boxes()

    # Update logic
    for i in range(6):
        box_vys[i] += 300.0 * dt
        box_ys[i] += box_vys[i] * dt

        # Floor collision
        if box_ys[i] + box_hs[i] > 580.0:
            box_ys[i] = 580.0 - box_hs[i]
            box_vys[i] = 0.0

        # Platform collision
        for j in range(3):
            if (box_vys[i] >= 0.0 and
                box_xs[i] + box_ws[i] > plat_xs[j] and
                box_xs[i] < plat_xs[j] + plat_ws[j] and
                box_ys[i] + box_hs[i] >= plat_ys[j] and
                box_ys[i] + box_hs[i] <= plat_ys[j] + 20.0):
                box_ys[i] = plat_ys[j] - box_hs[i]
                box_vys[i] = 0.0

    # Box-box collision
    for i in range(6):
        for j in range(i + 1, 6):
            if (box_xs[i] < box_xs[j] + box_ws[j] and
                box_xs[i] + box_ws[i] > box_xs[j] and
                box_ys[i] < box_ys[j] + box_hs[j] and
                box_ys[i] + box_hs[i] > box_ys[j]):
                overlap = (box_xs[i] + box_ws[i]) - box_xs[j]
                if overlap > 0.0:
                    box_xs[i] -= overlap * 0.5
                    box_xs[j] += overlap * 0.5

    # Draw logic
    screen.fill((0, 0, 0))
    for i in range(6):
        pygame.draw.rect(screen, (255, 255, 255), (box_xs[i], box_ys[i], box_ws[i], box_hs[i]))
    for j in range(3):
        pygame.draw.rect(screen, (255, 255, 255), (plat_xs[j], plat_ys[j], plat_ws[j], 15.0))
    font = pygame.font.Font(None, 36)
    text = font.render("Space: Reset", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()