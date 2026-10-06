// services/attack.service.js
// -----------------------------------------------------------------------------
// Generic attack engine plumbing shared by all three attack strategies:
//   Attack Request -> Validate -> Create Attack -> Load Controlled Dataset ->
//   Execute Attempts -> Authentication Engine -> Create AuthEvent ->
//   Update Attack -> Emit Event -> Dashboard
//
// This file owns:
//   - the single-active-attack concurrency lock (Phase 1 allows only ONE
//     running simulation at a time, per the project spec)
//   - password masking (plaintext passwords are never sent to the frontend
//     after use)
//   - shared helpers for starting/stopping/reading Attack records
//
// The actual attempt loops (which candidates to try, in what order) live in
// bruteforce.service.js, credentialStuffing.service.js and
// passwordSpraying.service.js - each of those calls back into this engine.
// -----------------------------------------------------------------------------
const Attack = require('../models/Attack');
const ApiError = require('../utils/ApiError');

// In-memory lock: true while any simulation is RUNNING. Resets on server
// restart, which is fine for a teaching lab (no persisted "stuck" locks).
let activeAttackId = null;

function isAttackRunning() {
  return activeAttackId !== null;
}

function acquireLock(attackId) {
  if (activeAttackId) {
    throw new ApiError(409, 'Another attack simulation is already running.');
  }
  activeAttackId = String(attackId);
}

function releaseLock(attackId) {
  if (activeAttackId === String(attackId)) {
    activeAttackId = null;
  }
}

function maskPassword(password) {
  if (!password) return '********';
  return '*'.repeat(Math.max(password.length, 4));
}

async function createAttackRecord({ attackType, targetUsername = null, targetUsers = [], startedBy = null }) {
  return Attack.create({
    attackType,
    targetUsername,
    targetUsers,
    status: 'RUNNING',
    startTime: new Date(),
    startedBy,
  });
}

async function recordAttempt(attack, { username, passwordPlain, result }) {
  attack.attemptCount += 1;
  if (result === 'SUCCESS') {
    attack.successfulAttempts += 1;
  } else {
    attack.failedAttempts += 1;
  }
  attack.credentialsTested.push({
    username,
    passwordMasked: maskPassword(passwordPlain),
    result,
    timestamp: new Date(),
  });
  await attack.save();
}

async function finalizeAttack(attack, { stopped = false } = {}) {
  attack.endTime = new Date();
  if (stopped) {
    attack.status = 'STOPPED';
  } else if (attack.successfulAttempts > 0) {
    attack.status = 'COMPROMISED';
    attack.success = true;
  } else {
    attack.status = 'COMPLETED'; // ran to completion with no compromise
  }
  await attack.save();
  releaseLock(attack._id);
  return attack;
}

async function requestStop(attackId) {
  const attack = await Attack.findById(attackId);
  if (!attack) throw new ApiError(404, 'Attack not found.');
  if (attack.status !== 'RUNNING') {
    throw new ApiError(409, 'Attack is not currently running.');
  }
  attack.stopRequested = true;
  await attack.save();
  return attack;
}

async function getAttackStatus(attackId) {
  const attack = await Attack.findById(attackId);
  if (!attack) throw new ApiError(404, 'Attack not found.');
  return attack;
}

async function listAttacks({ page = 1, limit = 25, attackType, status } = {}) {
  const filter = {};
  if (attackType) filter.attackType = attackType;
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Attack.find(filter).sort({ startTime: -1 }).skip(skip).limit(Number(limit)),
    Attack.countDocuments(filter),
  ]);
  return { items, total, page: Number(page), limit: Number(limit) };
}

// Small delay so the frontend can poll and show a believable "live" stream
// of attempts instead of the whole attack completing instantly.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  isAttackRunning,
  acquireLock,
  releaseLock,
  maskPassword,
  createAttackRecord,
  recordAttempt,
  finalizeAttack,
  requestStop,
  getAttackStatus,
  listAttacks,
  sleep,
};
