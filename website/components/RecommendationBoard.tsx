"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ThumbsUp, PlusCircle, Sparkles, Send, Check, ArrowUpDown, Filter, Search, X } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  era: string;
  genre: string;
  suggestedEngine: string;
  dimension: "2D" | "3D";
  votes: number;
  author: string;
  reason: string;
  hasVoted?: boolean;
  createdAt?: number;
}

const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "REC-1",
    title: "Scorched Earth (Artillery Tactics)",
    era: "1991",
    genre: "Turn-based Strategy",
    suggestedEngine: "Rust (Macroquad)",
    dimension: "2D",
    votes: 42,
    author: "retro_dan",
    reason: "The mother of all artillery tank battle games! Destructible terrain, dynamic wind, shield defense, and MIRV missiles. Extremely underserved today.",
    createdAt: 1700000000000,
  },
  {
    id: "REC-2",
    title: "Marble Madness 3D (Ramp Physics)",
    era: "1984",
    genre: "Physics / Arcade",
    suggestedEngine: "Godot 4",
    dimension: "3D",
    votes: 38,
    author: "physics_coder",
    reason: "Godot 4's RigidBody3D is tailor-made for this. Narrow isometric aerial paths, marble momentum, and dynamic gravity obstacles.",
    createdAt: 1700001000000,
  },
  {
    id: "REC-3",
    title: "Lemmings (Path Swarm Strategy)",
    era: "1991",
    genre: "Puzzle / Strategy",
    suggestedEngine: "C (Raylib)",
    dimension: "2D",
    votes: 35,
    author: "pixel_dev",
    reason: "Directing marching critters by assigning digger, blocker, and builder roles. Almost no modern open-source engine does this cleanly.",
    createdAt: 1700002000000,
  },
  {
    id: "REC-4",
    title: "Chip's Challenge (Grid Obstacle Puzzle)",
    era: "1989",
    genre: "Grid Puzzle",
    suggestedEngine: "Godot 4",
    dimension: "2D",
    votes: 29,
    author: "puzzle_lover",
    reason: "Classic tile puzzles with sliding ice, locked colored doors, and chips to collect. Perfect fit for our shared grid mover library.",
    createdAt: 1700003000000,
  },
  {
    id: "REC-5",
    title: "Wolfenstein / Corridor Raycaster",
    era: "1992",
    genre: "Shooter",
    suggestedEngine: "C (Raylib)",
    dimension: "3D",
    votes: 24,
    author: "asm_fanatic",
    reason: "Pure DDA raycaster implementation. A fantastic educational project for anyone learning low-level rendering.",
    createdAt: 1700004000000,
  },
];

