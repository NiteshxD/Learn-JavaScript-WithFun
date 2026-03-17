// =============================================================================
// Party Page — Multiplayer Room Create/Join
// =============================================================================

import { useState } from "react";
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

  const [mode, setMode] = useState(null);
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCount, setSelectedCount] = useState(10);

  if (gameStatus === "waiting" && roomId) navigate("/lobby");

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
      <Helmet><title>Party Mode — JS Quiz</title></Helmet>
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
          style={{ maxWidth: "620px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}
        >
          {/* Title */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.3rem, 5vw, 2.2rem)",
                fontWeight: 900,
                letterSpacing: "3px",
                background: "linear-gradient(135deg, var(--color-accent), var(--color-pink), var(--color-secondary))",
                backgroundSize: "200% 200%",
                animation: "gradient-shift 4s ease infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
              🎉 PARTY MODE
            </h1>
          </motion.div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "32px", fontWeight: 500 }}>
            Challenge friends in real-time • Up to 8 players!
          </p>

          {!isConnected && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ padding: "10px 20px", borderRadius: "var(--radius-full)", background: "rgba(255, 107, 53, 0.1)", border: "1px solid rgba(255, 107, 53, 0.2)", color: "var(--color-secondary)", fontWeight: 700, fontSize: "0.85rem", marginBottom: "20px", display: "inline-block" }}
            >
              ⏳ Connecting to server...
            </motion.div>
          )}

          {/* Error */}
          <AnimatePresence>
            {roomError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="game-card"
                onClick={clearError}
                style={{ padding: "14px 24px", marginBottom: "24px", borderColor: "rgba(255, 59, 59, 0.3)", cursor: "pointer" }}
              >
                <p style={{ color: "var(--color-danger)", fontWeight: 700, fontSize: "0.9rem" }}>❌ {roomError}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "4px" }}>Click to dismiss</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mode Selection */}
          {!mode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-primary" onClick={() => { setMode("create"); clearError(); }} disabled={!isConnected} style={{ padding: "20px 40px", fontSize: "0.9rem" }}>
                🏠 CREATE ROOM
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-accent" onClick={() => { setMode("join"); clearError(); }} disabled={!isConnected} style={{ padding: "20px 40px", fontSize: "0.9rem" }}>
                🚪 JOIN ROOM
              </motion.button>
            </motion.div>
          )}

          {/* CREATE FORM */}
          <AnimatePresence mode="wait">
            {mode === "create" && (
              <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ marginBottom: "28px" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: "0.7rem", letterSpacing: "2px", marginBottom: "10px", color: "var(--text-secondary)" }}>YOUR NAME</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter name..." maxLength={20}
                    style={{ width: "100%", padding: "14px 20px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", background: "var(--bg-card)", backdropFilter: "blur(12px)", color: "var(--text-primary)", fontSize: "1rem", fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", transition: "all 0.3s", boxShadow: "var(--shadow-card)" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-accent)"; e.target.style.boxShadow = "var(--shadow-glow-purple)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "var(--shadow-card)"; }}
                  />
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", letterSpacing: "2px", marginBottom: "14px", color: "var(--text-secondary)" }}>SELECT DIFFICULTY</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    {DIFFICULTIES.map((diff) => (
                      <DifficultyCard key={diff.id} difficulty={diff} isSelected={selectedDifficulty === diff.id} onSelect={(id) => setSelectedDifficulty(id)} />
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", letterSpacing: "2px", marginBottom: "14px", color: "var(--text-secondary)" }}>QUESTIONS PER ROUND</p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    {QUESTION_COUNTS.map((count) => (
                      <motion.button key={count} whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedCount(count)} className="game-card"
                        style={{ padding: "14px 28px", cursor: "pointer", borderColor: selectedCount === count ? "var(--color-primary)" : "var(--border-color)", background: selectedCount === count ? "rgba(0, 255, 136, 0.08)" : "var(--bg-card)", fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: selectedCount === count ? "var(--color-primary)" : "var(--text-primary)", boxShadow: selectedCount === count ? "var(--shadow-glow-green)" : "var(--shadow-card)" }}
                      >
                        {count}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-primary" onClick={handleCreate} disabled={!username.trim() || !selectedDifficulty || !isConnected} style={{ padding: "16px 36px" }}>
                    🚀 CREATE
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-secondary" onClick={() => setMode(null)} style={{ padding: "16px 28px" }}>
                    ← BACK
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* JOIN FORM */}
            {mode === "join" && (
              <motion.div key="join" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ marginBottom: "28px" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: "0.7rem", letterSpacing: "2px", marginBottom: "10px", color: "var(--text-secondary)" }}>YOUR NAME</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter name..." maxLength={20}
                    style={{ width: "100%", padding: "14px 20px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", background: "var(--bg-card)", backdropFilter: "blur(12px)", color: "var(--text-primary)", fontSize: "1rem", fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", transition: "all 0.3s", boxShadow: "var(--shadow-card)" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-accent)"; e.target.style.boxShadow = "var(--shadow-glow-purple)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "var(--shadow-card)"; }}
                  />
                </div>
                <div style={{ marginBottom: "28px" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: "0.7rem", letterSpacing: "2px", marginBottom: "10px", color: "var(--text-secondary)" }}>ROOM CODE</label>
                  <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={6}
                    style={{ width: "100%", padding: "18px 20px", borderRadius: "var(--radius-xl)", border: "2px dashed var(--color-accent)", background: "var(--bg-card)", backdropFilter: "blur(12px)", color: "var(--color-accent)", fontSize: "2rem", fontFamily: "var(--font-heading)", fontWeight: 700, textAlign: "center", letterSpacing: "12px", outline: "none", transition: "all 0.3s", boxShadow: "var(--shadow-card)" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "var(--shadow-glow-green)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-accent)"; e.target.style.boxShadow = "var(--shadow-card)"; }}
                  />
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-accent" onClick={handleJoin} disabled={!username.trim() || !joinCode.trim() || !isConnected} style={{ padding: "16px 36px" }}>
                    🚪 JOIN
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-game btn-secondary" onClick={() => setMode(null)} style={{ padding: "16px 28px" }}>
                    ← BACK
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!mode && (
            <p style={{ marginTop: "24px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
              Real-time • Server-synced timer • Anti-cheat protected
            </p>
          )}
        </motion.div>
      </main>
    </>
  );
};

export default PartyPage;
