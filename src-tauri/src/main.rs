// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use autopilot::{self, geometry::Point, mouse::Button};

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

#[tauri::command(async)]
fn move_mouse_to(position: MousePosition) -> bool {
    match autopilot::mouse::move_to(Point::new(position.x, position.y)) {
        Ok(_) => true,
        Err(_) => false,
    }
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
    autopilot::key::type_string(&text, &[], 0.0, 0.0)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_mouse_position,
            move_mouse_to,
            click,
            write
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
