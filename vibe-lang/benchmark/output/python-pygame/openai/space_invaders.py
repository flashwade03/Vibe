import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Space Invaders")
clock = pygame.time.Clock()

# Initialize game state
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

def load():
    for row in range(3):
        for col in range(6):
            inv_xs.append(150.0 + float(col) * 80.0)
            inv_ys.append(50.0 + float(row) * 50.0)
            inv_alive.append(1.0)

def keypressed(k):
    if k == pygame.K_SPACE:
        bul_xs.append(px + 14.0)
        bul_ys.append(540.0)
        bul_alive.append(1.0)

def update(dt):
    global px, inv_dir, score

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        px -= 250.0 * dt
    if keys[pygame.K_RIGHT]:
        px += 250.0 * dt
    px = max(0.0, min(px, 768.0))

    reverse = False
    for i in range(len(inv_xs)):
        if inv_alive[i] == 1.0:
            inv_xs[i] += inv_speed * inv_dir * dt
            if inv_xs[i] < 20.0 or inv_xs[i] > 750.0:
                reverse = True

    if reverse:
        inv_dir = -inv_dir
        for i in range(len(inv_ys)):
            if inv_alive[i] == 1.0:
                inv_ys[i] += 20.0

    for j in range(len(bul_ys)):
        if bul_alive[j] == 1.0:
            bul_ys[j] -= 400.0 * dt
            if bul_ys[j] < 0.0:
                bul_alive[j] = 0.0

    for j in range(len(bul_xs)):
        if bul_alive[j] == 1.0:
            for i in range(len(inv_xs)):
                if inv_alive[i] == 1.0 and bul_xs[j] >= inv_xs[i] and bul_xs[j] <= inv_xs[i] + 30.0 and bul_ys[j] >= inv_ys[i] and bul_ys[j] <= inv_ys[i] + 20.0:
                    inv_alive[i] = 0.0
                    bul_alive[j] = 0.0
                    score += 1

def draw():
    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (px, 550.0, 32.0, 16.0))
    for i in range(len(inv_xs)):
        if inv_alive[i] == 1.0:
            pygame.draw.rect(screen, (255, 255, 255), (inv_xs[i], inv_ys[i], 30.0, 20.0))
    for j in range(len(bul_xs)):
        if bul_alive[j] == 1.0:
            pygame.draw.rect(screen, (255, 255, 255), (bul_xs[j], bul_ys[j], 4.0, 10.0))
    font = pygame.font.Font(None, 36)
    text = font.render("Score: " + str(score), True, (255, 255, 255))
    screen.blit(text, (10.0, 10.0))

    alive = sum(inv_alive)
    if alive == 0:
        win_text = font.render("YOU WIN!", True, (255, 255, 255))
        screen.blit(win_text, (340.0, 280.0))

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