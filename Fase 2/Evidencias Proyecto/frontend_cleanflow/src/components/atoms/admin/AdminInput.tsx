interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function AdminInput({ label, error, ...props }: AdminInputProps) {
    return (
        <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>

        <input
            {...props}
            className="
            w-full px-3.5 py-2.5 
            bg-gray-50 
            border border-gray-200 
            rounded-xl 
            text-gray-900
            focus:outline-none 
            focus:ring-4 
            focus:ring-blue-100 
            focus:border-blue-500
            transition-all
            "
        />

        {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
