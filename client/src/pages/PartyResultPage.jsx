// =============================================================================
// Party Result Page — Neon Rankings
// =============================================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";
import { formatTimeReadable } from "../utils/helpers";
import useSound from "../hooks/useSound";

const rankStyles = {
  1: { emoji: "🥇", glow: "rgba(255, 215, 0, 0.15)", border: "rgba(255, 215, 0, 0.3)" },
  2: { emoji: "🥈", glow: "rgba(192, 192, 192, 0.1)", border: "rgba(192, 192, 192, 0.2)" },
  3: { emoji: "🥉", glow: "rgba(205, 127, 50, 0.1)", border: "rgba(205, 127, 50, 0.2)" },
};

const PartyResultPage = () => {
  const navigate = useNavigate();
  const { finalResults, leaveRoom, resetParty } = useParty();
  const { playCelebration } = useSound();

  useEffect(() => {
    if (!finalResults) { navigate("/party"); return; }
    playCelebration();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!finalResults) return null;

  const { rankings, settings } = finalResults;
  const winner = rankings[0];

  return (
    <>
      <Helmet><title>Party Results — JS Quiz</title></Helmet>
      <main style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative" }}>
        <div className="bg-pattern" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: "650px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>

          {/* Winner */}
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }} style={{ marginBottom: "28px" }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: "5rem", marginBottom: "12px", filter: "drop-shadow(0 0 30px rgba(255,215,0,0.4))" }}>
              🏆
            </motion.div>
            <h1 style={{
              fontFamily: "var(--font-heading)", fontSize: "clamp(1.2rem, 5vw, 2.2rem)", fontWeight: 900, letterSpacing: "3px",
              background: "linear-gradient(135deg, var(--color-gold), var(--color-secondary), var(--color-pink))",
              backgroundSize: "200% 200%", animation: "gradient-shift 3s ease infinite",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px",
            }}>
              {winner?.username.toUpperCase()} WINS!
            </h1>
            <span style={{ padding: "8px 20px", borderRadius: "var(--radius-full)", background: "rgba(0, 255, 136, 0.06)", border: "1px solid rgba(0, 255, 136, 0.15)", color: "var(--color-primary)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "1px" }}>
              {settings.difficulty.toUpperCase()} • {settings.questionCount} QUESTIONS
            </span>
          </motion.div>

          {/* Rankings Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="game-card" style={{ padding: 0, marginBottom: "24px", overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "55px 1fr 75px 70px 85px", padding: "14px 20px",
              background: "rgba(0, 255, 136, 0.03)", borderBottom: "1px solid var(--border-color)",
              fontWeight: 800, fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", fontFamily: "var(--font-heading)",
            }}>
              <span>RANK</span><span>PLAYER</span><span style={{ textAlign: "center" }}>SCORE</span><span style={{ textAlign: "center" }}>ACC.</span><span style={{ textAlign: "center" }}>TIME</span>
            </div>

            {rankings.map((player, idx) => {
              const rs = rankStyles[player.rank];
              return (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.12, type: "spring", stiffness: 150 }}
                  style={{
                    display: "grid", gridTemplateColumns: "55px 1fr 75px 70px 85px", padding: "16px 20px",
                    borderBottom: "1px solid var(--border-color)", alignItems: "center",
                    background: rs ? rs.glow : "transparent",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 255, 136, 0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = rs ? rs.glow : "transparent")}
                >
                  <span style={{ fontWeight: 800, fontSize: rs ? "1.4rem" : "0.85rem", fontFamily: "var(--font-heading)" }}>
                    {rs ? rs.emoji : `#${player.rank}`}
                  </span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: rs ? "0.9rem" : "0.85rem", fontFamily: "var(--font-heading)", letterSpacing: "0.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {player.username}
                  </span>
                  <span style={{ textAlign: "center", fontWeight: 800, color: "var(--color-primary)", fontFamily: "var(--font-heading)", fontSize: "0.9rem" }}>
                    {player.score}/{player.totalQuestions}
                  </span>
                  <span style={{ textAlign: "center", fontWeight: 700, fontSize: "0.8rem", color: player.accuracy >= 70 ? "var(--color-primary)" : player.accuracy >= 40 ? "var(--color-secondary)" : "var(--color-danger)" }}>
                    {player.accuracy}%
                  </span>
                  <span style={{ textAlign: "center", color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.8rem" }}>
                    {formatTimeReadable(player.totalTime)}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-primary" onClick={() => { resetParty(); navigate("/party"); }} style={{ padding: "16px 36px" }}>
              🔄 PLAY AGAIN
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-secondary" onClick={() => { leaveRoom(); navigate("/"); }} style={{ padding: "16px 28px" }}>
              🏠 HOME
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
};

export default PartyResultPage;
