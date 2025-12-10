interface PagosFiltersPanelProps {
    searchQuery: string;
    filterEstado: string;
    filterMetodo: string;
    sortById: boolean | null;
    filteredCount: number;
    totalCount: number;
    onSearchChange: (value: string) => void;
    onFilterEstadoChange: (value: string) => void;
    onFilterMetodoChange: (value: string) => void;
    onSortChange: (sort: boolean | null) => void;
    onClearFilters: () => void;
}

export function PagosFiltersPanel({
    searchQuery,
    filterEstado,
    filterMetodo,
    sortById,
    filteredCount,
    totalCount,
    onSearchChange,
    onFilterEstadoChange,
    onFilterMetodoChange,
    onSortChange,
    onClearFilters,
}: PagosFiltersPanelProps) {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="ID, estado, monto..."
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
                        <option value="COMPLETADO">Completado</option>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="RECHAZADO">Rechazado</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Pago
                    </label>
                    <select
                        value={filterMetodo}
                        onChange={(e) => onFilterMetodoChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos</option>
                        <option value="TARJETA">Tarjeta de Crédito</option>
                        <option value="TRANSFERENCIA">Transferencia</option>
                        <option value="PAYPAL">PayPal</option>
                        <option value="MERCADOPAGO">MercadoPago</option>
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
                <span className="font-semibold">{totalCount}</span> pagos
            </div>
        </div>
    );
}
