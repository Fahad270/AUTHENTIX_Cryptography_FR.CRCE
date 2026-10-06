// services/passwordSpraying.service.js
// -----------------------------------------------------------------------------
// PASSWORD SPRAYING: a FEW common passwords -> MANY accounts. For each
// password in the small controlled set, try it against every target user
// before moving on to the next password (the opposite access pattern of
// brute force, which hammers one account with many passwords).
// -----------------------------------------------------------------------------
const attackService = require('./attack.service');
const authService = require('./authentication.service');
const { SPRAY_PASSWORD_SET, SPRAY_TARGET_USERNAMES } = require('../data/mockDataset');

async function startPasswordSpraying({ startedBy }) {
  const attack = await attackService.createAttackRecord({
    attackType: 'PASSWORD_SPRAYING',
    targetUsers: SPRAY_TARGET_USERNAMES,
    startedBy,
  });
  attackService.acquireLock(attack._id);

  runSprayLoop(attack._id).catch((err) => {
    console.error('[PasswordSpraying] simulation error:', err);
  });

  return attack;
}

async function runSprayLoop(attackId) {
  const Attack = require('../models/Attack');
  let attack;

  for (const candidatePassword of SPRAY_PASSWORD_SET) {
    for (const username of SPRAY_TARGET_USERNAMES) {
      attack = await Attack.findById(attackId);
      if (attack.stopRequested) {
        await attackService.finalizeAttack(attack, { stopped: true });
        return;
      }

      const requestId = `ps-${attackId}-${attack.attemptCount + 1}`;
      const result = await authService.attemptLogin({
        username,
        password: candidatePassword,
        source: 'ATTACK_SIMULATOR',
        eventType: 'PASSWORD_SPRAY_ATTEMPT',
        attackId,
        requestId,
      });

      await attackService.recordAttempt(attack, {
        username,
        passwordPlain: candidatePassword,
        result: result.success ? 'SUCCESS' : 'FAILED',
      });

      await attackService.sleep(350);
    }
  }

  attack = await Attack.findById(attackId);
  await attackService.finalizeAttack(attack);
}

module.exports = { startPasswordSpraying };
