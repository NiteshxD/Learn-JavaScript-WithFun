// =============================================================================
// Express Server — Entry Point
// =============================================================================
// This is the main entry point for the backend API server.
//
// ARCHITECTURE OVERVIEW:
//   1. Load environment variables (dotenv)
//   2. Connect to MongoDB
//   3. Configure Express middleware (CORS, JSON parsing)
//   4. Mount API routes
//   5. Attach global error handler
//   6. Start listening on the configured port
//
// WHY THIS ORDER?
//   Express processes middleware in the order they are registered.
//   CORS and JSON parsing must be registered BEFORE routes so that
//   request bodies are parsed when controllers receive them.
//   The error handler must be LAST to catch any unhandled errors.
// =============================================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

// -- Load environment variables from .env file --
dotenv.config();

// -- Initialize Express application --
const app = express();

// =============================================================================
// Middleware Stack
// =============================================================================

// Enable CORS for all origins (will be restricted in production)
// This allows the React frontend (running on a different port) to make API calls
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Parse incoming JSON request bodies
// limit is set to 10kb to prevent payload-based attacks
app.use(express.json({ limit: "10kb" }));

// =============================================================================
// API Routes
// =============================================================================

// Mount question routes at /api/questions
app.use("/api/questions", require("./routes/questionRoutes"));

// Mount leaderboard routes at /api/leaderboard
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));

// Health check endpoint — useful for deployment monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎮 JS Quiz API is running!",
    timestamp: new Date().toISOString(),
  });
});

// =============================================================================
// Error Handling
// =============================================================================

// Global error handler — must be registered AFTER all routes
app.use(errorHandler);

// =============================================================================
// Start Server
// =============================================================================

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🎮 ══════════════════════════════════════════`);
    console.log(`   JS Quiz API Server`);
    console.log(`   Running on: http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🎮 ══════════════════════════════════════════\n`);
  });
});
