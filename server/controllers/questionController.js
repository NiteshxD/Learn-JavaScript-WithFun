// =============================================================================
// Question Controller
// =============================================================================
// Handles business logic for quiz questions.
//
// RANDOMIZATION STRATEGY:
//   MongoDB's $sample aggregation stage picks random documents from a
//   collection. This is much more efficient than fetching all documents
//   and randomizing in JavaScript.
//
// QUERY PARAMS:
//   - difficulty (required): "easy" | "medium" | "hard"
//   - count (optional): Number of questions (10, 25, or 50). Default: 10
// =============================================================================

const Question = require("../models/Question");

/**
 * @desc    Get randomized questions by difficulty
 * @route   GET /api/questions?difficulty=easy&count=10
 * @access  Public
 */
const getQuestions = async (req, res, next) => {
  try {
    const { difficulty, count } = req.query;

    // Validate difficulty parameter
    const validDifficulties = ["easy", "medium", "hard"];
    if (!difficulty || !validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid difficulty: easy, medium, or hard",
      });
    }

    // Validate and parse question count
    const validCounts = [10, 25, 50];
    const questionCount = parseInt(count) || 10;
    if (!validCounts.includes(questionCount)) {
      return res.status(400).json({
        success: false,
        message: "Question count must be 10, 25, or 50",
      });
    }

    // Use MongoDB aggregation pipeline for server-side randomization
    // $match filters by difficulty, $sample randomly selects N documents
    const questions = await Question.aggregate([
      { $match: { difficulty: difficulty.toLowerCase() } },
      { $sample: { size: questionCount } },
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
    next(error);
  }
};

module.exports = { getQuestions };
