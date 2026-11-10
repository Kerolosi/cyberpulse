import { NextRequest, NextResponse } from 'next/server';
import { publicClient } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = (searchParams.get('q') ?? '').trim();
  const category = (searchParams.get('category') ?? '').trim();
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get('limit') ?? '20', 10) || 20));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const db = publicClient();
  let query = db
    .from('articles')
    .select('*, sources(name, homepage)', { count: 'exact' })
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(from, to);

  if (category) query = query.eq('category', category);
  if (q) {
    const safe = q.replace(/[,()]/g, ' ').trim();
    if (safe) query = query.or(`title.ilike.%${safe}%,summary.ilike.%${safe}%`);
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], count: count ?? 0, page, limit });
}
