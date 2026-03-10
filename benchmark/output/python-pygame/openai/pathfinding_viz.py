import pygame
import sys
from collections import deque

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("BFS Visualization")
clock = pygame.time.Clock()

# Constants
CELL_SIZE = 50
GRID_WIDTH = 16
GRID_HEIGHT = 12
START_IDX = 0
END_IDX = 191

# Colors
COLOR_OPEN = (0, 0, 0)
COLOR_WALL = (255, 255, 255)
COLOR_VISITED = (0, 255, 0)
COLOR_PATH = (0, 0, 255)
COLOR_START_END = (255, 0, 0)
COLOR_TEXT = (255, 255, 255)

# Game state variables
grid = [0.0] * (GRID_WIDTH * GRID_HEIGHT)
grid[START_IDX] = 4.0
grid[END_IDX] = 5.0
queue = deque()
q_ptr = 0
parent = [-1.0] * (GRID_WIDTH * GRID_HEIGHT)
bfs_running = False
found = False

def reset_grid():
    global queue, q_ptr, bfs_running, found
    for i in range(GRID_WIDTH * GRID_HEIGHT):
        if grid[i] == 2.0 or grid[i] == 3.0:
            grid[i] = 0.0
        parent[i] = -1.0
    queue = deque([float(START_IDX)])
    q_ptr = 0
    bfs_running = True
    found = False

def bfs_step():
    global bfs_running, found
    if bfs_running and q_ptr < len(queue):
        cur = int(queue[q_ptr])
        q_ptr += 1
        if cur == END_IDX:
            bfs_running = False
            found = True
            trace_path()
        else:
            if grid[cur] != 4.0:
                grid[cur] = 2.0
            for n in get_neighbors(cur):
                if (grid[n] == 0.0 or grid[n] == 5.0) and parent[n] == -1.0:
                    parent[n] = float(cur)
                    queue.append(float(n))
    if q_ptr >= len(queue) and not found:
        bfs_running = False

def trace_path():
    p = END_IDX
    while parent[p] != -1.0:
        p = int(parent[p])
        if p != START_IDX:
            grid[p] = 3.0

def get_neighbors(idx):
    neighbors = []
    row, col = divmod(idx, GRID_WIDTH)
    if row > 0: neighbors.append(idx - GRID_WIDTH)
    if row < GRID_HEIGHT - 1: neighbors.append(idx + GRID_WIDTH)
    if col > 0: neighbors.append(idx - 1)
    if col < GRID_WIDTH - 1: neighbors.append(idx + 1)
    return neighbors

def draw():
    screen.fill(COLOR_OPEN)
    for row in range(GRID_HEIGHT):
        for col in range(GRID_WIDTH):
            idx = row * GRID_WIDTH + col
            x, y = col * CELL_SIZE, row * CELL_SIZE
            if grid[idx] == 1.0:
                pygame.draw.rect(screen, COLOR_WALL, (x, y, CELL_SIZE, CELL_SIZE))
            elif grid[idx] == 2.0:
                pygame.draw.rect(screen, COLOR_VISITED, (x + 15, y + 15, 20, 20))
            elif grid[idx] == 3.0:
                pygame.draw.rect(screen, COLOR_PATH, (x + 5, y + 5, 40, 40))
            elif grid[idx] == 4.0 or grid[idx] == 5.0:
                pygame.draw.circle(screen, COLOR_START_END, (x + 25, y + 25), 15)
    font = pygame.font.Font(None, 36)
    text = font.render("Click: walls | Space: BFS", True, COLOR_TEXT)
    screen.blit(text, (10, 10))
    if found:
        text = font.render("Path found!", True, COLOR_TEXT)
        screen.blit(text, (300, 10))
    elif not bfs_running and not found and q_ptr > 0:
        text = font.render("No path", True, COLOR_TEXT)
        screen.blit(text, (300, 10))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            col = int(mx / CELL_SIZE)
            row = int(my / CELL_SIZE)
            if 0 <= col < GRID_WIDTH and 0 <= row < GRID_HEIGHT:
                idx = row * GRID_WIDTH + col
                if idx != START_IDX and idx != END_IDX:
                    grid[idx] = 1.0 if grid[idx] == 0.0 else 0.0
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and not bfs_running:
                reset_grid()

    bfs_step()
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()