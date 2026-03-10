import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe")
clock = pygame.time.Clock()

font = pygame.font.Font(None, 36)

def draw_text(surface, text, pos_x, pos_y):
    text_surface = font.render(text, True, (255, 255, 255))
    surface.blit(text_surface, (pos_x, pos_y))

# Center of 800x600 for a 64x64 rectangle
x, y = 368.0, 268.0
speed = 100.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        x -= speed * dt
    if keys[pygame.K_RIGHT]:
        x += speed * dt
    if keys[pygame.K_UP]:
        y -= speed * dt
    if keys[pygame.K_DOWN]:
        y += speed * dt

    screen.fill((0, 0, 0))
    
    pygame.draw.rect(screen, (255, 255, 255), (int(x), int(y), 64, 64))
    
    pos_text = "x: " + str(x) + " y: " + str(y)
    draw_text(screen, pos_text, 10, 10)

    pygame.display.flip()

pygame.quit()
sys.exit()