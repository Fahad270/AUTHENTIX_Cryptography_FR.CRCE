// config/phase2.js
const state = {
  enabled: process.env.PHASE2_ENABLED === 'true',
};

function isPhase2Enabled() {
  return state.enabled;
}

function setPhase2Enabled(enabled) {
  if (typeof enabled !== 'boolean') {
    throw new Error('enabled must be boolean');
  }
  state.enabled = enabled;
  return state.enabled;
}

module.exports = {
  isPhase2Enabled,
  setPhase2Enabled,
  getState: () => ({ enabled: state.enabled }),
};
