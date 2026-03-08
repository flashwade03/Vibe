import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Program")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Player state
px, py = 400.0, 300.0
player_radius = 20
speed = 150.0

# Enemy state
enemy_xs = [100.0, 700.0, 200.0, 600.0, 400.0]
enemy_ys = [100.0, 100.0, 400.0, 400.0, 500.0]
enemy_radius = 15

hit = False

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Reset hit state
    hit = False

    # Input handling
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        px -= speed * dt
    if keys[pygame.K_RIGHT]:
        px += speed * dt
    if keys[pygame.K_UP]:
        py -= speed * dt
    if keys[pygame.K_DOWN]:
        py += speed * dt

    # Collision detection
    for i in range(len(enemy_xs)):
        ex = enemy_xs[i]
        ey = enemy_ys[i]
        distance = math.sqrt((px - ex)**2 + (py - ey)**2)
        if distance < (player_radius + enemy_radius):
            hit = True

    # Drawing
    screen.fill((0, 0, 0))

    # Draw player
    pygame.draw.circle(screen, (255, 255, 255), (int(px), int(py)), player_radius)

    # Draw enemies
    for i in range(len(enemy_xs)):
        pygame.draw.circle(screen, (255, 255, 255), (int(enemy_xs[i]), int(enemy_ys[i])), enemy_radius)

    # Draw UI
    if hit:
        text = font.render("Hit!", True, (255, 255, 255))
        screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()