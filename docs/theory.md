# Theory

## Authentication and password verification

Authentication verifies that a user knows a secret associated with an account.
The server should not store that secret in plaintext. AUTHENTIX stores a
bcrypt password hash and verifies a login by comparing the submitted password
with the stored hash using `bcrypt.compare()`.

## Hashing and salting

A cryptographic password hash is designed to be one-way: the original
password is not recovered from the hash. A salt is random data unique to a
password hash. It prevents identical passwords from producing identical
stored values and makes precomputed rainbow-table attacks impractical.
bcrypt generates and stores the salt as part of its encoded hash.

## Authentication attacks

- **Brute force:** tries many password guesses against one account.
- **Credential stuffing:** tries previously paired username/password
  combinations against accounts, relying on password reuse.
- **Password spraying:** tries a small set of commonly used passwords against
  many accounts, reducing repeated attempts against one account.

Attack success depends on password choice, the available guesses, and
defensive controls such as rate limiting, account lockout, multifactor
authentication, monitoring, and adaptive challenges. This project intentionally
demonstrates the vulnerable baseline before those Phase 2 controls are added.
