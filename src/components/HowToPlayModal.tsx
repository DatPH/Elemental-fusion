/**
 * @file HowToPlayModal.tsx
 * @description Educational modal explaining game rules, movement gestures,
 * elemental fusion hierarchy, and strategic abilities.
 */

import React from 'react';
import { ArrowUpDown, BookOpen, Sparkles, Trophy, X, Zap } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How to play guide"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-[#0d1322] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <h2 className="text-xl font-bold text-white font-['Cinzel',serif] tracking-wide">
            How To Play
          </h2>
          <button
            onClick={onClose}
            aria-label="Close guide"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-slate-300 text-sm">
          {/* Step 1: Slide */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">1. Slide the Grid</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Swipe in any direction on mobile or use <strong className="text-slate-200">Arrow keys</strong> / <strong className="text-slate-200">WASD</strong> on desktop. All tiles slide as far as they can go.
              </p>
            </div>
          </div>

          {/* Step 2: Fuse */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">2. Fuse Matching Elements</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                When two identical elements collide, they fuse into the next higher tier in the alchemical chain.
                (e.g., Breeze + Breeze → Droplet, Droplet + Droplet → Pebble).
              </p>
            </div>
          </div>

          {/* Step 3: Combos */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">3. Build Chain Combos</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Consecutive moves that generate merges increase your Combo multiplier, ramping up your final score exponentially.
              </p>
            </div>
          </div>

          {/* Step 4: Tactical Powers */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">4. Undo & Catalyst Rescue</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Made a mistake? Use Undo. When the grid is tight, invoke your <strong className="text-amber-300">Catalyst</strong> charges to magically upgrade the lowest element on the board.
              </p>
            </div>
          </div>

          {/* Step 5: Victory */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">5. The Supernova Singularity</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Fuse up to <strong className="text-amber-300">Tier 11: Supernova</strong> (Value 2,048) to achieve Victory! After winning, you can continue into the Void and Genesis tiers for eternal glory.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors"
          >
            Start Playing
          </button>
        </div>
      </div>
    </div>
  );
};
