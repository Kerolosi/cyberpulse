'use client';

const CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'vulnerability', label: 'Vulnerability' },
  { value: 'malware', label: 'Malware' },
  { value: 'ransomware', label: 'Ransomware' },
  { value: 'data-breach', label: 'Breach' },
  { value: 'zero-day', label: 'Zero-Day' },
  { value: 'apt', label: 'APT' },
  { value: 'patch', label: 'Patch' },
  { value: 'policy', label: 'Policy' },
  { value: 'research', label: 'Research' },
  { value: 'tool', label: 'Tool' },
];

export default function FilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const active = value === c.value;
        return (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className={`px-3 py-1 rounded-full text-sm border ${
              active
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
