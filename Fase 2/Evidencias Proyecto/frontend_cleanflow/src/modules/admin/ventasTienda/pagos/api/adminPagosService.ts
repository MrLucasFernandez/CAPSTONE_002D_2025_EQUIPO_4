import { apiRequest } from '@api/apiClient';
import type { Pago } from '@models/sales';

export const adminGetPagos = async (): Promise<Pago[]> => {
    return apiRequest<Pago[]>('/pagos', { method: 'GET' });
};

export default {
    adminGetPagos,
};
