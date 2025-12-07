const BASE_URL = import.meta.env.VITE_API_URL;

// Utilidad para descargar un blob como archivo
function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}
// Exportar PDF de resumen de ventas
export const exportarResumenPdf = async (body: any = {}, filename = 'resumen_ventas.pdf') => {
    const res = await fetch(`${BASE_URL}/reportes/resumen/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('No se pudo exportar el PDF');
    const blob = await res.blob();
    downloadBlob(blob, filename);
};

// Puedes agregar más funciones similares para otros endpoints PDF si los tienes en el backend

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
