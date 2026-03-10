import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("3-State Target Clicker")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

state = 0
score = 0
timer = 10.0
target_x = random.uniform(0.0, 780.0)
target_y = random.uniform(0.0, 580.0)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if state == 0:
                    state = 1
                    score = 0
                    timer = 10.0
                    target_x = random.uniform(0.0, 780.0)
                    target_y = random.uniform(0.0, 580.0)
                elif state == 2:
                    state = 0
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if state == 1 and event.button == 1:
                mx, my = event.pos
                if target_x <= mx <= target_x + 20.0 and target_y <= my <= target_y + 20.0:
                    score += 1
                    target_x = random.uniform(0.0, 780.0)
                    target_y = random.uniform(0.0, 580.0)

    if state == 1:
        timer -= dt
        if timer <= 0.0:
            timer = 0.0
            state = 2

    screen.fill((0, 0, 0))

    if state == 0:
        text = font.render("Press SPACE to Start", True, (255, 255, 255))
        screen.blit(text, (250.0, 280.0))
    elif state == 1:
        pygame.draw.rect(screen, (255, 255, 255), (int(target_x), int(target_y), 20, 20))
        
        score_text = font.render("Score: " + str(score), True, (255, 255, 255))
        timer_text = font.render(f"Timer: {max(0.0, timer):.1f}", True, (255, 255, 255))
        screen.blit(score_text, (10, 10))
        screen.blit(timer_text, (10, 40))
    elif state == 2:
        gameover_text = font.render("Game Over! Score: " + str(score), True, (255, 255, 255))
        restart_text = font.render("Press SPACE to Restart", True, (255, 255, 255))
        screen.blit(gameover_text, (250.0, 260.0))
        screen.blit(restart_text, (250.0, 300.0))

    pygame.display.flip()

pygame.quit()
sys.exit()