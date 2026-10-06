// middleware/role.js
// Role-based access control. Use after requireAuth. Example:
//   router.post('/attacks/.../start', requireAuth, requireRole('SECURITY_ADMIN'), handler)
const ApiError = require('../utils/ApiError');

function requireRole(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }
    next();
  };
}

module.exports = requireRole;
