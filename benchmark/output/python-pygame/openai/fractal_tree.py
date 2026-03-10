import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Fractal Tree")
clock = pygame.time.Clock()

# Fractal tree variables
seg_x1s = []
seg_y1s = []
seg_x2s = []
seg_y2s = []

q_xs = []
q_ys = []
q_angles = []
q_lens = []
q_depths = []

max_depth = 7
branch_angle = 0.5
built = False

def update(dt):
    global built
    if not built:
        # Seed the initial branch
        q_xs.append(400.0)
        q_ys.append(580.0)
        q_angles.append(-1.5708)  # -90 degrees in radians
        q_lens.append(100.0)
        q_depths.append(0.0)

        ptr = 0
        for _ in range(500):
            if ptr >= len(q_xs):
                break
            sx = q_xs[ptr]
            sy = q_ys[ptr]
            sa = q_angles[ptr]
            sl = q_lens[ptr]
            sd = q_depths[ptr]

            ex = sx + math.cos(sa) * sl
            ey = sy + math.sin(sa) * sl

            seg_x1s.append(sx)
            seg_y1s.append(sy)
            seg_x2s.append(ex)
            seg_y2s.append(ey)

            if sd < float(max_depth):
                nl = sl * 0.7
                nd = sd + 1.0

                q_xs.append(ex)
                q_ys.append(ey)
                q_angles.append(sa - branch_angle)
                q_lens.append(nl)
                q_depths.append(nd)

                q_xs.append(ex)
                q_ys.append(ey)
                q_angles.append(sa + branch_angle)
                q_lens.append(nl)
                q_depths.append(nd)

            ptr += 1

        built = True

def draw():
    for i in range(len(seg_x1s)):
        for j in range(5):
            lt = float(j) / 5.0
            lx = seg_x1s[i] + (seg_x2s[i] - seg_x1s[i]) * lt
            ly = seg_y1s[i] + (seg_y2s[i] - seg_y1s[i]) * lt
            pygame.draw.circle(screen, (255, 255, 255), (int(lx), int(ly)), 1)

    font = pygame.font.Font(None, 36)
    text = font.render("Segments: " + str(len(seg_x1s)), True, (255, 255, 255))
    screen.blit(text, (10, 10))
    text = font.render("Angle: " + str(branch_angle), True, (255, 255, 255))
    screen.blit(text, (10, 30))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    update(dt)

    screen.fill((0, 0, 0))
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()