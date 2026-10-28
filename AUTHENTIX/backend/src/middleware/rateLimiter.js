// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const { isPhase2Enabled } = require('../config/phase2');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => !isPhase2Enabled(),
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
  },
});

const attackLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => !isPhase2Enabled(),
  message: {
    success: false,
    message: 'Too many attack requests, please try again later.',
  },
});

module.exports = {
  loginLimiter,
  attackLimiter,
};
