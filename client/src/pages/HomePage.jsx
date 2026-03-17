// =============================================================================
// Home Page — Landing / Game Start Screen
// =============================================================================
// The first page users see. Features:
//   1. Playful game title with floating animation
//   2. Username input field
//   3. Difficulty selection cards (Easy, Medium, Hard)
//   4. "Start Quiz" button that navigates to /quiz
//
// WHY USENAVATE?
//   React Router's useNavigate gives us programmatic navigation.
//   We validate inputs before navigating to prevent empty usernames.
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

  /**
   * Handle quiz start — validate, fetch questions, navigate
   */
  const handleStartQuiz = async () => {
    // Validate inputs
    if (!nameInput.trim()) {
      setError("Please enter your name to start!");
      return;
    }
    if (!selectedDifficulty) {
      setError("Please select a difficulty level!");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Save player info to context
      setUsername(nameInput.trim());
      setDifficulty(selectedDifficulty);

      // Fetch randomized questions from the API
      const questions = await fetchQuestions(selectedDifficulty, selectedCount);

      // Start the quiz and navigate
      startQuiz(questions);
      playStart();
      navigate("/quiz");
    } catch (err) {
      setError("Failed to load questions. Make sure the backend server is running!");
      console.error("Error fetching questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>JS Quiz Challenge — Test Your JavaScript Knowledge</title>
        <meta
          name="description"
          content="Challenge yourself with 50 JavaScript questions across multiple difficulty levels. Compete on the leaderboard and learn while you play!"
        />
        <meta property="og:title" content="JS Quiz Challenge — Test Your JavaScript Knowledge" />
        <meta property="og:description" content="A gamified JavaScript quiz platform. Test your skills and climb the leaderboard!" />
        <meta property="og:type" content="website" />
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
          {/* Game Title */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-sky), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
                lineHeight: 1.2,
              }}
            >
              🎮 JavaScript Quiz Challenge
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
            Test your JS knowledge • Climb the leaderboard • Have fun!
          </p>

          {/* Username Input */}
          <div style={{ marginBottom: "28px" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                marginBottom: "8px",
                color: "var(--text-primary)",
              }}
            >
              👤 What's your name, challenger?
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your name..."
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setError("");
              }}
              maxLength={30}
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
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>

          {/* Difficulty Selection */}
          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                marginBottom: "14px",
                color: "var(--text-primary)",
              }}
            >
              🎯 Choose your difficulty
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              {DIFFICULTIES.map((diff) => (
                <DifficultyCard
                  key={diff.id}
                  difficulty={diff}
                  isSelected={selectedDifficulty === diff.id}
                  onSelect={(id) => {
                    setSelectedDifficulty(id);
                    playClick();
                    setError("");
                  }}
                />
              ))}
            </div>
          </div>

          {/* Question Count Selection */}
          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                marginBottom: "14px",
                color: "var(--text-primary)",
              }}
            >
              📝 How many questions?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {QUESTION_COUNTS.map((count) => (
                <motion.button
                  key={count}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedCount(count); setError(""); }}
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
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {count}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: "var(--color-danger)",
                fontWeight: 700,
                marginBottom: "16px",
                fontSize: "0.95rem",
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
            className="btn-game btn-primary"
            style={{
              width: "100%",
              maxWidth: "320px",
              fontSize: "1.3rem",
              padding: "16px 40px",
              opacity: isLoading ? 0.7 : 1,
              marginBottom: "12px",
            }}
          >
            {isLoading ? "⏳ Loading Questions..." : "🚀 Start Solo Quiz!"}
          </motion.button>

          {/* Party Mode Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/party")}
            className="btn-game btn-accent"
            style={{
              width: "100%",
              maxWidth: "320px",
              fontSize: "1.1rem",
              padding: "14px 40px",
            }}
          >
            🎉 Party Mode (Multiplayer)
          </motion.button>

          {/* Quick Stats */}
          <p
            style={{
              marginTop: "20px",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            {selectedCount} questions • Randomized each time • Timed challenge
          </p>
        </motion.div>
      </main>
    </>
  );
};

export default HomePage;
