```python
import pygame
import sys
import math
from typing import List

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Game")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

px: float =