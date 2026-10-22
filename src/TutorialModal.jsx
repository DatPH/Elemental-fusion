/**
 * @file TutorialModal.jsx
 * @description Interactive Trial Mode & Step-by-Step Tutorial for Elemental Fusion.
 * Provides interactive sandboxed scenarios for movement, element fusion, hazards (Lava & Dead Rock),
 * with skip and revisit controls anytime.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Tile from './Tile';
import { soundFX } from './audio/soundFX';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  GraduationCap,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';

/**
 * Tutorial Steps Definition with pre-set board scenarios and win conditions.
 */
const TUTORIAL_STEPS = [
  {
    id: 'movement',
    title: 'The Art of Movement',
    subTitle: 'Step 1 of 5',
    instruction: 'Swipe RIGHT or press [→] / [D] to slide the Water droplet to the wall.',
    hint: 'All tiles on the grid slide together until obstructed by walls or other tiles.',
    initialBoard: [
      [null, null, null, null],
      [null, null, null, null],
      [{ id: 'tut-w1', element: 'WATER', value: 2, level: 1, isNew: true }, null, null, null],
      [null, null, null, null],
    ],
    // Completed when the tile moves to the right column (col 3)
    isComplete: (board) => {
      return board.some((row) => row[3] && row[3].element === 'WATER');
    },
    completionMessage: 'Great slide! Tiles glide uninterrupted across empty space.',
  },
  {
    id: 'fusion',
    title: 'Elemental Fusion',
    subTitle: 'Step 2 of 5',
    instruction: 'Slide RIGHT [→] to collide the two identical WATER tiles and forge FIRE!',
    hint: 'When two matching elements collide, they merge into the next alchemical tier.',
    initialBoard: [
      [null, null, null, null],
      [null, null, null, null],
      [
        null,
        { id: 'tut-w1', element: 'WATER', value: 2, level: 1 },
        null,
        { id: 'tut-w2', element: 'WATER', value: 2, level: 1 },
      ],
      [null, null, null, null],
    ],
    // Completed when FIRE is formed
    isComplete: (board) => {
      return board.some((row) => row.some((tile) => tile && tile.element === 'FIRE'));
    },
    completionMessage: 'Fusion mastered! WATER (2) + WATER (2) = FIRE (4).',
  },
  {
    id: 'chain_combos',
    title: 'Chain Reactions & Combos',
    subTitle: 'Step 3 of 5',
    instruction: 'Slide DOWN [↓] to merge the FIRE tiles and synthesize EARTH.',
    hint: 'Chaining multiple merges boosts your Combo Multiplier and ramps up points.',
    initialBoard: [
      [null, { id: 'tut-f1', element: 'FIRE', value: 4, level: 2 }, null, null],
      [null, null, null, null],
      [null, { id: 'tut-f2', element: 'FIRE', value: 4, level: 2 }, null, null],
      [null, null, null, null],
    ],
    // Completed when EARTH is formed
    isComplete: (board) => {
      return board.some((row) => row.some((tile) => tile && tile.element === 'EARTH'));
    },
    completionMessage: 'Flawless! FIRE + FIRE forged EARTH (8 points).',
  },
  {
    id: 'lava_hazard',
    title: 'The Lava Hazard & Dead Rock',
    subTitle: 'Step 4 of 5',
    instruction: 'Swipe or press any arrow 3 times to watch the volatile LAVA solidify.',
    hint: 'LAVA counts down its lifetime turn by turn. At zero, it becomes immovable DEAD ROCK!',
    initialBoard: [
      [{ id: 'tut-lava', element: 'LAVA', type: 'LAVA', lifetime: 3, value: 0, isNew: true }, null, null, null],
      [null, { id: 'tut-w1', element: 'WATER', value: 2, level: 1 }, null, null],
      [null, null, { id: 'tut-w2', element: 'WATER', value: 2, level: 1 }, null],
      [null, null, null, null],
    ],
    // Completed when DEAD_ROCK appears
    isComplete: (board) => {
      return board.some((row) => row.some((tile) => tile && tile.element === 'DEAD_ROCK'));
    },
    completionMessage: 'Dead Rock formed! Remember: Dead Rock cannot be moved or merged.',
  },
  {
    id: 'supernova_goal',
    title: 'The Great Convergence (Goal)',
    subTitle: 'Step 5 of 5',
    instruction: 'Slide UP [↑] to combine your ASTRAL cores into the legendary SUPERNOVA!',
    hint: 'Reaching SUPERNOVA (2048) wins the voyage! You can continue into the Void.',
    initialBoard: [
      [null, null, { id: 'tut-astral1', element: 'ASTRAL', value: 1024, level: 10 }, null],
      [null, null, null, null],
      [null, null, { id: 'tut-astral2', element: 'ASTRAL', value: 1024, level: 10 }, null],
      [null, null, null, null],
    ],
    // Completed when SUPERNOVA is formed
    isComplete: (board) => {
      return board.some((row) => row.some((tile) => tile && tile.element === 'SUPERNOVA'));
    },
    completionMessage: 'The Singularity is awakened! You are fully prepared for the journey.',
  },
];

