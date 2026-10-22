/**
 * @file Header.tsx
 * @description Header bar adhering to the 3-zone Top Bar Contract.
 * Renders the brand wordmark, score telemetry, and action triggers.
 */

import React from 'react';
import { BookOpen, HelpCircle, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  score: number;
  highScore: number;
  moves: number;
  combo: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenGrimoire: () => void;
  onOpenHowToPlay: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  highScore,
  moves,
  combo,
  isMuted,
  onToggleMute,
  onOpenGrimoire,
  onOpenHowToPlay,
  onRestart,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto flex flex-col gap-3 py-3 px-4">
      {/* Top Bar 3-Zone Contract */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        {/* Zone 1: Single Text Element Wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Cinzel',serif]">
            Elemental Fusion
          </span>
        </div>

        {/* Zone 2: Navigation Links / Game Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* How to Play */}
          <button
            onClick={onOpenHowToPlay}
            aria-label="How to play instructions"
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Element Codex / Grimoire */}
          <button
            onClick={onOpenGrimoire}
            aria-label="Open Element Codex"
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Element Codex"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Codex</span>
          </button>

          {/* Mute Audio Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
          </button>

          {/* Zone 3: Primary Restart Action */}
          <button
            onClick={onRestart}
            aria-label="Restart current game"
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-colors flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Restart Run"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Metric Telemetry Row (Anti-Slop Clean Metadata) */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="uppercase text-[10px] tracking-wider text-slate-500 font-medium">Score</span>
            <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums tracking-tight">
              {score.toLocaleString()}
            </span>
          </div>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <div className="flex items-baseline gap-1.5">
            <span className="uppercase text-[10px] tracking-wider text-slate-500 font-medium">Best</span>
            <span className="text-sm sm:text-base font-semibold text-amber-300 font-mono tabular-nums tracking-tight">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-baseline gap-1 text-[11px]">
            <span className="text-slate-500">Moves</span>
            <span className="font-mono tabular-nums text-slate-300">{moves}</span>
          </div>

          {combo > 1 && (
            <>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="text-[11px] font-semibold text-amber-400 animate-pulse font-mono tabular-nums">
                {combo}× Combo
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
