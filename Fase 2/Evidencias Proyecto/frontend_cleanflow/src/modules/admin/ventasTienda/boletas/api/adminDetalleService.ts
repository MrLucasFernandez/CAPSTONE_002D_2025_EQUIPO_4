import { apiRequest } from '@api/apiClient';

export interface DetalleBoletaResponse {
  idDetalle: number;
  idBoleta: {
    idBoleta: number;
    fecha: string;
    estadoBoleta: string;
    subtotalBoleta: number;
    impuesto: number;
    totalBoleta: number;
  };
  idProducto: {
    idProducto: number;
    nombreProducto: string;
    sku: string;
    [key: string]: any;
  };
  cantidad: number;
  precioUnitario: number;
}

export const adminGetDetalleById = async (id: number): Promise<DetalleBoletaResponse> => {
  return apiRequest<DetalleBoletaResponse>(`/detalle/${id}`, { method: 'GET' });
};
