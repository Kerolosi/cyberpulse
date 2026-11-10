import { serverClient } from './db';
import { SOURCES } from './sources';
import { fetchFeed, hashTitle } from './rss';
import { classify, severity } from './classify';
import { extractCVEs } from './cve';

export interface IngestResult {
  source: string;
  fetched: number;
  inserted: number;
  errors: string[];
}

interface ArticleRow {
  source_id: string;
  title: string;
  summary: string | null;
  url: string;
  published_at: string | null;
  category: string;
  tags: string[];
  cves: string[];
  severity: string;
  hash: string;
}

async function insertFresh(db: ReturnType<typeof serverClient>, rows: ArticleRow[]): Promise<number> {
  if (rows.length === 0) return 0;

  const hashes = rows.map((r) => r.hash);
  const urls = rows.map((r) => r.url);

  const [hashRes, urlRes] = await Promise.all([
    db.from('articles').select('hash').in('hash', hashes),
    db.from('articles').select('url').in('url', urls),
  ]);

  const seenHash = new Set(((hashRes.data ?? []) as { hash: string }[]).map((r) => r.hash));
  const seenUrl = new Set(((urlRes.data ?? []) as { url: string }[]).map((r) => r.url));

  const fresh: ArticleRow[] = [];
  for (const r of rows) {
    if (seenHash.has(r.hash) || seenUrl.has(r.url)) continue;
    seenHash.add(r.hash);
    seenUrl.add(r.url);
    fresh.push(r);
  }
  if (fresh.length === 0) return 0;

  const { data, error } = await db.from('articles').insert(fresh).select('id');
  if (error) throw error;
  return data?.length ?? 0;
}

export async function runIngest(): Promise<IngestResult[]> {
  const db = serverClient();

  // upsert sources
  await Promise.all(
    SOURCES.map((s) =>
      db
        .from('sources')
        .upsert(
          { name: s.name, feed_url: s.feed_url, homepage: s.homepage, active: true },
          { onConflict: 'feed_url' }
        )
    )
  );

  const { data: sources, error: srcErr } = await db
    .from('sources')
    .select('id, name, feed_url')
    .eq('active', true);
  if (srcErr) throw srcErr;

  const results = await Promise.all(
    ((sources ?? []) as { id: string; name: string; feed_url: string }[]).map(async (src) => {
      const res: IngestResult = { source: src.name, fetched: 0, inserted: 0, errors: [] };
      try {
        const items = await fetchFeed(src.feed_url);
        res.fetched = items.length;

        const rows: ArticleRow[] = items.map((it) => {
          const text = `${it.title}. ${it.contentSnippet ?? ''}`;
          const { category, tags } = classify(text);
          return {
            source_id: src.id,
            title: it.title,
            summary: it.contentSnippet ?? null,
            url: it.link,
            published_at: it.isoDate ?? it.pubDate ?? null,
            category,
            tags,
            cves: extractCVEs(text),
            severity: severity(text),
            hash: hashTitle(it.title),
          };
        });

        res.inserted = await insertFresh(db, rows);
      } catch (e) {
        res.errors.push(e instanceof Error ? e.message : String(e));
      }
      return res;
    })
  );

  return results;
}
