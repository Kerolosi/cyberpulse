export interface SourceConfig {
  name: string;
  feed_url: string;
  homepage: string;
}

export const SOURCES: SourceConfig[] = [
  { name: 'The Hacker News', feed_url: 'https://feeds.feedburner.com/TheHackersNews', homepage: 'https://thehackernews.com' },
  { name: 'BleepingComputer', feed_url: 'https://www.bleepingcomputer.com/feed/', homepage: 'https://www.bleepingcomputer.com' },
  { name: 'Krebs on Security', feed_url: 'https://krebsonsecurity.com/feed/', homepage: 'https://krebsonsecurity.com' },
  { name: 'Dark Reading', feed_url: 'https://www.darkreading.com/rss.xml', homepage: 'https://www.darkreading.com' },
  { name: 'SecurityWeek', feed_url: 'https://www.securityweek.com/feed/', homepage: 'https://www.securityweek.com' },
  { name: 'The Record', feed_url: 'https://therecord.media/feed', homepage: 'https://therecord.media' },
  { name: 'CISA Advisories', feed_url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml', homepage: 'https://www.cisa.gov' },
];
