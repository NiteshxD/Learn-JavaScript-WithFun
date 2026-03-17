// =============================================================================
// ProgressBar Component — Neon progress indicator
// =============================================================================

import { motion } from "framer-motion";

const ProgressBar = ({ current, total }) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          fontWeight: 700,
          fontSize: "0.7rem",
          fontFamily: "var(--font-heading)",
          letterSpacing: "1px",
          color: "var(--text-secondary)",
        }}
      >
        <span>📝 QUESTION {current + 1} / {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          borderRadius: "var(--radius-full)",
          background: "var(--bg-secondary)",
          overflow: "hidden",
          border: "1px solid var(--border-color)",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            height: "100%",
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(90deg, var(--color-primary), var(--color-sky))",
            boxShadow: "0 0 10px rgba(0, 255, 136, 0.3)",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
