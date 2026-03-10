import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe World with Minimap")
clock = pygame.time.Clock()

player_x, player_y = 1000.0, 1000.0
speed = 300

item_xs = []
item_ys = []

def load():
    for _ in range(20):
        item_xs.append(random.uniform(0, 2000))
        item_ys.append(random.uniform(0, 2000))

load()

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= speed * dt
    if keys[pygame.K_RIGHT]:
        player_x += speed * dt
    if keys[pygame.K_UP]:
        player_y -= speed * dt
    if keys[pygame.K_DOWN]:
        player_y += speed * dt

    screen.fill((0, 0, 0))

    # Draw items in camera space
    for i in range(20):
        draw_x = item_xs[i] - (player_x - 400.0)
        draw_y = item_ys[i] - (player_y - 300.0)
        if -20 <= draw_x <= 820 and -20 <= draw_y <= 620:
            pygame.draw.rect(screen, (255, 255, 255), (draw_x, draw_y, 10, 10))

    # Draw player in main view
    pygame.draw.rect(screen, (255, 255, 255), (400, 300, 16, 16))

    # Draw minimap background
    pygame.draw.rect(screen, (50, 50, 50), (630, 10, 160, 120))

    # Draw items on minimap
    for i in range(20):
        minimap_x = 630.0 + (item_xs[i] / 2000.0) * 160.0
        minimap_y = 10.0 + (item_ys[i] / 2000.0) * 120.0
        pygame.draw.rect(screen, (255, 255, 255), (minimap_x, minimap_y, 2, 2))

    # Draw player on minimap
    minimap_player_x = 630.0 + (player_x / 2000.0) * 160.0
    minimap_player_y = 10.0 + (player_y / 2000.0) * 120.0
    pygame.draw.rect(screen, (255, 0, 0), (minimap_player_x, minimap_player_y, 4, 4))

    # Display player position
    font = pygame.font.Font(None, 36)
    text = font.render(f"Pos: {int(player_x)}, {int(player_y)}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()