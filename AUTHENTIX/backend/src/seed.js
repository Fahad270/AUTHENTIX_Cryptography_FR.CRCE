// seed.js
// Run with: npm run seed
// Wipes and recreates the laboratory's User collection from the controlled
// SEED_USERS dataset in data/mockDataset.js. Passwords are hashed with
// bcrypt before being stored - plaintext is never written to MongoDB.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const AuthEvent = require('./models/AuthEvent');
const Attack = require('./models/Attack');
const { SEED_USERS } = require('./data/mockDataset');

async function seed() {
  await connectDB();

  console.log('[Seed] Clearing existing laboratory data...');
  await User.deleteMany({});
  await AuthEvent.deleteMany({});
  await Attack.deleteMany({});

  console.log('[Seed] Creating laboratory users...');
  for (const u of SEED_USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.create({
      username: u.username,
      email: u.email,
      passwordHash,
      role: u.role,
      accountStatus: 'ACTIVE',
    });
    console.log(`  - created ${u.username} (${u.role})`);
  }

  console.log('[Seed] Done. Laboratory is ready.');
  console.log('[Seed] Login as admin / Admin@123 to access the Security Admin dashboard.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Failed:', err);
  process.exit(1);
});
