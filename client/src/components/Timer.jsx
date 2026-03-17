// =============================================================================
// Timer Component
// =============================================================================
// Displays the elapsed time in MM:SS.cc format (centiseconds / hundredths).
// =============================================================================

/**
 * Format milliseconds to MM:SS.cc string
 */
const formatTimerDisplay = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10); // hundredths of a second

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const cc = String(centiseconds).padStart(2, "0");
  return `${mm}:${ss}.${cc}`;
};

/**
 * @param {Object} props
 * @param {number} props.elapsedMs - Elapsed milliseconds
 */
const Timer = ({ elapsedMs }) => {
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
        minWidth: "160px",
        fontVariantNumeric: "tabular-nums", // Prevents layout shift with changing digits
      }}
    >
      <span>⏱️</span>
      <span>{formatTimerDisplay(elapsedMs)}</span>
    </div>
  );
};

export default Timer;
