// =============================================================================
// Question Controller
// =============================================================================
// Handles all business logic for quiz questions.
//
// Endpoints:
//   GET /api/questions?difficulty=easy|medium|hard
//     → Returns 50 randomized questions for the given difficulty
//
// WHY RANDOMIZATION?
//   We use MongoDB's $sample aggregation to shuffle questions server-side.
//   This ensures every quiz attempt gets a unique question order without
//   needing client-side shuffling, which would expose all questions.
// =============================================================================

const Question = require("../models/Question");

/**
 * @desc    Get randomized questions filtered by difficulty
 * @route   GET /api/questions?difficulty=easy|medium|hard
 * @access  Public
 */
const getQuestions = async (req, res, next) => {
  try {
    const { difficulty } = req.query;

    // Validate that difficulty parameter is provided
    if (!difficulty) {
      return res.status(400).json({
        success: false,
        message: "Please provide a difficulty level (easy, medium, or hard)",
      });
    }

    // Validate difficulty value
    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Difficulty must be one of: easy, medium, hard",
      });
    }

    // Use MongoDB aggregation pipeline with $sample for true randomization
    // $match filters by difficulty, $sample randomly selects 50 documents
    const questions = await Question.aggregate([
      { $match: { difficulty: difficulty.toLowerCase() } },
      { $sample: { size: 10 } },
    ]);

    // If no questions found for this difficulty
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No questions found for difficulty: ${difficulty}`,
      });
    }

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
};

module.exports = { getQuestions };
