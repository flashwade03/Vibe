```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Breakout")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

paddle_x = 360.0
paddle_y = 570.0
paddle_w = 80.0
paddle_h = 12.0
paddle_speed = 300.0

bx = 400.0
by = 400.0
vx = 200.0
vy = -200.0
ball_radius = 6

brick_xs = [5.0, 105.0, 205.0, 305.0, 405.0, 505.0, 605.0, 705.0]
brick_y = 50.0
brick_w = 90.0
brick_h = 20.0
brick_alive = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]

score = 0
game_over = False

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()

    if not game_over:
        if keys[pygame.K_LEFT]:
            paddle_x -= paddle_speed * dt
        if keys[pygame.K_RIGHT]:
            paddle_x += paddle_speed * dt

        bx += vx * dt
        by += vy * dt

        if by < 6.0:
            by = 6.0
            vy = -vy

        if by >= 564.0 and bx >= paddle_x and bx <= paddle_x + 80.0:
            if vy > 0:
                vy = -vy
                by = 564.0

        if bx < 6.0:
            bx = 6.0
            vx = -vx
        elif bx > 794.0:
            bx = 794.0
            vx = -vx

        for i in range(8):
            if brick_alive[i] == 1.0:
                if brick_xs[i] <= bx <= brick_xs[i] + brick_w and brick_y <= by <= brick_y + brick_h:
                    brick_alive[i] = 0.0
                    vy = -vy
                    score += 1
                    break

        if by > 600.0:
            game_over = True

    screen.fill((0, 0, 0))

    pygame.draw.rect(screen, (255, 255, 255), (int(paddle_x), int(paddle_y), int(paddle_w), int(paddle_h)))
    
    pygame.draw.circle(screen, (255, 255, 255), (int(bx), int(by)), ball_radius)

    for i in range(8):
        if brick_alive[i] == 1.0:
            pygame.draw.rect(screen, (255, 255, 255), (int(brick_xs[i]), int(brick_y