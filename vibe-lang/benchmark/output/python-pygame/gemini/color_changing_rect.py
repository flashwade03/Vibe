import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Program")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
rect_size = 64
x = 400.0 - (rect_size / 2)
y = 300.0 - (rect_size / 2)
speed = 100.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        x -= speed * dt
    if keys[pygame.K_RIGHT]:
        x += speed * dt
    if keys[pygame.K_UP]:
        y -= speed * dt
    if keys[pygame.K_DOWN]:
        y += speed * dt

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw rectangle
    pygame.draw.rect(screen, (255, 255, 255), (int(x), int(y), rect_size, rect_size))
    
    # Draw text
    text_str = "x: " + str(x) + " y: " + str(y)
    text_surface = font.render(text_str, True, (255, 255, 255))
    screen.blit(text_surface, (10, 10))
    
    pygame.display.flip()

pygame.quit()
sys.exit()