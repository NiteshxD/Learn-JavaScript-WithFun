// =============================================================================
// Request Validation Middleware
// =============================================================================
// Provides reusable validation functions for incoming requests.
//
// WHY A SEPARATE VALIDATION MIDDLEWARE?
//   In production apps, validation logic is separated from controllers to:
//   1. Keep controllers focused on business logic
//   2. Enable reuse across multiple routes
//   3. Provide clean, consistent validation error responses
// =============================================================================

/**
 * Validates that required fields are present in the request body.
 * Returns a middleware function that checks the specified fields.
 *
 * @param {string[]} fields - Array of required field names
 * @returns {Function} Express middleware function
 *
 * @example
 *   router.post("/", validateFields(["username", "score"]), submitScore);
 */
const validateFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => {
      const value = req.body[field];
      // Check for undefined, null, and empty strings
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = { validateFields };
