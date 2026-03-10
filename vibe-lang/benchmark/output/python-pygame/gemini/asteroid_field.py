import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Asteroid Dodge")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

player_x, player_y = 100.0, 300.0
player_speed = 250.0
ast_xs = []
ast_ys = []
ast_sizes = []
spawn_timer = 0.0
scroll_speed = 200.0
game_over = False
score = 0.0

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
        
        player_y = max(0.0, min(576.0, player_y))
        
        spawn_timer += dt
        if spawn_timer >= 0.4:
            spawn_timer = 0.0
            ast_xs.append(820.0)
            ast_ys.append(float(random.randint(20, 580)))
            ast_sizes.append(float(random.randint(15, 40)))
        
        player_rect = pygame.Rect(int(player_x), int(player_y), 24, 24)
        
        i = 0
        while i < len(ast_xs):
            ast_xs[i] -= scroll_speed * dt
            
            ast_rect = pygame.Rect(int(ast_xs[i]), int(ast_ys[i]), int(ast_sizes[i]), int(ast_sizes[i]))
            if player_rect.colliderect(ast_rect):
                game_over = True
            
            if ast_xs[i] < -50:
                ast_xs.pop(i)
                ast_ys.pop(i)
                ast_sizes.pop(i)
            else:
                i += 1
        
        score += dt

    screen.fill((0, 0, 0))
    
    pygame.draw.rect(screen, (255, 255, 255), (int(player_x), int(player_y), 24, 24))
    
    for i in range(len(ast_xs)):
        pygame.draw.rect(screen, (255, 255, 255), (int(ast_xs[i]), int(ast_ys[i]), int(ast_sizes[i]), int(ast_sizes[i])))
    
    score_text = font.render("Score: " + str(int(score)), True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    
    if game_over:
        go_text = font.render("GAME OVER", True, (255, 255, 255))
        screen.blit(go_text, (340, 280))
        
    pygame.display.flip()

pygame.quit()
sys.exit()