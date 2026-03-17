// =============================================================================
// Timer Component
// =============================================================================
// Displays the elapsed time in MM:SS format with a clock emoji.
// =============================================================================

import { formatTime } from "../utils/helpers";

/**
 * @param {Object} props
 * @param {number} props.seconds - Elapsed seconds
 */
const Timer = ({ seconds }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 18px",
        borderRadius: "var(--radius-full)",
        background: "var(--bg-card)",
        border: "2px solid var(--border-color)",
        fontFamily: "var(--font-heading)",
        fontSize: "1.1rem",
        color: "var(--text-primary)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <span>⏱️</span>
      <span>Time: {formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;
