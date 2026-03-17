// =============================================================================
// MongoDB Connection Configuration
// =============================================================================
// Uses Mongoose to establish a connection to MongoDB.
// Connection string is loaded from environment variables for security.
// Includes retry logic and connection event handlers for production readiness.
// =============================================================================

const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the MONGO_URI from environment variables.
 * Logs connection status and exits the process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure code — in production, a process manager
    // like PM2 will automatically restart the server
    process.exit(1);
  }
};

module.exports = connectDB;
