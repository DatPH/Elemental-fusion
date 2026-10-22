/**
 * @file Tile.jsx
 * @description Visual representation of an elemental tile in Elemental Fusion.
 * Applies Tailwind color palettes, tactile inner shadows/gradients, clean typography,
 * and high-performance CSS animations (Pop-in, Merge/Pulse, and Smooth Sliding).
 */

import React from 'react';

/**
 * Elemental color and styling dictionary.
 */
const ELEMENT_CONFIG = {
  WATER: {
    bg: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    text: 'text-white/90',
    symbol: '🜄',
    glow: 'rgba(59, 130, 246, 0.7)',
  },
  FIRE: {
    bg: 'bg-red-500',
    gradient: 'from-red-400 to-red-600',
    text: 'text-white/90',
    symbol: '🜂',
    glow: 'rgba(239, 68, 68, 0.7)',
  },
  EARTH: {
    bg: 'bg-amber-700',
    gradient: 'from-amber-600 to-amber-800',
    text: 'text-white/90',
    symbol: '🜃',
    glow: 'rgba(180, 83, 9, 0.7)',
  },
  SEA: {
    bg: 'bg-cyan-400',
    gradient: 'from-cyan-300 to-cyan-500',
    text: 'text-slate-900',
    symbol: '🌊',
    glow: 'rgba(34, 211, 238, 0.7)',
  },
  AIR: {
    bg: 'bg-sky-400',
    gradient: 'from-sky-300 to-sky-500',
    text: 'text-slate-900',
    symbol: '🜁',
    glow: 'rgba(56, 189, 248, 0.7)',
  },
  LIGHTNING: {
    bg: 'bg-yellow-400',
    gradient: 'from-yellow-300 to-amber-500',
    text: 'text-slate-900',
    symbol: '⚡',
    glow: 'rgba(250, 204, 21, 0.7)',
  },
  FROST: {
    bg: 'bg-teal-300',
    gradient: 'from-teal-200 to-teal-400',
    text: 'text-slate-900',
    symbol: '❄️',
    glow: 'rgba(94, 234, 212, 0.7)',
  },
  MAGMA: {
    bg: 'bg-orange-600',
    gradient: 'from-orange-500 to-red-700',
    text: 'text-white/90',
    symbol: '🌋',
    glow: 'rgba(234, 88, 12, 0.7)',
  },
  AETHER: {
    bg: 'bg-purple-600',
    gradient: 'from-purple-500 to-indigo-700',
    text: 'text-white/90',
    symbol: '🔮',
    glow: 'rgba(147, 51, 234, 0.7)',
  },
  ASTRAL: {
    bg: 'bg-pink-500',
    gradient: 'from-pink-400 to-rose-600',
    text: 'text-white/90',
    symbol: '🌟',
    glow: 'rgba(236, 72, 153, 0.7)',
  },
  SUPERNOVA: {
    bg: 'bg-amber-500',
    gradient: 'from-amber-300 via-yellow-400 to-orange-500',
    text: 'text-slate-950 font-black',
    symbol: '☀️',
    glow: 'rgba(245, 158, 11, 0.9)',
  },
  VOID: {
    bg: 'bg-indigo-600',
    gradient: 'from-indigo-500 to-slate-900',
    text: 'text-white/90',
    symbol: '🌌',
    glow: 'rgba(99, 102, 241, 0.8)',
  },
  GENESIS: {
    bg: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-teal-600',
    text: 'text-slate-950 font-black',
    symbol: '♾️',
    glow: 'rgba(16, 185, 129, 0.9)',
  },
  LAVA: {
    bg: 'bg-red-600',
    gradient: 'from-orange-500 via-red-600 to-rose-700',
    text: 'text-amber-200 font-extrabold',
    symbol: '🔥',
    glow: 'rgba(239, 68, 68, 0.9)',
  },
  DEAD_ROCK: {
    bg: 'bg-stone-600',
    gradient: 'from-stone-500 via-stone-600 to-stone-700',
    text: 'text-stone-300 font-bold',
    symbol: '🪨',
    glow: 'rgba(120, 113, 108, 0.4)',
  },
};

