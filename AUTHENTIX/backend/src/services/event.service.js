// services/event.service.js
// Thin wrapper around AuthEvent creation + querying, kept separate from
// authentication.service.js so logging concerns stay isolated from
// authentication logic (students can trace "how are logs created" here).
const AuthEvent = require('../models/AuthEvent');

async function createEvent({ username, success, failureReason, eventType, source, attackId, requestId }) {
  return AuthEvent.create({
    timestamp: new Date(),
    username,
    success,
    failureReason,
    eventType,
    source,
    attackId,
    requestId,
  });
}

async function listEvents({ page = 1, limit = 25, username, eventType, success, attackId } = {}) {
  const filter = {};
  if (username) filter.username = new RegExp(username, 'i');
  if (eventType) filter.eventType = eventType;
  if (typeof success !== 'undefined' && success !== '') filter.success = success === 'true' || success === true;
  if (attackId) filter.attackId = attackId;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    AuthEvent.find(filter).sort({ timestamp: -1 }).skip(skip).limit(Number(limit)),
    AuthEvent.countDocuments(filter),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

async function getEventById(id) {
  return AuthEvent.findById(id);
}

module.exports = { createEvent, listEvents, getEventById };
