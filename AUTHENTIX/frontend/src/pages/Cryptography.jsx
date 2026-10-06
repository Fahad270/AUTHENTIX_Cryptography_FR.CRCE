// pages/Cryptography.jsx
import React from 'react';
import { KeyRound, ArrowDown } from 'lucide-react';

function FlowBox({ label }) {
  return <div className="lab-card px-4 py-2 text-sm lab-mono text-center">{label}</div>;
}

function Arrow() {
  return <ArrowDown size={16} className="text-lab-muted my-1" />;
}

export default function Cryptography() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-1">
        <KeyRound className="text-lab-accent" size={22} />
        <h1 className="text-2xl font-bold">Cryptography</h1>
      </div>
      <p className="text-sm text-lab-muted mb-8">
        How AUTHENTIX protects passwords, and why that matters for the three attacks you just ran.
      </p>

      <section className="mb-10">
        <h2 className="font-semibold mb-3">Password Hashing</h2>
        <p className="text-sm text-lab-muted mb-4 leading-relaxed">
          AUTHENTIX never stores a password as typed. Instead, every password is run through{' '}
          <span className="text-lab-text font-medium">bcrypt</span>, a one-way hashing algorithm, and only the
          resulting hash is saved to MongoDB (<span className="lab-mono">User.passwordHash</span>). There is no
          function to reverse a hash back into the original password — the only way to "check" a password is to
          hash the guess and compare hashes, which is exactly what{' '}
          <span className="lab-mono">bcrypt.compare()</span> does in
          <span className="lab-mono"> authentication.service.js</span>.
        </p>
        <div className="flex flex-col items-center">
          <FlowBox label="Password" />
          <Arrow />
          <FlowBox label="bcrypt" />
          <Arrow />
          <FlowBox label="Hash" />
          <Arrow />
          <FlowBox label="MongoDB" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-semibold mb-3">Why Plaintext Storage Is Dangerous</h2>
        <p className="text-sm text-lab-muted leading-relaxed">
          If AUTHENTIX stored plaintext passwords and its database were ever leaked (the same way real
          credential-stuffing datasets are born), every account on every other service where a user reused
          that password would also be at risk. Hashing means a database leak alone does not hand over usable
          passwords — the attacker still faces the one-way function.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-semibold mb-3">Salt</h2>
        <p className="text-sm text-lab-muted leading-relaxed">
          A salt is random data mixed into the password before hashing, so that two users with the identical
          password end up with completely different stored hashes. bcrypt generates and embeds a unique salt
          for every hash automatically (visible as part of the hash string itself), which is why AUTHENTIX
          doesn't need a separate "salt" column — and why pre-computed "rainbow table" lookups don't work
          against it.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Authentication Flow</h2>
        <div className="flex flex-col items-center">
          <FlowBox label="User Password (typed at login or by an attack simulator)" />
          <Arrow />
          <FlowBox label="bcrypt.compare()" />
          <Arrow />
          <FlowBox label="Stored Hash" />
          <Arrow />
          <FlowBox label="Authentication Result (AuthEvent created either way)" />
        </div>
      </section>
    </div>
  );
}
