// data/mockDataset.js
// -----------------------------------------------------------------------------
// SAFETY BOUNDARY (read this before touching this file):
//
//   - Everything here is FAKE, LOCAL, LABORATORY-ONLY data.
//   - It is used ONLY to seed AUTHENTIX's own MongoDB and to drive the
//     three attack simulations against those same local mock accounts.
//   - Nothing in this file is a real leaked credential, there is no
//     connection to any breach database, and the attack engine (see
//     services/attack.service.js) refuses any target that is not one of
//     these local usernames.
//   - Wordlists/password sets are intentionally tiny and fixed. The engine
//     never generates passwords dynamically and never accepts an
//     externally supplied wordlist.
// -----------------------------------------------------------------------------

// Laboratory accounts created by `npm run seed`.
// One of these (admin) has a deliberately weak real-world-common password so
// the Brute Force demo can succeed; the rest are used across the three
// simulations. All are fictional, development-only credentials.
const SEED_USERS = [
  { username: 'admin', email: 'admin@authentix.lab', password: 'Admin@123', role: 'SECURITY_ADMIN' },
  { username: 'alice', email: 'alice@authentix.lab', password: 'TestPassword1', role: 'NORMAL_USER' },
  { username: 'bob', email: 'bob@authentix.lab', password: 'CommonTest123', role: 'NORMAL_USER' },
  { username: 'charlie', email: 'charlie@authentix.lab', password: 'Welcome123', role: 'NORMAL_USER' },
  { username: 'manager', email: 'manager@authentix.lab', password: 'DemoPassword', role: 'NORMAL_USER' },
  { username: 'employee1', email: 'employee1@authentix.lab', password: 'Spring2024!', role: 'NORMAL_USER' },
  { username: 'employee2', email: 'employee2@authentix.lab', password: 'LetMeIn2024', role: 'NORMAL_USER' },
];

// ---- Attack 1: Brute Force -------------------------------------------------
// A small, fixed wordlist tried one-by-one against a single chosen target.
// The target's real seed password (above) is deliberately included near the
// end of the list so the simulation reliably demonstrates a compromise.
const BRUTE_FORCE_WORDLIST = [
  '123456',
  'password',
  'qwerty',
  'welcome',
  'admin123',
  'letmein',
  'football',
  'Admin@123', // matches admin's seed password -> demonstrates compromise
];

// ---- Attack 2: Credential Stuffing -----------------------------------------
// A fixed set of username:password PAIRS, as if leaked from some other
// (fictional) service and "stuffed" against AUTHENTIX. Most are wrong;
// a few intentionally match real seed credentials above.
const CREDENTIAL_STUFFING_PAIRS = [
  { username: 'alice', password: 'password1' },
  { username: 'bob', password: 'qwerty123' },
  { username: 'charlie', password: 'summer2023' },
  { username: 'manager', password: 'DemoPassword' }, // matches -> success
  { username: 'employee1', password: 'test123' },
  { username: 'employee2', password: 'iloveyou' },
  { username: 'alice', password: 'TestPassword1' }, // matches -> success
  { username: 'admin', password: '12345678' },
  { username: 'bob', password: 'CommonTest123' }, // matches -> success
  { username: 'charlie', password: 'monkey123' },
  { username: 'employee1', password: 'Spring2024!' }, // matches -> success
  { username: 'manager', password: 'trustno1' },
  { username: 'admin', password: 'dragon' },
  { username: 'employee2', password: 'LetMeIn2024' }, // matches -> success
  { username: 'alice', password: 'baseball' },
  { username: 'bob', password: 'master' },
  { username: 'charlie', password: 'Welcome123' }, // matches -> success
  { username: 'manager', password: 'whatever' },
  { username: 'employee1', password: 'shadow' },
  { username: 'employee2', password: 'superman' },
  { username: 'admin', password: 'passw0rd' },
  { username: 'alice', password: 'letmein99' },
  { username: 'bob', password: 'starwars' },
  { username: 'manager', password: 'freedom' },
];

// ---- Attack 3: Password Spraying -------------------------------------------
// A tiny set of common/guessable passwords tried against MANY accounts
// (one password across all targets before moving to the next), instead of
// many passwords against a single account.
const SPRAY_PASSWORD_SET = ['Welcome123', 'Password1', 'Spring2024!'];

// Targets used for the spray (all laboratory users).
const SPRAY_TARGET_USERNAMES = SEED_USERS.map((u) => u.username);

module.exports = {
  SEED_USERS,
  BRUTE_FORCE_WORDLIST,
  CREDENTIAL_STUFFING_PAIRS,
  SPRAY_PASSWORD_SET,
  SPRAY_TARGET_USERNAMES,
};
