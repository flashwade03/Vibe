import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Patrol")
clock = pygame.time.Clock()

# Waypoints
wp_xs = [100.0, 700.0, 700.0, 100.0]
wp_ys = [100.0, 100.0, 500.0, 500.0]

# Patrol variables
patrol_x = 100.0
patrol_y = 100.0
current_wp = 1
patrol_speed = 120.0

font = pygame.font.Font(None, 36)

def update(dt):
    global patrol_x, patrol_y, current_wp

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

def draw():
    screen.fill((0, 0, 0))

    # Draw waypoints
    for i in range(4):
        pygame.draw.rect(screen, (255, 255, 255), (wp_xs[i] - 4.0, wp_ys[i] - 4.0, 8, 8))

    # Draw patrol enemy
    pygame.draw.rect(screen, (255, 255, 255), (patrol_x - 12.0, patrol_y - 12.0, 24, 24))

    # Draw waypoint text
    text = font.render("Waypoint: " + str(current_wp), True, (255, 255, 255))
    screen.blit(text, (10.0, 10.0))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()