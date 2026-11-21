"use client";

import React, { useState } from "react";
import { Cpu, Terminal, Zap, BookOpen, Layers, Code, Check } from "lucide-react";

export default function TechStackMatrix() {
  const [activeTab, setActiveTab] = useState<"stacks" | "shared">("stacks");

  const stacks = [
    {
      name: "Godot 4",
      role: "Primary Engine",
      language: "GDScript / C#",
      badge: "Flagship Choice",
      badgeColor: "bg-blue-950 border-blue-800 text-blue-300",
      description: "Fast 2D/3D development with node-based scene hierarchy, built-in physics (RigidBody3D / CharacterBody2D), and one-click Web/Desktop export.",
      advantages: [
        "Interactive editor and scene tree",
        "Seamless 2D and 3D transition",
        "HTML5 / WebAssembly one-click export",
        "100% free MIT license with zero royalties",
      ],
      sampleGame: "Block Drop, Marble Roll 3D, Cube Snake 3D",
      runCommand: "godot --path games/block_drop",
    },
    {
      name: "Rust",
      role: "High Performance",
      language: "Macroquad / Bevy",
      badge: "Ultra-Lightweight",
      badgeColor: "bg-amber-950 border-amber-800 text-amber-300",
      description: "Memory-safe, high-speed game loops yielding ultra-compact native binaries and lightweight WASM files that load in milliseconds.",
      advantages: [
        "Macroquad: Single-file game compilation",
        "Bevy: Modern ECS (Entity Component System)",
        "Zero garbage collection pauses",
        "Ideal for math-heavy procedural sims",
      ],
      sampleGame: "Scorched Earth clone, Particle shooters",
      runCommand: "cargo run --release",
    },
    {
      name: "C",
      role: "Systems & Minimalist",
      language: "Raylib / SDL2",
      badge: "Pure Systems",
      badgeColor: "bg-slate-800 border-slate-600 text-slate-300",
      description: "Direct hardware access and maximum portability with Raylib. Runs effortlessly across Windows, Linux, Mac, web, and micro-consoles.",
      advantages: [
        "Raylib has zero external dependencies",
        "Clean, straightforward C99 API",
        "Instant compilation times (< 2 seconds)",
        "Educational goldmine for game dev fundamentals",
      ],
      sampleGame: "Cosmic Defenders, Lemmings swarm",
      runCommand: "gcc -o game main.c -lraylib -lGL -lm -lpthread -ldl",
    },
    {
      name: "Python",
      role: "Rapid Prototyping",
      language: "Pygame-CE",
      badge: "Beginner Friendly",
      badgeColor: "bg-yellow-950 border-yellow-800 text-yellow-300",
      description: "The most accessible entry point for beginners and quick gameplay logic experiments before porting to native engines.",
      advantages: [
        "Readable, expressive syntax",
        "Instant logic prototyping without compile steps",
        "Huge educational tutorial ecosystem",
        "Great for algorithmic board/puzzle logic",
      ],
      sampleGame: "Block Drop (standalone demo), Grid logic",
      runCommand: "python games/block_drop/block_drop.py",
    },
  ];

  const sharedModules = [
    {
      module: "shared/audio/sfx_player.gd",
      title: "Procedural 8-bit Sound FX",
      purpose: "Generates authentic chiptune frequencies (blips, booms, arpeggios) without external copyrighted WAV/MP3 files.",
    },
    {
      module: "shared/input/input_manager.gd",
      title: "Universal Input Mapper",
      purpose: "Maps keyboard (WASD / Arrows), gamepad arcade sticks, and touch gestures onto unified semantic action events.",
    },
    {
      module: "shared/utils/save_manager.gd",
      title: "Encrypted State & Hi-Score",
      purpose: "Cross-platform JSON save/load with CRC validation for local high scores, custom keybindings, and player settings.",
    },
  ];

  return (
    <section id="tech-stack" className="py-14 border-b border-[#26354D] bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">
              ARCHITECTURE & ENGINES
            </div>
            <h2 className="text-3xl font-extrabold text-white font-mono">
              Supported Tech Stacks
            </h2>
            <p className="text-sm text-[#8E9EB5] mt-1">
              We do not restrict recreation to a single language. Contributors are empowered to implement games using the stack best suited for the mechanics.
            </p>
          </div>

          {/* View Tab Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-lg bg-[#131A26] border border-[#26354D] text-xs font-mono">
            <button
              onClick={() => setActiveTab("stacks")}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === "stacks"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-[#8E9EB5] hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Game Engines (4)
            </button>
            <button
              onClick={() => setActiveTab("shared")}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === "shared"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-[#8E9EB5] hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Shared Core Libs
            </button>
          </div>
        </div>

        {activeTab === "stacks" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stacks.map((stack) => (
              <div
                key={stack.name}
                className="p-6 rounded-xl bg-[#131A26] border border-[#26354D] flex flex-col justify-between hover:border-[#374B6B] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold font-mono text-white">{stack.name}</h3>
                      <div className="text-xs font-mono text-[#8E9EB5]">
                        {stack.role} · {stack.language}
                      </div>
                    </div>
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded border ${stack.badgeColor}`}>
                      {stack.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{stack.description}</p>

                  <div className="space-y-1.5 text-xs font-mono text-[#8E9EB5] mb-5">
                    {stack.advantages.map((adv, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1F2A3D] space-y-2">
                  <div className="text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Targets:</span> {stack.sampleGame}
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#0A0E17] border border-[#1E293B] text-[11px] font-mono text-blue-300">
                    <Terminal className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="truncate">{stack.runCommand}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#131A26] border border-[#26354D] text-xs font-mono text-[#8E9EB5]">
              Each engine implementation references our battle-tested shared library modules in the <code className="text-blue-300">/shared</code> directory, guaranteeing unified physics timing, identical input mappings, and reproducible save states across all platforms.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sharedModules.map((mod) => (
                <div
                  key={mod.module}
                  className="p-5 rounded-xl bg-[#131A26] border border-[#26354D] flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-900 mb-2">
                      <Code className="w-3 h-3" />
                      SHARED MODULE
                    </div>
                    <h4 className="text-base font-bold font-mono text-white mb-1">{mod.title}</h4>
                    <div className="text-[11px] font-mono text-slate-400 mb-3">{mod.module}</div>
                    <p className="text-xs text-[#8E9EB5] leading-relaxed">{mod.purpose}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1F2A3D] flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Cross-Engine Ready</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-[#0A0E17] border border-[#26354D] text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-slate-300">
                To scaffold a new game with all shared libraries linked automatically:
              </span>
              <code className="px-3 py-1.5 rounded bg-[#131A26] text-blue-300 border border-[#26354D]">
                python tools/new_game.py my_game_name
              </code>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
