// =============================================================================
// Express + Socket.io Server — Entry Point
// =============================================================================
// This is the main entry point for the backend API server.
//
// ARCHITECTURE OVERVIEW:
//   1. Load environment variables (dotenv)
//   2. Connect to MongoDB
//   3. Configure Express middleware (CORS, JSON parsing)
//   4. Mount API routes
//   5. Attach global error handler
//   6. Initialize Socket.io for real-time multiplayer
//   7. Start listening on the configured port
//
// WHY http.createServer?
//   Socket.io requires a raw Node.js HTTP server to attach to.
//   Express alone doesn't expose this, so we create it explicitly.
// =============================================================================

const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const initializeSocket = require("./socket");

// -- Load environment variables from .env file --
dotenv.config();

// -- Initialize Express application --
const app = express();

// -- Create HTTP server (needed for Socket.io) --
const server = http.createServer(app);

// =============================================================================
// CORS Configuration
// =============================================================================

// Use origin: true to dynamically reflect the request origin.
// This allows any frontend (like your Vercel app) to connect without CORS errors,
// and it properly supports credentials: true (which fails if origin is "*").
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

// Apply CORS to Express routes
app.use(cors(corsOptions));

// =============================================================================
// Socket.io Initialization
// =============================================================================

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Render/Vercel compatible transports
  transports: ["websocket", "polling"],
});

// Register all socket event handlers
initializeSocket(io);

// =============================================================================
// Express Middleware
// =============================================================================

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
// NOTE: We use server.listen (not app.listen) because Socket.io is attached to `server`
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n🎮 ══════════════════════════════════════════`);
    console.log(`   JS Quiz API Server`);
    console.log(`   Running on: http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`   Socket.io:   ✅ Ready`);
    console.log(`🎮 ══════════════════════════════════════════\n`);
  });
});
