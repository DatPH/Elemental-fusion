/**
 * @file gameEngine.ts
 * @description Pure functional game engine for Elemental Fusion.
 * Implements grid transformations, sliding math, fusion rules, and game over validation.
 * Absolutely side-effect free for maximum maintainability and testability.
 */

import { Direction, MoveResult, Tile } from '../types/game';

/**
 * Creates an empty 2D grid matrix for a given board dimension.
 *
 * @param size - Dimension of the grid (e.g., 4 for a 4x4 grid).
 * @returns 2D array initialized with null values.
 */
export function createEmptyBoard(size: number): (Tile | null)[][] {
  const board: (Tile | null)[][] = [];
  for (let r = 0; r < size; r++) {
    const row: (Tile | null)[] = [];
    for (let c = 0; c < size; c++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
}

/**
 * Converts a flat array of active tiles into a 2D matrix.
 *
 * @param tiles - Array of Tile objects with row and col coordinates.
 * @param size - Dimension of the grid.
 * @returns 2D matrix mapping grid coordinates to Tile objects or null.
 */
export function tilesToBoard(tiles: Tile[], size: number): (Tile | null)[][] {
  const board = createEmptyBoard(size);
  for (const tile of tiles) {
    if (tile.row >= 0 && tile.row < size && tile.col >= 0 && tile.col < size) {
      board[tile.row][tile.col] = tile;
    }
  }
  return board;
}

/**
 * Retrieves all currently unoccupied coordinate slots on the board.
 *
 * @param board - 2D grid of tiles.
 * @param size - Grid dimension.
 * @returns Array of { row, col } coordinates for empty slots.
 */
export function getAvailableCells(board: (Tile | null)[][], size: number): Array<{ row: number; col: number }> {
  const available: Array<{ row: number; col: number }> = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!board[r][c]) {
        available.push({ row: r, col: c });
      }
    }
  }
  return available;
}

/**
 * Spawns a new elemental tile at a random empty location.
 * 90% probability for Tier 1 (Breeze), 10% probability for Tier 2 (Droplet).
 *
 * @param board - Current 2D grid.
 * @param size - Grid dimension.
 * @returns Object with the updated board and newly created Tile (or null if full).
 */
export function spawnRandomTile(
  board: (Tile | null)[][],
  size: number
): { board: (Tile | null)[][]; newTile: Tile | null } {
  const available = getAvailableCells(board, size);
  if (available.length === 0) {
    return { board, newTile: null };
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  const { row, col } = available[randomIndex];

  // 90% chance of Tier 1, 10% chance of Tier 2
  const tier = Math.random() < 0.9 ? 1 : 2;
  const newTile: Tile = {
    id: `tile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    tier,
    row,
    col,
    previousPosition: null,
    isNew: true,
    isMerged: false,
  };

  const nextBoard = board.map((r) => [...r]);
  nextBoard[row][col] = newTile;

  return { board: nextBoard, newTile };
}

/**
 * Internal helper to compress and merge a single 1D array of tiles.
 * Preserves authentic 2048 merge rules: each tile can only merge once per turn.
 *
 * @param line - Array of tiles in line order.
 * @returns Processed line with merged tiles and calculated score gained.
 */
function processLine(line: (Tile | null)[]): {
  newLine: (Tile | null)[];
  scoreGained: number;
  mergedCount: number;
  highestTierMerged: number;
} {
  // Step 1: Filter out empty cells
  const nonNullTiles = line.filter((t): t is Tile => t !== null);
  const result: (Tile | null)[] = [];
  let scoreGained = 0;
  let mergedCount = 0;
  let highestTierMerged = 0;

  let i = 0;
  while (i < nonNullTiles.length) {
    const current = nonNullTiles[i];
    const next = nonNullTiles[i + 1];

    if (next && current.tier === next.tier) {
      // Merge identical elements into next tier
      const mergedTier = current.tier + 1;
      const points = Math.pow(2, mergedTier);
      scoreGained += points;
      mergedCount += 1;
      if (mergedTier > highestTierMerged) {
        highestTierMerged = mergedTier;
      }

      const mergedTile: Tile = {
        id: `tile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        tier: mergedTier,
        row: current.row,
        col: current.col,
        previousPosition: { row: current.row, col: current.col },
        isNew: false,
        isMerged: true,
      };

      result.push(mergedTile);
      i += 2; // Both tiles consumed
    } else {
      // Keep tile as is without merge
      result.push({
        ...current,
        isNew: false,
        isMerged: false,
      });
      i += 1;
    }
  }

  // Pad the rest with null
  while (result.length < line.length) {
    result.push(null);
  }

  return {
    newLine: result,
    scoreGained,
    mergedCount,
    highestTierMerged,
  };
}

/**
 * Executes a directional slide move across the entire board.
 * Pure function: calculates new tile coordinates, merges matching tiers,
 * tracks previous positions for smooth transitions, and tallies score.
 *
 * @param currentTiles - Array of active tiles prior to the move.
 * @param direction - Direction of movement ('UP', 'DOWN', 'LEFT', 'RIGHT').
 * @param size - Dimension of the grid.
 * @returns Detailed MoveResult with updated tiles, board matrix, score, and flags.
 */
