import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Verlet Rope Simulation")
clock = pygame.time.Clock()

# Game state variables
node_xs = []
node_ys = []
prev_xs = []
prev_ys = []
pin_x, pin_y = 200.0, 200.0
rest_len = 40.0
speed = 200.0

# Initialize nodes
for i in range(10):
    node_xs.append(200.0 + float(i) * 40.0)
    prev_xs.append(200.0 + float(i) * 40.0)
    node_ys.append(200.0)
    prev_ys.append(200.0)

font = pygame.font.Font(None, 36)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]: pin_x -= speed * dt
    if keys[pygame.K_RIGHT]: pin_x += speed * dt
    if keys[pygame.K_UP]: pin_y -= speed * dt
    if keys[pygame.K_DOWN]: pin_y += speed * dt

    node_xs[0] = pin_x
    node_ys[0] = pin_y
    prev_xs[0] = pin_x
    prev_ys[0] = pin_y

    # Verlet integration
    for i in range(1, 10):
        vx = node_xs[i] - prev_xs[i]
        vy = node_ys[i] - prev_ys[i]
        prev_xs[i] = node_xs[i]
        prev_ys[i] = node_ys[i]
        node_xs[i] = node_xs[i] + vx * 0.99
        node_ys[i] = node_ys[i] + vy * 0.99 + 400.0 * dt * dt

    # Constraint solve
    for _ in range(3):
        for i in range(9):
            dx = node_xs[i + 1] - node_xs[i]
            dy = node_ys[i + 1] - node_ys[i]
            dist = math.sqrt(dx * dx + dy * dy)
            if dist > 0.1:
                diff = (dist - rest_len) / dist * 0.5
                if i == 0:
                    node_xs[i + 1] -= dx * diff * 2.0
                    node_ys[i + 1] -= dy * diff * 2.0
                else:
                    node_xs[i] += dx * diff
                    node_ys[i] += dy * diff
                    node_xs[i + 1] -= dx * diff
                    node_ys[i + 1] -= dy * diff

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw nodes
    for i in range(10):
        pygame.draw.circle(screen, (255, 255, 255), (int(node_xs[i]), int(node_ys[i])), 5)
    
    # Draw segments
    for i in range(9):
        for j in range(5):
            lt = float(j) / 5.0
            x = node_xs[i] + (node_xs[i+1] - node_xs[i]) * lt
            y = node_ys[i] + (node_ys[i+1] - node_ys[i]) * lt
            pygame.draw.circle(screen, (255, 255, 255), (int(x), int(y)), 2)

    text = font.render("Arrows move anchor", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()