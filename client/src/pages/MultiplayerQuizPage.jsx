// =============================================================================
// Multiplayer Quiz Page — Server-Synced Gaming Screen
// =============================================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParty } from "../context/PartyContext";
import ProgressBar from "../components/ProgressBar";
import useSound from "../hooks/useSound";

const optionColors = [
  { gradient: "linear-gradient(135deg, #00ff88, #00cc6a)", glow: "var(--shadow-glow-green)" },
  { gradient: "linear-gradient(135deg, #00d4ff, #00a8cc)", glow: "var(--shadow-glow-cyan)" },
  { gradient: "linear-gradient(135deg, #ff6b35, #e55a2b)", glow: "var(--shadow-glow-orange)" },
  { gradient: "linear-gradient(135deg, #a855f7, #7c3aed)", glow: "var(--shadow-glow-purple)" },
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

  useEffect(() => { if (!roomId) navigate("/party"); }, [roomId, navigate]);
  useEffect(() => { if (gameStatus === "finished" && finalResults) navigate("/party-result"); }, [gameStatus, finalResults, navigate]);

  useEffect(() => {
    if (!questionStartTime || !timeLimit) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      setTimeLeft(Math.max(0, timeLimit - elapsed));
    }, 50);
    return () => clearInterval(interval);
  }, [questionStartTime, timeLimit]);

  useEffect(() => { setTimeLeft(timeLimit); }, [questionIndex, timeLimit]);

  useEffect(() => {
    if (answerResult) answerResult.correct ? playCorrect() : playWrong();
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
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ fontSize: "3rem" }}>⏳</motion.div>
      </main>
    );
  }

  const timerPercent = (timeLeft / timeLimit) * 100;
  const timerColor = timerPercent < 25 ? "var(--color-danger)" : timerPercent < 50 ? "var(--color-secondary)" : "var(--color-primary)";
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <>
      <Helmet><title>{`Q${questionIndex + 1}/${totalQuestions} — Party Quiz`}</title></Helmet>
      <main style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px", position: "relative" }}>
        <div className="bg-pattern" />
        <div style={{ maxWidth: "700px", width: "100%", position: "relative", zIndex: 1 }}>

          {/* Top Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
            {/* Timer */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 22px",
              borderRadius: "var(--radius-full)", background: "var(--bg-card)", backdropFilter: "blur(12px)",
              border: `2px solid ${timerColor}`, boxShadow: timerPercent < 25 ? "0 0 20px rgba(255,59,59,0.3)" : "var(--shadow-card)",
              fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 800, letterSpacing: "1px",
              color: timerColor, fontVariantNumeric: "tabular-nums", minWidth: "100px", justifyContent: "center", transition: "all 0.3s",
            }}>
              ⏱️ {Math.ceil(timeLeft / 1000)}s
            </div>

            {/* Rank + Score */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ padding: "8px 16px", borderRadius: "var(--radius-full)", background: "rgba(255, 107, 53, 0.08)", border: "1px solid rgba(255, 107, 53, 0.2)", color: "var(--color-secondary)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "1px" }}>
                🏆 #{myRank}
              </span>
              <span style={{ padding: "8px 16px", borderRadius: "var(--radius-full)", background: "rgba(0, 255, 136, 0.08)", border: "1px solid rgba(0, 255, 136, 0.15)", color: "var(--color-primary)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "1px" }}>
                ⭐ {myScore}/{questionIndex + 1}
              </span>
            </div>
          </div>

          {/* Timer Bar */}
          <div style={{ height: "6px", borderRadius: "var(--radius-full)", background: "var(--bg-secondary)", marginBottom: "16px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
            <div style={{ height: "100%", borderRadius: "var(--radius-full)", background: `linear-gradient(90deg, ${timerColor}, var(--color-sky))`, width: `${timerPercent}%`, transition: "width 0.05s linear", boxShadow: `0 0 10px ${timerColor}` }} />
          </div>

          <ProgressBar current={questionIndex} total={totalQuestions} />

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              <div style={{ marginBottom: "12px" }}>
                <span style={{ padding: "6px 16px", borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--color-accent), var(--color-pink))", color: "#fff", fontSize: "0.65rem", fontWeight: 700, fontFamily: "var(--font-heading)", letterSpacing: "1px", textTransform: "uppercase" }}>
                  {currentQuestion.category}
                </span>
              </div>

              <div className="game-card" style={{ marginBottom: "20px", padding: "28px", borderColor: "rgba(0, 212, 255, 0.1)", background: "linear-gradient(135deg, var(--bg-card), rgba(0, 212, 255, 0.02))" }}>
                <h2 style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.6, color: "var(--text-primary)" }}>
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options 2×2 */}
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
                        padding: "16px 14px", borderRadius: "var(--radius-lg)",
                        border: isCorrect ? "2px solid var(--color-primary)" : isWrong ? "2px solid var(--color-danger)" : "1px solid var(--border-color)",
                        background: isCorrect ? "rgba(0, 255, 136, 0.08)" : isWrong ? "rgba(255, 59, 59, 0.08)" : "var(--bg-card)",
                        backdropFilter: "blur(12px)",
                        color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: 700, fontFamily: "var(--font-body)",
                        cursor: selectedAnswer !== null ? "default" : "pointer", textAlign: "left",
                        transition: "all 0.2s ease",
                        boxShadow: isCorrect ? "var(--shadow-glow-green)" : isWrong ? "0 0 20px rgba(255,59,59,0.2)" : "var(--shadow-card)",
                        opacity: isRevealed && !isCorrect && !isSelected ? 0.3 : 1,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: "34px", height: "34px", borderRadius: "var(--radius-full)",
                          background: isCorrect ? "var(--color-primary)" : isWrong ? "var(--color-danger)" : optionColors[idx].gradient,
                          color: "#fff", fontWeight: 800, fontSize: "0.8rem", fontFamily: "var(--font-heading)", flexShrink: 0,
                        }}>
                          {isCorrect ? "✓" : isWrong ? "✗" : optionLabels[idx]}
                        </span>
                        <span style={{ lineHeight: 1.4 }}>{option}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {answerResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ textAlign: "center", marginTop: "20px", fontFamily: "var(--font-heading)", fontSize: "0.9rem", letterSpacing: "2px", color: answerResult.correct ? "var(--color-primary)" : "var(--color-danger)", textShadow: answerResult.correct ? "0 0 20px rgba(0,255,136,0.5)" : "0 0 20px rgba(255,59,59,0.5)" }}>
                    {answerResult.correct ? "✅ CORRECT!" : "❌ WRONG!"}
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
