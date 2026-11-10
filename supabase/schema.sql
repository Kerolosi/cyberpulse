-- Sources
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  feed_url text not null unique,
  homepage text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Articles
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id) on delete set null,
  title text not null,
  summary text,
  url text not null unique,
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  category text,
  tags text[] not null default '{}',
  cves text[] not null default '{}',
  severity text,
  hash text
);

create index if not exists articles_published_at_idx on articles (published_at desc);
create index if not exists articles_category_idx on articles (category);
create index if not exists articles_hash_idx on articles (hash);
create index if not exists articles_tags_idx on articles using gin (tags);
create index if not exists articles_cves_idx on articles using gin (cves);

-- RLS: public read, service-role write
alter table articles enable row level security;
alter table sources enable row level security;

drop policy if exists "articles_public_read" on articles;
create policy "articles_public_read" on articles for select using (true);

drop policy if exists "sources_public_read" on sources;
create policy "sources_public_read" on sources for select using (true);
