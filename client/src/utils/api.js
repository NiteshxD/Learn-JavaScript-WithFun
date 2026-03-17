// =============================================================================
// API Utility — Centralized HTTP Client
// =============================================================================
// All API calls go through this module. Using a centralized approach:
//   1. Single source of truth for the base URL
//   2. Easy to add auth headers, interceptors, etc. later
//   3. Clean, consistent error handling
// =============================================================================

import axios from "axios";

// Base URL — Uses VITE_API_URL env var if set, otherwise auto-detect:
//   - In development (localhost): use local backend at localhost:5000
//   - In production: use deployed backend on Render
const API_BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://learn-javascript-withfun.onrender.com/api");

// Create an Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Fetch quiz questions by difficulty level
 * @param {string} difficulty - "easy" | "medium" | "hard"
 * @param {number} [count=10] - Number of questions (10, 25, or 50)
 * @returns {Promise<Array>} Array of question objects
 */
export const fetchQuestions = async (difficulty, count = 10) => {
  const response = await api.get(`/questions?difficulty=${difficulty}&count=${count}`);
  return response.data.data;
};

/**
 * Submit a quiz score to the leaderboard
 * @param {Object} scoreData - { username, score, correctAnswers, wrongAnswers, timeTaken, difficulty }
 * @returns {Promise<Object>} The created leaderboard entry
 */
export const submitScore = async (scoreData) => {
  const response = await api.post("/leaderboard", scoreData);
  return response.data;
};

/**
 * Fetch leaderboard entries
 * @param {string} [difficulty] - Optional difficulty filter
 * @param {number} [questionCount] - Optional question count filter (10, 25, or 50)
 * @returns {Promise<Array>} Array of leaderboard entries
 */
export const fetchLeaderboard = async (difficulty, questionCount) => {
  const params = new URLSearchParams();
  if (difficulty) params.append("difficulty", difficulty);
  if (questionCount) params.append("questionCount", questionCount);
  const query = params.toString();
  const url = query ? `/leaderboard?${query}` : "/leaderboard";
  const response = await api.get(url);
  return response.data.data;
};

export default api;
