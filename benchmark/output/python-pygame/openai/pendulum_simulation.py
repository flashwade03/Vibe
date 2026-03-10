import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Simple Pendulum")
clock = pygame.time.Clock()

# Pendulum state variables
angle = 1.0
angular_vel = 0.0
length = 250.0
gravity = 9.8
pivot_x, pivot_y = 400.0, 100.0

font = pygame.font.Font(None, 36)

def update(dt):
    global angle, angular_vel
    angular_acc = (-gravity / length) * math.sin(angle)
    angular_vel += angular_acc * dt
    angular_vel *= 0.999  # Damping
    angle += angular_vel * dt

def draw():
    screen.fill((0, 0, 0))
    
    # Compute bob position
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
    
    # Display angle
    angle_text = font.render(f"Angle: {angle:.2f}", True, (255, 255, 255))
    screen.blit(angle_text, (10, 10))
    
    # Display instruction
    instruction_text = font.render("Click to push", True, (255, 255, 255))
    screen.blit(instruction_text, (10, 30))

def mousepressed(mx, my, button):
    global angular_vel
    if button == 1:  # Left mouse button
        angular_vel += 0.5

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            mousepressed(mx, my, event.button)

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()