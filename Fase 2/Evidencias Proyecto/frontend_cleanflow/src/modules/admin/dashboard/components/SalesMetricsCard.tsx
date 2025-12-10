import type { ReactNode } from 'react';

interface SalesMetricsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    percentage: number;
    isPositive: boolean;
  };
  color: 'rose' | 'amber' | 'green' | 'sky' | 'purple' | 'blue' | 'indigo';
}

const colorMap = {
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
  },
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    border: 'border-sky-200',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
  },
};

const SalesMetricsCard = ({
  title,
  value,
  icon,
  trend,
  color,
}: SalesMetricsCardProps) => {
  const colors = colorMap[color];

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-6`}>
      {/* Background gradient accent */}
      <div className={`absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 ${colors.bg} rounded-full opacity-40`}></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`mt-3 text-3xl font-bold ${colors.text}`}>{value}</p>

            {trend && (
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    trend.isPositive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span>{trend.isPositive ? '↑' : '↓'}</span>
                  {Math.abs(trend.percentage)}%
                </span>
                <span className="text-xs text-gray-500">vs último período</span>
              </div>
            )}
          </div>

          <div className={`p-3 ${colors.bg} rounded-full`}>
            <div className={colors.text}>{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesMetricsCard;
