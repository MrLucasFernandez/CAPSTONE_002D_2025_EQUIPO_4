import React from "react";

interface AdminTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export function AdminTextarea({ label, error, ...props }: AdminTextareaProps) {
    return (
        <div className="space-y-2">
        <label className="font-medium text-gray-700">{label}</label>

        <textarea
            className={`w-full rounded-xl border p-3 bg-white text-gray-800 outline-none transition
            focus:ring-2 focus:ring-primary
            ${error ? "border-red-500" : "border-gray-300"}`}
            {...props}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
