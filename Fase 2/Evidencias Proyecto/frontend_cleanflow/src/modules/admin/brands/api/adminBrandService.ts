import type { Marca } from "@models/product";

const BASE_URL = import.meta.env.VITE_API_URL;

// Generic API helper
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
        ...options,
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // allow empty response
    }

    if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}`);
    }

    return data;
}

// GET all brands
export const fetchBrands = (): Promise<Marca[]> => {
    return apiRequest("/marcas");
};

// CREATE brand
export const createBrand = (body: {
    nombreMarca: string;
    descripcionMarca: string | null;
    }) => {
    return apiRequest(`/marcas`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
};

// UPDATE brand
export const updateBrand = (
    id: number,
    body: {
        nombreMarca: string;
        descripcionMarca: string | null;
    }
    ) => {
    return apiRequest(`/marcas/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
};

// DELETE brand
export const deleteBrand = (id: number) => {
    return apiRequest(`/marcas/${id}`, {
        method: "DELETE",
    });
};