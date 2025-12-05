import { apiRequest } from '@api/apiClient';
import type { Boleta } from '@models/sales';

export const adminGetBoletas = async (): Promise<Boleta[]> => {
    return apiRequest<Boleta[]>('/boletas', { method: 'GET' });
};

export const adminCreateBoleta = async (data: Partial<Boleta>) => {
    return apiRequest<Boleta>('/boletas', { method: 'POST', body: data });
};

export const adminGetBoletaById = async (id: string | number) => {
    return apiRequest<Boleta>(`/boletas/${id}`, { method: 'GET' });
};

export const adminUpdateBoleta = async (id: string | number, data: Partial<Boleta>) => {
    return apiRequest<Boleta>(`/boletas/${id}`, { method: 'PUT', body: data });
};

export const adminDeleteBoleta = async (id: string | number) => {
    return apiRequest<void>(`/boletas/${id}`, { method: 'DELETE' });
};

// Anular boleta (usa el endpoint específico del backend)
export const adminAnularBoleta = async (id: string | number) => {
    return apiRequest<{ message: string }>(`/boletas/anular/${id}`, { method: 'PUT' });
};

export default {
    adminGetBoletas,
    adminGetBoletaById,
    adminCreateBoleta,
    adminUpdateBoleta,
    adminDeleteBoleta,
};
