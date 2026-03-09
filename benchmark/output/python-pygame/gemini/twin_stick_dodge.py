```python
import pygame
import sys
import math
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Dodge the Bullets")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

player_x