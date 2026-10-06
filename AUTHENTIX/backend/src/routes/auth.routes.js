// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { login, logout, me } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;
