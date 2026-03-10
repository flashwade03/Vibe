```python
import pygame
import sys
import random
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Wave Spawner")
clock = pygame.time.Clock()

px, py = 400.0, 300.0
player_speed = 250.0

ex = []
ey = []
evx = []
evy = []
elife = []

wave = 1
spawn_timer = 2.0
enemies_per_wave = 3
game_over = False

font = pygame.font.Font(None, 36)

running = True