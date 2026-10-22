/**
 * @file GameOverModal.jsx
 * @description Game Over modal overlay with dark glassmorphism styling,
 * final score display, primary Play Again action, and Revive (Watch Ad) placeholder.
 */

import React, { useState } from 'react';
import { Play, RotateCcw, Sparkles, Trophy, Tv } from 'lucide-react';

/**
 * GameOverModal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {number} props.score - Player's final score
 * @param {number} [props.bestScore] - High score achieved
 * @param {Function} props.onRestart - Handler to restart game
 * @param {Function} [props.onRevive] - Handler for watching ad to revive
 */
export default function GameOverModal({
  isOpen,
  score,
  bestScore,
  onRestart,
  onRevive,
}) {
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  if (!isOpen) return null;

  const handleReviveClick = () => {
    if (isWatchingAd) return;
    setIsWatchingAd(true);

    // Simulated rewarded video ad experience (commercialization placeholder)
    setTimeout(() => {
      setIsWatchingAd(false);
      if (onRevive) {
        onRevive();
      }
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Game Over"
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-[340px] sm:max-w-sm rounded-3xl bg-slate-900/90 border border-white/15 p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center">
        {/* Top Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 shadow-lg shadow-rose-500/10">
          <RotateCcw className="w-7 h-7" />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-2xl font-bold text-white font-serif tracking-tight">
          Game Over
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
          The elemental grid has solidified with no moves remaining.
        </p>

        {/* Score Telemetry Box */}
        <div className="w-full my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Final Score
          </span>
          <span className="text-3xl font-extrabold font-mono text-white tabular-nums mt-0.5">
            {score?.toLocaleString() ?? 0}
          </span>

          {bestScore !== undefined && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/10 text-xs text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Best:</span>
              <span className="font-mono font-semibold text-amber-300">
                {bestScore.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Primary "Play Again" Button */}
          <button
            onClick={onRestart}
            className="
              w-full py-3 px-4 rounded-xl text-xs font-semibold
              bg-amber-500 hover:bg-amber-400 text-slate-950
              shadow-lg shadow-amber-500/25 active:scale-95
              transition-all duration-150
              flex items-center justify-center gap-2
            "
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          {/* Secondary "Revive (Watch Ad)" Commercialization Placeholder */}
          <button
            onClick={handleReviveClick}
            disabled={isWatchingAd}
            className="
              w-full py-2.5 px-4 rounded-xl text-xs font-medium
              bg-slate-800/80 hover:bg-slate-700/80 text-amber-300
              border border-amber-500/30 hover:border-amber-400/50
              active:scale-95 transition-all duration-150
              flex items-center justify-center gap-2
            "
          >
            {isWatchingAd ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>Simulating Rewarded Ad...</span>
              </>
            ) : (
              <>
                <Tv className="w-4 h-4 text-amber-400" />
                <span>Revive (Watch Ad)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono">
                  +Clear Rocks
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
