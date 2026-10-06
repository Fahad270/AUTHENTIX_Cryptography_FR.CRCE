// services/dashboard.service.js
// -----------------------------------------------------------------------------
// All numbers here come from live MongoDB aggregation queries over AuthEvent
// and Attack - nothing is hardcoded. Run an attack, then call these again,
// and the numbers change.
// -----------------------------------------------------------------------------
const AuthEvent = require('../models/AuthEvent');
const Attack = require('../models/Attack');
const User = require('../models/User');

async function getStats() {
  const [totalEvents, failedLogins, successfulLogins, attacksExecuted, compromisedAccounts] = await Promise.all([
    AuthEvent.countDocuments({}),
    AuthEvent.countDocuments({ success: false }),
    AuthEvent.countDocuments({ success: true }),
    Attack.countDocuments({}),
    User.countDocuments({ accountStatus: 'COMPROMISED' }),
  ]);

  const byType = await Attack.aggregate([
    {
      $group: {
        _id: '$attackType',
        executions: { $sum: 1 },
        compromises: { $sum: { $cond: [{ $eq: ['$status', 'COMPROMISED'] }, 1, 0] } },
      },
    },
  ]);

  const attackTypeStats = {
    BRUTE_FORCE: { executions: 0, compromises: 0 },
    CREDENTIAL_STUFFING: { executions: 0, compromises: 0 },
    PASSWORD_SPRAYING: { executions: 0, compromises: 0 },
  };
  for (const row of byType) {
    attackTypeStats[row._id] = { executions: row.executions, compromises: row.compromises };
  }

  return {
    totalAuthEvents: totalEvents,
    failedLogins,
    successfulLogins,
    attacksExecuted,
    compromisedAccounts,
    attackTypeStats,
  };
}

async function getRecentEvents(limit = 15) {
  return AuthEvent.find({}).sort({ timestamp: -1 }).limit(Number(limit));
}

// Auth events bucketed by hour for the "events over time" chart.
async function getEventsOverTime() {
  return AuthEvent.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp' },
        },
        success: { $sum: { $cond: ['$success', 1, 0] } },
        failure: { $sum: { $cond: ['$success', 0, 1] } },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 48 },
  ]);
}

module.exports = { getStats, getRecentEvents, getEventsOverTime };
