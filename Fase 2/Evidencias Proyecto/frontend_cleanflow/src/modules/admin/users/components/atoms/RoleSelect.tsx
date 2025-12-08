interface RoleSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

export function RoleSelect({ value, onChange, options }: RoleSelectProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rol</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer appearance-none"
            >
                <option value="">Todos los roles</option>
                {options.map((role) => (
                    <option key={role} value={role}>
                        {role}
                    </option>
                ))}
            </select>
        </div>
    );
}
