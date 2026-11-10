'use client';

import { useEffect, useState } from 'react';

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 300);
    return () => clearTimeout(t);
  }, [local, value, onChange]);

  return (
    <input
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder="Search articles (e.g. LockBit, CVE-2024)…"
      className="w-full px-3 py-2 rounded border border-slate-300 bg-white focus:outline-none focus:border-slate-500"
    />
  );
}
