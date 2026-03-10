import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Gravity Well")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Particle state
num_particles = 50
px = [random.uniform(0.0, 800.0) for _ in range(num_particles)]
py = [random.uniform(0.0, 600.0) for _ in range(num_particles)]
pvx = [random.uniform(-30.0, 30.0) for _ in range(num_particles)]
pvy = [random.uniform(-30.0, 30.0) for _ in range(num_particles)]

# Gravity well state
well_x = 400.0
well_y = 300.0
well_strength = 5000.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            well_x, well_y = float(mx), float(my)

    # Update logic
    for i in range(num_particles):
        dx = well_x - px[i]
        dy = well_y - py[i]
        dist = math.sqrt(dx * dx + dy * dy)
        
        if dist > 5.0:
            force = well_strength / (dist * dist)
            pvx[i] += (dx / dist) * force * dt
            pvy[i] += (dy / dist) * force * dt
        
        px[i] += pvx[i] * dt
        py[i] += pvy[i] * dt
        
        # Wrap around edges
        if px[i] < 0.0: px[i] = 800.0
        elif px[i] > 800.0: px[i] = 0.0
        
        if py[i] < 0.0: py[i] = 600.0
        elif py[i] > 600.0: py[i] = 0.0

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw well
    pygame.draw.circle(screen, (255, 255, 255), (int(well_x), int(well_y)), 8)
    
    # Draw particles
    for i in range(num_particles):
        pygame.draw.rect(screen, (255, 255, 255), (int(px[i]), int(py[i]), 3, 3))
        
    # Draw text
    text1 = font.render("Particles: 50", True, (255, 255, 255))
    text2 = font.render("Click to move well", True, (255, 255, 255))
    screen.blit(text1, (10, 10))
    screen.blit(text2, (10, 30))

    pygame.display.flip()

pygame.quit()
sys.exit()