export default function RecommendationBoard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");
  const [dimensionFilter, setDimensionFilter] = useState<"all" | "2D" | "3D">("all");
  const [engineFilter, setEngineFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load persisted recommendations and votes
  useEffect(() => {
    try {
      const saved = localStorage.getItem("retro_arcade_recs_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecommendations(parsed);
        }
      }
    } catch {}
  }, []);

  const saveRecommendations = (newRecs: Recommendation[]) => {
    setRecommendations(newRecs);
    try {
      localStorage.setItem("retro_arcade_recs_v1", JSON.stringify(newRecs));
    } catch {}
  };

  const [formData, setFormData] = useState({
    title: "",
    era: "",
    genre: "Arcade",
    suggestedEngine: "Godot 4",
    dimension: "2D" as "2D" | "3D",
    author: "",
    reason: "",
  });

  const handleVote = (id: string) => {
    const updated = recommendations.map((rec) => {
      if (rec.id === id) {
        const hasVoted = rec.hasVoted;
        return {
          ...rec,
          votes: hasVoted ? rec.votes - 1 : rec.votes + 1,
          hasVoted: !hasVoted,
        };
      }
      return rec;
    });
    saveRecommendations(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.reason.trim()) return;

    const newRec: Recommendation = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      title: formData.title.trim(),
      era: formData.era.trim() || "Retro Era",
      genre: formData.genre,
      suggestedEngine: formData.suggestedEngine,
      dimension: formData.dimension,
      votes: 1,
      author: formData.author.trim() || "Community Member",
      reason: formData.reason.trim(),
      hasVoted: true,
      createdAt: Date.now(),
    };

    saveRecommendations([newRec, ...recommendations]);
    setFormData({
      title: "",
      era: "",
      genre: "Arcade",
      suggestedEngine: "Godot 4",
      dimension: "2D",
      author: "",
      reason: "",
    });
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowForm(false);
    }, 1500);
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...recommendations];

    // Dimension filter
    if (dimensionFilter !== "all") {
      list = list.filter((r) => r.dimension === dimensionFilter);
    }

    // Engine filter
    if (engineFilter !== "all") {
      list = list.filter((r) => r.suggestedEngine.toLowerCase().includes(engineFilter.toLowerCase()));
    }

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.genre.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "votes") {
      list.sort((a, b) => b.votes - a.votes);
    } else {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return list;
  }, [recommendations, dimensionFilter, engineFilter, searchQuery, sortBy]);

  const totalVotesCast = recommendations.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <section id="recommendations" className="py-14 border-b border-[#26354D] bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">
              COMMUNITY VOICE
            </div>
            <h2 className="text-3xl font-extrabold text-white font-mono">
              Game Recommendations & Upvotes
            </h2>
            <p className="text-sm text-[#8E9EB5] mt-1">
              What vintage classic do you want to see open-sourced next? Propose an idea and let the community vote!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors border border-blue-400"
            >
              <PlusCircle className="w-4 h-4" />
              {showForm ? "CLOSE FORM" : "PROPOSE A GAME"}
            </button>
          </div>
        </div>

        {/* Suggestion Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 p-6 rounded-xl bg-[#131A26] border border-[#26354D] space-y-4"
          >
            <div className="text-sm font-mono font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Propose a Retro Game Recreation
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="block text-[#8E9EB5] mb-1">Game Inspiration Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scorched Earth / Lemmings"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0A0E17] border border-[#26354D] text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[#8E9EB5] mb-1">Original Era / Year</label>
                <input
                  type="text"
                  placeholder="e.g. 1991 / DOS era"
                  value={formData.era}
                  onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0A0E17] border border-[#26354D] text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[#8E9EB5] mb-1">Your Name / Handle</label>
                <input
                  type="text"
                  placeholder="e.g. retro_fan"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0A0E17] border border-[#26354D] text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="block text-[#8E9EB5] mb-1">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0A0E17] border border-[#26354D] text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Arcade">Arcade</option>
                  <option value="Puzzle">Puzzle</option>
                  <option value="Shooter">Shooter</option>
                  <option value="Turn-based Strategy">Turn-based Strategy</option>
                  <option value="Platformer">Platformer</option>
                  <option value="Physics / 3D">Physics / 3D</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8E9EB5] mb-1">Suggested Engine</label>
                <select
                  value={formData.suggestedEngine}
                  onChange={(e) => setFormData({ ...formData, suggestedEngine: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0A0E17] border border-[#26354D] text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Godot 4">Godot 4 (Primary Engine)</option>
                  <option value="Rust (Macroquad)">Rust (Macroquad)</option>
                  <option value="C (Raylib)">C (Raylib)</option>
                  <option value="Python (Pygame)">Python (Pygame)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8E9EB5] mb-1">Dimension</label>
                <select
                  value={formData.dimension}
                  onChange={(e) => setFormData({ ...formData, dimension: e.target.value as "2D" | "3D" })}
                  className="w-full px-3 py-2 rounded bg-[#0A0E17] border border-[#26354D] text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                </select>
              </div>
            </div>

            <div className="text-xs font-mono">
              <label className="block text-[#8E9EB5] mb-1">Why should this be recreated? Mechanics description *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe key mechanics, why it is hard to find or play today, and what clean-room twists you envision..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0A0E17] border border-[#26354D] text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-[#192233] text-slate-300 font-mono text-xs border border-[#26354D]"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold flex items-center gap-1.5"
              >
                {formSubmitted ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    SUBMITTED!
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    SUBMIT RECOMMENDATION
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Filter Bar: Sort, Dimension, Engine, Search */}
        <div className="p-4 mb-6 rounded-lg bg-[#131A26] border border-[#26354D] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs font-mono">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search recommendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded bg-[#0A0E17] border border-[#26354D] text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Toggle */}
            <div className="flex items-center gap-1.5 text-[#8E9EB5]">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
              <button
                onClick={() => setSortBy("votes")}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  sortBy === "votes"
                    ? "bg-blue-600 border-blue-500 text-white font-bold"
                    : "border-transparent text-[#8E9EB5] hover:text-white"
                }`}
              >
                MOST UPVOTED
              </button>
              <button
                onClick={() => setSortBy("recent")}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  sortBy === "recent"
                    ? "bg-blue-600 border-blue-500 text-white font-bold"
                    : "border-transparent text-[#8E9EB5] hover:text-white"
                }`}
              >
                NEWEST
              </button>
            </div>

            {/* Dimension Pills */}
            <div className="flex items-center gap-1.5 text-[#8E9EB5]">
              <span className="text-[11px]">DIMENSION:</span>
              {(["all", "2D", "3D"] as const).map((dim) => (
                <button
                  key={dim}
                  onClick={() => setDimensionFilter(dim)}
                  className={`px-2 py-1 rounded border transition-colors text-[11px] ${
                    dimensionFilter === dim
                      ? "bg-slate-700 border-slate-500 text-white"
                      : "border-transparent text-[#8E9EB5] hover:text-slate-200"
                  }`}
                >
                  {dim.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats banner */}
        <div className="flex items-center justify-between text-xs font-mono text-[#8E9EB5] mb-4 px-1">
          <div>
            Showing <span className="text-white font-bold">{filteredAndSorted.length}</span> proposals
          </div>
          <div>
            Total Upvotes Cast: <span className="text-blue-400 font-bold">{totalVotesCast}</span>
          </div>
        </div>

        {/* Recommendations List */}
        {filteredAndSorted.length === 0 ? (
          <div className="p-12 text-center rounded-lg bg-[#131A26] border border-[#26354D]">
            <p className="text-sm font-mono text-[#8E9EB5] mb-2">No recommendations match your search.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setDimensionFilter("all");
                setEngineFilter("all");
              }}
              className="text-xs font-mono text-blue-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSorted.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-lg bg-[#131A26] border border-[#26354D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#374B6B] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-white text-base">{rec.title}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#192233] border border-[#26354D] text-slate-300">
                      {rec.era}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-blue-300">
                      {rec.genre}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                      {rec.suggestedEngine} · {rec.dimension}
                    </span>
                  </div>

                  <p className="text-xs text-[#8E9EB5] leading-relaxed mb-2">{rec.reason}</p>
                  <div className="text-[11px] font-mono text-slate-500">
                    Proposed by: <span className="text-slate-400">{rec.author}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => handleVote(rec.id)}
                    title={rec.hasVoted ? "Remove upvote" : "Upvote this proposal"}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-mono text-xs font-bold border transition-colors ${
                      rec.hasVoted
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-[#192233] border-[#26354D] text-slate-300 hover:border-blue-500"
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${rec.hasVoted ? "fill-white" : ""}`} />
                    <span>{rec.votes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
