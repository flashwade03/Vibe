import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Cubic Bezier Curve")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

cp_xs = [100.0, 250.0, 550.0, 700.0]
cp_ys = [500.0, 100.0, 100.0, 500.0]
selected = 0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_1: selected = 0
            if event.key == pygame.K_2: selected = 1
            if event.key == pygame.K_3: selected = 2
            if event.key == pygame.K_4: selected = 3

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]: cp_xs[selected] -= 150.0 * dt
    if keys[pygame.K_RIGHT]: cp_xs[selected] += 150.0 * dt
    if keys[pygame.K_UP]: cp_ys[selected] -= 150.0 * dt
    if keys[pygame.K_DOWN]: cp_ys[selected] += 150.0 * dt

    screen.fill((0, 0, 0))

    # Draw Bezier Curve
    for i in range(51):
        t = float(i) / 50.0
        u = 1.0 - t
        bx = u**3 * cp_xs[0] + 3.0 * u**2 * t * cp_xs[1] + 3.0 * u * t**2 * cp_xs[2] + t**3 * cp_xs[3]
        by = u**3 * cp_ys[0] + 3.0 * u**2 * t * cp_ys[1] + 3.0 * u * t**2 * cp_ys[2] + t**3 * cp_ys[3]
        pygame.draw.circle(screen, (255, 255, 255), (int(bx), int(by)), 2)

    # Draw Control Polygon
    for i in range(3):
        for j in range(10):
            lt = float(j) / 10.0
            lx = cp_xs[i] + (cp_xs[i + 1] - cp_xs[i]) * lt
            ly = cp_ys[i] + (cp_ys[i + 1] - cp_ys[i]) * lt
            pygame.draw.circle(screen, (100, 100, 100), (int(lx), int(ly)), 1)

    # Draw Control Points
    for i in range(4):
        color = (255, 0, 0) if i == selected else (0, 255, 0)
        pygame.draw.circle(screen, color, (int(cp_xs[i]), int(cp_ys[i])), 8)

    # UI
    text1 = font.render("Point: " + str(selected + 1), True, (255, 255, 255))
    text2 = font.render("Keys 1-4 select, arrows move", True, (255, 255, 255))
    screen.blit(text1, (10, 10))
    screen.blit(text2, (10, 30))

    pygame.display.flip()

pygame.quit()
sys.exit()