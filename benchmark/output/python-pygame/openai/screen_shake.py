import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Screen Shake Effect")
clock = pygame.time.Clock()

shake_x, shake_y = 0.0, 0.0
shake_timer = 0.0
shake_intensity = 0.0

font = pygame.font.Font(None, 36)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                shake_timer = 0.5
                shake_intensity = 15.0

    if shake_timer > 0.0:
        shake_timer -= dt
        shake_x = random.uniform(-shake_intensity, shake_intensity)
        shake_y = random.uniform(-shake_intensity, shake_intensity)
        shake_intensity = max(0.0, shake_intensity - 20.0 * dt)
    else:
        shake_x = 0.0
        shake_y = 0.0

    screen.fill((0, 0, 0))

    # Draw main rectangle
    pygame.draw.rect(screen, (255, 255, 255), (368.0 + shake_x, 268.0 + shake_y, 64.0, 64.0))

    # Draw corner markers
    pygame.draw.rect(screen, (255, 255, 255), (50.0 + shake_x, 50.0 + shake_y, 16.0, 16.0))
    pygame.draw.rect(screen, (255, 255, 255), (734.0 + shake_x, 50.0 + shake_y, 16.0, 16.0))
    pygame.draw.rect(screen, (255, 255, 255), (50.0 + shake_x, 534.0 + shake_y, 16.0, 16.0))
    pygame.draw.rect(screen, (255, 255, 255), (734.0 + shake_x, 534.0 + shake_y, 16.0, 16.0))

    # Draw text
    text = font.render("Press SPACE to shake", True, (255, 255, 255))
    screen.blit(text, (280.0 + shake_x, 550.0 + shake_y))

    pygame.display.flip()

pygame.quit()
sys.exit()