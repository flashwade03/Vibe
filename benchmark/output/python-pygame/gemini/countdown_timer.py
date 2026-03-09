import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Countdown Timer")
clock = pygame.time.Clock()

font = pygame.font.Font(None, 36)
timer = 30.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    timer -= dt
    if timer < 0.0:
        timer = 0.0

    screen.fill((0, 0, 0))

    if timer > 0.0:
        text = font.render(str(int(timer)), True, (255, 255, 255))
        screen.blit(text, (350, 280))
    else:
        text = font.render("Time Up!", True, (255, 255, 255))
        screen.blit(text, (330, 280))

    pygame.display.flip()

pygame.quit()
sys.exit()