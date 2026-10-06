// config/db.js
// -----------------------------------------------------------------------------
// Establishes the single MongoDB connection used by the whole backend.
// Every model (User, AuthEvent, Attack) reads/writes through this connection.
// -----------------------------------------------------------------------------
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/authentix';

  try {
    await mongoose.connect(uri);
    console.log(`[DB] Connected to MongoDB -> ${uri}`);
  } catch (err) {
    console.error('[DB] MongoDB connection failed:', err.message);
    // Fail fast: AUTHENTIX cannot function without a database, since
    // every auth event and attack record must be real, not hardcoded.
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB disconnected');
  });
}

module.exports = connectDB;
