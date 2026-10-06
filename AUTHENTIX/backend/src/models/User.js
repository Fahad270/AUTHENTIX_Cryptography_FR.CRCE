// models/User.js
// -----------------------------------------------------------------------------
// A "user" in AUTHENTIX is always a mock/laboratory account created by the
// seed script. Passwords are NEVER stored in plaintext - only passwordHash
// (produced by bcrypt) is persisted. See src/data/mockDataset.js for the
// controlled list of laboratory usernames/passwords used to create these.
// -----------------------------------------------------------------------------
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['SECURITY_ADMIN', 'NORMAL_USER'],
      default: 'NORMAL_USER',
    },
    accountStatus: {
      // Phase 1 note: LOCKED is a valid DB state reserved for Phase 2
      // (account lockout). Nothing in Phase 1 ever sets a user to LOCKED.
      type: String,
      enum: ['ACTIVE', 'COMPROMISED', 'LOCKED'],
      default: 'ACTIVE',
    },
    failedAttempts: { type: Number, default: 0 },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model('User', UserSchema);
