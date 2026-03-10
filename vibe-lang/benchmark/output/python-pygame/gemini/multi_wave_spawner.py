import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Wave Survival")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

px, py = 400.0, 300.0
p_speed = 250.0

ex, ey, evx, evy, elife = [], [], [], [], []
wave = 1
spawn_timer = 2.0
enemies_per_wave = 3
game_over = False

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not game_over:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]: px -= p_speed * dt
        if keys[pygame.K_RIGHT]: px += p_speed * dt
        if keys[pygame.K_UP]: py -= p_speed * dt
        if keys[pygame.K_DOWN]: py += p_speed * dt

        spawn_timer -= dt
        if spawn_timer <= 0:
            for _ in range(enemies_per_wave):
                side = random.uniform(0.0, 4.0)
                if side < 1: x, y = random.uniform(0, 800), 0
                elif side < 2: x, y = 800, random.uniform(0, 600)
                elif side < 3: x, y = random.uniform(0, 800), 600
                else: x, y = 0, random.uniform(0, 600)
                
                dx, dy = px - x, py - y
                dist = math.sqrt(dx**2 + dy**2) or 1
                speed = 80 + wave * 20
                ex.append(x); ey.append(y)
                evx.append((dx / dist) * speed); evy.append((dy / dist) * speed)
                elife.append(1.0)
            
            wave += 1
            enemies_per_wave = 3 + wave
            spawn_timer = max(0.5, 3.0 - wave * 0.2)

        for i in range(len(ex)):
            if elife[i] > 0:
                ex[i] += evx[i] * dt
                ey[i] += evy[i] * dt
                elife[i] -= dt
                
                dist = math.sqrt((ex[i] - px)**2 + (ey[i] - py)**2)
                if dist < 20:
                    game_over = True

    screen.fill((0, 0, 0))
    
    pygame.draw.circle(screen, (255, 255, 255), (int(px), int(py)), 12)
    
    for i in range(len(ex)):
        if elife[i] > 0:
            pygame.draw.rect(screen, (255, 255, 255), (int(ex[i]), int(ey[i]), 16, 16))

    text = font.render(f"Wave: {wave}", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    
    if game_over:
        go_text = font.render("GAME OVER", True, (255, 0, 0))
        screen.blit(go_text, (340, 280))

    pygame.display.flip()

pygame.quit()
sys.exit()