import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Platformer Player")
clock = pygame.time.Clock()

x = 384.0
y = 550.0
vy = 0.0
on_ground = True
gravity = 500.0
speed = 200.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                if on_ground:
                    vy = -300.0
                    on_ground = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        x -= speed * dt
    if keys[pygame.K_RIGHT]:
        x += speed * dt

    vy += gravity * dt
    y += vy * dt

    if y >= 550.0:
        y = 550.0
        vy = 0.0
        on_ground = True

    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, (255, 255, 255), (int(x), int(y), 32, 32))
    
    pygame.display.flip()

pygame.quit()
sys.exit()