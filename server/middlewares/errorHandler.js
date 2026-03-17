// =============================================================================
// Global Error Handler Middleware
// =============================================================================
// This is the LAST middleware in the Express pipeline. Any errors thrown or
// passed via next(error) in controllers will be caught here.
//
// WHY A CENTRALIZED ERROR HANDLER?
//   Instead of try-catch blocks sending responses in every controller,
//   a centralized handler ensures consistent error response format,
//   proper status codes, and clean logging. This is standard practice
//   in production Express applications.
//
// Response format:
//   { success: false, message: "Error description", stack: "..." (dev only) }
// =============================================================================

/**
 * Global error handler — catches all unhandled errors
 * @param {Error} err - The error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`❌ Error: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Include stack trace only in development for debugging
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
