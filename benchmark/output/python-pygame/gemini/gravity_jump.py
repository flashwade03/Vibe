import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Program")
clock = pygame.time.Clock()

# Game state variables
x = 384.0
y = 550.0
vy = 0.0
on_ground = True
speed = 200.0
gravity = 500.0
jump_force = -300.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()

    # Horizontal movement
    if keys[pygame.K_LEFT]:
        x -= speed * dt
    if keys[pygame.K_RIGHT]:
        x += speed * dt

    # Jump logic
    if keys[pygame.K_UP] and on_ground:
        vy = jump_force
        on_ground = False

    # Physics update
    vy += gravity * dt
    y += vy * dt

    # Ground collision
    if y >= 550.0:
        y = 550.0
        vy = 0.0
        on_ground = True

    # Drawing
    screen.fill((0, 0, 0))
    
    # Draw the player rectangle
    pygame.draw.rect(screen, (255, 255, 255), (int(x), int(y), 32, 32))
    
    pygame.display.flip()

pygame.quit()
sys.exit()