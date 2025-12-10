interface FormattedPriceProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  bold?: boolean;
  gradient?: boolean;
}

export function FormattedPrice({ value, size = 'md', bold = false, gradient = false }: FormattedPriceProps) {
  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const sizeClass = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  const fontClass = bold ? 'font-bold' : 'font-semibold';

  if (gradient) {
    return (
      <span className={`${sizeClass} ${fontClass} text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600`}>
        {formatCLP(value)}
      </span>
    );
  }

  return (
    <span className={`${sizeClass} ${fontClass} text-gray-900`}>
      {formatCLP(value)}
    </span>
  );
}
