/**
 * @file App.jsx
 * @description Main container for Elemental Fusion.
 * Integrates Controller layer (keyboard arrows & touch swipe gestures with scroll suppression),
 * Lava & Dead Rock mechanics, the GameOverModal overlay with revive support,
 * and an interactive Trial Mode tutorial with skip and revisit options.
 */

import React, { useRef, useEffect, useState } from 'react';
import useGameEngine from './hooks/useGameEngine';
import Board from './Board';
import GameOverModal from './GameOverModal';
import TutorialModal from './TutorialModal';
import { RotateCcw, Trophy, Sparkles, GraduationCap } from 'lucide-react';

export default function App() {
  const { board, score, bestScore, isGameOver, isWon, newGame, revive, move } = useGameEngine();
  const boardRef = useRef(null);

  // Tutorial state: auto-open for first-time players, revisit anytime
  const [isTutorialOpen, setIsTutorialOpen] = useState(() => {
    try {
      const completed = localStorage.getItem('elemental_fusion_tutorial_completed');
      return !completed; // True on first arrival
    } catch {
      return false;
    }
  });

  const handleFinishTutorial = () => {
    setIsTutorialOpen(false);
    try {
      localStorage.setItem('elemental_fusion_tutorial_completed', 'true');
    } catch {
      // Storage restricted
    }
  };

  const handleCloseTutorial = () => {
    setIsTutorialOpen(false);
    try {
      localStorage.setItem('elemental_fusion_tutorial_completed', 'true');
    } catch {
      // Storage restricted
    }
  };

  // 1. Controller: Keyboard Inputs (disabled while Tutorial modal is active)
  useEffect(() => {
    if (isTutorialOpen) return;

    const handleKeyDown = (e) => {
      // Don't intercept if user is inside an input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          move('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          move('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          move('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          move('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, isTutorialOpen]);

  // 2. Controller: Touch Swipe Gestures with Scroll Prevention
  useEffect(() => {
    if (isTutorialOpen) return;

    const boardEl = boardRef.current;
    if (!boardEl) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    };

    const handleTouchMove = (e) => {
      // Critical: strictly prevent default scroll / pull-to-refresh while swiping over the board
      if (isSwiping && e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping || e.changedTouches.length === 0) return;
      isSwiping = false;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      const minSwipeDistance = 25; // Responsive threshold for quick swipes
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) < minSwipeDistance) return;

      if (absX > absY) {
        move(deltaX > 0 ? 'RIGHT' : 'LEFT');
      } else {
        move(deltaY > 0 ? 'DOWN' : 'UP');
      }
    };

    // Note: { passive: false } allows preventDefault() on touchmove to stop page dragging
    boardEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    boardEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    boardEl.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      boardEl.removeEventListener('touchstart', handleTouchStart);
      boardEl.removeEventListener('touchmove', handleTouchMove);
      boardEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, [move, isTutorialOpen]);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between items-center px-4 py-6 sm:py-8 select-none relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center gap-6 my-auto">
        {/* Header: Title, Score Telemetry, and Action Buttons */}
        <header className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {/* Game Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
                Elemental Fusion
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Merge elements to reach <span className="text-amber-400 font-semibold">Supernova</span>
              </p>
            </div>

            {/* Action Buttons: Trial Mode & New Game */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTutorialOpen(true)}
                aria-label="Open Trial Mode Tutorial"
                className="
                  px-2.5 py-2 rounded-xl text-xs font-semibold
                  bg-slate-800/80 text-amber-300 border border-amber-500/30
                  hover:bg-slate-700/80 hover:border-amber-400/60 hover:text-amber-200
                  active:scale-95 transition-all duration-150
                  flex items-center gap-1.5 whitespace-nowrap
                "
                title="Practice in Trial Mode"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Trial</span>
              </button>

              <button
                onClick={newGame}
                aria-label="Start a new game"
                className="
                  px-3 py-2 rounded-xl text-xs font-semibold
                  bg-slate-800/90 text-slate-200 border border-white/10
                  hover:bg-slate-700/90 hover:text-white hover:border-white/25 hover:shadow-lg hover:shadow-amber-500/10
                  active:scale-95 transition-all duration-150
                  flex items-center gap-1.5 whitespace-nowrap
                "
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>New Game</span>
              </button>
            </div>
          </div>

          {/* Score & Best Score Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Current Score */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Score
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
                {score.toLocaleString()}
              </span>
            </div>

            {/* Best Score */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center">
              <div className="flex items-center gap-1 text-slate-400">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] uppercase tracking-wider font-medium">Best</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300 tabular-nums mt-0.5">
                {bestScore.toLocaleString()}
              </span>
            </div>
          </div>
        </header>

        {/* 4x4 Game Board */}
        <main className="w-full relative">
          <Board board={board} boardRef={boardRef} />

          {/* Victory Overlay (Supernova Reached) */}
          {isWon && !isGameOver && (
            <div className="absolute inset-0 z-20 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
              <div className="p-3 rounded-full bg-amber-400/20 mb-2">
                <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white font-serif">
                Supernova Achieved!
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-[240px]">
                You forged the celestial solar singularity! Continue playing to push your high score.
              </p>
              <button
                onClick={newGame}
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
              >
                Start New Voyage
              </button>
            </div>
          )}

          {/* Game Over Modal with Dark Glassmorphism and Revive Support */}
          <GameOverModal
            isOpen={isGameOver}
            score={score}
            bestScore={bestScore}
            onRestart={newGame}
            onRevive={revive}
          />

          {/* Interactive Step-by-Step Trial Mode Tutorial */}
          <TutorialModal
            isOpen={isTutorialOpen}
            onClose={handleCloseTutorial}
            onFinishTutorial={handleFinishTutorial}
          />
        </main>

        {/* Minimalist Instructions & Touch Arrows */}
        <footer className="w-full flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>Swipe or Arrow keys to fuse</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Revisit Trial Mode
            </button>
          </div>

          {/* Quick On-Screen Touch Controls for Accessibility */}
          <div className="grid grid-cols-3 gap-1.5 w-32 sm:hidden pt-1">
            <div />
            <button
              onClick={() => move('UP')}
              aria-label="Up"
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 active:bg-white/20 active:scale-95"
            >
              ↑
            </button>
            <div />
            <button
              onClick={() => move('LEFT')}
              aria-label="Left"
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 active:bg-white/20 active:scale-95"
            >
              ←
            </button>
            <button
              onClick={() => move('DOWN')}
              aria-label="Down"
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 active:bg-white/20 active:scale-95"
            >
              ↓
            </button>
            <button
              onClick={() => move('RIGHT')}
              aria-label="Right"
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 active:bg-white/20 active:scale-95"
            >
              →
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
