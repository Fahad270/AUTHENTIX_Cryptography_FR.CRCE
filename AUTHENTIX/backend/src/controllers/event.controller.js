// controllers/event.controller.js
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const eventService = require('../services/event.service');

// GET /api/events
const listEvents = asyncHandler(async (req, res) => {
  const { page, limit, username, eventType, success, attackId } = req.query;
  const result = await eventService.listEvents({ page, limit, username, eventType, success, attackId });
  res.json({ success: true, ...result });
});

// GET /api/events/:id
const getEvent = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found.');
  res.json({ success: true, event });
});

module.exports = { listEvents, getEvent };
