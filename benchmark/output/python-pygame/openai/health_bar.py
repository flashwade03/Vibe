import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Vibe Health Bar")
clock = pygame.time.Clock()

health = 100.0
max_health = 100.0
regen_rate = 5.0

running = True
while running:
    dt = clock.tick(60) / 1000.0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                health -= 15.0
                if health < 0.0:
                    health = 0.0

    if health > 0.0 and health < max_health:
        health += regen_rate * dt
        if health > max_health:
            health = max_health

    screen.fill((0, 0, 0))

    # Draw health bar background
    pygame.draw.rect(screen, (255, 255, 255), (250.0, 50.0, 300.0, 30.0), 2)

    # Draw filled portion of health bar
    bar_width = (health / max_health) * 300.0
    pygame.draw.rect(screen, (255, 255, 255), (250.0, 50.0, bar_width, 30.0))

    # Display health text
    font = pygame.font.Font(None, 36)
    health_text = font.render(f"HP: {int(health)} / 100", True, (255, 255, 255))
    screen.blit(health_text, (250.0, 90.0))

    # Draw player
    pygame.draw.rect(screen, (255, 255, 255), (384.0, 300.0, 32, 32))

    # Display instructions
    instructions = font.render("Press SPACE to take damage", True, (255, 255, 255))
    screen.blit(instructions, (230.0, 550.0))

    pygame.display.flip()

pygame.quit()
sys.exit()