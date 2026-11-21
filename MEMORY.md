# Project Memory & Architecture Decisions

This document records the architectural standards, technical decisions, and project memory for **Retro Arcade Revival**.

---

## 1. Core Principles

1. **Clean Room Recreations**: All game mechanics are built from fundamental logic. No disassembled code, no ripped assets, no trademarked brand names.
2. **Multi-Engine Freedom**:
   - Primary: **Godot 4** (rapid 2D/3D development, one-click exports, intuitive scene tree).
   - High-Performance: **Rust** (Macroquad/Bevy).
   - Systems/Minimalist: **C** (Raylib/SDL2).
   - Prototyping: **Python** (Pygame CE).
3. **Reusability via `shared/`**:
   - Universal HUD, pause overlays, sound players, and save managers are written once and shared across games.
4. **No Visual Blobs / Glow**:
   - In any web UI, HUD, or graphic design: crisp retro-modern lines, flat or structured borders, clean typography.
   - Strictly avoid ambient blur background circles, glowing blobs, or neon glowing dots.

---

## 2. Directory Taxonomy

- `engine/`: The unified arcade launcher and updater.
- `shared/`: The shared library holding modular code (audio, input, ui, physics, utils).
- `games/`: Each subfolder is a self-contained game (e.g. `block_drop/`, `dot_maze/`, `marble_roll/`).
- `tools/`: Python CLI utilities to assist developers with creating boilerplate and updating libraries.
- `website/`: Next.js web application deployed to Vercel for tracking tasks, gathering community recommendations, and welcoming collaborators.

---

## 3. Flagship Game: Block Drop

- **Genre**: Falling polyomino puzzle.
- **Rules**:
  - Grid: 10 columns by 20 rows.
  - 7 standard 4-block polyomino shapes (I, O, T, S, Z, J, L) represented with distinct original color palettes.
  - Standard rotation tests, gravity speed scaling per level, line clear scoring, and hard/soft drop.
  - Zero proprietary assets or branding.

---

## 4. Web UI Features (Vercel)

- **Task Tracker**: Visual status of Phase 1, Phase 2, and Phase 3 games.
- **Community Recommendations**: Users can suggest games, describe desired mechanics, and vote.
- **Collaborator Portal**: Tech stack guidelines for Godot, Rust, C, and Python.
- **Clean Aesthetic**: Modern retro, high contrast, clean panels, zero glowing or blurry blobs.
