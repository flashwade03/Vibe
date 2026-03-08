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
];
