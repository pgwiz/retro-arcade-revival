# Changelog

All notable changes to the Retro Arcade Revival project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2026-11-21

### Added
- **Web Audio 8-Bit Chiptune Synth**: Built-in procedural sound generator in `PlayableDemo.tsx` for moves, rotations, drops, line clears, game over, and pause with persistent mute toggle.
- **Arcade High Score Tracking**: Real-time record tracking with `localStorage` persistence and "NEW HIGH" achievement badge.
- **Pause & Resume Mode**: Toggle pause via `P`, `Escape`, or on-screen controls with retro paused overlay.
- **Mobile / Touch Virtual Controls**: Responsive virtual D-Pad and action buttons for mobile devices and tablets.
- **Roadmap Progress & Search Filter**: Live completion percentage, Phase 1 progress bars, and multi-field text search in `TaskBoard.tsx`.
- **Recommendation Sorting & Persistence**: "Most Upvoted" vs "Newest" sorting, 2D/3D filters, and `localStorage` persistence for proposals and votes in `RecommendationBoard.tsx`.
- **Shared Core Libs Explorer**: Interactive switcher between engine architecture cards and shared core module integration in `TechStackMatrix.tsx`.
- **Dedicated Caffeine AI Repository**: Isolated Caffeine AI branch to `https://github.com/pgwiz/retro-arcade-revival-caffeine` and restored clean pre-caffeine main branch.

## [0.1.2] - 2026-11-21

### Added
- Custom vector SVG isometric arcade joystick icon (`website/public/joystick.svg`, `website/components/JoystickIcon.tsx`, and root `icon.svg`).
- Interactive demo mandate in `AGENT.md`: instructs AI agents to provide playable in-browser game demos whenever feasible.
- Security verification tool `tools/security_check.py` with parameter checks for dynamic eval, subprocess execution, path traversal, and loop bounds.
- Replaced header and footer icons with the custom isometric arcade joystick component.

## [0.1.1] - 2026-11-21

### Changed
- Replaced overly restrictive IP warnings with standard, welcoming open-source MIT notices and "as-is / no claims" disclaimers.
- Updated documentation and web portal to focus on open-source preservation, education, and welcoming community contributions.

## [0.1.0] - 2026-11-21

### Added
- Initial repository setup and architecture layout.
- MIT License with open-source preservation and nominative fair use notice.
- Core multi-engine support matrix: Godot 4, Rust (Macroquad/Bevy), C (Raylib/SDL2), and Python (Pygame).
- Shared library directory structure (`shared/audio`, `shared/ui`, `shared/input`, `shared/physics`, `shared/utils`).
- Flagship starter project: `games/block_drop` (falling polyomino game logic in Godot 4 and Python).
- Developer CLI tools:
  - `tools/new_game.py` for automated project scaffolding across Godot, Rust, C, and Python.
  - `tools/update_libs.py` for shared library dependency synchronization and integrity checks.
- Vercel-ready Web UI in `website/` featuring:
  - Live task tracking and progress boards.
  - User recommendation & game voting forum.
  - Collaborator onboarding and tech stack recommendations.
  - Playable browser preview for `block_drop`.
