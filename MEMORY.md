# Project Memory & Architecture Decisions

This document records the architectural standards, technical decisions, and project memory for **Retro Arcade Revival**.

---

## 1. Core Principles

1. **Free Code for Everyone**: All software is released under the permissive MIT license for educational, hobbyist, and historical preservation purposes.
2. **AI Agent Demo Mandate**: When introducing or updating games, AI agents should embed an interactive playable web demo (HTML5 Canvas/WASM) whenever feasible so users can play instantly.
3. **Security Parameters**:
   - Automated verification via `tools/security_check.py`.
   - Prohibits `eval()`, `exec()`, `new Function()`, unauthorized subprocesses, and path traversal (`../`).
   - Browser demos must cleanly unbind event listeners and cancel animation loops on unmount.
4. **Multi-Engine Freedom**:
   - Primary: **Godot 4** (rapid 2D/3D development, one-click exports, intuitive scene tree).
   - High-Performance: **Rust** (Macroquad/Bevy).
   - Systems/Minimalist: **C** (Raylib/SDL2).
   - Prototyping: **Python** (Pygame CE).
5. **No Visual Blobs / Glow**:
   - In any web UI, HUD, or graphic design: crisp retro-modern lines, flat or structured borders, clean typography.
   - Strictly avoid ambient blur background circles, glowing blobs, or neon glowing dots.

---

## 2. Directory Taxonomy

- `engine/`: The unified arcade launcher and updater.
- `shared/`: The shared library holding modular code (audio, input, ui, physics, utils).
- `games/`: Each subfolder is a self-contained game (e.g. `block_drop/`, `dot_maze/`, `marble_roll/`).
- `tools/`: Python CLI utilities:
  - `new_game.py`: Scaffolds new game boilerplate across engines.
  - `update_libs.py`: Synchronizes and checks shared libraries.
  - `security_check.py`: Scans code for dynamic execution, shell escapes, and path traversal.
- `website/`: Next.js web application deployed to Vercel for tracking tasks, gathering community recommendations, and welcoming collaborators.
- `icon.svg` & `website/public/joystick.svg`: Custom isometric classic arcade joystick vector icon.

---

## 3. Flagship Game: Block Drop

- **Genre**: Falling polyomino puzzle.
- **Rules**:
  - Grid: 10 columns by 20 rows.
  - 7 standard 4-block polyomino shapes (I, O, T, S, Z, J, L) represented with distinct original color palettes.
  - Standard rotation tests, gravity speed scaling per level, line clear scoring, and hard/soft drop.
- **Playable Web Demo**: Live playable canvas version built directly into `website/components/PlayableDemo.tsx`.
