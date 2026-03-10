import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Score Counter")
clock = pygame.time.Clock()

score = 0
font = pygame.font.Font(None, 36)

def keypressed(k):
    global score
    if k == "space":
        score += 1

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                keypressed("space")

    screen.fill((0, 0, 0))
    score_text = font.render("Score: " + str(score), True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    pygame.display.flip()

pygame.quit()
sys.exit()