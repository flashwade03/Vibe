import pygame
import sys
import math
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Asteroids")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Ship state
ship_x, ship_y = 400.0, 300.0
ship_angle = -1.5708
ship_vx, ship_vy = 0.0, 0.0
game_over = False
score = 0

# Asteroids state
ax, ay, avx, avy, asize, aalive = [], [], [], [], [], []
for i in range(6):
    ax.append(random.uniform(0.0, 800.0))
    ay.append(random.uniform(0.0, 600.0))
    avx.append(random.uniform(-60.0, 60.0))
    avy.append(random.uniform(-60.0, 60.0))
    asize.append(25.0)
    aalive.append(1.0)

# Bullets state
bx, by, bvx, bvy, blife = [], [], [], [], []

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and not game_over:
                nx = ship_x + math.cos(ship_angle) * 15.0
                ny = ship_y + math.sin(ship_angle) * 15.0
                bx.append(nx)
                by.append(ny)
                bvx.append(math.cos(ship_angle) * 400.0)
                bvy.append(math.sin(ship_angle) * 400.0)
                blife.append(2.0)

    if not game_over:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]: ship_angle -= 3.0 * dt
        if keys[pygame.K_RIGHT]: ship_angle += 3.0 * dt
        if keys[pygame.K_UP]:
            ship_vx += math.cos(ship_angle) * 300.0 * dt
            ship_vy += math.sin(ship_angle) * 300.0 * dt
        
        ship_vx *= 0.99
        ship_vy *= 0.99
        ship_x += ship_vx * dt
        ship_y += ship_vy * dt

        # Wrap ship
        ship_x %= 800.0
        ship_y %= 600.0

        # Update asteroids
        for i in range(len(ax)):
            if aalive[i] == 1.0:
                ax[i] = (ax[i] + avx[i] * dt) % 800.0
                ay[i] = (ay[i] + avy[i] * dt) % 600.0
                
                # Ship-asteroid collision
                sdx, sdy = ship_x - ax[i], ship_y - ay[i]
                if math.sqrt(sdx*sdx + sdy*sdy) < asize[i] + 8.0:
                    game_over = True

        # Update bullets
        for j in range(len(bx)):
            if blife[j] > 0.0:
                bx[j] += bvx[j] * dt
                by[j] += bvy[j] * dt
                blife[j] -= dt
                
                # Bullet-asteroid collision
                for i in range(len(ax)):
                    if aalive[i] == 1.0:
                        ddx, ddy = bx[j] - ax[i], by[j] - ay[i]
                        if math.sqrt(ddx*ddx + ddy*ddy) < asize[i]:
                            aalive[i] = 0.0
                            blife[j] = 0.0
                            score += 1

    # Draw
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(ship_x), int(ship_y)), 8)
    pygame.draw.circle(screen, (255, 255, 255), (int(ship_x + math.cos(ship_angle) * 15.0), int(ship_y + math.sin(ship_angle) * 15.0)), 3)
    
    for i in range(len(ax)):
        if aalive[i] == 1.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(ax[i]), int(ay[i])), int(asize[i]), 1)
            
    for j in range(len(bx)):
        if blife[j] > 0.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(bx[j]), int(by[j])), 2)

    screen.blit(font.render(f"Score: {score}", True, (255, 255, 255)), (10, 10))
    if game_over:
        screen.blit(font.render("GAME OVER", True, (255, 255, 255)), (340, 280))

    pygame.display.flip()

pygame.quit()
sys.exit()