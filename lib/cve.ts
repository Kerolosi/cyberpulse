export function extractCVEs(text: string): string[] {
  const matches = text.match(/CVE-\d{4}-\d{4,}/gi) ?? [];
  return Array.from(new Set(matches.map((m) => m.toUpperCase())));
}
