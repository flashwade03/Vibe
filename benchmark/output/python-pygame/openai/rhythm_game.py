import pygame
import sys
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Rhythm Game")
clock = pygame.time.Clock()

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

def update(dt):
    global spawn_timer, score, misses, combo, flash_timer, flash_lane
    spawn_timer += dt
    if spawn_timer >= 0.6:
        spawn_timer = 0.0
        lane = int(random.uniform(0.0, 3.99))
        note_xs.append(250.0 + float(lane) * 100.0)
        note_ys.append(-20.0)
        note_lanes.append(float(lane))
        note_hit.append(0.0)

    for i in range(len(note_ys)):
        if note_hit[i] == 0.0:
            note_ys[i] += note_speed * dt
        if note_ys[i] > 600.0 and note_hit[i] == 0.0:
            note_hit[i] = 2.0
            misses += 1
            combo = 0

    flash_timer -= dt

def keypressed(k):
    global score, combo, flash_timer, flash_lane
    press_lane = -1
    if k == pygame.K_d:
        press_lane = 0
    elif k == pygame.K_f:
        press_lane = 1
    elif k == pygame.K_j:
        press_lane = 2
    elif k == pygame.K_k:
        press_lane = 3

    if press_lane >= 0:
        for i in range(len(note_ys)):
            if (note_hit[i] == 0.0 and int(note_lanes[i]) == press_lane and
                470.0 < note_ys[i] < 530.0):
                note_hit[i] = 1.0
                score += 1
                combo += 1
                flash_timer = 0.15
                flash_lane = press_lane
                break

def draw():
    screen.fill((0, 0, 0))
    for lane in range(4):
        pygame.draw.rect(screen, (255, 255, 255), (220.0 + float(lane) * 100.0, 495.0, 60.0, 10.0))
    for i in range(len(note_xs)):
        if note_hit[i] == 0.0:
            pygame.draw.rect(screen, (255, 255, 255), (note_xs[i] - 30.0, note_ys[i] - 10.0, 60.0, 20.0))
    if flash_timer > 0.0:
        pygame.draw.rect(screen, (255, 255, 255), (220.0 + float(flash_lane) * 100.0, 488.0, 60.0, 24.0))
    font = pygame.font.Font(None, 36)
    score_text = font.render("Score: " + str(score), True, (255, 255, 255))
    combo_text = font.render("Combo: " + str(combo), True, (255, 255, 255))
    miss_text = font.render("Miss: " + str(misses), True, (255, 255, 255))
    keys_text = font.render("D F J K", True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    screen.blit(combo_text, (10, 30))
    screen.blit(miss_text, (10, 50))
    screen.blit(keys_text, (340, 560))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            keypressed(event.key)

    update(dt)
    draw()
    pygame.display.flip()

pygame.quit()
sys.exit()