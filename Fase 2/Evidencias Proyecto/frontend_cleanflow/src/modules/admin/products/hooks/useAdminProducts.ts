// src/modules/admin/products/hooks/useAdminProducts.ts
import { useEffect, useState, useCallback } from "react";

import {
    getAllAdminProducts,
    getAdminProductById,
    createAdminProduct,
    updateAdminProduct, // <-- Función de actualización utilizada
    deleteAdminProduct,
    // ********************************************
    // IMPORTACIONES AÑADIDAS para listas de referencia
    fetchCategories,
    fetchBrands,
    // ********************************************
} from "../api/adminProductsService";

// ********************************************
// IMPORTACIONES AÑADIDAS de tipos
import type { Producto, Categoria, Marca } from "../../../../types/product";
// ********************************************

export function useAdminProducts() {
    const [products, setProducts] = useState<Producto[]>([]);
    const [product, setProduct] = useState<Producto | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // ********************************************
    // ESTADOS AÑADIDOS para listas de referencia
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [brands, setBrands] = useState<Marca[]>([]);
    // ********************************************

    // ----------------------------------------------------------
    // 1. Cargar todos los productos (CON ENRIQUECIMIENTO DE RELACIONES) 🚀
    // ----------------------------------------------------------
    const fetchProducts = useCallback(async () => {
        setError(null);
        try {
            setIsLoading(true);

            // 1. Cargar datos de referencia completos
            const [productData, categoriesData, brandsData] = await Promise.all([
                getAllAdminProducts(), // Productos (solo con FKs)
                fetchCategories(),     // Lista completa de categorías
                fetchBrands(),         // Lista completa de marcas
            ]);

            // 2. Mapear y enriquecer los productos
            const enrichedProducts = productData.map(p => ({
                ...p,
                // Usamos la FK (idCategoria) para encontrar el objeto completo.
                // Si no se encuentra, se asigna null, coincidiendo con el tipo Producto | null.
                categoria: categoriesData.find(c => c.idCategoria === p.idCategoria) || null,
                marca: brandsData.find(m => m.idMarca === p.idMarca) || null,
            }));

            setProducts(enrichedProducts);
            
            // Actualizar estados de referencia
            setCategories(categoriesData);
            setBrands(brandsData);

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
    // 2. Obtener un producto por ID
    // ----------------------------------------------------------
    const fetchProductById = useCallback(async (idProducto: number): Promise<Producto> => {
        setError(null);
        try {
            setIsLoading(true);
            const data = await getAdminProductById(idProducto);
            setProduct(data);
            return data;
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ----------------------------------------------------------
    // 3. CREAR
    // ----------------------------------------------------------
    const createProduct = useCallback(async (formData: FormData) => {
        setError(null);
        try {
            setIsLoading(true);
            const newProduct = await createAdminProduct(formData);
            // Nota: Si createAdminProduct solo devuelve FKs, también deberías enriquecerlo aquí.
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
    // 4. EDITAR — recibe id y FormData (AJUSTE CRÍTICO APLICADO)
    // ----------------------------------------------------------
    const updateProduct = useCallback(async (idProducto: number, formData: FormData) => {
        setError(null);
        try {
            setIsLoading(true);

            // ********************************************
            // CRÍTICO: Aseguramos que el ID del producto esté en el FormData.
            // Algunos backends lo necesitan en el cuerpo además de la URL.
            formData.set('idProducto', idProducto.toString()); 
            // ********************************************

            const updated = await updateAdminProduct(idProducto, formData);

            // ********************************************
            // ENRIQUECER el producto actualizado antes de insertarlo en el estado 'products'
            const enrichedUpdated = {
                ...updated,
                categoria: categories.find(c => c.idCategoria === updated.idCategoria) || null,
                marca: brands.find(m => m.idMarca === updated.idMarca) || null,
            };
            // ********************************************
            
            setProducts((prev) =>
                prev.map((p) => (p.idProducto === idProducto ? enrichedUpdated : p))
            );

            setProduct(enrichedUpdated);
            return enrichedUpdated;
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, [categories, brands]); // Dependencias correctas

    // ----------------------------------------------------------
    // 5. ELIMINAR
    // ----------------------------------------------------------
    const deleteProduct = useCallback(async (idProducto: number) => {
        setError(null);
        try {
            setIsLoading(true);
            await deleteAdminProduct(idProducto);
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
        setError,
        
        // Exportar listas de referencia
        categories, 
        brands, 

        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}