interface BoletasFiltersPanelProps {
    searchQuery: string;
    filterEstado: string;
    sortById: boolean | null;
    filteredCount: number;
    totalCount: number;
    onSearchChange: (value: string) => void;
    onFilterEstadoChange: (value: string) => void;
    onSortChange: (sort: boolean | null) => void;
    onClearFilters: () => void;
}

export function BoletasFiltersPanel({
    searchQuery,
    filterEstado,
    sortById,
    filteredCount,
    totalCount,
    onSearchChange,
    onFilterEstadoChange,
    onSortChange,
    onClearFilters,
}: BoletasFiltersPanelProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Filtros</h2>
                <button
                    onClick={onClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por ID, estado o fecha
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Ej: 123, PAGADA o 2025-01-01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                    </label>
                    <select
                        value={filterEstado}
                        onChange={(e) => onFilterEstadoChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos</option>
                        <option value="PAGADA">Pagada</option>
                        <option value="RECHAZADA">Rechazada</option>
                        <option value="ANULADA">Anulada</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ordenar por ID
                    </label>
                    <select
                        value={sortById === true ? "ASC" : sortById === false ? "DESC" : ""}
                        onChange={(e) => {
                            if (e.target.value === "ASC") onSortChange(true);
                            else if (e.target.value === "DESC") onSortChange(false);
                            else onSortChange(null);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Sin orden</option>
                        <option value="DESC">Mayor a menor</option>
                        <option value="ASC">Menor a mayor</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                Mostrando <span className="font-semibold">{filteredCount}</span> de{" "}
                <span className="font-semibold">{totalCount}</span> boletas
            </div>
        </div>
    );
}
