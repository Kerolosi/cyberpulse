import type { Category, Severity } from './types';

const RULES: Record<Exclude<Category, 'general'>, string[]> = {
  ransomware: ['ransomware', 'lockbit', 'blackcat', 'alphv', 'cl0p', 'rhysida', 'akira', 'extortion', 'encryptor'],
  'data-breach': ['data breach', 'breached', 'leaked', 'stolen data', 'exposed database', 'exfiltrat', 'records exposed'],
  'zero-day': ['zero-day', '0-day', 'zero day', 'actively exploited', 'exploited in the wild', 'in-the-wild'],
  vulnerability: ['cve-', 'vulnerability', 'vulnerabilities', 'rce', 'remote code execution', 'sql injection', 'xss', 'privilege escalation', 'deserialization', 'ssrf', 'path traversal'],
  malware: ['malware', 'trojan', 'backdoor', 'spyware', 'stealer', 'botnet', 'worm', 'rootkit', 'infostealer', 'rat '],
  apt: [' apt ', 'apt28', 'apt29', 'apt41', 'nation-state', 'state-sponsored', 'lazarus', 'fancy bear', 'cozy bear', 'sandworm', 'midnight blizzard'],
  patch: ['patch tuesday', 'security update', 'patched', 'hotfix', 'advisory', 'security bulletin'],
  policy: ['regulation', 'policy', 'gdpr', 'nis2', 'ciso', 'compliance', 'legislation', 'sanction', 'government', 'lawsuit'],
  research: ['researchers', 'research', 'study', 'analysis', 'report', 'whitepaper', 'threat intel'],
  tool: ['new tool', 'framework', 'library', 'open source', 'open-source', 'released', 'release notes'],
};

const SEV_CRIT = /\b(critical|actively exploited|rce|remote code execution|emergency|zero-day|0-day)\b/i;
const SEV_HIGH = /\b(high[- ]severity|severe|urgent|important severity)\b/i;
const SEV_MED = /\b(medium[- ]severity|moderate)\b/i;

export function classify(text: string): { category: Category; tags: string[] } {
  const lower = ` ${text.toLowerCase()} `;
  const tags = new Set<string>();
  let best: Category = 'general';
  let bestScore = 0;

  (Object.entries(RULES) as [Category, string[]][]).forEach(([cat, kws]) => {
    let score = 0;
    for (const kw of kws) {
      if (lower.includes(kw)) {
        score++;
        tags.add(kw.trim());
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  });

  return { category: best, tags: Array.from(tags).slice(0, 8) };
}

export function severity(text: string): Severity {
  if (SEV_CRIT.test(text)) return 'critical';
  if (SEV_HIGH.test(text)) return 'high';
  if (SEV_MED.test(text)) return 'medium';
  return 'low';
}
