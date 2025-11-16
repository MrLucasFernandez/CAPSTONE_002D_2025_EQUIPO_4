// src/modules/admin/products/hooks/useAdminProducts.ts
import { useEffect, useState, useCallback } from "react";

import {
    getAllAdminProducts,
    getAdminProductById,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
} from "../api/adminProductsService";

import type { Producto } from "../../../../types/product";

export function useAdminProducts() {
    const [products, setProducts] = useState<Producto[]>([]);
    const [product, setProduct] = useState<Producto | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // ----------------------------------------------------------
    // 1. Cargar todos los productos
    // ----------------------------------------------------------
    const fetchProducts = useCallback(async () => {
        setError(null); // Limpiar error antes de iniciar
        try {
            setIsLoading(true);
            const data = await getAllAdminProducts();
            setProducts(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // ----------------------------------------------------------
    // 2. Obtener un producto por ID (RETORNA Producto)
    // ----------------------------------------------------------
    const fetchProductById = useCallback(async (idProducto: number): Promise<Producto> => {
        setError(null); // Limpiar error antes de iniciar
        try {
            setIsLoading(true);
            const data = await getAdminProductById(idProducto);
            setProduct(data);
            return data;
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            throw new Error(message); // Re-lanzar para que el llamador pueda usar catch/finally
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ----------------------------------------------------------
    // 3. CREAR — recibe FormData
    // ----------------------------------------------------------
    const createProduct = useCallback(async (formData: FormData) => {
        setError(null); // Limpiar error antes de iniciar
        try {
            setIsLoading(true);
            const newProduct = await createAdminProduct(formData);
            // Agregamos el nuevo producto al inicio del array para que aparezca primero
            setProducts((prev) => [newProduct, ...prev]); 
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ----------------------------------------------------------
    // 4. EDITAR — recibe id y FormData
    // ----------------------------------------------------------
    const updateProduct = useCallback(async (idProducto: number, formData: FormData) => {
        setError(null); // Limpiar error antes de iniciar
        try {
            setIsLoading(true);
            const updated = await updateAdminProduct(idProducto, formData);

            setProducts((prev) =>
                prev.map((p) => (p.idProducto === idProducto ? updated : p))
            );

            // Si estamos viendo o editando este producto, actualizamos el estado 'product'
            setProduct(updated);
            return updated; // Retornar el producto actualizado
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ----------------------------------------------------------
    // 5. ELIMINAR
    // ----------------------------------------------------------
    const deleteProduct = useCallback(async (idProducto: number) => {
        setError(null); // Limpiar error antes de iniciar
        try {
            setIsLoading(true);
            await deleteAdminProduct(idProducto);
            // Filtramos el producto eliminado del estado
            setProducts((prev) => prev.filter((p) => p.idProducto !== idProducto));
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        products,
        product,
        isLoading,
        error,
        setError, // Exportar setError por si un componente externo necesita resetearlo

        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}