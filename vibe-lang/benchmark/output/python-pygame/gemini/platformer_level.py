import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Platformer")
clock = pygame.time.Clock()

# Player state
px, py = 100.0, 400.0
vx, vy = 0.0, 0.0
speed = 250.0
gravity = 600.0
jump_vel = -350.0
on_ground = False

# Platforms
plat_xs = [50.0, 300.0, 500.0, 200.0, 450.0]
plat_ys = [450.0, 380.0, 300.0, 220.0, 150.0]
plat_ws = [200.0, 150.0, 180.0, 120.0, 200.0]

font = pygame.font.Font(None, 36)

running = True
while running:
    dt = clock.tick(60) / 1000.0
    prev_y = py

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    
    # Horizontal movement
    vx = 0
    if keys[pygame.K_LEFT]: vx = -speed
    if keys[pygame.K_RIGHT]: vx = speed
    px += vx * dt

    # Vertical movement
    vy += gravity * dt
    if keys[pygame.K_UP] and on_ground:
        vy = jump_vel
        on_ground = False
    py += vy * dt

    # Collision detection
    on_ground = False
    
    # Platform collisions
    for i in range(len(plat_xs)):
        if vy >= 0 and prev_y + 20 <= plat_ys[i]:
            if py + 20 >= plat_ys[i] and px + 20 > plat_xs[i] and px < plat_xs[i] + plat_ws[i]:
                py = plat_ys[i] - 20.0
                vy = 0
                on_ground = True
    
    # Ground collision
    if py + 20 >= 580:
        py = 580 - 20.0
        vy = 0
        on_ground = True

    # Reset if fallen
    if py > 620:
        px, py = 100.0, 400.0
        vy = 0

    # Draw
    screen.fill((0, 0, 0))
    
    # Draw platforms
    for i in range(len(plat_xs)):
        pygame.draw.rect(screen, (255, 255, 255), (plat_xs[i], plat_ys[i], plat_ws[i], 12))
    
    # Draw player
    pygame.draw.rect(screen, (255, 255, 255), (int(px), int(py), 20, 20))
    
    # Draw text
    text = font.render("Use arrows + up to jump", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    
    pygame.display.flip()

pygame.quit()
sys.exit()