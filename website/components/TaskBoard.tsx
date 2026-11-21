"use client";

import React, { useState } from "react";
import { CheckSquare, Clock, AlertCircle, Sparkles, Filter, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  game: string;
  phase: number;
  engine: "Godot 4" | "Rust" | "C" | "Python" | "Shared Core";
  status: "in_progress" | "next_up" | "planned" | "completed";
  category: "Engine" | "Gameplay" | "Audio" | "Shared Lib" | "Web UI";
  assignee: string;
  summary: string;
  issueUrl?: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: "TASK-001",
    title: "Block Drop: Core Polyomino Grid & Rotational Logic",
    game: "Block Drop",
    phase: 1,
    engine: "Godot 4",
    status: "in_progress",
    category: "Gameplay",
    assignee: "pgwiz (Lead)",
    summary: "10x20 cell grid matrix, SRS wall-kick rotations, hard/soft drop, ghost piece projection, and line clear calculations.",
  },
  {
    id: "TASK-002",
    title: "Vercel Web Dashboard & Live Browser Demo",
    game: "Platform",
    phase: 1,
    engine: "Shared Core",
    status: "completed",
    category: "Web UI",
    assignee: "Community",
    summary: "Next.js community portal featuring roadmap tracking, community recommendation submissions, and playable canvas demo.",
  },
  {
    id: "TASK-003",
    title: "CLI Scaffolder & Library Auto-Updater",
    game: "Developer Tools",
    phase: 1,
    engine: "Python",
    status: "completed",
    category: "Engine",
    assignee: "Core Team",
    summary: "tools/new_game.py and tools/update_libs.py for fast automated game scaffolding across Godot, Rust, C, and Python.",
  },
  {
    id: "TASK-004",
    title: "Procedural 8-bit Audio Synth Module",
    game: "Shared Lib",
    phase: 1,
    engine: "Godot 4",
    status: "in_progress",
    category: "Audio",
    assignee: "Open Contributor",
    summary: "Algorithmic square/noise wave generation for retro sound effects without external copyrighted audio samples.",
  },
  {
    id: "TASK-005",
    title: "Brick Rebound: Paddle & Ball Physics Implementation",
    game: "Brick Rebound",
    phase: 1,
    engine: "Godot 4",
    status: "next_up",
    category: "Gameplay",
    assignee: "Open for PR",
    summary: "Paddle collision angle deflection, breakable brick grid, power-up drop drops, and multi-ball states.",
  },
  {
    id: "TASK-006",
    title: "Rust Port: Block Drop in Macroquad",
    game: "Block Drop",
    phase: 1,
    engine: "Rust",
    status: "next_up",
    category: "Gameplay",
    assignee: "Open for PR",
    summary: "Porting the clean-room Block Drop matrix logic into Rust Macroquad for ultra-compact WebAssembly export.",
  },
  {
    id: "TASK-007",
    title: "Dot Maze: Four Ghost AI Pathfinding States",
    game: "Dot Maze",
    phase: 2,
    engine: "Godot 4",
    status: "planned",
    category: "Gameplay",
    assignee: "Planned Phase 2",
    summary: "A* and tile-target chase/scatter/frightened navigation algorithms for classic maze adversaries.",
  },
  {
    id: "TASK-008",
    title: "Cosmic Defenders: Bunkers & Wave Formations in C/Raylib",
    game: "Cosmic Defenders",
    phase: 2,
    engine: "C",
    status: "planned",
    category: "Gameplay",
    assignee: "Planned Phase 2",
    summary: "Pixel-destruction barriers, descending alien armada step-rate acceleration, and high-score ranking.",
  },
  {
    id: "TASK-009",
    title: "Cube Snake 3D: Surface Navigation on Rotating Cube",
    game: "Cube Snake 3D",
    phase: 3,
    engine: "Godot 4",
    status: "planned",
    category: "Gameplay",
    assignee: "Planned Phase 3",
    summary: "3D camera orbit and smooth continuous coordinate projection across 90-degree cube corner transitions.",
  },
  {
    id: "TASK-010",
    title: "Marble Roll 3D: RigidBody3D Physics & Obstacle Ramps",
    game: "Marble Roll 3D",
    phase: 3,
    engine: "Godot 4",
    status: "planned",
    category: "Gameplay",
    assignee: "Planned Phase 3",
    summary: "Momentum-based ball steering across narrow suspended 3D ramps with dynamic physics obstacles.",
  },
];

