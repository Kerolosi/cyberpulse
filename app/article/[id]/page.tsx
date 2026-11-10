import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicClient } from '@/lib/db';
import type { Article } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const db = publicClient();
  const { data } = await db
    .from('articles')
    .select('*, sources(name, homepage)')
    .eq('id', params.id)
    .single();

  if (!data) notFound();
  const article = data as Article;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-slate-500 hover:underline">← Back</Link>

      <h1 className="text-3xl font-bold mt-4 leading-tight">{article.title}</h1>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2">
        {article.category && (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">{article.category}</span>
        )}
        {article.severity && (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">{article.severity}</span>
        )}
        <span>{article.sources?.name}</span>
        {article.published_at && (
          <><span>·</span><span>{new Date(article.published_at).toLocaleString()}</span></>
        )}
      </div>

      {article.summary && (
        <p className="mt-4 text-slate-700 whitespace-pre-wrap">{article.summary}</p>
      )}

      {article.cves?.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Related CVEs</h2>
          <div className="flex flex-wrap gap-2">
            {article.cves.map((c) => (
              <a
                key={c}
                href={`https://nvd.nist.gov/vuln/detail/${c}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200"
              >
                {c}
              </a>
            ))}
          </div>
        </div>
      )}

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-6 px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-700"
      >
        Read full story →
      </a>
    </main>
  );
}
