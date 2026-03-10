import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Grid Toggle")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
cells = []

def load():
    for i in range(0, 48):
        cells.append(0.0)

load()

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            col = int((mx - 40.0) / 80.0)
            row = int((my - 60.0) / 80.0)
            if col >= 0 and col < 8 and row >= 0 and row < 6:
                idx = row * 8 + col
                if cells[idx] == 0.0:
                    cells[idx] = 1.0
                else:
                    cells[idx] = 0.0

    screen.fill((0, 0, 0))

    # Draw logic
    count = 0
    for row in range(0, 6):
        for col in range(0, 8):
            x = 40.0 + float(col) * 80.0
            y = 60.0 + float(row) * 80.0
            
            # Draw cell border
            pygame.draw.rect(screen, (255, 255, 255), (int(x), int(y), 80, 80), 1)
            
            idx = row * 8 + col
            if cells[idx] == 1.0:
                # Draw filled cell
                pygame.draw.rect(screen, (255, 255, 255), (int(x + 4.0), int(y + 4.0), 72, 72))
                count += 1

    # Draw text
    text = font.render("Active: " + str(count), True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()