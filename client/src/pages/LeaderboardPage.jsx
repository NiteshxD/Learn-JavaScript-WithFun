// =============================================================================
// Leaderboard Page — Neon Ranked Table
// =============================================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { fetchLeaderboard } from "../utils/api";
import { formatTimeReadable } from "../utils/helpers";

const LeaderboardPage = () => {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("");
  const [countFilter, setCountFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchLeaderboard(filter || undefined, countFilter || undefined);
        setEntries(data);
      } catch (err) {
        setError("Failed to load leaderboard. Is the backend running?");
        console.error("Leaderboard error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadLeaderboard();
  }, [filter, countFilter]);

  const getRankBadge = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  const getRankGlow = (index) => {
    if (index === 0) return "rgba(255, 215, 0, 0.06)";
    if (index === 1) return "rgba(192, 192, 192, 0.04)";
    if (index === 2) return "rgba(205, 127, 50, 0.04)";
    return "transparent";
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "easy": return "var(--color-primary)";
      case "medium": return "var(--color-secondary)";
      case "hard": return "var(--color-accent)";
      default: return "var(--text-muted)";
    }
  };

  const filterButtons = [
    { label: "ALL", value: "" },
    { label: "🌱 EASY", value: "easy" },
    { label: "⚡ MEDIUM", value: "medium" },
    { label: "🔥 HARD", value: "hard" },
  ];

  return (
    <>
      <Helmet>
        <title>Leaderboard — JS Quiz Challenge</title>
        <meta name="description" content="Top JavaScript quiz scores." />
      </Helmet>

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "32px 20px",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />

        <div style={{ maxWidth: "900px", width: "100%", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", marginBottom: "28px" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.2rem, 4vw, 2rem)",
                fontWeight: 900,
                letterSpacing: "3px",
                background: "linear-gradient(135deg, var(--color-gold), var(--color-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🏆 LEADERBOARD
            </h1>
            <p style={{ color: "var(--text-secondary)", fontWeight: 500, marginTop: "4px", fontSize: "0.9rem" }}>
              Top JavaScript quiz challengers
            </p>
          </motion.div>

          {/* Difficulty Filter */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {filterButtons.map((btn) => (
              <motion.button
                key={btn.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(btn.value)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "var(--radius-full)",
                  border: filter === btn.value ? "1px solid var(--color-primary)" : "1px solid var(--border-color)",
                  background: filter === btn.value
                    ? "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))"
                    : "var(--bg-card)",
                  backdropFilter: "blur(10px)",
                  color: filter === btn.value ? "#0a0e1a" : "var(--text-secondary)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "1px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: filter === btn.value ? "var(--shadow-glow-green)" : "none",
                }}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>

          {/* Count Filter */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
            {[{ label: "ALL", value: "" }, { label: "10 QS", value: "10" }, { label: "25 QS", value: "25" }, { label: "50 QS", value: "50" }].map((btn) => (
              <motion.button
                key={btn.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCountFilter(btn.value)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "var(--radius-full)",
                  border: countFilter === btn.value ? "1px solid var(--color-accent)" : "1px solid var(--border-color)",
                  background: countFilter === btn.value
                    ? "linear-gradient(135deg, var(--color-accent-dark), var(--color-accent))"
                    : "var(--bg-card)",
                  backdropFilter: "blur(10px)",
                  color: countFilter === btn.value ? "#fff" : "var(--text-secondary)",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "1px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: countFilter === btn.value ? "var(--shadow-glow-purple)" : "none",
                }}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>

          {/* States */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ fontSize: "2.5rem", display: "inline-block" }}>⏳</motion.div>
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading)", fontSize: "0.8rem", letterSpacing: "2px", marginTop: "12px" }}>LOADING...</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-danger)", fontWeight: 700 }}>
              ⚠️ {error}
            </div>
          )}

          {!isLoading && !error && entries.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🏜️</div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", letterSpacing: "2px", color: "var(--text-muted)" }}>NO SCORES YET</p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && entries.length > 0 && (
            <div className="game-card" style={{ overflow: "hidden", padding: 0 }}>
              {/* Header Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "55px 1fr 75px 80px 90px",
                  padding: "14px 20px",
                  background: "rgba(0, 255, 136, 0.03)",
                  borderBottom: "1px solid var(--border-color)",
                  fontWeight: 800,
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <span>RANK</span>
                <span>PLAYER</span>
                <span style={{ textAlign: "center" }}>SCORE</span>
                <span style={{ textAlign: "center" }}>TIME</span>
                <span style={{ textAlign: "center" }}>LEVEL</span>
              </div>

              {entries.map((entry, index) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "55px 1fr 75px 80px 90px",
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--border-color)",
                    alignItems: "center",
                    background: getRankGlow(index),
                    transition: "background 0.2s",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 255, 136, 0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = getRankGlow(index))}
                >
                  <span style={{ fontWeight: 800, fontSize: index < 3 ? "1.3rem" : "0.85rem", fontFamily: "var(--font-heading)" }}>
                    {getRankBadge(index)}
                  </span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.username}
                  </span>
                  <span style={{ textAlign: "center", fontWeight: 800, color: "var(--color-primary)", fontFamily: "var(--font-heading)", fontSize: "0.9rem" }}>
                    {entry.score}/{entry.correctAnswers + entry.wrongAnswers}
                  </span>
                  <span style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                    {formatTimeReadable(entry.timeTaken)}
                  </span>
                  <span style={{ textAlign: "center" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        background: `${getDifficultyColor(entry.difficulty)}15`,
                        border: `1px solid ${getDifficultyColor(entry.difficulty)}30`,
                        color: getDifficultyColor(entry.difficulty),
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {entry.difficulty}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default LeaderboardPage;
