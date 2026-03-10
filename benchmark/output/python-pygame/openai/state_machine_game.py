import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("3-State Game")
clock = pygame.time.Clock()

# Game state variables
state = 0  # 0=menu, 1=playing, 2=gameover
score = 0
timer = 10.0
target_x, target_y = random.uniform(0.0, 780.0), random.uniform(0.0, 580.0)

font = pygame.font.Font(None, 36)

def draw_text(text, x, y):
    rendered_text = font.render(text, True, (255, 255, 255))
    screen.blit(rendered_text, (x, y))

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
                    target_x, target_y = random.uniform(0.0, 780.0), random.uniform(0.0, 580.0)
                elif state == 2:
                    state = 0
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if state == 1:
                mx, my = pygame.mouse.get_pos()
                if target_x <= mx <= target_x + 20.0 and target_y <= my <= target_y + 20.0:
                    score += 1
                    target_x, target_y = random.uniform(0.0, 780.0), random.uniform(0.0, 580.0)

    if state == 1:
        timer -= dt
        if timer <= 0.0:
            state = 2

    screen.fill((0, 0, 0))

    if state == 0:
        draw_text("Press SPACE to Start", 250.0, 280.0)
    elif state == 1:
        pygame.draw.rect(screen, (255, 255, 255), (int(target_x), int(target_y), 20, 20))
        draw_text(f"Score: {score}", 10.0, 10.0)
        draw_text(f"Time: {timer:.1f}", 10.0, 50.0)
    elif state == 2:
        draw_text(f"Game Over! Score: {score}", 250.0, 260.0)
        draw_text("Press SPACE to Restart", 250.0, 300.0)

    pygame.display.flip()

pygame.quit()
sys.exit()