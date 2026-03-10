import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("2D Heat Diffusion")
clock = pygame.time.Clock()

heat = [0.0] * 192
next_heat = [0.0] * 192

def mousepressed(mx, my, button):
    col = int(mx / 50.0)
    row = int(my / 50.0)
    if 0 <= col < 16 and 0 <= row < 12:
        heat[row * 16 + col] = 100.0

def update(dt):
    for row in range(12):
        for col in range(16):
            idx = row * 16 + col
            sum_heat = 0.0
            n = 0
            if row > 0:
                sum_heat += heat[(row - 1) * 16 + col]
                n += 1
            if row < 11:
                sum_heat += heat[(row + 1) * 16 + col]
                n += 1
            if col > 0:
                sum_heat += heat[row * 16 + col - 1]
                n += 1
            if col < 15:
                sum_heat += heat[row * 16 + col + 1]
                n += 1
            avg = sum_heat / float(n)
            next_heat[idx] = heat[idx] + (avg - heat[idx]) * 2.0 * dt
            next_heat[idx] *= 0.998
    for i in range(192):
        heat[i] = next_heat[i]

def draw():
    screen.fill((0, 0, 0))
    max_t = 0.0
    for row in range(12):
        for col in range(16):
            temp = heat[row * 16 + col]
            if temp > max_t:
                max_t = temp
            size = temp / 100.0 * 48.0
            if size > 48.0:
                size = 48.0
            if size > 1.0:
                off = (48.0 - size) / 2.0
                pygame.draw.rect(screen, (255, 255, 255), (col * 50.0 + 1.0 + off, row * 50.0 + 1.0 + off, size, size))
    font = pygame.font.Font(None, 36)
    text = font.render("Click to add heat", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    text = font.render("Max: " + str(int(max_t)), True, (255, 255, 255))
    screen.blit(text, (10, 30))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            mousepressed(mx, my, event.button)

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()