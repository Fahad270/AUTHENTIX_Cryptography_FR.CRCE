// middleware/auth.js
// Verifies the JWT sent as "Authorization: Bearer <token>" and attaches the
// decoded payload to req.user. Every protected route uses this first.
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Missing or malformed Authorization header.'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, role }
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token.'));
  }
}

module.exports = requireAuth;
