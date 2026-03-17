// =============================================================================
// Helper Utilities
// =============================================================================
// Pure utility functions used across the application.
// These functions have no side effects and are easily testable.
// =============================================================================

/**
 * Formats milliseconds into MM:SS.cc display string
 * @param {number} ms - Total milliseconds elapsed
 * @returns {string} Formatted time string (e.g., "03:45.12")
 */
export const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const centis = Math.floor((ms % 1000) / 10);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
};

/**
 * Formats milliseconds into a human-readable string
 * @param {number} ms - Total milliseconds
 * @returns {string} e.g., "1m 30.45s"
 */
export const formatTimeReadable = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const centis = Math.floor((ms % 1000) / 10);
  if (mins === 0) return `${secs}.${String(centis).padStart(2, "0")}s`;
  return `${mins}m ${secs}.${String(centis).padStart(2, "0")}s`;
};

/**
 * Calculates accuracy percentage
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {number} Accuracy percentage (0-100)
 */
export const calculateAccuracy = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

/**
 * Generates a share message for social media
 * @param {number} score - Player's score
 * @param {number} total - Total questions
 * @param {string} difficulty - Difficulty level
 * @returns {string} Shareable message text
 */
export const generateShareMessage = (score, total, difficulty) => {
  return `🎮 I scored ${score}/${total} in the JavaScript Challenge (${difficulty} mode)! Can you beat me? 🔥`;
};

/**
 * Generates share URLs for different platforms
 * @param {string} message - The share message
 * @returns {Object} Object with platform-specific share URLs
 */
export const getShareUrls = (message) => {
  const encodedMessage = encodeURIComponent(message);
  const url = encodeURIComponent(window.location.origin);

  return {
    whatsapp: `https://wa.me/?text=${encodedMessage}%20${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${encodedMessage}`,
  };
};

/**
 * Analyzes weak categories based on wrong answers
 * @param {Array} questions - Array of question objects
 * @param {Array} userAnswers - Array of user's answers (in order)
 * @returns {Array} Array of category names where user needs improvement
 */
export const analyzeWeakCategories = (questions, userAnswers) => {
  // Track correct/total per category
  const categoryStats = {};

  questions.forEach((q, index) => {
    const category = q.category;
    if (!categoryStats[category]) {
      categoryStats[category] = { correct: 0, total: 0 };
    }
    categoryStats[category].total++;
    if (userAnswers[index] === q.correctAnswer) {
      categoryStats[category].correct++;
    }
  });

  // Find categories with less than 60% accuracy
  return Object.entries(categoryStats)
    .filter(([, stats]) => {
      const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
      return accuracy < 0.6 && stats.total >= 2; // At least 2 questions in category
    })
    .map(([category]) => category)
    .sort();
};
