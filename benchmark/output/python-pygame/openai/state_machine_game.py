import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("3-State Game")
clock = pygame.time.Clock()

# Game state variables
state = 0  # 0 = menu, 1 = playing, 2 = gameover
score = 0
timer = 10.0
target_x = random.uniform(0.0, 780.0)
target_y = random.uniform(0.0, 580.0)

font = pygame.font.Font(None, 36)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if state == 0:  # From menu to playing
                    state = 1
                    score = 0
                    timer = 10.0
                    target_x = random.uniform(0.0, 780.0)
                    target_y = random.uniform(0.0, 580.0)
                elif state == 2:  # From gameover to menu
                    state = 0
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if state == 1:  # Playing state
                mx, my = pygame.mouse.get_pos()
                if target_x <= mx <= target_x + 20.0 and target_y <= my <= target_y + 20.0:
                    score += 1
                    target_x = random.uniform(0.0, 780.0)
                    target_y = random.uniform(0.0, 580.0)

    if state == 1:  # Playing state
        timer -= dt
        if timer <= 0.0:
            state = 2

    screen.fill((0, 0, 0))

    if state == 0:  # Menu state
        text = font.render("Press SPACE to Start", True, (255, 255, 255))
        screen.blit(text, (250.0, 280.0))
    elif state == 1:  # Playing state
        pygame.draw.rect(screen, (255, 255, 255), (int(target_x), int(target_y), 20, 20))
        score_text = font.render("Score: " + str(score), True, (255, 255, 255))
        screen.blit(score_text, (10, 10))
        timer_text = font.render("Time: " + str(round(timer, 1)), True, (255, 255, 255))
        screen.blit(timer_text, (10, 50))
    elif state == 2:  # Gameover state
        gameover_text = font.render("Game Over! Score: " + str(score), True, (255, 255, 255))
        screen.blit(gameover_text, (250.0, 260.0))
        restart_text = font.render("Press SPACE to Restart", True, (255, 255, 255))
        screen.blit(restart_text, (250.0, 300.0))

    pygame.display.flip()

pygame.quit()
sys.exit()