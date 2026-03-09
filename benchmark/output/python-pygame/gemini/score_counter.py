import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Score Counter")
clock = pygame.time.Clock()

font = pygame.font.Font(None, 36)
score = 0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                score += 1

    screen.fill((0, 0, 0))
    
    score_text = "Score: " + str(score)
    text_surface = font.render(score_text, True, (255, 255, 255))
    screen.blit(text_surface, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()