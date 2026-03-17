// =============================================================================
// DifficultyCard — Neon-bordered difficulty selector
// =============================================================================

import { motion } from "framer-motion";

const DifficultyCard = ({ difficulty, isSelected, onSelect }) => {
  return (
    <motion.button
      onClick={() => onSelect(difficulty.id)}
      whileHover={{ scale: 1.05, y: -6 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: "100%",
        padding: "28px 20px",
        borderRadius: "var(--radius-lg)",
        border: isSelected
          ? `2px solid ${difficulty.color}`
          : "1px solid var(--border-color)",
        background: isSelected
          ? `linear-gradient(135deg, ${difficulty.color}15, ${difficulty.color}08)`
          : "var(--bg-card)",
        backdropFilter: "blur(12px)",
        color: isSelected ? difficulty.color : "var(--text-primary)",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isSelected
          ? `0 0 30px ${difficulty.color}30, 0 8px 32px rgba(0,0,0,0.3)`
          : "var(--shadow-card)",
        fontFamily: "var(--font-body)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow overlay when selected */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${difficulty.color}10, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          {difficulty.emoji}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "1px",
            margin: "0 0 6px 0",
          }}
        >
          {difficulty.label.toUpperCase()}
        </h3>
        <p
          style={{
            fontSize: "0.8rem",
            margin: 0,
            opacity: isSelected ? 0.9 : 0.6,
            color: "var(--text-secondary)",
          }}
        >
          {difficulty.description}
        </p>
      </div>
    </motion.button>
  );
};

export default DifficultyCard;
