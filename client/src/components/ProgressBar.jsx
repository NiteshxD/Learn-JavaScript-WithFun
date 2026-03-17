// =============================================================================
// ProgressBar Component
// =============================================================================
// Displays quiz progress: "Question X / Y" with an animated fill bar.
// =============================================================================

import { motion } from "framer-motion";

/**
 * @param {Object} props
 * @param {number} props.current - Current question index (0-based)
 * @param {number} props.total - Total number of questions
 */
const ProgressBar = ({ current, total }) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      {/* Label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-body)",
        }}
      >
        <span>📝 Question {current + 1} / {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>

      {/* Bar Track */}
      <div
        style={{
          width: "100%",
          height: "12px",
          borderRadius: "var(--radius-full)",
          background: "var(--border-color)",
          overflow: "hidden",
        }}
      >
        {/* Animated Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            height: "100%",
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(90deg, var(--color-primary), var(--color-sky))",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
