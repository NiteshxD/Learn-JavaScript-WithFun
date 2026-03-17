// =============================================================================
// Result Page — Score Dashboard & Analysis
// =============================================================================
// Shown after completing all 50 questions. Displays:
//   - Animated score reveal with celebration
//   - Score, accuracy %, time taken
//   - Correct vs wrong breakdown
//   - Weak category analysis
//   - Share score button
//   - Option to play again or view leaderboard
//
// This page also submits the score to the leaderboard API.
// =============================================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useQuizContext } from "../context/QuizContext";
import ShareModal from "../components/ShareModal";
import { submitScore } from "../utils/api";
import { formatTimeReadable, calculateAccuracy, analyzeWeakCategories } from "../utils/helpers";
import useSound from "../hooks/useSound";

const ResultPage = () => {
  const navigate = useNavigate();
  const {
    username,
    difficulty,
    score,
    correctAnswers,
    wrongAnswers,
    timeTaken,
    totalQuestions,
    questions,
    userAnswers,
    maxStreak,
    isQuizComplete,
    resetQuiz,
  } = useQuizContext();

  const { playCelebration } = useSound();
  const [showShare, setShowShare] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const accuracy = calculateAccuracy(correctAnswers, totalQuestions);
  const weakCategories = analyzeWeakCategories(questions, userAnswers);

  // Play celebration sound and submit score on mount
  useEffect(() => {
    // Guard: redirect to home if user navigates here directly without completing a quiz
    if (!isQuizComplete || !username) {
      navigate("/");
      return;
    }

    playCelebration();

    // Submit score to leaderboard (only once)
    if (!submitted) {
      submitScore({
        username,
        score,
        correctAnswers,
        wrongAnswers,
        timeTaken,
        difficulty,
        questionCount: totalQuestions,
      }).catch((err) => console.error("Failed to submit score:", err));
      setSubmitted(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get emoji based on score percentage
  const getScoreEmoji = () => {
    if (accuracy >= 90) return "🏆";
    if (accuracy >= 70) return "🌟";
    if (accuracy >= 50) return "👍";
    return "💪";
  };

  // Get motivational message based on score
  const getMessage = () => {
    if (accuracy >= 90) return "Outstanding! You're a JavaScript master!";
    if (accuracy >= 70) return "Great job! You know your JavaScript well!";
    if (accuracy >= 50) return "Good effort! Keep practicing to improve!";
    return "Don't give up! Practice makes perfect!";
  };

  const handlePlayAgain = () => {
    resetQuiz();
    navigate("/");
  };

  // Stat card component for reuse
  const StatCard = ({ label, value, emoji, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        padding: "20px",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-card)",
        border: "2px solid var(--border-color)",
        textAlign: "center",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{emoji}</div>
      <div
        style={{
          fontSize: "1.6rem",
          fontFamily: "var(--font-heading)",
          color: color || "var(--text-primary)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          fontWeight: 600,
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>{`Quiz Results — ${score}/${totalQuestions} — JS Quiz Challenge`}</title>
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
          {/* Score Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            style={{ textAlign: "center", marginBottom: "32px" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "8px" }}>
              {getScoreEmoji()}
            </div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-sky))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
              Quiz Complete!
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Well played, {username}! {getMessage()}
            </p>
          </motion.div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="game-card"
            style={{
              textAlign: "center",
              padding: "32px",
              marginBottom: "24px",
              background: "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(56, 189, 248, 0.1))",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "3.5rem",
                color: "var(--color-primary)",
                lineHeight: 1,
              }}
            >
              {score} / {totalQuestions}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                fontWeight: 700,
                marginTop: "8px",
              }}
            >
              Accuracy: {accuracy}%
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <StatCard
              label="Correct"
              value={correctAnswers}
              emoji="✅"
              color="var(--color-primary)"
            />
            <StatCard
              label="Wrong"
              value={wrongAnswers}
              emoji="❌"
              color="var(--color-danger)"
            />
            <StatCard
              label="Time Taken"
              value={formatTimeReadable(timeTaken)}
              emoji="⏱️"
              color="var(--color-sky)"
            />
            <StatCard
              label="Best Streak"
              value={`${maxStreak}🔥`}
              emoji="💪"
              color="var(--color-secondary)"
            />
          </div>

          {/* Weak Categories */}
          {weakCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="game-card"
              style={{ marginBottom: "24px", padding: "24px" }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  marginBottom: "12px",
                  color: "var(--color-secondary)",
                }}
              >
                📚 You need improvement in:
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {weakCategories.map((cat) => (
                  <span
                    key={cat}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(251, 146, 60, 0.15)",
                      color: "var(--color-secondary-dark)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayAgain}
              className="btn-game btn-primary"
            >
              🔄 Play Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShare(true)}
              className="btn-game btn-accent"
            >
              📤 Share Score
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/leaderboard")}
              className="btn-game btn-secondary"
            >
              🏆 Leaderboard
            </motion.button>
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          score={score}
          total={totalQuestions}
          difficulty={difficulty}
        />
      </main>
    </>
  );
};

export default ResultPage;
