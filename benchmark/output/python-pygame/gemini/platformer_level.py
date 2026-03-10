```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Platformer")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

player_x = 100.0
player_y = 400.0
vy = 0.0
on_ground = False

plat_xs = [50.0, 300.0, 500.0, 200.0, 450.0]
plat_ys = [450.0, 380.0, 3