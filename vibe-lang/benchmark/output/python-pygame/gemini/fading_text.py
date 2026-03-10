import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Blinking Text")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 48)

timer = 0.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    timer += dt
    vis = math.sin(timer * 2.0)

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw blinking text
    if vis > 0.0:
        text_surface = font.render("Hello Vibe!", True, (255, 255, 255))
        screen.blit(text_surface, (300.0, 280.0))
    
    # Draw timer text
    timer_surface = font.render("Time: " + str(int(timer)), True, (255, 255, 255))
    screen.blit(timer_surface, (10.0, 10.0))

    pygame.display.flip()

pygame.quit()
sys.exit()