import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAdminProducts } from "../hooks/useAdminProducts";
import ProductTable from "../components/ProductTable";
import Modal from "../../../../components/ui/Modal"; 
import type { Producto } from "../../../../types/product";

export default function ProductsListPage() {
    const navigate = useNavigate();

    const { products, isLoading, error, deleteProduct } = useAdminProducts();

    // ----------------------------------------------------
    // Estado del modal genérico
    // ----------------------------------------------------
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

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
        alert("Producto eliminado correctamente.");
        } catch (err) {
        alert("Error: " + (err as Error).message);
        }
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

        {/* TABLA DE PRODUCTOS */}
        <ProductTable
            products={products}
            onEdit={(id) => navigate(`/admin/productos/editar/${id}`)}
            onDelete={(id) => {
            const product = products.find((p) => p.idProducto === id);
            if (product) openDeleteModal(product);
            }}
        />

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
