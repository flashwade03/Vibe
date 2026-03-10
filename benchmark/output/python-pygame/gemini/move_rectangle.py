import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Rectangle")
clock = pygame.time.Clock()

# Initial position at center (800/2 - 32/2, 600/2 - 32/2)
rect_x, rect_y = 384.0, 284.0
speed = 200.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    
    # Movement logic using arrow keys
    if keys[pygame.K_LEFT]:
        rect_x -= speed * dt
    if keys[pygame.K_RIGHT]:
        rect_x += speed * dt
    if keys[pygame.K_UP]:
        rect_y -= speed * dt
    if keys[pygame.K_DOWN]:
        rect_y += speed * dt

    # Clear screen
    screen.fill((0, 0, 0))
    
    # Draw white rectangle
    pygame.draw.rect(screen, (255, 255, 255), (int(rect_x), int(rect_y), 32, 32))
    
    pygame.display.flip()

pygame.quit()
sys.exit()