import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Target Clicker")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

state = 0  # 0=menu, 1=playing, 2=gameover
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
        
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if state == 0:
                    state = 1
                    score = 0
                    timer = 10.0
                elif state == 2:
                    state = 0
        
        if event.type == pygame.MOUSEBUTTONDOWN and state == 1:
            mx, my = pygame.mouse.get_pos()
            if mx >= target_x and mx <= target_x + 20.0 and my >= target_y and my <= target_y + 20.0:
                score += 1
                target_x = random.uniform(0.0, 780.0)
                target_y = random.uniform(0.0, 580.0)

    if state == 1:
        timer -= dt
        if timer <= 0.0:
            state = 2

    screen.fill((0, 0, 0))

    if state == 0:
        text = font.render("Press SPACE to Start", True, (255, 255, 255))
        screen.blit(text, (250, 280))
    
    elif state == 1:
        pygame.draw.rect(screen, (255, 255, 255), (int(target_x), int(target_y), 20, 20))
        score_text = font.render(f"Score: {score}", True, (255, 255, 255))
        timer_text = font.render(f"Time: {int(timer)}", True, (255, 255, 255))
        screen.blit(score_text, (10, 10))
        screen.blit(timer_text, (10, 40))
        
    elif state == 2:
        text1 = font.render(f"Game Over! Score: {score}", True, (255, 255, 255))
        text2 = font.render("Press SPACE to Restart", True, (255, 255, 255))
        screen.blit(text1, (250, 260))
        screen.blit(text2, (250, 300))

    pygame.display.flip()

pygame.quit()
sys.exit()