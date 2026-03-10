import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Interactive Cubic Bezier Curve")
clock = pygame.time.Clock()

cp_xs = [100.0, 250.0, 550.0, 700.0]
cp_ys = [500.0, 100.0, 100.0, 500.0]
selected = 0
font = pygame.font.Font(None, 36)

def draw_circle(x, y, radius, color=(255, 255, 255)):
    pygame.draw.circle(screen, color, (int(x), int(y)), int(radius))

def draw_text(text, x, y, color=(255, 255, 255)):
    text_surface = font.render(text, True, color)
    screen.blit(text_surface, (x, y))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_1:
                selected = 0
            elif event.key == pygame.K_2:
                selected = 1
            elif event.key == pygame.K_3:
                selected = 2
            elif event.key == pygame.K_4:
                selected = 3

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        cp_xs[selected] -= 150.0 * dt
    if keys[pygame.K_RIGHT]:
        cp_xs[selected] += 150.0 * dt
    if keys[pygame.K_UP]:
        cp_ys[selected] -= 150.0 * dt
    if keys[pygame.K_DOWN]:
        cp_ys[selected] += 150.0 * dt

    screen.fill((0, 0, 0))

    # Draw the Bezier curve
    for i in range(51):
        t = float(i) / 50.0
        u = 1.0 - t
        bx = (u * u * u * cp_xs[0] +
              3.0 * u * u * t * cp_xs[1] +
              3.0 * u * t * t * cp_xs[2] +
              t * t * t * cp_xs[3])
        by = (u * u * u * cp_ys[0] +
              3.0 * u * u * t * cp_ys[1] +
              3.0 * u * t * t * cp_ys[2] +
              t * t * t * cp_ys[3])
        draw_circle(bx, by, 2.0)

    # Draw control points
    for i in range(4):
        draw_circle(cp_xs[i], cp_ys[i], 8.0)

    # Draw control polygon
    for i in range(3):
        for j in range(10):
            lt = float(j) / 10.0
            lx = cp_xs[i] + (cp_xs[i + 1] - cp_xs[i]) * lt
            ly = cp_ys[i] + (cp_ys[i + 1] - cp_ys[i]) * lt
            draw_circle(lx, ly, 1.0)

    # Draw text
    draw_text("Point: " + str(selected + 1), 10.0, 10.0)
    draw_text("Keys 1-4 select, arrows move", 10.0, 30.0)

    pygame.display.flip()

pygame.quit()
sys.exit()