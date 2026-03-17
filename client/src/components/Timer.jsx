// =============================================================================
// Timer Component — Neon timer display
// =============================================================================

const formatTimerDisplay = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const cc = String(centiseconds).padStart(2, "0");
  return `${mm}:${ss}.${cc}`;
};

const Timer = ({ elapsedMs }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "var(--radius-full)",
        background: "var(--bg-card)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border-glow)",
        fontFamily: "var(--font-heading)",
        fontSize: "0.9rem",
        fontWeight: 700,
        letterSpacing: "1px",
        color: "var(--color-primary)",
        boxShadow: "var(--shadow-card)",
        minWidth: "160px",
        fontVariantNumeric: "tabular-nums",
        textShadow: "0 0 10px rgba(0, 255, 136, 0.3)",
      }}
    >
      <span>⏱️</span>
      <span>{formatTimerDisplay(elapsedMs)}</span>
    </div>
  );
};

export default Timer;
