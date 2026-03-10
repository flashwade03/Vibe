import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Key Press Tracker")
clock = pygame.time.Clock()

last_key = "none"
key_count = 0
font = pygame.font.Font(None, 36)

def keypressed(k):
    global last_key, key_count
    last_key = k
    key_count += 1

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            keypressed(pygame.key.name(event.key))

    screen.fill((0, 0, 0))
    text_last_key = font.render("Last Key: " + last_key, True, (255, 255, 255))
    text_key_count = font.render("Total Presses: " + str(key_count), True, (255, 255, 255))
    text_in_box = font.render(last_key, True, (255, 255, 255))

    screen.blit(text_last_key, (250, 250))
    screen.blit(text_key_count, (250, 290))
    pygame.draw.rect(screen, (255, 255, 255), (300, 350, 200, 80), 2)
    screen.blit(text_in_box, (370, 380))

    pygame.display.flip()

pygame.quit()
sys.exit()