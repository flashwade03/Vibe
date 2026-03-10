import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("2D Heat Diffusion")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
heat = [0.0] * 192
next_heat = [0.0] * 192

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            col = int(mx / 50.0)
            row = int(my / 50.0)
            if 0 <= col < 16 and 0 <= row < 12:
                heat[row * 16 + col] = 100.0

    # Update logic
    for row in range(12):
        for col in range(16):
            idx = row * 16 + col
            total_sum = 0.0
            n = 0
            if row > 0:
                total_sum += heat[(row - 1) * 16 + col]
                n += 1
            if row < 11:
                total_sum += heat[(row + 1) * 16 + col]
                n += 1
            if col > 0:
                total_sum += heat[row * 16 + col - 1]
                n += 1
            if col < 15:
                total_sum += heat[row * 16 + col + 1]
                n += 1
            
            avg = total_sum / float(n)
            next_heat[idx] = heat[idx] + (avg - heat[idx]) * 2.0 * dt
            next_heat[idx] = next_heat[idx] * 0.998
            
    for i in range(192):
        heat[i] = next_heat[i]

    # Draw logic
    screen.fill((0, 0, 0))
    max_t = 0.0
    for row in range(12):
        for col in range(16):
            temp = heat[row * 16 + col]
            if temp > max_t:
                max_t = temp
            
            size = (temp / 100.0) * 48.0
            if size > 48.0: size = 48.0
            if size > 1.0:
                off = (48.0 - size) / 2.0
                rect_x = col * 50.0 + 1.0 + off
                rect_y = row * 50.0 + 1.0 + off
                pygame.draw.rect(screen, (255, 255, 255), (rect_x, rect_y, size, size))

    text1 = font.render("Click to add heat", True, (255, 255, 255))
    text2 = font.render("Max: " + str(int(max_t)), True, (255, 255, 255))
    screen.blit(text1, (10, 10))
    screen.blit(text2, (10, 40))

    pygame.display.flip()

pygame.quit()
sys.exit()