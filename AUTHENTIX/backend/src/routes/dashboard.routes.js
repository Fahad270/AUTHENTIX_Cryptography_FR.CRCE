// routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const ctrl = require('../controllers/dashboard.controller');

router.use(requireAuth, requireRole('SECURITY_ADMIN'));

router.get('/stats', ctrl.getStats);
router.get('/recent-events', ctrl.getRecentEvents);

module.exports = router;
