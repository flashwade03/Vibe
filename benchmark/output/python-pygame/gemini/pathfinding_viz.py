import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("BFS Visualization")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
grid = [0.0] * 192
grid[0] = 4.0
grid[191] = 5.0
parent = [-1.0] * 192
queue = []
q_ptr = 0
bfs_running = False
found = False

def get_neighbors(idx):
    neighbors = []
    row, col = divmod(idx, 16)
    if row > 0: neighbors.append(idx - 16)
    if row < 11: neighbors.append(idx + 16)
    if col > 0: neighbors.append(idx - 1)
    if col < 15: neighbors.append(idx + 1)
    return neighbors

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            col, row = int(mx // 50), int(my // 50)
            if 0 <= col < 16 and 0 <= row < 12:
                idx = row * 16 + col
                if idx != 0 and idx != 191:
                    if grid[idx] == 0.0: grid[idx] = 1.0
                    elif grid[idx] == 1.0: grid[idx] = 0.0

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and not bfs_running:
                for i in range(192):
                    if grid[i] == 2.0 or grid[i] == 3.0:
                        grid[i] = 0.0
                    parent[i] = -1.0
                queue = [0.0]
                q_ptr = 0
                bfs_running = True
                found = False

    # BFS Update logic
    if bfs_running and q_ptr < len(queue):
        cur = int(queue[q_ptr])
        q_ptr += 1
        
        if cur == 191:
            bfs_running = False
            found = True
            p = int(parent[191])
            while p != -1 and p != 0:
                grid[p] = 3.0
                p = int(parent[p])
        else:
            if grid[cur] != 4.0:
                grid[cur] = 2.0
            for n in get_neighbors(cur):
                if (grid[n] == 0.0 or grid[n] == 5.0) and parent[n] == -1.0:
                    parent[n] = float(cur)
                    queue.append(float(n))
        
        if q_ptr >= len(queue) and not found:
            bfs_running = False

    # Draw logic
    screen.fill((0, 0, 0))
    for row in range(12):
        for col in range(16):
            idx = row * 16 + col
            x, y = col * 50, row * 50
            rect = (x, y, 50, 50)
            
            if grid[idx] == 1.0:
                pygame.draw.rect(screen, (255, 255, 255), rect)
            elif grid[idx] == 2.0:
                pygame.draw.rect(screen, (100, 100, 100), (x + 15, y + 15, 20, 20))
            elif grid[idx] == 3.0:
                pygame.draw.rect(screen, (0, 255, 0), (x + 5, y + 5, 40, 40))
            elif grid[idx] == 4.0:
                pygame.draw.circle(screen, (0, 0, 255), (x + 25, y + 25), 15)
            elif grid[idx] == 5.0:
                pygame.draw.circle(screen, (255, 0, 0), (x + 25, y + 25), 15)
            
            pygame.draw.rect(screen, (50, 50, 50), rect, 1)

    screen.blit(font.render("Click: walls | Space: BFS", True, (255, 255, 255)), (10, 560))
    if found:
        screen.blit(font.render("Path found!", True, (0, 255, 0)), (300, 560))
    elif not bfs_running and q_ptr > 0 and not found:
        screen.blit(font.render("No path", True, (255, 0, 0)), (300, 560))

    pygame.display.flip()

pygame.quit()
sys.exit()