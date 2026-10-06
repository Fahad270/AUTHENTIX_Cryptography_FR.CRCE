// controllers/auth.controller.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authentication.service');

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, 'username and password are required.');
  }

  const requestId = `login-${crypto.randomUUID()}`;
  const result = await authService.attemptLogin({
    username,
    password,
    source: 'NORMAL_LOGIN',
    eventType: 'LOGIN_FAILURE', // only used on failure; success is always LOGIN_SUCCESS
    attackId: null,
    requestId,
  });

  if (!result.success) {
    throw new ApiError(401, 'Invalid username or password.');
  }

  const token = jwt.sign(
    { id: result.user._id, username: result.user.username, role: result.user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: result.user._id,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role,
      accountStatus: result.user.accountStatus,
    },
  });
});

// POST /api/auth/logout
// Stateless JWT - logout is handled client-side by discarding the token.
// This endpoint exists for a clean API surface / future server-side revocation.
const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out.' });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) throw new ApiError(404, 'User not found.');
  res.json({ success: true, user });
});

module.exports = { login, logout, me };
