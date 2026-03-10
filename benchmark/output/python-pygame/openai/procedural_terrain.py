import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Procedural 1D Terrain")
clock = pygame.time.Clock()

heights = []
scroll_timer = 0.0
scroll_speed = 60.0

def load():
    global heights
    h = 300.0
    for i in range(80):
        h += random.uniform(-30.0, 30.0)
        if h < 100.0:
            h = 100.0
        if h > 500.0:
            h = 500.0
        heights.append(h)

def update(dt):
    global scroll_timer, scroll_speed, heights
    scroll_timer += scroll_speed * dt
    if scroll_timer >= 10.0:
        scroll_timer -= 10.0
        for i in range(79):
            heights[i] = heights[i + 1]
        new_h = heights[78] + random.uniform(-30.0, 30.0)
        if new_h < 100.0:
            new_h = 100.0
        if new_h > 500.0:
            new_h = 500.0
        heights[79] = new_h

    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP]:
        scroll_speed += 50.0 * dt
    if keys[pygame.K_DOWN]:
        scroll_speed -= 50.0 * dt
    if scroll_speed < 20.0:
        scroll_speed = 20.0
    if scroll_speed > 200.0:
        scroll_speed = 200.0

def draw():
    screen.fill((0, 0, 0))
    for i in range(80):
        pygame.draw.rect(screen, (255, 255, 255), (i * 10, heights[i], 10, 600 - heights[i]))
    player_col = 20
    pygame.draw.rect(screen, (255, 0, 0), (player_col * 10 - 1, heights[player_col] - 14, 12, 14))
    font = pygame.font.Font(None, 36)
    height_text = font.render("Height: " + str(int(heights[20])), True, (255, 255, 255))
    speed_text = font.render("Speed: " + str(int(scroll_speed)), True, (255, 255, 255))
    screen.blit(height_text, (10, 10))
    screen.blit(speed_text, (10, 30))

load()
running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()