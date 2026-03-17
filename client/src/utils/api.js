// =============================================================================
// API Utility — Centralized HTTP Client
// =============================================================================
// All API calls go through this module. Using a centralized approach:
//   1. Single source of truth for the base URL
//   2. Easy to add auth headers, interceptors, etc. later
//   3. Clean, consistent error handling
// =============================================================================

import axios from "axios";

// Base URL — in development, Vite proxies /api to localhost:5000
// In production, set VITE_API_URL to the deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

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
 * @returns {Promise<Array>} Array of question objects
 */
export const fetchQuestions = async (difficulty) => {
  const response = await api.get(`/questions?difficulty=${difficulty}`);
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
 * @returns {Promise<Array>} Array of leaderboard entries
 */
export const fetchLeaderboard = async (difficulty) => {
  const url = difficulty ? `/leaderboard?difficulty=${difficulty}` : "/leaderboard";
  const response = await api.get(url);
  return response.data.data;
};

export default api;
