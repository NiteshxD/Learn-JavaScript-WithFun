// =============================================================================
// Party Result Page — End-of-Game Rankings
// =============================================================================
// Premium podium-style results with animated rank reveals and celebration.
// =============================================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";
import { formatTimeReadable } from "../utils/helpers";
import useSound from "../hooks/useSound";

const rankStyles = {
  1: {
    emoji: "🥇",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    glow: "0 0 25px rgba(251, 191, 36, 0.4)",
    size: "1.3rem",
  },
  2: {
    emoji: "🥈",
    gradient: "linear-gradient(135deg, #94a3b8, #64748b)",
    glow: "0 0 15px rgba(148, 163, 184, 0.3)",
    size: "1.15rem",
  },
  3: {
    emoji: "🥉",
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    glow: "0 0 15px rgba(249, 115, 22, 0.3)",
    size: "1.1rem",
  },
};

const PartyResultPage = () => {
  const navigate = useNavigate();
  const { finalResults, leaveRoom, resetParty } = useParty();
  const { playCelebration } = useSound();

  useEffect(() => {
    if (!finalResults) {
      navigate("/party");
      return;
    }
    playCelebration();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!finalResults) return null;

  const { rankings, settings } = finalResults;
  const winner = rankings[0];

  const handlePlayAgain = () => {
    resetParty();
    navigate("/party");
  };

  const handleGoHome = () => {
    leaveRoom();
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>Party Results — JS Quiz Challenge</title>
      </Helmet>

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: "650px",
            width: "100%",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ===== WINNER ANNOUNCEMENT ===== */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
            style={{ marginBottom: "28px" }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontSize: "5rem",
                marginBottom: "12px",
                filter: "drop-shadow(0 4px 20px rgba(251, 191, 36, 0.4))",
              }}
            >
              🏆
            </motion.div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 6vw, 3rem)",
                background: "linear-gradient(135deg, var(--color-secondary), var(--color-pink), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
                lineHeight: 1.2,
              }}
            >
              {winner?.username} Wins!
            </h1>
            <span
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-full)",
                background: "linear-gradient(135deg, rgba(74, 222, 128, 0.12), rgba(56, 189, 248, 0.08))",
                border: "2px solid var(--color-primary)",
                color: "var(--color-primary)",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)} • {settings.questionCount} Questions
            </span>
          </motion.div>

          {/* ===== RANKINGS TABLE ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="game-card"
            style={{ padding: "0", marginBottom: "24px", overflow: "hidden" }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "55px 1fr 75px 75px 85px",
                padding: "14px 20px",
                background: "var(--bg-secondary)",
                borderBottom: "2px solid var(--border-color)",
                fontWeight: 800,
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontFamily: "var(--font-body)",
              }}
            >
              <span>Rank</span>
              <span>Player</span>
              <span style={{ textAlign: "center" }}>Score</span>
              <span style={{ textAlign: "center" }}>Acc.</span>
              <span style={{ textAlign: "center" }}>Time</span>
            </div>

            {/* Rows */}
            {rankings.map((player, idx) => {
              const style = rankStyles[player.rank] || null;
              return (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.12, type: "spring", stiffness: 150 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "55px 1fr 75px 75px 85px",
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--border-color)",
                    alignItems: "center",
                    background: idx === 0
                      ? "linear-gradient(135deg, rgba(251, 191, 36, 0.06), rgba(249, 115, 22, 0.04))"
                      : "transparent",
                    boxShadow: style?.glow || "none",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = idx === 0
                      ? "linear-gradient(135deg, rgba(251, 191, 36, 0.06), rgba(249, 115, 22, 0.04))"
                      : "transparent")
                  }
                >
                  {/* Rank */}
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: style ? "1.4rem" : "0.95rem",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {style ? style.emoji : `#${player.rank}`}
                  </span>

                  {/* Username */}
                  <span
                    style={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontSize: style?.size || "1rem",
                      fontFamily: "var(--font-heading)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {player.username}
                  </span>

                  {/* Score */}
                  <span
                    style={{
                      textAlign: "center",
                      fontWeight: 800,
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.15rem",
                    }}
                  >
                    {player.score}/{player.totalQuestions}
                  </span>

                  {/* Accuracy */}
                  <span
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      color: player.accuracy >= 70 ? "var(--color-primary)" : player.accuracy >= 40 ? "var(--color-secondary)" : "var(--color-danger)",
                    }}
                  >
                    {player.accuracy}%
                  </span>

                  {/* Time */}
                  <span
                    style={{
                      textAlign: "center",
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    {formatTimeReadable(player.totalTime)}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ===== ACTION BUTTONS ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-game btn-primary"
              onClick={handlePlayAgain}
              style={{ padding: "16px 36px", fontSize: "1.2rem" }}
            >
              🔄 Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-game btn-secondary"
              onClick={handleGoHome}
              style={{ padding: "16px 28px", fontSize: "1.1rem" }}
            >
              🏠 Home
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
};

export default PartyResultPage;
