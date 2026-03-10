import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Program")
clock = pygame.time.Clock()

# Player state
player_x, player_y = 400.0, 300.0
player_radius = 20
player_speed = 150

# Enemy state
enemy_radius = 15
enemy_xs = [100.0, 700.0, 200.0, 600.0, 400.0]
enemy_ys = [100.0, 100.0, 400.0, 400.0, 500.0]

# Collision state
hit = False

font = pygame.font.Font(None, 36)

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

    # Reset hit status
    hit = False

    # Check for collisions
    for ex, ey in zip(enemy_xs, enemy_ys):
        distance = math.sqrt((player_x - ex) ** 2 + (player_y - ey) ** 2)
        if distance < player_radius + enemy_radius:
            hit = True
            break

    screen.fill((0, 0, 0))

    # Draw player
    pygame.draw.circle(screen, (255, 255, 255), (int(player_x), int(player_y)), player_radius)

    # Draw enemies
    for ex, ey in zip(enemy_xs, enemy_ys):
        pygame.draw.circle(screen, (255, 255, 255), (int(ex), int(ey)), enemy_radius)

    # Draw hit text
    if hit:
        text = font.render("Hit!", True, (255, 255, 255))
        screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()