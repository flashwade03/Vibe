import { Task } from "./types.js";

export const tasks: Task[] = [
  // ══════════════════════════════════════════════════════════════
  // EASY (5) — Guided: function signatures, variable names given
  // All LLMs should pass these. Baseline validation.
  // ══════════════════════════════════════════════════════════════

  {
    id: "move_rectangle",
    name: "Moving Rectangle",
    difficulty: "easy",
    description:
      "Write a Vibe program that displays a 32x32 white rectangle at the center of an 800x600 window. Use let x: Float = 400.0 and let y: Float = 300.0 for position, and let speed: Float = 200.0 for movement speed. In fn update(dt: Float), check arrow keys using key_down and move the rectangle accordingly, multiplying speed by dt. In fn draw(), draw the rectangle at (x, y) with size 32x32.",
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
      "Write a Vibe program with a ball (circle, radius 16) that starts at (400, 300) moving diagonally at 150 pixels per second in both x and y. When the ball hits any edge of the 800x600 window, it bounces by reversing that velocity component. Use let bx, by for position and let vx, vy for velocity. Draw the ball each frame.",
    expectedBehaviors: [
      "A circle with radius 16 is drawn",
      "Ball starts at (400, 300) moving diagonally",
      "Ball bounces off all 4 window edges",
      "Movement is frame-independent (uses dt)",
    ],
  },

  {
    id: "score_counter",
    name: "Score Counter",
    difficulty: "easy",
    description:
      "Write a Vibe program that displays a score starting at 0 in the top-left corner at (10, 10). Each time the spacebar is pressed, the score increments by 1. Display the score as text showing \"Score: \" followed by the current score value.",
    expectedBehaviors: [
      "Score starts at 0",
      "Score text displayed at (10, 10)",
      "Pressing spacebar increments score by 1",
      "Score is displayed as text",
    ],
  },

  {
    id: "mouse_follower",
    name: "Mouse Follower",
    difficulty: "easy",
    description:
      "Write a Vibe program where a circle smoothly follows the last clicked mouse position. The circle starts at (400, 300). When the mouse is clicked, the target position updates. Each frame, the circle interpolates toward the target at a rate of 3.0 per second. Draw the circle with radius 20 and a small marker (radius 4) at the target. Display \"Click to move\" at (10, 10).",
    expectedBehaviors: [
      "Circle starts at center (400, 300)",
      "Clicking sets a new target position",
      "Circle smoothly interpolates toward target",
      "Small marker drawn at target position",
    ],
  },

  {
    id: "simple_animation",
    name: "Simple Animation",
    difficulty: "easy",
    description:
      "Write a Vibe program that cycles through 4 animation frames, drawing a pulsing rectangle at the center. Each frame lasts 0.25 seconds. Frame 0: 40x40 rect, Frame 1: 50x50, Frame 2: 60x60, Frame 3: 50x50. Keep the rectangle centered. Display the current frame number at (10, 10).",
    expectedBehaviors: [
      "4 animation frames cycle in sequence",
      "Each frame lasts 0.25 seconds",
      "Rectangle changes size creating pulse effect",
      "Frame counter displayed at (10, 10)",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // MEDIUM (9) — Semi-guided: game mechanics described,
  // variable names and formulas decided by LLM
  // ══════════════════════════════════════════════════════════════

  {
    id: "enemy_follow",
    name: "Enemy Follow",
    difficulty: "medium",
    description:
      "Write a Vibe program with two rectangles: a player (32x32) controlled by arrow keys at 200 px/s, and an enemy (32x32) that follows the player at 100 px/s. The enemy should move toward the player each frame by computing and normalizing the direction vector. Player starts at (400, 300), enemy starts at (100, 100). Draw both rectangles.",
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
      "Write a Vibe program with a player rectangle at the bottom center that moves left/right at 200 px/s. Pressing spacebar shoots a bullet upward at 300 px/s. Store active bullets in Lists. Draw the player as a 32x32 rectangle and each bullet as a 4x4 rectangle. Multiple bullets can exist at the same time.",
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
      "Write a Vibe program with a player circle (radius 20) that moves with arrow keys at 150 px/s. Place 5 static enemy circles (radius 15) at fixed positions across the screen. Each frame, check if the player overlaps any enemy using circle-circle distance. If overlapping, display \"Hit!\" at (10, 10). Reset the collision flag each frame.",
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
      "Write a Vibe program with a 32x32 player rectangle that has gravity and jumping. The player starts near the bottom of the screen, moves left/right at 200 px/s, and can jump by pressing the up arrow. Gravity is 500 px/s^2. Jump velocity is -300. The player can only jump when on the ground. The ground is at y=550.",
    expectedBehaviors: [
      "Player (32x32) starts near bottom",
      "Left/right arrow keys move at 200 px/s",
      "Gravity of 500 px/s^2 pulls player down",
      "Pressing up arrow makes player jump",
      "Player lands on ground at y=550",
      "Can only jump when on ground",
    ],
  },

  {
    id: "countdown_timer",
    name: "Countdown Timer",
    difficulty: "medium",
    description:
      "Write a Vibe program that shows a countdown timer starting at 30 seconds. Each frame, subtract dt from the timer but don't let it go below 0. Display the remaining time as an integer near the center. When the timer reaches 0, display \"Time Up!\" instead of the number.",
    expectedBehaviors: [
      "Timer starts at 30 seconds",
      "Timer counts down each frame using dt",
      "Remaining time displayed as text near center",
      "Timer does not go below 0",
      "'Time Up!' displayed when timer reaches 0",
    ],
  },

  {
    id: "health_bar",
    name: "Health Bar",
    difficulty: "medium",
    description:
      "Write a Vibe program with a visual health bar. Health starts at 100 out of 100 max. Pressing space deals 15 damage. Health regenerates at 5 HP per second, capped at max. Draw a background bar and a filled bar whose width is proportional to current health. Display the current HP as text below the bar. Draw a player rectangle at center.",
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
    id: "waypoint_patrol",
    name: "Waypoint Patrol",
    difficulty: "medium",
    description:
      "Write a Vibe program where an enemy patrols between 4 waypoints in a rectangular path: (100,100), (700,100), (700,500), (100,500). The enemy moves toward the current waypoint at 120 px/s. When it gets close enough, it advances to the next waypoint, looping back to the first. Draw the enemy and all waypoints. Display the current waypoint index.",
    expectedBehaviors: [
      "Enemy patrols between 4 waypoints in a loop",
      "Moves toward current waypoint at 120 px/s",
      "Advances to next waypoint when close enough",
      "Patrol loops from last back to first waypoint",
      "Waypoint markers drawn",
      "Current waypoint index displayed",
    ],
  },

  {
    id: "asteroid_field",
    name: "Asteroid Field",
    difficulty: "medium",
    description:
      "Write a Vibe program where asteroids scroll from right to left and the player must dodge them. Player is a rectangle on the left side, moves up/down at 250 px/s. Asteroids spawn from the right edge every 0.4 seconds at random y positions with random sizes. Detect collision between player and asteroids. Track and display a survival score that increases over time. Show \"GAME OVER\" on collision.",
    expectedBehaviors: [
      "Player moves up/down on left side",
      "Asteroids spawn from right every 0.4s",
      "Asteroids scroll left at 200 px/s",
      "Random y position and size per asteroid",
      "Collision detection with player",
      "Score increments over time until game over",
    ],
  },

  {
    id: "grid_highlight",
    name: "Grid Highlight",
    difficulty: "medium",
    description:
      "Write a Vibe program with an 8x6 grid where clicking toggles cells on and off. Each cell is 80x80 pixels. When a cell is active, draw a filled inner rectangle. Count and display the number of active cells at the top-left. Clicks outside the grid should be ignored.",
    expectedBehaviors: [
      "8x6 grid of 80x80 cells drawn",
      "Clicking toggles a cell on or off",
      "Grid position calculated from mouse coordinates",
      "Active cells have filled inner rectangle",
      "Active cell count displayed at top-left",
      "Clicks outside grid are ignored",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // HARD (8) — Natural language: describe the game feature,
  // minimal implementation detail
  // ══════════════════════════════════════════════════════════════

  {
    id: "state_machine_game",
    name: "State Machine Game",
    difficulty: "hard",
    description:
      "Write a Vibe program implementing a 3-state game: menu, playing, and game over. In the menu, show a start prompt. In playing, a target appears at a random position — clicking it scores a point and moves it. A 10-second timer counts down. When time runs out, show the final score and a restart option. Space transitions between states.",
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
      "Write a Vibe program simulating snake movement on a grid. The snake has 3 segments initially, moves every 0.15 seconds in the current direction. Arrow keys change direction but you cannot reverse. Body segments follow the head. Positions wrap around the 800x600 screen. Draw each segment as a small rectangle.",
    expectedBehaviors: [
      "Snake body with 3 initial segments",
      "Grid-based movement every 0.15 seconds",
      "Arrow key direction control",
      "Cannot reverse direction",
      "Body segments follow the head",
      "Screen wrapping",
    ],
  },

  {
    id: "breakout_game",
    name: "Breakout Game",
    difficulty: "hard",
    description:
      "Write a Vibe program for a simplified Breakout game. A paddle at the bottom moves left/right. A ball bounces off walls, the paddle, and a row of 8 bricks at the top. Hitting a brick destroys it and increments the score. If the ball falls below the screen, the game is over. Display the score.",
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
    id: "space_invaders",
    name: "Space Invaders",
    difficulty: "hard",
    description:
      "Write a Vibe program implementing simplified Space Invaders. A grid of enemies (6 columns, 3 rows) moves horizontally across the screen, reversing direction and descending when any enemy reaches an edge. The player at the bottom shoots bullets upward with space. Bullets that hit enemies destroy them. Score is tracked. Display a win message when all enemies are destroyed.",
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
    id: "cellular_automata",
    name: "Cellular Automata",
    difficulty: "hard",
    description:
      "Write a Vibe program implementing Conway's Game of Life on a 20x15 grid. Initialize cells randomly at about 30% density. Each generation updates every 0.2 seconds using standard rules: a live cell survives with 2 or 3 neighbors, a dead cell is born with exactly 3 neighbors. Space toggles pause. Display the generation count.",
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
    id: "tower_defense_path",
    name: "Tower Defense",
    difficulty: "hard",
    description:
      "Write a Vibe program with a tower defense game. Enemies spawn periodically and follow a fixed waypoint path across the screen. Clicking places a tower (up to 5). Towers automatically fire projectiles at the nearest enemy in range. Enemies have HP and die when it reaches 0. The player loses a life when an enemy reaches the end. Display lives and score.",
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
    id: "bullet_hell_pattern",
    name: "Bullet Hell Pattern",
    difficulty: "hard",
    description:
      "Write a Vibe program creating spiral bullet patterns from a central emitter at the top of the screen. The emitter rotates and fires 3 bullets at 120-degree intervals in a spiral pattern. The player circle at the bottom moves left/right to dodge. Collision with any bullet ends the game. Display the active bullet count.",
    expectedBehaviors: [
      "Spiral bullet pattern from central emitter",
      "3 bullets at 120-degree intervals per spawn",
      "Rotating angle creates spiral effect",
      "Player dodges at bottom of screen",
      "Collision detection ends game",
      "Active bullet count displayed",
    ],
  },

  {
    id: "pathfinding_viz",
    name: "Pathfinding Visualization",
    difficulty: "hard",
    description:
      "Write a Vibe program visualizing BFS pathfinding on a 16x12 grid. Click to place or remove walls. Press space to run BFS from the top-left cell to the bottom-right cell. Animate the search one cell per frame, visually marking visited cells. When the end is found, trace and display the shortest path. Show status text for search progress.",
    expectedBehaviors: [
      "16x12 grid with clickable walls",
      "BFS search animated one cell per frame",
      "Visited cells visually marked",
      "Path traced back from end to start",
      "Start and end points marked distinctly",
      "Status text shows search progress",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // TRAP (8) — Designed to trigger Training Data Gravity.
  // Natural language descriptions that induce LLMs to use
  // patterns from Python/Lua/JS instead of Vibe syntax.
  // ══════════════════════════════════════════════════════════════

  {
    id: "debug_hud",
    name: "Debug HUD",
    difficulty: "trap",
    description:
      "Write a Vibe program with a player rectangle that moves with arrow keys. Implement a comprehensive debug HUD overlay showing 6 lines of information: the player's x position, y position, current speed, a frame counter that increments each update, whether the player is currently moving (as a boolean value true or false), and the elapsed time in seconds. Each line should display a label followed by the numeric or boolean value. The player should be a 32x32 rectangle starting at center, speed 200 px/s.",
    expectedBehaviors: [
      "Player rectangle moves with arrow keys at 200 px/s",
      "6 lines of debug info displayed",
      "Position x, y shown as text with labels",
      "Frame counter increments each update",
      "Moving status shown as boolean",
      "Elapsed time in seconds displayed",
    ],
  },

  {
    id: "game_state_manager",
    name: "Game State Manager",
    difficulty: "trap",
    description:
      "Write a Vibe program that manages 4 game states: menu, playing, paused, and game over. In the menu state, pressing space starts the game. In the playing state, a ball bounces around and the player presses space to pause. In paused state, space resumes. The game ends when the ball bounces more than 50 times — transition to game over and display the final bounce count. In game over, space returns to menu. Each state should have its own draw logic with distinct text labels. Define separate functions for updating and drawing each state.",
    expectedBehaviors: [
      "4 distinct game states with transitions",
      "Space key handles all state transitions",
      "Ball bounces in playing state",
      "Pause freezes ball movement",
      "Game over after 50 bounces",
      "Multiple functions defined for state logic",
    ],
  },

  {
    id: "combat_system",
    name: "Combat System",
    difficulty: "trap",
    description:
      "Write a Vibe program simulating a turn-based combat system. The player and an enemy each have HP, attack power, and a defense stat. Define a function that calculates damage: damage equals attacker's power minus defender's defense, minimum 1. Define another function that checks whether a combatant is defeated (HP at or below zero) and returns the result. Each time space is pressed, both sides attack simultaneously. Display both HP bars, damage dealt, and show \"Victory!\" or \"Defeat!\" when one side falls. The player has 100 HP, 20 attack, 5 defense. The enemy has 80 HP, 15 attack, 8 defense.",
    expectedBehaviors: [
      "Player and enemy with HP, attack, defense stats",
      "Damage calculation function with minimum 1",
      "Defeat check function with return value",
      "Space triggers simultaneous attacks",
      "Both HP bars displayed",
      "Victory or defeat message on combat end",
    ],
  },

  {
    id: "enemy_wave_loop",
    name: "Enemy Wave Loop",
    difficulty: "trap",
    description:
      "Write a Vibe program with a wave-based survival game. Enemies spawn in waves. While enemies remain alive in the current wave, the wave continues — no new wave spawns until all current enemies are eliminated. The player circle at center shoots toward the mouse click position. Enemies move toward the player. When all enemies in a wave are dead, the next wave starts with more enemies. Track and display the current wave number and remaining enemies. Continue running waves as long as the player is alive.",
    expectedBehaviors: [
      "Wave-based enemy spawning",
      "Current wave continues while enemies remain",
      "Player shoots toward click position",
      "Enemies move toward player",
      "Next wave starts when all enemies eliminated",
      "Wave number and remaining count displayed",
    ],
  },

  {
    id: "tic_tac_toe",
    name: "Tic Tac Toe",
    difficulty: "trap",
    description:
      "Write a Vibe program implementing a 2-player tic-tac-toe game. Draw a 3x3 grid. Players alternate turns clicking to place X or O marks. After each move, check all win conditions: three in a row horizontally, vertically, or diagonally. A player wins if all three cells in any line match and are not empty. If all 9 cells are filled with no winner, it's a draw. Display whose turn it is, and show the result when the game ends. Space resets the game.",
    expectedBehaviors: [
      "3x3 grid drawn on screen",
      "Click places X or O alternating turns",
      "Win detection for rows, columns, diagonals",
      "Draw detection when board is full",
      "Current turn displayed",
      "Space resets the game",
    ],
  },

  {
    id: "rpg_battle",
    name: "RPG Battle",
    difficulty: "trap",
    description:
      "Write a Vibe program with a turn-based RPG battle screen. The player has 3 actions: Attack (key 1), Heal (key 2), and Power Strike (key 3, costs 30 MP). Define separate functions: one to calculate attack damage (base attack plus a random bonus from 0 to 10), one to apply healing (restores 20 HP, capped at max), and one to check if a combatant is defeated and return the result. The player has 120 HP, 120 max HP, 50 MP, 18 attack. The enemy has 100 HP, 14 attack. After the player acts, the enemy counter-attacks automatically. Display both sides' HP and the player's MP. Show action results as text. Display victory or defeat when one side falls.",
    expectedBehaviors: [
      "3 player actions: attack, heal, power strike",
      "Multiple functions with return values",
      "MP cost system for power strike",
      "Healing capped at max HP",
      "Enemy counter-attacks after player action",
      "HP, MP, and action results displayed",
    ],
  },

  {
    id: "particle_emitter_system",
    name: "Particle Emitter System",
    difficulty: "trap",
    description:
      "Write a Vibe program with a particle emitter system. Clicking creates a new emitter at the click position. Each emitter continuously spawns particles that fly outward in random directions at random speeds between 50 and 200 px/s. Particles have a 2-second lifetime. While a particle is alive, update its position and decrease its life. Skip dead particles during rendering. Each emitter spawns a new particle every 0.1 seconds. Track the total alive particle count across all emitters and display it. Draw each live particle as a small rectangle.",
    expectedBehaviors: [
      "Clicking creates emitter at mouse position",
      "Emitters continuously spawn particles",
      "Particles move outward in random directions",
      "2-second particle lifetime",
      "Dead particles skipped during render",
      "Total alive particle count displayed",
    ],
  },

  {
    id: "highscore_table",
    name: "Highscore Table",
    difficulty: "trap",
    description:
      "Write a Vibe program that maintains a top-5 highscore table. The game is simple: a target appears at a random position, clicking it adds 10 points and moves the target. A 15-second timer counts down. When time runs out, check if the score qualifies for the top 5. If so, insert it at the correct position and shift lower scores down, keeping only 5 entries. Display the highscore table showing rank, score for each entry. Initialize with default scores of 50, 40, 30, 20, 10. Space starts a new round. Format each line as the rank number followed by the score value.",
    expectedBehaviors: [
      "Click-to-score gameplay with 15s timer",
      "Top 5 scores maintained in sorted order",
      "New score inserted at correct position",
      "Lower scores shifted down",
      "Highscore table displayed with rank and score",
      "Space starts a new round",
    ],
  },
];
