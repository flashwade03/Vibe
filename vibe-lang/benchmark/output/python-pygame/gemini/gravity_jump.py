import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Jump")
clock = pygame.time.Clock()

# Game state variables
x, y = 384.0, 550.0
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
        # Handle jump on key down event
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP and on_ground:
                vy = jump_force
                on_ground = False

    # Horizontal movement
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        x -= speed * dt
    if keys[pygame.K_RIGHT]:
        x += speed * dt

    # Vertical movement and gravity
    vy += gravity * dt
    y += vy * dt

    # Ground collision
    if y >= 550:
        y = 550
        vy = 0
        on_ground = True

    # Draw logic
    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(x), int(y), 32, 32))
    
    # Draw ground line for reference
    pygame.draw.line(screen, (255, 255, 255), (0, 582), (800, 582), 2)
    
    pygame.display.flip()

pygame.quit()
sys.exit()