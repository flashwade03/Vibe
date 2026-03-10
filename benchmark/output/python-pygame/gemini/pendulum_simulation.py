import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Pendulum Simulation")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Pendulum state
angle = 1.0
angular_vel = 0.0
length = 250.0
gravity = 9.8

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            angular_vel += 0.5

    # Update logic
    angular_acc = (0.0 - gravity / length) * math.sin(angle)
    angular_vel += angular_acc * dt
    angular_vel *= 0.999
    angle += angular_vel * dt

    # Draw logic
    screen.fill((0, 0, 0))
    
    bob_x = 400.0 + math.sin(angle) * length
    bob_y = 100.0 + math.cos(angle) * length

    # Draw pivot
    pygame.draw.circle(screen, (255, 255, 255), (400, 100), 5)

    # Draw rod
    for i in range(0, 20):
        t = float(i) / 20.0
        rx = 400.0 + math.sin(angle) * length * t
        ry = 100.0 + math.cos(angle) * length * t
        pygame.draw.rect(screen, (255, 255, 255), (int(rx), int(ry), 2, 2))

    # Draw bob
    pygame.draw.circle(screen, (255, 255, 255), (int(bob_x), int(bob_y)), 15)

    # UI
    text_angle = font.render(f"Angle: {angle:.2f}", True, (255, 255, 255))
    text_push = font.render("Click to push", True, (255, 255, 255))
    screen.blit(text_angle, (10, 10))
    screen.blit(text_push, (10, 30))

    pygame.display.flip()

pygame.quit()
sys.exit()