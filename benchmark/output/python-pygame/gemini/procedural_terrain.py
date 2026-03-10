import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Procedural Terrain")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
heights = []
h = 300.0
for i in range(80):
    h += random.uniform(-30.0, 30.0)
    h = max(100.0, min(500.0, h))
    heights.append(h)

scroll_timer = 0.0
scroll_speed = 60.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    scroll_timer += scroll_speed * dt
    if scroll_timer >= 10.0:
        scroll_timer -= 10.0
        for i in range(79):
            heights[i] = heights[i + 1]
        new_h = heights[78] + random.uniform(-30.0, 30.0)
        new_h = max(100.0, min(500.0, new_h))
        heights[79] = new_h

    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP]:
        scroll_speed += 50.0 * dt
    if keys[pygame.K_DOWN]:
        scroll_speed -= 50.0 * dt
    
    scroll_speed = max(20.0, min(200.0, scroll_speed))

    # Draw logic
    screen.fill((0, 0, 0))
    
    for i in range(80):
        pygame.draw.rect(screen, (255, 255, 255), (i * 10, int(heights[i]), 10, 600 - int(heights[i])))
    
    player_col = 20
    pygame.draw.rect(screen, (255, 0, 0), (player_col * 10 - 1, int(heights[player_col]) - 14, 12, 14))
    
    text_h = font.render("Height: " + str(int(heights[player_col])), True, (255, 255, 255))
    text_s = font.render("Speed: " + str(int(scroll_speed)), True, (255, 255, 255))
    screen.blit(text_h, (10, 10))
    screen.blit(text_s, (10, 30))

    pygame.display.flip()

pygame.quit()
sys.exit()