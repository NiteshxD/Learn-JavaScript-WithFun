// =============================================================================
// Leaderboard Page — Ranked Player Table
// =============================================================================
// Displays a sorted table of quiz scores from the API.
// Features:
//   - Filter by difficulty level
//   - Animated row entries
//   - Rank badges (🥇🥈🥉) for top 3
//   - Responsive table design
// =============================================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { fetchLeaderboard } from "../utils/api";
import { formatTimeReadable } from "../utils/helpers";

const LeaderboardPage = () => {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState(""); // Empty = all difficulties
  const [countFilter, setCountFilter] = useState(""); // Empty = all counts
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch leaderboard data on mount and when filter changes
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

  // Rank badge for top 3
  const getRankBadge = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  // Difficulty badge color
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "easy": return "var(--color-primary)";
      case "medium": return "var(--color-secondary)";
      case "hard": return "var(--color-accent)";
      default: return "var(--text-muted)";
    }
  };

  const filterButtons = [
    { label: "All", value: "" },
    { label: "🌱 Easy", value: "easy" },
    { label: "⚡ Medium", value: "medium" },
    { label: "🔥 Hard", value: "hard" },
  ];

  return (
    <>
      <Helmet>
        <title>Leaderboard — JS Quiz Challenge</title>
        <meta name="description" content="See the top JavaScript quiz scores. Can you make it to the top?" />
      </Helmet>

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          padding: "32px 20px",
          maxWidth: "900px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", marginBottom: "28px" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                background: "linear-gradient(135deg, var(--color-secondary), var(--color-pink))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🏆 Leaderboard
            </h1>
            <p style={{ color: "var(--text-secondary)", fontWeight: 600, marginTop: "4px" }}>
              Top JavaScript quiz challengers
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            {filterButtons.map((btn) => (
              <motion.button
                key={btn.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(btn.value)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "var(--radius-full)",
                  border: "2px solid var(--border-color)",
                  background: filter === btn.value
                    ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
                    : "var(--bg-card)",
                  color: filter === btn.value ? "#fff" : "var(--text-secondary)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.2s",
                }}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>

          {/* Question Count Filter */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            {[{ label: "All Counts", value: "" }, { label: "10 Qs", value: "10" }, { label: "25 Qs", value: "25" }, { label: "50 Qs", value: "50" }].map((btn) => (
              <motion.button
                key={btn.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCountFilter(btn.value)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "var(--radius-full)",
                  border: "2px solid var(--border-color)",
                  background: countFilter === btn.value
                    ? "linear-gradient(135deg, var(--color-secondary), var(--color-accent))"
                    : "var(--bg-card)",
                  color: countFilter === btn.value ? "#fff" : "var(--text-secondary)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.2s",
                }}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-heading)",
                fontSize: "1.3rem",
              }}
            >
              ⏳ Loading leaderboard...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--color-danger)",
                fontWeight: 700,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && entries.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🏜️</div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>
                No scores yet! Be the first to play!
              </p>
            </div>
          )}

          {/* Leaderboard Table */}
          {!isLoading && !error && entries.length > 0 && (
            <div
              className="game-card"
              style={{
                overflow: "hidden",
                padding: 0,
              }}
            >
              {/* Table Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 80px 80px 100px",
                  padding: "14px 20px",
                  background: "var(--bg-secondary)",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontFamily: "var(--font-body)",
                  borderBottom: "2px solid var(--border-color)",
                }}
              >
                <span>Rank</span>
                <span>Player</span>
                <span style={{ textAlign: "center" }}>Score</span>
                <span style={{ textAlign: "center" }}>Time</span>
                <span style={{ textAlign: "center" }}>Difficulty</span>
              </div>

              {/* Table Rows */}
              {entries.map((entry, index) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 80px 80px 100px",
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--border-color)",
                    alignItems: "center",
                    background: index < 3 ? "rgba(74, 222, 128, 0.04)" : "transparent",
                    transition: "background 0.2s",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = index < 3 ? "rgba(74, 222, 128, 0.04)" : "transparent")
                  }
                >
                  {/* Rank */}
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: index < 3 ? "1.3rem" : "0.95rem",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {getRankBadge(index)}
                  </span>

                  {/* Username */}
                  <span
                    style={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.username}
                  </span>

                  {/* Score */}
                  <span
                    style={{
                      textAlign: "center",
                      fontWeight: 800,
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                    }}
                  >
                    {entry.score}/{entry.correctAnswers + entry.wrongAnswers}
                  </span>

                  {/* Time */}
                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                    }}
                  >
                    {formatTimeReadable(entry.timeTaken)}
                  </span>

                  {/* Difficulty Badge */}
                  <span style={{ textAlign: "center" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        background: `${getDifficultyColor(entry.difficulty)}22`,
                        color: getDifficultyColor(entry.difficulty),
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        textTransform: "capitalize",
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
