import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Dodge the Bullets")
clock = pygame.time.Clock()

player_x, player_y = 400.0, 300.0
player_speed = 300.0

bx, by, bvx, bvy, blife = [], [], [], [], []
spawn_timer = 0.3
survived_time = 0.0
hit = False

font = pygame.font.Font(None, 36)

def spawn_bullet():
    edge = random.uniform(0.0, 4.0)
    if edge < 1.0:  # Top edge
        spawn_x = random.uniform(0, 800)
        spawn_y = 0
    elif edge < 2.0:  # Right edge
        spawn_x = 800
        spawn_y = random.uniform(0, 600)
    elif edge < 3.0:  # Bottom edge
        spawn_x = random.uniform(0, 800)
        spawn_y = 600
    else:  # Left edge
        spawn_x = 0
        spawn_y = random.uniform(0, 600)

    dx = player_x - spawn_x
    dy = player_y - spawn_y
    dist = math.sqrt(dx * dx + dy * dy)
    if dist != 0:
        dx /= dist
        dy /= dist

    speed = 250.0
    bx.append(spawn_x)
    by.append(spawn_y)
    bvx.append(dx * speed)
    bvy.append(dy * speed)
    blife.append(4.0)

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

    spawn_timer -= dt
    if spawn_timer <= 0:
        spawn_bullet()
        spawn_timer = 0.3

    for i in range(len(bx)):
        bx[i] += bvx[i] * dt
        by[i] += bvy[i] * dt
        blife[i] -= dt

    for i in range(len(bx)):
        if blife[i] > 0:
            if math.sqrt((player_x - bx[i]) ** 2 + (player_y - by[i]) ** 2) < 13.0:
                hit = True

    if not hit:
        survived_time += dt

    screen.fill((0, 0, 0))

    if not hit:
        pygame.draw.circle(screen, (255, 255, 255), (int(player_x), int(player_y)), 10)
    for i in range(len(bx)):
        if blife[i] > 0:
            pygame.draw.rect(screen, (255, 255, 255), (int(bx[i]), int(by[i]), 6, 6))

    if hit:
        text = font.render(f"HIT! Time: {int(survived_time)}", True, (255, 255, 255))
        screen.blit(text, (400 - text.get_width() // 2, 300 - text.get_height() // 2))
    else:
        text = font.render(f"Time: {int(survived_time)}", True, (255, 255, 255))
        screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()