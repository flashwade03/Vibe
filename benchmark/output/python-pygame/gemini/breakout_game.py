```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Breakout")
clock = pygame.time.Clock()

paddle_x = 360.0
paddle_y = 570.0
paddle_w = 80.0
paddle_h = 12.0
paddle_speed = 300.0

bx = 400.0
by = 400.0
vx = 200.0
vy = -200.0
radius = 6

brick_alive = [1.0, 1.0,