export function moveBoard(
  currentTiles: Tile[],
  direction: Direction,
  size: number
): MoveResult {
  const initialBoard = tilesToBoard(currentTiles, size);
  const newBoard = createEmptyBoard(size);

  let totalScoreGained = 0;
  let totalMergedCount = 0;
  let highestTierMerged = 0;
  let hasChanged = false;

  const isHorizontal = direction === 'LEFT' || direction === 'RIGHT';
  const isReverse = direction === 'RIGHT' || direction === 'DOWN';

  for (let i = 0; i < size; i++) {
    // Extract line
    const originalLine: (Tile | null)[] = [];
    for (let j = 0; j < size; j++) {
      const r = isHorizontal ? i : j;
      const c = isHorizontal ? j : i;
      originalLine.push(initialBoard[r][c]);
    }

    // Reverse if moving DOWN or RIGHT
    const lineToProcess = isReverse ? [...originalLine].reverse() : originalLine;
    const { newLine, scoreGained, mergedCount, highestTierMerged: tierMerged } = processLine(lineToProcess);

    totalScoreGained += scoreGained;
    totalMergedCount += mergedCount;
    if (tierMerged > highestTierMerged) {
      highestTierMerged = tierMerged;
    }

    const finalLine = isReverse ? [...newLine].reverse() : newLine;

    // Assign new row and col positions and map to newBoard
    for (let j = 0; j < size; j++) {
      const r = isHorizontal ? i : j;
      const c = isHorizontal ? j : i;
      const tile = finalLine[j];

      if (tile) {
        const prevTile = initialBoard[r][c];
        // Check if movement or merge occurred
        if (!prevTile || prevTile.id !== tile.id || prevTile.tier !== tile.tier) {
          hasChanged = true;
        }

        const positionedTile: Tile = {
          ...tile,
          previousPosition: { row: tile.row, col: tile.col },
          row: r,
          col: c,
        };
        newBoard[r][c] = positionedTile;
      } else {
        if (initialBoard[r][c] !== null) {
          hasChanged = true;
        }
        newBoard[r][c] = null;
      }
    }
  }

  // Flatten active tiles
  const nextTiles: Tile[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const tile = newBoard[r][c];
      if (tile) {
        nextTiles.push(tile);
      }
    }
  }

  return {
    tiles: nextTiles,
    board: newBoard,
    scoreGained: totalScoreGained,
    hasChanged,
    mergedCount: totalMergedCount,
    highestTierMerged,
  };
}

/**
 * Validates whether any valid moves remain on the board.
 * Returns true if an empty cell exists or if any adjacent neighbors share identical tiers.
 *
 * @param board - 2D grid matrix.
 * @param size - Dimension of the grid.
 * @returns boolean indicating if player can make at least one legal move.
 */
export function checkCanMove(board: (Tile | null)[][], size: number): boolean {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const current = board[r][c];
      // If cell is vacant, a move can always be made
      if (!current) {
        return true;
      }

      // Check right neighbor
      if (c + 1 < size) {
        const right = board[r][c + 1];
        if (!right || right.tier === current.tier) {
          return true;
        }
      }

      // Check bottom neighbor
      if (r + 1 < size) {
        const down = board[r + 1][c];
        if (!down || down.tier === current.tier) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Checks whether any tile on the board has reached or exceeded a target tier.
 *
 * @param tiles - Array of current tiles.
 * @param targetTier - Tier to look for (e.g. 11 for Supernova / 2048).
 * @returns boolean
 */
export function hasTileWithTier(tiles: Tile[], targetTier: number): boolean {
  return tiles.some((tile) => tile.tier >= targetTier);
}

/**
 * Tactical Alchemy Catalyst:
 * Elevates the lowest tier tile currently on the board by 1 tier.
 * Used when player triggers their catalyst charge.
 *
 * @param tiles - Current array of tiles.
 * @returns Updated array of tiles with transmuted tile, or original tiles if empty.
 */
export function transmuteLowestTile(tiles: Tile[]): { tiles: Tile[]; transmuted: Tile | null } {
  if (tiles.length === 0) {
    return { tiles, transmuted: null };
  }

  // Find lowest tier
  let minTier = Infinity;
  for (const t of tiles) {
    if (t.tier < minTier) {
      minTier = t.tier;
    }
  }

  const eligibleTiles = tiles.filter((t) => t.tier === minTier);
  const target = eligibleTiles[Math.floor(Math.random() * eligibleTiles.length)];

  const nextTiles = tiles.map((t) => {
    if (t.id === target.id) {
      return {
        ...t,
        tier: t.tier + 1,
        isMerged: true,
      };
    }
    return t;
  });

  const transmuted = nextTiles.find((t) => t.id === target.id) || null;
  return { tiles: nextTiles, transmuted };
}
