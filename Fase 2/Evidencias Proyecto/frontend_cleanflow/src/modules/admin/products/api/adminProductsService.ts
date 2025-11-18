import type { Producto, Categoria, Marca } from "../../../../types/product";

const BASE_URL = import.meta.env.VITE_API_URL;

// Helper Fetch
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
        ...options,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Error ${res.status}`);
    }

    return res.json();
}

// Categorías
export async function fetchCategories(): Promise<Categoria[]> {
    return apiRequest("/categorias");
}

// Marcas
export async function fetchBrands(): Promise<Marca[]> {
    return apiRequest("/marcas");
}

// Productos
export async function getAllAdminProducts(): Promise<Producto[]> {
    return apiRequest("/productos");
}

export async function getAdminProductById(id: number): Promise<Producto> {
    return apiRequest(`/productos/${id}`);
}

// Crear
export async function createAdminProduct(formData: FormData): Promise<Producto> {
    return apiRequest("/productos", {
        method: "POST",
        body: formData,
    });
}

// Actualizar
export async function updateAdminProduct(id: number, formData: FormData): Promise<Producto> {
    return apiRequest(`/productos/${id}`, {
        method: "PUT",
        body: formData,
    });
}

// Eliminar
export async function deleteAdminProduct(id: number): Promise<{ message: string }> {
    return apiRequest(`/productos/${id}`, { method: "DELETE" });
}

// Subir Imagen → Backend → Cloudinary
export async function uploadProductImage(
    file: File
    ): Promise<{ url: string; publicId: string }> {
    const fd = new FormData();
        fd.append("file", file);

    return apiRequest("/productos/upload-image", {
        method: "POST",
        body: fd,
    });
}
