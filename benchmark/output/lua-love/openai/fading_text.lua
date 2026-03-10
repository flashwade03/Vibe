use vibe::*;

struct Game {
    timer: Float,
}

impl Game {
    fn new() -> Self {
        Self { timer: 0.0 }
    }
}

impl State for Game {
    fn update(&mut self, dt: Float) {
        self.timer += dt;
    }

    fn draw(&self) {
        let vis = (self.timer * 2.0).sin();
        if vis > 0.0 {
            draw_text("Hello Vibe!", 300.0, 280.0);
        }
        draw_text(&format!("Time: {}", self.timer as i32), 10.0, 10.0);
    }
}

fn main() {
    run::<Game>("Vibe Blinking Text", 800, 600);
}