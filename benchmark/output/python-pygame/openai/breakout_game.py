import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Breakout")
clock = pygame.time.Clock()

# Game state variables
paddle_x = 360.0
paddle_speed = 300.0

ball_x, ball_y = 400.0, 400.0
ball_vx, ball_vy = 200.0, -200.0
ball_radius = 6

brick_alive = [1.0] * 8
brick_width, brick_height = 90, 20
brick_spacing = 100
bricks_y = 50

score = 0
game_over = False

font = pygame.font.Font(None, 36)

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
        ball_vx = -ball_vx
    if ball_y < ball_radius:
        ball_vy = -ball_vy

    # Ball collision with paddle
    if ball_y >= 564 and paddle_x <= ball_x <= paddle_x + 80:
        ball_vy = -ball_vy

    # Ball collision with bricks
    for i in range(8):
        if brick_alive[i]:
            brick_x = i * brick_spacing + 5
            if brick_x <= ball_x <= brick_x + brick_width and bricks_y <= ball_y <= bricks_y + brick_height:
                brick_alive[i] = 0.0
                ball_vy = -ball_vy
                score += 1

    # Check if ball is below the screen
    if ball_y > 600:
        game_over = True

    # Draw everything
    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(paddle_x), 570, 80, 12))
    pygame.draw.circle(screen, (255, 255, 255), (int(ball_x), int(ball_y)), ball_radius)

    for i in range(8):
        if brick_alive[i]:
            brick_x = i * brick_spacing + 5
            pygame.draw.rect(screen, (255, 255, 255), (brick_x, bricks_y, brick_width, brick_height))

    score_text = font.render(f"Score: {score}", True, (255, 255, 255))
    screen.blit(score_text, (10, 10))

    if game_over:
        game_over_text = font.render("GAME OVER", True, (255, 255, 255))
        screen.blit(game_over_text, (350, 300))

    pygame.display.flip()

pygame.quit()
sys.exit()