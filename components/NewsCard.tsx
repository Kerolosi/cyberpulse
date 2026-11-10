import Link from 'next/link';
import type { Article } from '@/lib/types';

function sevClass(s: string | null | undefined) {
  switch (s) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export default function NewsCard({ article }: { article: Article }) {
  const date = article.published_at ? new Date(article.published_at).toLocaleString() : '';

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:border-slate-400 transition">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
        {article.category && (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">{article.category}</span>
        )}
        {article.severity && (
          <span className={`px-2 py-0.5 rounded ${sevClass(article.severity)}`}>{article.severity}</span>
        )}
        <span>{article.sources?.name}</span>
        {date && <><span>·</span><span>{date}</span></>}
      </div>

      <Link href={`/article/${article.id}`} className="text-lg font-semibold hover:underline">
        {article.title}
      </Link>

      {article.summary && (
        <p className="text-slate-600 mt-1 line-clamp-2">{article.summary}</p>
      )}

      {article.cves?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {article.cves.slice(0, 6).map((c) => (
            <a
              key={c}
              href={`https://nvd.nist.gov/vuln/detail/${c}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200"
            >
              {c}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
