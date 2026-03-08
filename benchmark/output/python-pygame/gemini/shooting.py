```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Program")
clock = pygame.time.Clock()

# Player state
player_x = 384.0
player_y = 550.0
player_speed = 200.0

# Bullet state (Parallel Lists)
bullet_xs = []
bullet_ys = []
bullet_speed = 300.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            # Check for spacebar press to shoot
            if event.key == pygame.K_SPACE:
                # Append player's center x and player's y
                bullet_xs.append(player_x + 16.0)
                bullet_ys.append(player_y)

    # Update logic
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= player_speed * dt
    if keys[pygame.K_RIGHT]:
        player_x += player_speed * dt

    # Update bullets: iterate through all bullets and move upward
    for i in range(len(bullet_ys)):
        bullet_ys[i] -= bullet_speed * dt

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw player as 32x32 rectangle
    pygame.draw.rect(screen, (255, 255, 255), (int(player_x), int(player_y), 32, 32))
    
    # Draw each bullet as a 4x4 rectangle
    for i in range(len(bullet_xs)):
        pygame.draw.rect(screen, (255, 255, 255), (int(bullet_xs[i]),