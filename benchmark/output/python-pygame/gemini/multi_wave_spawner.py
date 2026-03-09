```python
import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Wave Spawner")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Player state
px