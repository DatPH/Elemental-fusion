/**
 * @file DiscoveryBanner.tsx
 * @description Floating celebratory banner displayed when an alchemical element
 * is awakened for the first time.
 */

import React from 'react';
import { ElementDefinition } from '../types/game';
import { BookOpen, Sparkles, X } from 'lucide-react';

interface DiscoveryBannerProps {
  element: ElementDefinition | null;
  onDismiss: () => void;
  onOpenGrimoire: () => void;
}

export const DiscoveryBanner: React.FC<DiscoveryBannerProps> = ({
  element,
  onDismiss,
  onOpenGrimoire,
}) => {
  if (!element) return null;

  return (
    <div className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-40 animate-bounce-short">
      <div
        className={`
          relative p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3
          bg-[#0e1628]/95 backdrop-blur-xl border border-white/20 shadow-2xl
        `}
        style={{
          boxShadow: `0 8px 30px -4px ${element.glowColor}`,
        }}
      >
        {/* Element Rune Icon */}
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            bg-gradient-to-br ${element.gradientClass} border shrink-0
          `}
        >
          <span className="drop-shadow-sm select-none">{element.symbol}</span>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Element Awakened!</span>
          </div>
          <h4 className="text-sm font-bold text-white truncate mt-0.5">
            {element.name} <span className="text-xs text-slate-400 font-normal">· Tier {element.tier}</span>
          </h4>
          <p className="text-[11px] text-slate-300 line-clamp-1 italic">
            "{element.quote}"
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              onDismiss();
              onOpenGrimoire();
            }}
            className="p-2 rounded-lg bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-xs font-medium transition-colors"
            title="Inspect in Codex"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={onDismiss}
            aria-label="Dismiss banner"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
