import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Grid")
clock = pygame.time.Clock()

# Initialize grid state
cells = [0.0 for _ in range(48)]

def toggle_cell(mx, my):
    col = int((mx - 40.0) / 80.0)
    row = int((my - 60.0) / 80.0)
    if 0 <= col < 8 and 0 <= row < 6:
        idx = row * 8 + col
        cells[idx] = 1.0 if cells[idx] == 0.0 else 0.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            toggle_cell(mx, my)

    screen.fill((0, 0, 0))

    # Draw grid and active cells
    for row in range(6):
        for col in range(8):
            x = 40.0 + col * 80.0
            y = 60.0 + row * 80.0
            pygame.draw.rect(screen, (255, 255, 255), (x, y, 80, 80), 1)
            if cells[row * 8 + col] == 1.0:
                pygame.draw.rect(screen, (255, 255, 255), (x + 4.0, y + 4.0, 72, 72))

    # Count active cells
    count = sum(1 for cell in cells if cell == 1.0)
    font = pygame.font.Font(None, 36)
    text = font.render(f"Active: {count}", True, (255, 255, 255))
    screen.blit(text, (10.0, 10.0))

    pygame.display.flip()

pygame.quit()
sys.exit()