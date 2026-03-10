import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Simple Platformer")
clock = pygame.time.Clock()

# Player variables
player_x, player_y = 100.0, 400.0
player_vx, player_vy = 0.0, 0.0
gravity = 600.0
jump_velocity = -350.0
move_speed = 250.0
on_ground = False

# Platform data
plat_xs = [50.0, 300.0, 500.0, 200.0, 450.0]
plat_ys = [450.0, 380.0, 300.0, 220.0, 150.0]
plat_ws = [200.0, 150.0, 180.0, 120.0, 200.0]

font = pygame.font.Font(None, 36)

running = True
while running:
    dt = clock.tick(60) / 1000.0
    prev_y = player_y

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    player_vx = 0.0
    if keys[pygame.K_LEFT]:
        player_vx = -move_speed
    if keys[pygame.K_RIGHT]:
        player_vx = move_speed
    if keys[pygame.K_UP] and on_ground:
        player_vy = jump_velocity
        on_ground = False

    # Physics update
    player_x += player_vx * dt
    player_y += player_vy * dt
    player_vy += gravity * dt

    # Collision detection
    on_ground = False
    for i in range(len(plat_xs)):
        if (player_vy >= 0 and prev_y + 20 <= plat_ys[i] and
            player_y + 20 >= plat_ys[i] and
            player_x + 20 > plat_xs[i] and player_x < plat_xs[i] + plat_ws[i]):
            player_y = plat_ys[i] - 20.0
            player_vy = 0
            on_ground = True

    # Ground collision
    if player_y + 20 >= 580:
        player_y = 580 - 20
        player_vy = 0
        on_ground = True

    # Reset if player falls below screen
    if player_y > 620:
        player_x, player_y = 100.0, 400.0
        player_vy = 0.0

    # Drawing
    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(player_x), int(player_y), 20, 20))
    for i in range(len(plat_xs)):
        pygame.draw.rect(screen, (255, 255, 255), (int(plat_xs[i]), int(plat_ys[i]), int(plat_ws[i]), 12))
    text = font.render("Use arrows + up to jump", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    pygame.display.flip()

pygame.quit()
sys.exit()