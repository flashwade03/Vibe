import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Program")
clock = pygame.time.Clock()

player_x, player_y = 400.0, 300.0
enemy_x, enemy_y = 100.0, 100.0
player_speed = 200
enemy_speed = 100

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= player_speed * dt
    if keys[pygame.K_RIGHT]:
        player_x += player_speed * dt
    if keys[pygame.K_UP]:
        player_y -= player_speed * dt
    if keys[pygame.K_DOWN]:
        player_y += player_speed * dt

    # Calculate direction vector from enemy to player
    dx = player_x - enemy_x
    dy = player_y - enemy_y
    distance = math.sqrt(dx * dx + dy * dy)

    # Normalize direction and move enemy
    if distance > 1.0:
        dx /= distance
        dy /= distance
        enemy_x += dx * enemy_speed * dt
        enemy_y += dy * enemy_speed * dt

    screen.fill((0, 0, 0))
    # Draw enemy first
    pygame.draw.rect(screen, (255, 0, 0), (int(enemy_x), int(enemy_y), 32, 32))
    # Draw player on top
    pygame.draw.rect(screen, (0, 0, 255), (int(player_x), int(player_y), 32, 32))
    pygame.display.flip()

pygame.quit()
sys.exit()