// src/modules/admin/products/api/adminProductsService.ts
import type { Producto, Bodega } from "@models/product";

const BASE_URL = import.meta.env.VITE_API_URL;

// ============================================================
// 🔵 Helper Fetch — Compatible con FormData + JSON
// ============================================================
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Si el body es un objeto plano (no FormData), serializar a JSON y establecer headers
    const headers: Record<string, string> = {};
    const body = (options as any).body;
    if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        try {
            (options as any).body = JSON.stringify(body);
        } catch (e) {
            // ignore stringify errors
        }
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
        headers,
        ...options,
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // Respuesta vacía permitida
    }

    if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}`);
    }

    return data;
}

// ============================================================
// 🔵 Productos — GET All
// ============================================================
export async function getAllAdminProducts(): Promise<Producto[]> {
    return apiRequest("/productos");
}

// ============================================================
// 🔵 Productos — GET by ID
// ============================================================
export async function getAdminProductById(id: number): Promise<Producto> {
    return apiRequest(`/productos/${id}`);
}

// ============================================================
// 🔵 Crear producto — POST /productos
//     • Se envía FormData (incluye imagen)
// ============================================================
export async function createAdminProduct(formData: FormData | Record<string, any>): Promise<Producto> {
    return apiRequest("/productos", {
        method: "POST",
        body: formData as any,
    });
}

// ============================================================
// 🔵 Actualizar producto — PUT /productos/:id
// ============================================================
export async function updateAdminProduct(id: number, formData: FormData | Record<string, any>): Promise<Producto> {
    return apiRequest(`/productos/${id}`, {
        method: "PUT",
        body: formData as any,
    });
}

// ============================================================
// 🔵 Eliminar producto — DELETE /productos/:id
// ============================================================
export async function deleteAdminProduct(id: number): Promise<{ message: string }> {
    return apiRequest(`/productos/${id}`, {
        method: "DELETE",
    });
}

// ============================================================
// 🔵 Bodegas — GET (Solo si las necesitas para stock)
// ============================================================
export async function fetchWarehouses(): Promise<Bodega[]> {
    return apiRequest("/bodegas");
}
