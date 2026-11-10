import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'CyberPulse/1.0 (+https://github.com/Kerolosi/cyberpulse)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
});

export interface RawItem {
  title: string;
  link: string;
  contentSnippet?: string;
  isoDate?: string;
  pubDate?: string;
}

export async function fetchFeed(url: string): Promise<RawItem[]> {
  const feed = await parser.parseURL(url);
  return (feed.items ?? [])
    .map((i) => ({
      title: (i.title ?? '').trim(),
      link: (i.link ?? '').trim(),
      contentSnippet: i.contentSnippet?.slice(0, 600) ?? undefined,
      isoDate: i.isoDate,
      pubDate: i.pubDate,
    }))
    .filter((i) => i.title.length > 0 && i.link.startsWith('http'));
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function hashTitle(title: string): string {
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  const s = normalizeTitle(title);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
