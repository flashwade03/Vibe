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

# Game state variables
num_circles = 30
cx = [rand_float(50.0, 750.0) for _ in range(num_circles)]
cy = [rand_float(50.0, 550.0) for _ in range(num_circles)]
cradius = [15.0 for _ in range(num_circles)]
cstate = [0.0 for _ in range(num_circles)]
ctimer = [0.0 for _ in range(num_circles)]

font = pygame.font.Font(None, 36)

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
            for i in range(num_circles):
                if cstate[i] == 0.0 and distance(mx, my, cx[i], cy[i]) < 15.0:
                    cstate[i] = 1.0
                    break

    for i in range(num_circles):
        if cstate[i] == 1.0:
            cradius[i] += 80.0 * dt
            ctimer[i] += dt
            if ctimer[i] > 1.0:
                cstate[i] = 2.0
            for j in range(num_circles):
                if cstate[j] == 0.0 and distance(cx[i], cy[i], cx[j], cy[j]) < cradius[i] + 15.0:
                    cstate[j] = 1.0

    screen.fill((0, 0, 0))
    exploded_count = 0
    for i in range(num_circles):
        if cstate[i] == 0.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), 15)
        elif cstate[i] == 1.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), int(cradius[i]))
        elif cstate[i] == 2.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(cx[i]), int(cy[i])), 3)
            exploded_count += 1

    text = font.render(f"Exploded: {exploded_count}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()