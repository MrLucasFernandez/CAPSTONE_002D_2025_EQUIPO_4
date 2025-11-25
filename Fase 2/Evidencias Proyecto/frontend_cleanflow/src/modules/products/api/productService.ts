// src/modules/products/api/productService.ts

import { apiRequest } from '../../../api/apiClient';
import type { Producto, Categoria, Marca } from '@models/product';

/**
 * 🔵 Obtiene todos los productos ACTIVOS para la vista pública
 * GET /productos?activo=true
 */
export function getPublicProducts(): Promise<Producto[]> {
    return apiRequest<Producto[]>('/productos?activo=true');
}

/**
 * 🔵 Obtiene productos filtrados por categoría
 * GET /productos?categoria=ID
 */
export function getProductsByCategory(idCategoria: number): Promise<Producto[]> {
    return apiRequest<Producto[]>(`/productos?categoria=${idCategoria}`);
}

/**
 * 🔵 Obtiene un producto específico por ID
 * GET /productos/:id
 */
export function getProductById(id: number): Promise<Producto> {
    return apiRequest<Producto>(`/productos/${id}`);
}

/**
 * 🔵 Buscador público de productos
 * GET /productos?search=query
 */
export function searchProducts(query: string): Promise<Producto[]> {
    return apiRequest<Producto[]>(`/productos?search=${query}`);
}

/**
 * 🔵 Categorías públicas (no requiere autenticación)
 */
export function getPublicCategorias(): Promise<Categoria[]> {
    return apiRequest<Categoria[]>('/categorias');
}

/**
 * 🔵 Marcas públicas (opcional)
 */
export function getPublicMarcas(): Promise<Marca[]> {
    return apiRequest<Marca[]>('/marcas');
}
export async function getCategoryById(id: number) {
    const res = await fetch(
        `https://cleanflow-back-v0-1.onrender.com/categorias/${id}`
    );
    return res.json();
}