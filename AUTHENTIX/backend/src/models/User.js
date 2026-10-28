// models/User.js
// -----------------------------------------------------------------------------
// A "user" in AUTHENTIX is always a mock/laboratory account created by the
// seed script. Passwords are NEVER stored in plaintext - only passwordHash
// (produced by bcrypt) is persisted. See src/data/mockDataset.js for the
// controlled list of laboratory usernames/passwords used to create these.
// -----------------------------------------------------------------------------
const mongoose = require('mongoose');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

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
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

UserSchema.methods.isLocked = function () {
  if (this.accountStatus === 'LOCKED') {
    return true;
  }
  if (this.lockUntil && this.lockUntil > new Date()) {
    return true;
  }
  // Auto-unlock if lockUntil expired
  if (this.lockUntil && this.lockUntil <= new Date()) {
    this.accountStatus = 'ACTIVE';
    this.lockUntil = null;
    this.failedLoginAttempts = 0;
  }
  return false;
};

UserSchema.methods.recordFailedAttempt = async function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    this.accountStatus = 'LOCKED';
    this.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
  }
  await this.save();
};

UserSchema.methods.resetLoginAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.accountStatus = 'ACTIVE';
  this.lockUntil = null;
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);
