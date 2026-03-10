import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Text Reveal")
clock = pygame.time.Clock()

full_text = "Welcome to the Vibe engine!"
text_len = 27
char_index = 0
char_timer = 0.0
char_speed = 0.08

font = pygame.font.Font(None, 36)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                char_index = 0
                char_timer = 0.0

    if char_index < text_len:
        char_timer += dt
        if char_timer >= char_speed:
            char_timer -= char_speed
            char_index += 1

    screen.fill((0, 0, 0))
    
    # Draw revealed text
    text_surface = font.render(full_text[:char_index], True, (255, 255, 255))
    screen.blit(text_surface, (100, 280))
    
    # Draw covering rectangle
    cover_x = 100.0 + float(char_index) * 10.0
    pygame.draw.rect(screen, (0, 0, 0), (cover_x, 270.0, 700.0, 30.0))
    
    # Draw cursor
    if math.sin(char_timer * 10.0) > 0.0:
        pygame.draw.rect(screen, (255, 255, 255), (cover_x, 275.0, 2.0, 20.0))
    
    # Draw character count
    char_count_text = f"Chars: {char_index}/{text_len}"
    char_count_surface = font.render(char_count_text, True, (255, 255, 255))
    screen.blit(char_count_surface, (10.0, 10.0))
    
    # Draw "Done!" message
    if char_index >= text_len:
        done_surface = font.render("Done!", True, (255, 255, 255))
        screen.blit(done_surface, (10.0, 30.0))

    pygame.display.flip()

pygame.quit()
sys.exit()