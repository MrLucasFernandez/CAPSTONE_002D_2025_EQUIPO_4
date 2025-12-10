interface DetailFieldProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function DetailField({ label, value, icon }: DetailFieldProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {icon && <div className="text-gray-400 flex-shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 mt-1 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}
