// src/modules/admin/products/hooks/useAdminProducts.ts
import { useEffect, useState, useCallback } from "react";

import {
    getAllAdminProducts,
    getAdminProductById,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    fetchWarehouses, // 🔥 NUEVO — DEBES CREAR ESTE SERVICIO
} from "../api/adminProductsService";
import { fetchCategories } from "@admin/categories/api/categoryService";
import { fetchBrands } from "@admin/brands/api/brandService";

import type { Producto, Categoria, Marca, Bodega } from "@models/product";

export function useAdminProducts() {
    const [products, setProducts] = useState<Producto[]>([]);
    const [product, setProduct] = useState<Producto | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // -----------------------------
    // NUEVOS ESTADOS
    // -----------------------------
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [brands, setBrands] = useState<Marca[]>([]);
    const [warehouses, setWarehouses] = useState<Bodega[]>([]); // 🔥 AGREGADO

    // ----------------------------------------------------------
    // 1. Obtener productos + cat + marcas + bodegas
    // ----------------------------------------------------------
    const fetchProducts = useCallback(async () => {
        setError(null);
        try {
            setIsLoading(true);

            const [productData, categoriesData, brandsData, warehousesData] =
                await Promise.all([
                    getAllAdminProducts(),
                    fetchCategories(),
                    fetchBrands(),
                    fetchWarehouses(), // 🔥 NUEVO
                ]);

            const enriched = productData.map((p) => ({
                ...p,
                categoria:
                    categoriesData.find((c) => c.idCategoria === p.idCategoria) ||
                    null,
                marca:
                    brandsData.find((m) => m.idMarca === p.idMarca) ||
                    null,
                bodega:
                    warehousesData.find((b) => b.idBodega === p.idBodega) ||
                    null, // 🔥 NUEVO
            }));

            setProducts(enriched);
            setCategories(categoriesData);
            setBrands(brandsData);
            setWarehouses(warehousesData); // 🔥 NUEVO
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
    // 2. Producto por ID
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
            const created = await createAdminProduct(formData);

            const enrichedCreated = {
                ...created,
                categoria: categories.find((c) => c.idCategoria === created.idCategoria) || null,
                marca: brands.find((m) => m.idMarca === created.idMarca) || null,
                bodega: warehouses.find((b) => b.idBodega === created.idBodega) || null,
            };

            setProducts((prev) => [enrichedCreated, ...prev]);
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, [categories, brands, warehouses]);

    // ----------------------------------------------------------
    // 4. EDITAR
    // ----------------------------------------------------------
    const updateProduct = useCallback(
        async (idProducto: number, formData: FormData) => {
            setError(null);
            try {
                setIsLoading(true);

                formData.set("idProducto", idProducto.toString());

                const updated = await updateAdminProduct(idProducto, formData);

                const enrichedUpdated = {
                    ...updated,
                    categoria: categories.find((c) => c.idCategoria === updated.idCategoria) || null,
                    marca: brands.find((m) => m.idMarca === updated.idMarca) || null,
                    bodega: warehouses.find((b) => b.idBodega === updated.idBodega) || null, // 🔥 NUEVO
                };

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
        },
        [categories, brands, warehouses]
    );

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

        categories,
        brands,
        warehouses, // 🔥 AGREGADO PARA QUE EL FORM LO USE

        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}
