import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Interactive Cubic Bezier Curve")
clock = pygame.time.Clock()

cp_xs = [100.0, 250.0, 550.0, 700.0]
cp_ys = [500.0, 100.0, 100.0, 500.0]
selected = 0
speed = 150.0

def draw_bezier_curve():
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
        pygame.draw.circle(screen, (255, 255, 255), (int(bx), int(by)), 2)

def draw_control_points():
    for i in range(4):
        pygame.draw.circle(screen, (255, 255, 255), (int(cp_xs[i]), int(cp_ys[i])), 8)

def draw_control_polygon():
    for i in range(3):
        for j in range(10):
            lt = float(j) / 10.0
            lx = cp_xs[i] + (cp_xs[i + 1] - cp_xs[i]) * lt
            ly = cp_ys[i] + (cp_ys[i + 1] - cp_ys[i]) * lt
            pygame.draw.circle(screen, (255, 255, 255), (int(lx), int(ly)), 1)

def draw_text():
    font = pygame.font.Font(None, 36)
    text1 = font.render(f"Point: {selected + 1}", True, (255, 255, 255))
    text2 = font.render("Keys 1-4 select, arrows move", True, (255, 255, 255))
    screen.blit(text1, (10, 10))
    screen.blit(text2, (10, 30))

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
        cp_xs[selected] -= speed * dt
    if keys[pygame.K_RIGHT]:
        cp_xs[selected] += speed * dt
    if keys[pygame.K_UP]:
        cp_ys[selected] -= speed * dt
    if keys[pygame.K_DOWN]:
        cp_ys[selected] += speed * dt

    screen.fill((0, 0, 0))
    draw_bezier_curve()
    draw_control_points()
    draw_control_polygon()
    draw_text()
    pygame.display.flip()

pygame.quit()
sys.exit()