# Quiz

1. Why should a web application store a password hash instead of the
   plaintext password?
2. What two properties make bcrypt more suitable for password storage than a
   fast general-purpose hash?
3. What problem does a unique salt solve?
4. How does brute force differ from password spraying?
5. Why can credential stuffing succeed even when an application uses bcrypt?
6. Why does AUTHENTIX record failed authentication attempts as well as
   successful attempts?
7. Name two controls that could reduce the success rate of the simulations.
8. Why must this experiment use only fictional, locally seeded accounts?

## Answer key

1. A hash is one-way, so a database disclosure does not directly reveal the
   password. Plaintext storage would expose every stored password immediately.
2. bcrypt is intentionally slow and has a configurable cost, which makes
   large-scale guessing more expensive than with a fast hash.
3. A unique salt prevents equal passwords from having equal stored hashes and
   defeats reusable precomputed hash tables.
4. Brute force tries many guesses against one account; spraying tries a small
   number of guesses across many accounts.
5. Hashing protects the database, but it cannot prevent an attacker from
   submitting a password that a user reused on another service.
6. Failed events support auditing, detection, rate-limit decisions, and
   investigation of attack patterns.
7. Examples include rate limiting, account lockout, MFA, adaptive challenges,
   strong password policy, and attack detection.
8. Limiting the target to the local lab prevents harm to real users and
   systems and makes the experiment reproducible.
