import pygame
import sys
import math
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Asteroids")
clock = pygame.time.Clock()

# Ship variables
ship_x, ship_y = 400.0, 300.0
ship_angle = -1.5708
ship_vx, ship_vy = 0.0, 0.0

# Game state
game_over = False
score = 0

# Asteroids
ax, ay, avx, avy, asize, aalive = [], [], [], [], [], []

# Bullets
bx, by, bvx, bvy, blife = [], [], [], [], []

def load():
    for _ in range(6):
        ax.append(random.uniform(0.0, 800.0))
        ay.append(random.uniform(0.0, 600.0))
        avx.append(random.uniform(-60.0, 60.0))
        avy.append(random.uniform(-60.0, 60.0))
        asize.append(25.0)
        aalive.append(1.0)

def update(dt):
    global ship_x, ship_y, ship_angle, ship_vx, ship_vy, game_over, score

    if not game_over:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            ship_angle -= 3.0 * dt
        if keys[pygame.K_RIGHT]:
            ship_angle += 3.0 * dt
        if keys[pygame.K_UP]:
            ship_vx += math.cos(ship_angle) * 300.0 * dt
            ship_vy += math.sin(ship_angle) * 300.0 * dt

        ship_vx *= 0.99
        ship_vy *= 0.99
        ship_x += ship_vx * dt
        ship_y += ship_vy * dt

        # Wrap ship
        if ship_x > 800.0: ship_x = 0.0
        if ship_x < 0.0: ship_x = 800.0
        if ship_y > 600.0: ship_y = 0.0
        if ship_y < 0.0: ship_y = 600.0

        # Move asteroids
        for i in range(len(ax)):
            if aalive[i] == 1.0:
                ax[i] += avx[i] * dt
                ay[i] += avy[i] * dt

                # Wrap asteroids
                if ax[i] > 800.0: ax[i] = 0.0
                if ax[i] < 0.0: ax[i] = 800.0
                if ay[i] > 600.0: ay[i] = 0.0
                if ay[i] < 0.0: ay[i] = 600.0

        # Move bullets
        for j in range(len(bx)):
            if blife[j] > 0.0:
                bx[j] += bvx[j] * dt
                by[j] += bvy[j] * dt
                blife[j] -= dt

        # Bullet-asteroid collision
        for i in range(len(ax)):
            if aalive[i] == 1.0:
                for j in range(len(bx)):
                    if blife[j] > 0.0:
                        ddx = bx[j] - ax[i]
                        ddy = by[j] - ay[i]
                        if math.sqrt(ddx * ddx + ddy * ddy) < asize[i]:
                            aalive[i] = 0.0
                            blife[j] = 0.0
                            score += 1

        # Ship-asteroid collision
        for i in range(len(ax)):
            if aalive[i] == 1.0:
                sdx = ship_x - ax[i]
                sdy = ship_y - ay[i]
                if math.sqrt(sdx * sdx + sdy * sdy) < asize[i] + 8.0:
                    game_over = True

def keypressed(k):
    global bx, by, bvx, bvy, blife
    if k == pygame.K_SPACE and not game_over:
        nx = ship_x + math.cos(ship_angle) * 15.0
        ny = ship_y + math.sin(ship_angle) * 15.0
        bx.append(nx)
        by.append(ny)
        bvx.append(math.cos(ship_angle) * 400.0)
        bvy.append(math.sin(ship_angle) * 400.0)
        blife.append(2.0)

def draw():
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(ship_x), int(ship_y)), 8)
    pygame.draw.circle(screen, (255, 255, 255), (int(ship_x + math.cos(ship_angle) * 15.0), int(ship_y + math.sin(ship_angle) * 15.0)), 3)

    for i in range(len(ax)):
        if aalive[i] == 1.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(ax[i]), int(ay[i])), int(asize[i]))

    for j in range(len(bx)):
        if blife[j] > 0.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(bx[j]), int(by[j])), 2)

    font = pygame.font.Font(None, 36)
    text = font.render(f"Score: {score}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    if game_over:
        game_over_text = font.render("GAME OVER", True, (255, 255, 255))
        screen.blit(game_over_text, (340, 280))

load()

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            keypressed(event.key)

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()