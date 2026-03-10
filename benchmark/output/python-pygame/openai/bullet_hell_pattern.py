import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Spiral Bullet Pattern")
clock = pygame.time.Clock()

# Game state variables
bul_xs = []
bul_ys = []
bul_vxs = []
bul_vys = []
bul_lifes = []
emit_angle = 0.0
emit_timer = 0.0
game_over = False
px, py = 400.0, 500.0
player_speed = 300

font = pygame.font.Font(None, 36)

def update(dt):
    global emit_angle, emit_timer, game_over, px

    if not game_over:
        emit_angle += 2.5 * dt
        emit_timer += dt

        if emit_timer >= 0.05:
            emit_timer = 0.0
            for k in range(3):
                angle = emit_angle + float(k) * 2.094
                bul_xs.append(400.0)
                bul_ys.append(200.0)
                bul_vxs.append(math.cos(angle) * 120.0)
                bul_vys.append(math.sin(angle) * 120.0)
                bul_lifes.append(5.0)

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        px -= player_speed * dt
    if keys[pygame.K_RIGHT]:
        px += player_speed * dt

    for i in range(len(bul_xs)):
        bul_xs[i] += bul_vxs[i] * dt
        bul_ys[i] += bul_vys[i] * dt
        bul_lifes[i] -= dt

        if bul_lifes[i] > 0.0:
            ddx = px - bul_xs[i]
            ddy = py - bul_ys[i]
            if math.sqrt(ddx * ddx + ddy * ddy) < 11.0:
                game_over = True

def draw():
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (400, 200), 12)

    for i in range(len(bul_xs)):
        if bul_lifes[i] > 0.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(bul_xs[i]), int(bul_ys[i])), 3)

    pygame.draw.circle(screen, (255, 255, 255), (int(px), int(py)), 8)

    if game_over:
        text = font.render("GAME OVER", True, (255, 255, 255))
        screen.blit(text, (340, 300))

    alive = sum(1 for life in bul_lifes if life > 0.0)
    text = font.render("Bullets: " + str(alive), True, (255, 255, 255))
    screen.blit(text, (10, 10))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()