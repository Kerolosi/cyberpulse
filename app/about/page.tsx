export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-3xl font-bold">About CyberPulse</h1>
      <p className="text-slate-700">
        CyberPulse aggregates cybersecurity news from trusted feeds, classifies each article into a
        category, extracts CVE identifiers, and highlights severity — so analysts can scan signal, not noise.
      </p>

      <h2 className="text-xl font-semibold pt-2">How it works</h2>
      <ul className="list-disc pl-6 space-y-1 text-slate-700">
        <li>An hourly cron fetches RSS feeds from trusted sources.</li>
        <li>Each item is normalized, rule-classified, and scanned for CVE IDs and severity keywords.</li>
        <li>Duplicate stories across sources are filtered using a normalized-title hash.</li>
        <li>The frontend supports category filters, full-text search, and pagination.</li>
      </ul>

      <h2 className="text-xl font-semibold pt-2">Stack</h2>
      <ul className="list-disc pl-6 space-y-1 text-slate-700">
        <li>Next.js (App Router) + TypeScript</li>
        <li>Supabase (Postgres) with Row-Level Security</li>
        <li>rss-parser for ingestion</li>
        <li>GitHub Actions for scheduled ingestion (Vercel-friendly)</li>
      </ul>

      <p className="text-slate-700">Open source. MIT licensed.</p>
    </main>
  );
}
