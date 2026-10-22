/**
 * @file game.ts
 * @description Core TypeScript type definitions and interfaces for Elemental Fusion.
 */

/**
 * Directional vectors for sliding tiles.
 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * Status of the current game session.
 */
export type GameStatus = 'PLAYING' | 'WON' | 'GAME_OVER';

/**
 * Grid dimension options (e.g. 3x3 Blitz, 4x4 Classic, 5x5 Expanded).
 */
export type BoardSize = 3 | 4 | 5;

/**
 * Definition of an element tier in the fusion chain.
 */
export interface ElementDefinition {
  /** Numerical tier level starting from 1 */
  tier: number;
  /** Primary name of the element (e.g., Breeze, Ember, Celestial) */
  name: string;
  /** Ancient alchemical title or domain */
  subTitle: string;
  /** Alchemical rune or symbol glyph */
  symbol: string;
  /** Primary accent color code (hex) */
  color: string;
  /** Glow drop shadow color (rgba/hex) */
  glowColor: string;
  /** Tailwind background gradient classes */
  gradientClass: string;
  /** Text contrast class */
  textClass: string;
  /** Score value awarded upon achieving this tier (2^tier) */
  value: number;
  /** Lore description for the Codex / Grimoire */
  lore: string;
  /** Mythological quote or aphorism */
  quote: string;
}

/**
 * Representation of a single tile on the grid.
 */
export interface Tile {
  /** Unique immutable identifier for React keys & animations */
  id: string;
  /** Current element tier (1 to maxTier) */
  tier: number;
  /** Current row index on the board (0-indexed) */
  row: number;
  /** Current column index on the board (0-indexed) */
  col: number;
  /** Position prior to the last move, used for sliding transitions */
  previousPosition?: { row: number; col: number } | null;
  /** Flag indicating tile was spawned this turn */
  isNew?: boolean;
  /** Flag indicating tile was formed from a fusion this turn */
  isMerged?: boolean;
}

/**
 * Result returned by the board slide algorithm.
 */
export interface MoveResult {
  /** New array of active tiles */
  tiles: Tile[];
  /** 2D grid representation of the board after the move */
  board: (Tile | null)[][];
  /** Points scored from all element merges during this move */
  scoreGained: number;
  /** Whether any tile moved or merged (valid move test) */
  hasChanged: boolean;
  /** Number of successful merges that occurred in this move */
  mergedCount: number;
  /** Highest tier formed during this move */
  highestTierMerged: number;
}

/**
 * Snapshot preserved in history for the Undo mechanism.
 */
export interface GameHistorySnapshot {
  tiles: Tile[];
  score: number;
  moves: number;
  combo: number;
}

/**
 * Overall gameplay statistics and player progression.
 */
export interface GameStatistics {
  score: number;
  highScore: number;
  moves: number;
  combo: number;
  highestTier: number;
  discoveredTiers: number[];
  catalystCharges: number;
}
