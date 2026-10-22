/**
 * @file useGameEngine.js
 * @description State Management hook for Elemental Fusion.
 * Handles board state (4x4 grid), tile sliding/merging, score tracking,
 * Lava and Dead Rock mechanics, and revive functionality.
 */

import { useState, useEffect, useCallback } from 'react';

// Elemental tiers hierarchy matching the prompt's specifications
export const ELEMENT_LEVELS = [
  { level: 1, name: 'WATER', value: 2, colorClass: 'bg-blue-500', textClass: 'text-white' },
  { level: 2, name: 'FIRE', value: 4, colorClass: 'bg-red-500', textClass: 'text-white' },
  { level: 3, name: 'EARTH', value: 8, colorClass: 'bg-amber-700', textClass: 'text-amber-50' },
  { level: 4, name: 'SEA', value: 16, colorClass: 'bg-cyan-400', textClass: 'text-cyan-950 font-extrabold' },
  { level: 5, name: 'AIR', value: 32, colorClass: 'bg-sky-400', textClass: 'text-sky-950 font-bold' },
  { level: 6, name: 'LIGHTNING', value: 64, colorClass: 'bg-yellow-400', textClass: 'text-yellow-950 font-bold' },
  { level: 7, name: 'FROST', value: 128, colorClass: 'bg-teal-300', textClass: 'text-teal-950 font-bold' },
  { level: 8, name: 'MAGMA', value: 256, colorClass: 'bg-orange-600', textClass: 'text-white' },
  { level: 9, name: 'AETHER', value: 512, colorClass: 'bg-purple-600', textClass: 'text-white' },
  { level: 10, name: 'ASTRAL', value: 1024, colorClass: 'bg-pink-500', textClass: 'text-white' },
  { level: 11, name: 'SUPERNOVA', value: 2048, colorClass: 'bg-amber-500', textClass: 'text-yellow-950 font-black' },
  { level: 12, name: 'VOID', value: 4096, colorClass: 'bg-indigo-600', textClass: 'text-indigo-50' },
  { level: 13, name: 'GENESIS', value: 8192, colorClass: 'bg-emerald-500', textClass: 'text-slate-950 font-black' },
];

const BOARD_SIZE = 4;
const STORAGE_HIGH_SCORE_KEY = 'elemental_fusion_best_score';

/**
 * Creates an empty 4x4 grid filled with null.
 */
function createEmptyGrid() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

/**
 * Spawns a new tile in an unoccupied cell.
 * Includes a rare chance of a volatile LAVA block (initial lifetime: 3).
 */
function spawnTile(grid, allowLava = true) {
  const emptyCells = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!grid[r][c]) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) return grid;

  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map((row) => [...row]);

  // Rare hazard: 6% chance of LAVA spawning when enabled
  const shouldSpawnLava = allowLava && Math.random() < 0.06;

  if (shouldSpawnLava) {
    newGrid[r][c] = {
      id: `tile-lava-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      element: 'LAVA',
      type: 'LAVA',
      lifetime: 3,
      value: 0,
      isNew: true,
      isMerged: false,
    };
    return newGrid;
  }

  const isFire = Math.random() < 0.1;
  const level = isFire ? 2 : 1;
  const elementDef = ELEMENT_LEVELS[level - 1];

  newGrid[r][c] = {
    id: `tile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    element: elementDef.name,
    type: elementDef.name,
    level,
    value: elementDef.value,
    isNew: true,
    isMerged: false,
  };

  return newGrid;
}

/**
 * Checks if any valid moves remain on the board.
 * DEAD_ROCK cannot move or merge with any other tile.
 */
