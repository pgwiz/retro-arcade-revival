"use client";

import React from "react";
import { ShieldCheck, Code, GitPullRequest, Terminal, FileCode2, Cpu, CheckCircle } from "lucide-react";

export default function CollaboratorPortal() {
  return (
    <section id="collaborators" className="py-14 border-b border-[#26354D] bg-[#0E1420]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">
            JOIN THE REVIVAL
          </div>
          <h2 className="text-3xl font-extrabold text-white font-mono">
            Collaborator Recommendations & Guidelines
          </h2>
          <p className="text-sm text-[#8E9EB5] mt-2">
            Whether you build in Godot, Rust, C, or Python, you can contribute.
            Follow these recommendations to ensure smooth PR merges and protect our open-source status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Copyright & IP Safeguards */}
          <div className="p-6 rounded-xl bg-[#131A26] border border-[#26354D]">
            <div className="flex items-center gap-2.5 text-blue-400 font-mono font-bold text-base mb-4">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              CRITICAL: Copyright Avoidance Protocol
            </div>

            <p className="text-xs text-[#8E9EB5] leading-relaxed mb-4">
              Game rules and mechanics cannot be copyrighted, but brand names, character artwork, logos, and audio recordings can.
              To keep our project 100% open-source and legally sound:
            </p>

            <ul className="space-y-3 text-xs font-mono text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">❌</span>
                <span><strong>No Trademarked Names:</strong> Do not use names like Tetris, Pac-Man, or Space Invaders. Use original descriptive names (e.g. <code>block_drop</code>, <code>dot_maze</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">❌</span>
                <span><strong>No Ripped Sprites:</strong> Never extract textures or graphics from original commercial ROMs. Create original pixel art or use vetted CC0 public domain assets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">❌</span>
                <span><strong>No Sampled Sound Effects:</strong> Do not copy proprietary music files. Synthesize procedural 8-bit sound effects or compose original chiptune tracks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✅</span>
                <span><strong>Clean-Room Mechanics:</strong> Implement gameplay rules cleanly from scratch using modern mathematics and standard physics loops.</span>
              </li>
            </ul>
          </div>

          {/* Quickstart Scaffold Workflow */}
          <div className="p-6 rounded-xl bg-[#131A26] border border-[#26354D]">
            <div className="flex items-center gap-2.5 text-blue-400 font-mono font-bold text-base mb-4">
              <Terminal className="w-5 h-5 text-blue-400" />
              Automated Game Scaffolder
            </div>

            <p className="text-xs text-[#8E9EB5] leading-relaxed mb-4">
              We provide automated Python scripts in <code>tools/</code> to scaffold boilerplate files, scenes, and automatically register your game in the launcher.
            </p>

            <div className="p-3.5 rounded bg-[#0A0E17] border border-[#26354D] font-mono text-xs text-slate-200 mb-4 space-y-2">
              <div className="text-slate-500"># 1. Clone the repository</div>
              <div className="text-blue-300">git clone https://github.com/pgwiz/retro-arcade-revival.git</div>
              
              <div className="text-slate-500 pt-1"># 2. Scaffold a new game with your preferred engine</div>
              <div className="text-blue-300">python tools/new_game.py --name "cosmic_defenders" --engine godot</div>
              <div className="text-blue-300">python tools/new_game.py --name "tank_tactics" --engine rust</div>
              
              <div className="text-slate-500 pt-1"># 3. Verify shared library dependencies</div>
              <div className="text-blue-300">python tools/update_libs.py</div>
            </div>

            <div className="text-xs text-[#8E9EB5]">
              The script generates starter code, hooks up the ESC key back to the launcher, and inserts metadata into <code>engine/game_registry.json</code>.
            </div>
          </div>
        </div>

        {/* 4-Step Contribution Process */}
        <div className="p-6 rounded-xl bg-[#131A26] border border-[#26354D]">
          <h3 className="text-base font-mono font-bold text-white mb-6">
            HOW TO CONTRIBUTE (STEP-BY-STEP)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-[#0E1420] border border-[#26354D]">
              <div className="text-blue-400 font-bold text-sm mb-1">01. Pick or Propose</div>
              <div className="text-[#8E9EB5]">
                Select an open task from the roadmap or propose a game in the recommendations board.
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1420] border border-[#26354D]">
              <div className="text-blue-400 font-bold text-sm mb-1">02. Fork & Scaffold</div>
              <div className="text-[#8E9EB5]">
                Fork the repo, branch off <code>main</code>, and run <code>new_game.py</code> to initialize your game directory.
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1420] border border-[#26354D]">
              <div className="text-blue-400 font-bold text-sm mb-1">03. Use Shared Core</div>
              <div className="text-[#8E9EB5]">
                Hook into <code>shared/input</code>, <code>shared/audio</code>, and <code>shared/utils</code> instead of writing duplicate boilerplate.
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0E1420] border border-[#26354D]">
              <div className="text-blue-400 font-bold text-sm mb-1">04. Open a PR</div>
              <div className="text-[#8E9EB5]">
                Submit your pull request with a concise description. Our CI runs auto-linting and build verification.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
