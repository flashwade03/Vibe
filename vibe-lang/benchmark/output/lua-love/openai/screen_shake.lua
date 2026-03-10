use vibe::*;

struct Game {
    shake_x: Float,
    shake_y: Float,
    shake_timer: Float,
    shake_intensity: Float,
}

impl Game {
    fn new() -> Self {
        Self {
            shake_x: 0.0,
            shake_y: 0.0,
            shake_timer: 0.0,
            shake_intensity: 0.0,
        }
    }
}

impl State for Game {
    fn keypressed(&mut self, k: String) {
        if k == "space" {
            self.shake_timer = 0.5;
            self.shake_intensity = 15.0;
        }
    }

    fn update(&mut self, dt: Float) {
        if self.shake_timer > 0.0 {
            self.shake_timer -= dt;
            self.shake_x = rand_float(-self.shake_intensity, self.shake_intensity);
            self.shake_y = rand_float(-self.shake_intensity, self.shake_intensity);
            self.shake_intensity -= 20.0 * dt;
        } else {
            self.shake_x = 0.0;
            self.shake_y = 0.0;
        }
    }

    fn draw(&mut self) {
        draw_rect(368.0 + self.shake_x, 268.0 + self.shake_y, 64.0, 64.0);
        draw_rect(50.0 + self.shake_x, 50.0 + self.shake_y, 16.0, 16.0);
        draw_rect(734.0 + self.shake_x, 50.0 + self.shake_y, 16.0, 16.0);
        draw_rect(50.0 + self.shake_x, 534.0 + self.shake_y, 16.0, 16.0);
        draw_rect(734.0 + self.shake_x, 534.0 + self.shake_y, 16.0, 16.0);
        draw_text("Press SPACE to shake", 280.0 + self.shake_x, 550.0 + self.shake_y);
    }
}

fn main() {
    run::<Game>("Screen Shake Effect", 800, 600);
}