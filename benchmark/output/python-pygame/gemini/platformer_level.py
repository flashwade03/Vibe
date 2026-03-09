```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Platformer")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

player_x, player_y =