import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Breakout")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state
paddle_x = 360.0
paddle_speed = 300.0
ball_x, ball_y = 400.0, 400.0
ball_vx, ball_vy = 200.0, -200.0
brick_alive = [1.0] * 8
score = 0
game_over = False

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not game_over:
        # Paddle movement
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] and paddle_x > 0:
            paddle_x -= paddle_speed * dt
        if keys[pygame.K_RIGHT] and paddle_x < 720:
            paddle_x += paddle_speed * dt

        # Ball movement
        ball_x += ball_vx * dt
        ball_y += ball_vy * dt

        # Wall collisions
        if ball_x < 6.0 or ball_x > 794.0:
            ball_vx *= -1
        if ball_y < 6.0:
            ball_vy *= -1
        
        # Paddle collision
        if ball_y >= 564.0 and ball_y <= 576.0 and paddle_x <= ball_x <= paddle_x + 80.0:
            ball_vy = -abs(ball_vy)

        # Brick collisions
        for i in range(8):
            if brick_alive[i] == 1.0:
                bx = 5 + (i * 100)
                if bx <= ball_x <= bx + 90 and 50 <= ball_y <= 70:
                    brick_alive[i] = 0.0
                    ball_vy *= -1
                    score += 1

        # Game over check
        if ball_y > 600:
            game_over = True

    # Drawing
    screen.fill((0, 0, 0))
    
    # Draw paddle
    pygame.draw.rect(screen, (255, 255, 255), (int(paddle_x), 570, 80, 12))
    
    # Draw ball
    pygame.draw.circle(screen, (255, 255, 255), (int(ball_x), int(ball_y)), 6)
    
    # Draw bricks
    for i in range(8):
        if brick_alive[i] == 1.0:
            pygame.draw.rect(screen, (255, 255, 255), (5 + (i * 100), 50, 90, 20))
            
    # Draw UI
    score_text = font.render(f"Score: {score}", True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    
    if game_over:
        go_text = font.render("GAME OVER", True, (255, 255, 255))
        screen.blit(go_text, (340, 300))

    pygame.display.flip()

pygame.quit()
sys.exit()