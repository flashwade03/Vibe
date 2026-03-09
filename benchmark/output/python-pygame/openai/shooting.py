import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Game")
clock = pygame.time.Clock()

# Player variables
player_x, player_y = 384.0, 550.0
player_speed = 200

# Bullet variables
bullet_speed = 300
bullet_xs = []
bullet_ys = []

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                bullet_xs.append(player_x + 16)  # Center of the player
                bullet_ys.append(player_y)

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= player_speed * dt
    if keys[pygame.K_RIGHT]:
        player_x += player_speed * dt

    # Update bullet positions
    for i in range(len(bullet_ys)):
        bullet_ys[i] -= bullet_speed * dt

    screen.fill((0, 0, 0))
    # Draw player
    pygame.draw.rect(screen, (255, 255, 255), (int(player_x), int(player_y), 32, 32))
    # Draw bullets
    for i in range(len(bullet_xs)):
        pygame.draw.rect(screen, (255, 255, 255), (int(bullet_xs[i]), int(bullet_ys[i]), 4, 4))

    pygame.display.flip()

pygame.quit()
sys.exit()