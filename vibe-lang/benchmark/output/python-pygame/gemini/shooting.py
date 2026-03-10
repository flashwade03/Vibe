import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Shooter")
clock = pygame.time.Clock()

# Player state
player_x = 384.0
player_y = 550.0
player_speed = 200.0

# Bullet state
bullet_xs = []
bullet_ys = []
bullet_speed = 300.0

# Cooldown for shooting
last_shot_time = 0
shoot_delay = 0.25

running = True
while running:
    dt = clock.tick(60) / 1000.0
    current_time = pygame.time.get_ticks() / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Input handling
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] and player_x > 0:
        player_x -= player_speed * dt
    if keys[pygame.K_RIGHT] and player_x < 768:
        player_x += player_speed * dt
    
    # Shooting logic
    if keys[pygame.K_SPACE]:
        if current_time - last_shot_time > shoot_delay:
            bullet_xs.append(player_x + 14) # Center of 32px rect
            bullet_ys.append(player_y)
            last_shot_time = current_time

    # Update bullets
    for i in range(len(bullet_ys)):
        bullet_ys[i] -= bullet_speed * dt

    # Draw
    screen.fill((0, 0, 0))
    
    # Draw player
    pygame.draw.rect(screen, (255, 255, 255), (int(player_x), int(player_y), 32, 32))
    
    # Draw bullets
    for i in range(len(bullet_xs)):
        pygame.draw.rect(screen, (255, 255, 255), (int(bullet_xs[i]), int(bullet_ys[i]), 4, 4))

    pygame.display.flip()

pygame.quit()
sys.exit()