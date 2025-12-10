interface Props {
  current: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = [] as number[];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Paginación">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="px-3 py-1 rounded-md border bg-white text-gray-700 disabled:opacity-50"
      >
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === current ? 'page' : undefined}
            className={`px-3 py-1 rounded-md border ${p === current ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onChange(Math.min(totalPages, current + 1))}
        disabled={current === totalPages}
        className="px-3 py-1 rounded-md border bg-white text-gray-700 disabled:opacity-50"
      >
        Siguiente
      </button>
    </nav>
  );
}
