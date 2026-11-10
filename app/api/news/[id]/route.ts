import { NextResponse } from 'next/server';
import { publicClient } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const db = publicClient();
  const { data, error } = await db
    .from('articles')
    .select('*, sources(name, homepage)')
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}