/**
 * Tile Component
 *
 * @param {Object} props
 * @param {string|Object} [props.element] - Name of element (e.g. 'WATER') or tile object
 * @param {Object} [props.tile] - Tile object fallback
 * @param {number} [props.value] - Numeric value (e.g. 2, 4, 8)
 * @param {boolean} [props.isNew] - Whether tile just spawned (triggers pop-in animation)
 * @param {boolean} [props.isMerged] - Whether tile was formed by a merge (triggers pulse animation)
 * @param {number} [props.row] - Grid row index (0-3) for absolute slide positioning
 * @param {number} [props.col] - Grid column index (0-3) for absolute slide positioning
 */
export default function Tile({ element, tile, value, isNew, isMerged, row, col }) {
  // Normalize element and value inputs
  const resolvedElement = typeof element === 'string'
    ? element
    : element?.element || tile?.element || 'WATER';

  const resolvedValue = value ?? element?.value ?? tile?.value ?? 2;
  const resolvedIsNew = isNew ?? tile?.isNew ?? false;
  const resolvedIsMerged = isMerged ?? tile?.isMerged ?? false;
  const resolvedRow = row ?? tile?.row;
  const resolvedCol = col ?? tile?.col;

  const config = ELEMENT_CONFIG[resolvedElement.toUpperCase()] || ELEMENT_CONFIG.WATER;

  // Determine animation states
  const animationClass = resolvedIsMerged
    ? 'animate-merge-pulse z-10'
    : resolvedIsNew
    ? 'animate-pop-in'
    : '';

  // If row and col are passed, wrap in absolute positioner with smooth slide transition
  const isAbsolute = resolvedRow !== undefined && resolvedCol !== undefined;

  const tileInner = (
    <div
      className={`
        w-full h-full rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between items-center
        bg-gradient-to-br ${config.gradient}
        shadow-lg shadow-black/30 border border-white/20
        transition-all duration-150 ease-in-out select-none
        relative overflow-hidden
        ${animationClass}
      `}
      style={{
        '--tile-glow': config.glow,
        boxShadow: `inset 0 1px 2px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.25), 0 4px 14px ${config.glow}`,
      }}
    >
      {/* Subtle top glare highlight for tactile depth */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-xl" />

      {/* Top Header: Value & Glyph */}
      <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold opacity-80 z-10 px-0.5">
        <span className="tracking-tighter">{resolvedValue}</span>
        <span className="text-[12px] opacity-75">{config.symbol}</span>
      </div>

      {/* Center: Alchemical Icon */}
      <div className="my-auto z-10 flex items-center justify-center">
        <span className="text-xl sm:text-2xl drop-shadow-sm leading-none">
          {config.symbol}
        </span>
      </div>

      {/* Bottom: Element Name with clean bold typography */}
      <div className="w-full text-center z-10">
        <span className={`block text-[10px] sm:text-xs font-bold tracking-wider uppercase truncate ${config.text}`}>
          {resolvedElement === 'LAVA' && tile?.lifetime !== undefined
            ? `LAVA (${tile.lifetime})`
            : resolvedElement === 'DEAD_ROCK'
            ? 'DEAD ROCK'
            : resolvedElement}
        </span>
      </div>
    </div>
  );

  if (isAbsolute) {
    return (
      <div
        className="absolute transition-all duration-150 ease-in-out p-1 sm:p-1.25 pointer-events-none"
        style={{
          top: `${resolvedRow * 25}%`,
          left: `${resolvedCol * 25}%`,
          width: '25%',
          height: '25%',
        }}
      >
        {tileInner}
      </div>
    );
  }

  return tileInner;
}
