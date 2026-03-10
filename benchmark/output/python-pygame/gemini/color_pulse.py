import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Pulsing Grid")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

timer = 0.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    timer += dt

    # Draw logic
    screen.fill((0, 0, 0))
    
    for row in range(0, 4):
        for col in range(0, 5):
            cx = 100.0 + float(col) * 160.0
            cy = 100.0 + float(row) * 150.0
            phase = float(row * 5 + col) * 0.5
            radius = 20.0 + 15.0 * math.sin(timer * 3.0 + phase)
            
            pygame.draw.circle(screen, (255, 255, 255), (int(cx), int(cy)), int(radius))

    text = font.render("Time: " + str(int(timer)), True, (255, 255, 255))
    screen.blit(text, (10.0, 10.0))

    pygame.display.flip()

pygame.quit()
sys.exit()