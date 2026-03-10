import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Smooth Follow Circle")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
target_x: float = 400.0
target_y: float = 300.0
cx: float = 400.0
cy: float = 300.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            target_x = float(mx)
            target_y = float(my)

    # Update logic
    cx = cx + (target_x - cx) * 3.0 * dt
    cy = cy + (target_y - cy) * 3.0 * dt

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw circle
    pygame.draw.circle(screen, (255, 255, 255), (int(cx), int(cy)), 20)
    
    # Draw target marker
    pygame.draw.circle(screen, (255, 0, 0), (int(target_x), int(target_y)), 4)
    
    # Draw text
    text = font.render("Click to move", True, (255, 255, 255))
    screen.blit(text, (10.0, 10.0))

    pygame.display.flip()

pygame.quit()
sys.exit()