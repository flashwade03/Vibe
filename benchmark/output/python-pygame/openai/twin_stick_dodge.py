import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Dodge the Bullets")
clock = pygame.time.Clock()

# Player variables
player_x, player_y = 400.0, 300.0
player_speed = 300.0

# Bullet variables
bx, by, bvx, bvy, blife = [], [], [], [], []
spawn_timer = 0.3
bullet_speed = 250.0

# Game state variables
survived_time = 0.0
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

    # Keep player within bounds
    player_x = max(10, min(790, player_x))
    player_y = max(10, min(590, player_y))

    # Bullet spawning
    spawn_timer -= dt
    if spawn_timer <= 0:
        spawn_timer = 0.3
        edge = random.uniform(0.0, 4.0)
        if edge < 1.0:  # Top edge
            spawn_x = random.uniform(0.0, 800.0)
            spawn_y = 0.0
        elif edge < 2.0:  # Right edge
            spawn_x = 800.0
            spawn_y = random.uniform(0.0, 600.0)
        elif edge < 3.0:  # Bottom edge
            spawn_x = random.uniform(0.0, 800.0)
            spawn_y = 600.0
        else:  # Left edge
            spawn_x = 0.0
            spawn_y = random.uniform(0.0, 600.0)

        dx = player_x - spawn_x
        dy = player_y - spawn_y
        dist = math.sqrt(dx**2 + dy**2)
        if dist != 0:
            dx /= dist
            dy /= dist

        bx.append(spawn_x)
        by.append(spawn_y)
        bvx.append(dx * bullet_speed)
        bvy.append(dy * bullet_speed)
        blife.append(4.0)

    # Update bullets
    for i in range(len(bx)):
        bx[i] += bvx[i] * dt
        by[i] += bvy[i] * dt
        blife[i] -= dt

        # Check collision
        if math.sqrt((player_x - bx[i])**2 + (player_y - by[i])**2) < 13.0 and blife[i] > 0.0:
            hit = True

    survived_time += dt

    # Draw everything
    screen.fill((0, 0, 0))
    if not hit:
        pygame.draw.circle(screen, (255, 255, 255), (int(player_x), int(player_y)), 10)
        for i in range(len(bx)):
            if blife[i] > 0.0:
                pygame.draw.rect(screen, (255, 255, 255), (int(bx[i]), int(by[i]), 6, 6))
        text = font.render("Time: " + str(int(survived_time)), True, (255, 255, 255))
        screen.blit(text, (10, 10))
    else:
        text = font.render("HIT! Time: " + str(int(survived_time)), True, (255, 255, 255))
        screen.blit(text, (400 - text.get_width() // 2, 300 - text.get_height() // 2))

    pygame.display.flip()

pygame.quit()
sys.exit()