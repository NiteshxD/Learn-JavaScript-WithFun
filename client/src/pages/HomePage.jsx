// =============================================================================
// Home Page — Gaming Landing Screen
// =============================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useQuizContext } from "../context/QuizContext";
import DifficultyCard from "../components/DifficultyCard";
import { DIFFICULTIES, QUESTION_COUNTS } from "../utils/constants";
import { fetchQuestions } from "../utils/api";
import useSound from "../hooks/useSound";

const HomePage = () => {
  const navigate = useNavigate();
  const { setUsername, setDifficulty, startQuiz } = useQuizContext();
  const { playClick, playStart } = useSound();

  const [nameInput, setNameInput] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCount, setSelectedCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartQuiz = async () => {
    if (!nameInput.trim()) { setError("Enter your name to start!"); return; }
    if (!selectedDifficulty) { setError("Select a difficulty!"); return; }
    setError("");
    setIsLoading(true);
    try {
      setUsername(nameInput.trim());
      setDifficulty(selectedDifficulty);
      const questions = await fetchQuestions(selectedDifficulty, selectedCount);
      startQuiz(questions);
      playStart();
      navigate("/quiz");
    } catch (err) {
      setError("Failed to load questions. Is the backend running?");
      console.error("Error fetching questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>JS Quiz Challenge — Test Your JavaScript Knowledge</title>
        <meta name="description" content="Challenge yourself with JavaScript questions across multiple difficulty levels." />
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
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Title */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "3px",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-sky), var(--color-accent))",
                backgroundSize: "200% 200%",
                animation: "gradient-shift 4s ease infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}
            >
              🎮 JAVASCRIPT QUIZ
            </h1>
          </motion.div>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "36px", fontWeight: 500 }}>
            Test your JS skills • Climb the leaderboard • Have fun!
          </p>

          {/* Username Input */}
          <div style={{ marginBottom: "28px" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                fontFamily: "var(--font-heading)",
                fontSize: "0.75rem",
                letterSpacing: "2px",
                marginBottom: "10px",
                color: "var(--text-secondary)",
              }}
            >
              ENTER YOUR NAME
            </label>
            <input
              id="username"
              type="text"
              placeholder="Player name..."
              value={nameInput}
              onChange={(e) => { setNameInput(e.target.value); setError(""); }}
              maxLength={30}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                backdropFilter: "blur(12px)",
                color: "var(--text-primary)",
                fontSize: "1rem",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                outline: "none",
                transition: "all 0.3s",
                boxShadow: "var(--shadow-card)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-primary)";
                e.target.style.boxShadow = "var(--shadow-glow-green)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-color)";
                e.target.style.boxShadow = "var(--shadow-card)";
              }}
            />
          </div>

          {/* Difficulty */}
          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.75rem",
                letterSpacing: "2px",
                marginBottom: "14px",
                color: "var(--text-secondary)",
              }}
            >
              SELECT DIFFICULTY
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {DIFFICULTIES.map((diff) => (
                <DifficultyCard
                  key={diff.id}
                  difficulty={diff}
                  isSelected={selectedDifficulty === diff.id}
                  onSelect={(id) => { setSelectedDifficulty(id); playClick(); setError(""); }}
                />
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.75rem",
                letterSpacing: "2px",
                marginBottom: "14px",
                color: "var(--text-secondary)",
              }}
            >
              QUESTIONS PER ROUND
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
                      ? "rgba(0, 255, 136, 0.08)"
                      : "var(--bg-card)",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: selectedCount === count ? "var(--color-primary)" : "var(--text-primary)",
                    boxShadow: selectedCount === count ? "var(--shadow-glow-green)" : "var(--shadow-card)",
                  }}
                >
                  {count}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: "var(--color-danger)",
                fontWeight: 700,
                marginBottom: "16px",
                fontSize: "0.9rem",
              }}
            >
              ⚠️ {error}
            </motion.p>
          )}

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartQuiz}
            disabled={isLoading}
            className="btn-game btn-primary animate-pulse-glow"
            style={{
              width: "100%",
              maxWidth: "320px",
              fontSize: "1rem",
              padding: "18px 40px",
              opacity: isLoading ? 0.7 : 1,
              marginBottom: "12px",
            }}
          >
            {isLoading ? "⏳ LOADING..." : "🚀 START QUIZ"}
          </motion.button>

          {/* Party Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/party")}
            className="btn-game btn-accent"
            style={{
              width: "100%",
              maxWidth: "320px",
              fontSize: "0.9rem",
              padding: "16px 40px",
            }}
          >
            🎉 PARTY MODE (MULTIPLAYER)
          </motion.button>

          <p style={{ marginTop: "20px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
            {selectedCount} questions • Randomized • Timed
          </p>
        </motion.div>
      </main>
    </>
  );
};

export default HomePage;
