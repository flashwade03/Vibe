import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Bouncing Ball")
clock = pygame.time.Clock()

ball_pos = [400.0, 300.0]
ball_velocity = [150.0, 150.0]
ball_radius = 16

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update ball position
    ball_pos[0] += ball_velocity[0] * dt
    ball_pos[1] += ball_velocity[1] * dt

    # Check for collision with window edges and reverse velocity
    if ball_pos[0] - ball_radius < 0 or ball_pos[0] + ball_radius > 800:
        ball_velocity[0] = -ball_velocity[0]
    if ball_pos[1] - ball_radius < 0 or ball_pos[1] + ball_radius > 600:
        ball_velocity[1] = -ball_velocity[1]

    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(ball_pos[0]), int(ball_pos[1])), ball_radius)
    pygame.display.flip()

pygame.quit()
sys.exit()