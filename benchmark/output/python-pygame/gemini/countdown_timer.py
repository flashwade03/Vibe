import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Countdown Timer")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 72)

# Game state variables
timer = 30.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    if timer > 0.0:
        timer -= dt
        if timer < 0.0:
            timer = 0.0

    # Draw logic
    screen.fill((0, 0, 0))
    
    if timer > 0.0:
        text_surface = font.render(str(int(timer)), True, (255, 255, 255))
        screen.blit(text_surface, (350, 280))
    else:
        text_surface = font.render("Time Up!", True, (255, 255, 255))
        screen.blit(text_surface, (330, 280))

    pygame.display.flip()

pygame.quit()
sys.exit()