import pygame
import sys
import math

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Spiral Bullet Emitter")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
bul_xs = []
bul_ys = []
bul_vxs = []
bul_vys = []
bul_lifes = []

emit_angle = 0.0
emit_timer = 0.0
game_over = False

px = 400.0
py = 500.0
p_speed = 300.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not game_over:
        # Emitter logic
        emit_angle += 2.5 * dt
        emit_timer += dt
        if emit_timer >= 0.05:
            emit_timer = 0.0
            for k in range(0, 3):
                angle = emit_angle + float(k) * 2.094
                bul_xs.append(400.0)
                bul_ys.append(200.0)
                bul_vxs.append(math.cos(angle) * 120.0)
                bul_vys.append(math.sin(angle) * 120.0)
                bul_lifes.append(5.0)

        # Player movement
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            px -= p_speed * dt
        if keys[pygame.K_RIGHT]:
            px += p_speed * dt

        # Update bullets
        for i in range(len(bul_xs)):
            bul_xs[i] += bul_vxs[i] * dt
            bul_ys[i] += bul_vys[i] * dt
            bul_lifes[i] -= dt
            
            if bul_lifes[i] > 0.0:
                ddx = px - bul_xs[i]
                ddy = py - bul_ys[i]
                if math.sqrt(ddx * ddx + ddy * ddy) < 11.0:
                    game_over = True

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw emitter
    pygame.draw.circle(screen, (255, 255, 255), (400, 200), 12)
    
    # Draw bullets
    for i in range(len(bul_xs)):
        if bul_lifes[i] > 0.0:
            pygame.draw.circle(screen, (255, 255, 255), (int(bul_xs[i]), int(bul_ys[i])), 3)
            
    # Draw player
    pygame.draw.circle(screen, (255, 255, 255), (int(px), int(py)), 8)
    
    # UI
    if game_over:
        text = font.render("GAME OVER", True, (255, 255, 255))
        screen.blit(text, (340, 300))
        
    alive = sum(1 for life in bul_lifes if life > 0.0)
    ui_text = font.render("Bullets: " + str(alive), True, (255, 255, 255))
    screen.blit(ui_text, (10, 10))

    pygame.display.flip()

pygame.quit()
sys.exit()