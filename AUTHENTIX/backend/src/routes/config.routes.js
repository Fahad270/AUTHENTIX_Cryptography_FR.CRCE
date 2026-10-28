// routes/config.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { isPhase2Enabled, setPhase2Enabled, getState } = require('../config/phase2');

// GET /api/config/phase2 - Get Phase 2 status
router.get('/phase2', requireAuth, (req, res) => {
  res.json({
    success: true,
    data: getState(),
  });
});

// PATCH /api/config/phase2 - Toggle Phase 2 (Security Admin only)
router.patch('/phase2', requireAuth, requireRole(['SECURITY_ADMIN']), (req, res) => {
  const { enabled } = req.body;

  if (typeof enabled !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'enabled must be a boolean',
    });
  }

  const newState = setPhase2Enabled(enabled);
  res.json({
    success: true,
    data: newState,
    message: `Phase 2 ${enabled ? 'enabled' : 'disabled'}`,
  });
});

module.exports = router;