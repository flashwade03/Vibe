import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Program")
clock = pygame.time.Clock()

# Game state variables
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

    # Draw logic
    text_last_key = font.render("Last Key: " + last_key, True, (255, 255, 255))
    screen.blit(text_last_key, (250.0, 250.0))

    text_key_count = font.render("Total Presses: " + str(key_count), True, (255, 255, 255))
    screen.blit(text_key_count, (250.0, 290.0))

    pygame.draw.rect(screen, (255, 255, 255), (300.0, 350.0, 200.0, 80.0), 2)
    text_decorative = font.render(last_key, True, (255, 255, 255))
    screen.blit(text_decorative, (370.0, 380.0))

    pygame.display.flip()

pygame.quit()
sys.exit()