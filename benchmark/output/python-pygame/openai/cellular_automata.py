import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Conway's Game of Life")
clock = pygame.time.Clock()

# Initialize game state
cells = []
next_cells = []
sim_timer = 0.0
generation = 0
paused = False

def load():
    global cells, next_cells
    for i in range(300):
        if random.random() > 0.7:
            cells.append(1.0)
        else:
            cells.append(0.0)
        next_cells.append(0.0)

def keypressed(k):
    global paused
    if k == pygame.K_SPACE:
        paused = not paused

def update(dt):
    global sim_timer, generation, cells, next_cells
    if not paused:
        sim_timer += dt
        if sim_timer >= 0.2:
            sim_timer = 0.0
            generation += 1
            for row in range(15):
                for col in range(20):
                    count = 0
                    if row > 0 and col > 0 and cells[(row - 1) * 20 + col - 1] == 1.0:
                        count += 1
                    if row > 0 and cells[(row - 1) * 20 + col] == 1.0:
                        count += 1
                    if row > 0 and col < 19 and cells[(row - 1) * 20 + col + 1] == 1.0:
                        count += 1
                    if col > 0 and cells[row * 20 + col - 1] == 1.0:
                        count += 1
                    if col < 19 and cells[row * 20 + col + 1] == 1.0:
                        count += 1
                    if row < 14 and col > 0 and cells[(row + 1) * 20 + col - 1] == 1.0:
                        count += 1
                    if row < 14 and cells[(row + 1) * 20 + col] == 1.0:
                        count += 1
                    if row < 14 and col < 19 and cells[(row + 1) * 20 + col + 1] == 1.0:
                        count += 1

                    idx = row * 20 + col
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

            for i in range(300):
                cells[i] = next_cells[i]

def draw():
    screen.fill((0, 0, 0))
    for row in range(15):
        for col in range(20):
            if cells[row * 20 + col] == 1.0:
                pygame.draw.rect(screen, (255, 255, 255), (col * 40, row * 40, 38, 38))
    font = pygame.font.Font(None, 36)
    text = font.render(f"Gen: {generation}", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    if paused:
        paused_text = font.render("PAUSED", True, (255, 255, 255))
        screen.blit(paused_text, (350, 10))

load()

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            keypressed(event.key)

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()