# Procedure

## Prerequisites

1. Start MongoDB locally or provide a MongoDB Atlas connection string.
2. Configure `backend/.env` using the variables documented in the main
   `README.md`.
3. Install dependencies in both `backend/` and `frontend/`.

## Experiment steps

1. From `AUTHENTIX/backend`, run `npm run seed` to create the controlled
   fictional users and reset the lab state.
2. Start the backend with `npm run dev`.
3. Start the frontend from `AUTHENTIX/frontend` with `npm run dev`.
4. Open the frontend and sign in with the seeded Security Admin account shown
   in the main README.
5. Open **Dashboard** and note the baseline authentication events.
6. Open **Attack Lab**, select **Brute Force**, target a seeded username, and
   start the simulation. Observe each attempt and its final result.
7. Repeat the experiment with **Credential Stuffing** and **Password
   Spraying**.
8. Open **Attack History** to inspect the summary and the tested attempts.
9. Open **Authentication Logs** to compare successful and failed events.
10. Open **Cryptography** and explain how bcrypt hashing and salting protect
    the stored passwords.
11. Record the attack type, number of attempts, outcome, and observed
    account-status change in the experiment report.

Only the mock accounts and fixed fictional datasets supplied by AUTHENTIX
should be used. Do not point the application at external systems or real
credentials.