/**
 * Slide helper for trial sandbox
 */
function trialSlideLine(line) {
  const nonNull = line.filter(Boolean);
  const result = [];
  let merged = false;

  let i = 0;
  while (i < nonNull.length) {
    const current = nonNull[i];
    const next = nonNull[i + 1];

    if (
      next &&
      current.element !== 'DEAD_ROCK' &&
      current.element !== 'LAVA' &&
      current.element === next.element
    ) {
      // Determine next element
      const tierMap = {
        WATER: { next: 'FIRE', val: 4, lvl: 2 },
        FIRE: { next: 'EARTH', val: 8, lvl: 3 },
        EARTH: { next: 'SEA', val: 16, lvl: 4 },
        SEA: { next: 'AIR', val: 32, lvl: 5 },
        ASTRAL: { next: 'SUPERNOVA', val: 2048, lvl: 11 },
      };
      const upgrade = tierMap[current.element] || { next: 'FIRE', val: 4, lvl: 2 };

      result.push({
        id: `trial-${Date.now()}-${Math.random()}`,
        element: upgrade.next,
        value: upgrade.val,
        level: upgrade.lvl,
        isMerged: true,
      });
      merged = true;
      i += 2;
    } else {
      result.push({ ...current, isNew: false, isMerged: false });
      i += 1;
    }
  }

  while (result.length < line.length) {
    result.push(null);
  }

  return { newLine: result, merged };
}

