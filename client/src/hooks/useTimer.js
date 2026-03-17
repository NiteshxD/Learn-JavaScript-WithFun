// =============================================================================
// useTimer Hook — Millisecond-Precision Game Timer
// =============================================================================
// Uses Date.now() for accurate elapsed time instead of counting intervals.
// Stores time in MILLISECONDS for precise leaderboard tiebreaking.
// Renders at ~60fps using requestAnimationFrame for smooth display.
// =============================================================================

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Custom hook for a millisecond-precision game timer
 * @returns {{ elapsedMs, start, stop, reset, isRunning }}
 */
const useTimer = () => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Refs to hold timing state across renders
  const startTimeRef = useRef(null);     // When the timer was started
  const rafIdRef = useRef(null);         // requestAnimationFrame ID
  const accumulatedRef = useRef(0);      // Time accumulated before pauses

  // Animation loop — updates state at screen refresh rate (~60fps)
  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = Date.now();
      setElapsedMs(accumulatedRef.current + (now - startTimeRef.current));
    }
    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  // Start the timer
  const start = useCallback(() => {
    if (startTimeRef.current !== null) return; // Already running
    setIsRunning(true);
    startTimeRef.current = Date.now();
    rafIdRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Stop the timer (preserves accumulated time)
  const stop = useCallback(() => {
    if (startTimeRef.current !== null) {
      accumulatedRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setIsRunning(false);
    // Final update so displayed value matches accumulated
    setElapsedMs(accumulatedRef.current);
  }, []);

  // Reset the timer
  const reset = useCallback(() => {
    stop();
    accumulatedRef.current = 0;
    setElapsedMs(0);
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      startTimeRef.current = null;
    };
  }, []);

  return { elapsedMs, start, stop, reset, isRunning };
};

export default useTimer;
