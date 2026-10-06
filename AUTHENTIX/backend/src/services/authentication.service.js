// services/authentication.service.js
// -----------------------------------------------------------------------------
// This is the SINGLE authentication engine used by:
//   - normal user login (controllers/auth.controller.js)
//   - every attack simulation (bruteforce / credentialStuffing / passwordSpraying)
//
// Architecturally this matters: the three attacks are not "fake" - they
// really call this same bcrypt.compare()-based function against real
// MongoDB documents, which is why real AuthEvents and real compromises
// are produced. There is no shortcut path for attacks.
// -----------------------------------------------------------------------------
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const eventService = require('./event.service');

/**
 * Attempt to authenticate a username/password pair.
 *
 * @param {Object} params
 * @param {string} params.username
 * @param {string} params.password
 * @param {'NORMAL_LOGIN'|'ATTACK_SIMULATOR'} params.source
 * @param {'LOGIN_SUCCESS'|'LOGIN_FAILURE'|'BRUTE_FORCE_ATTEMPT'|'CREDENTIAL_STUFFING_ATTEMPT'|'PASSWORD_SPRAY_ATTEMPT'} params.eventType
 *        the event type to log on FAILURE. On success this is always logged as LOGIN_SUCCESS
 *        when source is NORMAL_LOGIN, or the given attack-specific type when source is ATTACK_SIMULATOR.
 * @param {string|null} params.attackId - Attack._id this attempt belongs to, or null for normal logins.
 * @param {string} params.requestId - unique id for this attempt (used for correlation/idempotency in logs).
 */
async function attemptLogin({ username, password, source, eventType, attackId = null, requestId }) {
  const normalizedUsername = String(username || '').trim().toLowerCase();
  const user = await User.findOne({ username: normalizedUsername });

  if (!user) {
    await eventService.createEvent({
      username: normalizedUsername,
      success: false,
      failureReason: 'USER_NOT_FOUND',
      eventType,
      source,
      attackId,
      requestId,
    });
    return { success: false, user: null, failureReason: 'USER_NOT_FOUND' };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    // Phase 1 deliberately does NOT increment a lockout counter or block
    // further attempts - see README "Phase 1 vs Phase 2".
    user.failedAttempts += 1;
    await user.save();

    await eventService.createEvent({
      username: normalizedUsername,
      success: false,
      failureReason: 'INVALID_PASSWORD',
      eventType,
      source,
      attackId,
      requestId,
    });
    return { success: false, user, failureReason: 'INVALID_PASSWORD' };
  }

  // Successful authentication.
  const successEventType = source === 'NORMAL_LOGIN' ? 'LOGIN_SUCCESS' : eventType;

  await eventService.createEvent({
    username: normalizedUsername,
    success: true,
    failureReason: null,
    eventType: successEventType,
    source,
    attackId,
    requestId,
  });

  if (source === 'ATTACK_SIMULATOR') {
    // Mark the account as compromised in the lab's database state so the
    // dashboard/account views can reflect "what happened" after the attack.
    user.accountStatus = 'COMPROMISED';
    await user.save();
  }

  return { success: true, user, failureReason: null };
}

module.exports = { attemptLogin };
