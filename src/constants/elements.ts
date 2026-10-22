/**
 * @file elements.ts
 * @description Catalog of elements, tier progression metadata, and game configuration constants.
 */

import { ElementDefinition } from '../types/game';

/**
 * Complete list of alchemical element tiers for Elemental Fusion.
 */
export const ELEMENTS: ElementDefinition[] = [
  {
    tier: 1,
    name: 'Breeze',
    subTitle: 'First Breath of Zephyr',
    symbol: '🜁',
    color: '#38BDF8', // Sky 400
    glowColor: 'rgba(56, 189, 248, 0.45)',
    gradientClass: 'from-sky-500/80 via-sky-600/70 to-blue-700/80 border-sky-400/30',
    textClass: 'text-sky-100',
    value: 2,
    lore: 'A gentle whisper of the atmosphere, capable of carrying seeds across vast canyons.',
    quote: 'The softest gust initiates the greatest tempests.'
  },
  {
    tier: 2,
    name: 'Droplet',
    subTitle: 'Essence of Living Water',
    symbol: '🜄',
    color: '#06B6D4', // Cyan 500
    glowColor: 'rgba(6, 182, 212, 0.45)',
    gradientClass: 'from-cyan-500/80 via-teal-600/70 to-blue-800/80 border-cyan-400/30',
    textClass: 'text-cyan-100',
    value: 4,
    lore: 'Pure condensation gathered from dawn mist, bearing the fundamental memory of rivers.',
    quote: 'Water bends to all obstacles, yet erodes mountain peaks.'
  },
  {
    tier: 3,
    name: 'Pebble',
    subTitle: 'Heart of the Bedrock',
    symbol: '🜃',
    color: '#10B981', // Emerald 500
    glowColor: 'rgba(16, 185, 129, 0.45)',
    gradientClass: 'from-emerald-500/80 via-green-600/70 to-teal-800/80 border-emerald-400/30',
    textClass: 'text-emerald-100',
    value: 8,
    lore: 'A fragment of primordial continent, tempered by eons beneath seismic pressure.',
    quote: 'Unshakable patience carved from the spine of the earth.'
  },
  {
    tier: 4,
    name: 'Ember',
    subTitle: 'Spark of the Hearth',
    symbol: '🜂',
    color: '#F97316', // Orange 500
    glowColor: 'rgba(249, 115, 22, 0.5)',
    gradientClass: 'from-orange-500/80 via-amber-600/70 to-red-700/80 border-orange-400/40',
    textClass: 'text-amber-100',
    value: 16,
    lore: 'A dormant coal glowing in the dark, harboring hunger to warm civilizations or burn cities.',
    quote: 'From a single seed of heat, life discovers warmth.'
  },
  {
    tier: 5,
    name: 'Tempest',
    subTitle: 'Arc of Ionized Fury',
    symbol: '⚡',
    color: '#EAB308', // Yellow 500
    glowColor: 'rgba(234, 179, 8, 0.5)',
    gradientClass: 'from-amber-400/80 via-yellow-500/70 to-orange-600/80 border-yellow-300/40',
    textClass: 'text-yellow-50',
    value: 32,
    lore: 'When air collides violently with water, electricity splits the veil of heaven.',
    quote: 'Swift as thought, shattering the stillness of time.'
  },
  {
    tier: 6,
    name: 'Glacier',
    subTitle: 'Crystalline Cryosphere',
    symbol: '❄️',
    color: '#67E8F9', // Cyan 300
    glowColor: 'rgba(103, 232, 249, 0.55)',
    gradientClass: 'from-cyan-400/80 via-sky-500/70 to-indigo-700/80 border-cyan-200/40',
    textClass: 'text-white',
    value: 64,
    lore: 'Water slowed to absolute stillness, locking ancient sunlight into impenetrable sheets.',
    quote: 'In total zero, motion ceases and truth freezes.'
  },
  {
    tier: 7,
    name: 'Flora',
    subTitle: 'Verdant Loom of Life',
    symbol: '🌿',
    color: '#84CC16', // Lime 500
    glowColor: 'rgba(132, 204, 22, 0.55)',
    gradientClass: 'from-lime-500/80 via-emerald-600/70 to-green-800/80 border-lime-300/40',
    textClass: 'text-lime-50',
    value: 128,
    lore: 'The miraculous synthesis of earth, air, water, and sunlight into conscious botanical foliage.',
    quote: 'Life will break stone before it surrenders to silence.'
  },
  {
    tier: 8,
    name: 'Inferno',
    subTitle: 'Crucible of Liquid Magma',
    symbol: '🌋',
    color: '#EF4444', // Red 500
    glowColor: 'rgba(239, 68, 68, 0.6)',
    gradientClass: 'from-red-500/80 via-rose-600/70 to-orange-800/80 border-red-400/40',
    textClass: 'text-rose-50',
    value: 256,
    lore: 'Subterranean rock liquefying under immense heat, reshaping entire continental shelves.',
    quote: 'Destruction and genesis forge at the same fiery anvil.'
  },
  {
    tier: 9,
    name: 'Aether',
    subTitle: 'Arcane Quintessence',
    symbol: '🔮',
    color: '#A855F7', // Purple 500
    glowColor: 'rgba(168, 85, 247, 0.6)',
    gradientClass: 'from-purple-500/80 via-fuchsia-600/70 to-indigo-800/80 border-purple-300/40',
    textClass: 'text-purple-50',
    value: 512,
    lore: 'The celestial medium through which cosmic vibrations propagate across reality.',
    quote: 'Beyond flesh and matter rests the pure geometry of will.'
  },
  {
    tier: 10,
    name: 'Astral',
    subTitle: 'Starlight Radiance',
    symbol: '🌟',
    color: '#EC4899', // Pink 500
    glowColor: 'rgba(236, 72, 153, 0.65)',
    gradientClass: 'from-pink-500/80 via-rose-600/70 to-purple-800/80 border-pink-300/40',
    textClass: 'text-pink-50',
    value: 1024,
    lore: 'Photons emitted across millions of light years, carrying the lineage of ancestral galaxies.',
    quote: 'We are constellations observing our own dawn.'
  },
  {
    tier: 11,
    name: 'Supernova',
    subTitle: 'Solar Singularity (2048)',
    symbol: '☀️',
    color: '#F59E0B', // Amber 500
    glowColor: 'rgba(245, 158, 11, 0.8)',
    gradientClass: 'from-amber-400 via-yellow-500 to-rose-600 border-amber-200/60 shadow-lg shadow-amber-500/30',
    textClass: 'text-yellow-950 font-bold',
    value: 2048,
    lore: 'A catastrophic collapse and rebirth of a stellar heart, synthesizing heavy gold and platinum.',
    quote: 'The apex of stellar transmutation—the legendary fusion!'
  },
  {
    tier: 12,
    name: 'Void',
    subTitle: 'Event Horizon',
    symbol: '🌌',
    color: '#6366F1', // Indigo 500
    glowColor: 'rgba(99, 102, 241, 0.75)',
    gradientClass: 'from-indigo-600 via-violet-800 to-slate-950 border-indigo-400/50 shadow-lg shadow-indigo-600/30',
    textClass: 'text-indigo-100',
    value: 4096,
    lore: 'The boundary where physics fractures and time wraps around itself in eternal stillness.',
    quote: 'In total emptiness, infinite possibility sleeps.'
  },
  {
    tier: 13,
    name: 'Genesis',
    subTitle: 'Eternal Cosmic Core',
    symbol: '♾️',
    color: '#14B8A6', // Teal 500
    glowColor: 'rgba(20, 184, 166, 0.85)',
    gradientClass: 'from-teal-400 via-cyan-500 to-emerald-700 border-teal-200/60 shadow-xl shadow-teal-400/40',
    textClass: 'text-slate-950 font-extrabold',
    value: 8192,
    lore: 'The supreme fusion of all elemental disciplines into perpetual cosmic creation.',
    quote: 'Beginning without end, power without boundary.'
  }
];

/**
 * Storage key constants for localStorage.
 */
export const STORAGE_KEYS = {
  HIGH_SCORE: 'elemental_fusion_high_score',
  DISCOVERIES: 'elemental_fusion_discoveries',
  SOUND_MUTED: 'elemental_fusion_sound_muted',
  BOARD_SIZE: 'elemental_fusion_board_size'
} as const;

/**
 * Default game constants.
 */
export const DEFAULT_BOARD_SIZE = 4;
export const WINNING_TIER = 11; // Tier 11 is Supernova (2048)
export const MAX_UNDO_CHARGES = 3;
export const MAX_CATALYST_CHARGES = 2;
