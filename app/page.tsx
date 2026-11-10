import Feed from '@/components/Feed';

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">CyberPulse</h1>
        <p className="text-slate-500 mt-1">Cybersecurity news, filtered and tagged.</p>
      </header>
      <Feed />
    </main>
  );
}
