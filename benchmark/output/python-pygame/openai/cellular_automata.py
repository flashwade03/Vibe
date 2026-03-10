import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Conway's Game of Life")
clock = pygame.time.Clock()

# Constants
GRID_WIDTH = 20
GRID_HEIGHT = 15
CELL_SIZE = 40
SIMULATION_INTERVAL = 0.2

# Game state variables
cells = [1.0 if random.random() > 0.7 else 0.0 for _ in range(GRID_WIDTH * GRID_HEIGHT)]
next_cells = [0.0 for _ in range(GRID_WIDTH * GRID_HEIGHT)]
sim_timer = 0.0
generation = 0
paused = False

def update_cells():
    global cells, next_cells, generation
    for row in range(GRID_HEIGHT):
        for col in range(GRID_WIDTH):
            count = 0
            # Check 8 neighbors
            if row > 0 and col > 0 and cells[(row - 1) * GRID_WIDTH + (col - 1)] == 1.0:
                count += 1
            if row > 0 and cells[(row - 1) * GRID_WIDTH + col] == 1.0:
                count += 1
            if row > 0 and col < GRID_WIDTH - 1 and cells[(row - 1) * GRID_WIDTH + (col + 1)] == 1.0:
                count += 1
            if col > 0 and cells[row * GRID_WIDTH + (col - 1)] == 1.0:
                count += 1
            if col < GRID_WIDTH - 1 and cells[row * GRID_WIDTH + (col + 1)] == 1.0:
                count += 1
            if row < GRID_HEIGHT - 1 and col > 0 and cells[(row + 1) * GRID_WIDTH + (col - 1)] == 1.0:
                count += 1
            if row < GRID_HEIGHT - 1 and cells[(row + 1) * GRID_WIDTH + col] == 1.0:
                count += 1
            if row < GRID_HEIGHT - 1 and col < GRID_WIDTH - 1 and cells[(row + 1) * GRID_WIDTH + (col + 1)] == 1.0:
                count += 1

            idx = row * GRID_WIDTH + col
            if cells[idx] == 1.0:
                if count == 2 or count == 3:
                    next_cells[idx] = 1.0
                else:
                    next_cells[idx] = 0.0
            else:
                if count == 3:
                    next_cells[idx] = 1.0
                else:
                    next_cells[idx] = 0.0

    # Copy next_cells to cells
    cells = next_cells[:]
    generation += 1

def draw():
    screen.fill((0, 0, 0))
    for row in range(GRID_HEIGHT):
        for col in range(GRID_WIDTH):
            if cells[row * GRID_WIDTH + col] == 1.0:
                pygame.draw.rect(screen, (255, 255, 255), (col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2))
    font = pygame.font.Font(None, 36)
    text = font.render(f"Gen: {generation}", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    if paused:
        paused_text = font.render("PAUSED", True, (255, 255, 255))
        screen.blit(paused_text, (350, 10))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                paused = not paused

    if not paused:
        sim_timer += dt
        if sim_timer >= SIMULATION_INTERVAL:
            sim_timer = 0.0
            update_cells()

    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()