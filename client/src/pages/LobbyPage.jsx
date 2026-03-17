// =============================================================================
// Lobby Page — Neon Waiting Room
// =============================================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";

const playerGradients = [
  "linear-gradient(135deg, #00ff88, #00cc6a)",
  "linear-gradient(135deg, #00d4ff, #00a8cc)",
  "linear-gradient(135deg, #ff6b35, #e55a2b)",
  "linear-gradient(135deg, #a855f7, #7c3aed)",
  "linear-gradient(135deg, #ff2d87, #cc2470)",
  "linear-gradient(135deg, #ffd700, #cca800)",
  "linear-gradient(135deg, #00ff88, #00d4ff)",
  "linear-gradient(135deg, #ff6b35, #a855f7)",
];

const LobbyPage = () => {
  const navigate = useNavigate();
  const { roomId, players, isHost, settings, gameStatus, countdown, startGame, leaveRoom, roomError } = useParty();

  useEffect(() => { if (!roomId) navigate("/party"); }, [roomId, navigate]);
  useEffect(() => { if (gameStatus === "playing") navigate("/multiplayer-quiz"); }, [gameStatus, navigate]);

  const handleCopyCode = () => navigator.clipboard.writeText(roomId);

  return (
    <>
      <Helmet><title>{`Lobby — ${roomId || "..."}`}</title></Helmet>
      <main style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative" }}>
        <div className="bg-pattern" />

        {/* Countdown Overlay */}
        <AnimatePresence>
          {gameStatus === "countdown" && countdown !== null && (
            <motion.div
              key={`cd-${countdown}`}
              initial={{ opacity: 0, scale: 3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(10, 14, 26, 0.92)", zIndex: 100 }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "10rem", fontWeight: 900, background: "linear-gradient(135deg, var(--color-primary), var(--color-sky))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 60px rgba(0,255,136,0.5))" }}>
                {countdown > 0 ? countdown : "GO!"}
              </span>
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading)", fontSize: "0.8rem", letterSpacing: "3px" }}>
                {countdown > 0 ? "GET READY" : ""}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: "560px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1rem, 3vw, 1.5rem)", fontWeight: 800, letterSpacing: "3px", color: "var(--text-primary)", marginBottom: "20px" }}>
            🎮 WAITING ROOM
          </h1>

          {/* Room Code */}
          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyCode}
            className="game-card"
            style={{ padding: "20px", marginBottom: "8px", cursor: "pointer", borderColor: "rgba(168, 85, 247, 0.2)", background: "linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(255, 45, 135, 0.03))" }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: "0.65rem", fontFamily: "var(--font-heading)", letterSpacing: "3px", marginBottom: "6px" }}>ROOM CODE</p>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 900, letterSpacing: "12px", background: "linear-gradient(135deg, var(--color-accent), var(--color-pink))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "none", filter: "drop-shadow(0 0 20px rgba(168,85,247,0.3))" }}>
              {roomId}
            </div>
          </motion.div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "24px" }}>📋 Click to copy • Share with friends!</p>

          {/* Settings */}
          <div style={{ marginBottom: "24px" }}>
            <span style={{ padding: "8px 20px", borderRadius: "var(--radius-full)", background: "rgba(0, 255, 136, 0.06)", border: "1px solid rgba(0, 255, 136, 0.15)", color: "var(--color-primary)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "1px" }}>
              {settings.difficulty.toUpperCase()} • {settings.questionCount} QUESTIONS
            </span>
          </div>

          {/* Player List */}
          <div className="game-card" style={{ padding: "24px", marginBottom: "24px", textAlign: "left" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", letterSpacing: "2px", color: "var(--text-secondary)", marginBottom: "16px", textAlign: "center" }}>
              PLAYERS ({players.length}/8)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <AnimatePresence>
                {players.map((player, idx) => (
                  <motion.div
                    key={player.username}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 30, scale: 0.9 }}
                    transition={{ delay: idx * 0.08, type: "spring", stiffness: 200 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px",
                      borderRadius: "var(--radius-md)",
                      background: player.isHost ? "rgba(255, 107, 53, 0.06)" : "var(--bg-secondary)",
                      border: player.isHost ? "1px solid rgba(255, 107, 53, 0.2)" : "1px solid var(--border-color)",
                      boxShadow: player.isHost ? "var(--shadow-glow-orange)" : "none",
                    }}
                  >
                    <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-full)", background: playerGradients[idx], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                      {player.isHost ? "👑" : "🎮"}
                    </div>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1px", color: "var(--text-primary)", flex: 1 }}>
                      {player.username}
                    </span>
                    {player.isHost && (
                      <span style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark))", color: "#fff", fontSize: "0.6rem", fontWeight: 800, fontFamily: "var(--font-heading)", letterSpacing: "1px" }}>
                        HOST
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {Array.from({ length: Math.max(0, 2 - players.length) }).map((_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                  style={{ padding: "14px 18px", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-color)", color: "var(--text-muted)", textAlign: "center", fontWeight: 600, fontSize: "0.85rem" }}
                >
                  Waiting for player...
                </motion.div>
              ))}
            </div>
          </div>

          {roomError && <p style={{ color: "var(--color-danger)", fontWeight: 700, marginBottom: "16px", fontSize: "0.9rem" }}>⚠️ {roomError}</p>}

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {isHost ? (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-primary" onClick={startGame} disabled={players.length < 2}
                style={{ padding: "16px 36px", opacity: players.length < 2 ? 0.5 : 1 }}>
                {players.length < 2 ? "⏳ NEED 2+ PLAYERS" : "🚀 START GAME"}
              </motion.button>
            ) : (
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ padding: "14px 32px", fontFamily: "var(--font-heading)", fontSize: "0.8rem", letterSpacing: "2px", color: "var(--text-muted)" }}>
                WAITING FOR HOST...
              </motion.div>
            )}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-secondary" onClick={() => { leaveRoom(); navigate("/party"); }} style={{ padding: "16px 28px" }}>
              🚪 LEAVE
            </motion.button>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default LobbyPage;
