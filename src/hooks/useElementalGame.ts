/**
 * @file useElementalGame.ts
 * @description Central custom hook managing game state, alchemical fusions,
 * undo history, score persistence, and codex discoveries.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_BOARD_SIZE,
  ELEMENTS,
  MAX_CATALYST_CHARGES,
  MAX_UNDO_CHARGES,
  STORAGE_KEYS,
  WINNING_TIER,
} from '../constants/elements';
import {
  checkCanMove,
  createEmptyBoard,
  hasTileWithTier,
  moveBoard,
  spawnRandomTile,
  tilesToBoard,
  transmuteLowestTile,
} from '../logic/gameEngine';
import { soundFX } from '../audio/soundFX';
import { BoardSize, Direction, ElementDefinition, GameHistorySnapshot, GameStatus, Tile } from '../types/game';

/**
 * Hook orchestrating all gameplay logic, history, and user progression.
 */
export function useElementalGame() {
  const [boardSize, setBoardSize] = useState<BoardSize>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOARD_SIZE);
      const val = stored ? parseInt(stored, 10) : DEFAULT_BOARD_SIZE;
      return val === 3 || val === 4 || val === 5 ? (val as BoardSize) : DEFAULT_BOARD_SIZE;
    } catch {
      return DEFAULT_BOARD_SIZE;
    }
  });

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [moves, setMoves] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');
  const [hasDismissedWin, setHasDismissedWin] = useState<boolean>(false);
  const [history, setHistory] = useState<GameHistorySnapshot[]>([]);
  const [catalystCharges, setCatalystCharges] = useState<number>(MAX_CATALYST_CHARGES);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFX.getIsMuted());

  // Persistent discovered element tiers in Grimoire
  const [discoveredTiers, setDiscoveredTiers] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DISCOVERIES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
    return [1, 2]; // Initial discovered tiers: Breeze & Droplet
  });

  // Modal alert for newly unlocked element
  const [newlyDiscoveredElement, setNewlyDiscoveredElement] = useState<ElementDefinition | null>(null);

  /**
   * Initializes a fresh board with 2 random starting tiles.
   */
  const initGame = useCallback((size: BoardSize = boardSize) => {
    let emptyBoard = createEmptyBoard(size);
    const spawn1 = spawnRandomTile(emptyBoard, size);
    emptyBoard = spawn1.board;
    const spawn2 = spawnRandomTile(emptyBoard, size);

    const initialTiles: Tile[] = [];
    if (spawn1.newTile) initialTiles.push(spawn1.newTile);
    if (spawn2.newTile) initialTiles.push(spawn2.newTile);

    setTiles(initialTiles);
    setScore(0);
    setMoves(0);
    setCombo(1);
    setHistory([]);
    setCatalystCharges(MAX_CATALYST_CHARGES);
    setGameStatus('PLAYING');
    setHasDismissedWin(false);
  }, [boardSize]);

  // Initial load
  useEffect(() => {
    initGame(boardSize);
  }, [boardSize, initGame]);

  // Update high score whenever score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(score));
      } catch {
        // Storage restricted
      }
    }
  }, [score, highScore]);

  // Sync discovered tiers with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DISCOVERIES, JSON.stringify(discoveredTiers));
    } catch {
      // Storage restricted
    }
  }, [discoveredTiers]);

  /**
   * Executes a directional move (slide + merge + spawn).
   */
  const makeMove = useCallback(
    (direction: Direction) => {
      if (gameStatus === 'GAME_OVER') return;

      const result = moveBoard(tiles, direction, boardSize);

      // If board did not change, ignore invalid move
      if (!result.hasChanged) {
        return;
      }

      // Record snapshot for undo (keep max items)
      setHistory((prev) => [
        ...prev.slice(-(MAX_UNDO_CHARGES - 1)),
        {
          tiles,
          score,
          moves,
          combo,
        },
      ]);

      // Calculate combo multiplier
      const nextCombo = result.mergedCount > 0 ? combo + 1 : 1;
      const comboBonusMultiplier = result.mergedCount > 1 ? 1.5 : 1.0;
      const pointsEarned = Math.round(result.scoreGained * comboBonusMultiplier);

      const nextScore = score + pointsEarned;
      setScore(nextScore);
      setMoves((m) => m + 1);
      setCombo(nextCombo);

      // Spawn next tile into empty space
      const spawnResult = spawnRandomTile(result.board, boardSize);
      const finalTiles = [...result.tiles];
      if (spawnResult.newTile) {
        finalTiles.push(spawnResult.newTile);
      }

      setTiles(finalTiles);

      // Audio feedback
      if (result.mergedCount > 0) {
        soundFX.playMerge(result.highestTierMerged, nextCombo);
      } else {
        soundFX.playSlide();
      }

      // Check for new elemental discovery
      if (result.highestTierMerged > 0 && !discoveredTiers.includes(result.highestTierMerged)) {
        setDiscoveredTiers((prev) => [...prev, result.highestTierMerged]);
        const elementDef = ELEMENTS.find((e) => e.tier === result.highestTierMerged);
        if (elementDef) {
          setNewlyDiscoveredElement(elementDef);
        }
      }

      // Check win condition (Supernova Tier 11 / 2048)
      if (!hasDismissedWin && hasTileWithTier(finalTiles, WINNING_TIER)) {
        setGameStatus('WON');
        soundFX.playVictory();
        return;
      }

      // Check game over
      const updatedBoard = tilesToBoard(finalTiles, boardSize);
      if (!checkCanMove(updatedBoard, boardSize)) {
        setGameStatus('GAME_OVER');
        soundFX.playGameOver();
      }
    },
    [tiles, boardSize, gameStatus, score, moves, combo, discoveredTiers, hasDismissedWin]
  );

  /**
   * Reverts board to prior move state.
   */
  const undo = useCallback(() => {
    if (history.length === 0) return;

    const previousSnapshot = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));

    setTiles(previousSnapshot.tiles);
    setScore(previousSnapshot.score);
    setMoves(previousSnapshot.moves);
    setCombo(previousSnapshot.combo);
    setGameStatus('PLAYING');

    soundFX.playClick();
  }, [history]);

  /**
   * Activates the Alchemy Catalyst to upgrade the lowest tier tile.
   */
  const activateCatalyst = useCallback(() => {
    if (catalystCharges <= 0 || gameStatus === 'GAME_OVER') return;

    const { tiles: nextTiles, transmuted } = transmuteLowestTile(tiles);
    if (!transmuted) return;

    setTiles(nextTiles);
    setCatalystCharges((c) => c - 1);
    soundFX.playCatalyst();

    // Check if new tier was unlocked
    if (transmuted.tier > 0 && !discoveredTiers.includes(transmuted.tier)) {
      setDiscoveredTiers((prev) => [...prev, transmuted.tier]);
      const def = ELEMENTS.find((e) => e.tier === transmuted.tier);
      if (def) setNewlyDiscoveredElement(def);
    }
  }, [catalystCharges, gameStatus, tiles, discoveredTiers]);

  /**
   * Toggles audio mute on sound FX.
   */
  const toggleMute = useCallback(() => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  }, []);

  /**
   * Changes board size (3x3, 4x4, 5x5) and starts a new game.
   */
  const changeBoardSize = useCallback(
    (size: BoardSize) => {
      setBoardSize(size);
      try {
        localStorage.setItem(STORAGE_KEYS.BOARD_SIZE, String(size));
      } catch {
        // Restricted storage
      }
      initGame(size);
    },
    [initGame]
  );

  /**
   * Closes the victory modal to continue endless playing.
   */
  const continuePlaying = useCallback(() => {
    setHasDismissedWin(true);
    setGameStatus('PLAYING');
    soundFX.playClick();
  }, []);

  /**
   * Dismisses discovery celebration popover.
   */
  const dismissDiscovery = useCallback(() => {
    setNewlyDiscoveredElement(null);
  }, []);

  // Compute highest tier currently on board
  const highestCurrentTier = tiles.reduce((max, t) => Math.max(max, t.tier), 1);

  return {
    boardSize,
    tiles,
    board: tilesToBoard(tiles, boardSize),
    score,
    highScore,
    moves,
    combo,
    gameStatus,
    highestCurrentTier,
    discoveredTiers,
    newlyDiscoveredElement,
    catalystCharges,
    canUndo: history.length > 0,
    undoRemaining: history.length,
    isMuted,
    makeMove,
    undo,
    activateCatalyst,
    restart: () => initGame(boardSize),
    changeBoardSize,
    toggleMute,
    continuePlaying,
    dismissDiscovery,
  };
}
