```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Program")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

def draw_text(text, x, y):
    text_surface = font.render(text, True, (255, 255, 255))
    screen.blit(text_surface, (x, y))

# Center of 800x600 for a 64x64 rectangle
x = 368.0
y = 268.0
speed = 100.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():