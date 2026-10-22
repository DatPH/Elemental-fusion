/**
 * @file Board.tsx
 * @description The interactive puzzle grid for Elemental Fusion.
 * Implements CSS Grid layout, empty cell backdrop, keyboard controllers, and touch gestures.
 */

import React, { useEffect, useRef } from 'react';
import { BoardSize, Direction, Tile } from '../types/game';
import { TileView } from './TileView';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

interface BoardProps {
  board: (Tile | null)[][];
  boardSize: BoardSize;
  onMove: (direction: Direction) => void;
  disabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({ board, boardSize, onMove, disabled = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook touch swipes
  useSwipeGesture(containerRef, {
    onSwipe: onMove,
    threshold: 28,
    disabled,
  });

  // Hook keyboard inputs (Arrow keys and WASD)
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      let direction: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'RIGHT';
          break;
        default:
          return;
      }

      if (direction) {
        e.preventDefault();
        onMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove, disabled]);

  // Dynamic grid classes based on board dimension
  const gridColsClass =
    boardSize === 3 ? 'grid-cols-3' : boardSize === 5 ? 'grid-cols-5' : 'grid-cols-4';

  const gapClass = boardSize === 5 ? 'gap-2 sm:gap-2.5' : 'gap-2.5 sm:gap-3.5';

  return (
    <div className="w-full max-w-[460px] mx-auto select-none touch-none">
      <div
        ref={containerRef}
        role="region"
        aria-label="Elemental Fusion Grid"
        tabIndex={0}
        className={`
          relative w-full aspect-square p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl
          bg-slate-900/80 backdrop-blur-xl border border-white/10
          shadow-2xl shadow-black/60
          grid ${gridColsClass} ${gapClass}
          focus:outline-none focus:ring-1 focus:ring-amber-400/40
        `}
      >
        {/* Render grid slots */}
        {board.map((row, rIdx) =>
          row.map((cellTile, cIdx) => (
            <div
              key={`cell-${rIdx}-${cIdx}`}
              className="relative w-full h-full rounded-xl sm:rounded-2xl bg-slate-800/40 border border-white/5 flex items-center justify-center overflow-hidden transition-colors duration-200"
            >
              {cellTile ? (
                <TileView tile={cellTile} boardSize={boardSize} />
              ) : (
                /* Subtle empty slot dot */
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700/30" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
