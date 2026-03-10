import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Chain Reaction")
clock = pygame.time.Clock()

# Constants
NUM_CIRCLES = 30
INITIAL_RADIUS = 15.0
EXPLOSION_RADIUS = 80.0
EXPLOSION_TIME = 1.0

# Game state variables
cx = [random.uniform(50.0, 750.0) for _ in range(NUM_CIRCLES)]
cy = [random.uniform(50.0, 550.0) for _ in range(NUM_CIRCLES)]
cstate = [0.0] * NUM_CIRCLES
cradius = [INITIAL_RADIUS] * NUM_CIRCLES
ctimer = [0.0] * NUM_CIRCLES

def distance(x1, y1, x2, y2):
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            for i in range(NUM_CIRCLES):
                if cstate[i] == 0.0 and distance(mx, my, cx[i], cy[i]) < INITIAL_RADIUS:
                    cstate[i] = 1.0
                    break

    # Update logic
    for i in range(NUM_CIRCLES):
        if cstate[i] == 1.0:
            cradius[i] += EXPLOSION_RADIUS * dt
            ctimer[i] += dt
            if ctimer[i] > EXPLOSION_TIME:
                cstate[i] = 2.0
            else:
                for j in range(NUM_CIRCLES):
                    if cstate[j] == 0.0:
                        if distance(cx[i], cy[i], cx[j], cy[j]) < cradius[i] + INITIAL_RADIUS:
                            cstate[j] = 1.0

    # Draw logic
    screen.fill((0, 0, 0))
    for i in range(NUM_CIRCLES):
        if cstate[i] == 0.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), int(INITIAL_RADIUS))
        elif cstate[i] == 1.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), int(cradius[i])))
        elif cstate[i] == 2.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), 3)

    # Count exploded circles
    exploded_count = sum(1 for state in cstate if state > 0.0)
    font = pygame.font.Font(None, 36)
    text = font.render(f"Exploded: {exploded_count}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()