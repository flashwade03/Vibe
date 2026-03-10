import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Orbit Simulation")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Orbital data
orb_angles = [0.0, 2.094, 4.189]
orb_radii = [100.0, 160.0, 220.0]
orb_speeds = [1.5, 1.0, 0.6]

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    for i in range(3):
        orb_angles[i] += orb_speeds[i] * dt

    screen.fill((0, 0, 0))

    # Draw orbits
    for i in range(3):
        for j in range(36):
            angle = float(j) * 0.1745
            px = 400.0 + math.cos(angle) * orb_radii[i]
            py = 300.0 + math.sin(angle) * orb_radii[i]
            pygame.draw.circle(screen, (100, 100, 100), (int(px), int(py)), 1)

    # Draw sun
    pygame.draw.circle(screen, (255, 255, 0), (400, 300), 20)

    # Draw bodies
    for i in range(3):
        x = 400.0 + math.cos(orb_angles[i]) * orb_radii[i]
        y = 300.0 + math.sin(orb_angles[i]) * orb_radii[i]
        pygame.draw.circle(screen, (255, 255, 255), (int(x), int(y)), 10)

    # Draw text
    text = font.render("Angle: " + str(round(orb_angles[0], 2)), True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()