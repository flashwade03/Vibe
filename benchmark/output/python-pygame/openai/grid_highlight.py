import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Grid")
clock = pygame.time.Clock()

# Initialize grid state
cells = []
def load():
    for i in range(48):
        cells.append(0.0)

load()

def mousepressed(mx, my, button):
    col = int((mx - 40.0) / 80.0)
    row = int((my - 60.0) / 80.0)
    if col >= 0 and col < 8 and row >= 0 and row < 6:
        idx = row * 8 + col
        if cells[idx] == 0.0:
            cells[idx] = 1.0
        else:
            cells[idx] = 0.0

def draw():
    screen.fill((0, 0, 0))
    count = 0
    for row in range(6):
        for col in range(8):
            x = 40.0 + float(col) * 80.0
            y = 60.0 + float(row) * 80.0
            pygame.draw.rect(screen, (255, 255, 255), (x, y, 80, 80), 1)
            if cells[row * 8 + col] == 1.0:
                pygame.draw.rect(screen, (255, 255, 255), (x + 4.0, y + 4.0, 72, 72))
                count += 1
    font = pygame.font.Font(None, 36)
    text = font.render("Active: " + str(count), True, (255, 255, 255))
    screen.blit(text, (10.0, 10.0))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            mousepressed(mx, my, event.button)

    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()