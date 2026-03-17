// =============================================================================
// Quiz Context — Global Game State Management
// =============================================================================
// Manages all quiz-related state: username, difficulty, questions, score,
// user answers, and results. This is the "brain" of the game.
//
// WHY CONTEXT INSTEAD OF A STATE LIBRARY?
//   For a project of this size, React Context is sufficient.
//   It avoids the complexity of Redux/Zustand while keeping state
//   accessible across all pages (Home → Quiz → Result).
//
// STATE FLOW:
//   Home (set username + difficulty) → Quiz (play game) → Result (view stats)
// =============================================================================

import { createContext, useContext, useState, useCallback } from "react";

const QuizContext = createContext();

/**
 * QuizProvider wraps the app and provides all game state
 */
export const QuizProvider = ({ children }) => {
  // ---- Player Info ----
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // ---- Questions ----
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ---- Answers & Score ----
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // ---- Timer ----
  const [timeTaken, setTimeTaken] = useState(0);

  // ---- Quiz State ----
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  /**
   * Start a new quiz game
   * @param {Array} fetchedQuestions - Questions from the API
   */
  const startQuiz = useCallback((fetchedQuestions) => {
    setQuestions(fetchedQuestions);
    setCurrentIndex(0);
    setUserAnswers([]);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeTaken(0);
    setIsQuizActive(true);
    setIsQuizComplete(false);
  }, []);

  /**
   * Record an answer and advance to the next question
   * @param {string} answer - The user's selected answer
   */
  const answerQuestion = useCallback(
    (answer) => {
      const currentQuestion = questions[currentIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;

      // Update answers array
      setUserAnswers((prev) => [...prev, answer]);

      // Update score and streak
      if (isCorrect) {
        setScore((prev) => prev + 1);
        setStreak((prev) => {
          const newStreak = prev + 1;
          setMaxStreak((max) => Math.max(max, newStreak));
          return newStreak;
        });
      } else {
        setStreak(0); // Reset streak on wrong answer
      }

      // Move to next question or finish quiz
      if (currentIndex + 1 >= questions.length) {
        setIsQuizActive(false);
        setIsQuizComplete(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, questions]
  );

  /**
   * Reset all quiz state for a new game
   */
  const resetQuiz = useCallback(() => {
    setQuestions([]);
    setCurrentIndex(0);
    setUserAnswers([]);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeTaken(0);
    setIsQuizActive(false);
    setIsQuizComplete(false);
  }, []);

  // Computed values
  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length;
  const correctAnswers = score;
  const wrongAnswers = userAnswers.length - score;

  const value = {
    // Player
    username,
    setUsername,
    difficulty,
    setDifficulty,
    // Questions
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    // Answers & Score
    userAnswers,
    score,
    correctAnswers,
    wrongAnswers,
    streak,
    maxStreak,
    // Timer
    timeTaken,
    setTimeTaken,
    // State
    isQuizActive,
    isQuizComplete,
    // Actions
    startQuiz,
    answerQuestion,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

/**
 * Custom hook to access quiz context
 * @returns {Object} Quiz state and actions
 */
export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
};
