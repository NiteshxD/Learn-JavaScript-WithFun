// =============================================================================
// Quiz Page — Immersive Game Screen
// =============================================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useQuizContext } from "../context/QuizContext";
import ProgressBar from "../components/ProgressBar";
import Timer from "../components/Timer";
import StreakBadge from "../components/StreakBadge";
import useTimer from "../hooks/useTimer";
import useSound from "../hooks/useSound";

const optionColors = [
  { bg: "rgba(0, 255, 136, 0.06)", border: "var(--color-primary)", glow: "var(--shadow-glow-green)" },
  { bg: "rgba(0, 212, 255, 0.06)", border: "var(--color-sky)", glow: "var(--shadow-glow-cyan)" },
  { bg: "rgba(255, 107, 53, 0.06)", border: "var(--color-secondary)", glow: "var(--shadow-glow-orange)" },
  { bg: "rgba(168, 85, 247, 0.06)", border: "var(--color-accent)", glow: "var(--shadow-glow-purple)" },
];

const QuizPage = () => {
  const navigate = useNavigate();
  const {
    currentQuestion, currentIndex, totalQuestions, streak,
    isQuizActive, isQuizComplete, answerQuestion, setTimeTaken, username,
  } = useQuizContext();

  const { elapsedMs, start, stop } = useTimer();
  const { playCorrect, playWrong } = useSound();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const elapsedMsRef = useRef(elapsedMs);
  elapsedMsRef.current = elapsedMs;

  useEffect(() => { if (isQuizActive) start(); }, [isQuizActive, start]);

  useEffect(() => {
    if (isQuizComplete) {
      stop();
      setTimeTaken(elapsedMsRef.current);
      setTimeout(() => navigate("/result"), 50);
    }
  }, [isQuizComplete, stop, setTimeTaken, navigate]);

  useEffect(() => {
    if (!isQuizActive && !isQuizComplete && !currentQuestion) navigate("/");
  }, [isQuizActive, isQuizComplete, currentQuestion, navigate]);

  const handleAnswer = useCallback(
    (answer) => {
      if (isLocked) return;
      setIsLocked(true);
      const correct = answer === currentQuestion.correctAnswer;
      setSelectedAnswer(answer);
      setIsCorrect(correct);
      correct ? playCorrect() : playWrong();
      setTimeout(() => {
        answerQuestion(answer);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsLocked(false);
      }, 800);
    },
    [isLocked, currentQuestion, answerQuestion, playCorrect, playWrong]
  );

  if (!currentQuestion) return null;

  const optionLabels = ["A", "B", "C", "D"];

  const getOptionStyle = (option, idx) => {
    const oc = optionColors[idx];
    const base = {
      width: "100%",
      padding: "18px 20px",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-color)",
      background: "var(--bg-card)",
      backdropFilter: "blur(12px)",
      color: "var(--text-primary)",
      fontSize: "0.95rem",
      fontWeight: 600,
      fontFamily: "var(--font-body)",
      cursor: isLocked ? "default" : "pointer",
      textAlign: "left",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "var(--shadow-card)",
    };

    if (selectedAnswer === null) return base;

    if (option === currentQuestion.correctAnswer) {
      return { ...base, border: "2px solid var(--color-primary)", background: "rgba(0, 255, 136, 0.1)", boxShadow: "var(--shadow-glow-green)" };
    }
    if (option === selectedAnswer && !isCorrect) {
      return { ...base, border: "2px solid var(--color-danger)", background: "rgba(255, 59, 59, 0.1)", boxShadow: "0 0 20px rgba(255, 59, 59, 0.2)" };
    }
    return { ...base, opacity: 0.3 };
  };

  return (
    <>
      <Helmet><title>Quiz in Progress — JS Quiz Challenge</title></Helmet>
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />
        <div style={{ maxWidth: "720px", width: "100%", position: "relative", zIndex: 1 }}>
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <Timer elapsedMs={elapsedMs} />
            <StreakBadge streak={streak} />
          </div>

          <ProgressBar current={currentIndex} total={totalQuestions} />

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              {/* Category + Username */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span
                  style={{
                    padding: "6px 16px",
                    borderRadius: "var(--radius-full)",
                    background: "linear-gradient(135deg, var(--color-accent), var(--color-pink))",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {currentQuestion.category}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  👤 {username}
                </span>
              </div>

              {/* Question Card */}
              <div
                className="game-card"
                style={{
                  marginBottom: "20px",
                  padding: "32px",
                  borderColor: "rgba(0, 212, 255, 0.15)",
                  background: "linear-gradient(135deg, var(--bg-card), rgba(0, 212, 255, 0.03))",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: "var(--text-primary)",
                  }}
                >
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options — 2×2 grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={option}
                    whileHover={!isLocked ? { scale: 1.03, y: -3 } : {}}
                    whileTap={!isLocked ? { scale: 0.97 } : {}}
                    onClick={() => handleAnswer(option)}
                    disabled={isLocked}
                    style={getOptionStyle(option, index)}
                    className={selectedAnswer && option === selectedAnswer && !isCorrect ? "animate-shake" : ""}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "34px",
                          height: "34px",
                          borderRadius: "var(--radius-full)",
                          background: selectedAnswer === null
                            ? `linear-gradient(135deg, ${optionColors[index].border}, ${optionColors[index].border}88)`
                            : option === currentQuestion.correctAnswer
                            ? "var(--color-primary)"
                            : option === selectedAnswer
                            ? "var(--color-danger)"
                            : "var(--bg-secondary)",
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          fontFamily: "var(--font-heading)",
                          flexShrink: 0,
                        }}
                      >
                        {selectedAnswer !== null
                          ? option === currentQuestion.correctAnswer
                            ? "✓"
                            : option === selectedAnswer && !isCorrect
                            ? "✗"
                            : optionLabels[index]
                          : optionLabels[index]}
                      </span>
                      <span style={{ lineHeight: 1.4 }}>{option}</span>
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {selectedAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1rem",
                      letterSpacing: "1px",
                      color: isCorrect ? "var(--color-primary)" : "var(--color-danger)",
                      textShadow: isCorrect ? "0 0 20px rgba(0,255,136,0.5)" : "0 0 20px rgba(255,59,59,0.5)",
                    }}
                  >
                    {isCorrect ? "✅ CORRECT!" : "❌ WRONG!"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default QuizPage;
