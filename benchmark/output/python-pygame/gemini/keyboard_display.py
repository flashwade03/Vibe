import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Key Tracker")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
last_key = "none"
key_count = 0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        # Key pressed logic
        if event.type == pygame.KEYDOWN:
            last_key = pygame.key.name(event.key)
            key_count += 1

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Display text
    text_last = font.render("Last Key: " + last_key, True, (255, 255, 255))
    screen.blit(text_last, (250, 250))
    
    text_count = font.render("Total Presses: " + str(key_count), True, (255, 255, 255))
    screen.blit(text_count, (250, 290))
    
    # Decorative rectangle
    pygame.draw.rect(screen, (255, 255, 255), (300, 350, 200, 80), 2)
    
    # Display key inside rectangle
    text_inside = font.render(last_key, True, (255, 255, 255))
    screen.blit(text_inside, (370, 380))

    pygame.display.flip()

pygame.quit()
sys.exit()