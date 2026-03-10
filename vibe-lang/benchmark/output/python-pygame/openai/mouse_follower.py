import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Circle Follower")
clock = pygame.time.Clock()

# Initial positions
target_x, target_y = 400.0, 300.0
cx, cy = 400.0, 300.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            target_x, target_y = mx, my

    # Update logic
    cx += (target_x - cx) * 3.0 * dt
    cy += (target_y - cy) * 3.0 * dt

    # Draw logic
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 255), (int(cx), int(cy)), 20)
    pygame.draw.circle(screen, (255, 255, 255), (int(target_x), int(target_y)), 4)

    font = pygame.font.Font(None, 36)
    text = font.render("Click to move", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()