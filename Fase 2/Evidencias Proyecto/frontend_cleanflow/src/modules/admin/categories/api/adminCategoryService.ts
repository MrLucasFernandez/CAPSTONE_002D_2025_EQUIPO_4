import type { Categoria } from "@models/product";
const BASE_URL = import.meta.env.VITE_API_URL;

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
        ...options,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}`);
    }

    return data;
}

export const fetchCategories = () => apiRequest<Categoria[]>("/categorias");

export const createCategory = (body: {
    nombreCategoria: string;
    descripcionCategoria: string | null;
    }) =>
    apiRequest("/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
