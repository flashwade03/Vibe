```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Snake Movement")
clock = pygame.time.Clock()

snake_xs = [400.0, 380.0, 360.0]
snake