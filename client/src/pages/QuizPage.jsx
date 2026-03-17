// =============================================================================
// Quiz Page — Main Game Screen
// =============================================================================
// The core gameplay page. Displays one question at a time with:
//   - Question card with animated entry/exit
//   - 4 option buttons with correct/wrong feedback
//   - Progress bar showing current question number
//   - Running timer
//   - Streak badge for consecutive correct answers
//   - Sound effects on answer selection
//
// GAME FLOW:
//   1. Question appears with animation
//   2. User selects an option
//   3. Correct/wrong feedback shows for 800ms
//   4. Auto-advances to next question
//   5. After question 50, redirects to /result
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

const QuizPage = () => {
  const navigate = useNavigate();
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    streak,
    isQuizActive,
    isQuizComplete,
    answerQuestion,
    setTimeTaken,
    username,
  } = useQuizContext();

  const { elapsedMs, start, stop } = useTimer();
  const { playCorrect, playWrong } = useSound();

  // Local state for answer feedback animation
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLocked, setIsLocked] = useState(false); // Prevent double-clicks

  // Keep a ref to the latest elapsedMs value so we can read it on completion
  // without adding 'elapsedMs' to the useEffect dependency array
  const elapsedMsRef = useRef(elapsedMs);
  elapsedMsRef.current = elapsedMs;

  // Start timer when quiz begins
  useEffect(() => {
    if (isQuizActive) {
      start();
    }
  }, [isQuizActive, start]);

  // Handle quiz completion — stop timer and navigate to results
  useEffect(() => {
    if (isQuizComplete) {
      stop();
      setTimeTaken(elapsedMsRef.current);
      // Small delay to ensure state propagates before navigation
      setTimeout(() => navigate("/result"), 50);
    }
  }, [isQuizComplete, stop, setTimeTaken, navigate]);

  // Redirect if user lands on this page without starting a quiz
  useEffect(() => {
    if (!isQuizActive && !isQuizComplete && !currentQuestion) {
      navigate("/");
    }
  }, [isQuizActive, isQuizComplete, currentQuestion, navigate]);

  /**
   * Handle option click — show feedback, play sound, advance
   */
  const handleAnswer = useCallback(
    (answer) => {
      if (isLocked) return; // Prevent multiple clicks during feedback
      setIsLocked(true);

      const correct = answer === currentQuestion.correctAnswer;
      setSelectedAnswer(answer);
      setIsCorrect(correct);

      // Play sound effect
      if (correct) {
        playCorrect();
      } else {
        playWrong();
      }

      // Show feedback for 800ms, then advance to next question
      setTimeout(() => {
        answerQuestion(answer);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsLocked(false);
      }, 800);
    },
    [isLocked, currentQuestion, answerQuestion, playCorrect, playWrong]
  );

  // Don't render if no question loaded yet
  if (!currentQuestion) return null;

  /**
   * Get the style for an option button based on current feedback state
   */
  const getOptionStyle = (option) => {
    const baseStyle = {
      width: "100%",
      padding: "16px 20px",
      borderRadius: "var(--radius-md)",
      border: "2px solid var(--border-color)",
      background: "var(--bg-card)",
      color: "var(--text-primary)",
      fontSize: "1rem",
      fontWeight: 600,
      fontFamily: "var(--font-body)",
      cursor: isLocked ? "default" : "pointer",
      textAlign: "left",
      transition: "all 0.2s ease",
      boxShadow: "var(--shadow-card)",
    };

    if (selectedAnswer === null) return baseStyle;

    // Show feedback colors after selection
    if (option === currentQuestion.correctAnswer) {
      return {
        ...baseStyle,
        border: "2px solid var(--color-primary)",
        background: "rgba(74, 222, 128, 0.15)",
        color: "var(--color-primary-dark)",
      };
    }

    if (option === selectedAnswer && !isCorrect) {
      return {
        ...baseStyle,
        border: "2px solid var(--color-danger)",
        background: "rgba(239, 68, 68, 0.15)",
        color: "var(--color-danger)",
      };
    }

    return { ...baseStyle, opacity: 0.5 };
  };

  // Option labels (A, B, C, D)
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <>
      <Helmet>
        <title>Quiz in Progress — JS Quiz Challenge</title>
      </Helmet>

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          padding: "24px 20px",
          maxWidth: "720px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Top Bar: Timer + Streak */}
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

          {/* Progress Bar */}
          <ProgressBar current={currentIndex} total={totalQuestions} />

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex} // Re-animate on each new question
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Badge */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    padding: "4px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {currentQuestion.category}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  👤 {username}
                </span>
              </div>

              {/* Question Text */}
              <div
                className="game-card"
                style={{ marginBottom: "20px", padding: "28px" }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.3rem",
                    lineHeight: 1.5,
                    color: "var(--text-primary)",
                  }}
                >
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "12px",
                }}
              >
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={option}
                    whileHover={!isLocked ? { scale: 1.02 } : {}}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(option)}
                    disabled={isLocked}
                    style={getOptionStyle(option)}
                    className={
                      selectedAnswer &&
                      option === selectedAnswer &&
                      !isCorrect
                        ? "animate-shake"
                        : ""
                    }
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "var(--radius-full)",
                          background:
                            selectedAnswer === null
                              ? "var(--bg-secondary)"
                              : option === currentQuestion.correctAnswer
                              ? "var(--color-primary)"
                              : option === selectedAnswer
                              ? "var(--color-danger)"
                              : "var(--bg-secondary)",
                          color:
                            selectedAnswer !== null &&
                            (option === currentQuestion.correctAnswer || option === selectedAnswer)
                              ? "#fff"
                              : "var(--text-secondary)",
                          fontWeight: 800,
                          fontSize: "0.85rem",
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
                      <span>{option}</span>
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Feedback Message */}
              <AnimatePresence>
                {selectedAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      textAlign: "center",
                      marginTop: "16px",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.2rem",
                      color: isCorrect ? "var(--color-primary)" : "var(--color-danger)",
                    }}
                  >
                    {isCorrect ? "✅ Correct! Great job!" : "❌ Wrong! Keep going!"}
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
