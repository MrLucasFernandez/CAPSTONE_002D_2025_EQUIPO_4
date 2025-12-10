interface UsersFiltersBarProps {
    queryName: string;
    filterRole: string;
    sortAsc: boolean | null;
    availableRoles: string[];
    filteredCount: number;
    totalCount: number;
    onQueryNameChange: (value: string) => void;
    onFilterRoleChange: (value: string) => void;
    onSortChange: (sort: boolean | null) => void;
    onClearFilters: () => void;
}

export function UsersFiltersBar({
    queryName,
    filterRole,
    sortAsc,
    availableRoles,
    filteredCount,
    totalCount,
    onQueryNameChange,
    onFilterRoleChange,
    onSortChange,
    onClearFilters,
}: UsersFiltersBarProps) {
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
                        Buscar por nombre
                    </label>
                    <input
                        type="text"
                        value={queryName}
                        onChange={(e) => onQueryNameChange(e.target.value)}
                        placeholder="Nombre del usuario..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                    </label>
                    <select
                        value={filterRole}
                        onChange={(e) => onFilterRoleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos</option>
                        {availableRoles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ordenar por ID
                    </label>
                    <select
                        value={sortAsc === true ? "ASC" : sortAsc === false ? "DESC" : ""}
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
                <span className="font-semibold">{totalCount}</span> usuarios
            </div>
        </div>
    );
}
