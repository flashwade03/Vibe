import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Pulsing Rectangle")
clock = pygame.time.Clock()

frame = 0
frame_timer = 0.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    frame_timer += dt
    if frame_timer >= 0.25:
        frame_timer -= 0.25
        frame += 1
        if frame >= 4:
            frame = 0

    screen.fill((0, 0, 0))

    if frame == 0:
        pygame.draw.rect(screen, (255, 255, 255), (380, 280, 40, 40))
    elif frame == 1:
        pygame.draw.rect(screen, (255, 255, 255), (375, 275, 50, 50))
    elif frame == 2:
        pygame.draw.rect(screen, (255, 255, 255), (370, 270, 60, 60))
    elif frame == 3:
        pygame.draw.rect(screen, (255, 255, 255), (375, 275, 50, 50))

    font = pygame.font.Font(None, 36)
    text = font.render(f"Frame: {frame}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()