// =============================================================================
// Party Result Page — End-of-Game Rankings
// =============================================================================
// Displays the final party leaderboard after all questions are answered.
// Separate from the global leaderboard — only shows this room's results.
// =============================================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";
import { formatTimeReadable } from "../utils/helpers";
import useSound from "../hooks/useSound";

const PartyResultPage = () => {
  const navigate = useNavigate();
  const { finalResults, roomId, leaveRoom, resetParty } = useParty();
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

  const getRankEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <>
      <Helmet>
        <title>Party Results — JS Quiz Challenge</title>
      </Helmet>

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          padding: "32px 20px",
          maxWidth: "700px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Winner Announcement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            style={{ textAlign: "center", marginBottom: "32px" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "8px" }}>🏆</div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                background: "linear-gradient(135deg, var(--color-secondary), var(--color-danger))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
              {winner?.username} Wins!
            </h1>
            <p style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "1.1rem" }}>
              {settings.difficulty.toUpperCase()} • {settings.questionCount} Questions
            </p>
          </motion.div>

          {/* Rankings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="game-card"
            style={{ padding: "24px", marginBottom: "24px" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.2rem",
                marginBottom: "16px",
                color: "var(--text-primary)",
              }}
            >
              📊 Final Rankings
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "var(--font-body)",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid var(--border-color)",
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <th style={{ padding: "10px 8px", textAlign: "left" }}>Rank</th>
                    <th style={{ padding: "10px 8px", textAlign: "left" }}>Player</th>
                    <th style={{ padding: "10px 8px", textAlign: "center" }}>Score</th>
                    <th style={{ padding: "10px 8px", textAlign: "center" }}>Accuracy</th>
                    <th style={{ padding: "10px 8px", textAlign: "center" }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((player, idx) => (
                    <motion.tr
                      key={player.username}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      style={{
                        borderBottom: "1px solid var(--border-color)",
                        background: idx === 0 ? "rgba(251, 146, 60, 0.08)" : "transparent",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 8px",
                          fontSize: "1.3rem",
                          fontWeight: 700,
                        }}
                      >
                        {getRankEmoji(player.rank)}
                      </td>
                      <td
                        style={{
                          padding: "14px 8px",
                          fontFamily: "var(--font-heading)",
                          fontSize: "1rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {player.username}
                      </td>
                      <td
                        style={{
                          padding: "14px 8px",
                          textAlign: "center",
                          fontWeight: 700,
                          color: "var(--color-primary)",
                        }}
                      >
                        {player.score}/{player.totalQuestions}
                      </td>
                      <td
                        style={{
                          padding: "14px 8px",
                          textAlign: "center",
                          fontWeight: 600,
                          color: player.accuracy >= 70 ? "var(--color-primary)" : "var(--color-secondary)",
                        }}
                      >
                        {player.accuracy}%
                      </td>
                      <td
                        style={{
                          padding: "14px 8px",
                          textAlign: "center",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                        }}
                      >
                        {formatTimeReadable(player.totalTime)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-game btn-primary"
              onClick={handlePlayAgain}
            >
              🔄 Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-game btn-secondary"
              onClick={handleGoHome}
            >
              🏠 Home
            </motion.button>
          </div>
        </div>
      </main>
    </>
  );
};

export default PartyResultPage;
