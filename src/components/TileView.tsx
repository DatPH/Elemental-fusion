/**
 * @file TileView.tsx
 * @description Visual rendering of an individual elemental tile on the board.
 * Applies elemental gradients, typography, rune symbols, and reactive animations.
 */

import React from 'react';
import { ELEMENTS } from '../constants/elements';
import { Tile } from '../types/game';

interface TileViewProps {
  tile: Tile;
  boardSize: number;
}

export const TileView: React.FC<TileViewProps> = ({ tile, boardSize }) => {
  const element = ELEMENTS.find((e) => e.tier === tile.tier) || ELEMENTS[0];

  // Font sizing adjusted according to board dimension
  const symbolSize = boardSize === 5 ? 'text-xl sm:text-2xl' : boardSize === 3 ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl';
  const nameSize = boardSize === 5 ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm';
  const valueSize = boardSize === 5 ? 'text-[9px] sm:text-[11px]' : 'text-[11px] sm:text-xs';

  return (
    <div
      className={`
        relative w-full h-full rounded-xl sm:rounded-2xl p-2 flex flex-col items-center justify-between
        bg-gradient-to-br ${element.gradientClass}
        border transition-all duration-150 select-none shadow-md
        ${tile.isNew ? 'animate-tile-spawn' : ''}
        ${tile.isMerged ? 'animate-tile-merge' : ''}
      `}
      style={
        {
          '--tile-glow': element.glowColor,
          boxShadow: `0 4px 20px -2px ${element.glowColor}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)`,
        } as React.CSSProperties
      }
    >
      {/* Top Header: Value & Tier */}
      <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-mono font-medium opacity-85 px-0.5">
        <span className="tabular-nums tracking-tighter">{element.value}</span>
        <span className="text-[9px] opacity-70 uppercase tracking-widest font-sans">T{element.tier}</span>
      </div>

      {/* Center: Alchemical Rune Glyph */}
      <div className="my-auto flex flex-col items-center justify-center">
        <span className={`${symbolSize} leading-none drop-shadow-md select-none transform transition-transform group-hover:scale-110`}>
          {element.symbol}
        </span>
      </div>

      {/* Bottom: Element Name */}
      <div className="w-full text-center">
        <span className={`block font-semibold tracking-wide ${nameSize} ${element.textClass} truncate drop-shadow-sm`}>
          {element.name}
        </span>
      </div>
    </div>
  );
};
