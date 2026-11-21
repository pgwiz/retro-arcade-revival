# 🕹️ Retro Arcade Revival

> **Open-source community recreation of classic PC & arcade-era games.**
> Preserving vintage gameplay mechanics through clean, original implementations.
> MIT Licensed · Multi-Engine Support (Godot, Rust, C, Python) · Zero Proprietary Assets.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Godot 4](https://img.shields.io/badge/Godot-4.x-478CBF.svg)](https://godotengine.org)
[![Rust](https://img.shields.io/badge/Rust-Macroquad%20%7C%20Bevy-dea584.svg)](https://www.rust-lang.org/)
[![C](https://img.shields.io/badge/C-Raylib%20%7C%20SDL2-555555.svg)](https://www.raylib.com/)
[![Python](https://img.shields.io/badge/Python-Pygame-3776AB.svg)](https://www.pygame.org/)

---

## 🎯 Project Mission

Vintage games from the 80s and 90s are foundational pieces of interactive culture, yet many are trapped in copyright limbo, abandoned digital store fronts, or difficult emulation setups.

**Retro Arcade Revival** brings these timeless mechanics back to life as **100% open-source, modern implementations**:
1. **Zero Copyright Violations**: Original code, fresh pixel art, generated chiptunes, and distinct original branding.
2. **Multi-Engine Freedom**: Primary development in **Godot 4**, with first-class support for **Rust**, **C**, and **Python**.
3. **Modular Shared Library**: Common audio, input, UI, physics, and save-file abstractions reused across games.
4. **Community Driven**: Anyone can suggest titles, vote on features, submit PRs, or port games to other stacks.

---

## 🛡️ Intellectual Property & Copyright Guardrails

To protect contributors and keep this repository freely distributable forever, all contributors **must strictly follow these rules**:

| Concern | Policy & Safe Practice |
|---|---|
| **Names & Trademarks** | ❌ Never use trademarked game titles in code, assets, or repository names.<br>✅ Use descriptive, original gameplay names (e.g. `block_drop` instead of Tetris, `dot_maze` instead of Pac-Man, `cosmic_defender` instead of Space Invaders). |
| **Visual Art & Sprites** | ❌ Never rip sprites, textures, or logos from original ROMs/binaries.<br>✅ Draw original pixel art or use vetted CC0 public-domain assets. |
| **Audio & Music** | ❌ Never sample original game sound effects or copyrighted theme songs.<br>✅ Compose original chiptunes (BeepBox, MilkyTracker) or synthesize retro SFX (sfxr/Bfxr). |
| **Code & Algorithms** | ❌ Never decompile or copy proprietary source code.<br>✅ Re-implement gameplay mechanics cleanly from logic and mathematical rules. Game mechanics themselves are not copyrightable under international IP law. |

---

## 🛠️ Supported Tech Stacks

We encourage community members to build games in the language/engine they love:

| Stack | Framework | Role in Repo | Why Use It |
|---|---|---|---|
| **Godot 4** | GDScript / C# | **Primary Engine** | Fast 2D/3D development, visual node tree, one-click Web/Desktop export, built-in physics. |
| **Rust** | Macroquad / Bevy | High-Performance | Memory safe, tiny standalone WebAssembly and native binaries, ultra-fast loop. |
| **C** | Raylib / SDL2 | Pure Systems / Educational | Ultra-lightweight, zero bloat, runs everywhere from microcontrollers to desktop PCs. |
| **Python** | Pygame CE | Prototyping & Education | Highest accessibility for beginners and rapid logic prototyping. |

---

## 🎮 Initial Focus: Block Drop (Falling Blocks)

We kick off development with our flagship title:
- **Identifier**: `games/block_drop/`
- **Lead Engine**: Godot 4 (with cross-reference Rust/C/Python specifications)
- **Mechanics**: 10x20 grid, 7 polyomino tetromino geometries, smooth rotation system, line clearing animations, score scaling, and instant drop.
- **Shared Lib Usage**: Uses `shared/lib/input/input_manager.gd`, `shared/lib/audio/sfx_player.gd`, and `shared/lib/ui/hud.tscn`.

---

## 📁 Repository Layout

```text
retro-arcade-revival/
├── engine/                      # Unified launcher & shared engine core
│   ├── main.gd                  # Engine bootstrapper & game selector
│   ├── updater.py               # Auto-downloads & synchronizes shared libraries
│   └── game_registry.json       # Metadata registry of all games & available engines
│
├── shared/                      # Modular cross-game library
│   ├── audio/                   # SFX trigger routines & chiptune stream managers
│   ├── ui/                      # Standard HUD, pause modals, score displays
│   ├── input/                   # Unified gamepad & keyboard action mapping
│   ├── physics/                 # Grid movement, collision & bounce mechanics
│   └── utils/                   # High-score serialization & RNG state
│
├── games/                       # Game implementations
│   ├── block_drop/              # First project: Falling polyomino game (Godot 4)
│   ├── dot_maze/                # Planned: 2D labyrinth collector
│   ├── marble_roll/             # Planned: 3D physics marble puzzle
│   └── _template/               # Starter boilerplate for new game submissions
│
├── tools/                       # Developer automation scripts
│   ├── new_game.py              # CLI tool: Scaffolds a new game directory
│   └── update_libs.py           # CLI tool: Validates & updates shared submodules
│
├── website/                     # Vercel-ready Next.js Web UI (Tasks, Suggestions, Roadmap)
│   ├── app/                     # React Server Components & pages
│   ├── components/              # Clean retro-modern dashboard components
│   └── package.json             # Web deployment config
│
├── README.md                    # Main project documentation
├── CHANGELOG.md                 # Project version history
├── MEMORY.md                    # Core architecture memory & decisions
├── AGENT.md                     # Agent collaboration guidelines
└── LICENSE                      # MIT Open Source License
```

---

## 🤝 Collaborator Recommendations & How to Join

We are actively looking for developers, pixel artists, sound designers, and testers!

### Recommendation for New Collaborators
1. **Choose an unclaimed game** or pick a stack variant from the [Interactive Roadmap](https://retro-arcade-revival.vercel.app).
2. **Run the generator**:
   ```bash
   python tools/new_game.py --name "cosmic_defender" --engine godot
   ```
3. **Use the shared library**: Do not reinvent high score saving, pause menus, or audio managers. Hook into `shared/`.
4. **Follow the copyright guardrails**: Keep names generic, code original, and assets CC0.
5. **Submit a Pull Request**: Keep PRs focused on a single game or library module.

---

## 🚀 Quickstart

### Running the Engine (Godot 4)
1. Download Godot 4.x from [godotengine.org](https://godotengine.org/).
2. Open Godot, click **Import**, and select `project.godot`.
3. Press **F5** to start the launcher and pick a game!

### Running the Developer CLI
```bash
# Scaffold a new game
python tools/new_game.py --name "my_game" --engine godot

# Verify / update shared libraries
python tools/update_libs.py
```

### Running the Community Web UI Locally
```bash
cd website
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for full details.
Original code & designs created by the Retro Arcade Revival community.
