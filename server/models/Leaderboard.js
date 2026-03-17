// =============================================================================
// Leaderboard Model (Mongoose Schema)
// =============================================================================
// Stores quiz results for the leaderboard ranking system.
//
// Each entry records:
//   - username:       Player's display name
//   - score:          Number of correct answers
//   - correctAnswers: Count of correct responses
//   - wrongAnswers:   Count of incorrect responses
//   - timeTaken:      Total time in seconds to complete the quiz
//   - difficulty:     Which difficulty level was played
//   - createdAt:      Auto-generated timestamp
//
// INDEXING: Compound index on (score DESC, timeTaken ASC) for efficient
// leaderboard sorting — highest score first, fastest time as tiebreaker.
// =============================================================================

const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  // Player's chosen display name
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    maxLength: [30, "Username cannot exceed 30 characters"],
  },

  // Number of correct answers (0-50)
  score: {
    type: Number,
    required: [true, "Score is required"],
    min: [0, "Score cannot be negative"],
    max: [10, "Score cannot exceed 10"],
  },

  // Breakdown of correct vs wrong answers
  correctAnswers: {
    type: Number,
    required: true,
    min: 0,
  },

  wrongAnswers: {
    type: Number,
    required: true,
    min: 0,
  },

  // Time taken to complete the quiz, in seconds
  timeTaken: {
    type: Number,
    required: [true, "Time taken is required"],
    min: [0, "Time cannot be negative"],
  },

  // Difficulty level that was played
  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
    enum: {
      values: ["easy", "medium", "hard"],
      message: "Difficulty must be easy, medium, or hard",
    },
  },

  // Auto-generated creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ----- Indexes -----
// Compound index for leaderboard sorting: highest score, then fastest time
leaderboardSchema.index({ score: -1, timeTaken: 1 });
// Index for filtering by difficulty
leaderboardSchema.index({ difficulty: 1 });

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
