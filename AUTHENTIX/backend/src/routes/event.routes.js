// routes/event.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const ctrl = require('../controllers/event.controller');

router.use(requireAuth, requireRole('SECURITY_ADMIN'));

router.get('/', ctrl.listEvents);
router.get('/:id', ctrl.getEvent);

module.exports = router;
