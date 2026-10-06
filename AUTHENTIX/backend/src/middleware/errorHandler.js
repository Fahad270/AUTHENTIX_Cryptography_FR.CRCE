// middleware/errorHandler.js
// Last middleware in the chain. Converts ApiError (and any other thrown
// error) into a consistent JSON shape: { success: false, message }.
module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  if (statusCode === 500) {
    console.error('[ERROR]', err);
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
};
