import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import { useAdminProducts } from "../hooks/useAdminProducts";
import ProductTable from "../components/organisms/ProductTable";
import { ProductsHeader } from "../components/organisms/ProductsHeader";
import { ProductsFiltersPanel } from "../components/organisms/ProductsFiltersPanel";
import { BulkActionsBar } from "../components/molecules/BulkActionsBar";
import { PaginationControls } from "../components/molecules/PaginationControls";
import { DeleteProductModal } from "../components/molecules/DeleteProductModal";
import Toast from "@components/ui/Toast";

export default function ProductsListPage() {
    const navigate = useNavigate();

    const { products, deleteProduct, toggleProductActive, categories, brands, warehouses } = useAdminProducts();

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
    // Estado del toast y filtros
    // ----------------------------------------------------
    const [deleteMessage, setDeleteMessage] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [showLowStockPanel, setShowLowStockPanel] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isProcessingBulk, setIsProcessingBulk] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    // Productos con stock bajo (<=5) y activos
    const lowStockProducts = useMemo(() => {
        return products.filter(product => {
            if (product.productoActivo === false) return false; // no mostrar desactivados
            if (!product.stock || product.stock.length === 0) return false;

            const totalStock = product.stock.reduce((sum, s) => sum + (s.cantidad || 0), 0);
            return totalStock > 0 && totalStock <= 5;
        });
    }, [products]);

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

    // Quitar selecciones que ya no estén visibles tras filtrados
    useEffect(() => {
        setSelectedIds((prev) => prev.filter((id) => filteredProducts.some((p) => p.idProducto === id)));
    }, [filteredProducts]);

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

    const handleToggleSelect = (idProducto: number) => {
        setSelectedIds((prev) =>
            prev.includes(idProducto)
                ? prev.filter((id) => id !== idProducto)
                : [...prev, idProducto]
        );
    };

    const handleToggleSelectAll = (checked: boolean) => {
        const currentPageIds = paginatedProducts.map((p) => p.idProducto);
        setSelectedIds((prev) => {
            if (checked) {
                return Array.from(new Set([...prev, ...currentPageIds]));
            }
            return prev.filter((id) => !currentPageIds.includes(id));
        });
    };

    const handleBulkToggleActive = async (nextActive: boolean) => {
        if (selectedIds.length === 0) return;
        setIsProcessingBulk(true);
        try {
            await Promise.all(selectedIds.map((id) => toggleProductActive(id, nextActive)));
            setDeleteMessage({
                message: nextActive ? "Productos activados" : "Productos desactivados",
                type: "success",
            });
            setSelectedIds([]);
        } catch (err) {
            setDeleteMessage({
                message: "Error: " + (err as Error).message,
                type: "error",
            });
        } finally {
            setIsProcessingBulk(false);
            setShowDeleteToast(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            await deleteProduct(selectedProduct.idProducto);
            setDeleteMessage({ message: "Producto eliminado", type: "success" });
        } catch (err) {
            setDeleteMessage({
                message: "Error: " + (err as Error).message,
                type: "error",
            });
        } finally {
            setShowDeleteToast(true);
            setDeleteModalOpen(false);
            setSelectedProduct(null);
        }
    };
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

        <ProductsHeader
            lowStockProducts={lowStockProducts}
            showLowStockPanel={showLowStockPanel}
            onToggleLowStockPanel={() => setShowLowStockPanel((v) => !v)}
            onCloseLowStockPanel={() => setShowLowStockPanel(false)}
            onCreate={() => navigate("/admin/productos/crear")}
        />

        <ProductsFiltersPanel
            searchNombre={searchNombre}
            filterCategoria={filterCategoria}
            filterMarca={filterMarca}
            filterEstado={filterEstado}
            filterBodega={filterBodega}
            sortById={sortById}
            categories={categories}
            brands={brands}
            warehouses={warehouses}
            filteredCount={filteredProducts.length}
            totalCount={products.length}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onSearchNombreChange={setSearchNombre}
            onFilterCategoriaChange={setFilterCategoria}
            onFilterMarcaChange={setFilterMarca}
            onFilterEstadoChange={setFilterEstado}
            onFilterBodegaChange={setFilterBodega}
            onSortByIdChange={setSortById}
            onClearFilters={clearFilters}
        />

        {/* TABLA DE PRODUCTOS */}
        <BulkActionsBar
            selectedCount={selectedIds.length}
            isProcessing={isProcessingBulk}
            onActivateAll={() => handleBulkToggleActive(true)}
            onDeactivateAll={() => handleBulkToggleActive(false)}
        />

        <ProductTable
            products={paginatedProducts}
            onEdit={(id) => navigate(`/admin/productos/editar/${id}`)}
            onDelete={(id) => {
                const product = products.find((p) => p.idProducto === id);
                if (product) {
                    // Cambiar a desactivar en lugar de eliminar
                    toggleProductActive(id, false);
                }
            }}
            onToggleActive={toggleProductActive}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
        />

        {/* PAGINACIÓN */}
        <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onSelectPage={setCurrentPage}
        />

        <DeleteProductModal
            isOpen={isDeleteModalOpen}
            productName={selectedProduct?.nombreProducto}
            onCancel={() => setDeleteModalOpen(false)}
            onConfirm={() => {
                confirmDelete();
                setDeleteModalOpen(false);
            }}
        />

        </div>
    );
}