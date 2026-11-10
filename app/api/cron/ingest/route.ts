import { NextRequest, NextResponse } from 'next/server';
import { runIngest } from '@/lib/ingest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handler(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') ?? '';
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const results = await runIngest();
    const summary = results.map((r) => ({
      source: r.source,
      fetched: r.fetched,
      inserted: r.inserted,
      errors: r.errors,
    }));
    return NextResponse.json({ ok: true, summary });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
