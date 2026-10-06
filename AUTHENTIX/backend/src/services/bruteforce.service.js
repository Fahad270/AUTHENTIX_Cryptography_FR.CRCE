// services/bruteforce.service.js
// -----------------------------------------------------------------------------
// BRUTE FORCE: many passwords -> ONE account.
// Tries each candidate in the fixed laboratory wordlist against a single
// target username, stopping as soon as one succeeds (or the list runs out,
// or the user presses STOP ATTACK).
// -----------------------------------------------------------------------------
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const authService = require('./authentication.service');
const attackService = require('./attack.service');
const { BRUTE_FORCE_WORDLIST } = require('../data/mockDataset');

async function startBruteForce({ targetUsername, startedBy }) {
  if (!targetUsername || typeof targetUsername !== 'string') {
    throw new ApiError(400, 'targetUsername is required.');
  }

  const normalized = targetUsername.trim().toLowerCase();
  const user = await User.findOne({ username: normalized });
  if (!user) {
    throw new ApiError(404, `Target user "${normalized}" does not exist in the laboratory dataset.`);
  }

  const attack = await attackService.createAttackRecord({
    attackType: 'BRUTE_FORCE',
    targetUsername: normalized,
    startedBy,
  });
  attackService.acquireLock(attack._id);

  // Fire and forget - the frontend polls GET /api/attacks/:id/status for progress.
  runBruteForceLoop(attack._id, normalized).catch((err) => {
    console.error('[BruteForce] simulation error:', err);
  });

  return attack;
}

async function runBruteForceLoop(attackId, targetUsername) {
  const Attack = require('../models/Attack');
  let attack = await Attack.findById(attackId);

  for (const candidatePassword of BRUTE_FORCE_WORDLIST) {
    attack = await Attack.findById(attackId); // re-read for fresh stopRequested flag
    if (attack.stopRequested) {
      await attackService.finalizeAttack(attack, { stopped: true });
      return;
    }

    const requestId = `bf-${attackId}-${attack.attemptCount + 1}`;
    const result = await authService.attemptLogin({
      username: targetUsername,
      password: candidatePassword,
      source: 'ATTACK_SIMULATOR',
      eventType: 'BRUTE_FORCE_ATTEMPT',
      attackId,
      requestId,
    });

    await attackService.recordAttempt(attack, {
      username: targetUsername,
      passwordPlain: candidatePassword,
      result: result.success ? 'SUCCESS' : 'FAILED',
    });

    if (result.success) {
      await attackService.finalizeAttack(attack);
      return;
    }

    await attackService.sleep(600); // pacing so the "live" attempt stream is visible
  }

  attack = await Attack.findById(attackId);
  await attackService.finalizeAttack(attack); // wordlist exhausted, no compromise
}

module.exports = { startBruteForce };
