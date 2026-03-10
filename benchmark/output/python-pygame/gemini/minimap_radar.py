```python
import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Large World Minimap")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

player_x, player_y = 1000.0, 1000.0
speed = 300.0

item_xs = []
item_ys = []

def load():
    for i in range(20):
        item_xs.append(random.uniform(0.0, 2000.0))
        item_ys.append(random.uniform(0.0, 2000.0))

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

    # Clamp player to world bounds
    player_x = max(0.0, min(2000.0, player_x))
    player_y = max(0.0, min(2000.0, player_y))

    screen.fill((0, 0, 0))

    # Draw items in main view
    for i in range(20):
        draw_x = item_xs[i] - (player_x - 400.0)
        draw_y = item_ys[i] - (player_y - 300.0)
        
        if -20 <= draw_x <= 820 and -20 <= draw_y <= 620:
            pygame.draw.rect(screen, (255, 255, 255), (int(draw_x), int(draw_y), 10, 10))

    # Draw player in main view