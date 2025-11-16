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
        try {
            setIsLoading(true);
            const data = await getAdminProductById(idProducto);
            setProduct(data);
            return data; // 👈 importante, evita el error TS1345
        } catch (err) {
            setError((err as Error).message);
            throw err; // importante para que el caller pueda manejar error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ----------------------------------------------------------
    // 3. CREAR — recibe FormData
    // ----------------------------------------------------------
    const createProduct = useCallback(async (formData: FormData) => {
        try {
            setIsLoading(true);
            const newProduct = await createAdminProduct(formData);
            setProducts((prev) => [...prev, newProduct]);
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ----------------------------------------------------------
    // 4. EDITAR — recibe FormData
    // ----------------------------------------------------------
    const updateProduct = useCallback(async (idProducto: number, formData: FormData) => {
        try {
            setIsLoading(true);
            const updated = await updateAdminProduct(idProducto, formData);

            setProducts((prev) =>
                prev.map((p) => (p.idProducto === idProducto ? updated : p))
            );

            setProduct(updated);
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ----------------------------------------------------------
    // 5. ELIMINAR
    // ----------------------------------------------------------
    const deleteProduct = useCallback(async (idProducto: number) => {
        try {
            setIsLoading(true);
            await deleteAdminProduct(idProducto);
            setProducts((prev) => prev.filter((p) => p.idProducto !== idProducto));
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        products,
        product,
        isLoading,
        error,

        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}
