/**
 * @file soundFX.ts
 * @description Web Audio API sound synthesizer for Elemental Fusion.
 * Generates procedural audio effects without external asset dependencies.
 */

import { STORAGE_KEYS } from '../constants/elements';

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Read persisted mute state
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SOUND_MUTED);
      if (stored !== null) {
        this.isMuted = stored === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  /**
   * Lazily initializes the AudioContext upon first user interaction to satisfy browser autoplay policies.
   */
  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Toggles audio mute setting.
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(this.isMuted));
    } catch {
      // Ignore localStorage failure in restricted contexts
    }
    return this.isMuted;
  }

  /**
   * Returns current mute status.
   */
  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a smooth subtle whoosh for tile slides.
   */
  public playSlide(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Plays a harmonic chime when elements fuse, scaled dynamically by element tier.
   * Higher tiers produce richer, higher-frequency overtone bells.
   *
   * @param tier - Tier number of the newly formed element (1-13).
   * @param combo - Current combo multiplier.
   */
  public playMerge(tier: number, combo: number = 1): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Base pentatonic frequency scale
      const baseFreqs = [220, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66];
      const root = baseFreqs[Math.min(tier - 1, baseFreqs.length - 1)] || 440;

      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = tier >= 8 ? 'triangle' : 'sine';
      overtone.type = 'sine';

      // Pitch slightly higher if combo is active
      const comboMultiplier = 1 + Math.min(combo - 1, 5) * 0.05;
      const finalFreq = root * comboMultiplier;

      osc.frequency.setValueAtTime(finalFreq, ctx.currentTime);
      overtone.frequency.setValueAtTime(finalFreq * 1.5, ctx.currentTime); // Perfect fifth overtone

      const duration = tier >= 9 ? 0.35 : 0.22;
      const volume = Math.min(0.08 + (tier * 0.005), 0.15);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      overtone.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
      overtone.stop(ctx.currentTime + duration);
    } catch {
      // Silent error handling
    }
  }

  /**
   * Plays a distinct power transmutation sound for the Catalyst ability.
   */
  public playCatalyst(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Silent error handling
    }
  }

  /**
   * Plays an inspiring multi-tone arpeggio when player achieves the 2048 Supernova win condition.
   */
  public playVictory(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major chord up to high E
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0.07, ctx.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.08);
        osc.stop(ctx.currentTime + index * 0.08 + 0.35);
      });
    } catch {
      // Silent error handling
    }
  }

  /**
   * Plays a solemn descending minor chord when no legal moves remain.
   */
  public playGameOver(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [392.00, 329.63, 261.63, 196.00]; // Descending notes
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.12 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.12);
        osc.stop(ctx.currentTime + index * 0.12 + 0.3);
      });
    } catch {
      // Silent error handling
    }
  }

  /**
   * Plays a subtle UI click tick.
   */
  public playClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Silent error handling
    }
  }
}

export const soundFX = new SoundEffectsManager();
