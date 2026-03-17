// =============================================================================
// Lobby Page — Waiting Room Before Game Starts
// =============================================================================
// Premium game-like waiting room with live player list, shareable room code,
// host controls, and animated countdown.
// =============================================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";

const playerColors = [
  "var(--color-primary)", "var(--color-secondary)", "var(--color-accent)",
  "var(--color-sky)", "var(--color-pink)", "var(--color-primary-dark)",
  "var(--color-secondary-dark)", "var(--color-accent-dark)",
];

const LobbyPage = () => {
  const navigate = useNavigate();
  const {
    roomId, players, isHost, settings, gameStatus,
    countdown, startGame, leaveRoom, roomError,
  } = useParty();

  useEffect(() => {
    if (!roomId) navigate("/party");
  }, [roomId, navigate]);

  useEffect(() => {
    if (gameStatus === "playing") navigate("/multiplayer-quiz");
  }, [gameStatus, navigate]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
  };

  return (
    <>
      <Helmet>
        <title>{`Lobby — ${roomId || "..."} — JS Quiz Challenge`}</title>
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

        {/* ===== COUNTDOWN OVERLAY ===== */}
        <AnimatePresence>
          {gameStatus === "countdown" && countdown !== null && (
            <motion.div
              key={`countdown-${countdown}`}
              initial={{ opacity: 0, scale: 3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15, 23, 42, 0.85)",
                zIndex: 100,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "10rem",
                  background: "linear-gradient(135deg, var(--color-secondary), var(--color-pink))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                  filter: "drop-shadow(0 0 40px rgba(251, 146, 60, 0.5))",
                }}
              >
                {countdown > 0 ? countdown : "GO!"}
              </span>
              <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>
                {countdown > 0 ? "Get ready..." : ""}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: "560px",
            width: "100%",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              color: "var(--text-primary)",
              marginBottom: "20px",
            }}
          >
            🎮 Waiting Room
          </h1>

          {/* Room Code — Big clickable badge */}
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyCode}
            className="game-card"
            style={{
              padding: "20px",
              marginBottom: "8px",
              cursor: "pointer",
              borderColor: "var(--color-accent)",
              background: "linear-gradient(135deg, rgba(167, 139, 250, 0.08), rgba(244, 114, 182, 0.06))",
            }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
              ROOM CODE
            </p>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "3rem",
                letterSpacing: "10px",
                background: "linear-gradient(135deg, var(--color-accent), var(--color-pink))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {roomId}
            </div>
          </motion.div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "24px" }}>
            📋 Click to copy • Share with friends!
          </p>

          {/* Settings Badge */}
          <div style={{ marginBottom: "24px" }}>
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
          </div>

          {/* Player List */}
          <div
            className="game-card"
            style={{ padding: "24px", marginBottom: "24px", textAlign: "left" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.3rem",
                color: "var(--text-primary)",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              👥 Players ({players.length}/8)
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
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 18px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-secondary)",
                      border: `2px solid ${player.isHost ? "var(--color-secondary)" : "var(--border-color)"}`,
                      boxShadow: player.isHost ? "var(--shadow-glow-orange)" : "none",
                    }}
                  >
                    {/* Player avatar circle */}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-full)",
                        background: `linear-gradient(135deg, ${playerColors[idx]}, ${playerColors[(idx + 3) % 8]})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        flexShrink: 0,
                      }}
                    >
                      {player.isHost ? "👑" : "🎮"}
                    </div>

                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.15rem",
                        color: "var(--text-primary)",
                        flex: 1,
                      }}
                    >
                      {player.username}
                    </span>

                    {player.isHost && (
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "var(--radius-full)",
                          background: "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark))",
                          color: "#fff",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          fontFamily: "var(--font-body)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        HOST
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 2 - players.length) }).map((_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                  style={{
                    padding: "14px 18px",
                    borderRadius: "var(--radius-md)",
                    border: "2px dashed var(--border-color)",
                    color: "var(--text-muted)",
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Waiting for player...
                </motion.div>
              ))}
            </div>
          </div>

          {/* Error */}
          {roomError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: "var(--color-danger)",
                fontWeight: 700,
                marginBottom: "16px",
                fontSize: "0.95rem",
              }}
            >
              ⚠️ {roomError}
            </motion.p>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {isHost ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-game btn-primary"
                onClick={startGame}
                disabled={players.length < 2}
                style={{
                  padding: "16px 36px",
                  fontSize: "1.2rem",
                  opacity: players.length < 2 ? 0.6 : 1,
                }}
              >
                {players.length < 2 ? "⏳ Need 2+ Players" : "🚀 Start Game!"}
              </motion.button>
            ) : (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  padding: "14px 32px",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  color: "var(--text-secondary)",
                }}
              >
                ⏳ Waiting for host...
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-game btn-secondary"
              onClick={() => { leaveRoom(); navigate("/party"); }}
              style={{ padding: "16px 28px", fontSize: "1.1rem" }}
            >
              🚪 Leave
            </motion.button>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default LobbyPage;
