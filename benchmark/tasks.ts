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
];
