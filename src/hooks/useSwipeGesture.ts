/**
 * @file useSwipeGesture.ts
 * @description Mobile-first touch and swipe gesture controller hook.
 * Handles swipe detection with velocity thresholds while preventing accidental viewport scrolling.
 */

import { useEffect, useRef } from 'react';
import { Direction } from '../types/game';

interface UseSwipeGestureOptions {
  onSwipe: (direction: Direction) => void;
  threshold?: number;
  disabled?: boolean;
}

/**
 * Attaches touch event listeners to a target element to capture fluid directional swipe gestures.
 *
 * @param elementRef - React ref to the target container element (e.g., the game board).
 * @param options - Configuration including callback, threshold in px, and enabled state.
 */
export function useSwipeGesture(
  elementRef: React.RefObject<HTMLElement | null>,
  { onSwipe, threshold = 30, disabled = false }: UseSwipeGestureOptions
) {
  const startCoord = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startCoord.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent browser default pull-to-refresh or rubber-band scrolling during board interaction
      if (startCoord.current && e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startCoord.current) return;
      if (e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startCoord.current.x;
      const deltaY = touch.clientY - startCoord.current.y;
      startCoord.current = null;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Check if distance exceeded minimum swipe threshold
      if (Math.max(absX, absY) < threshold) {
        return;
      }

      if (absX > absY) {
        // Horizontal swipe
        onSwipe(deltaX > 0 ? 'RIGHT' : 'LEFT');
      } else {
        // Vertical swipe
        onSwipe(deltaY > 0 ? 'DOWN' : 'UP');
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onSwipe, threshold, disabled]);
}
