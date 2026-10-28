// pages/Guide.jsx
import React from 'react';
import {
  ShieldAlert,
  Zap,
  Key,
  SprayCan,
  Lock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Wrench,
  Search,
  UserCheck,
  RotateCcw,
  FileText,
  Target,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

const ATTACK_TYPES = [
  {
    id: 'brute-force',
    icon: Zap,
    name: 'Brute Force',
    description: 'Systematic trial of all possible password combinations against a single target account until success.',
    indicators: ['High volume of failed attempts on one account', 'Rapid sequential attempts', 'Often from single IP'],
    prevention: ['Account lockout after N failures', 'Rate limiting per IP/account', 'Strong password policies', 'MFA'],
  },
  {
    id: 'credential-stuffing',
    icon: Key,
    name: 'Credential Stuffing',
    description: 'Automated injection of breached username/password pairs from other sites against your service.',
    indicators: ['Known breach credentials used', 'Distributed across many accounts', 'Low volume per account'],
    prevention: ['MFA (most effective)', 'Breached password detection', 'Rate limiting', 'Device fingerprinting'],
  },
  {
    id: 'password-spraying',
    icon: SprayCan,
    name: 'Password Spraying',
    description: 'Trying a few common passwords across many accounts to avoid lockout thresholds.',
    indicators: ['Few attempts per account', 'Many accounts targeted', 'Common passwords (Password1, Spring2024!)'],
    prevention: ['Account lockout', 'Ban common passwords', 'Rate limiting by IP/subnet', 'MFA'],
  },
];

const PREVENTION_STRATEGIES = [
  {
    icon: Lock,
    title: 'Multi-Factor Authentication (MFA)',
    details: 'The single most effective defense. Even with valid credentials, attacker cannot access without second factor.',
    priority: 'Critical',
  },
  {
    icon: ShieldAlert,
    title: 'Rate Limiting',
    details: 'Limit authentication requests per IP, per account, per time window. Configurable thresholds (e.g., 10 req/15min).',
    priority: 'High',
  },
  {
    icon: UserCheck,
    title: 'Account Lockout',
    details: 'Temporarily lock account after N consecutive failures (e.g., 5). Auto-unlock after cooldown (e.g., 15 min).',
    priority: 'High',
  },
  {
    icon: Key,
    title: 'Strong Password Policy',
    details: 'Enforce length (≥12), complexity, breach checks (HaveIBeenPwned API), rotation, prevent reuse.',
    priority: 'High',
  },
  {
    icon: Search,
    title: 'Monitoring & Alerting',
    details: 'Log all auth events. Alert on anomalies: spike in failures, geo-impossible logins, new device/ASN.',
    priority: 'Medium',
  },
  {
    icon: Wrench,
    title: 'WAF / Adaptive Challenges',
    details: 'CAPTCHA, JavaScript challenges, or proof-of-work on suspicious patterns. Degrades attacker ROI.',
    priority: 'Medium',
  },
];

const INCIDENT_RESPONSE = [
  {
    phase: '1. Detect',
    icon: AlertTriangle,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    steps: [
      'Correlate auth logs for attack patterns',
      'Identify attack type (brute force / stuffing / spray)',
      'Determine scope: accounts targeted, success rate',
      'Check for actual compromises (COMPROMISED status)',
    ],
  },
  {
    phase: '2. Contain',
    icon: Lock,
    color: 'text-red-600 bg-red-50 border-red-200',
    steps: [
      'Lock compromised accounts immediately',
      'Force password reset for affected users',
      'Invalidate all active sessions for those accounts',
      'Block attacking IPs at firewall/WAF',
      'Enable emergency rate limiting',
    ],
  },
  {
    phase: '3. Eradicate',
    icon: Wrench,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    steps: [
      'Remove attacker persistence (API keys, tokens)',
      'Audit for lateral movement',
      'Verify no backdoors in auth flow',
      'Rotate any shared secrets/keys',
    ],
  },
  {
    phase: '4. Recover',
    icon: RotateCcw,
    color: 'text-green-600 bg-green-50 border-green-200',
    steps: [
      'Restore accounts to ACTIVE after verification',
      'Communicate with affected users transparently',
      'Monitor for re-attack attempts',
      'Re-enable MFA where disabled',
    ],
  },
  {
    phase: '5. Post-Incident',
    icon: FileText,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    steps: [
      'Root cause analysis (why did it succeed?)',
      'Update runbooks and detection rules',
      'Improve defenses (add missing controls)',
      'Tabletop exercise with team',
      'Report to stakeholders/regulators if required',
    ],
  },
];

const LAB_DEMO_TIPS = [
  'Start with Phase 2 OFF — run attacks to see "Attack → Compromise"',
  'Enable Phase 2 in Security Controls — run same attacks to see "Attack → Blocked"',
  'Check Authentication Logs for ACCOUNT_LOCKED events',
  'Observe rate limit headers in browser DevTools (Network tab)',
  'Use the comparison table in Attack Lab to contrast all three attacks',
];

export default function Guide() {
  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center gap-3">
        <BookOpen className="text-primary-600" size={28} />
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text">Security Guide</h1>
          <p className="text-muted mt-1">Understanding authentication attacks, prevention, and incident response</p>
        </div>
      </div>

      {/* Phase 1 vs Phase 2 */}
      <section className="card p-6 animate-fade-in">
        <h2 className="section-title flex items-center gap-2">
          <Target size={20} className="text-primary-600" />
          Phase 1 vs Phase 2 in This Lab
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-red-200 bg-red-50">
            <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
              <AlertCircle size={16} /> Phase 1 (Default)
            </h3>
            <ul className="text-sm text-red-600 space-y-1">
              <li>• No rate limiting on login/attacks</li>
              <li>No account lockout</li>
              <li>Attacks succeed → account marked COMPROMISED</li>
              <li>Demonstrates "what happens without defenses"</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border border-green-200 bg-green-50">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <CheckCircle size={16} /> Phase 2 (Toggle ON)
            </h3>
            <ul className="text-sm text-green-600 space-y-1">
              <li>• Rate limiting: 10 login/15min, 20 attacks/5min</li>
              <li>• Account lockout after 5 failures (15 min)</li>
              <li>• Attacks blocked → ACCOUNT_LOCKED events</li>
              <li>• Demonstrates "Attack → Detection → Block"</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-primary-50 border border-primary-200">
          <p className="text-sm text-primary-700">
            <strong>Toggle:</strong> Go to <span className="font-mono">Security Controls</span> → flip the switch (Security Admin only).
            Change takes effect immediately — no restart needed.
          </p>
        </div>
      </section>

      {/* Attack Types */}
      <section className="card p-6 animate-fade-in" style={{animationDelay: '50ms'}}>
        <h2 className="section-title flex items-center gap-2">
          <Zap size={20} className="text-primary-600" />
          Attack Types Simulated in AUTHENTIX
        </h2>
        <div className="space-y-4">
          {ATTACK_TYPES.map((attack) => (
            <div key={attack.id} className="p-4 rounded-lg border border-border bg-surface-50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <attack.icon className="text-primary-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text">{attack.name}</h3>
                  <p className="text-sm text-muted mt-1">{attack.description}</p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-1">Indicators</h4>
                      <ul className="text-sm text-text space-y-0.5">
                        {attack.indicators.map((i, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-primary-500">•</span> {i}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-1">Prevention</h4>
                      <ul className="text-sm text-text space-y-0.5">
                        {attack.prevention.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-success">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prevention Strategies */}
      <section className="card p-6 animate-fade-in" style={{animationDelay: '100ms'}}>
        <h2 className="section-title flex items-center gap-2">
          <ShieldAlert size={20} className="text-primary-600" />
          Prevention Strategies (Layered Defense)
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PREVENTION_STRATEGIES.map((strat, idx) => (
            <div key={strat.title} className="p-4 rounded-lg border border-border bg-white hover:shadow-card-hover transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <strat.icon className="text-primary-600" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-text">{strat.title}</h3>
                  <span className={`badge ${strat.priority === 'Critical' ? 'badge-danger' : strat.priority === 'High' ? 'badge-warning' : 'badge-info'}`}>
                    {strat.priority}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted">{strat.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Incident Response */}
      <section className="card p-6 animate-fade-in" style={{animationDelay: '150ms'}}>
        <h2 className="section-title flex items-center gap-2">
          <RotateCcw size={20} className="text-primary-600" />
          What To Do When Attacks Happen — Incident Response
        </h2>
        <div className="space-y-4">
          {INCIDENT_RESPONSE.map((phase, idx) => (
            <div key={phase.phase} className="p-4 rounded-lg border border-border bg-white">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${phase.color}`}>
                  <phase.icon className="text-text" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text">{phase.phase}</h3>
                  <ul className="text-sm text-muted mt-2 space-y-1">
                    {phase.steps.map((step, si) => (
                      <li key={si} className="flex items-start gap-2">
                        <CheckCircle className="text-success flex-shrink-0 mt-0.5" size={14} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lab Demo Tips */}
      <section className="card p-6 animate-fade-in" style={{animationDelay: '200ms'}}>
        <h2 className="section-title flex items-center gap-2">
          <Lightbulb size={20} className="text-primary-600" />
          Lab Demo Tips (For Your Viva/Presentation)
        </h2>
        <ol className="space-y-2">
          {LAB_DEMO_TIPS.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 border border-border">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-sm font-bold flex items-center justify-center">{idx + 1}</span>
              <span className="text-sm text-text">{tip}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* References */}
      <section className="card p-6 animate-fade-in" style={{animationDelay: '250ms'}}>
        <h2 className="section-title flex items-center gap-2">
          <FileText size={20} className="text-primary-600" />
          References & Further Reading
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-text mb-2">Standards & Frameworks</h3>
            <ul className="space-y-1 text-muted">
              <li>• NIST SP 800-63B (Digital Identity Guidelines)</li>
              <li>• OWASP Authentication Cheat Sheet</li>
              <li>• OWASP Credential Stuffing Prevention Cheat Sheet</li>
              <li>• MITRE ATT&CK: T1110 (Brute Force), T1110.004 (Credential Stuffing), T1110.003 (Password Spraying)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-text mb-2">Tools & Resources</h3>
            <ul className="space-y-1 text-muted">
              <li>• HaveIBeenPwned API (breached password check)</li>
              <li>• SecLists / rockyou.txt (wordlists — for authorized testing only)</li>
              <li>• Hydra, Medusa, Patator (brute force tools — lab use only)</li>
              <li>• fail2ban, CrowdSec (host-based rate limiting)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}