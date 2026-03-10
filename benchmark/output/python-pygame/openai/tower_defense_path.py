import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Tower Defense")
clock = pygame.time.Clock()

# Path waypoints
path_xs = [0.0, 200.0, 200.0, 600.0, 600.0, 800.0]
path_ys = [300.0, 300.0, 100.0, 100.0, 500.0, 500.0]

# Enemies
en_xs, en_ys, en_wp, en_hp = [], [], [], []

# Towers
tow_xs, tow_ys, tow_timers = [], [], []

# Projectiles
proj_xs, proj_ys, proj_txs, proj_tys, proj_alive = [], [], [], [], []

# Game state variables
spawn_timer = 2.0
enemy_speed = 80.0
score = 0
lives = 10

def update(dt):
    global spawn_timer, lives, score

    # Spawn enemies
    spawn_timer -= dt
    if spawn_timer <= 0.0:
        spawn_timer = 2.0
        en_xs.append(0.0)
        en_ys.append(300.0)
        en_wp.append(1.0)
        en_hp.append(3.0)

    # Move enemies
    for i in range(len(en_xs)):
        if en_hp[i] > 0.0:
            wi = int(en_wp[i])
            if wi < 6:
                dx = path_xs[wi] - en_xs[i]
                dy = path_ys[wi] - en_ys[i]
                d = math.sqrt(dx * dx + dy * dy)
                if d > 3.0:
                    en_xs[i] += (dx / d) * enemy_speed * dt
                    en_ys[i] += (dy / d) * enemy_speed * dt
                else:
                    en_wp[i] += 1.0
            if int(en_wp[i]) >= 6:
                en_hp[i] = 0.0
                lives -= 1

    # Towers fire
    for t in range(len(tow_xs)):
        tow_timers[t] -= dt
        if tow_timers[t] <= 0.0:
            best = -1
            best_d = 151.0
            for i in range(len(en_xs)):
                if en_hp[i] > 0.0:
                    td = math.sqrt((tow_xs[t] - en_xs[i]) ** 2 + (tow_ys[t] - en_ys[i]) ** 2)
                    if td < best_d:
                        best_d = td
                        best = i
            if best >= 0:
                tow_timers[t] = 1.0
                proj_xs.append(tow_xs[t])
                proj_ys.append(tow_ys[t])
                proj_txs.append(en_xs[best])
                proj_tys.append(en_ys[best])
                proj_alive.append(1.0)

    # Move projectiles
    for p in range(len(proj_xs)):
        if proj_alive[p] > 0.0:
            dx = proj_txs[p] - proj_xs[p]
            dy = proj_tys[p] - proj_ys[p]
            d = math.sqrt(dx * dx + dy * dy)
            if d > 10.0:
                proj_xs[p] += (dx / d) * 300 * dt
                proj_ys[p] += (dy / d) * 300 * dt
            else:
                proj_alive[p] = 0.0
                for i in range(len(en_xs)):
                    if en_hp[i] > 0.0:
                        ed = math.sqrt((proj_xs[p] - en_xs[i]) ** 2 + (proj_ys[p] - en_ys[i]) ** 2)
                        if ed < 10.0:
                            en_hp[i] -= 1.0
                            if en_hp[i] <= 0.0:
                                score += 1

def mousepressed(pos):
    if len(tow_xs) < 5:
        tow_xs.append(pos[0])
        tow_ys.append(pos[1])
        tow_timers.append(0.0)

def draw():
    screen.fill((0, 0, 0))

    # Draw path
    for i in range(5):
        pygame.draw.line(screen, (255, 255, 255), (path_xs[i], path_ys[i]), (path_xs[i+1], path_ys[i+1]), 2)

    # Draw enemies
    for i in range(len(en_xs)):
        if en_hp[i] > 0.0:
            pygame.draw.circle(screen, (255, 0, 0), (int(en_xs[i]), int(en_ys[i])), 8)

    # Draw towers
    for i in range(len(tow_xs)):
        pygame.draw.rect(screen, (0, 255, 0), (int(tow_xs[i]) - 10, int(tow_ys[i]) - 10, 20, 20))

    # Draw projectiles
    for i in range(len(proj_xs)):
        if proj_alive[i] > 0.0:
            pygame.draw.rect(screen, (255, 255, 0), (int(proj_xs[i]) - 2, int(proj_ys[i]) - 2, 4, 4))

    # Draw text
    font = pygame.font.Font(None, 36)
    text = font.render(f"Lives: {lives} Score: {score}", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    text = font.render(f"Click to place tower ({len(tow_xs)}/5)", True, (255, 255, 255))
    screen.blit(text, (10, 30))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mousepressed(pygame.mouse.get_pos())

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()