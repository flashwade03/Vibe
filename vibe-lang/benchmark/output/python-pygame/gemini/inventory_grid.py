import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Inventory Management")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state
inv_items = [0.0 for _ in range(20)]
held_item = 0.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        if event.type == pygame.KEYDOWN:
            k = pygame.key.name(event.key)
            if k in ["1", "2", "3"]:
                item_type = float(k)
                for i in range(20):
                    if inv_items[i] == 0.0:
                        inv_items[i] = item_type
                        break
        
        if event.type == pygame.MOUSEBUTTONDOWN:
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
    
    # Draw Grid
    for row in range(4):
        for col in range(5):
            x = 200.0 + float(col) * 80.0
            y = 100.0 + float(row) * 80.0
            pygame.draw.rect(screen, (255, 255, 255), (x, y, 80, 80), 2)
            
            val = inv_items[row * 5 + col]
            if val == 1.0: # Sword
                pygame.draw.rect(screen, (200, 200, 200), (x + 25, y + 20, 30, 8))
                pygame.draw.rect(screen, (200, 200, 200), (x + 37, y + 28, 6, 32))
            elif val == 2.0: # Shield
                pygame.draw.circle(screen, (100, 100, 255), (int(x + 40), int(y + 40)), 15)
            elif val == 3.0: # Potion
                pygame.draw.circle(screen, (255, 50, 50), (int(x + 40), int(y + 40)), 8)

    # UI Text
    held_text = font.render("Held: " + str(int(held_item)), True, (255, 255, 255))
    screen.blit(held_text, (10, 10))
    instr_text = font.render("1-3: Add | Click: Pick/Place", True, (255, 255, 255))
    screen.blit(instr_text, (200, 540))

    pygame.display.flip()

pygame.quit()
sys.exit()