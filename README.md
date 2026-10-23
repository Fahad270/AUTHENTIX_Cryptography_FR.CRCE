Phase -1 Implementation
Interactive Authentication Attack & Security Simulation Laboratory

A 3rd-year BTech Cryptography project: a controlled, full-stack authentication security lab that demonstrates three credential-based attacks — Brute Force, Credential Stuffing, and Password Spraying — against mock accounts, end-to-end:

React UI → Backend API → Authentication Engine → MongoDB → Attack Simulation → Event Logging → Dashboard
Every attack attempt runs through the real backend authentication service and produces real MongoDB records — nothing on the dashboard is hardcoded.

Experiment Documentation
The complete experiment is divided into the following Markdown sections. The files are stored in the repository-level docs/ directory. The links below point directly to each file's raw GitHub content, so they can be used by a learning-platform metadata form or embedded experiment page.

Section	Raw Markdown file
Aim	aim.md
Theory	theory.md
Objective	objective.md
Procedure	procedure.md
Simulation	simulation.md
Quiz	quiz.md
References	references.md
👥 Team Members
Alston Miranda
Rohit Raina
Hamzah Shaikh
Bushra Sayed
Fahad Syed
⚠️ Safety Boundary
This is an educational, self-contained simulation. The attack engine:

Only ever operates against mock users seeded inside AUTHENTIX itself (backend/src/data/mockDataset.js)
Uses a small, fixed, fictional wordlist / credential-pair list / spray password set — never real leaked credentials, never a breach database
Cannot accept an external URL, IP, or target — every attack endpoint validates the target against AUTHENTIX's own local user collection
Is fully reproducible: re-run npm run seed to reset to a known state
Features
Area	Status
Registration/seed data, login, logout, role-based access	✅ Phase 1
Password hashing (bcrypt)	✅ Phase 1
Authentication event logging	✅ Phase 1
Brute Force simulation	✅ Phase 1
Credential Stuffing simulation	✅ Phase 1
Password Spraying simulation	✅ Phase 1
Dashboard, attack history, auth logs, attack timeline	✅ Phase 1
Cryptography explainer (hashing + salt)	✅ Phase 1
Rate limiting, account lockout, MFA, CAPTCHA, detection, incident response	🔜 Phase 2 (UI-only, clearly labeled "not implemented")
Why Phase 1 has no rate limiting / lockout / MFA
This is intentional. Phase 1 exists to demonstrate "what happens when these controls are absent?" — so the three attacks can actually succeed and be observed end-to-end. Phase 2 (not built yet) would add real prevention and detection, turning the story from:

BEFORE DEFENSE:  Attack → Compromise
AFTER DEFENSE:   Attack → Detection → Block → No Compromise
Tech Stack
Frontend: React, Vite, Tailwind CSS, React Router, Axios, Lucide React, Recharts Backend: Node.js, Express, MongoDB, Mongoose, bcryptjs, JSON Web Tokens, dotenv, CORS Real-time: Socket.IO is wired into the server (optional); the UI itself uses lightweight polling for simplicity and reliability.

Project Structure
AUTHENTIX/
├── frontend/          React + Vite app
│   └── src/
│       ├── components/   Sidebar, StatusBadge, PhaseTag, ProtectedRoute
│       ├── pages/         Login, Overview, Dashboard, AttackLab, AttackHistory,
│       │                  AuthLogs, Cryptography, SecurityControls
│       ├── services/      api.js (axios instance)
│       ├── context/       AuthContext.jsx
│       ├── hooks/         usePolling.js
│       └── layouts/       DashboardLayout.jsx
│
├── backend/            Express + MongoDB API
│   └── src/
│       ├── models/        User, AuthEvent, Attack
│       ├── controllers/    auth, attack, event, dashboard
│       ├── services/       authentication, event, attack (generic engine),
│       │                   bruteforce, credentialStuffing, passwordSpraying,
│       │                   dashboard
│       ├── middleware/     auth (JWT), role (RBAC), errorHandler
│       ├── data/           mockDataset.js (controlled lab data — see Safety Boundary)
│       ├── seed.js         creates laboratory users
│       └── server.js
│
└── README.md  (this file)

../docs/              Experiment content: aim, theory, objectives, procedure,
                      simulation, quiz, and references
Installation
1. MongoDB
You need a running MongoDB instance. Easiest options:

Local install: mongod running on localhost:27017
Docker: docker run -d -p 27017:27017 --name authentix-mongo mongo
MongoDB Atlas free cluster (update MONGO_URI accordingly)
2. Backend
cd backend
cp .env.example .env       # edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed                # creates admin, alice, bob, charlie, manager, employee1, employee2
npm run dev                  # starts on http://localhost:5000
3. Frontend
cd frontend
cp .env.example .env         # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                  # starts on http://localhost:5173
4. Log in
Open http://localhost:5173 and log in as:

username: admin
password: Admin@123
(This is the Security Admin account created by the seed script, with full access to the Attack Lab, Dashboard, Attack History, and Authentication Logs.)

Environment Variables
backend/.env

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/authentix
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=8h
FRONTEND_ORIGIN=http://localhost:5173
frontend/.env

VITE_API_URL=http://localhost:5000/api
Demo Flow (for the viva)
Login as Security Admin (admin / Admin@123)
Open Dashboard → show baseline auth events
Open Attack Lab → select Brute Force, target admin, Start Attack
Watch the live attempt stream until it shows SUCCESS
Open Attack History → click the attack → show attack details
Open Authentication Logs → show every individual attempt recorded
Back to Attack Lab → run Credential Stuffing, then Password Spraying
Scroll to the Attack Comparison table at the bottom of Attack Lab
Open Cryptography → explain hashing + salt
Open Security Controls → explain that these are Phase 2, not yet built
Architectural Notes (for the report/viva)
One authentication engine, three attack strategies. All three attacks (bruteforce.service.js, credentialStuffing.service.js, passwordSpraying.service.js) call the exact same authentication.service.js#attemptLogin() used by normal login. This is why the simulations are "real" rather than scripted UI animations — a successful attack really flips a real MongoDB document's accountStatus to COMPROMISED.
Single active-attack lock. attack.service.js holds an in-memory lock so only one simulation can run at a time (409 Conflict otherwise), per the lab's concurrency rule.
No plaintext passwords ever leave the backend. Attack.credentialsTested stores a masked password (********), never the real value.
Dashboard numbers are always live. dashboard.service.js only ever reads via MongoDB aggregation — there are no hardcoded stats anywhere.
Phase 2 (Not Implemented — UI Preview Only)
The Security Controls page in the UI lists, but does not implement:

Rate limiting, account lockout, MFA, CAPTCHA/adaptive challenge (Prevention)
Automated attack classification, risk scoring, suspicious-IP detection (Detection)
Account containment, session invalidation, credential reset, incident response workflow (Response)
These are intentionally left as future direction so Phase 1 can clearly demonstrate the vulnerable baseline before any defenses are added.
