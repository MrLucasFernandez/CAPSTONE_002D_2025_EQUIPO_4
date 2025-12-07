import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

import { useAdminProducts } from "../hooks/useAdminProducts";
import ProductTable from "../components/ProductTable";
import Modal from "@components/ui/Modal";
import Toast from "@components/ui/Toast";
import type { Producto } from "@models/product";

export default function ProductsListPage() {
    const navigate = useNavigate();

    const { products, isLoading, error, deleteProduct, categories, brands, warehouses } = useAdminProducts();

    // ----------------------------------------------------
    // Estados de filtros
    // ----------------------------------------------------
    const [searchNombre, setSearchNombre] = useState("");
    const [filterCategoria, setFilterCategoria] = useState<number | "">("");
    const [filterMarca, setFilterMarca] = useState<number | "">("");
    const [filterEstado, setFilterEstado] = useState<string>("all"); // "all", "active", "inactive"
    const [filterBodega, setFilterBodega] = useState<number | "">("");
    const [sortById, setSortById] = useState<"ASC" | "DESC">("DESC");

    // ----------------------------------------------------
    // Estados de paginación
    // ----------------------------------------------------
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ----------------------------------------------------
    // Estado del modal genérico
    // ----------------------------------------------------
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
    const [deleteMessage, setDeleteMessage] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [showDeleteToast, setShowDeleteToast] = useState(false);

    // Abrir modal
    const openDeleteModal = (product: Producto) => {
        setSelectedProduct(product);
        setDeleteModalOpen(true);
    };

    // Confirmar eliminación
    const confirmDelete = async () => {
        if (!selectedProduct) return;

        try {
            await deleteProduct(selectedProduct.idProducto);
            setDeleteMessage({
                message: "Producto eliminado correctamente.",
                type: "success",
            });
            setShowDeleteToast(true);
        } catch (err) {
            setDeleteMessage({
                message: "Error: " + (err as Error).message,
                type: "error",
            });
            setShowDeleteToast(true);
        }
    };

    // ----------------------------------------------------
    // Lógica de filtrado
    // ----------------------------------------------------
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Filtrar por nombre (búsqueda parcial)
        if (searchNombre.trim()) {
            filtered = filtered.filter((p) =>
                p.nombreProducto.toLowerCase().includes(searchNombre.toLowerCase())
            );
        }

        // Filtrar por categoría
        if (filterCategoria !== "") {
            filtered = filtered.filter((p) => p.idCategoria === filterCategoria);
        }

        // Filtrar por marca
        if (filterMarca !== "") {
            filtered = filtered.filter((p) => p.idMarca === filterMarca);
        }

        // Filtrar por estado
        if (filterEstado === "active") {
            filtered = filtered.filter((p) => p.productoActivo === true);
        } else if (filterEstado === "inactive") {
            filtered = filtered.filter((p) => p.productoActivo === false);
        }

        // Filtrar por bodega
        if (filterBodega !== "") {
            filtered = filtered.filter((p) => {
                if (p.stock && p.stock.length > 0) {
                    const ultimoStock = p.stock[p.stock.length - 1];
                    return ultimoStock.bodega?.idBodega === filterBodega;
                }
                return false;
            });
        }

        // Ordenar por ID
        filtered.sort((a, b) => {
            if (sortById === "ASC") {
                return a.idProducto - b.idProducto;
            } else {
                return b.idProducto - a.idProducto;
            }
        });

        return filtered;
    }, [products, searchNombre, filterCategoria, filterMarca, filterEstado, filterBodega, sortById]);

    // ----------------------------------------------------
    // Lógica de paginación
    // ----------------------------------------------------
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Resetear a la primera página cuando cambien los filtros
    useMemo(() => {
        setCurrentPage(1);
    }, [searchNombre, filterCategoria, filterMarca, filterEstado, filterBodega, sortById]);

    // ----------------------------------------------------
    // Función para limpiar todos los filtros
    // ----------------------------------------------------
    const clearFilters = () => {
        setSearchNombre("");
        setFilterCategoria("");
        setFilterMarca("");
        setFilterEstado("all");
        setFilterBodega("");
        setSortById("DESC");
        setCurrentPage(1);
    };

    // ----------------------------------------------------
    // Loading / Error
    // ----------------------------------------------------
    if (isLoading) return <p className="p-6">Cargando productos...</p>;
    if (error) return <p className="text-red-600 p-6">Error: {error}</p>;

    // ----------------------------------------------------
    // Render principal
    // ----------------------------------------------------
    return (
        <div className="p-6">
        
        {showDeleteToast && deleteMessage && (
            <Toast
                message={deleteMessage.message}
                type={deleteMessage.type}
                onClose={() => setShowDeleteToast(false)}
                duration={deleteMessage.type === "success" ? 2000 : 4000}
            />
        )}
        
        {/* HEADER */}
        <div className="flex justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Productos</h1>

            <button
            onClick={() => navigate("/admin/productos/crear")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
            + Crear Producto
            </button>
        </div>

        {/* PANEL DE FILTROS */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Filtros</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Búsqueda por nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por nombre
                    </label>
                    <input
                        type="text"
                        value={searchNombre}
                        onChange={(e) => setSearchNombre(e.target.value)}
                        placeholder="Nombre del producto..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Filtro por categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                    </label>
                    <select
                        value={filterCategoria}
                        onChange={(e) => setFilterCategoria(e.target.value ? Number(e.target.value) : "")}
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

                {/* Filtro por marca */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marca
                    </label>
                    <select
                        value={filterMarca}
                        onChange={(e) => setFilterMarca(e.target.value ? Number(e.target.value) : "")}
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

                {/* Filtro por estado */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                    </label>
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>

                {/* Filtro por bodega */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bodega
                    </label>
                    <select
                        value={filterBodega}
                        onChange={(e) => setFilterBodega(e.target.value ? Number(e.target.value) : "")}
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

                {/* Ordenar por ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ordenar por ID
                    </label>
                    <select
                        value={sortById}
                        onChange={(e) => setSortById(e.target.value as "ASC" | "DESC")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="DESC">Mayor a menor</option>
                        <option value="ASC">Menor a mayor</option>
                    </select>
                </div>
            </div>

            {/* Contador de resultados */}
            <div className="mt-4 text-sm text-gray-600">
                Mostrando <span className="font-semibold">{filteredProducts.length}</span> de{" "}
                <span className="font-semibold">{products.length}</span> productos
                {filteredProducts.length > itemsPerPage && (
                    <span> - Página {currentPage} de {totalPages}</span>
                )}
            </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <ProductTable
            products={paginatedProducts}
            onEdit={(id) => navigate(`/admin/productos/editar/${id}`)}
            onDelete={(id) => {
            const product = products.find((p) => p.idProducto === id);
            if (product) openDeleteModal(product);
            }}
        />

        {/* PAGINACIÓN */}
        {filteredProducts.length > itemsPerPage && (
            <div className="mt-6 flex justify-center items-center gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    Anterior
                </button>

                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Mostrar siempre primera página, última página y páginas cercanas a la actual
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded-lg font-medium ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                        ) {
                            return <span key={page} className="px-2 py-2 text-gray-500">...</span>;
                        }
                        return null;
                    })}
                </div>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        currentPage === totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    Siguiente
                </button>
            </div>
        )}

        {/* MODAL GENÉRICO DE CONFIRMACIÓN */}
        <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Eliminar producto"
            width="max-w-md"
        >
            <p className="text-gray-700">
            ¿Estás seguro que deseas eliminar{" "}
            <span className="font-semibold">{selectedProduct?.nombreProducto}</span>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
            <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
                Cancelar
            </button>

            <button
                onClick={() => {
                confirmDelete();
                setDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Eliminar
            </button>
            </div>
        </Modal>

        </div>
    );
}