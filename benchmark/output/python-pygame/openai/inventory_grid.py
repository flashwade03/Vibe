import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Inventory Management")
clock = pygame.time.Clock()

inv_items = [0.0 for _ in range(20)]
held_item = 0.0

def draw_rect(x, y, w, h):
    pygame.draw.rect(screen, (255, 255, 255), (x, y, w, h), 2)

def draw_circle(x, y, radius):
    pygame.draw.circle(screen, (255, 255, 255), (int(x), int(y)), radius, 2)

def draw_text(text, x, y):
    font = pygame.font.Font(None, 36)
    text_surface = font.render(text, True, (255, 255, 255))
    screen.blit(text_surface, (x, y))

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_1 or event.key == pygame.K_2 or event.key == pygame.K_3:
                item_type = 0.0
                if event.key == pygame.K_1:
                    item_type = 1.0
                elif event.key == pygame.K_2:
                    item_type = 2.0
                elif event.key == pygame.K_3:
                    item_type = 3.0
                for i in range(20):
                    if inv_items[i] == 0.0:
                        inv_items[i] = item_type
                        break
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()
            col = int((mx - 200.0) / 80.0)
            row = int((my - 100.0) / 80.0)
            if 0 <= col < 5 and 0 <= row < 4:
                idx = row * 5 + col
                if held_item == 0.0 and inv_items[idx] > 0.0:
                    held_item = inv_items[idx]
                    inv_items[idx] = 0.0
                elif held_item > 0.0 and inv_items[idx] == 0.0:
                    inv_items[idx] = held_item
                    held_item = 0.0
                elif held_item > 0.0 and inv_items[idx] > 0.0:
                    tmp = inv_items[idx]
                    inv_items[idx] = held_item
                    held_item = tmp

    screen.fill((0, 0, 0))
    
    for row in range(4):
        for col in range(5):
            x = 200.0 + col * 80.0
            y = 100.0 + row * 80.0
            draw_rect(x, y, 80.0, 80.0)
            val = inv_items[row * 5 + col]
            if val == 1.0:
                draw_rect(x + 25.0, y + 20.0, 30.0, 8.0)
                draw_rect(x + 37.0, y + 28.0, 6.0, 32.0)
            elif val == 2.0:
                draw_circle(x + 40.0, y + 40.0, 15.0)
            elif val == 3.0:
                draw_circle(x + 40.0, y + 40.0, 8.0)

    draw_text("Held: " + str(int(held_item)), 10.0, 10.0)
    draw_text("1-3: Add | Click: Pick/Place", 200.0, 540.0)

    pygame.display.flip()

pygame.quit()
sys.exit()