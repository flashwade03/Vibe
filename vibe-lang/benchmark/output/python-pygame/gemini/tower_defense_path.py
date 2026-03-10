import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Tower Defense")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

path_xs = [0.0, 200.0, 200.0, 600.0, 600.0, 800.0]
path_ys = [300.0, 300.0, 100.0, 100.0, 500.0, 500.0]

en_xs, en_ys, en_wp, en_hp = [], [], [], []
tow_xs, tow_ys, tow_timers = [], [], []
proj_xs, proj_ys, proj_txs, proj_tys, proj_alive = [], [], [], [], []

spawn_timer = 2.0
enemy_speed = 80.0
score = 0
lives = 10

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            if len(tow_xs) < 5:
                mx, my = pygame.mouse.get_pos()
                tow_xs.append(float(mx))
                tow_ys.append(float(my))
                tow_timers.append(0.0)

    # Update Logic
    spawn_timer -= dt
    if spawn_timer <= 0.0:
        spawn_timer = 2.0
        en_xs.append(0.0)
        en_ys.append(300.0)
        en_wp.append(1.0)
        en_hp.append(3.0)

    for i in range(len(en_xs)):
        if en_hp[i] > 0.0:
            wi = int(en_wp[i])
            if wi < 6:
                dx, dy = path_xs[wi] - en_xs[i], path_ys[wi] - en_ys[i]
                d = math.sqrt(dx*dx + dy*dy)
                if d > 3.0:
                    en_xs[i] += (dx/d) * enemy_speed * dt
                    en_ys[i] += (dy/d) * enemy_speed * dt
                else:
                    en_wp[i] += 1.0
            else:
                en_hp[i] = 0.0
                lives -= 1

    for t in range(len(tow_xs)):
        tow_timers[t] -= dt
        if tow_timers[t] <= 0.0:
            best, best_d = -1, 151.0
            for i in range(len(en_xs)):
                if en_hp[i] > 0.0:
                    td = math.sqrt((tow_xs[t]-en_xs[i])**2 + (tow_ys[t]-en_ys[i])**2)
                    if td < best_d:
                        best_d, best = td, i
            if best >= 0:
                tow_timers[t] = 1.0
                proj_xs.append(tow_xs[t]); proj_ys.append(tow_ys[t])
                proj_txs.append(en_xs[best]); proj_tys.append(en_ys[best])
                proj_alive.append(1.0)

    for p in range(len(proj_xs)):
        if proj_alive[p] > 0:
            dx, dy = proj_txs[p] - proj_xs[p], proj_tys[p] - proj_ys[p]
            d = math.sqrt(dx*dx + dy*dy)
            if d < 10:
                proj_alive[p] = 0
                for i in range(len(en_xs)):
                    if en_hp[i] > 0 and math.sqrt((en_xs[i]-proj_xs[p])**2 + (en_ys[i]-proj_ys[p])**2) < 20:
                        en_hp[i] -= 1
                        if en_hp[i] <= 0: score += 10
            else:
                proj_xs[p] += (dx/d) * 300 * dt
                proj_ys[p] += (dy/d) * 300 * dt

    # Draw Logic
    screen.fill((0, 0, 0))
    for i in range(5):
        pygame.draw.line(screen, (50, 50, 50), (path_xs[i], path_ys[i]), (path_xs[i+1], path_ys[i+1]), 5)
    for i in range(len(en_xs)):
        if en_hp[i] > 0: pygame.draw.circle(screen, (255, 0, 0), (int(en_xs[i]), int(en_ys[i])), 8)
    for i in range(len(tow_xs)):
        pygame.draw.rect(screen, (0, 255, 0), (int(tow_xs[i]-10), int(tow_ys[i]-10), 20, 20))
    for i in range(len(proj_xs)):
        if proj_alive[i] > 0: pygame.draw.rect(screen, (255, 255, 0), (int(proj_xs[i]-2), int(proj_ys[i]-2), 4, 4))
    
    screen.blit(font.render(f"Lives: {lives} Score: {score}", True, (255, 255, 255)), (10, 10))
    screen.blit(font.render(f"Click to place tower ({len(tow_xs)}/5)", True, (255, 255, 255)), (10, 30))
    
    pygame.display.flip()

pygame.quit()
sys.exit()