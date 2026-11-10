export type Category =
  | 'vulnerability'
  | 'malware'
  | 'ransomware'
  | 'data-breach'
  | 'zero-day'
  | 'apt'
  | 'patch'
  | 'policy'
  | 'research'
  | 'tool'
  | 'general';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Article {
  id: string;
  source_id: string | null;
  title: string;
  summary: string | null;
  url: string;
  published_at: string | null;
  fetched_at: string;
  category: Category | null;
  tags: string[];
  cves: string[];
  severity: Severity | null;
  hash: string | null;
  sources?: { name: string; homepage: string | null } | null;
}
