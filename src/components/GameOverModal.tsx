/**
 * @file GameOverModal.tsx
 * @description Victory and Game Over overlay modal presenting end-of-run breakdown,
 * highest tier achieved, and restart/continue controls.
 */

import React from 'react';
import { ELEMENTS } from '../constants/elements';
import { GameStatus } from '../types/game';
import { Award, RotateCcw, Sparkles, Trophy, Undo2 } from 'lucide-react';

interface GameOverModalProps {
  status: GameStatus;
  score: number;
  highScore: number;
  moves: number;
  highestTier: number;
  canUndo: boolean;
  onRestart: () => void;
  onContinue: () => void;
  onUndo: () => void;
  onOpenGrimoire: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  status,
  score,
  highScore,
  moves,
  highestTier,
  canUndo,
  onRestart,
  onContinue,
  onUndo,
  onOpenGrimoire,
}) => {
  if (status === 'PLAYING') return null;

  const isWin = status === 'WON';
  const highestElement = ELEMENTS.find((e) => e.tier === highestTier) || ELEMENTS[0];
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn"
    >
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0d1322] border border-white/10 shadow-2xl flex flex-col items-center text-center">
        {/* Glow backdrop behind badge */}
        <div
          className="absolute -top-12 w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ backgroundColor: highestElement.color }}
        />

        {/* Victory / Defeat Badge */}
        <div
          className={`
            w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4
            bg-gradient-to-br ${highestElement.gradientClass} border shadow-xl
          `}
          style={{
            boxShadow: `0 0 30px -4px ${highestElement.glowColor}`,
          }}
        >
          <span className="drop-shadow-md select-none">{highestElement.symbol}</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white font-['Cinzel',serif] tracking-wide">
          {isWin ? 'Supernova Achieved!' : 'Grid Congested'}
        </h2>

        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          {isWin
            ? 'You have fused the solar singularity. You may continue into the boundless void.'
            : 'No further elemental movements are possible on the current grid.'}
        </p>

        {/* Record Callout */}
        {isNewHighScore && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>New Personal Best Record!</span>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="w-full grid grid-cols-2 gap-2.5 my-6">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Final Score</span>
            <span className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Best Score</span>
            <span className="text-xl font-bold text-amber-300 font-mono tabular-nums mt-0.5">
              {highScore.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Moves</span>
            <span className="text-base font-semibold text-slate-300 font-mono tabular-nums mt-0.5">
              {moves}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Apex Element</span>
            <span className="text-xs font-semibold text-white mt-1 truncate">
              {highestElement.name} (T{highestElement.tier})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {isWin && (
            <button
              onClick={onContinue}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Continue Into The Infinite Void</span>
            </button>
          )}

          {canUndo && !isWin && (
            <button
              onClick={onUndo}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-sky-200 bg-sky-950/40 border border-sky-500/30 hover:bg-sky-900/40 transition-colors flex items-center justify-center gap-2"
            >
              <Undo2 className="w-4 h-4 text-sky-400" />
              <span>Undo Last Move (Try Another Direction)</span>
            </button>
          )}

          <div className="flex items-center gap-2 w-full">
            <button
              onClick={onOpenGrimoire}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 border border-white/10 hover:bg-slate-700/80 transition-colors flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Codex</span>
            </button>

            <button
              onClick={onRestart}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 border border-white/10 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
