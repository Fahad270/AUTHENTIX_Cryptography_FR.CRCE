// controllers/attack.controller.js
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const attackService = require('../services/attack.service');
const bruteforceService = require('../services/bruteforce.service');
const credentialStuffingService = require('../services/credentialStuffing.service');
const passwordSprayingService = require('../services/passwordSpraying.service');

// POST /api/attacks/bruteforce/start
const startBruteForce = asyncHandler(async (req, res) => {
  if (attackService.isAttackRunning()) {
    throw new ApiError(409, 'Another attack simulation is already running.');
  }
  const { targetUsername } = req.body;
  const attack = await bruteforceService.startBruteForce({ targetUsername, startedBy: req.user.id });
  res.status(201).json({ success: true, attack });
});

// POST /api/attacks/credential-stuffing/start
const startCredentialStuffing = asyncHandler(async (req, res) => {
  if (attackService.isAttackRunning()) {
    throw new ApiError(409, 'Another attack simulation is already running.');
  }
  const attack = await credentialStuffingService.startCredentialStuffing({ startedBy: req.user.id });
  res.status(201).json({ success: true, attack });
});

// POST /api/attacks/password-spraying/start
const startPasswordSpraying = asyncHandler(async (req, res) => {
  if (attackService.isAttackRunning()) {
    throw new ApiError(409, 'Another attack simulation is already running.');
  }
  const attack = await passwordSprayingService.startPasswordSpraying({ startedBy: req.user.id });
  res.status(201).json({ success: true, attack });
});

// GET /api/attacks
const listAttacks = asyncHandler(async (req, res) => {
  const { page, limit, attackType, status } = req.query;
  const result = await attackService.listAttacks({ page, limit, attackType, status });
  res.json({ success: true, ...result });
});

// GET /api/attacks/:id
const getAttack = asyncHandler(async (req, res) => {
  const attack = await attackService.getAttackStatus(req.params.id);
  res.json({ success: true, attack });
});

// GET /api/attacks/:id/status
const getAttackStatusOnly = asyncHandler(async (req, res) => {
  const attack = await attackService.getAttackStatus(req.params.id);
  res.json({
    success: true,
    status: attack.status,
    attemptCount: attack.attemptCount,
    successfulAttempts: attack.successfulAttempts,
    failedAttempts: attack.failedAttempts,
    credentialsTested: attack.credentialsTested,
    endTime: attack.endTime,
  });
});

// POST /api/attacks/:id/stop
const stopAttack = asyncHandler(async (req, res) => {
  const attack = await attackService.requestStop(req.params.id);
  res.json({ success: true, message: 'Stop requested.', attack });
});

module.exports = {
  startBruteForce,
  startCredentialStuffing,
  startPasswordSpraying,
  listAttacks,
  getAttack,
  getAttackStatusOnly,
  stopAttack,
};
