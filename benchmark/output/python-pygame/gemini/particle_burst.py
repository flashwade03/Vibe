```python
import pygame
import sys
import math
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Particle Burst")
clock = pygame.time.Clock()

particle_xs = []
particle_ys = []
particle_vxs = []
particle