// models/AuthEvent.js
// -----------------------------------------------------------------------------
// Every single authentication attempt in AUTHENTIX - whether a normal login
// or a step inside an attack simulation - creates exactly one AuthEvent.
// This is the evidence trail used by Authentication Logs and the Dashboard.
// -----------------------------------------------------------------------------
const mongoose = require('mongoose');

const AuthEventSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    username: { type: String, required: true },
    success: { type: Boolean, required: true },
    failureReason: { type: String, default: null }, // e.g. "INVALID_PASSWORD", "USER_NOT_FOUND"
    eventType: {
      type: String,
      enum: [
        'LOGIN_SUCCESS',
        'LOGIN_FAILURE',
        'BRUTE_FORCE_ATTEMPT',
        'CREDENTIAL_STUFFING_ATTEMPT',
        'PASSWORD_SPRAY_ATTEMPT',
      ],
      required: true,
    },
    source: {
      type: String,
      enum: ['NORMAL_LOGIN', 'ATTACK_SIMULATOR'],
      required: true,
    },
    // attackId links this event back to the Attack record that generated it
    // (null for normal, non-simulated logins).
    attackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attack', default: null },
    requestId: { type: String, required: true }, // unique id per HTTP request/attempt
  },
  { timestamps: false }
);

AuthEventSchema.index({ timestamp: -1 });
AuthEventSchema.index({ attackId: 1 });

module.exports = mongoose.model('AuthEvent', AuthEventSchema);
