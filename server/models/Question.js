// =============================================================================
// Question Model (Mongoose Schema)
// =============================================================================
// Defines the schema for quiz questions stored in MongoDB.
//
// Each question has:
//   - question:      The question text
//   - options:       Exactly 4 answer choices
//   - correctAnswer: The correct answer (must be one of the options)
//   - difficulty:    easy | medium | hard
//   - category:      Topic category (e.g., "Closures", "Promises")
//   - createdAt:     Auto-generated timestamp
//
// INDEXING: We index on `difficulty` and `category` because the API
// frequently queries questions filtered by difficulty level.
// =============================================================================

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  // The question text displayed to the user
  question: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },

  // Array of exactly 4 answer options
  options: {
    type: [String],
    required: [true, "Options are required"],
    validate: {
      validator: (arr) => arr.length === 4,
      message: "Each question must have exactly 4 options",
    },
  },

  // The correct answer — must match one of the options
  correctAnswer: {
    type: String,
    required: [true, "Correct answer is required"],
    trim: true,
  },

  // Difficulty level for filtering questions
  difficulty: {
    type: String,
    required: [true, "Difficulty level is required"],
    enum: {
      values: ["easy", "medium", "hard"],
      message: "Difficulty must be easy, medium, or hard",
    },
  },

  // Topic category for analytics (e.g., weak category detection)
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },

  // Auto-generated creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ----- Indexes -----
// Compound index on difficulty + category speeds up filtered queries
questionSchema.index({ difficulty: 1, category: 1 });

module.exports = mongoose.model("Question", questionSchema);
