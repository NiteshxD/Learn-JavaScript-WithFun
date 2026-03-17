// =============================================================================
// Multiplayer Quiz Page — Server-Synced Game Screen
// =============================================================================
// Premium game UI with server-controlled timer, live rank indicator,
// answer feedback, and smooth question transitions.
// =============================================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";
import ProgressBar from "../components/ProgressBar";
import useSound from "../hooks/useSound";

const optionGradients = [
  "linear-gradient(135deg, #4ade80, #22c55e)", // A — Green
  "linear-gradient(135deg, #38bdf8, #0284c7)", // B — Blue
  "linear-gradient(135deg, #fb923c, #ea580c)", // C — Orange
  "linear-gradient(135deg, #a78bfa, #7c3aed)", // D — Purple
];

const MultiplayerQuizPage = () => {
  const navigate = useNavigate();
  const {
    roomId, gameStatus, currentQuestion, questionIndex, totalQuestions,
    timeLimit, questionStartTime, selectedAnswer, answerResult,
    myScore, scoreboard, submitAnswer, finalResults,
  } = useParty();
  const { playCorrect, playWrong } = useSound();

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

  // Client-side timer display (server enforces the actual deadline)
  useEffect(() => {
    if (!questionStartTime || !timeLimit) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      setTimeLeft(Math.max(0, timeLimit - elapsed));
    }, 50);
    return () => clearInterval(interval);
  }, [questionStartTime, timeLimit]);

  useEffect(() => { setTimeLeft(timeLimit); }, [questionIndex, timeLimit]);

  // Sound feedback
  useEffect(() => {
    if (answerResult) {
      answerResult.correct ? playCorrect() : playWrong();
    }
  }, [answerResult]); // eslint-disable-line react-hooks/exhaustive-deps

  const myRank = scoreboard.findIndex((p) => p.score === myScore) + 1 || "—";

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    submitAnswer(answer);
  };

  if (!currentQuestion) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="bg-pattern" />
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
  const timerColor = timerPercent < 25 ? "var(--color-danger)" : timerPercent < 50 ? "var(--color-secondary)" : "var(--color-primary)";
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <>
      <Helmet>
        <title>{`Q${questionIndex + 1}/${totalQuestions} — Party Quiz`}</title>
      </Helmet>

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

        <div
          style={{
            maxWidth: "700px",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ===== TOP STATUS BAR ===== */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {/* Timer circle */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 22px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-card)",
                border: `3px solid ${timerColor}`,
                boxShadow: timerPercent < 25 ? "0 0 15px rgba(239, 68, 68, 0.3)" : "var(--shadow-card)",
                fontFamily: "var(--font-heading)",
                fontSize: "1.3rem",
                color: timerColor,
                fontVariantNumeric: "tabular-nums",
                minWidth: "100px",
                justifyContent: "center",
                transition: "all 0.3s",
              }}
            >
              ⏱️ {Math.ceil(timeLeft / 1000)}s
            </div>

            {/* Score badges */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  background: "linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(234, 88, 12, 0.08))",
                  border: "2px solid var(--color-secondary)",
                  color: "var(--color-secondary)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                🏆 #{myRank}
              </span>
              <span
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  background: "linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(34, 197, 94, 0.08))",
                  border: "2px solid var(--color-primary)",
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                ⭐ {myScore}/{questionIndex + 1}
              </span>
            </div>
          </div>

          {/* Timer Bar */}
          <div
            style={{
              height: "8px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-secondary)",
              marginBottom: "16px",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                borderRadius: "var(--radius-full)",
                background: `linear-gradient(90deg, ${timerColor}, ${timerPercent < 25 ? "var(--color-danger-light)" : "var(--color-sky)"})`,
                width: `${timerPercent}%`,
                transition: "width 0.05s linear",
              }}
            />
          </div>

          {/* Progress */}
          <ProgressBar current={questionIndex} total={totalQuestions} />

          {/* ===== QUESTION CARD ===== */}
          <AnimatePresence mode="wait">
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              {/* Category badge */}
              <div style={{ marginBottom: "12px" }}>
                <span
                  style={{
                    padding: "6px 16px",
                    borderRadius: "var(--radius-full)",
                    background: "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-body)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {currentQuestion.category}
                </span>
              </div>

              {/* Question text */}
              <div
                className="game-card"
                style={{
                  marginBottom: "20px",
                  padding: "28px",
                  borderColor: "var(--color-sky)",
                  background: "linear-gradient(135deg, var(--bg-card), var(--bg-secondary))",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.35rem",
                    lineHeight: 1.5,
                    color: "var(--text-primary)",
                  }}
                >
                  {currentQuestion.question}
                </h2>
              </div>

              {/* ===== OPTIONS ===== */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = answerResult && option === answerResult.correctAnswer;
                  const isWrong = answerResult && isSelected && !answerResult.correct;
                  const isRevealed = !!answerResult;

                  return (
                    <motion.button
                      key={option}
                      whileHover={!isRevealed ? { scale: 1.03, y: -3 } : {}}
                      whileTap={!isRevealed ? { scale: 0.97 } : {}}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      style={{
                        padding: "16px 14px",
                        borderRadius: "var(--radius-lg)",
                        border: isCorrect
                          ? "3px solid var(--color-primary)"
                          : isWrong
                          ? "3px solid var(--color-danger)"
                          : isSelected
                          ? "3px solid var(--color-sky)"
                          : "2px solid var(--border-color)",
                        background: isCorrect
                          ? "linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(34, 197, 94, 0.10))"
                          : isWrong
                          ? "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.08))"
                          : "var(--bg-card)",
                        color: "var(--text-primary)",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        cursor: selectedAnswer !== null ? "default" : "pointer",
                        textAlign: "left",
                        transition: "all 0.2s ease",
                        boxShadow: isCorrect
                          ? "var(--shadow-glow-green)"
                          : isWrong
                          ? "0 0 15px rgba(239, 68, 68, 0.3)"
                          : "var(--shadow-card)",
                        opacity: isRevealed && !isCorrect && !isSelected ? 0.4 : 1,
                      }}
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
                            background: isCorrect || isWrong
                              ? isCorrect
                                ? "var(--color-primary)"
                                : "var(--color-danger)"
                              : optionGradients[idx],
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            fontFamily: "var(--font-heading)",
                            flexShrink: 0,
                          }}
                        >
                          {isCorrect ? "✓" : isWrong ? "✗" : optionLabels[idx]}
                        </span>
                        <span style={{ lineHeight: 1.4 }}>{option}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Answer feedback */}
              <AnimatePresence>
                {answerResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.4rem",
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
