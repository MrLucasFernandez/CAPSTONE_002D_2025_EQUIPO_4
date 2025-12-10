import type { Categoria, Marca, Bodega } from "@models/product";

interface ProductsFiltersPanelProps {
    searchNombre: string;
    filterCategoria: number | "";
    filterMarca: number | "";
    filterEstado: string;
    filterBodega: number | "";
    sortById: "ASC" | "DESC";
    categories: Categoria[];
    brands: Marca[];
    warehouses: Bodega[];
    filteredCount: number;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onSearchNombreChange: (value: string) => void;
    onFilterCategoriaChange: (value: number | "") => void;
    onFilterMarcaChange: (value: number | "") => void;
    onFilterEstadoChange: (value: string) => void;
    onFilterBodegaChange: (value: number | "") => void;
    onSortByIdChange: (value: "ASC" | "DESC") => void;
    onClearFilters: () => void;
}

export function ProductsFiltersPanel({
    searchNombre,
    filterCategoria,
    filterMarca,
    filterEstado,
    filterBodega,
    sortById,
    categories,
    brands,
    warehouses,
    filteredCount,
    totalCount,
    currentPage,
    totalPages,
    itemsPerPage,
    onSearchNombreChange,
    onFilterCategoriaChange,
    onFilterMarcaChange,
    onFilterEstadoChange,
    onFilterBodegaChange,
    onSortByIdChange,
    onClearFilters,
}: ProductsFiltersPanelProps) {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por nombre
                    </label>
                    <input
                        type="text"
                        value={searchNombre}
                        onChange={(e) => onSearchNombreChange(e.target.value)}
                        placeholder="Nombre del producto..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                    </label>
                    <select
                        value={filterCategoria}
                        onChange={(e) => onFilterCategoriaChange(e.target.value ? Number(e.target.value) : "")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todas</option>
                        {categories.map((cat) => (
                            <option key={cat.idCategoria} value={cat.idCategoria}>
                                {cat.nombreCategoria}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marca
                    </label>
                    <select
                        value={filterMarca}
                        onChange={(e) => onFilterMarcaChange(e.target.value ? Number(e.target.value) : "")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todas</option>
                        {brands.map((marca) => (
                            <option key={marca.idMarca} value={marca.idMarca}>
                                {marca.nombreMarca}
                            </option>
                        ))}
                    </select>
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
                        <option value="all">Todos</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bodega
                    </label>
                    <select
                        value={filterBodega}
                        onChange={(e) => onFilterBodegaChange(e.target.value ? Number(e.target.value) : "")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todas</option>
                        {warehouses.map((bodega) => (
                            <option key={bodega.idBodega} value={bodega.idBodega}>
                                {bodega.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ordenar por ID
                    </label>
                    <select
                        value={sortById}
                        onChange={(e) => onSortByIdChange(e.target.value as "ASC" | "DESC")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="DESC">Mayor a menor</option>
                        <option value="ASC">Menor a mayor</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                Mostrando <span className="font-semibold">{filteredCount}</span> de{" "}
                <span className="font-semibold">{totalCount}</span> productos
                {filteredCount > itemsPerPage && (
                    <span> - Página {currentPage} de {totalPages}</span>
                )}
            </div>
        </div>
    );
}
