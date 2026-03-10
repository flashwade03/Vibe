import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Chain Reaction")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
num_circles = 30
cx = []
cy = []
cstate = []  # 0.0=idle, 1.0=exploding, 2.0=done
cradius = []
ctimer = []

def load():
    for _ in range(num_circles):
        cx.append(random.uniform(50.0, 750.0))
        cy.append(random.uniform(50.0, 550.0))
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
        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            for i in range(num_circles):
                if cstate[i] == 0.0:
                    dist = math.hypot(mx - cx[i], my - cy[i])
                    if dist < 15.0:
                        cstate[i] = 1.0

    # Update logic
    for i in range(num_circles):
        if cstate[i] == 1.0:
            cradius[i] += 80.0 * dt
            ctimer[i] += dt
            if ctimer[i] > 1.0:
                cstate[i] = 2.0
            
            # Check for chain reaction
            for j in range(num_circles):
                if cstate[j] == 0.0:
                    dist = math.hypot(cx[i] - cx[j], cy[i] - cy[j])
                    if dist < cradius[i] + 15.0:
                        cstate[j] = 1.0

    # Count exploded
    exploded_count = sum(1 for s in cstate if s > 0.0)

    # Draw logic
    screen.fill((0, 0, 0))
    for i in range(num_circles):
        if cstate[i] == 0.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), 15)
        elif cstate[i] == 1.0:
            pygame.draw.circle(screen, (255, 0, 0), (int(cx[i]), int(cy[i])), int(cradius[i]))
        elif cstate[i] == 2.0:
            pygame.draw.circle(screen, (100, 100, 100), (int(cx[i]), int(cy[i])), 3)

    text = font.render(f"Exploded: {exploded_count}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()