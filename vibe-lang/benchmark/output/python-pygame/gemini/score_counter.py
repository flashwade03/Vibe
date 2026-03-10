import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Score Clicker")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

score = 0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        # Handling key press event for spacebar
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                score += 1

    # Rendering
    screen.fill((0, 0, 0))
    
    # Draw score
    score_text = font.render("Score: " + str(score), True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    
    pygame.display.flip()

pygame.quit()
sys.exit()