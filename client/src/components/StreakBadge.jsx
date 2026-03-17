// =============================================================================
// StreakBadge Component
// =============================================================================
// Shows an animated streak notification when the player gets consecutive
// correct answers. Pops in with a spring animation and auto-fades.
// =============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { STREAK_MESSAGES } from "../utils/constants";

/**
 * @param {Object} props
 * @param {number} props.streak - Current streak count
 */
const StreakBadge = ({ streak }) => {
  // Only show badge when streak is 3 or above
  const showBadge = streak >= 3;

  // Find the appropriate message (use highest applicable milestone)
  const getMessage = () => {
    const milestones = [20, 15, 10, 7, 5, 3];
    for (const m of milestones) {
      if (streak >= m) return STREAK_MESSAGES[m];
    }
    return "";
  };

  return (
    <AnimatePresence>
      {showBadge && (
        <motion.div
          key={streak} // Re-animate on each new streak count
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(135deg, #ef4444, #f97316, #eab308)",
            color: "#fff",
            fontFamily: "var(--font-heading)",
            fontSize: "1.1rem",
            boxShadow: "0 4px 20px rgba(239, 68, 68, 0.4)",
          }}
        >
          <span>🔥 {streak} Correct in a Row!</span>
          <span style={{ fontSize: "0.9rem" }}>{getMessage()}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakBadge;
