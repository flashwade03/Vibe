import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe - Dodge the Asteroids")
clock = pygame.time.Clock()

player_x, player_y = 100.0, 300.0
player_speed = 250.0

ast_xs = []
ast_ys = []
ast_sizes = []

spawn_timer = 0.0
scroll_speed = 200.0
game_over = False
score = 0.0

font = pygame.font.Font(None, 36)

def clamp(value, min_value, max_value):
    return max(min_value, min(value, max_value))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not game_over:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_UP]:
            player_y -= player_speed * dt
        if keys[pygame.K_DOWN]:
            player_y += player_speed * dt

        player_y = clamp(player_y, 0.0, 576.0)

        spawn_timer += dt
        if spawn_timer >= 0.4:
            spawn_timer = 0.0
            ast_xs.append(820.0)
            ast_ys.append(random.uniform(20.0, 580.0))
            ast_sizes.append(random.uniform(15.0, 40.0))

        for i in range(len(ast_xs)):
            ast_xs[i] -= scroll_speed * dt

        for i in range(len(ast_xs)):
            if (ast_xs[i] < player_x + 24.0 and
                ast_xs[i] + ast_sizes[i] > player_x and
                ast_ys[i] < player_y + 24.0 and
                ast_ys[i] + ast_sizes[i] > player_y):
                game_over = True

        score += dt

    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(player_x), int(player_y), 24, 24))

    for i in range(len(ast_xs)):
        pygame.draw.rect(screen, (255, 255, 255), (int(ast_xs[i]), int(ast_ys[i]), int(ast_sizes[i]), int(ast_sizes[i])))

    score_text = font.render("Score: " + str(int(score)), True, (255, 255, 255))
    screen.blit(score_text, (10, 10))

    if game_over:
        game_over_text = font.render("GAME OVER", True, (255, 255, 255))
        screen.blit(game_over_text, (340, 280))

    pygame.display.flip()

pygame.quit()
sys.exit()