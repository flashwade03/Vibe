import { Task } from "./types.js";

export const tasks: Task[] = [
  // ── Easy ──────────────────────────────────────────────────

  {
    id: "move_rectangle",
    name: "Moving Rectangle",
    difficulty: "easy",
    description:
      "Write a Vibe program that displays a 32x32 white rectangle at the center of an 800x600 window. The rectangle moves with arrow keys at 200 pixels per second. Use key_down to check for \"left\", \"right\", \"up\", and \"down\" keys. Multiply speed by dt for frame-independent movement.",
    expectedBehaviors: [
      "A 32x32 rectangle is drawn on screen",
      "Rectangle starts at position (400, 300)",
      "Arrow keys move the rectangle at 200 px/s",
      "Movement is frame-independent (uses dt)",
    ],
  },

  {
    id: "bouncing_ball",
    name: "Bouncing Ball",
    difficulty: "easy",
    description:
      "Write a Vibe program with a ball (circle, radius 16) that starts at position (400, 300) moving diagonally. The ball has a velocity of 150 pixels per second in both x and y directions (initially positive). When the ball hits any edge of the 800x600 window, it bounces back by reversing the velocity component for that axis. Use draw_circle to render the ball.",
    expectedBehaviors: [
      "A circle with radius 16 is drawn",
      "Ball starts at (400, 300) moving diagonally",
      "Ball speed is 150 px/s in both x and y",
      "Ball bounces off all 4 window edges (800x600)",
      "Movement is frame-independent (uses dt)",
    ],
  },

  {
    id: "score_counter",
    name: "Score Counter",
    difficulty: "easy",
    description:
      "Write a Vibe program that displays a score starting at 0 in the top-left corner at position (10, 10). The program needs a fn keypressed(k: String) function that checks if k == \"space\" and increments the score by 1 each time the spacebar is pressed. Use draw_text to display the text \"Score: \" concatenated with the score value (use str() to convert Int to String). The draw function should render the score text every frame.",
    expectedBehaviors: [
      "Score starts at 0",
      "Score text displayed at (10, 10)",
      "Pressing spacebar increments score by 1",
      "Score is displayed as text using draw_text",
    ],
  },

  {
    id: "color_changing_rect",
    name: "Position Display",
    difficulty: "easy",
    description:
      "Write a Vibe program with a 64x64 rectangle at the center of an 800x600 window. The rectangle moves with arrow keys at 100 pixels per second. Display the current x and y position as text at position (10, 10) using draw_text. Format the text as \"x: \" + str(x) + \" y: \" + str(y) where x and y are the rectangle's Float coordinates. Use str() to convert Float to String.",
    expectedBehaviors: [
      "A 64x64 rectangle is drawn",
      "Rectangle starts at center (400, 300)",
      "Arrow keys move at 100 px/s",
      "Position text displayed at (10, 10)",
      "Text shows current x and y coordinates",
    ],
  },

  // ── Medium ────────────────────────────────────────────────

  {
    id: "enemy_follow",
    name: "Enemy Follow",
    difficulty: "medium",
    description:
      "Write a Vibe program with two rectangles: a player (32x32, drawn in blue) controlled by arrow keys at 200 px/s, and an enemy (32x32, drawn in red) that follows the player at 100 px/s. Each frame in fn update(dt: Float), the enemy calculates the direction vector toward the player (dx = player_x - enemy_x, dy = player_y - enemy_y), computes the distance as sqrt(dx * dx + dy * dy), then normalizes the direction by dividing dx and dy by the distance (only if distance > 1.0 to avoid division by zero). The enemy moves by adding the normalized direction multiplied by enemy_speed * dt. The player starts at (400, 300). The enemy starts at (100, 100). Use draw_rect(x, y, 32, 32) for both. For the blue player rectangle, call draw_rect with 6 arguments: draw_rect(player_x, player_y, 32, 32, 0, 0) and for red enemy use draw_rect(enemy_x, enemy_y, 32, 32, 0, 0). Note: approximate colors by varying the draw order — draw the enemy first, then the player on top.",
    expectedBehaviors: [
      "Player (32x32) moves with arrow keys at 200 px/s",
      "Enemy (32x32) starts at (100, 100)",
      "Player starts at (400, 300)",
      "Enemy moves toward player at 100 px/s each frame",
      "Direction is normalized before applying speed",
    ],
  },

  {
    id: "shooting",
    name: "Shooting",
    difficulty: "medium",
    description:
      "Write a Vibe program with a player rectangle (32x32) at bottom center (x=384, y=550) that moves left/right with arrow keys at 200 px/s. Pressing spacebar shoots a bullet upward. Use a List to store active bullets. Each bullet is represented by its x and y position stored as two parallel Lists: bullet_xs: List[Float] and bullet_ys: List[Float]. When spacebar is pressed (check in fn keypressed(k: String) for k == \"space\"), append the player's center x to bullet_xs and the player's y to bullet_ys. In fn update(dt: Float), iterate through all bullets and move each upward by subtracting 300 * dt from its y position. In fn draw(), draw the player as a 32x32 rectangle and draw each bullet as a 4x4 rectangle. Note: Vibe does not yet support removing items from Lists, so bullets will continue to exist after leaving the screen.",
    expectedBehaviors: [
      "Player (32x32) at bottom center, moves left/right",
      "Pressing space creates a bullet at player position",
      "Bullets move upward at 300 px/s",
      "Bullets are drawn as 4x4 rectangles",
      "Multiple bullets can exist simultaneously",
    ],
  },

  {
    id: "circle_collision",
    name: "Circle Collision",
    difficulty: "medium",
    description:
      "Write a Vibe program with a player circle (radius 20) starting at (400, 300) that moves with arrow keys at 150 px/s. Place 5 static enemy circles (radius 15) at these fixed positions: (100, 100), (700, 100), (200, 400), (600, 400), (400, 500). Store enemy positions in two Lists: enemy_xs and enemy_ys, both of type List[Float]. Each frame in fn update(dt: Float), check collision between the player and each enemy using circle-circle distance: if sqrt((px - ex)*(px - ex) + (py - ey)*(py - ey)) < 20 + 15 (sum of radii), set a Boolean variable hit to true. In fn draw(), draw the player circle, all enemy circles, and if hit is true, display \"Hit!\" at position (10, 10) using draw_text. Reset hit to false at the start of each update.",
    expectedBehaviors: [
      "Player circle (radius 20) moves with arrow keys at 150 px/s",
      "5 enemy circles (radius 15) at fixed positions",
      "Collision detected via circle-circle distance check",
      "'Hit!' displayed at (10, 10) when overlapping",
      "Collision resets each frame",
    ],
  },

  {
    id: "gravity_jump",
    name: "Gravity Jump",
    difficulty: "medium",
    description:
      "Write a Vibe program with a 32x32 rectangle representing a player. The player starts at x=384, y=550. It moves left/right with arrow keys at 200 px/s. The player has a vertical velocity (vy: Float = 0.0) and a Boolean on_ground that starts as true. Gravity is 500.0 px/s^2. Each frame: add gravity * dt to vy, then add vy * dt to y. If y >= 550, set y = 550, vy = 0, and on_ground = true. When up arrow is pressed (check key_down(\"up\")), if on_ground is true, set vy to -300.0 and on_ground to false. The ground line is at y=550, meaning the bottom of the rectangle rests there. Draw the rectangle at (x, y) with size 32x32.",
    expectedBehaviors: [
      "Player (32x32) starts at (384, 550)",
      "Left/right arrow keys move at 200 px/s",
      "Gravity of 500 px/s^2 pulls player down",
      "Pressing up arrow makes player jump (vy = -300)",
      "Player lands on ground at y=550",
      "Can only jump when on_ground is true",
    ],
  },

  {
    id: "countdown_timer",
    name: "Countdown Timer",
    difficulty: "medium",
    description:
      "Write a Vibe program that shows a countdown timer starting at 30.0 seconds. Store the time as a Float variable. Each frame in fn update(dt: Float), subtract dt from the timer, but do not let it go below 0.0. In fn draw(), if the timer is greater than 0.0, display the remaining time as an integer (use str() on the timer value) at position (350, 280) using draw_text. When the timer reaches 0.0 (or below), display \"Time Up!\" at position (330, 280) using draw_text instead.",
    expectedBehaviors: [
      "Timer starts at 30 seconds",
      "Timer counts down each frame using dt",
      "Remaining time displayed as text near center",
      "Timer does not go below 0",
      "'Time Up!' displayed when timer reaches 0",
    ],
  },

  // ── Hard ──────────────────────────────────────────────────

  {
    id: "particle_burst",
    name: "Particle Burst",
    difficulty: "hard",
    description:
      "Write a Vibe program where clicking creates a burst of 10 particles at the click position. Store particle data in parallel Lists: particle_xs, particle_ys (positions), particle_vxs, particle_vys (velocities), and particle_lifes (remaining life as Float). Use fn mousepressed(mx: Float, my: Float, button: Int) to handle mouse clicks. When clicked, add 10 particles at (mx, my), each with a random direction and random speed between 50 and 200 px/s. To create a random direction, use rand_float(0.0, 6.283) for the angle, then set vx = cos(angle) * speed and vy = sin(angle) * speed. Use rand_float(50.0, 200.0) for speed. Each particle has a life of 2.0 seconds. In fn update(dt: Float), update each particle: add vx*dt to x, add vy*dt to y, and subtract dt from life. In fn draw(), draw each particle as a 4x4 rectangle only if its life > 0.0. Use math functions cos(), sin(), and rand_float(min, max) which are built-in.",
    expectedBehaviors: [
      "Clicking spawns 10 particles at click position",
      "Each particle moves outward in a random direction",
      "Particle speeds range from 50 to 200 px/s",
      "Particles have a 2-second lifetime",
      "Particles disappear after their life expires",
      "Multiple bursts can coexist",
    ],
  },
  // ── Hard+ (designed to differentiate strong LLMs) ────────

  {
    id: "state_machine_game",
    name: "State Machine Game",
    difficulty: "hard",
    description:
      "Write a Vibe program implementing a 3-state game: menu, playing, and gameover. Use a let state: Int variable (0=menu, 1=playing, 2=gameover). In MENU state (state == 0): draw_text(\"Press SPACE to Start\", 250.0, 280.0). When space is pressed in keypressed, set state to 1 and reset score to 0 and timer to 10.0. In PLAYING state (state == 1): a 20x20 target rectangle appears at random position (use rand_float). The player clicks to score. In mousepressed, if state == 1, check if click is inside the target (mx >= target_x and mx <= target_x + 20.0 and my >= target_y and my <= target_y + 20.0). If hit, increment score and move target to new random position (rand_float(0.0, 780.0) for x, rand_float(0.0, 580.0) for y). Timer counts down by dt. When timer <= 0.0, set state to 2. In GAMEOVER state (state == 2): draw_text(\"Game Over! Score: \" + str(score), 250.0, 260.0) and draw_text(\"Press SPACE to Restart\", 250.0, 300.0). Space in gameover resets to menu (state = 0). In draw, branch on state to show the correct screen. In playing state also draw the target rect and show score and timer text.",
    expectedBehaviors: [
      "3 game states: menu, playing, gameover",
      "Space transitions between states",
      "Click-to-score gameplay in playing state",
      "10-second countdown timer",
      "Score displayed during play and gameover",
      "Target moves to random position on hit",
    ],
  },

  {
    id: "snake_movement",
    name: "Snake Movement",
    difficulty: "hard",
    description:
      "Write a Vibe program simulating snake movement on a grid. The snake body is stored as two parallel Lists: snake_xs: List[Float] and snake_ys: List[Float], initialized with 3 segments at [(400,300), (380,300), (360,300)]. The snake moves in a direction controlled by arrow keys. Store direction as dir_x: Float = 1.0 and dir_y: Float = 0.0. Use a move_timer: Float that counts down from 0.15 (the snake moves every 0.15 seconds). When the timer reaches 0, reset it to 0.15, calculate new head position: new_x = snake_xs[0] + dir_x * 20.0, new_y = snake_ys[0] + dir_y * 20.0. Then shift all segments: iterate from the last index down to 1, copying position from the previous segment (snake_xs[i] = snake_xs[i-1]). Set segment 0 to (new_x, new_y). In keypressed, change direction: \"right\" sets (1,0), \"left\" sets (-1,0), \"up\" sets (0,-1), \"down\" sets (0,1). But prevent reversing: only change if new direction is not opposite to current. In draw, draw each segment as a 18x18 rectangle. Wrap positions: if new_x >= 800.0, set to 0.0; if < 0.0 set to 780.0. Same for y with 600.0/580.0.",
    expectedBehaviors: [
      "Snake body as parallel Lists with 3 initial segments",
      "Grid-based movement every 0.15 seconds",
      "Arrow key direction control",
      "Cannot reverse direction",
      "Body segments follow the head",
      "Screen wrapping",
    ],
  },

  {
    id: "multi_wave_spawner",
    name: "Multi-Wave Spawner",
    difficulty: "hard",
    description:
      "Write a Vibe program with a wave-based enemy spawner. Store enemies in parallel Lists: ex: List[Float], ey: List[Float], evx: List[Float], evy: List[Float], elife: List[Float]. The player is a circle (radius 12) at center, controlled by arrow keys at 250 px/s. Use a wave: Int starting at 1, a spawn_timer: Float starting at 2.0, and enemies_per_wave: Int = 3. When spawn_timer <= 0.0, spawn enemies_per_wave enemies: for each, pick a random edge (use rand_float(0.0, 4.0) and check ranges: 0-1 = top edge y=0 random x, 1-2 = right edge x=800 random y, 2-3 = bottom edge y=600 random x, 3-4 = left edge x=0 random y). Calculate direction toward player, normalize, multiply by speed (80 + wave * 20) px/s. Life = 1.0. Then increment wave, set enemies_per_wave = 3 + wave, reset spawn_timer = 3.0 - wave * 0.2 (minimum 0.5). In update: move enemies by velocity * dt, subtract dt from life. Check collision with player (distance < 12 + 8). If hit, set a game_over: Bool = true. In draw: draw player circle, all enemies as 16x16 rects if life > 0, show \"Wave: \" + str(wave) at top-left, and if game_over show \"GAME OVER\" at center.",
    expectedBehaviors: [
      "Wave-based spawning with increasing difficulty",
      "Enemies spawn from random screen edges",
      "Enemies move toward player position",
      "Wave number increases enemy count and speed",
      "Collision detection ends the game",
      "HUD shows current wave",
    ],
  },

  {
    id: "orbital_mechanics",
    name: "Orbital Mechanics",
    difficulty: "hard",
    description:
      "Write a Vibe program simulating 3 orbiting bodies around a central point (400, 300). Store orbital data in parallel Lists: orb_angles: List[Float] = [0.0, 2.094, 4.189] (evenly spaced, ~120 degrees apart in radians), orb_radii: List[Float] = [100.0, 160.0, 220.0], orb_speeds: List[Float] = [1.5, 1.0, 0.6] (angular velocity in radians/sec). Each body also has a trail stored in Lists: trail_xs: List[Float] and trail_ys: List[Float] (shared, interleaved — body index * trail_length + offset). Actually, simplify: just track current positions. In update: for each body i (use for i in range(3)), update angle: orb_angles[i] = orb_angles[i] + orb_speeds[i] * dt. Calculate position: x = 400.0 + cos(orb_angles[i]) * orb_radii[i], y = 300.0 + sin(orb_angles[i]) * orb_radii[i]. In draw: draw a circle at center (400, 300) with radius 20 for the sun. Draw each orbiting body as a circle with radius 10 at its calculated position. Also draw the orbit paths: for each body, draw 36 small dots around its orbit using a for loop (for j in range(36): angle = float(j) * 0.1745, px = 400.0 + cos(angle) * orb_radii[i], py = 300.0 + sin(angle) * orb_radii[i], draw_circle(px, py, 1.0)). Show the current angle of body 0 as text at (10, 10): \"Angle: \" + str(orb_angles[0]).",
    expectedBehaviors: [
      "3 bodies orbit a central point",
      "Different orbital radii and speeds",
      "Bodies evenly spaced at 120 degrees initially",
      "Smooth circular motion using cos/sin",
      "Orbit paths visualized as dotted circles",
      "Angle display as HUD text",
    ],
  },

  {
    id: "breakout_game",
    name: "Breakout Game",
    difficulty: "hard",
    description:
      "Write a Vibe program for a simplified Breakout game. Paddle: 80x12 rectangle at bottom (y=570), moves left/right with arrow keys at 300 px/s. Ball: circle radius 6, starts at (400, 400), initial velocity (200, -200) px/s. Bricks: 8 bricks in a single row at y=50, each 90x20, spaced 100 pixels apart starting at x=0 (positions: 5, 105, 205, 305, 405, 505, 605, 705). Store brick alive status in a List: brick_alive: List[Float] = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] (1.0 = alive, 0.0 = dead, using Float because Vibe Lists are typed). Ball bouncing: reverse vy when hitting top wall (by < 6.0) or paddle (by >= 564.0 and bx >= paddle_x and bx <= paddle_x + 80.0). Reverse vx when hitting side walls (bx < 6.0 or bx > 794.0). Brick collision: for each alive brick, check if ball center is within brick bounds. If hit, set brick_alive[i] = 0.0, reverse vy, increment score. If ball goes below 600, set game_over = true. Draw paddle, ball, alive bricks, score at (10, 10), and \"GAME OVER\" if game_over.",
    expectedBehaviors: [
      "Paddle moves left/right at bottom",
      "Ball bounces off walls, paddle, and bricks",
      "8 bricks in a row that can be destroyed",
      "Score increments on brick hit",
      "Game over when ball falls below screen",
      "Ball physics with velocity reflection",
    ],
  },

  {
    id: "twin_stick_dodge",
    name: "Twin-Stick Dodge",
    difficulty: "hard",
    description:
      "Write a Vibe program with a dodge-the-bullets game. Player circle (radius 10) at center, moves with arrow keys at 300 px/s. Bullets spawn from all 4 edges every 0.3 seconds and fly toward where the player WAS at spawn time. Store bullets in parallel Lists: bx, by, bvx, bvy, blife (all List[Float]). Use a spawn_timer: Float = 0.3. When timer hits 0: pick random edge (rand_float(0.0, 4.0)), calculate spawn position on that edge with random offset along the edge, compute direction vector toward current player position (dx = player_x - spawn_x, dy = player_y - spawn_y), normalize it, multiply by 250.0 for bullet speed. Append to all 5 Lists. Life = 4.0 seconds. In update: move bullets (bx[i] += bvx[i] * dt, etc), decrease life, move player. Check collision: if sqrt((player_x - bx[i])^2 + (player_y - by[i])^2) < 10.0 + 3.0 and blife[i] > 0.0, set hit = true. Track survived_time: Float += dt. In draw: player circle, bullets as 6x6 rects if life > 0, draw_text(\"Time: \" + str(int(survived_time)), 10.0, 10.0). If hit, show \"HIT! Time: \" + str(int(survived_time)) at center.",
    expectedBehaviors: [
      "Player dodges bullets from all edges",
      "Bullets aim at player's position at spawn time",
      "Bullets spawn every 0.3 seconds from random edge",
      "Collision detection between player and bullets",
      "Survival timer displayed",
      "Multiple bullet types from 4 edges",
    ],
  },

  {
    id: "flocking_simulation",
    name: "Flocking Simulation",
    difficulty: "hard",
    description:
      "Write a Vibe program simulating 15 boids with simplified flocking. Store boid data in parallel Lists: boid_xs, boid_ys, boid_vxs, boid_vys (all List[Float]). Initialize 15 boids at random positions (rand_float(0.0, 800.0) for x, rand_float(0.0, 600.0) for y) with random velocities (rand_float(-50.0, 50.0) for both vx and vy). Use fn load() to initialize all boids with a for i in range(15) loop, appending to each List. In update, for each boid i (for i in range(15)): compute center of mass of ALL boids (sum all x, divide by 15, same for y). Apply cohesion: steer toward center at strength 0.5 (add (center_x - boid_xs[i]) * 0.5 * dt to boid_vxs[i]). Apply separation: for each other boid j, if distance < 30.0, push away (add repulsion vector * 100.0 * dt). Clamp speed: compute speed = sqrt(vx*vx + vy*vy), if speed > 150.0 then scale down (vx = vx / speed * 150.0). Update positions: boid_xs[i] += boid_vxs[i] * dt. Wrap around screen edges. In draw: draw each boid as a 4x4 rectangle.",
    expectedBehaviors: [
      "15 boids with autonomous movement",
      "Cohesion: boids steer toward group center",
      "Separation: boids avoid nearby neighbors",
      "Speed clamping to 150 px/s max",
      "Screen wrapping for all boids",
      "Initialized in load() with random positions",
    ],
  },

  {
    id: "platformer_level",
    name: "Platformer Level",
    difficulty: "hard",
    description:
      "Write a Vibe program with a simple platformer. Player: 20x20 rect, starts at (100, 400). Gravity 600.0 px/s^2, jump velocity -350.0. Move left/right at 250 px/s. 5 platforms stored as parallel Lists: plat_xs, plat_ys, plat_ws (all List[Float]) = [(50,450,200), (300,380,150), (500,300,180), (200,220,120), (450,150,200)] — add each component to its respective List. Collision: player is falling (vy >= 0) and was above platform last frame (prev_y + 20 <= plat_ys[i]) and now overlaps (player_y + 20 >= plat_ys[i] and player_x + 20 > plat_xs[i] and player_x < plat_xs[i] + plat_ws[i]). On collision: player_y = plat_ys[i] - 20.0, vy = 0, on_ground = true. Also check ground at y=580. Track prev_y before physics update. If player falls below 620, reset to (100, 400). In draw: draw player rect, all platforms as 12-pixel-tall rects, draw_text(\"Use arrows + up to jump\", 10.0, 10.0).",
    expectedBehaviors: [
      "Player with gravity and jump",
      "5 platforms at different heights",
      "One-way collision (only from above)",
      "Player resets if falling off screen",
      "prev_y tracking for collision accuracy",
      "Platforms drawn as rectangles",
    ],
  },

  {
    id: "minimap_radar",
    name: "Minimap Radar",
    difficulty: "hard",
    description:
      "Write a Vibe program with a large world (2000x2000) and a minimap. Player rect (16x16) starts at (1000, 1000), moves with arrow keys at 300 px/s. Place 20 items at random positions stored in item_xs, item_ys (List[Float]). Initialize in fn load() using for i in range(20) with rand_float. The main view is a 800x600 camera centered on player. To draw items in camera space: draw_x = item_xs[i] - (player_x - 400.0), draw_y = item_ys[i] - (player_y - 300.0). Only draw if draw_x is between -20 and 820 and draw_y between -20 and 620. Draw items as 10x10 rects. The minimap is a 160x120 rect in the top-right corner (starting at 630, 10). Scale: minimap_x = 630.0 + (item_xs[i] / 2000.0) * 160.0, minimap_y = 10.0 + (item_ys[i] / 2000.0) * 120.0. Draw minimap background rect, player dot on minimap, and all item dots (2x2 rects). Draw player in main view at (400, 300) always. Show \"Pos: \" + str(int(player_x)) + \", \" + str(int(player_y)) at (10, 10).",
    expectedBehaviors: [
      "Large 2000x2000 world with camera",
      "20 randomly placed items",
      "Camera-space rendering with culling",
      "160x120 minimap in corner",
      "Player and items shown on minimap",
      "Position HUD text",
    ],
  },

  {
    id: "chain_reaction",
    name: "Chain Reaction",
    difficulty: "hard",
    description:
      "Write a Vibe program simulating a chain reaction. Place 30 circles in random positions (stored in cx, cy Lists, radius 15 each). Each has a state: cstate List[Float] (0.0=idle, 1.0=exploding, 2.0=done). Exploding circles expand: store cradius List[Float] all starting at 15.0. Also store ctimer List[Float] all starting at 0.0. Initialize in fn load() with for i in range(30), using rand_float(50.0, 750.0) for x and rand_float(50.0, 550.0) for y. When player clicks (mousepressed), find the circle closest to click within 15 pixels and set its state to 1.0. In update: for each exploding circle (cstate[i] == 1.0), increase cradius[i] by 80.0 * dt, increase ctimer[i] by dt. If ctimer[i] > 1.0, set state to 2.0. While exploding, check all idle circles: if distance between centers < cradius[i] + 15.0, set that circle to exploding (cstate[j] = 1.0). In draw: draw idle circles as circles with radius 15, exploding circles with their current cradius, and done circles as small dots (radius 3). Show count of exploded circles as text. Use a for loop to count circles with state > 0.0.",
    expectedBehaviors: [
      "30 randomly placed circles",
      "Click triggers first explosion",
      "Exploding circles expand over 1 second",
      "Chain reaction: expanding circles trigger nearby idle ones",
      "3 states: idle, exploding, done",
      "Score shows number of exploded circles",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // NEW TASKS 21-50 (30 tasks: 4 easy, 8 medium, 18 hard)
  // ══════════════════════════════════════════════════════════════

  // ── New Easy (4) ─────────────────────────────────────────────

  {
    id: "fading_text",
    name: "Fading Text",
    difficulty: "easy",
    description:
      "Write a Vibe program that blinks text in and out using a sine-wave timer. Use let timer: Float = 0.0 that increments by dt each frame in fn update(dt: Float). Compute a visibility value: let vis: Float = sin(timer * 2.0). In fn draw(), if vis > 0.0, display \"Hello Vibe!\" at position (300.0, 280.0) using draw_text. When vis <= 0.0, do not draw the text (it is hidden). Also display the current timer as \"Time: \" + str(int(timer)) at (10.0, 10.0) using draw_text.",
    expectedBehaviors: [
      "Timer increments each frame using dt",
      "Text 'Hello Vibe!' shown at (300, 280) when sin(timer*2) > 0",
      "Text hidden when sin value is <= 0",
      "Timer value displayed at (10, 10)",
    ],
  },

  {
    id: "mouse_follower",
    name: "Mouse Follower",
    difficulty: "easy",
    description:
      "Write a Vibe program where a circle smoothly follows the last clicked mouse position. Use let target_x: Float = 400.0 and let target_y: Float = 300.0 for the target. Use let cx: Float = 400.0 and let cy: Float = 300.0 for the circle position. In fn mousepressed(mx: Float, my: Float, button: Int), set target_x = mx and target_y = my. In fn update(dt: Float), interpolate toward the target: cx = cx + (target_x - cx) * 3.0 * dt and cy = cy + (target_y - cy) * 3.0 * dt. In fn draw(), draw the circle at (cx, cy) with radius 20 using draw_circle. Draw a small marker at the target: draw_circle(target_x, target_y, 4.0). Display \"Click to move\" at (10.0, 10.0) using draw_text.",
    expectedBehaviors: [
      "Circle starts at center (400, 300)",
      "Clicking sets a new target position",
      "Circle smoothly interpolates toward target",
      "Small marker drawn at target position",
      "Text 'Click to move' displayed at (10, 10)",
    ],
  },

  {
    id: "keyboard_display",
    name: "Keyboard Display",
    difficulty: "easy",
    description:
      "Write a Vibe program that shows the name of the last pressed key and a total keypress count. Use let last_key: String = \"none\" and let key_count: Int = 0. In fn keypressed(k: String), set last_key = k and increment key_count by 1. In fn draw(), display \"Last Key: \" + last_key at (250.0, 250.0) using draw_text. Display \"Total Presses: \" + str(key_count) at (250.0, 290.0). Draw a decorative 200x80 rectangle at (300.0, 350.0) and display last_key inside it at (370.0, 380.0) using draw_text.",
    expectedBehaviors: [
      "Last pressed key name is displayed",
      "Total keypress count tracked and shown",
      "Initial state shows 'none' for last key",
      "Decorative box drawn around key display",
    ],
  },

  {
    id: "simple_animation",
    name: "Simple Animation",
    difficulty: "easy",
    description:
      "Write a Vibe program that cycles through 4 animation frames, drawing a pulsing rectangle. Use let frame: Int = 0 and let frame_timer: Float = 0.0. In fn update(dt: Float), add dt to frame_timer. If frame_timer >= 0.25, subtract 0.25 from frame_timer and increment frame by 1. If frame >= 4, set frame = 0. In fn draw(), draw a centered rectangle whose size depends on frame: if frame == 0, draw_rect(380.0, 280.0, 40.0, 40.0). If frame == 1, draw_rect(375.0, 275.0, 50.0, 50.0). If frame == 2, draw_rect(370.0, 270.0, 60.0, 60.0). If frame == 3, draw_rect(375.0, 275.0, 50.0, 50.0). Display \"Frame: \" + str(frame) at (10.0, 10.0).",
    expectedBehaviors: [
      "4 animation frames cycle in sequence",
      "Each frame lasts 0.25 seconds",
      "Rectangle changes size creating pulse effect",
      "Frame counter displayed at (10, 10)",
      "Animation loops continuously",
    ],
  },

  // ── New Medium (8) ───────────────────────────────────────────

  {
    id: "health_bar",
    name: "Health Bar",
    difficulty: "medium",
    description:
      "Write a Vibe program with a visual health bar that decreases on damage and regenerates over time. Use let health: Float = 100.0 and let max_health: Float = 100.0. Use let regen_rate: Float = 5.0 (HP per second). In fn keypressed(k: String), if k == \"space\", subtract 15.0 from health. If health < 0.0, set health = 0.0. In fn update(dt: Float), if health > 0.0 and health < max_health, add regen_rate * dt to health. If health > max_health, set health = max_health. In fn draw(), draw the bar background: draw_rect(250.0, 50.0, 300.0, 30.0). Draw the filled portion: let bar_width: Float = (health / max_health) * 300.0, then draw_rect(250.0, 50.0, bar_width, 30.0). Display \"HP: \" + str(int(health)) + \" / 100\" at (250.0, 90.0). Draw a 32x32 player rect at (384.0, 300.0). Display \"Press SPACE to take damage\" at (230.0, 550.0).",
    expectedBehaviors: [
      "Health starts at 100, max is 100",
      "Space key reduces health by 15",
      "Health regenerates at 5 HP per second",
      "Bar width proportional to current health",
      "Health clamped between 0 and max",
      "HP text shows current and max values",
    ],
  },

  {
    id: "screen_shake",
    name: "Screen Shake",
    difficulty: "medium",
    description:
      "Write a Vibe program demonstrating a screen shake effect. Use let shake_x: Float = 0.0 and let shake_y: Float = 0.0 as offset values. Use let shake_timer: Float = 0.0 and let shake_intensity: Float = 0.0. In fn keypressed(k: String), if k == \"space\", set shake_timer = 0.5 and shake_intensity = 15.0. In fn update(dt: Float), if shake_timer > 0.0: subtract dt from shake_timer, set shake_x = rand_float(-shake_intensity, shake_intensity), shake_y = rand_float(-shake_intensity, shake_intensity), and reduce shake_intensity by 20.0 * dt. If shake_timer <= 0.0, set shake_x = 0.0 and shake_y = 0.0. In fn draw(), apply offsets to all drawing: draw_rect(368.0 + shake_x, 268.0 + shake_y, 64.0, 64.0). Draw 4 corner markers (16x16) at (50.0 + shake_x, 50.0 + shake_y), (734.0 + shake_x, 50.0 + shake_y), (50.0 + shake_x, 534.0 + shake_y), (734.0 + shake_x, 534.0 + shake_y). Display \"Press SPACE to shake\" at (280.0 + shake_x, 550.0 + shake_y).",
    expectedBehaviors: [
      "Space triggers screen shake effect",
      "Shake lasts 0.5 seconds with random offsets",
      "All drawn elements shift by same offset",
      "Shake intensity fades over time",
      "Shake resets to zero when timer expires",
      "Multiple elements demonstrate the shake",
    ],
  },

  {
    id: "waypoint_patrol",
    name: "Waypoint Patrol",
    difficulty: "medium",
    description:
      "Write a Vibe program where an enemy rectangle patrols between 4 waypoints in a rectangular path. Define waypoints: let wp_xs: List[Float] = [100.0, 700.0, 700.0, 100.0] and let wp_ys: List[Float] = [100.0, 100.0, 500.0, 500.0]. Use let patrol_x: Float = 100.0, let patrol_y: Float = 100.0, let current_wp: Int = 1, and let patrol_speed: Float = 120.0. In fn update(dt: Float), calculate direction: let dx: Float = wp_xs[current_wp] - patrol_x, let dy: Float = wp_ys[current_wp] - patrol_y, let dist: Float = sqrt(dx * dx + dy * dy). If dist > 2.0, move: patrol_x = patrol_x + (dx / dist) * patrol_speed * dt, patrol_y = patrol_y + (dy / dist) * patrol_speed * dt. If dist <= 2.0, advance: current_wp = current_wp + 1. If current_wp >= 4, set current_wp = 0. In fn draw(), draw the enemy as a 24x24 rect at (patrol_x - 12.0, patrol_y - 12.0). Draw each waypoint as an 8x8 rect at (wp_xs[i] - 4.0, wp_ys[i] - 4.0) using a for loop. Display \"Waypoint: \" + str(current_wp) at (10.0, 10.0).",
    expectedBehaviors: [
      "Enemy patrols between 4 waypoints in a loop",
      "Moves toward current waypoint at 120 px/s",
      "Advances to next waypoint when within 2 pixels",
      "Patrol loops from last back to first waypoint",
      "Waypoint markers drawn as small rects",
      "Current waypoint index displayed",
    ],
  },

  {
    id: "expanding_rings",
    name: "Expanding Rings",
    difficulty: "medium",
    description:
      "Write a Vibe program that creates expanding circles on click. Store rings in parallel Lists: let ring_xs: List[Float] = [], let ring_ys: List[Float] = [], let ring_radii: List[Float] = [], let ring_lifes: List[Float] = []. In fn mousepressed(mx: Float, my: Float, button: Int), append mx to ring_xs, my to ring_ys, 5.0 to ring_radii, 2.0 to ring_lifes. In fn update(dt: Float), for i in range(0, len(ring_xs)): ring_radii[i] = ring_radii[i] + 80.0 * dt, ring_lifes[i] = ring_lifes[i] - dt. In fn draw(), for i in range(0, len(ring_xs)): if ring_lifes[i] > 0.0, draw_circle(ring_xs[i], ring_ys[i], ring_radii[i]). Display \"Rings: \" + str(len(ring_xs)) at (10.0, 10.0). Display \"Click to create rings\" at (280.0, 560.0).",
    expectedBehaviors: [
      "Clicking creates expanding circle at click position",
      "Circles expand at 80 pixels per second",
      "Each circle has 2-second lifetime",
      "Multiple circles can exist simultaneously",
      "Ring count displayed at top-left",
    ],
  },

  {
    id: "typewriter_text",
    name: "Typewriter Text",
    difficulty: "medium",
    description:
      "Write a Vibe program that reveals text character by character. Use let full_text: String = \"Welcome to the Vibe engine!\" and let text_len: Int = 27. Use let char_index: Int = 0, let char_timer: Float = 0.0, let char_speed: Float = 0.08. In fn update(dt: Float), if char_index < text_len: char_timer = char_timer + dt. If char_timer >= char_speed, char_timer = char_timer - char_speed and char_index = char_index + 1. In fn draw(), draw_text(full_text, 100.0, 280.0). Then draw a covering rectangle to hide unrevealed characters: let cover_x: Float = 100.0 + float(char_index) * 10.0. draw_rect(cover_x, 270.0, 700.0, 30.0). If sin(char_timer * 10.0) > 0.0, draw a cursor: draw_rect(cover_x, 275.0, 2.0, 20.0). Display \"Chars: \" + str(char_index) + \"/\" + str(text_len) at (10.0, 10.0). If char_index >= text_len, draw_text(\"Done!\", 10.0, 30.0). In fn keypressed(k: String), if k == \"space\", set char_index = 0 and char_timer = 0.0.",
    expectedBehaviors: [
      "Text revealed one character at a time",
      "Character speed is 0.08 seconds each",
      "Cover rectangle hides unrevealed portion",
      "Blinking cursor at reveal position",
      "Progress displayed as fraction",
      "Space resets the animation",
    ],
  },

  {
    id: "asteroid_field",
    name: "Asteroid Field",
    difficulty: "medium",
    description:
      "Write a Vibe program with scrolling asteroids the player must dodge. Player: 24x24 rect at let player_x: Float = 100.0, let player_y: Float = 300.0, moves up/down with key_down(\"up\") and key_down(\"down\") at 250 px/s. Asteroids scroll right to left. Use parallel Lists: let ast_xs: List[Float] = [], let ast_ys: List[Float] = [], let ast_sizes: List[Float] = []. Use let spawn_timer: Float = 0.0, let scroll_speed: Float = 200.0, let game_over: Bool = false, let score: Float = 0.0. In fn update(dt: Float), if not game_over: move player, clamp player_y between 0.0 and 576.0. spawn_timer += dt. If spawn_timer >= 0.4: spawn_timer = 0.0, append 820.0 to ast_xs, rand_float(20.0, 580.0) to ast_ys, rand_float(15.0, 40.0) to ast_sizes. Move asteroids: ast_xs[i] -= scroll_speed * dt. Collision: if ast_xs[i] < player_x + 24.0 and ast_xs[i] + ast_sizes[i] > player_x and ast_ys[i] < player_y + 24.0 and ast_ys[i] + ast_sizes[i] > player_y, set game_over = true. score += dt. In fn draw(), draw player rect, each asteroid as draw_rect(ast_xs[i], ast_ys[i], ast_sizes[i], ast_sizes[i]). draw_text(\"Score: \" + str(int(score)), 10.0, 10.0). If game_over, draw_text(\"GAME OVER\", 340.0, 280.0).",
    expectedBehaviors: [
      "Player moves up/down on left side",
      "Asteroids spawn from right every 0.4s",
      "Asteroids scroll left at 200 px/s",
      "Random y position and size per asteroid",
      "AABB collision detection with player",
      "Score increments over time until game over",
    ],
  },

  {
    id: "color_pulse",
    name: "Color Pulse Grid",
    difficulty: "medium",
    description:
      "Write a Vibe program drawing a 5x4 grid of circles whose radii pulse with sine waves at different phases. Use let timer: Float = 0.0. In fn update(dt: Float), timer += dt. In fn draw(), for row in range(0, 4): for col in range(0, 5): let cx: Float = 100.0 + float(col) * 160.0. let cy: Float = 100.0 + float(row) * 150.0. let phase: Float = float(row * 5 + col) * 0.5. let radius: Float = 20.0 + 15.0 * sin(timer * 3.0 + phase). draw_circle(cx, cy, radius). Display \"Time: \" + str(int(timer)) at (10.0, 10.0).",
    expectedBehaviors: [
      "5x4 grid of 20 circles displayed",
      "Each circle pulses using sine wave",
      "Phase offset creates wave pattern across grid",
      "Radius varies between 5 and 35 pixels",
      "Timer displayed as HUD text",
      "Smooth continuous animation",
    ],
  },

  {
    id: "grid_highlight",
    name: "Grid Highlight",
    difficulty: "medium",
    description:
      "Write a Vibe program with an 8x6 grid where clicking toggles cells on and off. Each cell is 80x80 pixels. Grid starts at (40.0, 60.0). Store states: let cells: List[Float] = []. Initialize in fn load(): for i in range(0, 48), append 0.0 to cells. In fn mousepressed(mx: Float, my: Float, button: Int), let col: Int = int((mx - 40.0) / 80.0), let row: Int = int((my - 60.0) / 80.0). If col >= 0 and col < 8 and row >= 0 and row < 6: let idx: Int = row * 8 + col. If cells[idx] == 0.0, set cells[idx] = 1.0, else set cells[idx] = 0.0. In fn draw(), for row in range(0, 6): for col in range(0, 8): let x: Float = 40.0 + float(col) * 80.0. let y: Float = 60.0 + float(row) * 80.0. draw_rect(x, y, 80.0, 80.0). If cells[row * 8 + col] == 1.0, draw_rect(x + 4.0, y + 4.0, 72.0, 72.0). Count active cells: let count: Int = 0, for i in range(0, 48): if cells[i] == 1.0, count = count + 1. draw_text(\"Active: \" + str(count), 10.0, 10.0).",
    expectedBehaviors: [
      "8x6 grid of 80x80 cells drawn",
      "Clicking toggles a cell on or off",
      "Grid position calculated from mouse coordinates",
      "Active cells have filled inner rectangle",
      "Active cell count displayed at top-left",
      "Clicks outside grid are ignored",
    ],
  },

  // ── New Hard (18) ────────────────────────────────────────────

  {
    id: "pong_game",
    name: "Pong Game",
    difficulty: "hard",
    description:
      "Write a Vibe program implementing 2-player Pong. Left paddle: 12x80 rect at x=30, controlled by key_down(\"w\") up and key_down(\"s\") down at 300 px/s. Right paddle: 12x80 rect at x=758, controlled by key_down(\"up\") and key_down(\"down\") at 300 px/s. Ball: circle radius 8, starts at (400, 300). Use let p1_y: Float = 260.0, let p2_y: Float = 260.0, let ball_x: Float = 400.0, let ball_y: Float = 300.0, let ball_vx: Float = 250.0, let ball_vy: Float = 150.0, let score1: Int = 0, let score2: Int = 0. In fn update(dt: Float): move paddles with key_down, clamp y between 0.0 and 520.0. Move ball. Bounce off top (ball_y < 8.0, reverse ball_vy) and bottom (ball_y > 592.0, reverse ball_vy). Left paddle hit: if ball_x - 8.0 <= 42.0 and ball_x > 30.0 and ball_y >= p1_y and ball_y <= p1_y + 80.0, reverse ball_vx, ball_x = 50.0. Right paddle: if ball_x + 8.0 >= 758.0 and ball_x < 770.0 and ball_y >= p2_y and ball_y <= p2_y + 80.0, reverse ball_vx, ball_x = 750.0. If ball_x < 0.0: score2 += 1, ball_x = 400.0, ball_y = 300.0, ball_vx = 250.0, ball_vy = 150.0. If ball_x > 800.0: score1 += 1, ball_x = 400.0, ball_y = 300.0, ball_vx = -250.0, ball_vy = -150.0. In fn draw(): draw_rect(30.0, p1_y, 12.0, 80.0). draw_rect(758.0, p2_y, 12.0, 80.0). draw_circle(ball_x, ball_y, 8.0). For i in range(0, 30): draw_rect(398.0, float(i) * 20.0, 4.0, 10.0). draw_text(str(score1), 300.0, 20.0). draw_text(str(score2), 480.0, 20.0).",
    expectedBehaviors: [
      "Two paddles controlled by different key sets (w/s and up/down)",
      "Ball bounces off top/bottom walls and paddles",
      "Scoring when ball passes a paddle",
      "Ball resets to center after a point is scored",
      "Dashed center line drawn",
      "Scores displayed for both players",
    ],
  },

  {
    id: "space_invaders",
    name: "Space Invaders",
    difficulty: "hard",
    description:
      "Write a Vibe program implementing simplified Space Invaders. 6x3 grid of enemies in parallel Lists: let inv_xs: List[Float] = [], let inv_ys: List[Float] = [], let inv_alive: List[Float] = []. Initialize in fn load(): for row in range(0, 3), for col in range(0, 6): append 150.0 + float(col) * 80.0 to inv_xs, 50.0 + float(row) * 50.0 to inv_ys, 1.0 to inv_alive. Use let inv_dir: Float = 1.0, let inv_speed: Float = 40.0. Player: let px: Float = 384.0 at y=550, 32x16 rect, moves left/right at 250 px/s. Bullets: let bul_xs: List[Float] = [], bul_ys: List[Float] = [], bul_alive: List[Float] = []. let score: Int = 0. In fn keypressed(k: String), if k == \"space\": append px + 14.0 to bul_xs, 540.0 to bul_ys, 1.0 to bul_alive. In fn update(dt: Float): move player with key_down, clamp px between 0.0 and 768.0. Move alive invaders: for i in range(0, len(inv_xs)): if inv_alive[i] == 1.0, inv_xs[i] += inv_speed * inv_dir * dt. Check edges: let reverse: Bool = false. For i in range(0, len(inv_xs)): if inv_alive[i] == 1.0 and (inv_xs[i] < 20.0 or inv_xs[i] > 750.0), reverse = true. If reverse: inv_dir = -inv_dir. For i in range(0, len(inv_ys)): if inv_alive[i] == 1.0, inv_ys[i] += 20.0. Move bullets: for j in range(0, len(bul_ys)): if bul_alive[j] == 1.0, bul_ys[j] -= 400.0 * dt. If bul_ys[j] < 0.0, bul_alive[j] = 0.0. Collision: for j in range(0, len(bul_xs)): if bul_alive[j] == 1.0: for i in range(0, len(inv_xs)): if inv_alive[i] == 1.0 and bul_xs[j] >= inv_xs[i] and bul_xs[j] <= inv_xs[i] + 30.0 and bul_ys[j] >= inv_ys[i] and bul_ys[j] <= inv_ys[i] + 20.0: inv_alive[i] = 0.0, bul_alive[j] = 0.0, score += 1. In fn draw(): draw_rect(px, 550.0, 32.0, 16.0). For i in range(0, len(inv_xs)): if inv_alive[i] == 1.0, draw_rect(inv_xs[i], inv_ys[i], 30.0, 20.0). For j in range(0, len(bul_xs)): if bul_alive[j] == 1.0, draw_rect(bul_xs[j], bul_ys[j], 4.0, 10.0). draw_text(\"Score: \" + str(score), 10.0, 10.0). Count alive: let alive: Int = 0. For i in range(0, len(inv_alive)): if inv_alive[i] == 1.0, alive += 1. If alive == 0, draw_text(\"YOU WIN!\", 340.0, 280.0).",
    expectedBehaviors: [
      "6x3 grid of enemies moves horizontally",
      "Enemies reverse direction and descend at edges",
      "Player shoots bullets upward with space",
      "Bullet-enemy collision destroys both",
      "Score tracked and displayed",
      "Win condition when all enemies destroyed",
    ],
  },

  {
    id: "bezier_curves",
    name: "Bezier Curves",
    difficulty: "hard",
    description:
      "Write a Vibe program drawing an interactive cubic Bezier curve. 4 control points: let cp_xs: List[Float] = [100.0, 250.0, 550.0, 700.0], let cp_ys: List[Float] = [500.0, 100.0, 100.0, 500.0]. Use let selected: Int = 0. In fn keypressed(k: String): if k == \"1\", selected = 0. If k == \"2\", selected = 1. If k == \"3\", selected = 2. If k == \"4\", selected = 3. In fn update(dt: Float): if key_down(\"left\"), cp_xs[selected] -= 150.0 * dt. If key_down(\"right\"), cp_xs[selected] += 150.0 * dt. If key_down(\"up\"), cp_ys[selected] -= 150.0 * dt. If key_down(\"down\"), cp_ys[selected] += 150.0 * dt. In fn draw(), draw the curve with 50 sample points: for i in range(0, 51): let t: Float = float(i) / 50.0. let u: Float = 1.0 - t. let bx: Float = u * u * u * cp_xs[0] + 3.0 * u * u * t * cp_xs[1] + 3.0 * u * t * t * cp_xs[2] + t * t * t * cp_xs[3]. let by: Float = u * u * u * cp_ys[0] + 3.0 * u * u * t * cp_ys[1] + 3.0 * u * t * t * cp_ys[2] + t * t * t * cp_ys[3]. draw_circle(bx, by, 2.0). Draw control points: for i in range(0, 4): draw_circle(cp_xs[i], cp_ys[i], 8.0). Draw control polygon: for i in range(0, 3): for j in range(0, 10): let lt: Float = float(j) / 10.0. let lx: Float = cp_xs[i] + (cp_xs[i + 1] - cp_xs[i]) * lt. let ly: Float = cp_ys[i] + (cp_ys[i + 1] - cp_ys[i]) * lt. draw_circle(lx, ly, 1.0). draw_text(\"Point: \" + str(selected + 1), 10.0, 10.0). draw_text(\"Keys 1-4 select, arrows move\", 10.0, 30.0).",
    expectedBehaviors: [
      "Cubic Bezier curve drawn with 51 sample points",
      "4 control points displayed as circles",
      "Keys 1-4 select control points",
      "Arrow keys move the selected point",
      "Curve updates in real-time",
      "Control polygon shown as dotted lines",
    ],
  },

  {
    id: "verlet_rope",
    name: "Verlet Rope",
    difficulty: "hard",
    description:
      "Write a Vibe program simulating a rope with Verlet integration. 10 nodes. Store positions: let node_xs: List[Float] = [], let node_ys: List[Float] = []. Previous positions: let prev_xs: List[Float] = [], let prev_ys: List[Float] = []. Initialize in fn load(): for i in range(0, 10): let xv: Float = 200.0 + float(i) * 40.0. Append xv to node_xs and prev_xs, 200.0 to node_ys and prev_ys. Node 0 pinned: let pin_x: Float = 200.0, let pin_y: Float = 200.0, speed 200 px/s. let rest_len: Float = 40.0. In fn update(dt: Float): move pin with key_down arrows. node_xs[0] = pin_x, node_ys[0] = pin_y, prev_xs[0] = pin_x, prev_ys[0] = pin_y. Verlet for i in range(1, 10): let vx: Float = node_xs[i] - prev_xs[i]. let vy: Float = node_ys[i] - prev_ys[i]. prev_xs[i] = node_xs[i]. prev_ys[i] = node_ys[i]. node_xs[i] = node_xs[i] + vx * 0.99. node_ys[i] = node_ys[i] + vy * 0.99 + 400.0 * dt * dt. Constraint solve 3 times: for iter in range(0, 3): for i in range(0, 9): let dx: Float = node_xs[i + 1] - node_xs[i]. let dy: Float = node_ys[i + 1] - node_ys[i]. let dist: Float = sqrt(dx * dx + dy * dy). if dist > 0.1: let diff: Float = (dist - rest_len) / dist * 0.5. if i == 0: node_xs[i + 1] -= dx * diff * 2.0. node_ys[i + 1] -= dy * diff * 2.0. else: node_xs[i] += dx * diff. node_ys[i] += dy * diff. node_xs[i + 1] -= dx * diff. node_ys[i + 1] -= dy * diff. In fn draw(): for i in range(0, 10): draw_circle(node_xs[i], node_ys[i], 5.0). For i in range(0, 9): for j in range(0, 5): let lt: Float = float(j) / 5.0. draw_circle(node_xs[i] + (node_xs[i+1] - node_xs[i]) * lt, node_ys[i] + (node_ys[i+1] - node_ys[i]) * lt, 2.0). draw_text(\"Arrows move anchor\", 10.0, 10.0).",
    expectedBehaviors: [
      "10-node rope with Verlet integration",
      "First node pinned, controlled by arrows",
      "Gravity pulls free nodes downward",
      "Distance constraints maintain segment length",
      "3 constraint iterations for stability",
      "Segments visualized between nodes",
    ],
  },

  {
    id: "cellular_automata",
    name: "Cellular Automata",
    difficulty: "hard",
    description:
      "Write a Vibe program implementing Conway's Game of Life on a 20x15 grid (300 cells). Use let cells: List[Float] = [] and let next_cells: List[Float] = []. Initialize in fn load(): for i in range(0, 300): if rand_float(0.0, 1.0) > 0.7: cells = cells + [1.0]. else: cells = cells + [0.0]. next_cells = next_cells + [0.0]. Use let sim_timer: Float = 0.0, let generation: Int = 0, let paused: Bool = false. In fn keypressed(k: String), if k == \"space\": if paused: paused = false. else: paused = true. In fn update(dt: Float), if not paused: sim_timer += dt. If sim_timer >= 0.2: sim_timer = 0.0. generation += 1. For row in range(0, 15): for col in range(0, 20): let count: Int = 0. Check 8 neighbors explicitly: if row > 0 and col > 0: if cells[(row - 1) * 20 + col - 1] == 1.0: count += 1. if row > 0: if cells[(row - 1) * 20 + col] == 1.0: count += 1. if row > 0 and col < 19: if cells[(row - 1) * 20 + col + 1] == 1.0: count += 1. if col > 0: if cells[row * 20 + col - 1] == 1.0: count += 1. if col < 19: if cells[row * 20 + col + 1] == 1.0: count += 1. if row < 14 and col > 0: if cells[(row + 1) * 20 + col - 1] == 1.0: count += 1. if row < 14: if cells[(row + 1) * 20 + col] == 1.0: count += 1. if row < 14 and col < 19: if cells[(row + 1) * 20 + col + 1] == 1.0: count += 1. let idx: Int = row * 20 + col. If cells[idx] == 1.0: if count == 2 or count == 3: next_cells[idx] = 1.0. else: next_cells[idx] = 0.0. else: if count == 3: next_cells[idx] = 1.0. else: next_cells[idx] = 0.0. Copy: for i in range(0, 300): cells[i] = next_cells[i]. In fn draw(): for row in range(0, 15): for col in range(0, 20): if cells[row * 20 + col] == 1.0: draw_rect(float(col) * 40.0, float(row) * 40.0, 38.0, 38.0). draw_text(\"Gen: \" + str(generation), 10.0, 10.0). If paused: draw_text(\"PAUSED\", 350.0, 10.0).",
    expectedBehaviors: [
      "20x15 grid with Game of Life rules",
      "Random initialization at ~30% density",
      "Updates every 0.2 seconds",
      "8-neighbor counting per cell",
      "Birth (3) and survival (2-3) rules",
      "Space toggles pause, generation counter shown",
    ],
  },

  {
    id: "bullet_hell_pattern",
    name: "Bullet Hell Pattern",
    difficulty: "hard",
    description:
      "Write a Vibe program creating spiral bullet patterns from a central emitter at (400, 200). Bullets in parallel Lists: let bul_xs: List[Float] = [], bul_ys: List[Float] = [], bul_vxs: List[Float] = [], bul_vys: List[Float] = [], bul_lifes: List[Float] = []. Use let emit_angle: Float = 0.0, let emit_timer: Float = 0.0, let game_over: Bool = false. Player: let px: Float = 400.0, let py: Float = 500.0, radius 8, moves left/right with key_down at 300 px/s. In fn update(dt: Float), if not game_over: emit_angle += 2.5 * dt. emit_timer += dt. If emit_timer >= 0.05: emit_timer = 0.0. For k in range(0, 3): let angle: Float = emit_angle + float(k) * 2.094. bul_xs = bul_xs + [400.0]. bul_ys = bul_ys + [200.0]. bul_vxs = bul_vxs + [cos(angle) * 120.0]. bul_vys = bul_vys + [sin(angle) * 120.0]. bul_lifes = bul_lifes + [5.0]. Move player. For i in range(0, len(bul_xs)): bul_xs[i] += bul_vxs[i] * dt. bul_ys[i] += bul_vys[i] * dt. bul_lifes[i] -= dt. If bul_lifes[i] > 0.0: let ddx: Float = px - bul_xs[i]. let ddy: Float = py - bul_ys[i]. if sqrt(ddx * ddx + ddy * ddy) < 11.0: game_over = true. In fn draw(): draw_circle(400.0, 200.0, 12.0). For i in range(0, len(bul_xs)): if bul_lifes[i] > 0.0: draw_circle(bul_xs[i], bul_ys[i], 3.0). draw_circle(px, py, 8.0). If game_over: draw_text(\"GAME OVER\", 340.0, 300.0). let alive: Int = 0. For i in range(0, len(bul_lifes)): if bul_lifes[i] > 0.0: alive += 1. draw_text(\"Bullets: \" + str(alive), 10.0, 10.0).",
    expectedBehaviors: [
      "Spiral bullet pattern from central emitter",
      "3 bullets at 120-degree intervals per spawn",
      "Rotating angle creates spiral effect",
      "Player dodges at bottom of screen",
      "Circle collision detection ends game",
      "Active bullet count displayed",
    ],
  },

  {
    id: "aabb_physics",
    name: "AABB Physics",
    difficulty: "hard",
    description:
      "Write a Vibe program with 6 rectangles falling under gravity onto 3 platforms. Boxes in parallel Lists: let box_xs: List[Float] = [], box_ys: List[Float] = [], box_vys: List[Float] = [], box_ws: List[Float] = [], box_hs: List[Float] = []. Initialize in fn load(): for i in range(0, 6): box_xs = box_xs + [80.0 + float(i) * 110.0]. box_ys = box_ys + [rand_float(50.0, 200.0)]. box_vys = box_vys + [0.0]. box_ws = box_ws + [rand_float(30.0, 60.0)]. box_hs = box_hs + [rand_float(30.0, 60.0)]. Platforms: let plat_xs: List[Float] = [50.0, 300.0, 550.0], plat_ys: List[Float] = [450.0, 350.0, 450.0], plat_ws: List[Float] = [200.0, 200.0, 200.0]. In fn update(dt: Float): for i in range(0, 6): box_vys[i] += 300.0 * dt. box_ys[i] += box_vys[i] * dt. Floor: if box_ys[i] + box_hs[i] > 580.0: box_ys[i] = 580.0 - box_hs[i]. box_vys[i] = 0.0. Platforms: for j in range(0, 3): if box_vys[i] >= 0.0 and box_xs[i] + box_ws[i] > plat_xs[j] and box_xs[i] < plat_xs[j] + plat_ws[j] and box_ys[i] + box_hs[i] >= plat_ys[j] and box_ys[i] + box_hs[i] <= plat_ys[j] + 20.0: box_ys[i] = plat_ys[j] - box_hs[i]. box_vys[i] = 0.0. Box-box push: for i in range(0, 6): for j in range(0, 6): if j > i and box_xs[i] < box_xs[j] + box_ws[j] and box_xs[i] + box_ws[i] > box_xs[j] and box_ys[i] < box_ys[j] + box_hs[j] and box_ys[i] + box_hs[i] > box_ys[j]: let ov: Float = (box_xs[i] + box_ws[i]) - box_xs[j]. if ov > 0.0: box_xs[i] -= ov * 0.5. box_xs[j] += ov * 0.5. In fn keypressed(k: String), if k == \"space\": for i in range(0, 6): box_ys[i] = rand_float(50.0, 200.0). box_vys[i] = 0.0. In fn draw(): for i in range(0, 6): draw_rect(box_xs[i], box_ys[i], box_ws[i], box_hs[i]). For j in range(0, 3): draw_rect(plat_xs[j], plat_ys[j], plat_ws[j], 15.0). draw_text(\"Space: Reset\", 10.0, 10.0).",
    expectedBehaviors: [
      "6 boxes fall under gravity",
      "Boxes land on floor at y=580",
      "Boxes land on 3 static platforms",
      "Box-box collision pushes apart horizontally",
      "Space resets all box positions",
      "Multiple AABB checks per frame",
    ],
  },

  {
    id: "inventory_grid",
    name: "Inventory Grid",
    difficulty: "hard",
    description:
      "Write a Vibe program with a clickable 5x4 inventory grid for item management. Grid at (200.0, 100.0), each cell 80x80. Items: let inv_items: List[Float] = [] (0.0=empty, 1.0=sword, 2.0=shield, 3.0=potion). Use let held_item: Float = 0.0. Initialize in fn load(): for i in range(0, 20): inv_items = inv_items + [0.0]. In fn keypressed(k: String): if k == \"1\" or k == \"2\" or k == \"3\": let item_type: Float = 0.0. If k == \"1\": item_type = 1.0. If k == \"2\": item_type = 2.0. If k == \"3\": item_type = 3.0. For i in range(0, 20): if inv_items[i] == 0.0: inv_items[i] = item_type. break. In fn mousepressed(mx: Float, my: Float, button: Int): let col: Int = int((mx - 200.0) / 80.0). let row: Int = int((my - 100.0) / 80.0). If col >= 0 and col < 5 and row >= 0 and row < 4: let idx: Int = row * 5 + col. If held_item == 0.0 and inv_items[idx] > 0.0: held_item = inv_items[idx]. inv_items[idx] = 0.0. else if held_item > 0.0 and inv_items[idx] == 0.0: inv_items[idx] = held_item. held_item = 0.0. else if held_item > 0.0 and inv_items[idx] > 0.0: let tmp: Float = inv_items[idx]. inv_items[idx] = held_item. held_item = tmp. In fn draw(): for row in range(0, 4): for col in range(0, 5): let x: Float = 200.0 + float(col) * 80.0. let y: Float = 100.0 + float(row) * 80.0. draw_rect(x, y, 80.0, 80.0). let val: Float = inv_items[row * 5 + col]. if val == 1.0: draw_rect(x + 25.0, y + 20.0, 30.0, 8.0). draw_rect(x + 37.0, y + 28.0, 6.0, 32.0). if val == 2.0: draw_circle(x + 40.0, y + 40.0, 15.0). if val == 3.0: draw_circle(x + 40.0, y + 40.0, 8.0). draw_text(\"Held: \" + str(int(held_item)), 10.0, 10.0). draw_text(\"1-3: Add | Click: Pick/Place\", 200.0, 540.0).",
    expectedBehaviors: [
      "5x4 grid of inventory cells displayed",
      "Click picks up item from occupied cell",
      "Click places held item into empty cell",
      "Click swaps held item with occupied cell",
      "Keys 1-3 add different item types to first empty slot",
      "Visual icons differ by item type",
    ],
  },

  {
    id: "procedural_terrain",
    name: "Procedural Terrain",
    difficulty: "hard",
    description:
      "Write a Vibe program generating and scrolling procedural 1D terrain. Store heights: let heights: List[Float] = []. Initialize in fn load(): let h: Float = 300.0. For i in range(0, 80): h = h + rand_float(-30.0, 30.0). If h < 100.0: h = 100.0. If h > 500.0: h = 500.0. heights = heights + [h]. Use let scroll_timer: Float = 0.0, let scroll_speed: Float = 60.0. In fn update(dt: Float): scroll_timer += scroll_speed * dt. If scroll_timer >= 10.0: scroll_timer -= 10.0. For i in range(0, 79): heights[i] = heights[i + 1]. let new_h: Float = heights[78] + rand_float(-30.0, 30.0). If new_h < 100.0: new_h = 100.0. If new_h > 500.0: new_h = 500.0. heights[79] = new_h. If key_down(\"up\"): scroll_speed += 50.0 * dt. If key_down(\"down\"): scroll_speed -= 50.0 * dt. If scroll_speed < 20.0: scroll_speed = 20.0. If scroll_speed > 200.0: scroll_speed = 200.0. In fn draw(): for i in range(0, 80): draw_rect(float(i) * 10.0, heights[i], 10.0, 600.0 - heights[i]). let player_col: Int = 20. draw_rect(float(player_col) * 10.0 - 1.0, heights[player_col] - 14.0, 12.0, 14.0). draw_text(\"Height: \" + str(int(heights[20])), 10.0, 10.0). draw_text(\"Speed: \" + str(int(scroll_speed)), 10.0, 30.0).",
    expectedBehaviors: [
      "80 terrain columns with random heights",
      "Terrain scrolls leftward continuously",
      "New terrain generated at right edge",
      "Player rect sits on terrain surface",
      "Scroll speed adjustable with up/down keys",
      "Height and speed displayed",
    ],
  },

  {
    id: "heat_diffusion",
    name: "Heat Diffusion",
    difficulty: "hard",
    description:
      "Write a Vibe program simulating 2D heat diffusion on a 16x12 grid (192 cells). Use let heat: List[Float] = [] and let next_heat: List[Float] = []. Initialize in fn load(): for i in range(0, 192): heat = heat + [0.0]. next_heat = next_heat + [0.0]. In fn mousepressed(mx: Float, my: Float, button: Int): let col: Int = int(mx / 50.0). let row: Int = int(my / 50.0). If col >= 0 and col < 16 and row >= 0 and row < 12: heat[row * 16 + col] = 100.0. In fn update(dt: Float): for row in range(0, 12): for col in range(0, 16): let idx: Int = row * 16 + col. let sum: Float = 0.0. let n: Int = 0. If row > 0: sum += heat[(row - 1) * 16 + col]. n += 1. If row < 11: sum += heat[(row + 1) * 16 + col]. n += 1. If col > 0: sum += heat[row * 16 + col - 1]. n += 1. If col < 15: sum += heat[row * 16 + col + 1]. n += 1. let avg: Float = sum / float(n). next_heat[idx] = heat[idx] + (avg - heat[idx]) * 2.0 * dt. next_heat[idx] = next_heat[idx] * 0.998. For i in range(0, 192): heat[i] = next_heat[i]. In fn draw(): let max_t: Float = 0.0. For row in range(0, 12): for col in range(0, 16): let temp: Float = heat[row * 16 + col]. If temp > max_t: max_t = temp. let size: Float = temp / 100.0 * 48.0. If size > 48.0: size = 48.0. If size > 1.0: let off: Float = (48.0 - size) / 2.0. draw_rect(float(col) * 50.0 + 1.0 + off, float(row) * 50.0 + 1.0 + off, size, size). draw_text(\"Click to add heat\", 10.0, 10.0). draw_text(\"Max: \" + str(int(max_t)), 10.0, 30.0).",
    expectedBehaviors: [
      "16x12 grid for heat simulation",
      "Click adds heat (100.0) at cell",
      "Heat diffuses to 4 neighbors each frame",
      "Boundary cells handled with neighbor count",
      "Visual size proportional to temperature",
      "Gradual cooling with max temp displayed",
    ],
  },

  {
    id: "asteroids_game",
    name: "Asteroids Game",
    difficulty: "hard",
    description:
      "Write a Vibe program implementing classic Asteroids. Ship: let ship_x: Float = 400.0, ship_y: Float = 300.0, ship_angle: Float = -1.5708, ship_vx: Float = 0.0, ship_vy: Float = 0.0. let game_over: Bool = false, let score: Int = 0. In fn update(dt: Float), if not game_over: if key_down(\"left\"): ship_angle -= 3.0 * dt. If key_down(\"right\"): ship_angle += 3.0 * dt. If key_down(\"up\"): ship_vx += cos(ship_angle) * 300.0 * dt. ship_vy += sin(ship_angle) * 300.0 * dt. ship_vx = ship_vx * 0.99. ship_vy = ship_vy * 0.99. ship_x += ship_vx * dt. ship_y += ship_vy * dt. Wrap: if ship_x > 800.0: ship_x = 0.0. If ship_x < 0.0: ship_x = 800.0. If ship_y > 600.0: ship_y = 0.0. If ship_y < 0.0: ship_y = 600.0. Asteroids: let ax: List[Float] = [], ay, avx, avy, asize, aalive (all List[Float]). Init in fn load(): for i in range(0, 6): ax = ax + [rand_float(0.0, 800.0)]. ay = ay + [rand_float(0.0, 600.0)]. avx = avx + [rand_float(-60.0, 60.0)]. avy = avy + [rand_float(-60.0, 60.0)]. asize = asize + [25.0]. aalive = aalive + [1.0]. Move and wrap asteroids. Bullets: let bx: List[Float] = [], by, bvx, bvy, blife. In fn keypressed(k: String), if k == \"space\" and not game_over: let nx: Float = ship_x + cos(ship_angle) * 15.0. let ny: Float = ship_y + sin(ship_angle) * 15.0. bx = bx + [nx]. by = by + [ny]. bvx = bvx + [cos(ship_angle) * 400.0]. bvy = bvy + [sin(ship_angle) * 400.0]. blife = blife + [2.0]. Move bullets, decrement life. Bullet-asteroid: if blife[j] > 0.0 and aalive[i] == 1.0: let ddx: Float = bx[j] - ax[i]. let ddy: Float = by[j] - ay[i]. if sqrt(ddx*ddx + ddy*ddy) < asize[i]: aalive[i] = 0.0. blife[j] = 0.0. score += 1. Ship-asteroid: if aalive[i] == 1.0: let sdx: Float = ship_x - ax[i]. let sdy: Float = ship_y - ay[i]. if sqrt(sdx*sdx + sdy*sdy) < asize[i] + 8.0: game_over = true. In fn draw(): draw_circle(ship_x, ship_y, 8.0). draw_circle(ship_x + cos(ship_angle) * 15.0, ship_y + sin(ship_angle) * 15.0, 3.0). For i: if aalive[i] == 1.0: draw_circle(ax[i], ay[i], asize[i]). For j: if blife[j] > 0.0: draw_circle(bx[j], by[j], 2.0). draw_text(\"Score: \" + str(score), 10.0, 10.0). If game_over: draw_text(\"GAME OVER\", 340.0, 280.0).",
    expectedBehaviors: [
      "Ship rotates and thrusts with inertia",
      "Ship and asteroids wrap around edges",
      "6 asteroids with random movement",
      "Bullets fired from ship nose",
      "Bullet-asteroid collision destroys asteroid",
      "Ship-asteroid collision ends game",
    ],
  },

  {
    id: "rhythm_game",
    name: "Rhythm Game",
    difficulty: "hard",
    description:
      "Write a Vibe program with a 4-lane rhythm game. Lane x positions: 250, 350, 450, 550. Hit zone at y=500. Notes in parallel Lists: let note_xs: List[Float] = [], note_ys: List[Float] = [], note_lanes: List[Float] = [], note_hit: List[Float] = []. Use let spawn_timer: Float = 0.0, note_speed: Float = 200.0, score: Int = 0, misses: Int = 0, combo: Int = 0, flash_timer: Float = 0.0, flash_lane: Int = -1. In fn update(dt: Float): spawn_timer += dt. If spawn_timer >= 0.6: spawn_timer = 0.0. let lane: Int = int(rand_float(0.0, 3.99)). note_xs = note_xs + [250.0 + float(lane) * 100.0]. note_ys = note_ys + [-20.0]. note_lanes = note_lanes + [float(lane)]. note_hit = note_hit + [0.0]. For i in range(0, len(note_ys)): if note_hit[i] == 0.0: note_ys[i] += note_speed * dt. If note_ys[i] > 600.0 and note_hit[i] == 0.0: note_hit[i] = 2.0. misses += 1. combo = 0. flash_timer -= dt. In fn keypressed(k: String): let press_lane: Int = -1. If k == \"d\": press_lane = 0. If k == \"f\": press_lane = 1. If k == \"j\": press_lane = 2. If k == \"k\": press_lane = 3. If press_lane >= 0: for i in range(0, len(note_ys)): if note_hit[i] == 0.0 and int(note_lanes[i]) == press_lane and note_ys[i] > 470.0 and note_ys[i] < 530.0: note_hit[i] = 1.0. score += 1. combo += 1. flash_timer = 0.15. flash_lane = press_lane. break. In fn draw(): for lane in range(0, 4): draw_rect(220.0 + float(lane) * 100.0, 495.0, 60.0, 10.0). For i in range(0, len(note_xs)): if note_hit[i] == 0.0: draw_rect(note_xs[i] - 30.0, note_ys[i] - 10.0, 60.0, 20.0). If flash_timer > 0.0: draw_rect(220.0 + float(flash_lane) * 100.0, 488.0, 60.0, 24.0). draw_text(\"Score: \" + str(score), 10.0, 10.0). draw_text(\"Combo: \" + str(combo), 10.0, 30.0). draw_text(\"Miss: \" + str(misses), 10.0, 50.0). draw_text(\"D F J K\", 340.0, 560.0).",
    expectedBehaviors: [
      "4 lanes with falling notes",
      "Notes spawn randomly every 0.6 seconds",
      "Keys d/f/j/k map to lanes 0-3",
      "Hit detection within y 470-530 window",
      "Score, combo, and miss tracking",
      "Flash effect on successful hit",
    ],
  },

  {
    id: "fractal_tree",
    name: "Fractal Tree",
    difficulty: "hard",
    description:
      "Write a Vibe program drawing a fractal tree using iterative breadth-first expansion. Store line segments to draw: let seg_x1s: List[Float] = [], seg_y1s: List[Float] = [], seg_x2s: List[Float] = [], seg_y2s: List[Float] = []. Processing queue: let q_xs: List[Float] = [], q_ys: List[Float] = [], q_angles: List[Float] = [], q_lens: List[Float] = [], q_depths: List[Float] = []. Use let max_depth: Int = 7, let branch_angle: Float = 0.5, let built: Bool = false. Build tree in fn update(dt: Float) once (if not built): Seed: q_xs = q_xs + [400.0]. q_ys = q_ys + [580.0]. q_angles = q_angles + [-1.5708]. q_lens = q_lens + [100.0]. q_depths = q_depths + [0.0]. let ptr: Int = 0. For iter in range(0, 500): if ptr >= len(q_xs): break. let sx: Float = q_xs[ptr]. let sy: Float = q_ys[ptr]. let sa: Float = q_angles[ptr]. let sl: Float = q_lens[ptr]. let sd: Float = q_depths[ptr]. let ex: Float = sx + cos(sa) * sl. let ey: Float = sy + sin(sa) * sl. seg_x1s = seg_x1s + [sx]. seg_y1s = seg_y1s + [sy]. seg_x2s = seg_x2s + [ex]. seg_y2s = seg_y2s + [ey]. If sd < float(max_depth): let nl: Float = sl * 0.7. let nd: Float = sd + 1.0. q_xs = q_xs + [ex]. q_ys = q_ys + [ey]. q_angles = q_angles + [sa - branch_angle]. q_lens = q_lens + [nl]. q_depths = q_depths + [nd]. q_xs = q_xs + [ex]. q_ys = q_ys + [ey]. q_angles = q_angles + [sa + branch_angle]. q_lens = q_lens + [nl]. q_depths = q_depths + [nd]. ptr += 1. built = true. In fn draw(): for i in range(0, len(seg_x1s)): for j in range(0, 5): let lt: Float = float(j) / 5.0. let lx: Float = seg_x1s[i] + (seg_x2s[i] - seg_x1s[i]) * lt. let ly: Float = seg_y1s[i] + (seg_y2s[i] - seg_y1s[i]) * lt. draw_circle(lx, ly, 1.0). draw_text(\"Segments: \" + str(len(seg_x1s)), 10.0, 10.0). draw_text(\"Angle: \" + str(branch_angle), 10.0, 30.0).",
    expectedBehaviors: [
      "Fractal tree drawn with branching segments",
      "Up to 7 levels of recursive depth",
      "Each branch splits into two",
      "Branch length reduces by 0.7x per level",
      "Segments visualized as dotted lines",
      "Segment count displayed",
    ],
  },

  {
    id: "tower_defense_path",
    name: "Tower Defense",
    difficulty: "hard",
    description:
      "Write a Vibe program with a tower defense game. Path waypoints: let path_xs: List[Float] = [0.0, 200.0, 200.0, 600.0, 600.0, 800.0], path_ys: List[Float] = [300.0, 300.0, 100.0, 100.0, 500.0, 500.0]. Enemies: let en_xs: List[Float] = [], en_ys: List[Float] = [], en_wp: List[Float] = [], en_hp: List[Float] = []. Use let spawn_timer: Float = 2.0, let enemy_speed: Float = 80.0, let score: Int = 0, let lives: Int = 10. Towers: let tow_xs: List[Float] = [], tow_ys: List[Float] = [], tow_timers: List[Float] = []. Projectiles: let proj_xs: List[Float] = [], proj_ys: List[Float] = [], proj_txs: List[Float] = [], proj_tys: List[Float] = [], proj_alive: List[Float] = []. In fn update(dt: Float): spawn_timer -= dt. If spawn_timer <= 0.0: spawn_timer = 2.0. en_xs = en_xs + [0.0]. en_ys = en_ys + [300.0]. en_wp = en_wp + [1.0]. en_hp = en_hp + [3.0]. Move enemies toward waypoint: for i in range(0, len(en_xs)): if en_hp[i] > 0.0: let wi: Int = int(en_wp[i]). If wi < 6: let dx: Float = path_xs[wi] - en_xs[i]. let dy: Float = path_ys[wi] - en_ys[i]. let d: Float = sqrt(dx*dx + dy*dy). If d > 3.0: en_xs[i] += (dx/d) * enemy_speed * dt. en_ys[i] += (dy/d) * enemy_speed * dt. else: en_wp[i] += 1.0. If int(en_wp[i]) >= 6: en_hp[i] = 0.0. lives -= 1. Towers fire: for t in range(0, len(tow_xs)): tow_timers[t] -= dt. If tow_timers[t] <= 0.0: find nearest alive enemy within 150: let best: Int = -1. let best_d: Float = 151.0. For i: if en_hp[i] > 0.0: let td: Float = sqrt((tow_xs[t]-en_xs[i])*(tow_xs[t]-en_xs[i]) + (tow_ys[t]-en_ys[i])*(tow_ys[t]-en_ys[i])). If td < best_d: best_d = td. best = i. If best >= 0: tow_timers[t] = 1.0. proj_xs = proj_xs + [tow_xs[t]]. proj_ys = proj_ys + [tow_ys[t]]. proj_txs = proj_txs + [en_xs[best]]. proj_tys = proj_tys + [en_ys[best]]. proj_alive = proj_alive + [1.0]. Move projectiles toward target at 300 px/s; on arrival (dist < 10) check all enemies within 10 and reduce hp by 1. In fn mousepressed, if len(tow_xs) < 5: place tower. In fn draw(): draw path (for i in range(0, 5): draw line from waypoint i to i+1 using 20 dots). Draw enemies as circles radius 8 if hp > 0. Draw towers as 20x20 rects. Draw projectiles as 4x4 rects if alive. draw_text(\"Lives: \" + str(lives) + \" Score: \" + str(score), 10.0, 10.0). draw_text(\"Click to place tower (\" + str(len(tow_xs)) + \"/5)\", 10.0, 30.0).",
    expectedBehaviors: [
      "Enemies follow waypoint path",
      "Up to 5 towers placed by clicking",
      "Towers fire at nearest enemy in range",
      "Projectiles travel to target and deal damage",
      "Enemies have HP, destroyed by projectiles",
      "Lives decrease when enemies reach path end",
    ],
  },

  {
    id: "spring_physics",
    name: "Spring Physics",
    difficulty: "hard",
    description:
      "Write a Vibe program simulating 5 masses connected by springs. Store: let mass_xs: List[Float] = [], mass_ys: List[Float] = [], mass_vxs: List[Float] = [], mass_vys: List[Float] = []. Initialize in fn load(): for i in range(0, 5): mass_xs = mass_xs + [200.0 + float(i) * 100.0]. mass_ys = mass_ys + [300.0]. mass_vxs = mass_vxs + [0.0]. mass_vys = mass_vys + [0.0]. Mass 0 is anchored, controlled by arrows at 200 px/s. Use let rest_length: Float = 100.0, let spring_k: Float = 150.0, let damping: Float = 0.95. In fn update(dt: Float): move mass 0 with key_down. mass_vxs[0] = 0.0. mass_vys[0] = 0.0. For each spring (for i in range(0, 4)): let dx: Float = mass_xs[i + 1] - mass_xs[i]. let dy: Float = mass_ys[i + 1] - mass_ys[i]. let dist: Float = sqrt(dx * dx + dy * dy). If dist > 0.1: let force: Float = (dist - rest_length) * spring_k. let fx: Float = (dx / dist) * force. let fy: Float = (dy / dist) * force. If i > 0: mass_vxs[i] += fx * dt. mass_vys[i] += fy * dt. mass_vxs[i + 1] -= fx * dt. mass_vys[i + 1] -= fy * dt. For i in range(1, 5): mass_vys[i] += 200.0 * dt. mass_xs[i] += mass_vxs[i] * dt. mass_ys[i] += mass_vys[i] * dt. mass_vxs[i] = mass_vxs[i] * damping. mass_vys[i] = mass_vys[i] * damping. In fn draw(): for i in range(0, 5): draw_circle(mass_xs[i], mass_ys[i], 10.0). For i in range(0, 4): for j in range(0, 8): let lt: Float = float(j) / 8.0. draw_circle(mass_xs[i] + (mass_xs[i+1] - mass_xs[i]) * lt, mass_ys[i] + (mass_ys[i+1] - mass_ys[i]) * lt, 2.0). draw_text(\"Arrows move anchor\", 10.0, 10.0).",
    expectedBehaviors: [
      "5 masses connected by springs",
      "First mass controlled by arrow keys",
      "Spring force from displacement",
      "Gravity affects non-anchored masses",
      "Velocity damping prevents infinite oscillation",
      "Spring connections visualized between masses",
    ],
  },

  {
    id: "pathfinding_viz",
    name: "Pathfinding Visualization",
    difficulty: "hard",
    description:
      "Write a Vibe program visualizing BFS on a 16x12 grid. Cell size 50x50. Use let grid: List[Float] = [] (0.0=open, 1.0=wall, 2.0=visited, 3.0=path). Initialize in fn load(): for i in range(0, 192): grid = grid + [0.0]. grid[0] = 4.0 (start). grid[191] = 5.0 (end). BFS state: let queue: List[Float] = [], let q_ptr: Int = 0, let parent: List[Float] = [], let bfs_running: Bool = false, let found: Bool = false. Init parent in load: for i in range(0, 192): parent = parent + [-1.0]. In fn mousepressed(mx, my, button): let col: Int = int(mx / 50.0). let row: Int = int(my / 50.0). If col >= 0 and col < 16 and row >= 0 and row < 12: let idx: Int = row * 16 + col. If idx != 0 and idx != 191: if grid[idx] == 0.0: grid[idx] = 1.0. else if grid[idx] == 1.0: grid[idx] = 0.0. In fn keypressed(k): if k == \"space\" and not bfs_running: reset visited/path to 0 (except walls/start/end). For i in range(0, 192): if grid[i] == 2.0 or grid[i] == 3.0: grid[i] = 0.0. parent[i] = -1.0. queue = [0.0]. q_ptr = 0. bfs_running = true. found = false. In fn update(dt): if bfs_running and q_ptr < len(queue): let cur: Int = int(queue[q_ptr]). q_ptr += 1. If cur == 191: bfs_running = false. found = true. Trace path: let p: Int = 191. For iter in range(0, 192): if int(parent[p]) <= 0: break. p = int(parent[p]). if p != 0: grid[p] = 3.0. else: if grid[cur] != 4.0: grid[cur] = 2.0. Check 4 neighbors (up/down/left/right): for each valid neighbor n: if (grid[n] == 0.0 or grid[n] == 5.0) and parent[n] == -1.0: parent[n] = float(cur). queue = queue + [float(n)]. If q_ptr >= len(queue) and not found: bfs_running = false. In fn draw(): for row in range(0, 12): for col in range(0, 16): let idx: Int = row * 16 + col. let x: Float = float(col) * 50.0. let y: Float = float(row) * 50.0. if grid[idx] == 1.0: draw_rect(x, y, 50.0, 50.0). if grid[idx] == 2.0: draw_rect(x + 15.0, y + 15.0, 20.0, 20.0). if grid[idx] == 3.0: draw_rect(x + 5.0, y + 5.0, 40.0, 40.0). if grid[idx] == 4.0: draw_circle(x + 25.0, y + 25.0, 15.0). if grid[idx] == 5.0: draw_circle(x + 25.0, y + 25.0, 15.0). draw_text(\"Click: walls | Space: BFS\", 10.0, 10.0). If found: draw_text(\"Path found!\", 300.0, 10.0). If not bfs_running and not found and q_ptr > 0: draw_text(\"No path\", 300.0, 10.0).",
    expectedBehaviors: [
      "16x12 grid with clickable walls",
      "BFS search animated one cell per frame",
      "Visited cells visually marked",
      "Path traced back from end to start",
      "Start and end points marked distinctly",
      "Status text shows search progress",
    ],
  },

  {
    id: "pendulum_simulation",
    name: "Pendulum Simulation",
    difficulty: "hard",
    description:
      "Write a Vibe program simulating a simple pendulum. The pivot is at (400.0, 100.0). Use let angle: Float = 1.0 (radians, starting offset), let angular_vel: Float = 0.0, let length: Float = 250.0, let gravity: Float = 9.8. In fn update(dt: Float), compute angular acceleration: let angular_acc: Float = (0.0 - gravity / length) * sin(angle). Update angular_vel: angular_vel += angular_acc * dt. Apply damping: angular_vel = angular_vel * 0.999. Update angle: angle += angular_vel * dt. In fn draw(), compute bob position: let bob_x: Float = 400.0 + sin(angle) * length, let bob_y: Float = 100.0 + cos(angle) * length. Draw pivot as a small circle: draw_circle(400.0, 100.0, 5.0). Draw the rod as a series of small rects from pivot to bob: for i in range(0, 20): let t: Float = float(i) / 20.0. let rx: Float = 400.0 + sin(angle) * length * t. let ry: Float = 100.0 + cos(angle) * length * t. draw_rect(rx, ry, 2.0, 2.0). Draw bob: draw_circle(bob_x, bob_y, 15.0). Display \"Angle: \" + str(angle) at (10.0, 10.0). Display \"Click to push\" at (10.0, 30.0). In fn mousepressed(mx: Float, my: Float, button: Int), add 0.5 to angular_vel.",
    expectedBehaviors: [
      "Pendulum swings from pivot at (400, 100)",
      "Angular acceleration from gravity",
      "Damping gradually slows motion",
      "Rod drawn from pivot to bob",
      "Click adds angular velocity",
      "Angle displayed as text",
    ],
  },

  {
    id: "particle_gravity_well",
    name: "Particle Gravity Well",
    difficulty: "hard",
    description:
      "Write a Vibe program with a gravity well that attracts 50 particles. Store particles in parallel Lists: px, py, pvx, pvy (all List[Float]). Initialize in fn load(): for i in range(0, 50), set random positions (rand_float(0.0, 800.0) for x, rand_float(0.0, 600.0) for y) and random velocities (rand_float(-30.0, 30.0) for vx and vy). The gravity well is at the mouse click position: let well_x: Float = 400.0, let well_y: Float = 300.0, let well_strength: Float = 5000.0. In fn mousepressed(mx: Float, my: Float, button: Int), set well_x = mx and well_y = my. In fn update(dt: Float), for each particle i in range(0, 50): compute dx = well_x - px[i], dy = well_y - py[i], dist = sqrt(dx * dx + dy * dy). If dist > 5.0: let force: Float = well_strength / (dist * dist). pvx[i] += dx / dist * force * dt. pvy[i] += dy / dist * force * dt. Update positions: px[i] += pvx[i] * dt, py[i] += pvy[i] * dt. Wrap around edges: if px[i] < 0.0 set px[i] = 800.0, if px[i] > 800.0 set px[i] = 0.0, same for py[i] with 600.0. In fn draw(): draw well as circle: draw_circle(well_x, well_y, 8.0). Draw each particle as a 3x3 rect. Display \"Particles: 50\" at (10.0, 10.0). Display \"Click to move well\" at (10.0, 30.0).",
    expectedBehaviors: [
      "50 particles with random initial positions and velocities",
      "Gravity well attracts particles with inverse-square law",
      "Click repositions the gravity well",
      "Particles wrap around screen edges",
      "Particles orbit and spiral around the well",
      "Well visualized as circle at click position",
    ],
  },
];
