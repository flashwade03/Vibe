import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Snake Grid")
clock = pygame.time.Clock()

# Snake state
snake_xs = [400.0, 380.0, 360.0]
snake_ys = [300.0, 300.0, 300.0]
dir_x, dir_y = 1.0, 0.0
move_timer = 0.15
grid_size = 20.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        # Handle input
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT and dir_x != 1.0:
                dir_x, dir_y = -1.0, 0.0
            elif event.key == pygame.K_RIGHT and dir_x != -1.0:
                dir_x, dir_y = 1.0, 0.0
            elif event.key == pygame.K_UP and dir_y != 1.0:
                dir_x, dir_y = 0.0, -1.0
            elif event.key == pygame.K_DOWN and dir_y != -1.0:
                dir_x, dir_y = 0.0, 1.0

    # Update logic
    move_timer -= dt
    if move_timer <= 0:
        move_timer = 0.15
        
        # Calculate new head
        new_x = snake_xs[0] + dir_x * grid_size
        new_y = snake_ys[0] + dir_y * grid_size
        
        # Wrap positions
        if new_x >= 800.0: new_x = 0.0
        elif new_x < 0.0: new_x = 780.0
        if new_y >= 600.0: new_y = 0.0
        elif new_y < 0.0: new_y = 580.0
        
        # Shift segments
        for i in range(len(snake_xs) - 1, 0, -1):
            snake_xs[i] = snake_xs[i-1]
            snake_ys[i] = snake_ys[i-1]
            
        snake_xs[0] = new_x
        snake_ys[0] = new_y

    # Draw logic
    screen.fill((0, 0, 0))
    for i in range(len(snake_xs)):
        pygame.draw.rect(screen, (255, 255, 255), (int(snake_xs[i]), int(snake_ys[i]), 18, 18))
    
    pygame.display.flip()

pygame.quit()
sys.exit()