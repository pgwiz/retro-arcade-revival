"use client";

import React from "react";
import { Cpu, Terminal, Zap, BookOpen } from "lucide-react";

export default function TechStackMatrix() {
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
      sampleGame: "Block Drop (CLI/Pygame demo), Grid logic",
    },
  ];

  return (
    <section id="tech-stack" className="py-14 border-b border-[#26354D] bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">
            ARCHITECTURE & ENGINES
          </div>
          <h2 className="text-3xl font-extrabold text-white font-mono">
            Supported Tech Stacks
          </h2>
          <p className="text-sm text-[#8E9EB5] mt-2">
            We don't restrict recreation to a single language. Contributors are empowered to implement games using the stack best suited for the gameplay mechanics.
          </p>
        </div>

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
                    <div className="text-xs font-mono text-[#8E9EB5]">{stack.role} · {stack.language}</div>
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

              <div className="pt-3 border-t border-[#1F2A3D] text-[11px] font-mono text-slate-400">
                <span className="text-slate-500">Targets:</span> {stack.sampleGame}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
