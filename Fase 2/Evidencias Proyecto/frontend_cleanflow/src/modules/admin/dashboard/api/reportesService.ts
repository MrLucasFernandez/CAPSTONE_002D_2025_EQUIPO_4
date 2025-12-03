const BASE_URL = import.meta.env.VITE_API_URL;

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

export const resumen = (body: any) => {
    return apiRequest<any>(`/reportes/resumen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};

export const resumenDetalle = (body: any) => {
    return apiRequest<any>(`/reportes/resumen-detalle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};

export const topUsuarios = (body: any) => {
    return apiRequest<any>(`/reportes/top-usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};

export const topProductos = (body: any) => {
    return apiRequest<any>(`/reportes/top-productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};

export const ventasMensuales = (body: any) => {
    return apiRequest<any>(`/reportes/ventas-mensuales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};

export default {
    resumen,
    resumenDetalle,
    topUsuarios,
    topProductos,
    ventasMensuales,
};
