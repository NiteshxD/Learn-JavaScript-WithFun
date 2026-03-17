// =============================================================================
// DifficultyCard Component
// =============================================================================
// Displays a difficulty option (Easy, Medium, Hard) on the home page.
// Uses Framer Motion for hover/tap animations and dynamic gradient styling.
// =============================================================================

import { motion } from "framer-motion";

/**
 * @param {Object} props
 * @param {Object} props.difficulty - Difficulty config from constants.js
 * @param {boolean} props.isSelected - Whether this card is currently selected
 * @param {Function} props.onSelect - Callback when card is clicked
 */
const DifficultyCard = ({ difficulty, isSelected, onSelect }) => {
  return (
    <motion.button
      onClick={() => onSelect(difficulty.id)}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: "100%",
        padding: "24px 20px",
        borderRadius: "var(--radius-lg)",
        border: isSelected
          ? `3px solid ${difficulty.color}`
          : "3px solid var(--border-color)",
        background: isSelected
          ? difficulty.gradient
          : "var(--bg-card)",
        color: isSelected ? "#fff" : "var(--text-primary)",
        cursor: "pointer",
        textAlign: "center",
        transition: "border-color 0.3s ease",
        boxShadow: isSelected
          ? `0 8px 30px rgba(0, 0, 0, 0.2)`
          : "var(--shadow-card)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Difficulty Emoji */}
      <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
        {difficulty.emoji}
      </div>

      {/* Difficulty Label */}
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.4rem",
          margin: "0 0 6px 0",
        }}
      >
        {difficulty.label}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: "0.85rem",
          margin: 0,
          opacity: isSelected ? 0.9 : 0.7,
        }}
      >
        {difficulty.description}
      </p>
    </motion.button>
  );
};

export default DifficultyCard;
