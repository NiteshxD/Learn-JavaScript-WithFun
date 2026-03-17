// =============================================================================
// useSound Hook — Game Sound Effects
// =============================================================================
// Plays audio feedback for game events. Uses HTML5 Audio API.
// Sounds are preloaded as Audio objects for instant playback.
//
// NOTE: Browsers require a user interaction before playing audio.
// That's why we only play sounds after user clicks (answer selection, etc.)
// =============================================================================

import { useCallback, useRef } from "react";

/**
 * Custom hook for playing game sound effects
 * Uses data URIs for simple sounds to avoid external file dependencies
 */
const useSound = () => {
  const audioContextRef = useRef(null);

  // Get or create AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  /**
   * Play a synthesized beep sound
   * @param {number} frequency - Hz (higher = more positive sound)
   * @param {number} duration - Seconds
   * @param {string} type - Oscillator type: sine, square, triangle, sawtooth
   */
  const playTone = useCallback(
    (frequency, duration = 0.15, type = "sine") => {
      try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

        // Fade out to avoid clicking
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch (e) {
        // Silently fail if audio isn't supported
      }
    },
    [getAudioContext]
  );

  // ---- Sound Effect Functions ----

  /** Play ascending notes for correct answer */
  const playCorrect = useCallback(() => {
    playTone(523, 0.1, "sine");   // C5
    setTimeout(() => playTone(659, 0.1, "sine"), 100); // E5
    setTimeout(() => playTone(784, 0.15, "sine"), 200); // G5
  }, [playTone]);

  /** Play descending buzz for wrong answer */
  const playWrong = useCallback(() => {
    playTone(200, 0.3, "sawtooth");
    setTimeout(() => playTone(150, 0.3, "sawtooth"), 150);
  }, [playTone]);

  /** Play an upbeat jingle for game start */
  const playStart = useCallback(() => {
    const notes = [262, 330, 392, 523]; // C4, E4, G4, C5
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.12, "sine"), i * 120);
    });
  }, [playTone]);

  /** Play a celebration fanfare for results */
  const playCelebration = useCallback(() => {
    const notes = [523, 659, 784, 1047, 784, 1047]; // C5 E5 G5 C6 G5 C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, "triangle"), i * 150);
    });
  }, [playTone]);

  /** Play a tick sound for UI interactions */
  const playClick = useCallback(() => {
    playTone(800, 0.05, "sine");
  }, [playTone]);

  return {
    playCorrect,
    playWrong,
    playStart,
    playCelebration,
    playClick,
  };
};

export default useSound;
