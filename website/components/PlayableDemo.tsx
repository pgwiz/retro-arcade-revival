"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw, Pause, Volume2, VolumeX, Trophy, Sparkles, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Zap } from "lucide-react";

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

const LIGHT_COLORS = [
  "#0F172A",
  "#67E8F9", // 1: cyan highlight
  "#FDE047", // 2: yellow highlight
  "#D8B4FE", // 3: purple highlight
  "#86EFAC", // 4: green highlight
  "#FCA5A5", // 5: red highlight
  "#93C5FD", // 6: blue highlight
  "#FDBA74", // 7: orange highlight
];

export default function PlayableDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Game internal state references for the animation frame loop
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
    isMuted: false,
  });

  // Sync muted ref
  useEffect(() => {
    gameState.current.isMuted = isMuted;
    try {
      localStorage.setItem("retro_arcade_muted", isMuted ? "1" : "0");
    } catch {}
  }, [isMuted]);

  // Load High Score and Mute preferences from localStorage
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem("retro_arcade_hi_score");
      if (savedScore) {
        setHighScore(parseInt(savedScore, 10) || 0);
      }
      const savedMute = localStorage.getItem("retro_arcade_muted");
      if (savedMute === "1") {
        setIsMuted(true);
      }
    } catch {}
  }, []);

  // Web Audio Synth engine for authentic 8-bit sound effects
  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playSynthSound = useCallback((
    freq: number,
    type: OscillatorType,
    duration: number,
    endFreq?: number,
    volume = 0.08
  ) => {
    if (gameState.current.isMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay restriction fallback
    }
  }, []);

  const playMoveSound = useCallback(() => {
    playSynthSound(220, "triangle", 0.04, 180, 0.05);
  }, [playSynthSound]);

  const playRotateSound = useCallback(() => {
    playSynthSound(360, "sine", 0.06, 680, 0.06);
  }, [playSynthSound]);

  const playDropSound = useCallback(() => {
    playSynthSound(140, "square", 0.08, 40, 0.08);
  }, [playSynthSound]);

  const playLineClearSound = useCallback((cleared: number) => {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const count = Math.min(4, cleared);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        playSynthSound(notes[i], "square", 0.12, notes[i] * 1.05, 0.09);
      }, i * 65);
    }
  }, [playSynthSound]);

  const playGameOverSound = useCallback(() => {
    playSynthSound(320, "sawtooth", 0.45, 55, 0.1);
  }, [playSynthSound]);

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

  const updateHighScoreIfNeeded = (currentScore: number) => {
    setHighScore((prevHi) => {
      if (currentScore > prevHi) {
        setIsNewRecord(true);
        try {
          localStorage.setItem("retro_arcade_hi_score", currentScore.toString());
        } catch {}
        return currentScore;
      }
      return prevHi;
    });
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
      playGameOverSound();
      updateHighScoreIfNeeded(s.score);
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
      playLineClearSound(cleared);
      updateHighScoreIfNeeded(s.score);
    } else {
      playDropSound();
    }

    spawnPiece();
  };

  const restartGame = () => {
    initAudio();
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
    setIsNewRecord(false);
    setHasStarted(true);
    playRotateSound();
  };

  const togglePause = () => {
    if (!hasStarted || gameState.current.gameOver) return;
    initAudio();
    const nextPaused = !gameState.current.paused;
    gameState.current.paused = nextPaused;
    setIsPaused(nextPaused);
    playSynthSound(nextPaused ? 300 : 450, "sine", 0.08);
  };

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = gameState.current;

      // Global pause toggle with P or Escape
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        e.preventDefault();
        togglePause();
        return;
      }

      // Mute toggle with M
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setIsMuted((prev) => !prev);
        return;
      }

      if (!hasStarted || s.gameOver || s.paused) return;

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        if (!checkCollision([s.curPos[0] - 1, s.curPos[1]], s.curShape, s.curRot, s.grid)) {
          s.curPos[0] -= 1;
          playMoveSound();
        }
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        if (!checkCollision([s.curPos[0] + 1, s.curPos[1]], s.curShape, s.curRot, s.grid)) {
          s.curPos[0] += 1;
          playMoveSound();
        }
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        const nextRot = (s.curRot + 1) % 4;
        for (const kick of [0, -1, 1, -2, 2]) {
          if (!checkCollision([s.curPos[0] + kick, s.curPos[1]], s.curShape, nextRot, s.grid)) {
            s.curPos[0] += kick;
            s.curRot = nextRot;
            playRotateSound();
            break;
          }
        }
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        if (!checkCollision([s.curPos[0], s.curPos[1] + 1], s.curShape, s.curRot, s.grid)) {
          s.curPos[1] += 1;
          s.score += 1;
          setScore(s.score);
          updateHighScoreIfNeeded(s.score);
          playMoveSound();
        }
      } else if (e.key === " ") {
        e.preventDefault();
        let dropCount = 0;
        while (!checkCollision([s.curPos[0], s.curPos[1] + 1], s.curShape, s.curRot, s.grid)) {
          s.curPos[1] += 1;
          dropCount += 2;
        }
        s.score += dropCount;
        setScore(s.score);
        updateHighScoreIfNeeded(s.score);
        lockPiece();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasStarted, playMoveSound, playRotateSound, togglePause]);

  // Touch and virtual controls helper
  const handleVirtualInput = (action: "left" | "right" | "rotate" | "softDrop" | "hardDrop") => {
    initAudio();
    const s = gameState.current;
    if (!hasStarted || s.gameOver || s.paused) return;

    if (action === "left") {
      if (!checkCollision([s.curPos[0] - 1, s.curPos[1]], s.curShape, s.curRot, s.grid)) {
        s.curPos[0] -= 1;
        playMoveSound();
      }
    } else if (action === "right") {
      if (!checkCollision([s.curPos[0] + 1, s.curPos[1]], s.curShape, s.curRot, s.grid)) {
        s.curPos[0] += 1;
        playMoveSound();
      }
    } else if (action === "rotate") {
      const nextRot = (s.curRot + 1) % 4;
      for (const kick of [0, -1, 1, -2, 2]) {
        if (!checkCollision([s.curPos[0] + kick, s.curPos[1]], s.curShape, nextRot, s.grid)) {
          s.curPos[0] += kick;
          s.curRot = nextRot;
          playRotateSound();
          break;
        }
      }
    } else if (action === "softDrop") {
      if (!checkCollision([s.curPos[0], s.curPos[1] + 1], s.curShape, s.curRot, s.grid)) {
        s.curPos[1] += 1;
        s.score += 1;
        setScore(s.score);
        updateHighScoreIfNeeded(s.score);
        playMoveSound();
      }
    } else if (action === "hardDrop") {
      let dropCount = 0;
      while (!checkCollision([s.curPos[0], s.curPos[1] + 1], s.curShape, s.curRot, s.grid)) {
        s.curPos[1] += 1;
        dropCount += 2;
      }
      s.score += dropCount;
      setScore(s.score);
      updateHighScoreIfNeeded(s.score);
      lockPiece();
    }
  };

  // Main rendering loop
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

      // Crisp background
      ctx.fillStyle = "#0A0E17";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Matrix lines
      ctx.strokeStyle = "#162030";
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

      // Draw Settled Blocks with clean retro beveling
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const val = s.grid[y][x];
          if (val !== 0) {
            const bx = x * CELL_SIZE;
            const by = y * CELL_SIZE;

            // Block body
            ctx.fillStyle = COLORS[val];
            ctx.fillRect(bx + 1, by + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            // Subtle retro highlight edge (no glow blur)
            ctx.fillStyle = LIGHT_COLORS[val];
            ctx.fillRect(bx + 2, by + 2, CELL_SIZE - 4, 2);
            ctx.fillRect(bx + 2, by + 2, 2, CELL_SIZE - 4);
          }
        }
      }

      // Draw Active Piece
      if (hasStarted && !s.gameOver) {
        // Ghost Piece Projection
        let ghostY = s.curPos[1];
        while (!checkCollision([s.curPos[0], ghostY + 1], s.curShape, s.curRot, s.grid)) {
          ghostY += 1;
        }

        ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
        ctx.lineWidth = 1.5;
        for (const [cx, cy] of SHAPES[s.curShape][s.curRot % 4]) {
          const gx = s.curPos[0] + cx;
          const gy = ghostY + cy;
          if (gy >= 0) {
            ctx.strokeRect(gx * CELL_SIZE + 2, gy * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
          }
        }

        // Active Moving Piece with retro beveling
        const curColor = COLORS[s.curShape];
        const curHighlight = LIGHT_COLORS[s.curShape];

        for (const [cx, cy] of SHAPES[s.curShape][s.curRot % 4]) {
          const gx = s.curPos[0] + cx;
          const gy = s.curPos[1] + cy;
          if (gy >= 0) {
            const bx = gx * CELL_SIZE;
            const by = gy * CELL_SIZE;

            ctx.fillStyle = curColor;
            ctx.fillRect(bx + 1, by + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            ctx.fillStyle = curHighlight;
            ctx.fillRect(bx + 2, by + 2, CELL_SIZE - 4, 2);
            ctx.fillRect(bx + 2, by + 2, 2, CELL_SIZE - 4);
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
          {/* Left Column: Context & Controls info */}
          <div className="lg:max-w-md w-full">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400 text-xs font-mono mb-3">
              LIVE BROWSER PREVIEW · 8-BIT SYNTH AUDIO
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-3">
              Block Drop
            </h2>
            <p className="text-sm text-[#8E9EB5] leading-relaxed mb-6">
              Our flagship starting project. Experience the responsive falling-block mechanics right here in your browser with real-time procedural Web Audio sound effects!
              The full repository contains the primary <strong>Godot 4</strong> engine scene plus <strong>Python (Pygame)</strong>, 
              <strong> Rust (Macroquad)</strong>, and <strong>C (Raylib)</strong> implementations.
            </p>

            {/* Keyboard Controls Panel */}
            <div className="p-4 rounded-lg bg-[#131A26] border border-[#26354D] mb-5 space-y-2 text-xs font-mono text-slate-300">
              <div className="text-white font-bold mb-1 flex items-center justify-between">
                <span>KEYBOARD CONTROLS</span>
                <span className="text-[10px] text-blue-400 font-normal">DESKTOP</span>
              </div>
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
              <div className="flex justify-between pt-1 border-t border-[#1F2A3D]">
                <span className="text-[#8E9EB5]">P / ESC:</span>
                <span>Pause / Resume</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9EB5]">M:</span>
                <span>Mute / Unmute Synth</span>
              </div>
            </div>

            {/* Action Bar (Audio Mute, Restart, Pause) */}
            <div className="flex flex-wrap gap-2.5">
              {!hasStarted ? (
                <button
                  onClick={restartGame}
                  className="flex-1 py-2.5 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors border border-blue-400 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  START GAME
                </button>
              ) : (
                <>
                  <button
                    onClick={restartGame}
                    className="flex-1 py-2.5 px-3 rounded-md bg-[#192233] hover:bg-[#202b40] text-slate-200 font-semibold text-xs transition-colors border border-[#26354D] flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    RESTART
                  </button>

                  <button
                    onClick={togglePause}
                    disabled={gameOver}
                    className={`px-3 py-2.5 rounded-md font-semibold text-xs transition-colors border flex items-center justify-center gap-1.5 ${
                      isPaused
                        ? "bg-amber-950 border-amber-700 text-amber-300"
                        : "bg-[#192233] hover:bg-[#202b40] text-slate-200 border-[#26354D]"
                    }`}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 fill-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
                    {isPaused ? "RESUME" : "PAUSE"}
                  </button>
                </>
              )}

              <button
                onClick={() => setIsMuted((prev) => !prev)}
                title={isMuted ? "Unmute Retro Synth" : "Mute Sound"}
                className={`px-3 py-2.5 rounded-md text-xs font-mono font-medium transition-colors border flex items-center justify-center gap-1.5 ${
                  isMuted
                    ? "bg-[#131A26] border-[#26354D] text-slate-400"
                    : "bg-[#192233] border-blue-800 text-blue-300"
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
                <span>{isMuted ? "MUTED" : "SOUND ON"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Arcade Cabinet Screen & Stats */}
          <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl bg-[#131A26] border border-[#26354D] mx-auto lg:mx-0 shadow-lg w-full sm:w-auto">
            {/* Screen Frame with subtle scanlines */}
            <div className="relative border-2 border-[#26354D] bg-[#0A0E17] rounded mx-auto overflow-hidden">
              <canvas
                ref={canvasRef}
                width={COLS * CELL_SIZE}
                height={ROWS * CELL_SIZE}
                className="block"
              />

              {/* CRT Scanline Texture (Pure CSS raster, NO glowing blobs) */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 1px, transparent 1px, transparent 2px)",
                }}
              />

              {/* Start Overlay */}
              {!hasStarted && (
                <div className="absolute inset-0 bg-[#0A0E17]/95 flex flex-col items-center justify-center p-4 text-center z-10">
                  <div className="text-xl font-mono font-bold text-white mb-1 tracking-wider">BLOCK DROP</div>
                  <div className="text-[11px] font-mono text-[#8E9EB5] mb-4">Pure Canvas & Web Audio</div>
                  <button
                    onClick={restartGame}
                    className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-wider transition-colors shadow"
                  >
                    CLICK TO INSERT COIN
                  </button>
                </div>
              )}

              {/* Paused Overlay */}
              {hasStarted && isPaused && !gameOver && (
                <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center z-10">
                  <div className="text-xl font-mono font-bold text-amber-400 mb-1 tracking-widest">PAUSED</div>
                  <div className="text-xs font-mono text-slate-300 mb-4">Press P or button to resume</div>
                  <button
                    onClick={togglePause}
                    className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold"
                  >
                    RESUME GAME
                  </button>
                </div>
              )}

              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center z-10">
                  <div className="text-2xl font-mono font-bold text-red-500 mb-1 tracking-wider">GAME OVER</div>
                  <div className="text-xs font-mono text-slate-300 mb-1">Final Score: <span className="font-bold text-white">{score}</span></div>
                  {isNewRecord && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800 mb-3">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      NEW ALL-TIME RECORD!
                    </div>
                  )}
                  <button
                    onClick={restartGame}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-wider mt-2"
                  >
                    PLAY AGAIN
                  </button>
                </div>
              )}
            </div>

            {/* Side Console: Records, Level, Lines, Next Shape */}
            <div className="flex flex-col justify-between w-full sm:w-44 space-y-4">
              <div className="space-y-3">
                {/* Score & High Score */}
                <div className="p-3 rounded bg-[#192233] border border-[#26354D]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-mono text-[#8E9EB5] uppercase">Score</span>
                    {isNewRecord && (
                      <span className="text-[9px] font-mono font-bold text-amber-400 px-1 rounded bg-amber-950/80 border border-amber-800">
                        NEW HIGH!
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-white">{score}</div>
                </div>

                <div className="p-2.5 rounded bg-[#101724] border border-[#1E293B]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 uppercase">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>High Score</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-200">{highScore}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded bg-[#192233] border border-[#26354D]">
                    <div className="text-[10px] font-mono text-[#8E9EB5] uppercase">Lines</div>
                    <div className="text-lg font-mono font-bold text-slate-200">{lines}</div>
                  </div>

                  <div className="p-2.5 rounded bg-[#192233] border border-[#26354D]">
                    <div className="text-[10px] font-mono text-[#8E9EB5] uppercase">Level</div>
                    <div className="text-lg font-mono font-bold text-blue-400">{level}</div>
                  </div>
                </div>

                {/* Next Shape Preview */}
                <div className="p-3 rounded bg-[#192233] border border-[#26354D]">
                  <div className="text-[10px] font-mono text-[#8E9EB5] uppercase mb-2">Next Piece</div>
                  <div className="grid grid-cols-4 gap-1 w-20 h-14 items-center justify-center mx-auto bg-[#0A0E17] p-1.5 rounded border border-[#1F2A3D]">
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

              <div className="pt-2 border-t border-[#1F2A3D] text-[10px] font-mono text-[#8E9EB5] text-center">
                100% Original Code & Audio Synth
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Touch Virtual Control Pad */}
        <div className="mt-8 p-4 rounded-xl bg-[#131A26] border border-[#26354D] max-w-lg mx-auto block lg:hidden">
          <div className="text-[11px] font-mono text-slate-400 text-center uppercase tracking-wider mb-3">
            TOUCH / MOBILE CONTROLS
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onPointerDown={(e) => { e.preventDefault(); handleVirtualInput("left"); }}
              className="w-12 h-12 rounded-lg bg-[#192233] border border-[#26354D] active:bg-blue-600 text-white flex items-center justify-center"
              aria-label="Move Left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onPointerDown={(e) => { e.preventDefault(); handleVirtualInput("rotate"); }}
              className="w-12 h-12 rounded-lg bg-[#192233] border border-blue-500/50 active:bg-blue-600 text-blue-300 flex items-center justify-center font-mono font-bold text-xs"
              aria-label="Rotate"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              onPointerDown={(e) => { e.preventDefault(); handleVirtualInput("right"); }}
              className="w-12 h-12 rounded-lg bg-[#192233] border border-[#26354D] active:bg-blue-600 text-white flex items-center justify-center"
              aria-label="Move Right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onPointerDown={(e) => { e.preventDefault(); handleVirtualInput("softDrop"); }}
              className="w-12 h-12 rounded-lg bg-[#192233] border border-[#26354D] active:bg-blue-600 text-white flex items-center justify-center"
              aria-label="Soft Drop"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onPointerDown={(e) => { e.preventDefault(); handleVirtualInput("hardDrop"); }}
              className="px-3 h-12 rounded-lg bg-blue-600 active:bg-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1 border border-blue-400"
              aria-label="Hard Drop"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>DROP</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
