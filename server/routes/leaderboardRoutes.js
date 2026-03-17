// =============================================================================
// Leaderboard Routes
// =============================================================================
// Defines the API endpoints for leaderboard operations.
//
// Routes:
//   POST /api/leaderboard        → Submit a quiz score
//   GET  /api/leaderboard        → Retrieve sorted leaderboard
//   GET  /api/leaderboard?difficulty=easy → Filter by difficulty
// =============================================================================

const express = require("express");
const router = express.Router();
const { submitScore, getLeaderboard } = require("../controllers/leaderboardController");

// POST /api/leaderboard — Submit a new score
router.post("/", submitScore);

// GET /api/leaderboard — Get sorted leaderboard (optionally filtered)
router.get("/", getLeaderboard);

module.exports = router;