export default function TaskBoard() {
  const [selectedPhase, setSelectedPhase] = useState<number | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedEngine, setSelectedEngine] = useState<string>("all");

  const filteredTasks = INITIAL_TASKS.filter((task) => {
    if (selectedPhase !== "all" && task.phase !== selectedPhase) return false;
    if (selectedStatus !== "all" && task.status !== selectedStatus) return false;
    if (selectedEngine !== "all" && task.engine !== selectedEngine) return false;
    return true;
  });

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-blue-950 border border-blue-800 text-blue-400">
            <Clock className="w-3 h-3" /> IN PROGRESS
          </span>
        );
      case "next_up":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950 border border-amber-800 text-amber-400">
            <Sparkles className="w-3 h-3" /> NEXT UP
          </span>
        );
      case "planned":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-400">
            PLANNING
          </span>
        );
    }
  };

  const getEngineColor = (engine: Task["engine"]) => {
    switch (engine) {
      case "Godot 4":
        return "text-blue-400 border-blue-900 bg-blue-950/40";
      case "Rust":
        return "text-amber-400 border-amber-900 bg-amber-950/40";
      case "C":
        return "text-slate-300 border-slate-700 bg-slate-800/40";
      case "Python":
        return "text-yellow-400 border-yellow-900 bg-yellow-950/40";
      default:
        return "text-indigo-400 border-indigo-900 bg-indigo-950/40";
    }
  };

  return (
    <section id="tasks" className="py-14 border-b border-[#26354D] bg-[#0E1420]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">
              DEVELOPMENT ROADMAP
            </div>
            <h2 className="text-3xl font-extrabold text-white font-mono">
              Tasks & Project Milestones
            </h2>
            <p className="text-sm text-[#8E9EB5] mt-1">
              Live tracking of our open-source recreation phases. Collaborators are invited to claim open tasks!
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              onClick={() => setSelectedPhase("all")}
              className={`px-3 py-1.5 rounded border transition-colors ${
                selectedPhase === "all"
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-[#131A26] border-[#26354D] text-[#8E9EB5] hover:text-white"
              }`}
            >
              All Phases
            </button>
            <button
              onClick={() => setSelectedPhase(1)}
              className={`px-3 py-1.5 rounded border transition-colors ${
                selectedPhase === 1
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-[#131A26] border-[#26354D] text-[#8E9EB5] hover:text-white"
              }`}
            >
              Phase 1: 2D Foundations
            </button>
            <button
              onClick={() => setSelectedPhase(2)}
              className={`px-3 py-1.5 rounded border transition-colors ${
                selectedPhase === 2
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-[#131A26] border-[#26354D] text-[#8E9EB5] hover:text-white"
              }`}
            >
              Phase 2: Classic Arcade
            </button>
            <button
              onClick={() => setSelectedPhase(3)}
              className={`px-3 py-1.5 rounded border transition-colors ${
                selectedPhase === 3
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-[#131A26] border-[#26354D] text-[#8E9EB5] hover:text-white"
              }`}
            >
              Phase 3: 3D Classics
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="p-3 mb-6 rounded-lg bg-[#131A26] border border-[#26354D] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#8E9EB5]">
            <Filter className="w-3.5 h-3.5" />
            <span>FILTER ENGINE:</span>
            {["all", "Godot 4", "Rust", "C", "Python", "Shared Core"].map((eng) => (
              <button
                key={eng}
                onClick={() => setSelectedEngine(eng)}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  selectedEngine === eng
                    ? "bg-slate-700 border-slate-500 text-white"
                    : "border-transparent text-[#8E9EB5] hover:text-slate-200"
                }`}
              >
                {eng.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[#8E9EB5]">
            <span>STATUS:</span>
            {["all", "in_progress", "next_up", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2 py-1 rounded border transition-colors ${
                  selectedStatus === st
                    ? "bg-slate-700 border-slate-500 text-white"
                    : "border-transparent text-[#8E9EB5] hover:text-slate-200"
                }`}
              >
                {st.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-lg bg-[#131A26] border border-[#26354D] flex flex-col justify-between hover:border-[#374B6B] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono text-[#8E9EB5]">{task.id}</span>
                  {getStatusBadge(task.status)}
                </div>

                <h3 className="font-bold text-white text-base mb-1.5">{task.title}</h3>
                <p className="text-xs text-[#8E9EB5] leading-relaxed mb-4">{task.summary}</p>
              </div>

              <div className="pt-3 border-t border-[#1F2A3D] flex items-center justify-between text-xs font-mono">
                <span className={`px-2 py-0.5 rounded border ${getEngineColor(task.engine)}`}>
                  {task.engine}
                </span>
                <span className="text-slate-400">{task.assignee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
