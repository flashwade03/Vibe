```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Platformer Player")
clock = pygame.time.Clock()

x = 384.0
y = 550.0
vy = 0.0