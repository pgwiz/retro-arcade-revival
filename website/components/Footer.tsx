"use client";

import React from "react";
import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 bg-[#080B11] border-t border-[#1C2638] text-xs font-mono text-[#8E9EB5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">🕹️</span>
            <div>
              <div className="font-bold text-slate-200 text-sm">RETRO ARCADE REVIVAL</div>
              <div className="text-[11px] text-[#64748B]">
                Open-source vintage game preservation initiative
              </div>
            </div>
          </div>

          <div className="text-center md:text-left max-w-xl text-[11px] text-[#64748B]">
            All games in this repository are independent, clean-room recreations inspired by classic arcade mechanics.
            Game rules and mathematical algorithms are not copyrightable. No proprietary trademarks, character artwork, or audio samples from original publishers are used.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/pgwiz/retro-arcade-revival"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded bg-[#131A26] border border-[#26354D] text-slate-300 hover:text-white hover:border-blue-500 transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#141B28] flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[#64748B]">
          <div>Released under the MIT Open Source License.</div>
          <div>Built with Godot 4 · Rust · C · Python · Next.js</div>
        </div>
      </div>
    </footer>
  );
}
