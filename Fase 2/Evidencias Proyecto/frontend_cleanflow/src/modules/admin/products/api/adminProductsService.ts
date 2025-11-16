// src/modules/admin/products/api/adminProductsService.ts

import type { Producto, Categoria, Marca } from "../../../../types/product";

const BASE_URL = import.meta.env.VITE_API_URL;

// -------------------------------------------------------------
// Helper genérico
// -------------------------------------------------------------
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include", // Necesario para cookies HttpOnly
        ...options,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Error ${res.status}`);
    }

    return res.json();
}

// -------------------------------------------------------------
// 🔹 Obtener Categorías (TIPADO CORRECTO)
// -------------------------------------------------------------
export async function fetchCategories(): Promise<Categoria[]> {
    return apiRequest<Categoria[]>("/categorias");
}

// -------------------------------------------------------------
// 🔹 Obtener Marcas (TIPADO CORRECTO)
// -------------------------------------------------------------
export async function fetchBrands(): Promise<Marca[]> {
    return apiRequest<Marca[]>("/marcas");
}

// -------------------------------------------------------------
// 🔹 Obtener todos los productos
// -------------------------------------------------------------
export async function getAllAdminProducts(): Promise<Producto[]> {
    return apiRequest<Producto[]>("/productos");
}

// -------------------------------------------------------------
// 🔹 Obtener producto por ID
// -------------------------------------------------------------
export async function getAdminProductById(idProducto: number): Promise<Producto> {
    return apiRequest<Producto>(`/productos/${idProducto}`);
}

// -------------------------------------------------------------
// 🔹 Crear producto con FormData
// -------------------------------------------------------------
export async function createAdminProduct(formData: FormData): Promise<Producto> {
    return apiRequest<Producto>("/productos", {
        method: "POST",
        body: formData,
    });
}

// -------------------------------------------------------------
// 🔹 Editar producto con FormData
// -------------------------------------------------------------
export async function updateAdminProduct(
    idProducto: number,
    formData: FormData
): Promise<Producto> {
    return apiRequest<Producto>(`/productos/${idProducto}`, {
        method: "PUT",
        body: formData,
    });
}

// -------------------------------------------------------------
// 🔹 Eliminar producto
// -------------------------------------------------------------
export async function deleteAdminProduct(
    idProducto: number
): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/productos/${idProducto}`, {
        method: "DELETE",
    });
}

// -------------------------------------------------------------
// 🔹 Subir imagen (Cloudinary o tu backend)
// -------------------------------------------------------------
export async function uploadProductImage(
    file: File
): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append("image", file);

    return apiRequest<{ url: string; publicId: string }>("/productos/upload-image", {
        method: "POST",
        body: formData,
    });
}
