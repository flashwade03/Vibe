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
COLOR_BG = (0, 0, 0)
COLOR_WALL = (255, 255, 255)
COLOR_VISITED = (0, 255, 0)
COLOR_PATH = (0, 0, 255)
COLOR_START_END = (255, 0, 0)
COLOR_TEXT = (255, 255, 255)

# Initialize grid and BFS state
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

def bfs_update():
    global bfs_running, found
    if bfs_running and q_ptr < len(queue):
        cur = int(queue[q_ptr])
        q_ptr += 1
        if cur == END_IDX:
            bfs_running = False
            found = True
            p = END_IDX
            while int(parent[p]) > 0:
                p = int(parent[p])
                if p != START_IDX:
                    grid[p] = 3.0
        else:
            if grid[cur] != 4.0:
                grid[cur] = 2.0
            neighbors = [cur - GRID_WIDTH, cur + GRID_WIDTH, cur - 1, cur + 1]
            for n in neighbors:
                if 0 <= n < GRID_WIDTH * GRID_HEIGHT and (grid[n] == 0.0 or grid[n] == 5.0) and parent[n] == -1.0:
                    parent[n] = float(cur)
                    queue.append(float(n))
    if q_ptr >= len(queue) and not found:
        bfs_running = False

def draw_grid():
    for row in range(GRID_HEIGHT):
        for col in range(GRID_WIDTH):
            idx = row * GRID_WIDTH + col
            x = float(col) * CELL_SIZE
            y = float(row) * CELL_SIZE
            if grid[idx] == 1.0:
                pygame.draw.rect(screen, COLOR_WALL, (x, y, CELL_SIZE, CELL_SIZE))
            elif grid[idx] == 2.0:
                pygame.draw.rect(screen, COLOR_VISITED, (x + 15.0, y + 15.0, 20.0, 20.0))
            elif grid[idx] == 3.0:
                pygame.draw.rect(screen, COLOR_PATH, (x + 5.0, y + 5.0, 40.0, 40.0))
            elif grid[idx] == 4.0 or grid[idx] == 5.0:
                pygame.draw.circle(screen, COLOR_START_END, (int(x + 25.0), int(y + 25.0)), 15)

def draw_text(text, x, y):
    font = pygame.font.Font(None, 36)
    text_surface = font.render(text, True, COLOR_TEXT)
    screen.blit(text_surface, (x, y))

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
                    if grid[idx] == 0.0:
                        grid[idx] = 1.0
                    elif grid[idx] == 1.0:
                        grid[idx] = 0.0
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and not bfs_running:
                reset_grid()

    bfs_update()

    screen.fill(COLOR_BG)
    draw_grid()
    draw_text("Click: walls | Space: BFS", 10.0, 10.0)
    if found:
        draw_text("Path found!", 300.0, 10.0)
    elif not bfs_running and not found and q_ptr > 0:
        draw_text("No path", 300.0, 10.0)

    pygame.display.flip()

pygame.quit()
sys.exit()