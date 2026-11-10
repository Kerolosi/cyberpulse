# CyberPulse

Cybersecurity news aggregator. Pulls RSS from trusted sources, classifies articles,
extracts CVEs, tags severity, and filters out duplicates.

## Features
- Hourly ingestion from 7+ trusted cybersecurity feeds
- Rule-based classification into 10 categories
- CVE extraction with links to NVD
- Severity heuristics (critical/high/medium/low)
- Duplicate filtering by normalized title hash
- Full-text search + category filters + pagination
- Deployed on Vercel, DB on Supabase

## Stack
- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- Supabase (Postgres, RLS)
- rss-parser
- GitHub Actions for scheduled ingestion

## Local setup
1. `npm install`
2. `cp .env.example .env.local` and fill in Supabase keys + CRON_SECRET
3. Run the SQL in `supabase/schema.sql` inside Supabase SQL Editor
4. `npm run ingest` to populate the DB
5. `npm run dev` → http://localhost:3000

## Deploy
1. Push to GitHub
2. Import into Vercel; set env vars
3. Add `APP_URL` + `CRON_SECRET` as GitHub Actions secrets
4. The workflow ingests hourly

## License
MIT
