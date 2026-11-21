# Changelog

All notable changes to the Retro Arcade Revival project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-21

### Added
- Initial repository setup and architecture layout.
- MIT License with explicit original work and non-proprietary asset declaration.
- Core multi-engine support matrix: Godot 4, Rust (Macroquad/Bevy), C (Raylib/SDL2), and Python (Pygame).
- Shared library directory structure (`shared/audio`, `shared/ui`, `shared/input`, `shared/physics`, `shared/utils`).
- Flagship starter project: `games/block_drop` (pure original falling polyomino game logic in Godot 4).
- Developer CLI tools:
  - `tools/new_game.py` for automated project scaffolding across Godot, Rust, C, and Python.
  - `tools/update_libs.py` for shared library dependency synchronization and integrity checks.
- Vercel-ready Web UI in `website/` featuring:
  - Live task tracking and progress boards.
  - User recommendation & game voting forum.
  - Collaborator onboarding and tech stack recommendations.
  - Playable browser preview for `block_drop`.
- Strict IP & copyright guardrails protecting contributors and preserving open distribution.
