// =============================================================================
// Multiplayer Quiz Page — Server-Synced Game Screen
// =============================================================================
// Displays questions sent by the server. Timer is server-controlled.
// Player submits answers to server for validation (anti-cheat).
// Shows live position indicator.
// =============================================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";
import ProgressBar from "../components/ProgressBar";
import useSound from "../hooks/useSound";

const MultiplayerQuizPage = () => {
  const navigate = useNavigate();
  const {
    roomId, gameStatus, currentQuestion, questionIndex, totalQuestions,
    timeLimit, questionStartTime, selectedAnswer, answerResult,
    myScore, scoreboard, submitAnswer, finalResults,
  } = useParty();
  const { playCorrect, playWrong } = useSound();

  // Local timer for display (mirrors server timer)
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Redirect if not in game
  useEffect(() => {
    if (!roomId) navigate("/party");
  }, [roomId, navigate]);

  // Navigate to results when game finishes
  useEffect(() => {
    if (gameStatus === "finished" && finalResults) {
      navigate("/party-result");
    }
  }, [gameStatus, finalResults, navigate]);

  // Client-side timer display (the server enforces the actual deadline)
  useEffect(() => {
    if (!questionStartTime || !timeLimit) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [questionStartTime, timeLimit]);

  // Reset timer on new question
  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [questionIndex, timeLimit]);

  // Play sound on answer result
  useEffect(() => {
    if (answerResult) {
      answerResult.correct ? playCorrect() : playWrong();
    }
  }, [answerResult]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get my rank from scoreboard
  const myRank = scoreboard.findIndex((p) => p.score === myScore) + 1 || "—";

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    submitAnswer(answer);
  };

  if (!currentQuestion) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ fontSize: "3rem" }}
        >
          ⏳
        </motion.div>
      </main>
    );
  }

  const timerPercent = (timeLeft / timeLimit) * 100;
  const optionLabels = ["A", "B", "C", "D"];

  const getOptionStyle = (option) => {
    const base = {
      width: "100%",
      padding: "16px 20px",
      borderRadius: "var(--radius-md)",
      border: "2px solid var(--border-color)",
      background: "var(--bg-card)",
      color: "var(--text-primary)",
      fontSize: "1rem",
      fontWeight: 600,
      fontFamily: "var(--font-body)",
      cursor: selectedAnswer !== null ? "default" : "pointer",
      textAlign: "left",
      transition: "all 0.2s ease",
      boxShadow: "var(--shadow-card)",
    };

    if (!answerResult) {
      // Highlight selected before result comes back
      if (selectedAnswer === option) {
        return { ...base, border: "2px solid var(--color-sky)", background: "rgba(56, 189, 248, 0.15)" };
      }
      return base;
    }

    // Show feedback after result
    if (option === answerResult.correctAnswer) {
      return { ...base, border: "2px solid var(--color-primary)", background: "rgba(74, 222, 128, 0.15)" };
    }
    if (option === selectedAnswer && !answerResult.correct) {
      return { ...base, border: "2px solid var(--color-danger)", background: "rgba(239, 68, 68, 0.15)" };
    }
    return { ...base, opacity: 0.5 };
  };

  return (
    <>
      <Helmet>
        <title>{`Q${questionIndex + 1}/${totalQuestions} — Party Quiz`}</title>
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
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {/* Server Timer */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-card)",
                border: `2px solid ${timerPercent < 30 ? "var(--color-danger)" : "var(--border-color)"}`,
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                color: timerPercent < 30 ? "var(--color-danger)" : "var(--text-primary)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏱️ {Math.ceil(timeLeft / 1000)}s
            </div>

            {/* Score + Rank */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(74, 222, 128, 0.15)",
                  color: "var(--color-primary)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                🏆 #{myRank}
              </span>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(56, 189, 248, 0.15)",
                  color: "var(--color-sky)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                ⭐ {myScore}/{questionIndex + 1}
              </span>
            </div>
          </div>

          {/* Timer Bar */}
          <div
            style={{
              height: "6px",
              borderRadius: "3px",
              background: "var(--bg-secondary)",
              marginBottom: "16px",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                borderRadius: "3px",
                background: timerPercent < 30
                  ? "var(--color-danger)"
                  : "linear-gradient(90deg, var(--color-primary), var(--color-sky))",
                width: `${timerPercent}%`,
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {/* Progress */}
          <ProgressBar current={questionIndex} total={totalQuestions} />

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span
                  style={{
                    padding: "4px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  {currentQuestion.category}
                </span>
              </div>

              {/* Question */}
              <div className="game-card" style={{ marginBottom: "20px", padding: "28px" }}>
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

              {/* Options */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                {currentQuestion.options.map((option, idx) => (
                  <motion.button
                    key={option}
                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    style={getOptionStyle(option)}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "var(--radius-full)",
                          background: answerResult
                            ? option === answerResult.correctAnswer
                              ? "var(--color-primary)"
                              : option === selectedAnswer
                              ? "var(--color-danger)"
                              : "var(--bg-secondary)"
                            : selectedAnswer === option
                            ? "var(--color-sky)"
                            : "var(--bg-secondary)",
                          color: (answerResult && (option === answerResult.correctAnswer || option === selectedAnswer))
                            || selectedAnswer === option
                            ? "#fff"
                            : "var(--text-secondary)",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          flexShrink: 0,
                        }}
                      >
                        {answerResult
                          ? option === answerResult.correctAnswer
                            ? "✓"
                            : option === selectedAnswer && !answerResult.correct
                            ? "✗"
                            : optionLabels[idx]
                          : optionLabels[idx]}
                      </span>
                      <span>{option}</span>
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {answerResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      textAlign: "center",
                      marginTop: "16px",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.2rem",
                      color: answerResult.correct ? "var(--color-primary)" : "var(--color-danger)",
                    }}
                  >
                    {answerResult.correct ? "✅ Correct!" : "❌ Wrong!"}
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

export default MultiplayerQuizPage;
