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
      "Write a program that displays a 32x32 white rectangle at the center of an 800x600 window. Use let x: Float = 400.0 and let y: Float = 300.0 for position, and let speed: Float = 200.0 for movement speed. In fn update(dt: Float), check arrow keys using key_down and move the rectangle accordingly, multiplying speed by dt. In fn draw(), draw the rectangle at (x, y) with size 32x32.",
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
      "Write a program with a ball (circle, radius 16) that starts at (400, 300) moving diagonally at 150 pixels per second in both x and y. When the ball hits any edge of the 800x600 window, it bounces by reversing that velocity component. Use let bx, by for position and let vx, vy for velocity. Draw the ball each frame.",
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
      "Write a program that displays a score starting at 0 in the top-left corner at (10, 10). Each time the spacebar is pressed, the score increments by 1. Display the score as text showing \"Score: \" followed by the current score value.",
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
      "Write a program where a circle smoothly follows the last clicked mouse position. The circle starts at (400, 300). When the mouse is clicked, the target position updates. Each frame, the circle interpolates toward the target at a rate of 3.0 per second. Draw the circle with radius 20 and a small marker (radius 4) at the target. Display \"Click to move\" at (10, 10).",
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
      "Write a program that cycles through 4 animation frames, drawing a pulsing rectangle at the center. Each frame lasts 0.25 seconds. Frame 0: 40x40 rect, Frame 1: 50x50, Frame 2: 60x60, Frame 3: 50x50. Keep the rectangle centered. Display the current frame number at (10, 10).",
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
      "Write a program with two rectangles: a player (32x32) controlled by arrow keys at 200 px/s, and an enemy (32x32) that follows the player at 100 px/s. The enemy should move toward the player each frame by computing and normalizing the direction vector. Player starts at (400, 300), enemy starts at (100, 100). Draw both rectangles.",
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
      "Write a program with a player rectangle at the bottom center that moves left/right at 200 px/s. Pressing spacebar shoots a bullet upward at 300 px/s. Store active bullets in Lists. Draw the player as a 32x32 rectangle and each bullet as a 4x4 rectangle. Multiple bullets can exist at the same time.",
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
      "Write a program with a player circle (radius 20) that moves with arrow keys at 150 px/s. Place 5 static enemy circles (radius 15) at fixed positions across the screen. Each frame, check if the player overlaps any enemy using circle-circle distance. If overlapping, display \"Hit!\" at (10, 10). Reset the collision flag each frame.",
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
      "Write a program with a 32x32 player rectangle that has gravity and jumping. The player starts near the bottom of the screen, moves left/right at 200 px/s, and can jump by pressing the up arrow. Gravity is 500 px/s^2. Jump velocity is -300. The player can only jump when on the ground. The ground is at y=550.",
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
      "Write a program that shows a countdown timer starting at 30 seconds. Each frame, subtract dt from the timer but don't let it go below 0. Display the remaining time as an integer near the center. When the timer reaches 0, display \"Time Up!\" instead of the number.",
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
      "Write a program with a visual health bar. Health starts at 100 out of 100 max. Pressing space deals 15 damage. Health regenerates at 5 HP per second, capped at max. Draw a background bar and a filled bar whose width is proportional to current health. Display the current HP as text below the bar. Draw a player rectangle at center.",
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
      "Write a program where an enemy patrols between 4 waypoints in a rectangular path: (100,100), (700,100), (700,500), (100,500). The enemy moves toward the current waypoint at 120 px/s. When it gets close enough, it advances to the next waypoint, looping back to the first. Draw the enemy and all waypoints. Display the current waypoint index.",
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
      "Write a program where asteroids scroll from right to left and the player must dodge them. Player is a rectangle on the left side, moves up/down at 250 px/s. Asteroids spawn from the right edge every 0.4 seconds at random y positions with random sizes. Detect collision between player and asteroids. Track and display a survival score that increases over time. Show \"GAME OVER\" on collision.",
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
      "Write a program with an 8x6 grid where clicking toggles cells on and off. Each cell is 80x80 pixels. When a cell is active, draw a filled inner rectangle. Count and display the number of active cells at the top-left. Clicks outside the grid should be ignored.",
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
      "Write a program implementing a 3-state game: menu, playing, and game over. In the menu, show a start prompt. In playing, a target appears at a random position — clicking it scores a point and moves it. A 10-second timer counts down. When time runs out, show the final score and a restart option. Space transitions between states.",
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
      "Write a program simulating snake movement on a grid. The snake has 3 segments initially, moves every 0.15 seconds in the current direction. Arrow keys change direction but you cannot reverse. Body segments follow the head. Positions wrap around the 800x600 screen. Draw each segment as a small rectangle.",
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
      "Write a program for a simplified Breakout game. A paddle at the bottom moves left/right. A ball bounces off walls, the paddle, and a row of 8 bricks at the top. Hitting a brick destroys it and increments the score. If the ball falls below the screen, the game is over. Display the score.",
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
      "Write a program implementing simplified Space Invaders. A grid of enemies (6 columns, 3 rows) moves horizontally across the screen, reversing direction and descending when any enemy reaches an edge. The player at the bottom shoots bullets upward with space. Bullets that hit enemies destroy them. Score is tracked. Display a win message when all enemies are destroyed.",
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
      "Write a program implementing Conway's Game of Life on a 20x15 grid. Initialize cells randomly at about 30% density. Each generation updates every 0.2 seconds using standard rules: a live cell survives with 2 or 3 neighbors, a dead cell is born with exactly 3 neighbors. Space toggles pause. Display the generation count.",
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
      "Write a program with a tower defense game. Enemies spawn periodically and follow a fixed waypoint path across the screen. Clicking places a tower (up to 5). Towers automatically fire projectiles at the nearest enemy in range. Enemies have HP and die when it reaches 0. The player loses a life when an enemy reaches the end. Display lives and score.",
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
      "Write a program creating spiral bullet patterns from a central emitter at the top of the screen. The emitter rotates and fires 3 bullets at 120-degree intervals in a spiral pattern. The player circle at the bottom moves left/right to dodge. Collision with any bullet ends the game. Display the active bullet count.",
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
      "Write a program visualizing BFS pathfinding on a 16x12 grid. Click to place or remove walls. Press space to run BFS from the top-left cell to the bottom-right cell. Animate the search one cell per frame, visually marking visited cells. When the end is found, trace and display the shortest path. Show status text for search progress.",
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
      "Write a program with a player rectangle that moves with arrow keys. Implement a comprehensive debug HUD overlay showing 6 lines of information: the player's x position, y position, current speed, a frame counter that increments each update, whether the player is currently moving (as a boolean value true or false), and the elapsed time in seconds. Each line should display a label followed by the numeric or boolean value. The player should be a 32x32 rectangle starting at center, speed 200 px/s.",
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
      "Write a program that manages 4 game states: menu, playing, paused, and game over. In the menu state, pressing space starts the game. In the playing state, a ball bounces around and the player presses space to pause. In paused state, space resumes. The game ends when the ball bounces more than 50 times — transition to game over and display the final bounce count. In game over, space returns to menu. Each state should have its own draw logic with distinct text labels. Define separate functions for updating and drawing each state.",
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
      "Write a program simulating a turn-based combat system. The player and an enemy each have HP, attack power, and a defense stat. Define a function that calculates damage: damage equals attacker's power minus defender's defense, minimum 1. Define another function that checks whether a combatant is defeated (HP at or below zero) and returns the result. Each time space is pressed, both sides attack simultaneously. Display both HP bars, damage dealt, and show \"Victory!\" or \"Defeat!\" when one side falls. The player has 100 HP, 20 attack, 5 defense. The enemy has 80 HP, 15 attack, 8 defense.",
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
      "Write a program with a wave-based survival game. Enemies spawn in waves. While enemies remain alive in the current wave, the wave continues — no new wave spawns until all current enemies are eliminated. The player circle at center shoots toward the mouse click position. Enemies move toward the player. When all enemies in a wave are dead, the next wave starts with more enemies. Track and display the current wave number and remaining enemies. Continue running waves as long as the player is alive.",
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
      "Write a program implementing a 2-player tic-tac-toe game. Draw a 3x3 grid. Players alternate turns clicking to place X or O marks. After each move, check all win conditions: three in a row horizontally, vertically, or diagonally. A player wins if all three cells in any line match and are not empty. If all 9 cells are filled with no winner, it's a draw. Display whose turn it is, and show the result when the game ends. Space resets the game.",
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
      "Write a program with a turn-based RPG battle screen. The player has 3 actions: Attack (key 1), Heal (key 2), and Power Strike (key 3, costs 30 MP). Define separate functions: one to calculate attack damage (base attack plus a random bonus from 0 to 10), one to apply healing (restores 20 HP, capped at max), and one to check if a combatant is defeated and return the result. The player has 120 HP, 120 max HP, 50 MP, 18 attack. The enemy has 100 HP, 14 attack. After the player acts, the enemy counter-attacks automatically. Display both sides' HP and the player's MP. Show action results as text. Display victory or defeat when one side falls.",
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
      "Write a program with a particle emitter system. Clicking creates a new emitter at the click position. Each emitter continuously spawns particles that fly outward in random directions at random speeds between 50 and 200 px/s. Particles have a 2-second lifetime. While a particle is alive, update its position and decrease its life. Skip dead particles during rendering. Each emitter spawns a new particle every 0.1 seconds. Track the total alive particle count across all emitters and display it. Draw each live particle as a small rectangle.",
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
      "Write a program that maintains a top-5 highscore table. The game is simple: a target appears at a random position, clicking it adds 10 points and moves the target. A 15-second timer counts down. When time runs out, check if the score qualifies for the top 5. If so, insert it at the correct position and shift lower scores down, keeping only 5 entries. Display the highscore table showing rank, score for each entry. Initialize with default scores of 50, 40, 30, 20, 10. Space starts a new round. Format each line as the rank number followed by the score value.",
    expectedBehaviors: [
      "Click-to-score gameplay with 15s timer",
      "Top 5 scores maintained in sorted order",
      "New score inserted at correct position",
      "Lower scores shifted down",
      "Highscore table displayed with rank and score",
      "Space starts a new round",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // STRUCT (8) — Tests struct, enum, trait, and has keywords.
  // These tasks require language features beyond the v0 subset
  // (fn/let/const/if/else/return/for) and will expose gaps in
  // parser support for struct/enum/trait declarations.
  // ══════════════════════════════════════════════════════════════

  {
    id: "struct_basic",
    name: "Basic Struct",
    difficulty: "medium",
    description:
      "Write a program that defines a Ball struct with fields x: Float, y: Float, vx: Float, vy: Float. Create a Ball instance starting at (400, 300) with velocity (150, 100). In fn update(dt: Float), move the ball by adding vx*dt to x and vy*dt to y. Bounce the ball off the edges of an 800x600 window by negating the appropriate velocity component. In fn draw(), draw the ball as a circle with radius 16 at its current position.",
    expectedBehaviors: [
      "Ball struct defined with x, y, vx, vy fields",
      "Ball instance created at (400, 300)",
      "Ball moves each frame using velocity * dt",
      "Ball bounces off all 4 window edges",
      "Ball drawn as a circle with radius 16",
      "Movement is frame-independent",
    ],
  },

  {
    id: "struct_methods",
    name: "Struct with Methods",
    difficulty: "medium",
    description:
      "Write a program that defines a Player struct with fields x: Float, y: Float, health: Int. Define a move method for Player that takes dx: Float and dy: Float and updates the position. Define a take_damage method that reduces health by a given amount, clamping at 0. Create a Player at (400, 300) with 100 health. In fn update(dt: Float), read arrow keys and call the move method with speed 200 * dt. Press space to deal 10 damage. In fn draw(), draw the player as a 32x32 rectangle and draw a health bar above it showing current health out of 100.",
    expectedBehaviors: [
      "Player struct with x, y, health fields",
      "move method updates position",
      "take_damage method reduces health, clamped at 0",
      "Arrow keys move player via move method",
      "Space deals 10 damage via take_damage",
      "Health bar drawn above the player",
    ],
  },

  {
    id: "enum_state_machine",
    name: "Enum State Machine",
    difficulty: "hard",
    description:
      "Write a program that defines a GameState enum with variants Menu, Playing, and GameOver. Use a let state variable initialized to GameState.Menu. In fn update(dt: Float), use match on the state to handle transitions: in Menu, pressing space sets state to Playing; in Playing, a 10-second timer counts down and when it reaches 0, state becomes GameOver; in GameOver, pressing space resets the timer and returns to Menu. In fn draw(), use match to draw different screens: Menu shows \"Press SPACE to Start\", Playing shows the countdown timer as text, GameOver shows \"Game Over - Press SPACE\".",
    expectedBehaviors: [
      "GameState enum with Menu, Playing, GameOver variants",
      "match expression used for state transitions",
      "Space transitions from Menu to Playing",
      "10-second countdown timer in Playing state",
      "Timer expiry transitions to GameOver",
      "Different screen drawn per state via match",
    ],
  },

  {
    id: "enum_with_data",
    name: "Enum with Data Variants",
    difficulty: "hard",
    description:
      "Write a program that defines a Particle struct with fields x: Float, y: Float, vx: Float, vy: Float, life: Float. Define a ParticleType enum with data variants: Spark(speed: Float) and Smoke(size: Float). Store a list of particles and their types. Every 0.2 seconds, spawn a Spark particle at (400, 300) with random direction and the speed from the variant, and a Smoke particle at (400, 500) with the size from the variant. In fn update(dt: Float), move each particle by its velocity, decrease life by dt, and remove dead particles. In fn draw(), use match on ParticleType to draw Sparks as small 2x2 rectangles and Smoke as larger rectangles using the size value.",
    expectedBehaviors: [
      "Particle struct with x, y, vx, vy, life fields",
      "ParticleType enum with Spark(speed) and Smoke(size) data variants",
      "Sparks spawned at (400, 300) with random direction",
      "Smoke spawned at (400, 500) with configurable size",
      "Dead particles removed when life reaches 0",
      "match on ParticleType for different draw logic",
    ],
  },

  {
    id: "struct_composition",
    name: "Struct Composition",
    difficulty: "hard",
    description:
      "Write a program that defines a Position struct with x: Float, y: Float fields, a Velocity struct with vx: Float, vy: Float fields, and a Bullet struct that has pos: Position and vel: Velocity fields. Define a Player struct with pos: Position field. Create a player at (400, 550). Store active bullets in a list. In fn update(dt: Float), move the player left/right with arrow keys at 250 px/s. When spacebar is pressed, create a new Bullet with the player's x position and y=540, velocity (0, -400). Move each bullet by its velocity each frame. Remove bullets that go off the top of the screen. In fn draw(), draw the player as a 32x32 rectangle and each bullet as a 4x8 rectangle.",
    expectedBehaviors: [
      "Position struct with x, y fields",
      "Velocity struct with vx, vy fields",
      "Bullet struct composed of Position and Velocity",
      "Spacebar spawns bullet at player position",
      "Bullets move upward at 400 px/s",
      "Off-screen bullets removed from list",
    ],
  },

  {
    id: "trait_drawable",
    name: "Trait Drawable",
    difficulty: "trap",
    description:
      "Write a program that defines a Drawable trait with a single method draw(self_x: Float, self_y: Float). Define a Player struct with x: Float, y: Float, size: Float fields that implements Drawable using \"struct Player has Drawable\". The Player draw method draws a rectangle at (self_x, self_y) with the given size. Define an Enemy struct with x: Float, y: Float, radius: Float fields that also implements Drawable using \"struct Enemy has Drawable\". The Enemy draw method draws a circle at (self_x, self_y) with the given radius. Create one player at (200, 300) with size 32 and 3 enemies at different positions with radius 16. In fn update(dt: Float), move the player with arrow keys at 200 px/s. In fn draw(), call the draw method on the player and all enemies.",
    expectedBehaviors: [
      "Drawable trait defined with draw method",
      "Player struct implements Drawable via has",
      "Enemy struct implements Drawable via has",
      "Player drawn as rectangle using trait method",
      "Enemies drawn as circles using trait method",
      "Player moves with arrow keys at 200 px/s",
    ],
  },

  {
    id: "trait_updatable",
    name: "Trait Updatable and Drawable",
    difficulty: "trap",
    description:
      "Write a program that defines two traits: Updatable with a method update_entity(self_x: Float, self_y: Float, dt: Float) that returns new x and y values, and Drawable with a method draw_entity(self_x: Float, self_y: Float). Define a Player struct with x: Float, y: Float fields using \"struct Player has Updatable, Drawable\". The Player's update_entity reads WASD keys and moves at 200 px/s. The Player's draw_entity draws a 32x32 rectangle. Define an Enemy struct with x: Float, y: Float, target_x: Float, target_y: Float fields using \"struct Enemy has Updatable, Drawable\". The Enemy's update_entity moves toward (target_x, target_y) at 80 px/s. The Enemy's draw_entity draws a circle with radius 16. Create one player at (400, 300) and 3 enemies at random positions that follow the player. In fn update(dt: Float), call update_entity on all entities. In fn draw(), call draw_entity on all entities.",
    expectedBehaviors: [
      "Updatable trait with update_entity method",
      "Drawable trait with draw_entity method",
      "Player struct implements both traits via has",
      "Enemy struct implements both traits via has",
      "Player moves with WASD keys",
      "Enemies follow the player at 80 px/s",
    ],
  },

  {
    id: "struct_list_management",
    name: "Struct List Management",
    difficulty: "hard",
    description:
      "Write a program that defines an Asteroid struct with fields x: Float, y: Float, vx: Float, vy: Float, radius: Float, active: Bool. Maintain a list of asteroids. Every 0.8 seconds, spawn a new asteroid at the top of the screen (y=0) at a random x position between 0 and 800, with a random downward velocity between 50 and 150 px/s, a random horizontal velocity between -30 and 30 px/s, and a random radius between 10 and 30. In fn update(dt: Float), move each asteroid by its velocity. Mark asteroids as inactive when they move below y=650. Remove inactive asteroids from the list. Display the count of active asteroids at (10, 10). In fn draw(), draw each active asteroid as a circle at its position with its radius.",
    expectedBehaviors: [
      "Asteroid struct with position, velocity, radius, active fields",
      "New asteroid spawned every 0.8 seconds",
      "Random x position, velocity, and radius per asteroid",
      "Asteroids move downward each frame",
      "Off-screen asteroids marked inactive and removed",
      "Active asteroid count displayed",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // ANNOTATION (4) — Tests @entity, @component, @scene, @on
  // These tasks use game annotations for entity-component-scene
  // architecture. The engine handles the game loop automatically.
  // ══════════════════════════════════════════════════════════════

  {
    id: "annotation_entity_move",
    name: "Annotation: Moving Entity",
    difficulty: "easy",
    description:
      "Write a program using game annotations. Define a @component struct Position with x: Float = 400.0, y: Float = 300.0. Define a @entity struct Player with pos: Position. Define a @scene struct Game. Use @on(\"enter\") to spawn a Player when the Game scene starts: spawn(\"Player\"). Use @on(\"update\") with a Player parameter to move the player with arrow keys at 200 px/s using key_down. Use @on(\"draw\") with a Player parameter to draw a 32x32 rectangle at the player position. Do NOT define fn update() or fn draw() directly — the annotation system handles the game loop.",
    expectedBehaviors: [
      "@component struct Position defined",
      "@entity struct Player with pos: Position",
      "@scene struct Game defined",
      "Player spawned on scene enter",
      "Arrow keys move player at 200 px/s",
      "Player drawn as 32x32 rectangle",
    ],
  },

  {
    id: "annotation_scene_transition",
    name: "Annotation: Scene Transition",
    difficulty: "medium",
    description:
      "Write a program using game annotations with two scenes. Define a @scene struct Menu with title: String = \"My Game\". Define a @scene struct Playing with score: Int = 0. Use @on(\"draw\") with a Menu parameter to draw the title text at (300, 250) and \"Press SPACE to start\" at (280, 300). Use @on(\"key_pressed\") with a Menu parameter to check if key == \"space\" and call go_to(\"Playing\") to transition. Use @on(\"draw\") with a Playing parameter to draw \"Score: \" + str(scene.score) at (10, 10). Use @on(\"key_pressed\") with a Playing parameter to increment score when space is pressed, and call go_to(\"Menu\") when escape is pressed. Do NOT define fn update() or fn draw() directly.",
    expectedBehaviors: [
      "@scene struct Menu and Playing defined",
      "Menu shows title and start instruction",
      "Space transitions from Menu to Playing",
      "Playing shows score, space increments it",
      "Escape returns to Menu via go_to",
    ],
  },

  {
    id: "annotation_multi_entity",
    name: "Annotation: Multiple Entity Types",
    difficulty: "medium",
    description:
      "Write a program using game annotations with multiple entity types. Define a @component struct Position with x: Float = 0.0, y: Float = 0.0. Define a @entity struct Player with pos: Position, speed: Float = 200.0. Define a @entity struct Coin with pos: Position, value: Int = 10. Define a @scene struct Game with score: Int = 0. Use @on(\"enter\") with Game parameter to spawn one Player and 5 Coins at random positions using rand_float. Use @on(\"update\") with Player parameter to move with arrow keys. Use @on(\"update\") with Coin parameter to check distance to each player from find_all(\"Player\") — if distance < 20, increment the scene score and destroy the coin. Use @on(\"draw\") with Player parameter to draw a blue 16x16 rectangle. Use @on(\"draw\") with Coin parameter to draw a yellow circle with radius 8. Use @on(\"draw\") with Game parameter to draw the score. Do NOT define fn update() or fn draw() directly.",
    expectedBehaviors: [
      "@entity Player and Coin defined",
      "Player and 5 Coins spawned on scene enter",
      "Player moves with arrow keys",
      "Coins collected when player is close",
      "Score incremented on collection",
      "Different draw for Player vs Coin",
    ],
  },

  {
    id: "annotation_spawn_destroy",
    name: "Annotation: Spawn and Destroy",
    difficulty: "hard",
    description:
      "Write a program using game annotations with dynamic entity spawning and destruction. Define a @component struct Position with x: Float = 0.0, y: Float = 0.0. Define a @component struct Velocity with vx: Float = 0.0, vy: Float = 0.0. Define a @entity struct Bullet with pos: Position, vel: Velocity. Define a @entity struct Player with pos: Position. Define a @scene struct Game with spawn_timer: Float = 0.0. Use @on(\"enter\") with Game parameter to spawn a Player at (400, 550). Use @on(\"update\") with Player parameter to move left/right with arrow keys at 250 px/s, clamping x between 0 and 768. Use @on(\"key_pressed\") with Player parameter to spawn a Bullet at the player position with vy = -400.0 when space is pressed. Use @on(\"update\") with Bullet parameter to move by velocity * dt, and destroy the bullet if pos.y < 0. Use @on(\"draw\") with Player parameter to draw a 32x32 rectangle. Use @on(\"draw\") with Bullet parameter to draw a 4x8 rectangle. Use @on(\"draw\") with Game parameter to draw the count of active bullets using len(find_all(\"Bullet\")). Do NOT define fn update() or fn draw() directly.",
    expectedBehaviors: [
      "@entity Player and Bullet defined",
      "Player spawned at (400, 550)",
      "Space spawns bullet at player position",
      "Bullets move upward and destroyed off-screen",
      "Player moves left/right with arrow keys",
      "Active bullet count displayed",
    ],
  },
];
