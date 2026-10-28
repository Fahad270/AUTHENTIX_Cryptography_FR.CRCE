// routes/attack.routes.js
// All attack-lab endpoints require a logged-in SECURITY_ADMIN.
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const ctrl = require('../controllers/attack.controller');
const { attackLimiter } = require('../middleware/rateLimiter');

router.use(requireAuth, requireRole('SECURITY_ADMIN'), attackLimiter);

router.post('/bruteforce/start', ctrl.startBruteForce);
router.post('/credential-stuffing/start', ctrl.startCredentialStuffing);
router.post('/password-spraying/start', ctrl.startPasswordSpraying);

router.get('/', ctrl.listAttacks);
router.get('/:id', ctrl.getAttack);
router.get('/:id/status', ctrl.getAttackStatusOnly);
router.post('/:id/stop', ctrl.stopAttack);

module.exports = router;
