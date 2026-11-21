"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Pause, Sparkles, Trophy } from "lucide-react";

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 24;

const SHAPES: Record<number, number[][][]> = {
  1: [ // I
    [[0,1],[1,1],[2,1],[3,1]],
    [[2,0],[2,1],[2,2],[2,3]],
    [[0,2],[1,2],[2,2],[3,2]],
    [[1,0],[1,1],[1,2],[1,3]]
  ],
  2: [ // O
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]]
  ],
  3: [ // T
    [[1,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[2,1],[1,2]],
    [[1,0],[0,1],[1,1],[1,2]]
  ],
  4: [ // S
    [[1,0],[2,0],[0,1],[1,1]],
    [[1,0],[1,1],[2,1],[2,2]],
    [[1,1],[2,1],[0,2],[1,2]],
    [[0,0],[0,1],[1,1],[1,2]]
  ],
  5: [ // Z
    [[0,0],[1,0],[1,1],[2,1]],
    [[2,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[1,2],[2,2]],
    [[1,0],[0,1],[1,1],[0,2]]
  ],
  6: [ // J
    [[0,0],[0,1],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[1,2]],
    [[0,1],[1,1],[2,1],[2,2]],
    [[1,0],[1,1],[0,2],[1,2]]
  ],
  7: [ // L
    [[2,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[2,2]],
    [[0,1],[1,1],[2,1],[0,2]],
    [[0,0],[1,0],[1,1],[1,2]]
  ],
};

const COLORS = [
  "#0F172A", // 0: empty
  "#06B6D4", // 1: cyan
  "#EAB308", // 2: yellow
  "#A855F7", // 3: purple
  "#22C55E", // 4: green
  "#EF4444", // 5: red
  "#3B82F6", // 6: blue
  "#F97316", // 7: orange
];

export default function PlayableDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Game internal state references for the game loop
  const gameState = useRef({
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
    curShape: 1,
    nextShape: 2,
    curRot: 0,
    curPos: [3, 0],
    score: 0,
    lines: 0,
    level: 1,
    fallSpeed: 650,
    lastFall: 0,
    gameOver: false,
    paused: false,
  });

  const checkCollision = (pos: number[], shapeId: number, rot: number, grid: number[][]) => {
    const cells = SHAPES[shapeId][rot % 4];
    for (const [cx, cy] of cells) {
      const gx = pos[0] + cx;
      const gy = pos[1] + cy;
      if (gx < 0 || gx >= COLS || gy >= ROWS) return true;
      if (gy >= 0 && grid[gy][gx] !== 0) return true;
    }
    return false;
  };

  const spawnPiece = () => {
    const s = gameState.current;
    s.curShape = s.nextShape;
    s.nextShape = Math.floor(Math.random() * 7) + 1;
    s.curRot = 0;
    s.curPos = [3, 0];

    if (checkCollision(s.curPos, s.curShape, s.curRot, s.grid)) {
      s.gameOver = true;
      setGameOver(true);
    }
  };

  const lockPiece = () => {
    const s = gameState.current;
    const cells = SHAPES[s.curShape][s.curRot % 4];
    for (const [cx, cy] of cells) {
      const gx = s.curPos[0] + cx;
      const gy = s.curPos[1] + cy;
      if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
        s.grid[gy][gx] = s.curShape;
      }
    }

    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (s.grid[y].every((cell) => cell !== 0)) {
        cleared++;
        s.grid.splice(y, 1);
        s.grid.unshift(Array(COLS).fill(0));
        y++; // Check same index again after unshift
      }
    }

    if (cleared > 0) {
      s.lines += cleared;
      const pts = [0, 100, 300, 500, 800][cleared] * s.level;
      s.score += pts;
      s.level = 1 + Math.floor(s.lines / 10);
      s.fallSpeed = Math.max(120, 650 - (s.level - 1) * 50);

      setScore(s.score);
      setLines(s.lines);
      setLevel(s.level);
    }

    spawnPiece();
  };

  const restartGame = () => {
    const s = gameState.current;
    s.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    s.score = 0;
    s.lines = 0;
    s.level = 1;
    s.fallSpeed = 650;
    s.gameOver = false;
    s.paused = false;
    s.curShape = Math.floor(Math.random() * 7) + 1;
    s.nextShape = Math.floor(Math.random() * 7) + 1;
    s.curPos = [3, 0];

    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = gameState.current;
      if (!hasStarted || s.gameOver || s.paused) return;

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        if (!checkCollision([s.curPos[0] - 1, s.curPos[1]], s.curShape, s.curRot, s.grid)) {
          s.curPos[0] -= 1;
        }
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        if (!checkCollision([s.curPos[0] + 1, s.curPos[1]], s.curShape, s.curRot, s.grid)) {
          s.curPos[0] += 1;
        }
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        const nextRot = (s.curRot + 1) % 4;
        for (const kick of [0, -1, 1]) {
          if (!checkCollision([s.curPos[0] + kick, s.curPos[1]], s.curShape, nextRot, s.grid)) {
            s.curPos[0] += kick;
            s.curRot = nextRot;
            break;
          }
        }
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        if (!checkCollision([s.curPos[0], s.curPos[1] + 1], s.curShape, s.curRot, s.grid)) {
          s.curPos[1] += 1;
          s.score += 1;
          setScore(s.score);
        }
      } else if (e.key === " ") {
        e.preventDefault();
        while (!checkCollision([s.curPos[0], s.curPos[1] + 1], s.curShape, s.curRot, s.grid)) {
          s.curPos[1] += 1;
          s.score += 2;
        }
        setScore(s.score);
        lockPiece();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasStarted]);

  // Main rendering & loop
  useEffect(() => {
    let animId: number;

    const render = (time: number) => {
      const s = gameState.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (hasStarted && !s.gameOver && !s.paused) {
        if (!s.lastFall) s.lastFall = time;
        if (time - s.lastFall >= s.fallSpeed) {
          s.lastFall = time;
          if (!checkCollision([s.curPos[0], s.curPos[1] + 1], s.curShape, s.curRot, s.grid)) {
            s.curPos[1] += 1;
          } else {
            lockPiece();
          }
        }
      }

      // Clear Canvas
      ctx.fillStyle = "#0A0E17";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Lines
      ctx.strokeStyle = "#1A2333";
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, ROWS * CELL_SIZE);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(COLS * CELL_SIZE, y * CELL_SIZE);
        ctx.stroke();
      }

      // Draw Settled Blocks
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const val = s.grid[y][x];
          if (val !== 0) {
            ctx.fillStyle = COLORS[val];
            ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          }
        }
      }

      // Draw Active Piece
      if (hasStarted && !s.gameOver) {
        // Ghost Piece
        let ghostY = s.curPos[1];
        while (!checkCollision([s.curPos[0], ghostY + 1], s.curShape, s.curRot, s.grid)) {
          ghostY += 1;
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1.5;
        for (const [cx, cy] of SHAPES[s.curShape][s.curRot % 4]) {
          const gx = s.curPos[0] + cx;
          const gy = ghostY + cy;
          if (gy >= 0) {
            ctx.strokeRect(gx * CELL_SIZE + 2, gy * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
          }
        }

        // Active Piece Blocks
        ctx.fillStyle = COLORS[s.curShape];
        for (const [cx, cy] of SHAPES[s.curShape][s.curRot % 4]) {
          const gx = s.curPos[0] + cx;
          const gy = s.curPos[1] + cy;
          if (gy >= 0) {
            ctx.fillRect(gx * CELL_SIZE + 1, gy * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [hasStarted]);

  return (
    <section id="demo" className="py-14 border-b border-[#26354D] bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="lg:max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400 text-xs font-mono mb-3">
              LIVE BROWSER PREVIEW
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-3">
              Block Drop
            </h2>
            <p className="text-sm text-[#8E9EB5] leading-relaxed mb-6">
              Our flagship starting project. Experience the responsive falling-block mechanics right here in your browser!
              The full repository contains the primary <strong>Godot 4</strong> engine scene plus <strong>Python (Pygame)</strong>, 
              <strong> Rust (Macroquad)</strong>, and <strong>C (Raylib)</strong> implementations.
            </p>

            <div className="p-4 rounded-lg bg-[#131A26] border border-[#26354D] mb-6 space-y-2 text-xs font-mono text-slate-300">
              <div className="text-white font-bold mb-1">KEYBOARD CONTROLS:</div>
              <div className="flex justify-between">
                <span className="text-[#8E9EB5]">◄ / ► or A / D:</span>
                <span>Move Left / Right</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9EB5]">▲ or W:</span>
                <span>Rotate Piece</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9EB5]">▼ or S:</span>
                <span>Soft Drop (+1 pt)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9EB5]">SPACEBAR:</span>
                <span>Instant Hard Drop</span>
              </div>
            </div>

            <div className="flex gap-3">
              {!hasStarted ? (
                <button
                  onClick={restartGame}
                  className="w-full py-2.5 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors border border-blue-400 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  START GAME
                </button>
              ) : (
                <button
                  onClick={restartGame}
                  className="w-full py-2.5 px-4 rounded-md bg-[#192233] hover:bg-[#202b40] text-slate-200 font-semibold text-sm transition-colors border border-[#26354D] flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  RESTART
                </button>
              )}
            </div>
          </div>

          {/* Canvas & Score Board */}
          <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl bg-[#131A26] border border-[#26354D] mx-auto lg:mx-0 shadow-lg">
            <div className="relative border-2 border-[#26354D] bg-[#0A0E17] rounded">
              <canvas
                ref={canvasRef}
                width={COLS * CELL_SIZE}
                height={ROWS * CELL_SIZE}
                className="block"
              />

              {!hasStarted && (
                <div className="absolute inset-0 bg-[#0A0E17]/90 flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-xl font-mono font-bold text-white mb-2">BLOCK DROP</div>
                  <div className="text-xs text-[#8E9EB5] mb-4">Click below to play directly in browser</div>
                  <button
                    onClick={restartGame}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold"
                  >
                    CLICK TO PLAY
                  </button>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-2xl font-mono font-bold text-red-400 mb-1">GAME OVER</div>
                  <div className="text-xs font-mono text-slate-300 mb-4">Score: {score}</div>
                  <button
                    onClick={restartGame}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold"
                  >
                    PLAY AGAIN
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between w-44">
              <div className="space-y-4">
                <div className="p-3 rounded bg-[#192233] border border-[#26354D]">
                  <div className="text-[11px] font-mono text-[#8E9EB5] uppercase">Score</div>
                  <div className="text-2xl font-mono font-extrabold text-white">{score}</div>
                </div>

                <div className="p-3 rounded bg-[#192233] border border-[#26354D]">
                  <div className="text-[11px] font-mono text-[#8E9EB5] uppercase">Lines Cleared</div>
                  <div className="text-xl font-mono font-bold text-slate-200">{lines}</div>
                </div>

                <div className="p-3 rounded bg-[#192233] border border-[#26354D]">
                  <div className="text-[11px] font-mono text-[#8E9EB5] uppercase">Current Level</div>
                  <div className="text-xl font-mono font-bold text-blue-400">{level}</div>
                </div>

                <div className="p-3 rounded bg-[#192233] border border-[#26354D]">
                  <div className="text-[11px] font-mono text-[#8E9EB5] uppercase mb-2">Next Shape</div>
                  <div className="grid grid-cols-4 gap-1 w-20 h-14 items-center justify-center">
                    {SHAPES[gameState.current.nextShape][0].map(([cx, cy], i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-sm"
                        style={{
                          backgroundColor: COLORS[gameState.current.nextShape],
                          gridColumnStart: cx + 1,
                          gridRowStart: cy + 1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#8E9EB5] text-center pt-2">
                100% Original Code & Palette
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
