import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Simple Pendulum")
clock = pygame.time.Clock()

# Pendulum state variables
angle = 1.0  # radians
angular_vel = 0.0
length = 250.0
gravity = 9.8

def update(dt):
    global angle, angular_vel
    angular_acc = (0.0 - gravity / length) * math.sin(angle)
    angular_vel += angular_acc * dt
    angular_vel *= 0.999  # damping
    angle += angular_vel * dt

def draw():
    screen.fill((0, 0, 0))
    pivot_x, pivot_y = 400.0, 100.0
    bob_x = pivot_x + math.sin(angle) * length
    bob_y = pivot_y + math.cos(angle) * length

    # Draw pivot
    pygame.draw.circle(screen, (255, 255, 255), (int(pivot_x), int(pivot_y)), 5)

    # Draw rod
    for i in range(0, 20):
        t = float(i) / 20.0
        rx = pivot_x + math.sin(angle) * length * t
        ry = pivot_y + math.cos(angle) * length * t
        pygame.draw.rect(screen, (255, 255, 255), (int(rx), int(ry), 2, 2))

    # Draw bob
    pygame.draw.circle(screen, (255, 255, 255), (int(bob_x), int(bob_y)), 15)

    # Display text
    font = pygame.font.Font(None, 36)
    angle_text = font.render(f"Angle: {angle:.2f}", True, (255, 255, 255))
    screen.blit(angle_text, (10, 10))
    click_text = font.render("Click to push", True, (255, 255, 255))
    screen.blit(click_text, (10, 30))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            if event.button == 1:  # Left mouse button
                angular_vel += 0.5

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()