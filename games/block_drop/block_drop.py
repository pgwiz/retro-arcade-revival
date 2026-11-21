#!/usr/bin/env python3
"""
Block Drop — Python / Pygame Implementation
Clean-room open source polyomino falling block game.
Zero external proprietary assets.
"""
import sys
import random

try:
    import pygame
except ImportError:
    print("Pygame is not installed. Run: pip install pygame-ce")
    sys.exit(0)

COLS = 10
ROWS = 20
CELL_SIZE = 30
WIDTH = 700
HEIGHT = 680

# Distinct clean retro palette
COLORS = [
    (20, 24, 32),       # Background
    (56, 189, 248),     # 1: I (Cyan)
    (250, 204, 21),     # 2: O (Yellow)
    (192, 132, 252),    # 3: T (Purple)
    (74, 222, 128),     # 4: S (Green)
    (248, 113, 113),    # 5: Z (Red)
    (96, 165, 250),     # 6: J (Blue)
    (251, 146, 60),     # 7: L (Orange)
]

SHAPES = {
    1: [[(0,1),(1,1),(2,1),(3,1)], [(2,0),(2,1),(2,2),(2,3)], [(0,2),(1,2),(2,2),(3,2)], [(1,0),(1,1),(1,2),(1,3)]],
    2: [[(1,0),(2,0),(1,1),(2,1)]]*4,
    3: [[(1,0),(0,1),(1,1),(2,1)], [(1,0),(1,1),(2,1),(1,2)], [(0,1),(1,1),(2,1),(1,2)], [(1,0),(0,1),(1,1),(1,2)]],
    4: [[(1,0),(2,0),(0,1),(1,1)], [(1,0),(1,1),(2,1),(2,2)], [(1,1),(2,1),(0,2),(1,2)], [(0,0),(0,1),(1,1),(1,2)]],
    5: [[(0,0),(1,0),(1,1),(2,1)], [(2,0),(1,1),(2,1),(1,2)], [(0,1),(1,1),(1,2),(2,2)], [(1,0),(0,1),(1,1),(0,2)]],
    6: [[(0,0),(0,1),(1,1),(2,1)], [(1,0),(2,0),(1,1),(1,2)], [(0,1),(1,1),(2,1),(2,2)], [(1,0),(1,1),(0,2),(1,2)]],
    7: [[(2,0),(0,1),(1,1),(2,1)], [(1,0),(1,1),(1,2),(2,2)], [(0,1),(1,1),(2,1),(0,2)], [(0,0),(1,0),(1,1),(1,2)]],
}

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Block Drop — Retro Arcade Revival")
    clock = pygame.time.Clock()
    font = pygame.font.SysFont("monospace", 16, bold=True)
    title_font = pygame.font.SysFont("monospace", 22, bold=True)

    grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]
    cur_shape = random.randint(1, 7)
    next_shape = random.randint(1, 7)
    cur_rot = 0
    cur_pos = [3, 0]
    score = 0
    lines_cleared = 0
    level = 1
    fall_time = 0
    fall_speed = 600
    game_over = False

    def is_valid(pos, shape, rot):
        for cx, cy in SHAPES[shape][rot % 4]:
            gx = pos[0] + cx
            gy = pos[1] + cy
            if gx < 0 or gx >= COLS or gy >= ROWS:
                return False
            if gy >= 0 and grid[gy][gx] != 0:
                return False
        return True

    board_x = 200
    board_y = 40

    running = True
    while running:
        dt = clock.tick(60)
        fall_time += dt

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
                if game_over:
                    if event.key in (pygame.K_r, pygame.K_SPACE):
                        grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]
                        score = 0
                        lines_cleared = 0
                        level = 1
                        fall_speed = 600
                        game_over = False
                        cur_shape = random.randint(1, 7)
                        next_shape = random.randint(1, 7)
                        cur_pos = [3, 0]
                else:
                    if event.key in (pygame.K_LEFT, pygame.K_a):
                        if is_valid([cur_pos[0] - 1, cur_pos[1]], cur_shape, cur_rot):
                            cur_pos[0] -= 1
                    elif event.key in (pygame.K_RIGHT, pygame.K_d):
                        if is_valid([cur_pos[0] + 1, cur_pos[1]], cur_shape, cur_rot):
                            cur_pos[0] += 1
                    elif event.key in (pygame.K_UP, pygame.K_w):
                        new_rot = (cur_rot + 1) % 4
                        for kick_x in [0, -1, 1]:
                            if is_valid([cur_pos[0] + kick_x, cur_pos[1]], cur_shape, new_rot):
                                cur_pos[0] += kick_x
                                cur_rot = new_rot
                                break
                    elif event.key in (pygame.K_DOWN, pygame.K_s):
                        if is_valid([cur_pos[0], cur_pos[1] + 1], cur_shape, cur_rot):
                            cur_pos[1] += 1
                            score += 1
                    elif event.key == pygame.K_SPACE:
                        while is_valid([cur_pos[0], cur_pos[1] + 1], cur_shape, cur_rot):
                            cur_pos[1] += 1
                            score += 2
                        fall_time = fall_speed

        if not game_over and fall_time >= fall_speed:
            fall_time = 0
            if is_valid([cur_pos[0], cur_pos[1] + 1], cur_shape, cur_rot):
                cur_pos[1] += 1
            else:
                for cx, cy in SHAPES[cur_shape][cur_rot % 4]:
                    gx = cur_pos[0] + cx
                    gy = cur_pos[1] + cy
                    if 0 <= gy < ROWS and 0 <= gx < COLS:
                        grid[gy][gx] = cur_shape

                cleared = 0
                y = ROWS - 1
                while y >= 0:
                    if all(grid[y][x] != 0 for x in range(COLS)):
                        cleared += 1
                        del grid[y]
                        grid.insert(0, [0 for _ in range(COLS)])
                    else:
                        y -= 1

                if cleared > 0:
                    lines_cleared += cleared
                    score += [0, 100, 300, 500, 800][cleared] * level
                    level = 1 + lines_cleared // 10
                    fall_speed = max(100, 600 - (level - 1) * 45)

                cur_shape = next_shape
                next_shape = random.randint(1, 7)
                cur_rot = 0
                cur_pos = [3, 0]

                if not is_valid(cur_pos, cur_shape, cur_rot):
                    game_over = True

        screen.fill((16, 19, 26))

        # Board border
        pygame.draw.rect(screen, (10, 12, 17), (board_x, board_y, COLS * CELL_SIZE, ROWS * CELL_SIZE))
        pygame.draw.rect(screen, (55, 65, 81), (board_x, board_y, COLS * CELL_SIZE, ROWS * CELL_SIZE), 2)

        # Draw grid
        for y in range(ROWS):
            for x in range(COLS):
                val = grid[y][x]
                rx = board_x + x * CELL_SIZE
                ry = board_y + y * CELL_SIZE
                if val != 0:
                    pygame.draw.rect(screen, COLORS[val], (rx + 1, ry + 1, CELL_SIZE - 2, CELL_SIZE - 2))
                else:
                    pygame.draw.rect(screen, (24, 30, 42), (rx, ry, CELL_SIZE, CELL_SIZE), 1)

        # Active piece
        if not game_over:
            for cx, cy in SHAPES[cur_shape][cur_rot % 4]:
                gx = cur_pos[0] + cx
                gy = cur_pos[1] + cy
                if gy >= 0:
                    rx = board_x + gx * CELL_SIZE
                    ry = board_y + gy * CELL_SIZE
                    pygame.draw.rect(screen, COLORS[cur_shape], (rx + 1, ry + 1, CELL_SIZE - 2, CELL_SIZE - 2))

        # UI text
        screen.blit(title_font.render("BLOCK DROP", True, (241, 245, 249)), (530, 40))
        screen.blit(font.render(f"SCORE: {score}", True, (203, 213, 225)), (530, 90))
        screen.blit(font.render(f"LINES: {lines_cleared}", True, (203, 213, 225)), (530, 120))
        screen.blit(font.render(f"LEVEL: {level}", True, (56, 189, 248)), (530, 150))

        # Next preview
        screen.blit(font.render("NEXT PIECE:", True, (148, 163, 184)), (530, 200))
        pygame.draw.rect(screen, (24, 30, 42), (530, 225, 110, 80))
        for cx, cy in SHAPES[next_shape][0]:
            px = 550 + cx * 18
            py = 240 + cy * 18
            pygame.draw.rect(screen, COLORS[next_shape], (px, py, 16, 16))

        # Controls
        screen.blit(font.render("CONTROLS:", True, (148, 163, 184)), (30, 100))
        screen.blit(font.render("◄/► : Move", True, (100, 116, 139)), (30, 130))
        screen.blit(font.render("▲   : Rotate", True, (100, 116, 139)), (30, 155))
        screen.blit(font.render("▼   : Soft Drop", True, (100, 116, 139)), (30, 180))
        screen.blit(font.render("SPC : Hard Drop", True, (100, 116, 139)), (30, 205))
        screen.blit(font.render("ESC : Exit", True, (100, 116, 139)), (30, 230))

        if game_over:
            overlay = pygame.Surface((COLS * CELL_SIZE, ROWS * CELL_SIZE), pygame.SRCALPHA)
            overlay.fill((0, 0, 0, 190))
            screen.blit(overlay, (board_x, board_y))
            screen.blit(title_font.render("GAME OVER", True, (239, 68, 68)), (board_x + 50, board_y + 240))
            screen.blit(font.render("Press R to Retry", True, (241, 245, 249)), (board_x + 40, board_y + 280))

        pygame.display.flip()

    pygame.quit()

if __name__ == "__main__":
    main()
