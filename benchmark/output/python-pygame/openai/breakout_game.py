import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Breakout")
clock = pygame.time.Clock()

# Paddle
paddle_x = 360.0
paddle_speed = 300.0

# Ball
ball_x, ball_y = 400.0, 400.0
ball_radius = 6
ball_vx, ball_vy = 200.0, -200.0

# Bricks
brick_width, brick_height = 90, 20
brick_alive = [1.0] * 8
brick_positions = [(i * 100 + 5, 50) for i in range(8)]

# Game state
score = 0
game_over = False

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        paddle_x -= paddle_speed * dt
    if keys[pygame.K_RIGHT]:
        paddle_x += paddle_speed * dt

    # Keep paddle within screen bounds
    paddle_x = max(0, min(paddle_x, 720))

    # Update ball position
    ball_x += ball_vx * dt
    ball_y += ball_vy * dt

    # Ball collision with walls
    if ball_x < ball_radius or ball_x > 800 - ball_radius:
        ball_vx *= -1
    if ball_y < ball_radius:
        ball_vy *= -1

    # Ball collision with paddle
    if ball_y >= 564 and paddle_x <= ball_x <= paddle_x + 80:
        ball_vy *= -1

    # Ball collision with bricks
    for i, (bx, by) in enumerate(brick_positions):
        if brick_alive[i] == 1.0:
            if bx <= ball_x <= bx + brick_width and by <= ball_y <= by + brick_height:
                brick_alive[i] = 0.0
                ball_vy *= -1
                score += 1

    # Check if ball is out of bounds
    if ball_y > 600:
        game_over = True

    # Drawing
    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(paddle_x), 570, 80, 12))
    pygame.draw.circle(screen, (255, 255, 255), (int(ball_x), int(ball_y)), ball_radius)

    for i, (bx, by) in enumerate(brick_positions):
        if brick_alive[i] == 1.0:
            pygame.draw.rect(screen, (255, 255, 255), (bx, by, brick_width, brick_height))

    font = pygame.font.Font(None, 36)
    score_text = font.render(f"Score: {score}", True, (255, 255, 255))
    screen.blit(score_text, (10, 10))

    if game_over:
        game_over_text = font.render("GAME OVER", True, (255, 0, 0))
        screen.blit(game_over_text, (350, 300))

    pygame.display.flip()

pygame.quit()
sys.exit()