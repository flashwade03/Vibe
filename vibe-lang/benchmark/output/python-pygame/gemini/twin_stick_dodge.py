import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Dodge the Bullets")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

player_x, player_y = 400.0, 300.0
player_speed = 300.0
bx, by, bvx, bvy, blife = [], [], [], [], []
spawn_timer = 0.3
survived_time = 0.0
hit = False

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not hit:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]: player_x -= player_speed * dt
        if keys[pygame.K_RIGHT]: player_x += player_speed * dt
        if keys[pygame.K_UP]: player_y -= player_speed * dt
        if keys[pygame.K_DOWN]: player_y += player_speed * dt
        
        player_x = max(10, min(790, player_x))
        player_y = max(10, min(590, player_y))

        survived_time += dt
        spawn_timer -= dt
        if spawn_timer <= 0:
            spawn_timer = 0.3
            edge = random.random() * 4.0
            if edge < 1: # Top
                sx, sy = random.random() * 800, 0
            elif edge < 2: # Bottom
                sx, sy = random.random() * 800, 600
            elif edge < 3: # Left
                sx, sy = 0, random.random() * 600
            else: # Right
                sx, sy = 800, random.random() * 600
            
            dx, dy = player_x - sx, player_y - sy
            dist = math.sqrt(dx**2 + dy**2)
            if dist == 0: dist = 1
            bvx.append((dx / dist) * 250.0)
            bvy.append((dy / dist) * 250.0)
            bx.append(sx)
            by.append(sy)
            blife.append(4.0)

        for i in range(len(bx)):
            if blife[i] > 0:
                bx[i] += bvx[i] * dt
                by[i] += bvy[i] * dt
                blife[i] -= dt
                if math.sqrt((player_x - bx[i])**2 + (player_y - by[i])**2) < 13.0:
                    hit = True

    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(player_x), int(player_y)), 10)
    
    for i in range(len(bx)):
        if blife[i] > 0:
            pygame.draw.rect(screen, (255, 255, 255), (int(bx[i]), int(by[i]), 6, 6))

    text = font.render(f"Time: {int(survived_time)}", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    if hit:
        hit_text = font.render(f"HIT! Time: {int(survived_time)}", True, (255, 0, 0))
        screen.blit(hit_text, (350, 280))

    pygame.display.flip()

pygame.quit()
sys.exit()