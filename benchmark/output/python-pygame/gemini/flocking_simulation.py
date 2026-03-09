```python
import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Boids")
clock = pygame.time.Clock()

boid_xs = []
boid_ys = []
boid_v