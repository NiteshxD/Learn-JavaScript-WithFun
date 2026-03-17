// =============================================================================
// Lobby Page — Waiting Room Before Game Starts
// =============================================================================
// Shows connected players in real-time, room code for sharing,
// and a start button for the host. Displays countdown before game begins.
// =============================================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";

const LobbyPage = () => {
  const navigate = useNavigate();
  const {
    roomId, players, isHost, settings, gameStatus,
    countdown, startGame, leaveRoom, roomError,
  } = useParty();

  // Redirect to party page if not in a room
  useEffect(() => {
    if (!roomId) navigate("/party");
  }, [roomId, navigate]);

  // Navigate to multiplayer quiz when game starts
  useEffect(() => {
    if (gameStatus === "playing") {
      navigate("/multiplayer-quiz");
    }
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
          padding: "32px 20px",
          maxWidth: "600px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Countdown Overlay */}
          <AnimatePresence>
            {gameStatus === "countdown" && countdown !== null && (
              <motion.div
                key={countdown}
                initial={{ opacity: 0, scale: 3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, type: "spring" }}
                style={{
                  position: "fixed",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.7)",
                  zIndex: 100,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "8rem",
                    color: countdown > 0 ? "var(--color-secondary)" : "var(--color-primary)",
                    textShadow: "0 0 40px rgba(251, 146, 60, 0.5)",
                  }}
                >
                  {countdown > 0 ? countdown : "GO!"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Room Code */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", marginBottom: "28px" }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 600, marginBottom: "4px" }}>
              Room Code
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={handleCopyCode}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2.5rem",
                letterSpacing: "8px",
                color: "var(--color-accent)",
                cursor: "pointer",
                background: "var(--bg-card)",
                border: "3px dashed var(--color-accent)",
                borderRadius: "var(--radius-lg)",
                padding: "12px 24px",
                display: "inline-block",
              }}
              title="Click to copy"
            >
              {roomId}
            </motion.div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "6px" }}>
              📋 Click to copy • Share with friends!
            </p>
          </motion.div>

          {/* Settings Badge */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span
              style={{
                padding: "6px 16px",
                borderRadius: "var(--radius-full)",
                background: "rgba(74, 222, 128, 0.15)",
                color: "var(--color-primary)",
                fontWeight: 700,
                fontSize: "0.9rem",
                fontFamily: "var(--font-body)",
              }}
            >
              {settings.difficulty.toUpperCase()} • {settings.questionCount} Questions
            </span>
          </div>

          {/* Player List */}
          <div className="game-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.2rem",
                color: "var(--text-primary)",
                marginBottom: "16px",
              }}
            >
              👥 Players ({players.length}/8)
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <AnimatePresence>
                {players.map((player, idx) => (
                  <motion.div
                    key={player.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.1 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-secondary)",
                      border: `2px solid ${player.isHost ? "var(--color-secondary)" : "var(--border-color)"}`,
                    }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>
                      {player.isHost ? "👑" : "🎮"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.1rem",
                        color: "var(--text-primary)",
                        flex: 1,
                      }}
                    >
                      {player.username}
                    </span>
                    {player.isHost && (
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(251, 146, 60, 0.2)",
                          color: "var(--color-secondary)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        HOST
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Error */}
          {roomError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: "var(--color-danger)",
                textAlign: "center",
                fontWeight: 700,
                marginBottom: "16px",
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
                style={{ padding: "14px 32px", fontSize: "1.1rem" }}
              >
                {players.length < 2 ? "⏳ Need 2+ Players" : "🚀 Start Game!"}
              </motion.button>
            ) : (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  padding: "14px 32px",
                  fontSize: "1.1rem",
                  fontFamily: "var(--font-heading)",
                  color: "var(--text-secondary)",
                }}
              >
                ⏳ Waiting for host to start...
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-game btn-secondary"
              onClick={() => { leaveRoom(); navigate("/party"); }}
              style={{ padding: "14px 32px", fontSize: "1.1rem" }}
            >
              🚪 Leave
            </motion.button>
          </div>
        </div>
      </main>
    </>
  );
};

export default LobbyPage;
