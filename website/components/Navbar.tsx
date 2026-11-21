"use client";

import React from "react";
import { Terminal, Github, Gamepad2, Layers, CheckSquare, MessageSquare, Code2 } from "lucide-react";
import JoystickIcon from "./JoystickIcon";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#26354D] bg-[#0B0F17]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <JoystickIcon size={28} className="shrink-0 transition-transform group-hover:scale-105" />
          <div>
            <div className="font-bold text-base tracking-wider text-slate-100 flex items-center gap-2">
              RETRO ARCADE REVIVAL
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300">
                OPEN SOURCE
              </span>
            </div>
            <div className="text-xs text-[#8E9EB5] hidden sm:block">
              Preserving vintage gaming through clean-room code
            </div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8E9EB5]">
          <a href="#demo" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4" />
            Play Demo
          </a>
          <a href="#tasks" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4" />
            Tasks & Roadmap
          </a>
          <a href="#recommendations" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            Recommendations
          </a>
          <a href="#tech-stack" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Tech Stack
          </a>
          <a href="#collaborators" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Code2 className="w-4 h-4" />
            Join Us
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/pgwiz/retro-arcade-revival"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-md bg-[#192233] border border-[#26354D] hover:border-blue-500 hover:text-white transition-all text-slate-200"
          >
            <Github className="w-4 h-4 text-slate-300" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
