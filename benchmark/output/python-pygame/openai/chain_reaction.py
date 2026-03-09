import pygame
import sys
import random
import math

def rand_float(min_val, max_val):
    return random.uniform(min_val, max_val)

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Chain Reaction")
clock = pygame.time.Clock()

# Initialize circle data
cx, cy = [], []
cstate = []
cradius = []
ctimer = []

def load():
    for i in range(30):
        cx.append(rand_float(50.0, 750.0))
        cy.append(rand_float(50.0, 550.0))
        cstate.append(0.0)
        cradius.append(15.0)
        ctimer.append(0.0)

load()

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            for i in range(30):
                if cstate[i] == 0.0:
                    dist = math.hypot(cx[i] - mx, cy[i] - my)
                    if dist <= 15.0:
                        cstate[i] = 1.0
                        break

    # Update logic
    for i in range(30):
        if cstate[i] == 1.0:
            cradius[i] += 80.0 * dt
            ctimer[i] += dt
            if ctimer[i] > 1.0:
                cstate[i] = 2.0
            for j in range(30):
                if cstate[j] == 0.0:
                    dist = math.hypot(cx[i] - cx[j], cy[i] - cy[j])
                    if dist < cradius[i] + 15.0:
                        cstate[j] = 1.0

    # Draw logic
    screen.fill((0, 0, 0))
    exploded_count = 0
    for i in range(30):
        if cstate[i] == 0.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), 15)
        elif cstate[i] == 1.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), int(cradius[i]))
        elif cstate[i] == 2.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), 3)
        if cstate[i] > 0.0:
            exploded_count += 1

    font = pygame.font.Font(None, 36)
    text = font.render(f"Exploded: {exploded_count}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()