function canMakeMove(grid) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const current = grid[r][c];
      if (!current) return true;

      // DEAD_ROCK cannot merge
      if (current.element === 'DEAD_ROCK') continue;

      // Check right neighbor
      if (c + 1 < BOARD_SIZE) {
        const right = grid[r][c + 1];
        if (!right) return true;
        if (
          right.element !== 'DEAD_ROCK' &&
          right.element === current.element
        ) {
          return true;
        }
      }

      // Check bottom neighbor
      if (r + 1 < BOARD_SIZE) {
        const down = grid[r + 1][c];
        if (!down) return true;
        if (
          down.element !== 'DEAD_ROCK' &&
          down.element === current.element
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Helper to slide and merge a standard subsegment of tiles (free from DEAD_ROCK).
 */
function slideSubSegment(segment) {
  const nonNull = segment.filter(Boolean);
  const result = [];
  let scoreGained = 0;

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
      const nextLevel = Math.min((current.level || 1) + 1, ELEMENT_LEVELS.length);
      const nextElement = ELEMENT_LEVELS[nextLevel - 1];
      const points = nextElement.value;

      result.push({
        id: `tile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        element: nextElement.name,
        type: nextElement.name,
        level: nextLevel,
        value: points,
        isMerged: true,
        isNew: false,
      });

      scoreGained += points;
      i += 2;
    } else {
      result.push({
        ...current,
        isNew: false,
        isMerged: false,
      });
      i += 1;
    }
  }

  while (result.length < segment.length) {
    result.push(null);
  }

  return { result, scoreGained };
}

/**
 * Slide a line respecting DEAD_ROCK as immovable obstacles.
 */
function slideLineWithObstacles(line) {
  // If no DEAD_ROCK, slide the entire line normally
  if (!line.some((t) => t && t.element === 'DEAD_ROCK')) {
    const { result, scoreGained } = slideSubSegment(line);
    return { newLine: result, scoreGained };
  }

  // Partition line by DEAD_ROCK obstacles
  const newLine = new Array(line.length).fill(null);
  let totalScoreGained = 0;
  let segmentStartIndex = 0;

  for (let i = 0; i <= line.length; i++) {
    const isObstacle = i < line.length && line[i]?.element === 'DEAD_ROCK';
    const isEnd = i === line.length;

    if (isObstacle || isEnd) {
      // Process subsegment before this obstacle
      const subSegment = line.slice(segmentStartIndex, i);
      if (subSegment.length > 0) {
        const { result, scoreGained } = slideSubSegment(subSegment);
        totalScoreGained += scoreGained;
        for (let k = 0; k < result.length; k++) {
          newLine[segmentStartIndex + k] = result[k];
        }
      }

      if (isObstacle) {
        newLine[i] = { ...line[i], isNew: false, isMerged: false };
        segmentStartIndex = i + 1;
      }
    }
  }

  return { newLine, scoreGained: totalScoreGained };
}

/**
 * Custom React hook managing the entire game logic, inputs, and Lava mechanics.
 */
export function useGameEngine() {
  const [board, setBoard] = useState(() => {
    let grid = createEmptyGrid();
    grid = spawnTile(grid, false);
    grid = spawnTile(grid, false);
    return grid;
  });

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HIGH_SCORE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Sync high score to localStorage
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      try {
        localStorage.setItem(STORAGE_HIGH_SCORE_KEY, String(score));
      } catch {
        // Ignored in restricted environments
      }
    }
  }, [score, bestScore]);

  // Restart / New Game function
  const newGame = useCallback(() => {
    let grid = createEmptyGrid();
    grid = spawnTile(grid, false);
    grid = spawnTile(grid, false);
    setBoard(grid);
    setScore(0);
    setIsGameOver(false);
    setIsWon(false);
  }, []);

  // Revive Function: Clears DEAD_ROCK and removes 2 lowest tiles to rescue player
  const revive = useCallback(() => {
    setBoard((prevGrid) => {
      // 1. Clear all DEAD_ROCK
      let grid = prevGrid.map((row) =>
        row.map((tile) => (tile && tile.element === 'DEAD_ROCK' ? null : tile))
      );

      // 2. Clear two lowest tier tiles to free up board movement
      const occupied = [];
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (grid[r][c]) {
            occupied.push({ r, c, level: grid[r][c].level || 1 });
          }
        }
      }

      occupied.sort((a, b) => a.level - b.level);
      const toRemove = occupied.slice(0, 2);
      for (const item of toRemove) {
        grid[item.r][item.c] = null;
      }

      return grid;
    });

    setIsGameOver(false);
  }, []);

  // Directional move handler
  const move = useCallback(
    (direction) => {
      if (isGameOver) return;

      let changed = false;
      let totalGained = 0;
      const newGrid = createEmptyGrid();

      const isHorizontal = direction === 'LEFT' || direction === 'RIGHT';
      const isReverse = direction === 'RIGHT' || direction === 'DOWN';

      for (let i = 0; i < BOARD_SIZE; i++) {
        const line = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
          const r = isHorizontal ? i : j;
          const c = isHorizontal ? j : i;
          line.push(board[r][c]);
        }

        const lineToSlide = isReverse ? [...line].reverse() : line;
        const { newLine, scoreGained } = slideLineWithObstacles(lineToSlide);
        const finalLine = isReverse ? [...newLine].reverse() : newLine;

        totalGained += scoreGained;

        for (let j = 0; j < BOARD_SIZE; j++) {
          const r = isHorizontal ? i : j;
          const c = isHorizontal ? j : i;
          newGrid[r][c] = finalLine[j];

          const prev = board[r][c];
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

      // 1. Lava Mechanic: After every move, iterate through the board.
      // If a LAVA block exists, decrement its lifetime.
      // If lifetime === 0, change its type to DEAD_ROCK (gray color, cannot be merged or moved).
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const tile = newGrid[r][c];
          if (tile && (tile.element === 'LAVA' || tile.type === 'LAVA')) {
            const nextLifetime = (tile.lifetime ?? 3) - 1;
            if (nextLifetime <= 0) {
              newGrid[r][c] = {
                ...tile,
                element: 'DEAD_ROCK',
                type: 'DEAD_ROCK',
                lifetime: 0,
                isMerged: false,
                isNew: false,
              };
            } else {
              newGrid[r][c] = {
                ...tile,
                lifetime: nextLifetime,
              };
            }
          }
        }
      }

      // 2. Spawn next random tile
      const updatedGrid = spawnTile(newGrid, true);
      setBoard(updatedGrid);
      setScore((prev) => prev + totalGained);

      // Check win condition (SUPERNOVA reached)
      const hasSupernova = updatedGrid.some((row) =>
        row.some((tile) => tile && tile.element === 'SUPERNOVA')
      );
      if (hasSupernova && !isWon) {
        setIsWon(true);
      }

      // Check game over
      if (!canMakeMove(updatedGrid)) {
        setIsGameOver(true);
      }
    },
    [board, isGameOver, isWon]
  );

  return {
    board,
    score,
    bestScore,
    isGameOver,
    isWon,
    newGame,
    restart: newGame,
    revive,
    move,
  };
}

export default useGameEngine;
