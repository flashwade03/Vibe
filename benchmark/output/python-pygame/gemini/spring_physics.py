import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Spring Mass System")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
mass_xs = []
mass_ys = []
mass_vxs = []
mass_vys = []

rest_length = 100.0
spring_k = 150.0
damping = 0.95
speed = 200.0

# Initialize
for i in range(5):
    mass_xs.append(200.0 + float(i) * 100.0)
    mass_ys.append(300.0)
    mass_vxs.append(0.0)
    mass_vys.append(0.0)

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update logic
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]: mass_xs[0] -= speed * dt
    if keys[pygame.K_RIGHT]: mass_xs[0] += speed * dt
    if keys[pygame.K_UP]: mass_ys[0] -= speed * dt
    if keys[pygame.K_DOWN]: mass_ys[0] += speed * dt
    
    mass_vxs[0] = 0.0
    mass_vys[0] = 0.0

    # Spring physics
    for i in range(4):
        dx = mass_xs[i + 1] - mass_xs[i]
        dy = mass_ys[i + 1] - mass_ys[i]
        dist = math.sqrt(dx * dx + dy * dy)
        if dist > 0.1:
            force = (dist - rest_length) * spring_k
            fx = (dx / dist) * force
            fy = (dy / dist) * force
            
            if i > 0:
                mass_vxs[i] += fx * dt
                mass_vys[i] += fy * dt
            
            mass_vxs[i + 1] -= fx * dt
            mass_vys[i + 1] -= fy * dt

    # Integration
    for i in range(1, 5):
        mass_vys[i] += 200.0 * dt
        mass_xs[i] += mass_vxs[i] * dt
        mass_ys[i] += mass_vys[i] * dt
        mass_vxs[i] *= damping
        mass_vys[i] *= damping

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw springs
    for i in range(4):
        for j in range(8):
            lt = float(j) / 8.0
            sx = mass_xs[i] + (mass_xs[i+1] - mass_xs[i]) * lt
            sy = mass_ys[i] + (mass_ys[i+1] - mass_ys[i]) * lt
            pygame.draw.circle(screen, (255, 255, 255), (int(sx), int(sy)), 2)

    # Draw masses
    for i in range(5):
        pygame.draw.circle(screen, (255, 255, 255), (int(mass_xs[i]), int(mass_ys[i])), 10)

    text = font.render("Arrows move anchor", True, (255, 255, 255))
    screen.blit(text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()