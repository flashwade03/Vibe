import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Key Press Tracker")
clock = pygame.time.Clock()

font = pygame.font.Font(None, 36)

last_key = "none"
key_count = 0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            last_key = pygame.key.name(event.key)
            key_count += 1

    screen.fill((0, 0, 0))

    last_key_text = font.render("Last Key: " + last_key, True, (255, 255, 255))
    screen.blit(last_key_text, (250.0, 250.0))

    key_count_text = font.render("Total Presses: " + str(key_count), True, (255, 255, 255))
    screen.blit(key_count_text, (250.0, 290.0))

    pygame.draw.rect(screen, (255, 255, 255), (300.0, 350.0, 200.0, 80.0), 2)
    last_key_in_rect_text = font.render(last_key, True, (255, 255, 255))
    screen.blit(last_key_in_rect_text, (370.0, 380.0))

    pygame.display.flip()

pygame.quit()
sys.exit()