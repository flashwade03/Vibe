```python
import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Large World with Minimap")
clock = pygame.time.Clock()

player_x, player_y = 1000.0, 10