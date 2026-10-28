// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { login, logout, me } = require('../controllers/auth.controller');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;
