const BASE_URL = import.meta.env.VITE_API_URL;

// Utilidad para descargar un blob como archivo
function downloadBlob(blob: Blob, filename: string) {
    if (blob.size === 0) {
        throw new Error('El archivo descargado está vacío');
    }
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.setAttribute('download', filename);
    
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

// Utilidad para descargar PDF desde un endpoint
async function downloadPdf(endpoint: string, body: any, filename: string) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: No se pudo generar el PDF`);
    }
    
    const blob = await res.blob();
    
    if (blob.size === 0) {
        throw new Error('El archivo generado está vacío');
    }
    
    downloadBlob(blob, filename);
}

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

// ==================== ENDPOINTS DE DATOS ====================

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

// ==================== DESCARGAR PDFs ====================

export const descargarResumenPdf = async (body: { desde?: string; hasta?: string } = {}) => {
    await downloadPdf('/reportes/resumen/pdf', body, 'resumen-ventas.pdf');
};

export const descargarTopUsuariosPdf = async (body: { desde?: string; hasta?: string } = {}) => {
    await downloadPdf('/reportes/top-usuarios/pdf', body, 'top-usuarios.pdf');
};

export const descargarTopProductosPdf = async (body: { desde?: string; hasta?: string } = {}) => {
    await downloadPdf('/reportes/top-productos/pdf', body, 'top-productos.pdf');
};

export const descargarVentasMensualesPdf = async (body: { anno: number }) => {
    await downloadPdf('/reportes/ventas-mensuales/pdf', body, `ventas-mensuales-${body.anno}.pdf`);
};

// ==================== ENVIAR POR CORREO ====================

export const enviarResumenPorCorreo = (body: { correo: string; desde?: string; hasta?: string }) => {
    return apiRequest<any>(`/reportes/resumen-detalle/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};

export const enviarTopUsuariosPorCorreo = (body: { correo: string; desde?: string; hasta?: string }) => {
    return apiRequest<any>(`/reportes/top-usuarios/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};

export const enviarTopProductosPorCorreo = (body: { correo: string; desde?: string; hasta?: string }) => {
    return apiRequest<any>(`/reportes/top-productos/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};

export const enviarVentasMensualesPorCorreo = (body: { correo: string; anno: number }) => {
    return apiRequest<any>(`/reportes/ventas-mensuales/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};

// ==================== EXPORTACIÓN DEFAULT ====================

export default {
    // Datos
    resumen,
    resumenDetalle,
    topUsuarios,
    topProductos,
    ventasMensuales,
    // Descargar PDFs
    descargarResumenPdf,
    descargarTopUsuariosPdf,
    descargarTopProductosPdf,
    descargarVentasMensualesPdf,
    // Enviar por correo
    enviarResumenPorCorreo,
    enviarTopUsuariosPorCorreo,
    enviarTopProductosPorCorreo,
    enviarVentasMensualesPorCorreo,
};
