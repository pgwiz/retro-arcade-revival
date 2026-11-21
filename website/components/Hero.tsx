"use client";

import React from "react";
import { Terminal, Gamepad2, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-14 border-b border-[#26354D] bg-[#0E1420]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#131A26] border border-[#26354D] text-xs font-mono text-blue-400 mb-6">
            <span className="w-2 h-2 rounded-sm bg-blue-500"></span>
            ACTIVE RECREATION: BLOCK DROP (TETRIS-INSPIRED)
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5 font-mono">
            Classic Games. <br />
            Modern Open-Source Code.
          </h1>

          <p className="text-base sm:text-lg text-[#8E9EB5] leading-relaxed mb-8">
            Vintage PC and arcade games are becoming difficult to run or trapped behind abandoned stores.
            We are building 100% free, clean-room reimplementations with original assets — starting with Godot 4,
            with native implementations across Rust, C, and Python.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors border border-blue-400"
            >
              <Gamepad2 className="w-4 h-4" />
              Play Block Drop Demo
            </a>
            <a
              href="#recommendations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#192233] hover:bg-[#202b40] text-slate-200 font-semibold text-sm transition-colors border border-[#26354D]"
            >
              Suggest a Game
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="https://github.com/pgwiz/retro-arcade-revival"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#131A26] hover:bg-[#192233] text-slate-300 font-mono text-xs border border-[#26354D]"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              git clone github.com/pgwiz/retro-arcade-revival
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-[#8E9EB5]">
            <div className="p-3 rounded bg-[#131A26] border border-[#26354D]">
              <div className="text-slate-200 font-bold text-sm">MIT License</div>
              <div>100% Free Forever</div>
            </div>
            <div className="p-3 rounded bg-[#131A26] border border-[#26354D]">
              <div className="text-slate-200 font-bold text-sm">Clean-Room</div>
              <div>Zero Copyright Risk</div>
            </div>
            <div className="p-3 rounded bg-[#131A26] border border-[#26354D]">
              <div className="text-slate-200 font-bold text-sm">Multi-Engine</div>
              <div>Godot · Rust · C · Py</div>
            </div>
            <div className="p-3 rounded bg-[#131A26] border border-[#26354D]">
              <div className="text-slate-200 font-bold text-sm">Modular Lib</div>
              <div>Reusable Shared Core</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
