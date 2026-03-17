// =============================================================================
// Question Routes
// =============================================================================
// Defines the API endpoints for quiz questions.
//
// Routes:
//   GET /api/questions?difficulty=easy|medium|hard
//
// WHY SEPARATE ROUTES FILES?
//   In production MERN apps, routes are separated from controllers to follow
//   the Single Responsibility Principle. Routes define URL patterns; controllers
//   handle business logic. This makes the codebase easier to test and maintain.
// =============================================================================

const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/questionController");

// GET /api/questions?difficulty=easy|medium|hard
// Returns 50 randomized questions for the specified difficulty
router.get("/", getQuestions);

module.exports = router;
