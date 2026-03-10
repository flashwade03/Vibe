import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Rhythm Game")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
note_xs = []
note_ys = []
note_lanes = []
note_hit = []
spawn_timer = 0.0
note_speed = 200.0
score = 0
misses = 0
combo = 0
flash_timer = 0.0
flash_lane = -1

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            press_lane = -1
            if event.key == pygame.K_d: press_lane = 0
            elif event.key == pygame.K_f: press_lane = 1
            elif event.key == pygame.K_j: press_lane = 2
            elif event.key == pygame.K_k: press_lane = 3
            
            if press_lane >= 0:
                for i in range(len(note_ys)):
                    if note_hit[i] == 0.0 and int(note_lanes[i]) == press_lane and 470.0 < note_ys[i] < 530.0:
                        note_hit[i] = 1.0
                        score += 1
                        combo += 1
                        flash_timer = 0.15
                        flash_lane = press_lane
                        break

    # Update logic
    spawn_timer += dt
    if spawn_timer >= 0.6:
        spawn_timer = 0.0
        lane = random.randint(0, 3)
        note_xs.append(250.0 + float(lane) * 100.0)
        note_ys.append(-20.0)
        note_lanes.append(float(lane))
        note_hit.append(0.0)

    for i in range(len(note_ys)):
        if note_hit[i] == 0.0:
            note_ys[i] += note_speed * dt
            if note_ys[i] > 600.0:
                note_hit[i] = 2.0
                misses += 1
                combo = 0
    
    flash_timer -= dt

    # Draw logic
    screen.fill((0, 0, 0))
    
    for lane in range(4):
        pygame.draw.rect(screen, (255, 255, 255), (220 + lane * 100, 495, 60, 10))
        
    for i in range(len(note_xs)):
        if note_hit[i] == 0.0:
            pygame.draw.rect(screen, (255, 255, 255), (int(note_xs[i] - 30), int(note_ys[i] - 10), 60, 20))
            
    if flash_timer > 0.0 and flash_lane != -1:
        pygame.draw.rect(screen, (200, 200, 200), (220 + flash_lane * 100, 488, 60, 24))

    screen.blit(font.render(f"Score: {score}", True, (255, 255, 255)), (10, 10))
    screen.blit(font.render(f"Combo: {combo}", True, (255, 255, 255)), (10, 30))
    screen.blit(font.render(f"Miss: {misses}", True, (255, 255, 255)), (10, 50))
    screen.blit(font.render("D    F    J    K", True, (255, 255, 255)), (340, 560))

    pygame.display.flip()

pygame.quit()
sys.exit()