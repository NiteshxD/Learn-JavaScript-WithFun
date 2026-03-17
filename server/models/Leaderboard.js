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
//   - timeTaken:      Total time in milliseconds to complete the quiz
//   - difficulty:     Which difficulty level was played
//   - questionCount:  How many questions were in the quiz (10, 25, or 50)
//   - createdAt:      Auto-generated timestamp
//
// INDEXING: Compound index on (difficulty, questionCount, score DESC, timeTaken ASC)
// for efficient leaderboard sorting — grouped by mode, highest score, fastest time.
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

  // Number of correct answers (dynamic based on questionCount)
  score: {
    type: Number,
    required: [true, "Score is required"],
    min: [0, "Score cannot be negative"],
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

  // Time taken to complete the quiz, in milliseconds
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

  // Number of questions in the quiz session
  questionCount: {
    type: Number,
    required: [true, "Question count is required"],
    enum: {
      values: [10, 25, 50],
      message: "Question count must be 10, 25, or 50",
    },
    default: 10,
  },

  // Auto-generated creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ----- Custom Validation -----
// Score cannot exceed questionCount
leaderboardSchema.pre("validate", function (next) {
  if (this.score > this.questionCount) {
    this.invalidate("score", `Score cannot exceed question count (${this.questionCount})`);
  }
  next();
});

// ----- Indexes -----
// Compound index for leaderboard: group by difficulty + count, sort by score then time
leaderboardSchema.index({ difficulty: 1, questionCount: 1, score: -1, timeTaken: 1 });

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
