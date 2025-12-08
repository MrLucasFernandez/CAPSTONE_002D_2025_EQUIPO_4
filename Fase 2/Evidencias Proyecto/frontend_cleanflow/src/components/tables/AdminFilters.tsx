interface FilterItem {
    key: string;
    label: string;
    type: "text" | "select";
    placeholder?: string;
    options?: { value: string; label: string }[];
}

interface AdminFiltersProps {
    filters: FilterItem[];
    values: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
    onClear: () => void;
    itemCount: number;
    totalCount: number;
    currentPage?: number;
    totalPages?: number;
}

export default function AdminFilters({
    filters,
    values,
    onFilterChange,
    onClear,
    itemCount,
    totalCount,
    currentPage,
    totalPages,
}: AdminFiltersProps) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🔍 Filtros
                </h2>
                <button
                    onClick={onClear}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-all ring-1 ring-transparent hover:ring-blue-200"
                >
                    ↻ Limpiar filtros
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filters.map((filter) => (
                    <div key={filter.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {filter.label}
                        </label>
                        {filter.type === "text" ? (
                            <input
                                type="text"
                                value={values[filter.key] || ""}
                                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                                placeholder={filter.placeholder}
                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                            />
                        ) : (
                            <select
                                value={values[filter.key] || ""}
                                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                            >
                                {filter.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-5 flex items-center justify-between bg-blue-50/50 rounded-md px-4 py-3 border border-blue-100">
                <div className="text-sm text-gray-600">
                    Mostrando <span className="font-semibold text-gray-800">{itemCount}</span> de{" "}
                    <span className="font-semibold text-gray-800">{totalCount}</span> elementos
                    {currentPage && totalPages && (
                        <span className="ml-2 text-gray-500">
                            • Página <span className="font-semibold text-gray-800">{currentPage}</span> de{" "}
                            <span className="font-semibold text-gray-800">{totalPages}</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
