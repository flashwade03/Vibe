import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Patrol Game")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Waypoints
wp_xs = [100.0, 700.0, 700.0, 100.0]
wp_ys = [100.0, 100.0, 500.0, 500.0]

# Patrol state
patrol_x = 100.0
patrol_y = 100.0
current_wp = 1
patrol_speed = 120.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    dx = wp_xs[current_wp] - patrol_x
    dy = wp_ys[current_wp] - patrol_y
    dist = math.sqrt(dx * dx + dy * dy)

    if dist > 2.0:
        patrol_x += (dx / dist) * patrol_speed * dt
        patrol_y += (dy / dist) * patrol_speed * dt
    else:
        current_wp += 1
        if current_wp >= 4:
            current_wp = 0

    # Draw logic
    screen.fill((0, 0, 0))

    # Draw waypoints
    for i in range(len(wp_xs)):
        pygame.draw.rect(screen, (100, 100, 100), (wp_xs[i] - 4.0, wp_ys[i] - 4.0, 8, 8))

    # Draw enemy
    pygame.draw.rect(screen, (255, 255, 255), (int(patrol_x - 12.0), int(patrol_y - 12.0), 24, 24))

    # Draw text
    text = font.render("Waypoint: " + str(current_wp), True, (255, 255, 255))
    screen.blit(text, (10.0, 10.0))

    pygame.display.flip()

pygame.quit()
sys.exit()