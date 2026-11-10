'use client';

import { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';
import type { Article } from '@/lib/types';

const LIMIT = 20;

export default function Feed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (category) params.set('category', category);
    if (q) params.set('q', q);

    let alive = true;
    setLoading(true);
    fetch(`/api/news?${params.toString()}`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setArticles(j.data ?? []);
        setCount(j.count ?? 0);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [category, q, page]);

  return (
    <>
      <div className="mb-3">
        <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} />
      </div>
      <FilterBar value={category} onChange={(v) => { setCategory(v); setPage(1); }} />

      <div className="mt-4">
        {loading && <p className="text-slate-500">Loading…</p>}
        {!loading && articles.length === 0 && (
          <p className="text-slate-500">No articles yet. Trigger an ingest: <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">npm run ingest</code></p>
        )}
        <div className="grid gap-3">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border border-slate-300 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-slate-500">
            Page {page} · {count} results
          </span>
          <button
            disabled={page * LIMIT >= count}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border border-slate-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
