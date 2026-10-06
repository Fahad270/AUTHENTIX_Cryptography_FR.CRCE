// server.js
// -----------------------------------------------------------------------------
// AUTHENTIX backend entry point. Keeps wiring thin: connect DB, mount
// middleware, mount routers, mount error handler. All real logic lives in
// controllers/ and services/.
// -----------------------------------------------------------------------------
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const attackRoutes = require('./routes/attack.routes');
const eventRoutes = require('./routes/event.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, service: 'AUTHENTIX backend', status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/attacks', attackRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.IO is wired up but optional - the frontend primarily uses polling
// (simpler + more reliable for a teaching lab); the 'attack:update' event is
// emitted here for anyone who wants to extend the UI to use it directly.
try {
  const { Server } = require('socket.io');
  const io = new Server(server, { cors: { origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' } });
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] client connected: ${socket.id}`);
  });
  app.set('io', io);
} catch (err) {
  console.warn('[Socket.IO] not available, continuing with polling only.');
}

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`[AUTHENTIX] Backend listening on http://localhost:${PORT}`);
  });
});
