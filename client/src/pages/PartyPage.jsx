// =============================================================================
// Party Page — Create or Join a Multiplayer Room
// =============================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";
import { useSocket } from "../context/SocketContext";
import DifficultyCard from "../components/DifficultyCard";
import { DIFFICULTIES } from "../utils/constants";

const QUESTION_COUNTS = [10, 25, 50];

const PartyPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useSocket();
  const { createRoom, joinRoom, roomError, clearError, gameStatus, roomId } = useParty();

  const [mode, setMode] = useState(null); // "create" | "join"
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCount, setSelectedCount] = useState(10);

  // Navigate to lobby when room is ready
  if (gameStatus === "waiting" && roomId) {
    navigate("/lobby");
  }

  const handleCreate = () => {
    if (!username.trim()) return;
    if (!selectedDifficulty) return;
    createRoom(username.trim(), {
      difficulty: selectedDifficulty,
      questionCount: selectedCount,
    });
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
          padding: "32px 20px",
          maxWidth: "700px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", marginBottom: "32px" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                background: "linear-gradient(135deg, var(--color-secondary), var(--color-danger))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
              🎉 Party Mode
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", fontWeight: 600 }}>
              Create a room or join with a code!
            </p>
            {!isConnected && (
              <p style={{ color: "var(--color-danger)", marginTop: "8px", fontWeight: 700 }}>
                ⚠️ Connecting to server...
              </p>
            )}
          </motion.div>

          {/* Error Message */}
          {roomError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "2px solid var(--color-danger)",
                borderRadius: "var(--radius-md)",
                padding: "12px 20px",
                marginBottom: "20px",
                color: "var(--color-danger)",
                fontWeight: 700,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={clearError}
            >
              ❌ {roomError} <span style={{ fontSize: "0.8rem" }}>(click to dismiss)</span>
            </motion.div>
          )}

          {/* Mode Selection */}
          {!mode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-game btn-primary"
                onClick={() => { setMode("create"); clearError(); }}
                style={{ padding: "20px 40px", fontSize: "1.2rem" }}
                disabled={!isConnected}
              >
                🏠 Create Room
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-game btn-accent"
                onClick={() => { setMode("join"); clearError(); }}
                style={{ padding: "20px 40px", fontSize: "1.2rem" }}
                disabled={!isConnected}
              >
                🚪 Join Room
              </motion.button>
            </motion.div>
          )}

          {/* CREATE ROOM FORM */}
          {mode === "create" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Username */}
              <div className="game-card" style={{ padding: "24px", marginBottom: "20px" }}>
                <label
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  👤 Your Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your display name"
                  maxLength={20}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "2px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Difficulty Selection */}
              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    color: "var(--text-primary)",
                    marginBottom: "12px",
                    textAlign: "center",
                  }}
                >
                  🎯 Choose Difficulty
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {DIFFICULTIES.map((d) => (
                    <DifficultyCard
                      key={d.value}
                      difficulty={d}
                      isSelected={selectedDifficulty === d.value}
                      onSelect={() => setSelectedDifficulty(d.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="game-card" style={{ padding: "24px", marginBottom: "20px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    color: "var(--text-primary)",
                    marginBottom: "12px",
                  }}
                >
                  📝 Questions per Round
                </h3>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {QUESTION_COUNTS.map((count) => (
                    <motion.button
                      key={count}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCount(count)}
                      style={{
                        padding: "12px 24px",
                        borderRadius: "var(--radius-md)",
                        border: `2px solid ${selectedCount === count ? "var(--color-primary)" : "var(--border-color)"}`,
                        background: selectedCount === count ? "rgba(74, 222, 128, 0.15)" : "var(--bg-card)",
                        color: selectedCount === count ? "var(--color-primary)" : "var(--text-primary)",
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {count}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-game btn-primary"
                  onClick={handleCreate}
                  disabled={!username.trim() || !selectedDifficulty || !isConnected}
                  style={{ padding: "14px 32px", fontSize: "1.1rem" }}
                >
                  🚀 Create Room
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-game btn-secondary"
                  onClick={() => setMode(null)}
                  style={{ padding: "14px 32px", fontSize: "1.1rem" }}
                >
                  ← Back
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* JOIN ROOM FORM */}
          {mode === "join" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="game-card" style={{ padding: "24px", marginBottom: "20px" }}>
                <label
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  👤 Your Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your display name"
                  maxLength={20}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "2px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: "16px",
                  }}
                />
                <label
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  🔑 Room Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC123"
                  maxLength={6}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "2px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "1.3rem",
                    fontFamily: "var(--font-heading)",
                    textAlign: "center",
                    letterSpacing: "6px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-game btn-accent"
                  onClick={handleJoin}
                  disabled={!username.trim() || !joinCode.trim() || !isConnected}
                  style={{ padding: "14px 32px", fontSize: "1.1rem" }}
                >
                  🚪 Join Room
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-game btn-secondary"
                  onClick={() => setMode(null)}
                  style={{ padding: "14px 32px", fontSize: "1.1rem" }}
                >
                  ← Back
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
};

export default PartyPage;
