import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'CyberPulse',
  description: 'Cybersecurity news, filtered and tagged.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <nav className="border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
            <Link href="/" className="font-bold tracking-tight">CyberPulse</Link>
            <Link href="/about" className="text-sm text-slate-500 hover:underline">About</Link>
          </div>
        </nav>
        {children}
        <footer className="max-w-5xl mx-auto px-4 py-8 text-xs text-slate-500">
          Aggregated from public RSS feeds. Summaries link to originals. MIT licensed.
        </footer>
      </body>
    </html>
  );
}
