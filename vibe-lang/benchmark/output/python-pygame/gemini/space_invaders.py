import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Space Invaders")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state
inv_xs = []
inv_ys = []
inv_alive = []
inv_dir = 1.0
inv_speed = 40.0

px = 384.0
bul_xs = []
bul_ys = []
bul_alive = []
score = 0

# Load enemies
for row in range(0, 3):
    for col in range(0, 6):
        inv_xs.append(150.0 + float(col) * 80.0)
        inv_ys.append(50.0 + float(row) * 50.0)
        inv_alive.append(1.0)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                bul_xs.append(px + 14.0)
                bul_ys.append(540.0)
                bul_alive.append(1.0)

    # Player movement
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        px -= 250.0 * dt
    if keys[pygame.K_RIGHT]:
        px += 250.0 * dt
    px = max(0.0, min(768.0, px))

    # Move invaders
    for i in range(len(inv_xs)):
        if inv_alive[i] == 1.0:
            inv_xs[i] += inv_speed * inv_dir * dt

    # Check edges
    reverse = False
    for i in range(len(inv_xs)):
        if inv_alive[i] == 1.0 and (inv_xs[i] < 20.0 or inv_xs[i] > 750.0):
            reverse = True
    
    if reverse:
        inv_dir = -inv_dir
        for i in range(len(inv_ys)):
            if inv_alive[i] == 1.0:
                inv_ys[i] += 20.0

    # Move bullets
    for j in range(len(bul_ys)):
        if bul_alive[j] == 1.0:
            bul_ys[j] -= 400.0 * dt
            if bul_ys[j] < 0.0:
                bul_alive[j] = 0.0

    # Collision
    for j in range(len(bul_xs)):
        if bul_alive[j] == 1.0:
            for i in range(len(inv_xs)):
                if inv_alive[i] == 1.0 and bul_xs[j] >= inv_xs[i] and bul_xs[j] <= inv_xs[i] + 30.0 and bul_ys[j] >= inv_ys[i] and bul_ys[j] <= inv_ys[i] + 20.0:
                    inv_alive[i] = 0.0
                    bul_alive[j] = 0.0
                    score += 1

    # Draw
    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(px), 550, 32, 16))
    
    for i in range(len(inv_xs)):
        if inv_alive[i] == 1.0:
            pygame.draw.rect(screen, (255, 255, 255), (int(inv_xs[i]), int(inv_ys[i]), 30, 20))
            
    for j in range(len(bul_xs)):
        if bul_alive[j] == 1.0:
            pygame.draw.rect(screen, (255, 255, 255), (int(bul_xs[j]), int(bul_ys[j]), 4, 10))
            
    score_text = font.render("Score: " + str(score), True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    
    alive_count = sum(inv_alive)
    if alive_count == 0:
        win_text = font.render("YOU WIN!", True, (255, 255, 255))
        screen.blit(win_text, (340, 280))

    pygame.display.flip()

pygame.quit()
sys.exit()