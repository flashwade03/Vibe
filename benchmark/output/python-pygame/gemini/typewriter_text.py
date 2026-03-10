import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Engine")
clock = pygame.time.Clock()
font = pygame.font.SysFont("Arial", 32)

# Game state variables
full_text = "Welcome to the Vibe engine!"
text_len = 27
char_index = 0
char_timer = 0.0
char_speed = 0.08

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                char_index = 0
                char_timer = 0.0

    # Update logic
    if char_index < text_len:
        char_timer += dt
        if char_timer >= char_speed:
            char_timer -= char_speed
            char_index += 1

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw text
    text_surface = font.render(full_text, True, (255, 255, 255))
    screen.blit(text_surface, (100, 280))
    
    # Draw covering rectangle
    cover_x = 100.0 + float(char_index) * 10.0
    pygame.draw.rect(screen, (0, 0, 0), (int(cover_x), 270, 700, 30))
    
    # Draw cursor
    if math.sin(char_timer * 10.0) > 0.0:
        pygame.draw.rect(screen, (255, 255, 255), (int(cover_x), 275, 2, 20))
        
    # Display stats
    stats_text = font.render(f"Chars: {char_index}/{text_len}", True, (255, 255, 255))
    screen.blit(stats_text, (10, 10))
    
    if char_index >= text_len:
        done_text = font.render("Done!", True, (255, 255, 255))
        screen.blit(done_text, (10, 30))

    pygame.display.flip()

pygame.quit()
sys.exit()