// =============================================================================
// Result Page — Score Dashboard
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
    username, difficulty, score, correctAnswers, wrongAnswers,
    timeTaken, totalQuestions, questions, userAnswers, maxStreak, isQuizComplete, resetQuiz,
  } = useQuizContext();

  const { playCelebration } = useSound();
  const [showShare, setShowShare] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const accuracy = calculateAccuracy(correctAnswers, totalQuestions);
  const weakCategories = analyzeWeakCategories(questions, userAnswers);

  useEffect(() => {
    if (!isQuizComplete || !username) { navigate("/"); return; }
    playCelebration();
    if (!submitted) {
      submitScore({ username, score, correctAnswers, wrongAnswers, timeTaken, difficulty, questionCount: totalQuestions })
        .catch((err) => console.error("Failed to submit score:", err));
      setSubmitted(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getScoreEmoji = () => {
    if (accuracy >= 90) return "🏆";
    if (accuracy >= 70) return "🌟";
    if (accuracy >= 50) return "👍";
    return "💪";
  };

  const getMessage = () => {
    if (accuracy >= 90) return "Outstanding! You're a JavaScript master!";
    if (accuracy >= 70) return "Great job! You know your JavaScript well!";
    if (accuracy >= 50) return "Good effort! Keep practicing to improve!";
    return "Don't give up! Practice makes perfect!";
  };

  const handlePlayAgain = () => { resetQuiz(); navigate("/"); };

  const StatCard = ({ label, value, emoji, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="game-card"
      style={{
        padding: "20px",
        textAlign: "center",
        borderColor: `${color}30`,
      }}
    >
      <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{emoji}</div>
      <div style={{ fontSize: "1.4rem", fontFamily: "var(--font-heading)", fontWeight: 700, color, letterSpacing: "1px" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginTop: "6px", fontFamily: "var(--font-heading)", letterSpacing: "1px", textTransform: "uppercase" }}>
        {label}
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet><title>{`Results — ${score}/${totalQuestions} — JS Quiz`}</title></Helmet>
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 20px",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />
        <div style={{ maxWidth: "700px", width: "100%", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            style={{ textAlign: "center", marginBottom: "32px" }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: "4rem", marginBottom: "12px", filter: "drop-shadow(0 0 20px rgba(0,255,136,0.4))" }}
            >
              {getScoreEmoji()}
            </motion.div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.2rem, 4vw, 2rem)",
                fontWeight: 900,
                letterSpacing: "3px",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-sky))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
              QUIZ COMPLETE!
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", fontWeight: 500 }}>
              Well played, {username}! {getMessage()}
            </p>
          </motion.div>

          {/* Big Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="game-card"
            style={{
              textAlign: "center",
              padding: "36px",
              marginBottom: "24px",
              borderColor: "rgba(0, 255, 136, 0.2)",
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.05), rgba(0, 212, 255, 0.03))",
            }}
          >
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "3.5rem", fontWeight: 900, color: "var(--color-primary)", lineHeight: 1, letterSpacing: "3px", textShadow: "0 0 30px rgba(0,255,136,0.3)" }}>
              {score} / {totalQuestions}
            </div>
            <div style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 700, marginTop: "10px", fontFamily: "var(--font-heading)", fontSize: "0.8rem", letterSpacing: "2px" }}>
              ACCURACY: {accuracy}%
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            <StatCard label="Correct" value={correctAnswers} emoji="✅" color="var(--color-primary)" />
            <StatCard label="Wrong" value={wrongAnswers} emoji="❌" color="var(--color-danger)" />
            <StatCard label="Time" value={formatTimeReadable(timeTaken)} emoji="⏱️" color="var(--color-sky)" />
            <StatCard label="Best Streak" value={`${maxStreak}🔥`} emoji="💪" color="var(--color-secondary)" />
          </div>

          {/* Weak Categories */}
          {weakCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="game-card"
              style={{ marginBottom: "24px", borderColor: "rgba(255, 107, 53, 0.15)" }}
            >
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", letterSpacing: "1px", marginBottom: "12px", color: "var(--color-secondary)" }}>
                📚 IMPROVE IN:
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {weakCategories.map((cat) => (
                  <span key={cat} style={{ padding: "6px 14px", borderRadius: "var(--radius-full)", background: "rgba(255, 107, 53, 0.1)", border: "1px solid rgba(255, 107, 53, 0.2)", color: "var(--color-secondary)", fontWeight: 700, fontSize: "0.8rem" }}>
                    {cat}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handlePlayAgain} className="btn-game btn-primary">
              🔄 PLAY AGAIN
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowShare(true)} className="btn-game btn-accent">
              📤 SHARE
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/leaderboard")} className="btn-game btn-secondary">
              🏆 LEADERBOARD
            </motion.button>
          </div>
        </div>

        <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} score={score} total={totalQuestions} difficulty={difficulty} />
      </main>
    </>
  );
};

export default ResultPage;
