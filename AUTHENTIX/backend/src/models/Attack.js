// models/Attack.js
// -----------------------------------------------------------------------------
// One document per attack simulation run (brute force, credential stuffing,
// or password spraying). Holds the overall outcome; the individual attempts
// that made up the attack are stored as AuthEvent documents referencing
// this Attack's _id via attackId.
// -----------------------------------------------------------------------------
const mongoose = require('mongoose');

const AttackSchema = new mongoose.Schema(
  {
    attackType: {
      type: String,
      enum: ['BRUTE_FORCE', 'CREDENTIAL_STUFFING', 'PASSWORD_SPRAYING'],
      required: true,
    },
    targetUsername: { type: String, default: null }, // used by brute force (single target)
    targetUsers: { type: [String], default: [] }, // used by credential stuffing / spraying
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: null },
    attemptCount: { type: Number, default: 0 },
    successfulAttempts: { type: Number, default: 0 },
    failedAttempts: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['READY', 'RUNNING', 'COMPLETED', 'STOPPED', 'COMPROMISED', 'FAILED'],
      default: 'READY',
    },
    success: { type: Boolean, default: false },
    // credentialsTested: redacted record of what was tried (passwords masked)
    credentialsTested: [
      {
        username: String,
        passwordMasked: String,
        result: { type: String, enum: ['SUCCESS', 'FAILED'] },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    stopRequested: { type: Boolean, default: false }, // set by STOP ATTACK endpoint
    startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attack', AttackSchema);
