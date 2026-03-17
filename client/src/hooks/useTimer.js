// =============================================================================
// useTimer Hook — Game Timer
// =============================================================================
// Manages a seconds-based timer that starts when the quiz begins.
// Uses useRef to hold the interval ID so it persists across renders.
// =============================================================================

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Custom hook for managing a game timer
 * @returns {{ seconds, start, stop, reset, isRunning }}
 */
const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Start the timer
  const start = useCallback(() => {
    if (intervalRef.current) return; // Prevent double-starts
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  // Stop the timer
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Reset the timer
  const reset = useCallback(() => {
    stop();
    setSeconds(0);
  }, [stop]);

  // Cleanup interval on unmount to prevent memory leaks
  // IMPORTANT: Reset ref to null so start() works after React StrictMode remount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { seconds, start, stop, reset, isRunning };
};

export default useTimer;
