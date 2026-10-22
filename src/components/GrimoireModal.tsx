/**
 * @file GrimoireModal.tsx
 * @description The Element Codex / Grimoire displaying the full fusion hierarchy,
 * unlocked element lore, and alchemical aphorisms.
 */

import React from 'react';
import { ELEMENTS } from '../constants/elements';
import { Lock, X } from 'lucide-react';

interface GrimoireModalProps {
  isOpen: boolean;
  discoveredTiers: number[];
  onClose: () => void;
}

export const GrimoireModal: React.FC<GrimoireModalProps> = ({
  isOpen,
  discoveredTiers,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalElements = ELEMENTS.length;
  const discoveredCount = discoveredTiers.length;
  const percentage = Math.round((discoveredCount / totalElements) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Elemental Codex"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0d1322] border border-white/10 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div>
            <h2 className="text-xl font-bold text-white font-['Cinzel',serif] tracking-wide">
              The Elemental Codex
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{discoveredCount} of {totalElements} Elements Awakened</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-medium font-mono">{percentage}%</span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close codex"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable List of Elements */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
          {ELEMENTS.map((element) => {
            const isUnlocked = discoveredTiers.includes(element.tier);

            if (!isUnlocked) {
              return (
                <div
                  key={element.tier}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5 opacity-60"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-slate-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                        Tier {element.tier}
                      </span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="text-xs text-slate-500 font-mono">Value: {element.value}</span>
                    </div>
                    <h3 className="text-sm font-medium text-slate-400 mt-0.5">
                      Mysterious Element
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Fuse earlier elements to discover this higher alchemical domain.
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={element.tier}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-white/20 transition-all shadow-sm"
              >
                {/* Visual Icon Badge */}
                <div
                  className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                    bg-gradient-to-br ${element.gradientClass} border shadow-inner shrink-0
                  `}
                  style={{
                    boxShadow: `0 0 20px -4px ${element.glowColor}`,
                  }}
                >
                  <span className="drop-shadow-md select-none">{element.symbol}</span>
                </div>

                {/* Lore & Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-amber-400/90 font-semibold">Tier {element.tier}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-400">{element.value} pts</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{element.subTitle}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-0.5">
                    {element.name}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {element.lore}
                  </p>

                  <p className="text-[11px] text-amber-200/70 italic mt-1 font-serif">
                    "{element.quote}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors"
          >
            Close Codex
          </button>
        </div>
      </div>
    </div>
  );
};
