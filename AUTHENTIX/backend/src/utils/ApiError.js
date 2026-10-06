// utils/ApiError.js
// A small typed error so controllers can throw with a specific HTTP status
// and have errorHandler.js turn it into a consistent JSON response.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
