# Simulation

AUTHENTIX is a self-contained simulation of an authentication system under
attack. It is not a tool for attacking real services.

## Simulation model

Each attack strategy calls the same backend authentication method used by a
normal login. Every attempt creates an authentication event, and an attack
record stores the strategy, target, attempt count, outcome, and masked
credentials. Passwords are never returned to the frontend or stored in an
attack record as plaintext.

| Strategy | Target pattern | What to observe |
| --- | --- | --- |
| Brute force | One username and many guesses | How repeated guesses can eventually discover a weak password |
| Credential stuffing | Many username/password pairs | How password reuse turns a leaked pair into a login risk |
| Password spraying | Many users and a small password set | How attackers avoid concentrating attempts on one account |

## Expected observations

The dashboard and authentication logs should show both failed and successful
attempts. When a simulated login succeeds, the corresponding mock account can
be marked as compromised. The attack history provides the aggregate result,
while the event log provides the individual attempt details.

The lab intentionally has no active rate limiting, account lockout, MFA, or
CAPTCHA in Phase 1. This makes the effect of the attacks visible. In a
production system, these controls should be combined with monitoring,
credential reset, session invalidation, and incident response.
