// =============================================================================
// Party Page — Create or Join a Multiplayer Room
// =============================================================================
// Premium game UI matching the playful "Cut the Rope 2" design system.
// =============================================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";
import { useSocket } from "../context/SocketContext";
import DifficultyCard from "../components/DifficultyCard";
import { DIFFICULTIES, QUESTION_COUNTS } from "../utils/constants";

const PartyPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useSocket();
  const { createRoom, joinRoom, roomError, clearError, gameStatus, roomId } = useParty();

  const [mode, setMode] = useState(null); // "create" | "join"
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCount, setSelectedCount] = useState(10);

  // Navigate to lobby when room is ready (via useEffect to avoid render-time setState)
  useEffect(() => {
    if (gameStatus === "waiting" && roomId) {
      navigate("/lobby");
    }
  }, [gameStatus, roomId, navigate]);

  const handleCreate = () => {
    if (!username.trim() || !selectedDifficulty) return;
    createRoom(username.trim(), { difficulty: selectedDifficulty, questionCount: selectedCount });
  };

  const handleJoin = () => {
    if (!username.trim() || !joinCode.trim()) return;
    joinRoom(joinCode.trim().toUpperCase(), username.trim());
  };

  return (
    <>
      <Helmet>
        <title>Party Mode — JS Quiz Challenge</title>
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
            maxWidth: "620px",
            width: "100%",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Title */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
                background: "linear-gradient(135deg, var(--color-accent), var(--color-pink), var(--color-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
                lineHeight: 1.2,
              }}
            >
              🎉 Party Mode
            </h1>
          </motion.div>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
              marginBottom: "32px",
              fontWeight: 600,
            }}
          >
            Challenge your friends in real-time • Up to 8 players!
          </p>

          {!isConnected && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                padding: "10px 20px",
                borderRadius: "var(--radius-full)",
                background: "rgba(251, 146, 60, 0.15)",
                color: "var(--color-secondary)",
                fontWeight: 700,
                marginBottom: "20px",
                display: "inline-block",
              }}
            >
              ⏳ Connecting to server...
            </motion.div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {roomError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="game-card"
                onClick={clearError}
                style={{
                  padding: "14px 24px",
                  marginBottom: "24px",
                  borderColor: "var(--color-danger)",
                  background: "rgba(239, 68, 68, 0.08)",
                  cursor: "pointer",
                }}
              >
                <p style={{ color: "var(--color-danger)", fontWeight: 700, fontSize: "0.95rem" }}>
                  ❌ {roomError}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                  Click to dismiss
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mode Selection — Two big buttons */}
          {!mode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-game btn-primary"
                onClick={() => { setMode("create"); clearError(); }}
                disabled={!isConnected}
                style={{ padding: "20px 44px", fontSize: "1.3rem" }}
              >
                🏠 Create Room
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-game btn-accent"
                onClick={() => { setMode("join"); clearError(); }}
                disabled={!isConnected}
                style={{ padding: "20px 44px", fontSize: "1.3rem" }}
              >
                🚪 Join Room
              </motion.button>
            </motion.div>
          )}

          {/* ====== CREATE ROOM FORM ====== */}
          <AnimatePresence mode="wait">
            {mode === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Username */}
                <div style={{ marginBottom: "28px" }}>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      marginBottom: "8px",
                      color: "var(--text-primary)",
                    }}
                  >
                    👤 What's your name, host?
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name..."
                    maxLength={20}
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      borderRadius: "var(--radius-xl)",
                      border: "2px solid var(--border-color)",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      fontSize: "1rem",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxShadow: "var(--shadow-card)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                  />
                </div>

                {/* Difficulty */}
                <div style={{ marginBottom: "28px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      marginBottom: "14px",
                      color: "var(--text-primary)",
                    }}
                  >
                    🎯 Choose difficulty
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    {DIFFICULTIES.map((diff) => (
                      <DifficultyCard
                        key={diff.id}
                        difficulty={diff}
                        isSelected={selectedDifficulty === diff.id}
                        onSelect={(id) => setSelectedDifficulty(id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div style={{ marginBottom: "28px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      marginBottom: "14px",
                      color: "var(--text-primary)",
                    }}
                  >
                    📝 Questions per round
                  </p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    {QUESTION_COUNTS.map((count) => (
                      <motion.button
                        key={count}
                        whileHover={{ scale: 1.08, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCount(count)}
                        className="game-card"
                        style={{
                          padding: "14px 28px",
                          cursor: "pointer",
                          borderColor: selectedCount === count ? "var(--color-primary)" : "var(--border-color)",
                          background: selectedCount === count
                            ? "linear-gradient(135deg, rgba(74, 222, 128, 0.12), rgba(34, 197, 94, 0.08))"
                            : "var(--bg-card)",
                          fontFamily: "var(--font-heading)",
                          fontSize: "1.4rem",
                          color: selectedCount === count ? "var(--color-primary)" : "var(--text-primary)",
                          boxShadow: selectedCount === count ? "var(--shadow-glow-green)" : "var(--shadow-card)",
                        }}
                      >
                        {count}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-game btn-primary"
                    onClick={handleCreate}
                    disabled={!username.trim() || !selectedDifficulty || !isConnected}
                    style={{ padding: "16px 40px", fontSize: "1.2rem" }}
                  >
                    🚀 Create Room
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-game btn-secondary"
                    onClick={() => setMode(null)}
                    style={{ padding: "16px 28px", fontSize: "1.1rem" }}
                  >
                    ← Back
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ====== JOIN ROOM FORM ====== */}
            {mode === "join" && (
              <motion.div
                key="join"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Username */}
                <div style={{ marginBottom: "28px" }}>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      marginBottom: "8px",
                      color: "var(--text-primary)",
                    }}
                  >
                    👤 What's your name?
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name..."
                    maxLength={20}
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      borderRadius: "var(--radius-xl)",
                      border: "2px solid var(--border-color)",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      fontSize: "1rem",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxShadow: "var(--shadow-card)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                  />
                </div>

                {/* Room Code */}
                <div style={{ marginBottom: "28px" }}>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      marginBottom: "8px",
                      color: "var(--text-primary)",
                    }}
                  >
                    🔑 Room Code
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    maxLength={6}
                    style={{
                      width: "100%",
                      padding: "18px 20px",
                      borderRadius: "var(--radius-xl)",
                      border: "3px dashed var(--color-accent)",
                      background: "var(--bg-card)",
                      color: "var(--color-accent-dark)",
                      fontSize: "2rem",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      textAlign: "center",
                      letterSpacing: "10px",
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxShadow: "var(--shadow-card)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-game btn-accent"
                    onClick={handleJoin}
                    disabled={!username.trim() || !joinCode.trim() || !isConnected}
                    style={{ padding: "16px 40px", fontSize: "1.2rem" }}
                  >
                    🚪 Join Room
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-game btn-secondary"
                    onClick={() => setMode(null)}
                    style={{ padding: "16px 28px", fontSize: "1.1rem" }}
                  >
                    ← Back
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer hint when no mode selected */}
          {!mode && (
            <p style={{ marginTop: "24px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Compete in real-time • Server-synced timer • Anti-cheat protected
            </p>
          )}
        </motion.div>
      </main>
    </>
  );
};

export default PartyPage;
