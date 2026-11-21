# Agent Collaboration Guidelines

Guidelines for AI agents and automated tools collaborating on the **Retro Arcade Revival** codebase.

---

## 1. Playable Game Demos (Mandatory When Feasible)

> **Core Instruction for AI Agents:**
> Whenever introducing, recreating, or updating a game in this repository, **if you can provide a playable browser demo (such as an HTML5 Canvas, WebGL, or WebAssembly component in the website or standalone preview), you SHOULD DO SO.**

- **Why**: Community members, evaluators, and players should be able to experience the gameplay mechanics immediately in their browser without compiling or installing local runtimes.
- **Where**: Embed or link new playable demos within `website/components/` (similar to `PlayableDemo.tsx` for Block Drop) and register them in the task roadmap and launcher registry.

---

## 2. Security Parameters & Verification

All code submitted by AI agents must strictly satisfy these security parameters:

1. **No Dynamic Execution**:
   - Strictly prohibit `eval()`, `exec()`, `new Function()`, or dynamic runtime script evaluation.
2. **Safe File I/O & Sandboxing**:
   - File reads/writes (high scores, saves, configs) must only access sandboxed paths (`user://` in Godot, browser `localStorage`, or local app data).
   - Zero directory traversal: prevent paths containing `../` or pointing to root directories.
3. **No Unauthorized Process Spawning**:
   - Game runtime logic must never invoke `os.system()`, `subprocess.Popen()`, `shell_exec()`, or execute external system binaries.
4. **Browser Demo Sandboxing**:
   - Game loops must use `requestAnimationFrame` with proper cancellation on unmount to prevent CPU spikes or frozen tabs.
   - Keyboard event listeners must be properly scoped and cleanly removed when components unmount.
   - No unauthorized outbound network tracking or external telemetry calls.
5. **Pre-Commit Security Audit**:
   - Always run the automated security validator before completing a task:
     ```bash
     python tools/security_check.py
     ```

---

## 3. General Directives

- **Markdown File Restriction**: Only create or update `README.md`, `CHANGELOG.md`, `MEMORY.md`, and `AGENT.md`. Do NOT create extra loose `.md` files.
- **Visual & UI Guardrail**: Never use glowing blobs, ambient blur background circles, or glowing dots/indicators (especially green glowing ones). Always use crisp retro-modern borders and high-contrast flat panels.
- **Open Source Licensing**: All code is free under the MIT License, with standard "as-is / no claims" and nominative fair use disclaimers.
- **Multi-Engine Support**: Godot 4 (primary), Rust (Macroquad/Bevy), C (Raylib/SDL2), and Python (Pygame).
