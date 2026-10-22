/**
 * @file Board.jsx
 * @description 4x4 CSS Grid board container with glassmorphism styling.
 * Renders static grid slots beneath absolutely positioned sliding elemental tiles.
 */

import React from 'react';
import Tile from './Tile';

/**
 * Board Component
 *
 * @param {Object} props
 * @param {Array<Array<Object|null>>} props.board - 4x4 matrix of tiles
 * @param {React.RefObject} [props.boardRef] - Ref passed from parent controller
 */
export default function Board({ board, boardRef }) {
  // Extract all active tiles with current row and col coordinates
  const activeTiles = [];
  if (board) {
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          activeTiles.push({
            ...cell,
            row: r,
            col: c,
          });
        }
      });
    });
  }

  return (
    <div className="w-full max-w-[400px] mx-auto select-none touch-none px-2 sm:px-0">
      <div
        ref={boardRef}
        className="
          relative w-full aspect-square
          bg-white/10 backdrop-blur-md
          rounded-2xl p-2 sm:p-2.5
          border border-white/15 shadow-2xl shadow-black/50
          overflow-hidden
        "
      >
        {/* 16 Static Background Grid Slots */}
        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-2 sm:gap-2.5">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div
              key={`bg-cell-${idx}`}
              className="
                w-full h-full rounded-xl sm:rounded-2xl
                bg-white/5 border border-white/5
                flex items-center justify-center
              "
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            </div>
          ))}
        </div>

        {/* Sliding and Animated Active Tiles Layer */}
        <div className="absolute inset-0 p-2 sm:p-2.5 pointer-events-none">
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
  );
}
