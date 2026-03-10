import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Game")
clock = pygame.time.Clock()

# Player variables
player_x, player_y = 400, 300
player_speed = 250
player_radius = 12

# Enemy variables
ex, ey, evx, evy, elife = [], [], [], [], []

# Game state variables
wave = 1
spawn_timer = 2.0
enemies_per_wave = 3
game_over = False

def rand_float(min_val, max_val):
    return random.uniform(min_val, max_val)

def spawn_enemies():
    global wave, enemies_per_wave, spawn_timer
    for _ in range(enemies_per_wave):
        edge = rand_float(0.0, 4.0)
        if 0 <= edge < 1:
            x, y = rand_float(0, 800), 0
        elif 1 <= edge < 2:
            x, y = 800, rand_float(0, 600)
        elif 2 <= edge < 3:
            x, y = rand_float(0, 800), 600
        else:
            x, y = 0, rand_float(0, 600)

        direction_x = player_x - x
        direction_y = player_y - y
        length = math.sqrt(direction_x ** 2 + direction_y ** 2)
        direction_x /= length
        direction_y /= length

        speed = 80 + wave * 20
        evx.append(direction_x * speed)
        evy.append(direction_y * speed)
        ex.append(x)
        ey.append(y)
        elife.append(1.0)

    wave += 1
    enemies_per_wave = 3 + wave
    spawn_timer = max(0.5, 3.0 - wave * 0.2)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not game_over:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            player_x -= player_speed * dt
        if keys[pygame.K_RIGHT]:
            player_x += player_speed * dt
        if keys[pygame.K_UP]:
            player_y -= player_speed * dt
        if keys[pygame.K_DOWN]:
            player_y += player_speed * dt

        spawn_timer -= dt
        if spawn_timer <= 0.0:
            spawn_enemies()

        for i in range(len(ex)):
            if elife[i] > 0:
                ex[i] += evx[i] * dt
                ey[i] += evy[i] * dt
                elife[i] -= dt

                distance = math.sqrt((player_x - ex[i]) ** 2 + (player_y - ey[i]) ** 2)
                if distance < player_radius + 8:
                    game_over = True

    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(player_x), int(player_y)), player_radius)

    for i in range(len(ex)):
        if elife[i] > 0:
            pygame.draw.rect(screen, (255, 255, 255), (int(ex[i]), int(ey[i]), 16, 16))

    font = pygame.font.Font(None, 36)
    wave_text = font.render(f"Wave: {wave}", True, (255, 255, 255))
    screen.blit(wave_text, (10, 10))

    if game_over:
        game_over_text = font.render("GAME OVER", True, (255, 0, 0))
        screen.blit(game_over_text, (400 - game_over_text.get_width() // 2, 300 - game_over_text.get_height() // 2))

    pygame.display.flip()

pygame.quit()
sys.exit()