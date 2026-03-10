import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe World")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state
player_x, player_y = 1000.0, 1000.0
speed = 300.0
item_xs = []
item_ys = []

# Load items
for i in range(20):
    item_xs.append(random.uniform(0, 2000))
    item_ys.append(random.uniform(0, 2000))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]: player_x -= speed * dt
    if keys[pygame.K_RIGHT]: player_x += speed * dt
    if keys[pygame.K_UP]: player_y -= speed * dt
    if keys[pygame.K_DOWN]: player_y += speed * dt

    # Keep player in bounds
    player_x = max(0, min(2000, player_x))
    player_y = max(0, min(2000, player_y))

    screen.fill((0, 0, 0))

    # Draw items in camera space
    cam_x = player_x - 400.0
    cam_y = player_y - 300.0

    for i in range(20):
        draw_x = item_xs[i] - cam_x
        draw_y = item_ys[i] - cam_y
        
        if -20 <= draw_x <= 820 and -20 <= draw_y <= 620:
            pygame.draw.rect(screen, (0, 255, 0), (int(draw_x), int(draw_y), 10, 10))

    # Draw player in main view
    pygame.draw.rect(screen, (255, 255, 255), (400 - 8, 300 - 8, 16, 16))

    # Draw Minimap
    pygame.draw.rect(screen, (50, 50, 50), (630, 10, 160, 120))
    for i in range(20):
        mx = 630.0 + (item_xs[i] / 2000.0) * 160.0
        my = 10.0 + (item_ys[i] / 2000.0) * 120.0
        pygame.draw.rect(screen, (0, 255, 0), (int(mx), int(my), 2, 2))
    
    pmx = 630.0 + (player_x / 2000.0) * 160.0
    pmy = 10.0 + (player_y / 2000.0) * 120.0
    pygame.draw.rect(screen, (255, 255, 255), (int(pmx), int(pmy), 4, 4))

    # UI
    text = font.render(f"Pos: {int(player_x)}, {int(player_y)}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()