export default function TutorialModal({ isOpen, onClose, onFinishTutorial }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [trialBoard, setTrialBoard] = useState(TUTORIAL_STEPS[0].initialBoard);
  const [isStepSuccess, setIsStepSuccess] = useState(false);
  const boardRef = useRef(null);

  const step = TUTORIAL_STEPS[currentStepIndex];

  // Reset sandbox when switching steps
  const resetStep = useCallback((stepIdx = currentStepIndex) => {
    const targetStep = TUTORIAL_STEPS[stepIdx];
    // Deep clone initial board
    const freshBoard = targetStep.initialBoard.map((row) =>
      row.map((cell) => (cell ? { ...cell } : null))
    );
    setTrialBoard(freshBoard);
    setIsStepSuccess(false);
  }, [currentStepIndex]);

  useEffect(() => {
    if (isOpen) {
      resetStep(currentStepIndex);
    }
  }, [isOpen, currentStepIndex, resetStep]);

  // Execute trial move
  const executeTrialMove = useCallback(
    (direction) => {
      if (isStepSuccess && currentStepIndex === TUTORIAL_STEPS.length - 1) return;

      const isHorizontal = direction === 'LEFT' || direction === 'RIGHT';
      const isReverse = direction === 'RIGHT' || direction === 'DOWN';
      const newGrid = Array.from({ length: 4 }, () => Array(4).fill(null));
      let changed = false;
      let hasMerge = false;

      for (let i = 0; i < 4; i++) {
        const line = [];
        for (let j = 0; j < 4; j++) {
          const r = isHorizontal ? i : j;
          const c = isHorizontal ? j : i;
          line.push(trialBoard[r][c]);
        }

        const lineToSlide = isReverse ? [...line].reverse() : line;
        const { newLine, merged } = trialSlideLine(lineToSlide);
        const finalLine = isReverse ? [...newLine].reverse() : newLine;

        if (merged) hasMerge = true;

        for (let j = 0; j < 4; j++) {
          const r = isHorizontal ? i : j;
          const c = isHorizontal ? j : i;
          newGrid[r][c] = finalLine[j];

          const prev = trialBoard[r][c];
          const curr = finalLine[j];
          if (
            (!prev && curr) ||
            (prev && !curr) ||
            (prev && curr && (prev.element !== curr.element || prev.id !== curr.id))
          ) {
            changed = true;
          }
        }
      }

      if (!changed) return;

      // Handle Lava decrement in trial mode
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const tile = newGrid[r][c];
          if (tile && tile.element === 'LAVA') {
            const nextLife = (tile.lifetime ?? 3) - 1;
            if (nextLife <= 0) {
              newGrid[r][c] = {
                ...tile,
                element: 'DEAD_ROCK',
                type: 'DEAD_ROCK',
                lifetime: 0,
              };
            } else {
              newGrid[r][c] = {
                ...tile,
                lifetime: nextLife,
              };
            }
          }
        }
      }

      setTrialBoard(newGrid);

      // Play audio
      if (hasMerge) {
        soundFX.playMerge(step.id === 'supernova_goal' ? 11 : 3, 1);
      } else {
        soundFX.playSlide();
      }

      // Check step completion
      if (step.isComplete(newGrid)) {
        setIsStepSuccess(true);
        soundFX.playVictory();
      }
    },
    [trialBoard, step, isStepSuccess, currentStepIndex]
  );

  // Keyboard navigation for trial
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          executeTrialMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          executeTrialMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          executeTrialMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          executeTrialMove('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, executeTrialMove]);

  // Touch Swipe for trial
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl || !isOpen) return;

    let startX = 0;
    let startY = 0;
    let swiping = false;

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      swiping = true;
    };

    const onTouchMove = (e) => {
      if (swiping && e.cancelable) e.preventDefault();
    };

    const onTouchEnd = (e) => {
      if (!swiping || e.changedTouches.length === 0) return;
      swiping = false;

      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) < 25) return;

      if (absX > absY) {
        executeTrialMove(deltaX > 0 ? 'RIGHT' : 'LEFT');
      } else {
        executeTrialMove(deltaY > 0 ? 'DOWN' : 'UP');
      }
    };

    boardEl.addEventListener('touchstart', onTouchStart, { passive: true });
    boardEl.addEventListener('touchmove', onTouchMove, { passive: false });
    boardEl.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      boardEl.removeEventListener('touchstart', onTouchStart);
      boardEl.removeEventListener('touchmove', onTouchMove);
      boardEl.removeEventListener('touchend', onTouchEnd);
    };
  }, [isOpen, executeTrialMove]);

  if (!isOpen) return null;

  // Flatten active tiles for absolute sliding
  const activeTiles = [];
  trialBoard.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) {
        activeTiles.push({ ...cell, row: r, col: c });
      }
    });
  });

  const isFinalStep = currentStepIndex === TUTORIAL_STEPS.length - 1;

  const handleNextStep = () => {
    if (isFinalStep) {
      onFinishTutorial();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Trial Mode Tutorial"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
    >
      <div className="relative w-full max-w-lg max-h-[95vh] flex flex-col rounded-3xl bg-[#0d1322] border border-white/15 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-900/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-serif tracking-wide">
                Trial Mode: {step.title}
              </h2>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>{step.subTitle}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-medium">Interactive Practice</span>
              </div>
            </div>
          </div>

          {/* Skip / Close Button */}
          <button
            onClick={onClose}
            aria-label="Skip Tutorial"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
            title="Skip directly to the game"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Trial Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col items-center gap-3.5">
          {/* Mission Instruction Card */}
          <div
            className={`
              w-full p-3.5 rounded-2xl border transition-all duration-200
              ${
                isStepSuccess
                  ? 'bg-emerald-950/40 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-white/10'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {isStepSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce-short" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                  {isStepSuccess ? step.completionMessage : step.instruction}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {step.hint}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Mini Board */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square">
            <div
              ref={boardRef}
              className="
                relative w-full h-full
                bg-white/10 backdrop-blur-md
                rounded-2xl p-2
                border border-white/15 shadow-2xl shadow-black/50
                overflow-hidden
              "
            >
              {/* 16 Static Cells */}
              <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1.5 sm:gap-2">
                {Array.from({ length: 16 }).map((_, idx) => (
                  <div
                    key={`trial-bg-${idx}`}
                    className="w-full h-full rounded-xl bg-white/5 border border-white/5 flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>

              {/* Active Sliding Tiles */}
              <div className="absolute inset-0 p-2 pointer-events-none">
                <div className="relative w-full h-full">
                  {activeTiles.map((tile) => (
                    <Tile
                      key={tile.id}
                      element={tile.element}
                      value={tile.value}
                      tile={tile}
                      isNew={tile.isNew}
                      isMerged={tile.isMerged}
                      row={tile.row}
                      col={tile.col}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick On-Screen Directional Pad for Mobile / Mouse Users */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => resetStep()}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 flex items-center gap-1.5 transition-colors"
              title="Reset current trial scenario"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset</span>
            </button>

            {/* Compact D-Pad */}
            <div className="grid grid-cols-3 gap-1 w-28">
              <div />
              <button
                onClick={() => executeTrialMove('UP')}
                aria-label="Slide Up"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/20 active:scale-95"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <div />
              <button
                onClick={() => executeTrialMove('LEFT')}
                aria-label="Slide Left"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/20 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeTrialMove('DOWN')}
                aria-label="Slide Down"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/20 active:scale-95"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeTrialMove('RIGHT')}
                aria-label="Slide Right"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/20 active:scale-95"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-slate-900/70 flex items-center justify-between">
          {/* Step Back button */}
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className={`
              px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1
              ${
                currentStepIndex === 0
                  ? 'text-slate-600 opacity-40 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10'
              }
            `}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  resetStep(idx);
                }}
                className={`
                  w-2.5 h-2.5 rounded-full transition-all
                  ${
                    idx === currentStepIndex
                      ? 'bg-amber-400 w-5'
                      : idx < currentStepIndex
                      ? 'bg-emerald-400'
                      : 'bg-white/20 hover:bg-white/40'
                  }
                `}
                title={`Go to ${s.title}`}
              />
            ))}
          </div>

          {/* Next Step or Finish CTA */}
          <button
            onClick={handleNextStep}
            className={`
              px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95
              ${
                isStepSuccess || isFinalStep
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
              }
            `}
          >
            <span>{isFinalStep ? 'Start Voyage' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
