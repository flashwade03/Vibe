import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Health Bar System")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Game state variables
health = 100.0
max_health = 100.0
regen_rate = 5.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                health -= 15.0
                if health < 0.0:
                    health = 0.0

    # Update logic
    if health > 0.0 and health < max_health:
        health += regen_rate * dt
        if health > max_health:
            health = max_health

    # Draw logic
    screen.fill((0, 0, 0))
    
    # Draw health bar background
    pygame.draw.rect(screen, (100, 100, 100), (250, 50, 300, 30))
    
    # Draw filled portion
    bar_width = (health / max_health) * 300.0
    pygame.draw.rect(screen, (0, 255, 0), (250, 50, int(bar_width), 30))
    
    # Display HP text
    hp_text = font.render(f"HP: {int(health)} / 100", True, (255, 255, 255))
    screen.blit(hp_text, (250, 90))
    
    # Draw player
    pygame.draw.rect(screen, (255, 255, 255), (384, 300, 32, 32))
    
    # Display instructions
    instr_text = font.render("Press SPACE to take damage", True, (255, 255, 255))
    screen.blit(instr_text, (230, 550))

    pygame.display.flip()

pygame.quit()
sys.exit()