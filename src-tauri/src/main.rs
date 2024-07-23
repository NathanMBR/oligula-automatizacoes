// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use autopilot::{self, geometry::Point, mouse::Button};
use enigo::{Direction, Enigo, Key, Keyboard, Settings};

#[derive(serde::Serialize, serde::Deserialize)]
pub struct MousePosition {
    x: f64,
    y: f64,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub enum MouseButton {
    Left,
    Middle,
    Right,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct KeyboardCombination {
    hold_ctrl: bool,
    hold_shift: bool,
    hold_alt: bool,
    key_code: u32,
}

#[tauri::command(async)]
fn get_mouse_position() -> MousePosition {
    let mouse_point = autopilot::mouse::location();

    MousePosition {
        x: mouse_point.x,
        y: mouse_point.y,
    }
}

#[tauri::command(async)]
fn check_mouse_position(position: MousePosition) -> bool {
    autopilot::screen::is_point_visible(Point::new(position.x, position.y))
}

#[tauri::command(async)]
fn move_mouse_to(position: MousePosition) -> bool {
    match autopilot::mouse::move_to(Point::new(position.x, position.y)) {
        Ok(_) => true,
        Err(_) => false,
    }
}

#[tauri::command(async)]
fn click(button: MouseButton) {
    autopilot::mouse::click(
        match button {
            MouseButton::Left => Button::Left,
            MouseButton::Middle => Button::Middle,
            MouseButton::Right => Button::Right,
        },
        None,
    );
}

#[tauri::command(async)]
fn write(text: String) {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();

    enigo.text(&text).unwrap();
}

#[tauri::command(async)]
fn press_key_combination(combination: KeyboardCombination) {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();

    if combination.hold_ctrl {
        enigo.key(Key::Control, Direction::Press).unwrap();
    }

    if combination.hold_shift {
        enigo.key(Key::Shift, Direction::Press).unwrap();
    }

    if combination.hold_alt {
        enigo.key(Key::Alt, Direction::Press).unwrap();
    }

    enigo
        .key(Key::Other(combination.key_code), Direction::Click)
        .unwrap();

    if combination.hold_ctrl {
        enigo.key(Key::Control, Direction::Release).unwrap();
    }

    if combination.hold_shift {
        enigo.key(Key::Shift, Direction::Release).unwrap();
    }

    if combination.hold_alt {
        enigo.key(Key::Alt, Direction::Release).unwrap();
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_mouse_position,
            check_mouse_position,
            move_mouse_to,
            click,
            write,
            press_key_combination
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
