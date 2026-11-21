#!/usr/bin/env python3
"""
CLI Tool: Scaffolds a new game in Retro Arcade Revival
Usage:
    python tools/new_game.py --name "cosmic_defenders" --engine godot --genre "Shooter"
"""
import os
import sys
import json
import argparse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

def scaffold_game(name: str, engine: str, genre: str, dimension: str):
    clean_name = name.lower().replace(" ", "_").replace("-", "_")
    game_dir = REPO_ROOT / "games" / clean_name
    game_dir.mkdir(parents=True, exist_ok=True)

    title = name.replace("_", " ").title()

    if engine == "godot":
        script_file = game_dir / f"{clean_name}.gd"
        scene_file = game_dir / "game.tscn"

        script_content = f"""extends Control

# {title} — Retro Arcade Revival
# Engine: Godot 4
# Genre: {genre}

func _ready() -> void:
	print("{title} initialized!")

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.08, 0.09, 0.12), true)
	var font = ThemeDB.fallback_font
	draw_string(font, Vector2(60, 80), "{title.upper()}", HORIZONTAL_ALIGNMENT_LEFT, -1, 28, Color.WHITE)
	draw_string(font, Vector2(60, 120), "Press ESC to return to Hub.", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color(0.6, 0.7, 0.8))

func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		get_tree().change_scene_to_file("res://engine/launcher.tscn")
"""
        script_file.write_text(script_content, encoding="utf-8")

        scene_content = f"""[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://games/{clean_name}/{clean_name}.gd" id="1_script"]

[node name="{title.replace(' ', '')}" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_script")
"""
        scene_file.write_text(scene_content, encoding="utf-8")

    elif engine == "python":
        py_file = game_dir / f"{clean_name}.py"
        py_content = f"""#!/usr/bin/env python3
# {title} — Pygame Implementation
import sys

def main():
    print("Running {title}...")

if __name__ == "__main__":
    main()
"""
        py_file.write_text(py_content, encoding="utf-8")

    elif engine == "rust":
        cargo_file = game_dir / "Cargo.toml"
        src_dir = game_dir / "src"
        src_dir.mkdir(exist_ok=True)
        main_rs = src_dir / "main.rs"

        cargo_file.write_text(f"""[package]
name = "{clean_name}"
version = "0.1.0"
edition = "2021"

[dependencies]
macroquad = "0.4"
""", encoding="utf-8")

        main_rs.write_text(f"""use macroquad::prelude::*;

#[macroquad::main("{title}")]
async fn main() {{
    loop {{
        clear_background(Color::new(0.08, 0.09, 0.12, 1.0));
        draw_text("{title}", 40.0, 60.0, 32.0, WHITE);
        next_frame().await
    }}
}}
""", encoding="utf-8")

    elif engine == "c":
        c_file = game_dir / f"{clean_name}.c"
        c_content = f"""// {title} — Raylib Implementation in C
#include "raylib.h"

int main(void) {{
    InitWindow(800, 600, "{title}");
    SetTargetFPS(60);

    while (!WindowShouldClose()) {{
        BeginDrawing();
        ClearBackground((Color){{ 20, 24, 32, 255 }});
        DrawText("{title}", 40, 40, 28, RAYWHITE);
        EndDrawing();
    }}

    CloseWindow();
    return 0;
}}
"""
        c_file.write_text(c_content, encoding="utf-8")

    # Update engine/game_registry.json
    registry_file = REPO_ROOT / "engine" / "game_registry.json"
    if registry_file.exists():
        data = json.loads(registry_file.read_text(encoding="utf-8"))
        existing_ids = [g["id"] for g in data.get("games", [])]
        if clean_name not in existing_ids:
            data.setdefault("games", []).append({
                "id": clean_name,
                "title": title,
                "inspiration": f"Classic {genre.lower()} arcade recreation",
                "genre": genre,
                "dimension": dimension,
                "phase": 2,
                "status": "planned",
                "lead_engine": engine.capitalize(),
                "supported_engines": [engine.capitalize()],
                "path": f"res://games/{clean_name}/game.tscn" if engine == "godot" else f"games/{clean_name}/",
                "summary": f"Fresh open-source implementation of vintage {genre.lower()} gameplay.",
                "controls": "Standard directional controls and action keys."
            })
            registry_file.write_text(json.dumps(data, indent=2), encoding="utf-8")

    print(f"✅ Successfully scaffolded '{title}' in games/{clean_name}/ [{engine}]")

def main():
    parser = argparse.ArgumentParser(description="Scaffold a new game in Retro Arcade Revival")
    parser.add_argument("--name", required=True, help="Game name (e.g. cosmic_defenders)")
    parser.add_argument("--engine", default="godot", choices=["godot", "python", "rust", "c"], help="Target engine")
    parser.add_argument("--genre", default="Arcade", help="Game genre (Puzzle, Shooter, Arcade, etc.)")
    parser.add_argument("--dim", default="2D", choices=["2D", "3D"], help="Dimension (2D or 3D)")
    args = parser.parse_args()

    scaffold_game(args.name, args.engine, args.genre, args.dim)

if __name__ == "__main__":
    main()
