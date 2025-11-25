import React from "react";

interface Option {
    label: string;
    value: any;
}

interface AdminSelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
    error?: string;
}

export function AdminSelect({ label, options, error, ...props }: AdminSelectProps) {
    return (
        <div className="space-y-2">
        <label className="font-medium text-gray-700">{label}</label>

        <select
            className={`w-full rounded-xl border p-3 bg-white text-gray-800 outline-none transition
            focus:ring-2 focus:ring-primary
            ${error ? "border-red-500" : "border-gray-300"}`}
            {...props}
        >
            <option value="">Seleccione...</option>

            {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
            ))}
        </select>

        {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
