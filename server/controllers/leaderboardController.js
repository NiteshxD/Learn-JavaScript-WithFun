// =============================================================================
// Leaderboard Controller
// =============================================================================
// Handles business logic for leaderboard operations.
//
// Endpoints:
//   POST /api/leaderboard   → Submit a new quiz score
//   GET  /api/leaderboard   → Get sorted leaderboard entries
//
// SORTING STRATEGY:
//   Primary: Highest score first (descending)
//   Secondary: Fastest time first (ascending) — as tiebreaker
//   This rewards both accuracy AND speed.
// =============================================================================

const Leaderboard = require("../models/Leaderboard");

/**
 * @desc    Submit a new score to the leaderboard
 * @route   POST /api/leaderboard
 * @access  Public
 */
const submitScore = async (req, res, next) => {
  try {
    const { username, score, correctAnswers, wrongAnswers, timeTaken, difficulty } = req.body;

    // Validate required fields
    // NOTE: Use explicit checks — !timeTaken would reject 0, and !x === undefined is always false
    if (!username || score == null || correctAnswers == null || wrongAnswers == null || timeTaken == null || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: username, score, correctAnswers, wrongAnswers, timeTaken, difficulty",
      });
    }

    // Create the leaderboard entry
    // Mongoose validation will catch any schema-level errors (e.g., invalid difficulty)
    const entry = await Leaderboard.create({
      username: username.trim(),
      score,
      correctAnswers,
      wrongAnswers,
      timeTaken,
      difficulty: difficulty.toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: "Score submitted successfully!",
      data: entry,
    });
  } catch (error) {
    // Handle Mongoose validation errors with a clean message
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    next(error);
  }
};

/**
 * @desc    Get leaderboard entries sorted by score (desc) and time (asc)
 * @route   GET /api/leaderboard
 * @access  Public
 * @query   ?difficulty=easy|medium|hard (optional filter)
 *          ?limit=20 (optional, default 50)
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { difficulty, limit } = req.query;

    // Build query filter — optionally filter by difficulty
    const filter = {};
    if (difficulty) {
      const validDifficulties = ["easy", "medium", "hard"];
      if (!validDifficulties.includes(difficulty.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Difficulty must be one of: easy, medium, hard",
        });
      }
      filter.difficulty = difficulty.toLowerCase();
    }

    // Parse limit with a sensible default and maximum
    const resultsLimit = Math.min(parseInt(limit) || 50, 100);

    // Sort: highest score first, fastest time as tiebreaker
    const leaderboard = await Leaderboard.find(filter)
      .sort({ score: -1, timeTaken: 1 })
      .limit(resultsLimit)
      .select("-__v"); // Exclude Mongoose version key from response

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitScore, getLeaderboard };
