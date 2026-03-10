import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Pulsing Rectangle")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
frame = 0
frame_timer = 0.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    frame_timer += dt
    if frame_timer >= 0.25:
        frame_timer -= 0.25
        frame += 1
        if frame >= 4:
            frame = 0

    # Draw logic
    screen.fill((0, 0, 0))
    
    if frame == 0:
        rect = (380.0, 280.0, 40.0, 40.0)
    elif frame == 1:
        rect = (375.0, 275.0, 50.0, 50.0)
    elif frame == 2:
        rect = (370.0, 270.0, 60.0, 60.0)
    else: # frame == 3
        rect = (375.0, 275.0, 50.0, 50.0)
        
    pygame.draw.rect(screen, (255, 255, 255), rect)
    
    text = font.render("Frame: " + str(frame), True, (255, 255, 255))
    screen.blit(text, (10.0, 10.0))

    pygame.display.flip()

pygame.quit()
sys.exit()