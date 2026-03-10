import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("2-Player Pong")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 72)

p1_y = 260.0
p2_y = 260.0
ball_x = 400.0
ball_y = 300.0
ball_vx = 250.0
ball_vy = 150.0
score1 = 0
score2 = 0
speed = 300.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    
    # Paddle 1 movement
    if keys[pygame.K_w]: p1_y -= speed * dt
    if keys[pygame.K_s]: p1_y += speed * dt
    p1_y = max(0.0, min(520.0, p1_y))

    # Paddle 2 movement
    if keys[pygame.K_UP]: p2_y -= speed * dt
    if keys[pygame.K_DOWN]: p2_y += speed * dt
    p2_y = max(0.0, min(520.0, p2_y))

    # Ball movement
    ball_x += ball_vx * dt
    ball_y += ball_vy * dt

    # Wall bounce
    if ball_y < 8.0 or ball_y > 592.0:
        ball_vy *= -1

    # Paddle collision
    if ball_x - 8.0 <= 42.0 and ball_x > 30.0 and ball_y >= p1_y and ball_y <= p1_y + 80.0:
        ball_vx *= -1
        ball_x = 50.0
    if ball_x + 8.0 >= 758.0 and ball_x < 770.0 and ball_y >= p2_y and ball_y <= p2_y + 80.0:
        ball_vx *= -1
        ball_x = 750.0

    # Scoring
    if ball_x < 0.0:
        score2 += 1
        ball_x, ball_y = 400.0, 300.0
        ball_vx, ball_vy = 250.0, 150.0
    if ball_x > 800.0:
        score1 += 1
        ball_x, ball_y = 400.0, 300.0
        ball_vx, ball_vy = -250.0, -150.0

    # Drawing
    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (30, int(p1_y), 12, 80))
    pygame.draw.rect(screen, (255, 255, 255), (758, int(p2_y), 12, 80))
    pygame.draw.circle(screen, (255, 255, 255), (int(ball_x), int(ball_y)), 8)
    
    for i in range(0, 30):
        pygame.draw.rect(screen, (255, 255, 255), (398, i * 20, 4, 10))
    
    text1 = font.render(str(score1), True, (255, 255, 255))
    text2 = font.render(str(score2), True, (255, 255, 255))
    screen.blit(text1, (300, 20))
    screen.blit(text2, (480, 20))

    pygame.display.flip()

pygame.quit()
sys.exit()