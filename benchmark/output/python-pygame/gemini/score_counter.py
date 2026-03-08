import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Score Counter")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

score = 0

def keypressed(k):
    global score
    if k == "space":
        score += 1

def draw_text(text, x, y):
    text_surface = font.render(text, True, (255, 255, 255))
    screen.blit(text_surface, (x, y))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                keypressed("space")

    screen.fill((0, 0, 0))
    
    # Render the score text every frame
    draw_text("Score: " + str(score), 10, 10)

    pygame.display.flip()

pygame.quit()
sys.exit()