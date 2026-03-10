import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Expanding Rings")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

ring_xs = []
ring_ys = []
ring_radii = []
ring_lifes = []

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            ring_xs.append(float(mx))
            ring_ys.append(float(my))
            ring_radii.append(5.0)
            ring_lifes.append(2.0)

    # Update logic
    for i in range(len(ring_xs)):
        ring_radii[i] += 80.0 * dt
        ring_lifes[i] -= dt

    screen.fill((0, 0, 0))

    # Draw logic
    for i in range(len(ring_xs)):
        if ring_lifes[i] > 0.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(ring_xs[i]), int(ring_ys[i])), int(ring_radii[i]), 2)

    # UI
    text_count = font.render("Rings: " + str(len(ring_xs)), True, (255, 255, 255))
    screen.blit(text_count, (10, 10))
    
    text_instr = font.render("Click to create rings", True, (255, 255, 255))
    screen.blit(text_instr, (280, 560))

    pygame.display.flip()

pygame.quit()
sys.exit()