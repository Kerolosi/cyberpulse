import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { classify, severity } from '../lib/classify';
import { extractCVEs } from '../lib/cve';
import { hashTitle, normalizeTitle } from '../lib/rss';

describe('Classification & Severity', () => {
  test('classifies ransomware with relevant tags', () => {
    const text = 'LockBit ransomware group claims responsibility for encrypting hospital network';
    const result = classify(text);
    assert.equal(result.category, 'ransomware');
    assert.ok(result.tags.includes('ransomware'));
    assert.ok(result.tags.includes('lockbit'));
  });

  test('classifies zero-day exploits accurately', () => {
    const text = 'Google patches actively exploited zero-day vulnerability in Chrome';
    const result = classify(text);
    assert.equal(result.category, 'zero-day');
  });

  test('classifies data breaches accurately', () => {
    const text = 'Major retailer suffered data breach with 5 million records exposed and leaked database';
    const result = classify(text);
    assert.equal(result.category, 'data-breach');
  });

  test('falls back to general when no keywords match', () => {
    const text = 'Tech executives attend annual global summit meeting';
    const result = classify(text);
    assert.equal(result.category, 'general');
  });

  test('assigns critical severity for zero-day and rce', () => {
    assert.equal(severity('Critical unauthenticated RCE discovered'), 'critical');
    assert.equal(severity('Actively exploited flaw in the wild'), 'critical');
  });

  test('assigns high and medium severities', () => {
    assert.equal(severity('High-severity privilege escalation flaw'), 'high');
    assert.equal(severity('Medium-severity denial of service'), 'medium');
    assert.equal(severity('Informational update for documentation'), 'low');
  });
});

describe('CVE Extraction', () => {
  test('extracts and deduplicates CVE identifiers', () => {
    const text = 'Flaws identified as CVE-2024-21413 and CVE-2023-38831, along with CVE-2024-21413 repeated';
    const cves = extractCVEs(text);
    assert.deepEqual(cves, ['CVE-2024-21413', 'CVE-2023-38831']);
  });

  test('returns empty array when no CVEs exist', () => {
    assert.deepEqual(extractCVEs('No vulnerabilities mentioned here'), []);
  });
});

describe('Title Hashing and Deduplication', () => {
  test('normalizes punctuation and case', () => {
    const t1 = 'Critical Flaw in Windows: Patch Now!';
    const t2 = 'critical flaw in windows  patch now';
    assert.equal(hashTitle(t1), hashTitle(t2));
  });

  test('generates 8-character hex hash', () => {
    const hash = hashTitle('Sample Security Advisory');
    assert.match(hash, /^[0-9a-f]{8}$/);
  });
});
