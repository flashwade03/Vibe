import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Dodge the Bullets")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Player state
px, py = 400.0, 300.0
pspeed = 300.0
hit = False
survived_time = 0.0

# Bullet state
bx, by, bvx, bvy, blife = [], [], [], [], []
spawn_timer = 0.3

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not hit:
        # Player movement
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] and px > 10: px -= pspeed * dt
        if keys[pygame.K_RIGHT] and px < 790: px += pspeed * dt
        if keys[pygame.K_UP] and py > 10: py -= pspeed * dt
        if keys[pygame.K_DOWN] and py < 590: py += pspeed * dt

        # Bullet spawning
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
            
            dx, dy = px - sx, py - sy
            dist = math.sqrt(dx**2 + dy**2)
            if dist > 0:
                bx.append(sx); by.append(sy)
                bvx.append((dx / dist) * 250.0)
                bvy.append((dy / dist) * 250.0)
                blife.append(4.0)

        # Update bullets
        survived_time += dt
        for i in range(len(bx)):
            if blife[i] > 0:
                bx[i] += bvx[i] * dt
                by[i] += bvy[i] * dt
                blife[i] -= dt
                
                # Collision
                dist = math.sqrt((px - bx[i])**2 + (py - by[i])**2)
                if dist < 13.0:
                    hit = True

    # Draw
    screen.fill((0, 0, 0))
    
    # Draw bullets
    for i in range(len(bx)):
        if blife[i] > 0:
            pygame.draw.rect(screen, (255, 255, 255), (int(bx[i]-3), int(by[i]-3), 6, 6))
            
    # Draw player
    pygame.draw.circle(screen, (255, 255, 255), (int(px), int(py)), 10)
    
    # UI
    if hit:
        text = font.render(f"HIT! Time: {int(survived_time)}", True, (255, 255, 255))
        screen.blit(text, (320, 280))
    else:
        text = font.render(f"Time: {int(survived_time)}", True, (255, 255, 255))
        screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()