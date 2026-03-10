use vibe::*;

struct Game {
    last_key: String,
    key_count: Int,
}

impl Game {
    fn new() -> Self {
        Game {
            last_key: "none".to_string(),
            key_count: 0,
        }
    }
}

impl Vibe for Game {
    fn keypressed(&mut self, k: String) {
        self.last_key = k;
        self.key_count += 1;
    }

    fn draw(&self) {
        draw_text(&format!("Last Key: {}", self.last_key), 250.0, 250.0);
        draw_text(&format!("Total Presses: {}", self.key_count), 250.0, 290.0);
        
        draw_rectangle(300.0, 350.0, 200.0, 80.0);
        draw_text(&self.last_key, 370.0, 380.0);
    }
}

fn main() {
    let game = Game::new();
    run(game);
}