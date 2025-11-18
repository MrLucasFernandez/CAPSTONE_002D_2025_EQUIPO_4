import type { Producto, Categoria, Marca, Bodega } from "../../../../types/product";

const BASE_URL = import.meta.env.VITE_API_URL;

// ============================================================
// 🔵 Helper Fetch — Compatible con FormData + JSON
// ============================================================
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
        ...options,
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // Puede venir vacío
    }

    if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}`);
    }

    return data;
}

// ============================================================
// 🔵 Categorías
// ============================================================
export async function fetchCategories(): Promise<Categoria[]> {
    return apiRequest("/categorias");
}

// ============================================================
// 🔵 Marcas
// ============================================================
export async function fetchBrands(): Promise<Marca[]> {
    return apiRequest("/marcas");
}

// ============================================================
// 🔵 Productos → GET All
// ============================================================
export async function getAllAdminProducts(): Promise<Producto[]> {
    return apiRequest("/productos");
}

// ============================================================
// 🔵 Productos → GET by ID
// ============================================================
export async function getAdminProductById(id: number): Promise<Producto> {
    return apiRequest(`/productos/${id}`);
}

// ============================================================
// 🔵 Crear producto (POST /productos)
//     • Enviar FormData directamente
//     • Backend sube imagen a Cloudinary
// ============================================================
export async function createAdminProduct(formData: FormData): Promise<Producto> {
    return apiRequest("/productos", {
        method: "POST",
        body: formData,
    });
}

// ============================================================
// 🔵 Actualizar producto (PUT / PATCH /productos/:id)
//     • También debe aceptar FormData
// ============================================================
export async function updateAdminProduct(id: number, formData: FormData): Promise<Producto> {
    return apiRequest(`/productos/${id}`, {
        method: "PUT", // CAMBIAR A PATCH si tu backend usa PATCH
        body: formData,
    });
}

// ============================================================
// 🔵 Eliminar (DELETE /productos/:id)
// ============================================================
export async function deleteAdminProduct(id: number): Promise<{ message: string }> {
    return apiRequest(`/productos/${id}`, { method: "DELETE" });
}

export async function fetchWarehouses(): Promise<Bodega[]> {
    return apiRequest("/bodegas");
}