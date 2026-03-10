import pygame
import sys
import random
import math

def rand_float(min_val, max_val):
    return random.uniform(min_val, max_val)

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Game")
clock = pygame.time.Clock()

# Player variables
px, py = 400.0, 300.0
player_speed = 250
player_radius = 12

# Game state variables
wave = 1
spawn_timer = 2.0
enemies_per_wave = 3
game_over = False

# Enemy lists
ex, ey = [], []
evx, evy = [], []
elife = []

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not game_over:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            px -= player_speed * dt
        if keys[pygame.K_RIGHT]:
            px += player_speed * dt
        if keys[pygame.K_UP]:
            py -= player_speed * dt
        if keys[pygame.K_DOWN]:
            py += player_speed * dt

        # Clamp player position to screen
        px = max(player_radius, min(800 - player_radius, px))
        py = max(player_radius, min(600 - player_radius, py))

        # Spawn enemies
        spawn_timer -= dt
        if spawn_timer <= 0.0:
            for _ in range(enemies_per_wave):
                edge = rand_float(0.0, 4.0)
                if edge < 1.0:
                    ex.append(rand_float(0, 800))
                    ey.append(0)
                elif edge < 2.0:
                    ex.append(800)
                    ey.append(rand_float(0, 600))
                elif edge < 3.0:
                    ex.append(rand_float(0, 800))
                    ey.append(600)
                else:
                    ex.append(0)
                    ey.append(rand_float(0, 600))

                # Calculate direction towards player
                dx = px - ex[-1]
                dy = py - ey[-1]
                dist = math.sqrt(dx**2 + dy**2)
                speed = 80 + wave * 20
                evx.append((dx / dist) * speed)
                evy.append((dy / dist) * speed)
                elife.append(1.0)

            wave += 1
            enemies_per_wave = 3 + wave
            spawn_timer = max(0.5, 3.0 - wave * 0.2)

        # Update enemies
        for i in range(len(ex)):
            if elife[i] > 0:
                ex[i] += evx[i] * dt
                ey[i] += evy[i] * dt
                elife[i] -= dt

                # Check collision with player
                if math.sqrt((px - ex[i])**2 + (py - ey[i])**2) < player_radius + 8:
                    game_over = True

    # Draw everything
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(px), int(py)), player_radius)

    for i in range(len(ex)):
        if elife[i] > 0:
            pygame.draw.rect(screen, (255, 255, 255), (int(ex[i]) - 8, int(ey[i]) - 8, 16, 16))

    font = pygame.font.Font(None, 36)
    wave_text = font.render(f"Wave: {wave}", True, (255, 255, 255))
    screen.blit(wave_text, (10, 10))

    if game_over:
        game_over_text = font.render("GAME OVER", True, (255, 0, 0))
        screen.blit(game_over_text, (400 - game_over_text.get_width() // 2, 300 - game_over_text.get_height() // 2))

    pygame.display.flip()

pygame.quit()
sys.exit()