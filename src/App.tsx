/**
 * @file App.tsx
 * @description Main application container for Elemental Fusion.
 * Coordinates game state, layout orchestration, overlays, and ambient audio visual styling.
 */

import React, { useState } from 'react';
import { useElementalGame } from './hooks/useElementalGame';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { CatalystBar } from './components/CatalystBar';
import { GrimoireModal } from './components/GrimoireModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameOverModal } from './components/GameOverModal';
import { DiscoveryBanner } from './components/DiscoveryBanner';

export default function App() {
  const {
    boardSize,
    board,
    score,
    highScore,
    moves,
    combo,
    gameStatus,
    highestCurrentTier,
    discoveredTiers,
    newlyDiscoveredElement,
    catalystCharges,
    canUndo,
    undoRemaining,
    isMuted,
    makeMove,
    undo,
    activateCatalyst,
    restart,
    changeBoardSize,
    toggleMute,
    continuePlaying,
    dismissDiscovery,
  } = useElementalGame();

  const [isGrimoireOpen, setIsGrimoireOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#080c14] text-slate-100 overflow-x-hidden selection:bg-amber-500/20">
      {/* Cosmic Nebula Atmospheric Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/src/assets/images/cosmic_nebula_bg_1791479686874.jpg"
          alt=""
          role="presentation"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 mix-blend-screen scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/80 via-[#080c14]/60 to-[#080c14]" />
      </div>

      {/* Main Interactive Viewport Container */}
      <div className="relative z-10 w-full flex flex-col flex-1 items-center justify-between pb-6">
        {/* Top Header Bar */}
        <Header
          score={score}
          highScore={highScore}
          moves={moves}
          combo={combo}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onOpenGrimoire={() => setIsGrimoireOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onRestart={restart}
        />

        {/* Central Game Arena */}
        <main className="w-full max-w-xl mx-auto flex flex-col items-center justify-center px-4 my-auto py-2">
          <Board
            board={board}
            boardSize={boardSize}
            onMove={makeMove}
            disabled={gameStatus === 'GAME_OVER' || isGrimoireOpen || isHowToPlayOpen}
          />
        </main>

        {/* Tactical Controls: Undo, Catalyst, Board Size & D-Pad */}
        <CatalystBar
          canUndo={canUndo}
          undoRemaining={undoRemaining}
          catalystCharges={catalystCharges}
          boardSize={boardSize}
          onUndo={undo}
          onActivateCatalyst={activateCatalyst}
          onChangeBoardSize={changeBoardSize}
          onMove={makeMove}
        />

        {/* Editorial Subdued Footer */}
        <footer className="w-full max-w-xl mx-auto px-4 pt-2 text-center text-xs text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <span>Swipe or Arrow keys to fuse</span>
            <span aria-hidden="true">·</span>
            <span>Reach Tier 11: Supernova</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsGrimoireOpen(true)}
              className="text-amber-400/80 hover:text-amber-300 transition-colors underline underline-offset-2"
            >
              Codex ({discoveredTiers.length}/13)
            </button>
          </div>
        </footer>
      </div>

      {/* Modals & Overlays */}
      <GrimoireModal
        isOpen={isGrimoireOpen}
        discoveredTiers={discoveredTiers}
        onClose={() => setIsGrimoireOpen(false)}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <GameOverModal
        status={gameStatus}
        score={score}
        highScore={highScore}
        moves={moves}
        highestTier={highestCurrentTier}
        canUndo={canUndo}
        onRestart={restart}
        onContinue={continuePlaying}
        onUndo={undo}
        onOpenGrimoire={() => setIsGrimoireOpen(true)}
      />

      <DiscoveryBanner
        element={newlyDiscoveredElement}
        onDismiss={dismissDiscovery}
        onOpenGrimoire={() => setIsGrimoireOpen(true)}
      />
    </div>
  );
}
