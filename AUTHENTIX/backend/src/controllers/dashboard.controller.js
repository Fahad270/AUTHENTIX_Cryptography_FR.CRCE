// controllers/dashboard.controller.js
const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboard.service');

// GET /api/dashboard/stats
const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  const eventsOverTime = await dashboardService.getEventsOverTime();
  res.json({ success: true, stats, eventsOverTime });
});

// GET /api/dashboard/recent-events
const getRecentEvents = asyncHandler(async (req, res) => {
  const events = await dashboardService.getRecentEvents(req.query.limit || 15);
  res.json({ success: true, events });
});

module.exports = { getStats, getRecentEvents };
