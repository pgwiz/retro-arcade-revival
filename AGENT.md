# Agent Collaboration Guidelines

Guidelines for AI agents and automated tools collaborating on the **Retro Arcade Revival** codebase.

---

## Directives

1. **Markdown File Restriction**:
   - Only create or update `README.md`, `CHANGELOG.md`, `MEMORY.md`, and `AGENT.md`.
   - Do NOT introduce additional loose `.md` files unless specifically instructed by the user.

2. **Visual & UI Guardrail**:
   - Never use glowing blobs, ambient blur background circles, or glowing dots/indicators (especially green glowing ones).
   - All interfaces (web, launcher, HUDs) must use crisp borders, high-contrast flat or subtle-depth cards, and clean typography.

3. **Copyright & Trademarks**:
   - Never commit proprietary names, trademarked titles, ripped sound files, or ripped sprites.
   - Always verify games use original or CC0 assets with generic gameplay identifiers (e.g. `block_drop`, `dot_maze`, `brick_breaker`, `cube_snake`).

4. **Multi-Engine Guidelines**:
   - For Godot 4: Target standard GDScript or C#, ensure compatibility with Godot 4.x project settings.
   - For Rust: Prefer `macroquad` for lightweight single-file builds or `bevy` for complex ECS architectures.
   - For C: Prefer `raylib` for approachable multiplatform code.
   - For Python: Prefer `pygame-ce` (Community Edition).

5. **Shared Library Usage**:
   - When introducing new games, prefer consuming existing shared helpers in `shared/` rather than duplicating common logic.
