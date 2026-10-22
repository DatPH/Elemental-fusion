/**
 * @file CatalystBar.tsx
 * @description Tactical action bar offering undo moves, elemental catalyst power,
 * and grid dimension segmented tabs.
 */

import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sparkles, Undo2 } from 'lucide-react';
import { BoardSize, Direction } from '../types/game';

interface CatalystBarProps {
  canUndo: boolean;
  undoRemaining: number;
  catalystCharges: number;
  boardSize: BoardSize;
  onUndo: () => void;
  onActivateCatalyst: () => void;
  onChangeBoardSize: (size: BoardSize) => void;
  onMove: (direction: Direction) => void;
}

export const CatalystBar: React.FC<CatalystBarProps> = ({
  canUndo,
  undoRemaining,
  catalystCharges,
  boardSize,
  onUndo,
  onActivateCatalyst,
  onChangeBoardSize,
  onMove,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-3 px-4 py-2">
      {/* Tactical Abilities & Mode Selectors */}
      <div className="flex items-center justify-between gap-2">
        {/* Undo Action */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all
            ${
              canUndo
                ? 'bg-slate-800/90 text-slate-200 border border-white/10 hover:bg-slate-700 active:scale-95'
                : 'bg-slate-900/40 text-slate-600 border border-white/5 cursor-not-allowed opacity-50'
            }
          `}
          title={`Undo last move (${undoRemaining} available)`}
        >
          <Undo2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Undo</span>
          <span className="text-[10px] opacity-75 font-mono">({undoRemaining})</span>
        </button>

        {/* Catalyst Transmute Action */}
        <button
          onClick={onActivateCatalyst}
          disabled={catalystCharges <= 0}
          className={`
            px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all
            ${
              catalystCharges > 0
                ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/30 text-amber-200 hover:border-amber-400/60 active:scale-95 shadow-sm'
                : 'bg-slate-900/40 text-slate-600 border border-white/5 cursor-not-allowed opacity-50'
            }
          `}
          title={`Transmute lowest element on grid (${catalystCharges} charges left)`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Catalyst</span>
          <span className="text-[10px] font-mono text-amber-300">({catalystCharges})</span>
        </button>

        {/* Segmented Grid Dimension Control */}
        <div className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-white/10">
          {(
            [
              { size: 3, label: '3×3' },
              { size: 4, label: '4×4' },
              { size: 5, label: '5×5' },
            ] as const
          ).map((item) => (
            <button
              key={item.size}
              onClick={() => onChangeBoardSize(item.size)}
              className={`
                px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap
                ${
                  boardSize === item.size
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* On-Screen D-Pad / Directional Assist for Accessibility or Desktop Mouse Users */}
      <div className="flex sm:hidden items-center justify-center pt-2">
        <div className="grid grid-cols-3 gap-1.5 w-36">
          <div />
          <button
            onClick={() => onMove('UP')}
            aria-label="Slide Up"
            className="w-10 h-10 mx-auto rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-300 active:bg-slate-700 active:scale-95"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div />
          <button
            onClick={() => onMove('LEFT')}
            aria-label="Slide Left"
            className="w-10 h-10 mx-auto rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-300 active:bg-slate-700 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove('DOWN')}
            aria-label="Slide Down"
            className="w-10 h-10 mx-auto rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-300 active:bg-slate-700 active:scale-95"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove('RIGHT')}
            aria-label="Slide Right"
            className="w-10 h-10 mx-auto rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-300 active:bg-slate-700 active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
