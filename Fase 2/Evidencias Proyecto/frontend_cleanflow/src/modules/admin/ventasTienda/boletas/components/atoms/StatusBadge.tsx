interface StatusBadgeProps {
  estado: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ estado, size = 'md' }: StatusBadgeProps) {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PAGADA':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
      case 'RECHAZADA':
        return { bg: 'bg-red-100', text: 'text-red-700' };
      case 'ANULADA':
        return { bg: 'bg-amber-100', text: 'text-amber-700' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const colors = getStatusColor(estado);
  const sizeClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  }[size];

  return (
    <span className={`rounded-lg ${colors.bg} ${colors.text} ${sizeClass} font-semibold whitespace-nowrap`}>
      {estado}
    </span>
  );
}
