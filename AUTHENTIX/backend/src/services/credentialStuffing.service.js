// services/credentialStuffing.service.js
// -----------------------------------------------------------------------------
// CREDENTIAL STUFFING: known username:password PAIRS (as if leaked from
// elsewhere) -> MANY accounts. Unlike brute force, each pair is tried once;
// the attacker is not guessing, they are replaying "known" credentials.
// Uses ONLY the fixed, local, fictional CREDENTIAL_STUFFING_PAIRS dataset.
// -----------------------------------------------------------------------------
const ApiError = require('../utils/ApiError');
const authService = require('./authentication.service');
const attackService = require('./attack.service');
const { CREDENTIAL_STUFFING_PAIRS } = require('../data/mockDataset');

async function startCredentialStuffing({ startedBy }) {
  const targetUsers = [...new Set(CREDENTIAL_STUFFING_PAIRS.map((p) => p.username))];

  const attack = await attackService.createAttackRecord({
    attackType: 'CREDENTIAL_STUFFING',
    targetUsers,
    startedBy,
  });
  attackService.acquireLock(attack._id);

  runCredentialStuffingLoop(attack._id).catch((err) => {
    console.error('[CredentialStuffing] simulation error:', err);
  });

  return attack;
}

async function runCredentialStuffingLoop(attackId) {
  const Attack = require('../models/Attack');
  let attack;
  let compromisedAny = false;

  for (const pair of CREDENTIAL_STUFFING_PAIRS) {
    attack = await Attack.findById(attackId);
    if (attack.stopRequested) {
      await attackService.finalizeAttack(attack, { stopped: true });
      return;
    }

    const requestId = `cs-${attackId}-${attack.attemptCount + 1}`;
    const result = await authService.attemptLogin({
      username: pair.username,
      password: pair.password,
      source: 'ATTACK_SIMULATOR',
      eventType: 'CREDENTIAL_STUFFING_ATTEMPT',
      attackId,
      requestId,
    });

    await attackService.recordAttempt(attack, {
      username: pair.username,
      passwordPlain: pair.password,
      result: result.success ? 'SUCCESS' : 'FAILED',
    });

    if (result.success) compromisedAny = true;

    await attackService.sleep(400);
  }

  attack = await Attack.findById(attackId);
  await attackService.finalizeAttack(attack); // status derives from successfulAttempts
}

module.exports = { startCredentialStuffing };
