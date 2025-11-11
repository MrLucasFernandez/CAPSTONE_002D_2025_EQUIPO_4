import { useState, useEffect, useCallback } from 'react';
import { getAllProducts, deleteProduct } from '../../../api/productService'; // <-- Usamos el nuevo servicio
import type { Producto } from '../../../types/product'; 

interface UseProductsResult {
    products: Producto[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void; // Función para recargar la lista
    deleteProduct: (id: number) => Promise<void>; // Función para borrar
}

export const useAdminProducts = (): UseProductsResult => {
    const [products, setProducts] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Función para obtener los datos
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 🚨 Llamada al API centralizada (incluye el token automáticamente)
            const data = await getAllProducts(); 
            setProducts(data);
        } catch (err) {
            console.error("Error al obtener productos:", err);
            setError(err instanceof Error ? err : new Error("Error desconocido al cargar productos."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Función para manejar la eliminación
    const handleDeleteProduct = useCallback(async (id: number) => {
        try {
            await deleteProduct(id);
            // Si la eliminación es exitosa, recargamos la lista
            fetchProducts(); 
        } catch (err) {
            console.error("Fallo al eliminar producto:", err);
            // Relanzar o manejar el error de eliminación
            throw err; 
        }
    }, [fetchProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        isLoading,
        error,
        refetch: fetchProducts,
        deleteProduct: handleDeleteProduct,
    };
};